import type { ActivityRiskLevel, WalletActivityItem } from "@/lib/types";
import { shortAddr } from "@/lib/utils";

function riskClass(level?: ActivityRiskLevel) {
  switch (level) {
    case "critical":
      return "border-risk-critical/40 bg-risk-critical/10 text-risk-critical";
    case "high":
      return "border-risk-high/40 bg-risk-high/10 text-risk-high";
    case "moderate":
      return "border-risk-moderate/40 bg-risk-moderate/10 text-risk-moderate";
    case "low":
      return "border-risk-low/40 bg-risk-low/10 text-risk-low";
    case "info":
      return "border-white/10 bg-ink-800/50 text-slate-300";
    default:
      return "border-white/10 bg-ink-800/40 text-slate-400";
  }
}

function fmtAmount(amount?: string | null, asset?: string | null) {
  if (amount == null || amount === "") return "—";
  const n = Number(amount);
  const pretty = Number.isFinite(n)
    ? n === 0
      ? "0"
      : n < 0.0001
        ? n.toExponential(2)
        : n.toLocaleString(undefined, { maximumFractionDigits: 6 })
    : amount;
  return asset ? `${pretty} ${asset}` : pretty;
}

export function WalletActivityTimeline({
  activity,
  demo,
}: {
  activity: WalletActivityItem[];
  demo?: boolean;
}) {
  if (!activity.length) return null;

  return (
    <div className="overflow-x-hidden rounded-2xl border border-white/5 bg-ink-900/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-slate-300">Wallet activity</h2>
        {demo && (
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-300">
            DEMO
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Recent transactions from provider/demo history — risk labels are heuristic, not guarantees.
      </p>
      <ul className="mt-4 space-y-3">
        {activity.map((row, i) => (
          <li
            key={row.hash ?? `${row.date}-${i}`}
            className="min-w-0 overflow-hidden rounded-xl border border-white/5 bg-ink-950/40 p-3.5 sm:p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  {new Date(row.date).toLocaleString()}
                  {row.method ? (
                    <>
                      {" "}
                      · <span className="font-mono text-slate-400">{row.method}</span>
                    </>
                  ) : null}
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {fmtAmount(row.amount, row.asset)}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                {row.contractInteraction && (
                  <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-cyan">
                    Contract
                  </span>
                )}
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${riskClass(row.riskLevel)}`}
                >
                  {row.riskLevel ?? "unknown"}
                </span>
              </div>
            </div>
            <div className="mt-2 grid gap-1 font-mono text-[11px] leading-relaxed text-slate-500 sm:grid-cols-2">
              <p className="break-all [overflow-wrap:anywhere]">
                from: {row.from ? shortAddr(row.from, 5) : "—"}
              </p>
              <p className="break-all [overflow-wrap:anywhere]">
                to: {row.to ? shortAddr(row.to, 5) : "—"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
