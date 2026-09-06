"use client";

import { useState } from "react";
import type { ScanResult } from "@/lib/types";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { FindingsList } from "./FindingsList";
import { AiExplanation } from "./AiExplanation";
import { WalletActivityTimeline } from "./WalletActivityTimeline";
import { DangerousPermissions } from "./DangerousPermissions";

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
      <div className="flex gap-1 rounded-xl border border-white/5 bg-ink-900/50 p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`min-h-[40px] flex-1 rounded-lg px-3 text-sm font-medium transition ${
              tab === t
                ? "bg-accent/20 text-accent-purple"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t}
            {t === "Activity" && !hasActivity ? (
              <span className="ml-1 text-[10px] text-slate-600">—</span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === "Summary" && (
        <div className="space-y-4">
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
