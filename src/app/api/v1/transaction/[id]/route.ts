import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const scan = await prisma.scan.findFirst({
    where: {
      OR: [{ id }, { input: { equals: id } }],
      inputType: "transaction",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!scan) {
    return NextResponse.json(
      {
        error: "Not found",
        stub: true,
        message: "Phase 1 stub — run POST /api/scan first. Full multi-chain API comes later.",
        id,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    stub: true,
    id: scan.id,
    input: scan.input,
    inputType: scan.inputType,
    score: scan.score,
    band: scan.band,
    demo: scan.demo,
    result: JSON.parse(scan.resultJson),
  });
}
