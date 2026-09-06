import Link from "next/link";

const CARDS = [
  {
    href: "/scan/wallet",
    title: "Wallet scanner",
    desc: "Age, activity, funding risk, mixer heuristics.",
    badge: "EOA",
  },
  {
    href: "/scan/token",
    title: "Token scanner",
    desc: "Verification, liquidity, holders, privileges.",
    badge: "ERC-20",
  },
  {
    href: "/scan/contract",
    title: "Contract scanner",
    desc: "Proxy, mint/pause/blacklist, honeypot hooks.",
    badge: "ABI",
  },
  {
    href: "/scan/transaction",
    title: "Transaction preview",
    desc: "Method & value analysis — never executes.",
    badge: "Preview",
  },
];

export function QuickScanLinks() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent-purple">Quick start</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
            Dedicated scanners
          </h2>
        </div>
        <p className="hidden text-xs text-slate-500 sm:block">Or use universal search above</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group min-h-[108px] rounded-2xl border border-white/5 bg-ink-900/50 p-4 shadow-glow transition hover:border-accent/40 hover:bg-ink-900/80 active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white group-hover:text-accent-purple">{c.title}</h3>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-500">
                {c.badge}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
