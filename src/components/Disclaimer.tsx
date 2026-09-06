import { DISCLAIMER } from "@/lib/types";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={
        compact
          ? "text-xs leading-relaxed text-slate-500"
          : "rounded-lg border border-white/5 bg-ink-900/60 p-4 text-xs leading-relaxed text-slate-400"
      }
    >
      {DISCLAIMER}
    </p>
  );
}
