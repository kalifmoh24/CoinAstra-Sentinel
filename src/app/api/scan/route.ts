import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma, isDemoMode } from "@/lib/db";
import { detectInputType, isEvmAddress, isTxHash, normalizeInput } from "@/lib/detect";
import { checkAndIncrementRateLimit, clientKeyFromRequest } from "@/lib/rate-limit";
import {
  blockchainProvider,
  contractAnalysisProvider,
  marketProvider,
  securityProvider,
} from "@/lib/providers";
import { runRiskEngine } from "@/lib/engine";
import { explainFindings } from "@/lib/ai/explain";
import type { InputType, ScanResult } from "@/lib/types";

const BodySchema = z.object({
  input: z.string().min(1).max(128),
  chain: z.string().default("ethereum"),
});

function cookiesId(req: NextRequest): string | null {
  return req.cookies.get("sentinel_rid")?.value ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const input = normalizeInput(parsed.data.input);
    const chain = parsed.data.chain || "ethereum";

    let inputType: InputType = detectInputType(input);
    if (inputType === "unknown") {
      return NextResponse.json(
        { error: "Unrecognized input. Provide an EVM address (0x…40 hex) or transaction hash (0x…64 hex)." },
        { status: 400 },
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const rid = cookiesId(req) || crypto.randomUUID();
    const rateKey = clientKeyFromRequest(ip, rid);
    const rate = await checkAndIncrementRateLimit(rateKey);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "Free tier limit reached (5 scans/day). Upgrade on /pricing (stub) or try tomorrow.",
          limit: rate.limit,
          remaining: rate.remaining,
        },
        { status: 429 },
      );
    }

    const demo = isDemoMode();
    let wallet = null;
    let contract = null;
    let token = null;
    let tx = null;
    let market = null;
    let security = null;

    if (isTxHash(input)) {
      inputType = "transaction";
      tx = await blockchainProvider.getTransaction(input, chain);
      if (tx.to && isEvmAddress(tx.to)) {
        const hasCode = await blockchainProvider.hasCode(tx.to, chain);
        if (hasCode) {
          contract = await contractAnalysisProvider.analyze(tx.to, chain);
        }
        wallet = await blockchainProvider.getWallet(tx.from || tx.to, chain);
      }
    } else if (isEvmAddress(input)) {
      const hasCode = await blockchainProvider.hasCode(input, chain);
      if (hasCode) {
        inputType = "contract";
        contract = await contractAnalysisProvider.analyze(input, chain);
        token = await contractAnalysisProvider.asToken(input, chain);
        market = await marketProvider.getTokenMarket(input);
        // Also treat as token subject for UI
        if (token.symbol) inputType = "token";
      } else {
        inputType = "wallet";
        wallet = await blockchainProvider.getWallet(input, chain);
        security = await securityProvider.screenAddress(input);
      }
    }

    // Persist placeholder id first
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
        clientIp: ip,
        userAgent: req.headers.get("user-agent"),
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

    const result: ScanResult = { ...draft, aiExplanation };

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
        }),
        resultJson: JSON.stringify(result),
      },
    });

    const res = NextResponse.json({ id: created.id, result, remaining: rate.remaining });
    res.cookies.set("sentinel_rid", rid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  } catch (err) {
    console.error("scan error", err);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
