import Link from "next/link";

export default function ScanNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center overflow-x-hidden px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-ink-900/70 p-8 text-center shadow-glow">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-violet text-sm font-bold text-ink-950">
          CA
        </div>
        <p className="mt-6 text-xs uppercase tracking-wider text-accent-purple">Not found</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Scan result missing
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          We couldn’t find this scan id. It may have expired or never existed. Start a new scan from
          a dedicated scanner or the home search.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/scan/wallet"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-ink-800 px-5 text-sm font-medium text-white transition hover:border-accent/40"
          >
            Wallet scanner
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-violet px-5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:brightness-110"
          >
            Home search
          </Link>
        </div>
      </div>
    </div>
  );
}
