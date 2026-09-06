import type { ScanResult } from "@/lib/types";
import { RiskScore } from "./RiskScore";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { FindingsList } from "./FindingsList";
import { AiExplanation } from "./AiExplanation";
import { Disclaimer } from "./Disclaimer";
import { shortAddr } from "@/lib/utils";

export function ScanResultView({ result }: { result: ScanResult }) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Scan result</p>
          <h1 className="mt-1 font-mono text-xl text-white sm:text-2xl">
            {result.input.length > 24 ? shortAddr(result.input, 6) : result.input}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {result.inputType} · {result.chain}
            {result.demo ? " · " : ""}
            {result.demo && <span className="text-amber-300">DEMO data</span>}
          </p>
        </div>
        <p className="text-xs text-slate-500">
          {new Date(result.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <RiskScore score={result.score} band={result.band} demo={result.demo} />
          <CategoryBreakdown categories={result.categories} />
        </div>
        <div className="space-y-6 lg:col-span-3">
          <AiExplanation text={result.aiExplanation} demo={result.demo} />
          <FindingsList
            title="Critical & high findings"
            findings={result.criticalFindings}
            empty="No critical or high findings in structured evidence."
          />
          <FindingsList
            title="Positive signals"
            findings={result.positiveFindings}
            empty="No positive signals recorded."
          />
          <FindingsList
            title="All findings"
            findings={result.findings}
            empty="Insufficient data"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-ink-900/40 p-4">
        <p className="text-xs font-medium text-slate-400">Data sources</p>
        <p className="mt-1 font-mono text-xs text-slate-500">{result.dataSources.join(" · ")}</p>
      </div>

      <Disclaimer />
    </div>
  );
}
