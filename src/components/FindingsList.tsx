import type { Finding } from "@/lib/types";

function severityClass(s: Finding["severity"]) {
  switch (s) {
    case "critical":
      return "border-risk-critical/40 bg-risk-critical/10 text-risk-critical";
    case "high":
      return "border-risk-high/40 bg-risk-high/10 text-risk-high";
    case "moderate":
      return "border-risk-moderate/40 bg-risk-moderate/10 text-risk-moderate";
    case "positive":
      return "border-risk-very-low/40 bg-risk-very-low/10 text-risk-very-low";
    default:
      return "border-white/10 bg-ink-800/50 text-slate-300";
  }
}

export function FindingsList({
  title,
  findings,
  empty,
}: {
  title: string;
  findings: Finding[];
  empty: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-ink-900/50 p-4 sm:p-5">
      <h2 className="text-sm font-medium text-slate-300">{title}</h2>
      {findings.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {findings.map((f) => (
            <li
              key={f.id}
              className={`rounded-xl border p-3.5 sm:p-3 ${severityClass(f.severity)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[15px] font-medium leading-snug text-white sm:text-base">
                  {f.title}
                </p>
                <span className="shrink-0 rounded-full border border-current/20 px-2 py-0.5 text-[10px] uppercase tracking-wider opacity-80">
                  {f.severity}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{f.description}</p>
              <div className="mt-2 space-y-1">
                {f.evidence.map((e, i) => (
                  <p key={i} className="break-all font-mono text-[11px] text-slate-500">
                    evidence: {e.reason} · source: {e.source}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
