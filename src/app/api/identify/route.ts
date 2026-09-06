import { NextRequest, NextResponse } from "next/server";
import { identifyInput } from "@/lib/services/identify";

export async function POST(req: NextRequest) {
  try {
    const json = (await req.json()) as { input?: string; chain?: string };
    const input = typeof json.input === "string" ? json.input : "";
    const chain = typeof json.chain === "string" ? json.chain : "ethereum";
    const result = await identifyInput(input, chain);
    return NextResponse.json(result);
  } catch (err) {
    console.error("identify error", err);
    return NextResponse.json(
      {
        kind: "unknown",
        status: "Unable to identify this address or transaction.",
        next: "none",
        href: "/dashboard",
        error: "Identify failed",
      },
      { status: 500 },
    );
  }
}
