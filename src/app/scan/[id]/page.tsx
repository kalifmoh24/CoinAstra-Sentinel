import { notFound } from "next/navigation";
import { loadScan } from "@/lib/services/scan";
import { ScanResultView, scanTypeHref } from "@/components/ScanResultView";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ScanPage({ params }: Props) {
  const { id } = await params;
  const result = await loadScan(id);
  if (!result) notFound();

  const newScanHref = scanTypeHref(result.inputType);

  return (
    <>
      <div className="border-b border-white/5 bg-ink-900/30">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 overflow-x-hidden px-4 py-3 text-sm sm:px-6">
          <Link
            href={newScanHref}
            className="inline-flex min-h-[44px] items-center text-accent-purple hover:underline"
          >
            ← New scan
          </Link>
          <span className="text-slate-600">/</span>
          <span className="break-all font-mono text-slate-400 [overflow-wrap:anywhere]">{id}</span>
        </div>
      </div>
      <ScanResultView result={result} />
    </>
  );
}
