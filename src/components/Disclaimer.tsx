import { DISCLAIMER } from "@/lib/types";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="rounded-lg border border-amber-400/15 bg-ink-900/50 px-3 py-2.5 text-xs leading-relaxed text-slate-400">
        <span className="font-medium text-slate-300">Not advice. </span>
        Scores are analytical assessments from available evidence — not financial, legal, or
        security guarantees. Always verify independently before you sign.
      </p>
    );
  }

  return (
    <p className="rounded-lg border border-white/5 bg-ink-900/60 p-4 text-xs leading-relaxed text-slate-400">
      {DISCLAIMER}
    </p>
  );
}
