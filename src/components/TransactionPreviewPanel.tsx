import Link from "next/link";
import type { ScanResult } from "@/lib/types";
import { shortAddr } from "@/lib/utils";
import { RiskGauge } from "./RiskGauge";
import { DangerousPermissions } from "./DangerousPermissions";

export function TransactionPreviewPanel({ result }: { result: ScanResult }) {
  const tx = result.txMeta;
  const method = tx?.method ?? null;
  const looksApprove =
    method != null && /approve|permit|allowance/i.test(method);

  return (
    <div className="space-y-4">
      <div className="card-surface p-5">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden>
            ⇄
          </span>
          <div>
            <h2 className="text-base font-semibold text-white">
              {method ? `You are about to call ${method}` : "Transaction preview"}
            </h2>
            <p className="text-xs text-slate-500">
              Analysis only — Sentinel never signs, broadcasts, or submits transactions.
            </p>
          </div>
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-white/5 bg-ink-950/50 p-3">
            <dt className="text-[10px] uppercase tracking-wider text-slate-500">From</dt>
            <dd className="mt-1 break-all font-mono text-xs text-slate-200">
              {tx?.from ? shortAddr(tx.from, 6) : "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-ink-950/50 p-3">
            <dt className="text-[10px] uppercase tracking-wider text-slate-500">To (Contract)</dt>
            <dd className="mt-1 break-all font-mono text-xs text-slate-200">
              {tx?.to ? shortAddr(tx.to, 6) : "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-ink-950/50 p-3">
            <dt className="text-[10px] uppercase tracking-wider text-slate-500">Network</dt>
            <dd className="mt-1 capitalize text-slate-200">{result.chain}</dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-ink-950/50 p-3">
            <dt className="text-[10px] uppercase tracking-wider text-slate-500">Value (native)</dt>
            <dd className="mt-1 text-slate-200">
              {tx?.valueEth != null ? `${tx.valueEth} ETH` : "Insufficient data"}
            </dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-ink-950/50 p-3 sm:col-span-2">
            <dt className="text-[10px] uppercase tracking-wider text-slate-500">Method</dt>
            <dd className="mt-1 font-mono text-slate-200">{method ?? "Insufficient data"}</dd>
          </div>
        </dl>
        <p className="mt-3 text-[11px] text-slate-500">
          Receive amounts and gas estimates are not invented. Only fields present in provider/demo
          evidence are shown.
          {result.demo ? " · DEMO fixture data." : ""}
        </p>
      </div>

      <div className="card-glow flex flex-col items-center gap-3 p-5 sm:flex-row sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Risk analysis</p>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Score from structured evidence only — not simulated execution and not a guarantee.
          </p>
        </div>
        <RiskGauge score={result.score} band={result.band} />
      </div>

      {(looksApprove || result.findings.some((f) => /approv|permit|allowance/i.test(f.title))) && (
        <div className="rounded-2xl border border-risk-critical/30 bg-risk-critical/5 p-4">
          <h3 className="text-sm font-medium text-risk-critical">Permissions requested</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {looksApprove && (
              <li className="flex items-center justify-between rounded-lg border border-risk-critical/20 bg-ink-950/40 px-3 py-2">
                <span className="text-slate-200">Sensitive approval / allowance method</span>
                <span className="text-[10px] uppercase text-risk-critical">High risk</span>
              </li>
            )}
            {tx?.interactsWithContract && (
              <li className="flex items-center justify-between rounded-lg border border-risk-high/20 bg-ink-950/40 px-3 py-2">
                <span className="text-slate-200">Contract interaction</span>
                <span className="text-[10px] uppercase text-risk-high">Medium risk</span>
              </li>
            )}
          </ul>
        </div>
      )}

      <DangerousPermissions findings={result.findings} />

      <div className="space-y-2">
        <button
          type="button"
          disabled
          title="Sentinel never executes transactions. Review education materials instead."
          className="flex min-h-[48px] w-full cursor-not-allowed items-center justify-center rounded-xl border border-risk-critical/40 bg-risk-critical/20 px-4 text-sm font-semibold text-risk-critical opacity-70"
        >
          ⚠️ Proceed Anyway (Not Recommended) — disabled
        </button>
        <p className="text-center text-[11px] text-slate-500">
          Sentinel does not execute or simulate broadcasting.{" "}
          <Link href="/ai-intelligence" className="text-accent-purple hover:underline">
            Learn how analysis works
          </Link>
        </p>
        <Link
          href="/scan/transaction"
          className="flex min-h-[44px] w-full items-center justify-center text-sm text-slate-400 hover:text-white"
        >
          Cancel — back to Transaction Preview
        </Link>
      </div>
    </div>
  );
}
