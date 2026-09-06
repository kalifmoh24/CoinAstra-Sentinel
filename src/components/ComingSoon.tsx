import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { SHELL_NAV, type ShellNavItem } from "@/lib/shell-nav";

export function ComingSoon({ id }: { id: string }) {
  const item = SHELL_NAV.find((i) => i.id === id) as ShellNavItem | undefined;

  if (!item) {
    return (
      <div className="mx-auto max-w-2xl overflow-x-hidden px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-white">Coming soon</h1>
        <p className="mt-3 text-slate-400">This page is not live yet.</p>
        <Link href="/" className="mt-8 inline-flex min-h-[44px] items-center text-accent-cyan hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl overflow-x-hidden px-4 pb-28 pt-12 sm:px-6 sm:pb-16 sm:pt-16">
      <div className="inline-flex min-h-[44px] items-center rounded-full border border-accent-amber/30 bg-accent-amber/10 px-3 text-xs font-medium text-accent-amber">
        Coming soon
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{item.label}</h1>
      <p className="mt-3 text-base text-slate-400">{item.description}</p>
      <p className="mt-6 rounded-xl border border-white/5 bg-ink-900/50 p-4 text-sm leading-relaxed text-slate-400">
        This CoinAstra surface is on the roadmap and is <span className="text-slate-200">not live yet</span>.
        No placeholder markets, prices, scores, or AI claims are shown here.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center rounded-lg bg-accent/90 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent"
        >
          Back to Dashboard
        </Link>
        <Link
          href="/scan/wallet"
          className="inline-flex min-h-[44px] items-center rounded-lg border border-white/10 bg-ink-900/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white"
        >
          Open Wallet Scanner
        </Link>
      </div>
      <div className="mt-10">
        <Disclaimer compact />
      </div>
    </div>
  );
}
