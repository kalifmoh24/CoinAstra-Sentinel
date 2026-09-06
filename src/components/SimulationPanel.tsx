import type { Finding, TxSimulation } from "@/lib/types";

export function SimulationPanel({
  simulation,
  findings,
  demo,
}: {
  simulation?: TxSimulation | null;
  findings: Finding[];
  demo?: boolean;
}) {
  const related = findings.filter((f) => f.id.startsWith("sim-"));
  const sim = simulation;

  return (
    <div className="overflow-x-hidden rounded-2xl border border-white/10 bg-ink-900/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-medium text-white">Transaction simulation</h2>
        {(demo || sim?.demo) && (
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-300">
            DEMO
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Analysis only — Sentinel never signs or broadcasts. Missing eth_call/trace data is Insufficient data,
        never invented receive amounts or gas.
      </p>

      {!sim ? (
        <p className="mt-4 text-sm text-slate-400">Simulation not run for this result.</p>
      ) : (
        <>
          <p className="mt-4 text-sm text-slate-300">
            Status:{" "}
            <span className="font-medium text-white">{sim.status}</span>
            {sim.gasUsedEstimate == null ? (
              <span className="ml-2 text-xs text-slate-500">Gas: Insufficient data</span>
            ) : (
              <span className="ml-2 text-xs text-slate-400">Gas: {sim.gasUsedEstimate}</span>
            )}
          </p>

          {sim.status === "insufficient_data" || sim.status === "unavailable" ? (
            <p className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-3 text-sm text-amber-100/90">
              {sim.evidence[0]?.reason ??
                "No simulator backend — outcomes unknown, not cleared."}
            </p>
          ) : null}

          {sim.steps && sim.steps.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">Steps</h3>
              <ul className="mt-2 space-y-2">
                {sim.steps.map((s) => (
                  <li key={s.index} className="rounded-xl border border-white/5 bg-ink-950/50 p-3 text-sm">
                    <span className="font-medium text-white">
                      #{s.index} {s.op}
                    </span>{" "}
                    <span className="text-xs text-slate-500">{s.status}</span>
                    {s.to && (
                      <p className="mt-1 break-all font-mono text-[11px] text-slate-500">to {s.to}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sim.approvalDeltas && sim.approvalDeltas.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">Approval deltas</h3>
              <ul className="mt-2 space-y-2">
                {sim.approvalDeltas.map((a, i) => (
                  <li key={`${a.token}-${a.spender}-${i}`} className="rounded-xl border border-white/5 bg-ink-950/50 p-3 text-sm">
                    <span className="text-white">{a.change}</span>
                    {a.unlimited && (
                      <span className="ml-2 text-[10px] font-semibold uppercase text-risk-high">Unlimited</span>
                    )}
                    <p className="mt-1 break-all font-mono text-[11px] text-slate-500">
                      {a.token} → {a.spender}
                    </p>
                    <p className="text-xs text-slate-400">
                      After: {a.allowanceAfter === null ? "Insufficient data" : a.allowanceAfter}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sim.assetDeltas && sim.assetDeltas.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">Asset deltas</h3>
              <ul className="mt-2 space-y-2">
                {sim.assetDeltas.map((d, i) => (
                  <li key={`${d.token}-${i}`} className="rounded-xl border border-white/5 bg-ink-950/50 p-3 text-sm">
                    <span className="text-white">{d.direction}</span> {d.symbol ?? d.token}
                    <span className="ml-2 text-slate-300">
                      {d.amount === null ? "Insufficient data" : d.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
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
