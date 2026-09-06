"use client";

import { useState } from "react";
import type { ScanResult } from "@/lib/types";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { FindingsList } from "./FindingsList";
import { AiExplanation } from "./AiExplanation";
import { WalletActivityTimeline } from "./WalletActivityTimeline";
import { DangerousPermissions } from "./DangerousPermissions";
import { RiskRadar } from "./RiskRadar";

const TABS = ["Summary", "Findings", "Activity"] as const;
type Tab = (typeof TABS)[number];

export function ScanResultTabs({ result }: { result: ScanResult }) {
  const [tab, setTab] = useState<Tab>("Summary");
  const showDangerous =
    result.inputType === "token" || result.inputType === "contract";
  const hasActivity =
    result.inputType === "wallet" && result.activity && result.activity.length > 0;

  return (
    <div className="min-w-0 space-y-4">
      <div
        className="flex gap-1 rounded-full border border-white/5 bg-ink-950/70 p-1"
        role="tablist"
        aria-label="Scan result sections"
      >
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`min-h-[36px] flex-1 rounded-full px-3 text-sm font-medium transition ${
              tab === t
                ? "bg-accent text-white shadow-glow"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {t}
            {t === "Activity" && !hasActivity ? (
              <span className="ml-1 text-[10px] text-slate-500">—</span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === "Summary" && (
        <div className="space-y-4">
          {result.categories && result.categories.length > 0 ? (
            <div className="overflow-x-hidden rounded-2xl border border-white/5 bg-ink-900/50 p-5">
              <h2 className="text-sm font-medium text-slate-300">Risk radar</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Category risk profile from the same structured evidence as the score panel —
                visible here so wallet Summary stays clear on mobile.
              </p>
              <div className="mt-3 flex justify-center">
                <RiskRadar
                  categories={result.categories}
                  band={result.band}
                  size={220}
                />
              </div>
            </div>
          ) : null}
          <CategoryBreakdown categories={result.categories} />
          <AiExplanation text={result.aiExplanation} demo={result.demo} />
          {showDangerous && <DangerousPermissions findings={result.findings} />}
          <FindingsList
            title="Critical & high findings"
            findings={result.criticalFindings}
            empty="No critical or high findings in structured evidence."
          />
        </div>
      )}

      {tab === "Findings" && (
        <div className="space-y-4">
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
          {showDangerous && <DangerousPermissions findings={result.findings} />}
        </div>
      )}

      {tab === "Activity" && (
        <div className="space-y-4">
          {hasActivity ? (
            <WalletActivityTimeline activity={result.activity!} demo={result.demo} />
          ) : (
            <div className="rounded-2xl border border-white/5 bg-ink-900/50 p-5 text-sm text-slate-500">
              {result.inputType === "wallet"
                ? "No wallet activity timeline available for this scan."
                : "Activity timeline is available for wallet scans when provider/demo history exists."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
