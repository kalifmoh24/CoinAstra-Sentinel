import type { Finding, TokenApproval } from "@/lib/types";

export function ApprovalsPanel({
  approvals,
  findings,
  demo,
}: {
  approvals?: TokenApproval[] | null;
  findings: Finding[];
  demo?: boolean;
}) {
  const related = findings.filter((f) => f.id.startsWith("approval-"));

  return (
    <div className="overflow-x-hidden rounded-2xl border border-white/10 bg-ink-900/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-medium text-white">Token allowances</h2>
        {demo && (
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-300">
            DEMO
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Evidence-backed ERC-20 allowances only. Missing inventory is Insufficient data — never a clean bill of
        health. Sentinel does not broadcast revokes.
      </p>

      {approvals === null || approvals === undefined ? (
        <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-3 text-sm text-amber-100/90">
          Insufficient data: no allowance inventory from providers. Treat approval risk as unknown.
        </p>
      ) : approvals.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">Provider returned an empty allowance set.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {approvals.map((a) => (
            <li
              key={`${a.token}-${a.spender}-${a.lastSeen ?? ""}`}
              className="rounded-xl border border-white/5 bg-ink-950/50 p-3"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {a.demo && <span className="text-[10px] font-semibold uppercase text-amber-300">DEMO</span>}
                {a.unlimited && (
                  <span className="rounded-full bg-risk-high/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-risk-high">
                    Unlimited
                  </span>
                )}
              </div>
              <p className="mt-1 break-all font-mono text-xs text-slate-300">
                Token <span className="text-white">{a.token}</span>
              </p>
              <p className="mt-0.5 break-all font-mono text-xs text-slate-400">
                Spender <span className="text-slate-200">{a.spender}</span>
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Allowance:{" "}
                <span className="font-medium text-white">
                  {a.allowance === null ? "Insufficient data" : a.allowance}
                </span>
                {a.lastSeen ? (
                  <span className="ml-2 text-xs text-slate-500">last seen {a.lastSeen.slice(0, 10)}</span>
                ) : null}
              </p>
              {a.evidence?.[0] && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Evidence: {a.evidence[0].reason} · {a.evidence[0].source}
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
