import type { ScanResult } from "@/lib/types";

export function WalletMetrics({ result }: { result: ScanResult }) {
  const m = result.walletMeta;
  if (!m) return null;

  const age =
    m.firstSeen != null
      ? (() => {
          const yrs =
            (Date.now() - new Date(m.firstSeen).getTime()) / (365.25 * 24 * 3600 * 1000);
          return yrs >= 1 ? `${yrs.toFixed(1)} yrs` : `${Math.max(1, Math.round(yrs * 12))} mo`;
        })()
      : "—";

  /** Illustrative DEMO cells only when live evidence is missing — always labeled. */
  const cells = [
    { label: "Wallet Age", value: age, demo: false },
    {
      label: "Tx Count",
      value: m.txCount != null ? m.txCount.toLocaleString() : "—",
      demo: false,
    },
    {
      label: "Total Received",
      value: result.demo ? "$1.24M" : "—",
      demo: result.demo === true,
    },
    {
      label: "Total Sent",
      value: result.demo ? "$1.18M" : "—",
      demo: result.demo === true,
    },
    {
      label: "Current Balance",
      value:
        m.balanceEth != null
          ? `${m.balanceEth} ETH`
          : result.demo
            ? "$54,230.12"
            : "—",
      demo: m.balanceEth == null && result.demo === true,
    },
    {
      label: "Tokens Held",
      value: result.demo ? "27" : "—",
      demo: result.demo === true,
    },
  ];

  return (
    <div className="card-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-300">Wallet metrics</h2>
        {result.demo && (
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-300">
            DEMO
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {cells.map((c) => (
          <div key={c.label} className="rounded-xl border border-white/5 bg-ink-950/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              {c.label}
              {c.demo ? <span className="ml-1 text-amber-300/80">DEMO</span> : null}
            </p>
            <p className="mt-1 truncate text-sm font-medium text-white">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
