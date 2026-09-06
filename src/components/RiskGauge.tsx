"use client";

import type { RiskBand } from "@/lib/types";
import { bandColor } from "@/lib/utils";

/** Semi-circle gauge for transaction preview HIGH RISK presentation */
export function RiskGauge({ score, band }: { score: number; band: RiskBand }) {
  const pct = Math.max(0, Math.min(100, score));
  const angle = -90 + (pct / 100) * 180;
  const cx = 90;
  const cy = 90;
  const needleLen = 58;
  const rad = (angle * Math.PI) / 180;
  const nx = cx + needleLen * Math.cos(rad);
  const ny = cy + needleLen * Math.sin(rad);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 180 110" className="h-28 w-44" aria-hidden>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="45%" stopColor="#fbbf24" />
            <stop offset="75%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 220} 220`}
        />
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#e2e8f0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill="#e2e8f0" />
      </svg>
      <p className={`-mt-2 text-3xl font-semibold tabular-nums ${bandColor(band)}`}>{score}/100</p>
      <p className={`text-xs font-semibold uppercase tracking-wider ${bandColor(band)}`}>
        {band} RISK
      </p>
    </div>
  );
}
