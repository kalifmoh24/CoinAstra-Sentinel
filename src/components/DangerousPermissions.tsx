import type { Finding } from "@/lib/types";
import { isDangerousPermissionFinding } from "@/lib/engine/recommendations";

function severityDot(s: Finding["severity"]) {
  switch (s) {
    case "critical":
      return "bg-risk-critical";
    case "high":
      return "bg-risk-high";
    case "moderate":
      return "bg-risk-moderate";
    default:
      return "bg-slate-400";
  }
}

export function DangerousPermissions({ findings }: { findings: Finding[] }) {
  const perms = findings.filter(isDangerousPermissionFinding);
  if (perms.length === 0) return null;

  return (
    <div className="overflow-x-hidden rounded-2xl border border-risk-high/25 bg-risk-high/5 p-4 sm:p-5">
      <h2 className="text-sm font-medium text-risk-high">Dangerous permissions</h2>
      <p className="mt-1 text-xs text-slate-500">
        Privilege-related findings (mint / pause / upgrade / blacklist / owner) from structured ABI and
        ownership evidence.
      </p>
      <ul className="mt-4 space-y-2.5">
        {perms.map((f) => (
          <li
            key={f.id}
            className="flex min-w-0 items-start gap-3 rounded-xl border border-white/5 bg-ink-950/50 p-3"
          >
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDot(f.severity)}`}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="break-words text-sm font-medium text-white">{f.title}</p>
              <p className="mt-0.5 break-words text-xs leading-relaxed text-slate-400">
                {f.description}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                {f.severity} · {f.category}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
