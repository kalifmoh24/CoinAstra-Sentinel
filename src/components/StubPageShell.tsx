import Link from "next/link";
import type { NavItem } from "@/lib/nav";
import { statusLabel } from "@/lib/nav";
import { Disclaimer } from "./Disclaimer";

export function StubPageShell({ item }: { item: NavItem }) {
  const badge = statusLabel(item.status);
  const badgeClass =
    item.status === "live"
      ? "border-accent-emerald/40 bg-accent-emerald/10 text-accent-emerald"
      : item.status === "beta"
        ? "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan"
        : "border-white/15 bg-ink-800/80 text-slate-400";

  return (
    <div className="mx-auto max-w-3xl overflow-x-hidden px-4 pb-36 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
      <p className="text-sm font-medium text-accent-cyan">CoinAstra platform</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{item.label}</h1>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass}`}>{badge}</span>
      </div>
      <p className="mt-3 text-base text-slate-400">{item.description}</p>
      <p className="mt-4 text-sm text-slate-500">
        Sentinel is the security engine behind CoinAstra — deterministic risk scoring with evidence-backed
        explanation. This surface is scaffolding only; no invented prices, predictions, or signal spam.
      </p>

      <div className="mt-8 rounded-2xl border border-white/5 bg-ink-900/50 p-6">
        <h2 className="text-sm font-semibold text-slate-200">What you can do today</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          <li className="flex gap-2">
            <span className="text-accent-cyan">•</span>
            <span>
              Run live scanners:{" "}
              <Link href="/scan/wallet" className="text-accent-cyan hover:underline">
                Wallet
              </Link>
              ,{" "}
              <Link href="/scan/token" className="text-accent-cyan hover:underline">
                Token
              </Link>
              ,{" "}
              <Link href="/scan/contract" className="text-accent-cyan hover:underline">
                Contract
              </Link>
              ,{" "}
              <Link href="/scan/transaction" className="text-accent-cyan hover:underline">
                Transaction Preview
              </Link>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent-cyan">•</span>
            <span>DEMO fixtures stay labeled DEMO. Missing data surfaces as Insufficient data.</span>
          </li>
        </ul>
        {item.relatedHref && item.relatedLabel ? (
          <Link
            href={item.relatedHref}
            className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-accent/90 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent"
          >
            Open {item.relatedLabel}
          </Link>
        ) : (
          <Link
            href="/"
            className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-accent/90 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent"
          >
            Go to homepage search
          </Link>
        )}
      </div>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
