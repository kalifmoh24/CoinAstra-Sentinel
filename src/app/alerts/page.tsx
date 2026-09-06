import type { Metadata } from "next";
import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { DEMO_ALERTS, type AlertSeverity } from "@/lib/demo/monitor";

export const metadata: Metadata = {
  title: "Alerts — CoinAstra Sentinel",
  description:
    "Monitoring alerts for watched wallets, tokens, and contracts. DEMO fixtures are labeled. No price signals.",
};

const SEVERITY_CLASS: Record<AlertSeverity, string> = {
  critical: "border-accent-rose/40 bg-accent-rose/10 text-accent-rose",
  high: "border-accent-orange/40 bg-accent-orange/10 text-accent-orange",
  moderate: "border-accent-amber/40 bg-accent-amber/10 text-accent-amber",
  info: "border-white/15 bg-ink-800 text-slate-400",
};

export default function AlertsPage() {
  return (
    <div className="mx-auto max-w-5xl overflow-x-hidden px-4 pb-36 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
      <p className="text-sm font-medium text-accent-purple">Sentinel monitor</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Alerts</h1>
        <span className="rounded-full border border-accent-amber/40 bg-accent-amber/10 px-2.5 py-1 text-xs font-medium text-accent-amber">
          DEMO
        </span>
        <span className="rounded-full border border-accent-purple/40 bg-accent-purple/10 px-2.5 py-1 text-xs font-medium text-accent-purple">
          Beta
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">
        Risk-change and allowance alerts for items on your watchlist. These events are{" "}
        <strong className="font-medium text-slate-200">DEMO fixtures</strong> — not a live mempool
        subscription. Missing live inventory is an alert, not an all-clear.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/watchlist"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-white/10 px-4 text-sm text-slate-200 hover:border-accent/40"
        >
          Open Watchlist
        </Link>
        <Link
          href="/approval-checker"
          className="inline-flex min-h-[44px] items-center rounded-xl bg-accent/90 px-4 text-sm font-semibold text-white hover:bg-accent"
        >
          Approval Checker
        </Link>
      </div>

      <ul className="mt-8 space-y-3">
        {DEMO_ALERTS.map((alert) => (
          <li key={alert.id} className="card-surface p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${SEVERITY_CLASS[alert.severity]}`}>
                {alert.severity}
              </span>
              <span className="rounded-full border border-accent-amber/30 px-2 py-0.5 text-[11px] font-medium text-accent-amber">
                DEMO
              </span>
              <span className="text-xs text-slate-500">{alert.age}</span>
              <span className="text-xs text-slate-500">{alert.subjectType}</span>
            </div>
            <h2 className="mt-2 text-base font-semibold text-white">{alert.title}</h2>
            <p className="mt-1 font-mono text-xs text-slate-500">{alert.subject}</p>
            <dl className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-500">Why</dt>
                <dd className="mt-0.5">{alert.why}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-500">Evidence</dt>
                <dd className="mt-0.5">{alert.evidence}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[11px] uppercase tracking-wide text-slate-500">Recommendation</dt>
                <dd className="mt-0.5">{alert.recommendation}</dd>
              </div>
            </dl>
            <Link
              href={alert.href}
              className="mt-4 inline-flex min-h-[40px] items-center text-sm font-medium text-accent-purple hover:underline"
            >
              Investigate →
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-slate-500">
        Live monitoring (push on score change) ships after Postgres watch rules. Until then this
        surface is evidence-shaped DEMO only — no invented prices or trade signals.
      </p>
      <div className="mt-6">
        <Disclaimer />
      </div>
    </div>
  );
}
