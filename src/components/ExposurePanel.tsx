import type { Finding, WalletHolding } from "@/lib/types";

export function ExposurePanel({
  holdings,
  findings,
  demo,
}: {
  holdings?: WalletHolding[] | null;
  findings: Finding[];
  demo?: boolean;
}) {
  const related = findings.filter((f) => f.id.startsWith("exposure-"));

  return (
    <div className="overflow-x-hidden rounded-2xl border border-white/10 bg-ink-900/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-medium text-white">Exposure &amp; holdings</h2>
        {demo && (
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-300">
            DEMO
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Holdings and approval-driven exposure from structured provider data. Balances are never invented.
      </p>

      {holdings === null || holdings === undefined ? (
        <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-3 text-sm text-amber-100/90">
          Insufficient data: no holdings inventory. Concentration cannot be assessed.
        </p>
      ) : holdings.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">Provider returned an empty holdings set.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {holdings.map((h) => (
            <li key={h.token} className="rounded-xl border border-white/5 bg-ink-950/50 p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-white">
                  {h.symbol ?? "Token"}{" "}
                  {h.demo && <span className="text-[10px] font-semibold uppercase text-amber-300">DEMO</span>}
                </p>
                <p className="font-mono text-sm text-slate-200">
                  {h.balance === null ? "Insufficient data" : h.balance}
                </p>
              </div>
              <p className="mt-1 break-all font-mono text-[11px] text-slate-500">{h.token}</p>
              {h.evidence?.[0] && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Evidence: {h.evidence[0].reason} · {h.evidence[0].source}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {related.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-white/5 pt-4">
          {related.map((f) => (
            <li key={f.id} className="text-sm">
              <span className="font-medium text-white">{f.title}</span>
              <span className="mt-0.5 block text-xs text-slate-400">{f.description}</span>
              {f.recommendation && (
                <span className="mt-1 block text-xs text-accent-purple">{f.recommendation}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
