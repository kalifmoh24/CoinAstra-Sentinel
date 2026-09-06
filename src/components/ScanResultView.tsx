import type { InputType, ScanResult } from "@/lib/types";
import { RiskScore } from "./RiskScore";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { FindingsList } from "./FindingsList";
import { AiExplanation } from "./AiExplanation";
import { Disclaimer } from "./Disclaimer";
import { shortAddr } from "@/lib/utils";
import Link from "next/link";

function scanTypeHref(inputType: InputType): string {
  switch (inputType) {
    case "wallet":
      return "/scan/wallet";
    case "token":
      return "/scan/token";
    case "contract":
      return "/scan/contract";
    case "transaction":
      return "/scan/transaction";
    default:
      return "/";
  }
}

export function ScanResultView({ result }: { result: ScanResult }) {
  const typeHref = scanTypeHref(result.inputType);
  const partialEvidence =
    result.insufficientData === true ||
    result.findings.some((f) => f.title.toLowerCase().includes("insufficient"));

  return (
    <div className="mx-auto max-w-6xl space-y-5 overflow-x-hidden px-4 py-8 sm:space-y-6 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-slate-500">Scan result</p>
          <h1 className="mt-1 break-all font-mono text-lg text-white sm:text-2xl [overflow-wrap:anywhere]">
            {result.input.length > 24 ? shortAddr(result.input, 6) : result.input}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
            <Link href={typeHref} className="capitalize text-accent-cyan hover:underline">
              {result.inputType}
            </Link>
            <span>·</span>
            <span>{result.chain}</span>
            {result.demo && (
              <>
                <span>·</span>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs text-amber-300">
                  DEMO data
                </span>
              </>
            )}
          </p>
        </div>
        <p className="text-xs text-slate-500">
          {new Date(result.createdAt).toLocaleString()}
        </p>
      </div>

      {partialEvidence && (
        <div
          role="status"
          className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm leading-relaxed text-amber-100"
        >
          <p className="font-medium text-amber-200">Partial / insufficient evidence</p>
          <p className="mt-1 text-xs text-amber-100/80 sm:text-sm">
            Some provider signals were missing or incomplete. The score reflects available
            structured evidence only — treat gaps as unknown, not as clearance.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
        <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">
          <RiskScore score={result.score} band={result.band} demo={result.demo} />
          <CategoryBreakdown categories={result.categories} />
        </div>
        <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-3">
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

      <div className="overflow-x-hidden rounded-xl border border-white/5 bg-ink-900/40 p-4">
        <p className="text-xs font-medium text-slate-400">Data sources</p>
        <p className="mt-1 break-all font-mono text-xs text-slate-500 [overflow-wrap:anywhere]">
          {result.dataSources.join(" · ")}
        </p>
      </div>

      <Disclaimer />
    </div>
  );
}

export { scanTypeHref };
