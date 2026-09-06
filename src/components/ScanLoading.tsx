'use client';

import { useEffect, useState } from "react";

const STEPS = [
  "Resolving subject & chain",
  "Fetching provider evidence",
  "Running deterministic risk engine",
  "Attaching evidence sources",
  "Generating Sentinel AI explanation",
];

export function ScanLoading({ input }: { input: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl border border-accent/20 bg-ink-900/80 p-6 shadow-glow">
      <p className="text-xs uppercase tracking-wider text-accent-cyan">Scanning</p>
      <p className="mt-1 truncate font-mono text-sm text-slate-300">{input}</p>
      <ul className="mt-6 space-y-3">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`flex items-center gap-3 text-sm ${
              i === step ? "text-white animate-pulse-step" : i < step ? "text-accent-emerald" : "text-slate-600"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                i === step ? "bg-accent-cyan" : i < step ? "bg-accent-emerald" : "bg-slate-700"
              }`}
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
