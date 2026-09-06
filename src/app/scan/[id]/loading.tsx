export default function ScanResultLoading() {
  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-cyan text-sm font-bold text-ink-950 shadow-glow">
          CA
        </div>
        <p className="mt-6 text-xs uppercase tracking-wider text-accent-cyan">Loading scan</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Retrieving evidence…
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Pulling the stored result and structured findings. Scores remain analytical assessments —
          not guarantees.
        </p>
        <div className="mt-8 space-y-3">
          <div className="h-3 w-full animate-pulse rounded-full bg-ink-800" />
          <div className="mx-auto h-3 w-[80%] animate-pulse rounded-full bg-ink-800/80" />
          <div className="mx-auto h-3 w-[60%] animate-pulse rounded-full bg-ink-800/60" />
        </div>
      </div>
    </div>
  );
}
