/** DEMO 24h risk mix bar — illustrative distribution, not live telemetry. */
export function SegmentedRiskBar({
  segments,
}: {
  segments: { label: string; pct: number; color: string }[];
}) {
  return (
    <div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-ink-950/60">
        {segments.map((s) => (
          <div
            key={s.label}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ width: `${s.pct}%`, backgroundColor: s.color }}
            title={`${s.label} ${s.pct}% (DEMO)`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
        {segments.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label} {s.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}
