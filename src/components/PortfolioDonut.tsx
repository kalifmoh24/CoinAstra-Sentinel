/** DEMO allocation donut — illustrative only, not live balances. */
export function PortfolioDonut({
  slices,
  centerLabel,
  size = 128,
}: {
  slices: { label: string; pct: number; color: string }[];
  centerLabel: string;
  size?: number;
}) {
  const r = size / 2;
  const stroke = size * 0.18;
  const radius = r - stroke / 2;
  const c = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={r}
          cy={r}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {slices.map((s) => {
          const len = (s.pct / 100) * c;
          const el = (
            <circle
              key={s.label}
              cx={r}
              cy={r}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${r} ${r})`}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold tabular-nums text-white">{centerLabel}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">assets</span>
      </div>
    </div>
  );
}
