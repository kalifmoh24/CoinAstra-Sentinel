import type { CategoryScore } from "@/lib/types";
import { bandFromScore, bandColor } from "@/lib/utils";

export function CategoryBreakdown({ categories }: { categories: CategoryScore[] }) {
  return (
    <div className="overflow-x-hidden rounded-2xl border border-white/5 bg-ink-900/50 p-5">
      <h2 className="text-sm font-medium text-slate-300">Category breakdown</h2>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
        Category scores summarize structured evidence only. They are analytical assessments — not
        guarantees of safety, and not financial or security advice.
      </p>
      <div className="mt-4 space-y-4">
        {categories.map((c) => {
          const band = bandFromScore(c.score);
          return (
            <div key={c.category} className="min-w-0">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-slate-200">{c.category}</span>
                <span className={`shrink-0 font-mono ${bandColor(band)}`}>{c.score}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-800">
                <div
                  className="h-full rounded-full bg-accent/80"
                  style={{ width: `${Math.min(100, c.score)}%` }}
                />
              </div>
              <p className="mt-1 break-words text-xs text-slate-500">{c.summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
