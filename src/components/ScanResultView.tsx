import type { InputType, ScanResult } from "@/lib/types";
import { RiskScore } from "./RiskScore";
import { Disclaimer } from "./Disclaimer";
import { ApprovalsPanel } from "./ApprovalsPanel";
import { ExposurePanel } from "./ExposurePanel";
import { SubjectHeader } from "./SubjectHeader";
import { ScanResultTabs } from "./ScanResultTabs";
import { TransactionPreviewPanel } from "./TransactionPreviewPanel";
import { WalletMetrics } from "./WalletMetrics";
import { FindingsList } from "./FindingsList";
import { shortAddr } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Share2, Star, Copy } from "lucide-react";

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
      return "/dashboard";
  }
}

function titleFor(inputType: InputType): string {
  if (inputType === "wallet") return "Wallet Scanner";
  if (inputType === "transaction") return "Transaction Preview";
  return "Scan Result";
}

export function ScanResultView({ result }: { result: ScanResult }) {
  const typeHref = scanTypeHref(result.inputType);
  const partialEvidence =
    result.insufficientData === true ||
    result.findings.some((f) => f.title.toLowerCase().includes("insufficient"));
  const isTx = result.inputType === "transaction";
  const isWallet = result.inputType === "wallet";
  const pageTitle = titleFor(result.inputType);

  return (
    <div className="mx-auto max-w-6xl space-y-5 overflow-x-hidden px-3 py-5 sm:space-y-6 sm:px-5 sm:py-8">
      {/* Mobile-first header matching mockup screens 2–4 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={typeHref}
            className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 lg:hidden">
              {pageTitle}
            </p>
            <h1 className="truncate text-base font-semibold text-white sm:text-lg lg:text-xl">
              <span className="lg:hidden">{pageTitle}</span>
              <span className="hidden break-all font-mono text-lg lg:inline sm:text-2xl [overflow-wrap:anywhere]">
                {result.input.length > 24 ? shortAddr(result.input, 6) : result.input}
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isWallet ? (
            <button
              type="button"
              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-slate-400 hover:bg-white/5"
              aria-label="Favorite"
              title="Watchlist scaffolding"
            >
              <Star className="h-4 w-4" strokeWidth={1.75} />
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-slate-400 hover:bg-white/5"
              aria-label="Share"
              title="Share scaffolding"
            >
              <Share2 className="h-4 w-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {/* Identity card */}
      <div className="card-surface flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4">
        <div className="min-w-0">
          <p className="text-xs font-medium capitalize text-slate-300">
            {result.chain} {result.inputType}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400 sm:text-sm">
            <span className="break-all [overflow-wrap:anywhere]">
              {result.input.length > 42 ? shortAddr(result.input, 8) : result.input}
            </span>
            <Copy className="h-3.5 w-3.5 shrink-0 text-slate-600" strokeWidth={1.75} aria-hidden />
          </p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <Link href={typeHref} className="capitalize text-accent-purple hover:underline">
              {result.inputType}
            </Link>
            <span>·</span>
            <span className="capitalize">{result.chain}</span>
            {isWallet && (
              <>
                <span>·</span>
                <span>EOA Wallet</span>
                <span className="inline-flex items-center gap-1 text-accent-emerald">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" />
                  Active
                </span>
              </>
            )}
            {result.demo && (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-300">
                DEMO data
              </span>
            )}
          </p>
        </div>
        <p className="text-[10px] text-slate-600 sm:text-xs">
          {new Date(result.createdAt).toLocaleString()}
        </p>
      </div>

      {result.subject && (result.inputType === "token" || result.inputType === "contract") && (
        <SubjectHeader subject={result.subject} />
      )}

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

      {isTx ? (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="min-w-0 space-y-4 lg:col-span-2">
            <RiskScore
              score={result.score}
              band={result.band}
              demo={result.demo}
              categories={result.categories}
            />
          </div>
          <div className="min-w-0 lg:col-span-3">
            <TransactionPreviewPanel result={result} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
          <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">
            <RiskScore
              score={result.score}
              band={result.band}
              demo={result.demo}
              categories={result.categories}
            />
            {isWallet && <WalletMetrics result={result} />}
            {isWallet && (
              <FindingsList
                title="Risk Indicators"
                findings={result.criticalFindings}
                empty="No critical indicators in structured evidence."
              />
            )}
          </div>
          <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-3">
            <ScanResultTabs result={result} />
          </div>
        </div>
      )}

      <div className="overflow-x-hidden rounded-xl border border-white/5 bg-ink-900/40 p-4">
        <p className="text-xs font-medium text-slate-400">Data sources</p>
        <p className="mt-1 break-all font-mono text-xs text-slate-500 [overflow-wrap:anywhere]">
          {result.dataSources.join(" · ")}
        </p>
      </div>

      {isWallet && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/watchlist"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-purple-cta text-sm font-semibold text-white shadow-glow"
          >
            Monitor Wallet
          </Link>
          <button
            type="button"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/10 px-5 text-sm text-slate-300 hover:bg-white/5"
            title="Share scaffolding"
          >
            Share
          </button>
        </div>
      )}

      {(result.inputType === "wallet" || result.approvals != null || result.holdings != null) && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ApprovalsPanel approvals={result.approvals} findings={result.findings} demo={result.demo} />
          <ExposurePanel holdings={result.holdings} findings={result.findings} demo={result.demo} />
        </div>
      )}
      
      <Disclaimer />
    </div>
  );
}

export { scanTypeHref };
