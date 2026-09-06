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
import { RISK_ENGINE_VERSION, type InputType, type ScanResult } from "@/lib/types";
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

  const demo = isDemoMode();
  let wallet = null;
  let contract = null;
  let token = null;
  let tx = null;
  let market = null;
  let security = null;

  if (inputType === "transaction" || (requestedType === "auto" && isTxHash(input))) {
    inputType = "transaction";
    tx = await blockchainProvider.getTransaction(input, chain);
    if (tx.to && isEvmAddress(tx.to)) {
      const hasCode = await blockchainProvider.hasCode(tx.to, chain);
      if (hasCode) {
        contract = await contractAnalysisProvider.analyze(tx.to, chain);
      }
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
    market = await marketProvider.getTokenMarket(input);
  } else if (requestedType === "contract") {
    inputType = "contract";
    contract = await contractAnalysisProvider.analyze(input, chain);
    token = await contractAnalysisProvider.asToken(input, chain);
    market = await marketProvider.getTokenMarket(input);
  } else if (isEvmAddress(input)) {
    const hasCode = await blockchainProvider.hasCode(input, chain);
    if (hasCode) {
      inputType = "contract";
      contract = await contractAnalysisProvider.analyze(input, chain);
      token = await contractAnalysisProvider.asToken(input, chain);
      market = await marketProvider.getTokenMarket(input);
      if (token.symbol) inputType = "token";
    } else {
      inputType = "wallet";
      wallet = await blockchainProvider.getWallet(input, chain);
      security = await securityProvider.screenAddress(input);
    }
  }

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

  const draft = runRiskEngine({
    id: created.id,
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
    createdAt: created.createdAt.toISOString(),
  });

  const { disclaimer: _d, aiExplanation: _a, ...forAi } = draft;
  const aiExplanation = await explainFindings(forAi);
  const result: ScanResult = { ...draft, aiExplanation, engineVersion: RISK_ENGINE_VERSION };

  await prisma.scan.update({
    where: { id: created.id },
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

  try {
    await recordScanAlerts({ ownerKey: opts.ownerKey ?? undefined, result });
  } catch (e) {
    console.warn("alert persist skipped", e);
  }

  return result;
}

export async function loadScan(id: string): Promise<ScanResult | null> {
  const row = await prisma.scan.findUnique({ where: { id } });
  if (!row) return null;
  try {
    return JSON.parse(row.resultJson) as ScanResult;
  } catch {
    return null;
  }
}

export async function loadLatestByInput(input: string, inputType?: string) {
  return prisma.scan.findFirst({
    where: {
      OR: [{ id: input }, { input: { equals: input, mode: "insensitive" } }],
      ...(inputType ? { inputType } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}
