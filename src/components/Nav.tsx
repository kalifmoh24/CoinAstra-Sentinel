import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-5">
          <Link href="/" className="group flex min-h-[44px] items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-cyan text-xs font-bold text-ink-950">
              CA
            </span>
            <span className="font-semibold tracking-tight">
              CoinAstra{" "}
              <span className="text-slate-400 transition-colors group-hover:text-accent-cyan">
                Sentinel
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm text-slate-400 md:flex">
            <Link href="/scan/wallet" className="inline-flex min-h-[44px] items-center rounded-lg px-2.5 py-2 hover:bg-white/5 hover:text-white">
              Wallet
            </Link>
            <Link href="/scan/token" className="inline-flex min-h-[44px] items-center rounded-lg px-2.5 py-2 hover:bg-white/5 hover:text-white">
              Token
            </Link>
            <Link href="/scan/contract" className="inline-flex min-h-[44px] items-center rounded-lg px-2.5 py-2 hover:bg-white/5 hover:text-white">
              Contract
            </Link>
            <Link
              href="/scan/transaction"
              className="inline-flex min-h-[44px] items-center rounded-lg px-2.5 py-2 hover:bg-white/5 hover:text-white"
            >
              Tx
            </Link>
            <Link href="/pricing" className="inline-flex min-h-[44px] items-center rounded-lg px-2.5 py-2 hover:bg-white/5 hover:text-white">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="hidden rounded-full border border-white/10 bg-ink-800/80 px-2.5 py-1 lg:inline">
            coinastra.io
          </span>
          <Link
            href="/pricing"
            className="inline-flex min-h-[44px] items-center rounded-md bg-accent/90 px-3 py-2 font-medium text-white transition-colors hover:bg-accent md:hidden"
          >
            Pricing
          </Link>
        </div>
      </div>
    </header>
  );
}
