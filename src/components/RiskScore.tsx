import type { RiskBand } from "@/lib/types";
import { bandBg, bandColor } from "@/lib/utils";

export function RiskScore({
  score,
  band,
  demo,
}: {
  score: number;
  band: RiskBand;
  demo?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className={`rounded-2xl border p-6 ${bandBg(band)}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Risk score</p>
          <p className={`mt-1 text-5xl font-semibold tabular-nums ${bandColor(band)}`}>{score}</p>
          <p className={`mt-1 text-lg font-medium ${bandColor(band)}`}>{band}</p>
        </div>
        <div className="text-right">
          {demo && (
            <span className="inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
              DEMO
            </span>
          )}
          <p className="mt-3 text-xs text-slate-500">0–100 analytical band</p>
        </div>
      </div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-ink-950/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-emerald via-accent-amber to-accent-rose transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
