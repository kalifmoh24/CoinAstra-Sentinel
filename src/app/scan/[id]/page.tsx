import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { ScanResult } from "@/lib/types";
import { ScanResultView } from "@/components/ScanResultView";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ScanPage({ params }: Props) {
  const { id } = await params;
  const scan = await prisma.scan.findUnique({ where: { id } });
  if (!scan) notFound();

  let result: ScanResult;
  try {
    result = JSON.parse(scan.resultJson) as ScanResult;
  } catch {
    notFound();
  }

  return (
    <>
      <div className="border-b border-white/5 bg-ink-900/30">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 text-sm sm:px-6">
          <Link href="/" className="min-h-[40px] inline-flex items-center text-accent-cyan hover:underline">
            ← New scan
          </Link>
          <span className="text-slate-600">/</span>
          <span className="font-mono text-slate-400">{id}</span>
        </div>
      </div>
      <ScanResultView result={result} />
    </>
  );
}
