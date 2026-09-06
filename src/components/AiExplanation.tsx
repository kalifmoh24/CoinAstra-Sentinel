export function AiExplanation({ text, demo }: { text: string; demo?: boolean }) {
  return (
    <div className="overflow-x-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-ink-900 to-ink-800/80 p-5 shadow-glow-cyan">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-accent-cyan">Sentinel AI</h2>
        {demo && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
            DEMO explanation
          </span>
        )}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        Explanation from structured findings only — does not invent scores or chain facts. This is
        an analytical summary, not a guarantee and not financial or security advice.
      </p>
      <div className="mt-4 break-words whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
        {text}
      </div>
    </div>
  );
}
