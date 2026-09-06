import type { XRayDimensionId, XRayProfile } from "@/lib/types";

const LABELS: Record<XRayDimensionId, string> = {
  security: "Security",
  tokenomics: "Tokenomics",
  liquidity: "Liquidity",
  onchain: "On-Chain",
  market: "Market",
  ecosystem: "Ecosystem",
};

export function XRayProfileView({ profile }: { profile: XRayProfile }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-white">X-Ray profile</h2>
        {profile.demo && (
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-amber-300">
            DEMO
          </span>
        )}
      </div>
      <p className="break-all font-mono text-xs text-slate-500">{profile.subject}</p>

      <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-5">
        <p className="text-xs uppercase tracking-wider text-slate-500">Overall</p>
        <p className="mt-1 text-3xl font-semibold text-white">
          {profile.overallScore == null ? "—" : profile.overallScore}
          {profile.overallBand && (
            <span className="ml-2 text-base font-medium text-slate-400">{profile.overallBand}</span>
          )}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Weighted average of scored dimensions only
          {profile.gaps.length > 0
            ? ` · Gaps: ${profile.gaps.map((g) => LABELS[g]).join(", ")}`
            : ""}
          . Null dimensions are never treated as zero/safe.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {profile.dimensions.map((d) => (
          <div key={d.id} className="rounded-2xl border border-white/10 bg-ink-900/40 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-medium text-white">{LABELS[d.id]}</h3>
              {d.demo && <span className="text-[10px] font-semibold uppercase text-amber-300">DEMO</span>}
            </div>
            <p className="mt-2 text-2xl font-semibold text-white">
              {d.score == null ? "—" : d.score}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">{d.status}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{d.summary}</p>
            {d.findings[0] && (
              <p className="mt-2 text-[11px] text-slate-500">
                {d.findings[0].title}
                {d.findings[0].evidence[0]
                  ? ` · ${d.findings[0].evidence[0].source}`
                  : ""}
              </p>
            )}
          </div>
        ))}
      </div>

      {profile.aiExplanation && (
        <div className="rounded-2xl border border-white/10 bg-ink-900/40 p-4">
          <h3 className="text-sm font-medium text-white">AI explanation</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{profile.aiExplanation}</p>
          <p className="mt-2 text-[11px] text-slate-500">
            AI explains evidence only — does not invent dimension scores or on-chain facts.
          </p>
        </div>
      )}

      <p className="text-xs text-slate-600">{profile.disclaimer}</p>
    </div>
  );
}
