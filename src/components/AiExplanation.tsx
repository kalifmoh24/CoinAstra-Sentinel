import Link from "next/link";

export function AiExplanation({ text, demo }: { text: string; demo?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-ink-900/60 to-ink-950/80 shadow-glow-purple">
      <div className="flex items-center justify-between gap-2 border-b border-accent/20 bg-accent/10 px-4 py-2.5">
        <h2 className="text-sm font-semibold text-accent-purple">AI Summary</h2>
        <span className="rounded-full border border-accent/40 bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-purple">
          Sentinel AI
        </span>
      </div>
      <div className="space-y-3 p-4 sm:p-5">
        {demo && (
          <span className="inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
            DEMO
          </span>
        )}
        <p className="text-sm leading-relaxed text-slate-300">{text}</p>
        <p className="text-[11px] text-slate-500">
          Explanations are grounded in engine evidence only — AI never invents scores or chain facts.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/ai-security-analyst"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-accent/40 px-4 text-sm font-medium text-accent-purple hover:bg-accent/10"
          >
            Ask AI
          </Link>
          <Link
            href="/ai-intelligence"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-purple-cta px-4 text-sm font-semibold text-white shadow-glow"
          >
            View Full Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}
