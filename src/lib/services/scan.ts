import { prisma, isDemoMode } from "@/lib/db";
import { detectInputType, isEvmAddress, isTxHash, normalizeInput } from "@/lib/detect";
import {
  blockchainProvider,
  contractAnalysisProvider,
  marketProvider,
  securityProvider,
} from "@/lib/providers";
import { runRiskEngine } from "@/lib/engine";
import { explainFindings } from "@/lib/ai/explain";
import { recordScanAlerts } from "@/lib/live/watch";
import { type InputType, type ScanResult } from "@/lib/types";
import { RISK_ENGINE_VERSION } from "@/lib/engine/version";
import { normalizeChain } from "@/lib/live/rpc";

export type ScanType = "wallet" | "token" | "contract" | "transaction" | "auto";

export class ScanRequestError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "ScanRequestError";
  }
}

function newScanId() {
  return `tmp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

const memoryScans = new Map<string, ScanResult>();

function rememberScan(result: ScanResult) {
  memoryScans.set(result.id, result);
  if (memoryScans.size > 50) {
    const first = memoryScans.keys().next().value;
    if (first) memoryScans.delete(first);
  }
}

export async function runScan(opts: {
  input: string;
  chain?: string;
  type?: ScanType;
  ownerKey?: string;
  clientIp?: string | null;
  userAgent?: string | null;
}): Promise<ScanResult> {
  const input = normalizeInput(opts.input);
  const chain = normalizeChain(opts.chain || "ethereum");
  const requestedType: ScanType = opts.type ?? "auto";

  console.info("[SCAN_REQUEST]", { input, chain, type: requestedType });

  let inputType: InputType = detectInputType(input);
  if (requestedType === "transaction") {
    if (!isTxHash(input)) {
      throw new ScanRequestError("Transaction scanner expects a 66-character tx hash (0x + 64 hex).");
    }
    inputType = "transaction";
  } else if (requestedType === "wallet" || requestedType === "token" || requestedType === "contract") {
    if (!isEvmAddress(input)) {
      throw new ScanRequestError(`${requestedType} scanner expects an EVM address (0x + 40 hex).`);
    }
    inputType = requestedType;
  } else if (inputType === "unknown") {
    throw new ScanRequestError(
      "Unrecognized input. Provide an EVM address (0x…40 hex) or transaction hash (0x…64 hex).",
    );
  }

  console.info("[CHAIN_DETECTION]", { chain, inputType });

  const demo = isDemoMode();
  let wallet = null;
  let contract = null;
  let token = null;
  let tx = null;
  let market = null;
  let security = null;

  try {
    if (inputType === "transaction" || (requestedType === "auto" && isTxHash(input))) {
      inputType = "transaction";
      tx = await blockchainProvider.getTransaction(input, chain);
      if (tx.to && isEvmAddress(tx.to)) {
        const hasCode = await blockchainProvider.hasCode(tx.to, chain);
        if (hasCode) contract = await contractAnalysisProvider.analyze(tx.to, chain);
        wallet = await blockchainProvider.getWallet(tx.from || tx.to, chain);
      }
    } else if (requestedType === "wallet") {
      inputType = "wallet";
      wallet = await blockchainProvider.getWallet(input, chain);
      security = await securityProvider.screenAddress(input);
    } else if (requestedType === "token") {
      inputType = "token";
      contract = await contractAnalysisProvider.analyze(input, chain);
      token = await contractAnalysisProvider.asToken(input, chain);
      try {
        market = await marketProvider.getTokenMarket(input);
      } catch (e) {
        console.warn("[CONTRACT_FETCH] market optional miss", String(e));
      }
    } else if (requestedType === "contract") {
      inputType = "contract";
      contract = await contractAnalysisProvider.analyze(input, chain);
      try {
        token = await contractAnalysisProvider.asToken(input, chain);
      } catch (e) {
        console.warn("[CONTRACT_FETCH] token meta optional miss", String(e));
      }
      try {
        market = await marketProvider.getTokenMarket(input);
      } catch (e) {
        console.warn("[CONTRACT_FETCH] market optional miss", String(e));
      }
    } else if (isEvmAddress(input)) {
      const hasCode = await blockchainProvider.hasCode(input, chain);
      console.info("[CONTRACT_FETCH]", { hasCode });
      if (hasCode) {
        inputType = "contract";
        contract = await contractAnalysisProvider.analyze(input, chain);
        try {
          token = await contractAnalysisProvider.asToken(input, chain);
        } catch (e) {
          console.warn("[CONTRACT_FETCH] token meta optional miss", String(e));
        }
        try {
          market = await marketProvider.getTokenMarket(input);
        } catch (e) {
          console.warn("[CONTRACT_FETCH] market optional miss", String(e));
        }
        if (token?.symbol) inputType = "token";
      } else {
        inputType = "wallet";
        wallet = await blockchainProvider.getWallet(input, chain);
        security = await securityProvider.screenAddress(input);
      }
    }
  } catch (e) {
    console.error("[SCAN_ERROR] provider", e);
    throw new ScanRequestError(
      "On-chain data unavailable. Set ETH_RPC_URL or ETHERSCAN_API_KEY in Vercel, then retry.",
      503,
    );
  }

  let scanId = newScanId();
  let createdAt = new Date().toISOString();
  try {
    const created = await prisma.scan.create({
      data: {
        input,
        inputType,
        chain,
        demo,
        score: 0,
        band: "Moderate",
        summaryJson: "{}",
        resultJson: "{}",
        clientIp: opts.clientIp ?? null,
        userAgent: opts.userAgent ?? null,
        ownerKey: opts.ownerKey ?? null,
      },
    });
    scanId = created.id;
    createdAt = created.createdAt.toISOString();
    console.info("[DATABASE]", { persisted: true, id: scanId });
  } catch (e) {
    console.warn("[DATABASE] persist skipped; scan continues in-memory", String(e));
  }

  console.info("[RISK_ENGINE]", { inputType, hasContract: Boolean(contract), hasWallet: Boolean(wallet) });
  const draft = runRiskEngine({
    id: scanId,
    input,
    inputType,
    chain,
    demo: demo || Boolean(wallet?.demo || contract?.demo || tx?.demo),
    wallet,
    contract,
    token,
    tx,
    market,
    security,
    aiExplanation: "",
    createdAt,
  });

  let aiExplanation = "";
  try {
    const { disclaimer: _d, aiExplanation: _a, ...forAi } = draft;
    aiExplanation = await explainFindings(forAi);
    console.info("[AI]", { used: Boolean(aiExplanation) });
  } catch (e) {
    console.warn("[AI] optional explanation failed", String(e));
    aiExplanation = "AI explanation unavailable. Risk score is from the deterministic engine only.";
  }

  const result: ScanResult = { ...draft, aiExplanation, engineVersion: RISK_ENGINE_VERSION };

  try {
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        score: result.score,
        band: result.band,
        demo: result.demo,
        summaryJson: JSON.stringify({
          score: result.score,
          band: result.band,
          inputType: result.inputType,
          engineVersion: RISK_ENGINE_VERSION,
        }),
        resultJson: JSON.stringify(result),
      },
    });
  } catch (e) {
    console.warn("[DATABASE] update skipped", String(e));
  }

  try {
    await recordScanAlerts({ ownerKey: opts.ownerKey ?? undefined, result });
  } catch (e) {
    console.warn("[DATABASE] alert persist skipped", String(e));
  }

  console.info("[SCAN_RESPONSE]", { id: result.id, score: result.score, sources: result.dataSources });
  rememberScan(result);
  return result;
}

export async function loadScan(id: string): Promise<ScanResult | null> {
  const cached = memoryScans.get(id);
  if (cached) return cached;
  try {
    const row = await prisma.scan.findUnique({ where: { id } });
    if (!row) return null;
    return JSON.parse(row.resultJson) as ScanResult;
  } catch {
    return cached ?? null;
  }
}

export async function loadLatestByInput(input: string, inputType?: string) {
  try {
    return await prisma.scan.findFirst({
      where: {
        OR: [{ id: input }, { input: { equals: input, mode: "insensitive" } }],
        ...(inputType ? { inputType } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return null;
  }
}
