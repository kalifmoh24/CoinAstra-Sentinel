import { NextRequest, NextResponse } from "next/server";
import { loadXray } from "@/lib/live/xray";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ error: "Enter a token name, symbol, or contract." }, { status: 400 });
  }
  try {
    const report = await loadXray(q);
    if (!report) {
      return NextResponse.json(
        { error: "Asset not found in public market data. Try a contract on Ethereum or a CoinGecko id." },
        { status: 404 },
      );
    }
    return NextResponse.json({ report });
  } catch (err) {
    console.error("xray", err);
    return NextResponse.json({ error: "X-Ray temporarily unavailable." }, { status: 503 });
  }
}
