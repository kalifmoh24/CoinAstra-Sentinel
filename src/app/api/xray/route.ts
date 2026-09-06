import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isDemoMode } from "@/lib/db";
import { isEvmAddress, normalizeInput } from "@/lib/detect";
import { runXRay } from "@/lib/engine/xray";

const BodySchema = z.object({
  input: z.string().min(1).max(128),
  chain: z.string().default("ethereum"),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }
    const input = normalizeInput(parsed.data.input);
    if (!isEvmAddress(input)) {
      return NextResponse.json(
        { error: "X-Ray expects an EVM token/contract address (0x + 40 hex)." },
        { status: 400 },
      );
    }
    const chain = parsed.data.chain || "ethereum";
    const demo = isDemoMode();
    const profile = runXRay(input, chain, demo);
    return NextResponse.json({ profile, demo });
  } catch (err) {
    console.error("xray error", err);
    return NextResponse.json({ error: "X-Ray failed" }, { status: 500 });
  }
}
