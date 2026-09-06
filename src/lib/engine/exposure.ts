import type { Finding, WalletData, WalletHolding } from "../types";

export function analyzeExposure(wallet: WalletData): Finding[] {
  const findings: Finding[] = [];
  const src = wallet.sources.join(", ") || "exposure-provider";

  // High-risk counterparty exposure from structured interactions
  const highRisk = (wallet.interactions ?? []).filter(
    (i) => i.risk === "high" || i.risk === "critical",
  );
  if (highRisk.length > 0) {
    findings.push({
      id: "exposure-high-risk-counterparty",
      category: "Security",
      severity: "high",
      title: "Exposure to high-risk counterparties",
      description: `${highRisk.length} labeled high-risk counterparty interaction(s) in provider data.`,
      scoreImpact: Math.min(28, 12 + highRisk.length * 4),
      evidence: [
        {
          reason: `high-risk counterparties count=${highRisk.length}`,
          source: src,
          raw: highRisk,
        },
      ],
      recommendation:
        "Map which assets/approvals touch these counterparties and isolate high-value funds if you control the wallet.",
    });
  }

  if (wallet.holdings === null || wallet.holdings === undefined) {
    findings.push({
      id: "exposure-holdings-unknown",
      category: "Wallet",
      severity: "info",
      title: "Insufficient data: holdings",
      description:
        "No token holdings inventory available. Concentration and balance-based exposure cannot be assessed — unknown, not safe.",
      scoreImpact: 6,
      evidence: [{ reason: "holdings=null|missing", source: src }],
      recommendation:
        "Provide a holdings data source or verify balances on a primary explorer; Sentinel will not invent balances.",
    });
  } else if (wallet.holdings.length === 0) {
    findings.push({
      id: "exposure-holdings-empty",
      category: "Wallet",
      severity: "info",
      title: "No token holdings observed",
      description: "Provider returned an empty holdings set for this wallet.",
      scoreImpact: 2,
      evidence: [{ reason: "holdings=[]", source: src }],
    });
  } else {
    findings.push(...concentrationFindings(wallet.holdings, src));
  }

  // Approval-driven exposure: unlimited or risky spenders already covered in approvals;
  // add a summary when approvals exist with unlimited
  const approvals = wallet.approvals;
  if (approvals && approvals.some((a) => a.unlimited)) {
    findings.push({
      id: "exposure-via-unlimited-approval",
      category: "Security",
      severity: "high",
      title: "Holdings exposed via unlimited approvals",
      description: "One or more unlimited allowances can move tokens without a new signature per transfer.",
      scoreImpact: 18,
      evidence: [
        {
          reason: "unlimited approvals present",
          source: approvals.flatMap((a) => a.sources).join(", ") || src,
          raw: approvals.filter((a) => a.unlimited).map((a) => ({ token: a.token, spender: a.spender })),
        },
      ],
      recommendation: "Revoke unlimited allowances on high-value tokens before treating exposure as contained.",
    });
  }

  return findings;
}

function concentrationFindings(holdings: WalletHolding[], src: string): Finding[] {
  const known = holdings.filter((h) => h.balance != null && h.balance !== "");
  if (known.length === 0) {
    return [
      {
        id: "exposure-holdings-amounts-unknown",
        category: "Wallet",
        severity: "info",
        title: "Insufficient data: holding amounts",
        description: "Holdings rows exist but balances are unknown — no concentration score invented.",
        scoreImpact: 4,
        evidence: [{ reason: "all holding balances null", source: src, raw: holdings }],
      },
    ];
  }

  // Only flag concentration when we have numeric balances we can compare (DEMO strings ok)
  const parsed = known
    .map((h) => ({ h, n: Number(String(h.balance).replace(/,/g, "")) }))
    .filter((x) => Number.isFinite(x.n) && x.n > 0);
  if (parsed.length < 2) return [];

  const total = parsed.reduce((s, x) => s + x.n, 0);
  if (total <= 0) return [];
  const top = parsed.slice().sort((a, b) => b.n - a.n)[0];
  const share = top.n / total;
  if (share >= 0.7) {
    return [
      {
        id: "exposure-concentrated-holding",
        category: "Wallet",
        severity: "moderate",
        title: "Concentrated token holding",
        description: `Largest holding (${top.h.symbol ?? top.h.token}) is ~${Math.round(share * 100)}% of summed known balances.`,
        scoreImpact: 12,
        evidence: [
          {
            reason: `concentration=${share.toFixed(3)}`,
            source: top.h.sources.join(", ") || src,
            raw: { token: top.h.token, balance: top.h.balance, share },
          },
        ],
        recommendation:
          "Concentration is not inherently malicious — size risk accordingly and watch approvals on the dominant token.",
      },
    ];
  }
  return [];
}
