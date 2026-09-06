"use client";

import Link from "next/link";

export default function ScanResultError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center overflow-x-hidden px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-md rounded-2xl border border-accent-rose/30 bg-ink-900/70 p-8 text-center shadow-glow">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-cyan text-sm font-bold text-ink-950">
          CA
        </div>
        <p className="mt-6 text-xs uppercase tracking-wider text-accent-rose">Scan error</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Couldn’t load this result
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Something went wrong while opening this scan. No new risk claims were made — try again or
          start a fresh scan.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-ink-800 px-5 text-sm font-medium text-white transition hover:border-white/20"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-accent to-sky-500 px-5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:brightness-110"
          >
            Back to search
          </Link>
        </div>
      </div>
    </div>
  );
}
