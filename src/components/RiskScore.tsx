import type { CategoryScore, RiskBand } from "@/lib/types";
import { bandBg, bandColor } from "@/lib/utils";
import { RiskRadar } from "./RiskRadar";

export function RiskScore({
  score,
  band,
  demo,
  categories,
  compact,
}: {
  score: number;
  band: RiskBand;
  demo?: boolean;
  categories?: CategoryScore[];
  compact?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${bandBg(band)} shadow-glow`}>
      <div className={`flex flex-col gap-4 ${categories?.length ? "lg:flex-row lg:items-start" : ""}`}>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Sentinel Risk Score</p>
              <p className={`mt-1 text-5xl font-semibold tabular-nums ${bandColor(band)}`}>
                {score}
                <span className="text-2xl text-slate-500">/100</span>
              </p>
              <p
                className={`mt-2 inline-flex rounded-full border border-current/30 bg-black/20 px-2.5 py-0.5 text-sm font-semibold uppercase tracking-wide ${bandColor(band)}`}
              >
                {band} RISK
              </p>
            </div>
            {demo && (
              <span className="inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                DEMO
              </span>
            )}
          </div>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-400">
            Assessment based on available evidence — not a guarantee, and not financial or security
            advice.
          </p>
          {!compact && (
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-ink-950/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-emerald via-accent-amber to-accent-rose transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
        </div>
        {categories && categories.length > 0 && (
          <div className="shrink-0">
            <RiskRadar categories={categories} band={band} size={compact ? 160 : 200} />
          </div>
        )}
      </div>
    </div>
  );
}
