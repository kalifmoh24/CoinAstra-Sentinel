import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-cyan text-xs font-bold text-ink-950">
              CA
            </span>
            <span className="font-semibold tracking-tight">
              CoinAstra{" "}
              <span className="text-slate-400 group-hover:text-accent-cyan transition-colors">
                Sentinel
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-slate-400 sm:flex">
            <Link href="/" className="hover:text-white transition-colors">
              Sentinel
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="hidden rounded-full border border-white/10 bg-ink-800/80 px-2.5 py-1 sm:inline">
            coinastra.io
          </span>
          <Link
            href="/pricing"
            className="rounded-md bg-accent/90 px-3 py-1.5 font-medium text-white hover:bg-accent transition-colors sm:hidden"
          >
            Pricing
          </Link>
        </div>
      </div>
    </header>
  );
}
