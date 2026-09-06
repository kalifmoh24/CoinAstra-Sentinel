import type { SubjectMeta } from "@/lib/types";
import { shortAddr } from "@/lib/utils";

export function SubjectHeader({ subject }: { subject: SubjectMeta }) {
  const verifiedLabel =
    subject.verified === true
      ? "Verified"
      : subject.verified === false
        ? "Unverified"
        : null;

  return (
    <div className="rounded-xl border border-white/5 bg-ink-900/40 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-slate-500">Subject</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {subject.name && (
          <p className="text-base font-medium text-white sm:text-lg">{subject.name}</p>
        )}
        {subject.symbol && (
          <span className="rounded-full border border-white/10 bg-ink-800/60 px-2 py-0.5 font-mono text-xs text-accent-cyan">
            {subject.symbol}
          </span>
        )}
      </div>
      <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
        {subject.chain && (
          <div>
            <dt className="inline text-slate-500">Chain: </dt>
            <dd className="inline capitalize text-slate-300">{subject.chain}</dd>
          </div>
        )}
        {verifiedLabel && (
          <div>
            <dt className="inline text-slate-500">Source: </dt>
            <dd
              className={`inline ${
                subject.verified ? "text-risk-very-low" : "text-risk-high"
              }`}
            >
              {verifiedLabel}
            </dd>
          </div>
        )}
        {subject.deployer && (
          <div className="min-w-0">
            <dt className="inline text-slate-500">Deployer: </dt>
            <dd className="inline break-all font-mono text-slate-300 [overflow-wrap:anywhere]">
              {shortAddr(subject.deployer, 5)}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
