import type { Finding, TokenApproval, WalletData } from "../types";

const RISKY_SPENDER =
  /mixer|tornado|privacy|blender|drain|phishing|unknown/i;

/** Stale if lastSeen older than ~180 days. */
const STALE_MS = 180 * 24 * 60 * 60 * 1000;

export function analyzeApprovals(wallet: WalletData): Finding[] {
  const findings: Finding[] = [];
  const src = wallet.sources.join(", ") || "approvals-provider";

  if (wallet.approvals === null || wallet.approvals === undefined) {
    findings.push({
      id: "approval-data-unknown",
      category: "Security",
      severity: "info",
      title: "Insufficient data: token allowances",
      description:
        "No ERC-20 allowance inventory available from providers. Treat approval risk as unknown — not clear.",
      scoreImpact: 8,
      evidence: [{ reason: "approvals=null|missing", source: src }],
      recommendation:
        "Connect a token-allowance data source or verify approvals manually on a primary explorer before trusting this wallet.",
    });
    return findings;
  }

  if (wallet.approvals.length === 0) {
    findings.push({
      id: "approval-none-observed",
      category: "Security",
      severity: "positive",
      title: "No token allowances observed",
      description: "Provider returned an empty allowance set for this wallet.",
      scoreImpact: -4,
      positive: true,
      evidence: [{ reason: "approvals=[]", source: src }],
    });
    return findings;
  }

  for (const a of wallet.approvals) {
    findings.push(...findingsForApproval(a, src));
  }
  return findings;
}

function findingsForApproval(a: TokenApproval, fallbackSrc: string): Finding[] {
  const out: Finding[] = [];
  const src = a.sources.join(", ") || fallbackSrc;
  const demoNote = a.demo ? " (DEMO fixture)" : "";

  if (a.allowance === null && !a.unlimited) {
    out.push({
      id: "approval-allowance-unknown",
      category: "Security",
      severity: "info",
      title: "Insufficient data: allowance amount",
      description: `Allowance for token ${a.token} → spender ${a.spender} is unknown.${demoNote}`,
      scoreImpact: 4,
      evidence: a.evidence.length
        ? a.evidence
        : [{ reason: "allowance=null", source: src, raw: a }],
    });
  }

  if (a.unlimited === true) {
    out.push({
      id: "approval-unlimited",
      category: "Security",
      severity: "high",
      title: "Unlimited token allowance",
      description: `Unlimited allowance from ${a.token} to spender ${a.spender}.${demoNote}`,
      scoreImpact: 22,
      evidence: a.evidence.length
        ? a.evidence
        : [{ reason: "unlimited=true", source: src, raw: { token: a.token, spender: a.spender } }],
      recommendation:
        "Revoke or reduce this allowance via a trusted revoke tool — Sentinel does not broadcast transactions.",
    });
  }

  const spenderBlob = `${a.spender} ${JSON.stringify(a.evidence)}`;
  if (RISKY_SPENDER.test(spenderBlob) || /DemoMixer|mixer/i.test(a.spender)) {
    out.push({
      id: "approval-risky-spender",
      category: "Security",
      severity: "critical",
      title: "Allowance to high-risk spender",
      description: `Token ${a.token} has an allowance to spender ${a.spender} matching high-risk labels.${demoNote}`,
      scoreImpact: 35,
      evidence: a.evidence.length
        ? a.evidence
        : [{ reason: "risky spender heuristic", source: src, raw: a }],
      recommendation:
        "Do not leave value behind this approval. Revoke if you control the wallet; do not interact with the spender.",
    });
  }

  if (a.lastSeen) {
    const age = Date.now() - new Date(a.lastSeen).getTime();
    if (Number.isFinite(age) && age > STALE_MS) {
      out.push({
        id: "approval-stale",
        category: "Security",
        severity: "moderate",
        title: "Stale token allowance",
        description: `Allowance last seen ${a.lastSeen} (>180 days) for ${a.token} → ${a.spender}.${demoNote}`,
        scoreImpact: 10,
        evidence: [
          ...(a.evidence ?? []),
          { reason: `lastSeen=${a.lastSeen}`, source: src, raw: { ageDays: Math.round(age / 86400000) } },
        ],
        recommendation: "Review and revoke unused stale allowances to shrink attack surface.",
      });
    }
  }

  return out;
}
