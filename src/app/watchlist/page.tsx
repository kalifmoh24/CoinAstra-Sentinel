import type { Metadata } from "next";
import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { DEMO_WATCHLIST } from "@/lib/demo/monitor";

export const metadata: Metadata = {
  title: "Watchlist — CoinAstra Sentinel",
  description:
    "Watched wallets, tokens, and contracts with last Sentinel score. DEMO fixtures labeled.",
};

function bandClass(band: string) {
  const b = band.toLowerCase();
  if (b.includes("critical")) return "text-accent-rose";
  if (b.includes("high")) return "text-accent-orange";
  if (b.includes("moderate")) return "text-accent-amber";
  return "text-accent-emerald";
}

export default function WatchlistPage() {
  return (
    <div className="mx-auto max-w-5xl overflow-x-hidden px-4 pb-36 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
      <p className="text-sm font-medium text-accent-purple">Sentinel monitor</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Watchlist</h1>
        <span className="rounded-full border border-accent-amber/40 bg-accent-amber/10 px-2.5 py-1 text-xs font-medium text-accent-amber">
          DEMO
        </span>
        <span className="rounded-full border border-accent-purple/40 bg-accent-purple/10 px-2.5 py-1 text-xs font-medium text-accent-purple">
          Beta
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">
        Saved subjects for re-scan. Scores come from the last DEMO engine pass — Sentinel never
        invents balances or live ticks. Add-to-watch persistence lands with Postgres watch rules.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/alerts"
          className="inline-flex min-h-[44px] items-center rounded-xl bg-accent/90 px-4 text-sm font-semibold text-white hover:bg-accent"
        >
          View alerts
        </Link>
        <Link
          href="/scan/wallet"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-white/10 px-4 text-sm text-slate-200 hover:border-accent/40"
        >
          Scan a wallet
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-white/5">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-ink-900/80 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Type</th>
              <th className="px-4 py-3 font-medium">Last score</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Note</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-ink-850/60">
            {DEMO_WATCHLIST.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{item.label}</div>
                  <div className="mt-0.5 max-w-[16rem] truncate font-mono text-xs text-slate-500">
                    {item.subject}
                  </div>
                  <span className="mt-1 inline-block rounded-full border border-accent-amber/30 px-1.5 py-px text-[10px] text-accent-amber">
                    DEMO
                  </span>
                </td>
                <td className="hidden px-4 py-3 capitalize text-slate-400 sm:table-cell">
                  {item.subjectType}
                  <div className="text-xs text-slate-600">{item.chain}</div>
                </td>
                <td className="px-4 py-3">
                  {item.lastScore == null ? (
                    <span className="text-slate-500">Insufficient data</span>
                  ) : (
                    <>
                      <span className="font-semibold text-white">{item.lastScore}/100</span>
                      <div className={`text-xs ${bandClass(item.lastBand)}`}>{item.lastBand}</div>
                    </>
                  )}
                </td>
                <td className="hidden px-4 py-3 text-slate-400 md:table-cell">{item.note}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={item.href} className="text-sm font-medium text-accent-purple hover:underline">
                    Re-scan
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-xs text-slate-500">
        Watching is DEMO state. Saving a scan to the watchlist requires DATABASE_URL plus a WatchItem
        table — not shipped in this pass.
      </p>
      <div className="mt-6">
        <Disclaimer />
      </div>
    </div>
  );
}
