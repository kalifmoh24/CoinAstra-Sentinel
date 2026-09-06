import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAndIncrementRateLimit, clientKeyFromRequest } from "@/lib/rate-limit";
import { runScan, ScanRequestError } from "@/lib/services/scan";

const BodySchema = z.object({
  input: z.string().min(1).max(128),
  chain: z.string().default("ethereum"),
  type: z.enum(["wallet", "token", "contract", "transaction", "auto"]).optional().default("auto"),
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

    const result = await runScan({
      input: parsed.data.input,
      chain: parsed.data.chain,
      type: parsed.data.type,
      ownerKey: rid,
      clientIp: ip,
      userAgent: req.headers.get("user-agent"),
    });

    const res = NextResponse.json({ id: result.id, result, remaining: rate.remaining });
    res.cookies.set("sentinel_rid", rid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  } catch (err) {
    if (err instanceof ScanRequestError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("scan error", err);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
