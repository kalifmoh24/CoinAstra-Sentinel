import type { CategoryScore } from "@/lib/types";
import { bandFromScore, bandColor } from "@/lib/utils";

export function CategoryBreakdown({ categories }: { categories: CategoryScore[] }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-ink-900/50 p-5">
      <h2 className="text-sm font-medium text-slate-300">Category breakdown</h2>
      <div className="mt-4 space-y-4">
        {categories.map((c) => {
          const band = bandFromScore(c.score);
          return (
            <div key={c.category}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">{c.category}</span>
                <span className={`font-mono ${bandColor(band)}`}>{c.score}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-800">
                <div
                  className="h-full rounded-full bg-accent/80"
                  style={{ width: `${Math.min(100, c.score)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">{c.summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
