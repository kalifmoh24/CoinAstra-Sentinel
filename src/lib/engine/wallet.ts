import type { Finding, SecurityIntel, WalletData } from "../types";

export function analyzeWallet(wallet: WalletData, security?: SecurityIntel): Finding[] {
  const findings: Finding[] = [];
  const src = wallet.sources.join(", ") || "blockchain";

  if (wallet.firstSeen) {
    const ageDays = Math.max(
      0,
      (Date.now() - new Date(wallet.firstSeen).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (ageDays < 7) {
      findings.push({
        id: "wallet-age-new",
        category: "Wallet",
        severity: "high",
        title: "Very new wallet",
        description: `Wallet first seen ~${Math.round(ageDays)} days ago.`,
        scoreImpact: 25,
        evidence: [{ reason: `firstSeen=${wallet.firstSeen}`, source: src, raw: { ageDays } }],
      });
    } else if (ageDays < 90) {
      findings.push({
        id: "wallet-age-young",
        category: "Wallet",
        severity: "moderate",
        title: "Young wallet",
        description: `Wallet age ~${Math.round(ageDays)} days.`,
        scoreImpact: 12,
        evidence: [{ reason: `firstSeen=${wallet.firstSeen}`, source: src, raw: { ageDays } }],
      });
    } else {
      findings.push({
        id: "wallet-age-mature",
        category: "Wallet",
        severity: "positive",
        title: "Established wallet age",
        description: `Wallet active for ~${Math.round(ageDays)} days.`,
        scoreImpact: -8,
        positive: true,
        evidence: [{ reason: `firstSeen=${wallet.firstSeen}`, source: src, raw: { ageDays } }],
      });
    }
  } else {
    findings.push({
      id: "wallet-age-unknown",
      category: "Wallet",
      severity: "info",
      title: "Insufficient data: wallet age",
      description: "Could not determine first-seen timestamp.",
      scoreImpact: 5,
      evidence: [{ reason: "firstSeen missing", source: src }],
    });
  }

  if (typeof wallet.txCount === "number") {
    if (wallet.txCount < 5) {
      findings.push({
        id: "wallet-tx-low",
        category: "Wallet",
        severity: "moderate",
        title: "Very low transaction count",
        description: `Only ${wallet.txCount} transactions observed.`,
        scoreImpact: 10,
        evidence: [{ reason: `txCount=${wallet.txCount}`, source: src }],
      });
    } else if (wallet.txCount > 100) {
      findings.push({
        id: "wallet-tx-active",
        category: "Wallet",
        severity: "positive",
        title: "Active transaction history",
        description: `${wallet.txCount} transactions observed.`,
        scoreImpact: -5,
        positive: true,
        evidence: [{ reason: `txCount=${wallet.txCount}`, source: src }],
      });
    }
  }

  if (wallet.mixerExposure) {
    findings.push({
      id: "wallet-mixer",
      category: "Security",
      severity: "critical",
      title: "Possible mixer exposure",
      description: "Interactions resembling mixer/privacy pool patterns were flagged (heuristic/stub).",
      scoreImpact: 35,
      evidence: [
        {
          reason: "mixerExposure=true",
          source: src,
          raw: wallet.interactions?.filter((i) => i.risk === "high"),
        },
      ],
    });
  }

  const highRisk = (wallet.interactions ?? []).filter((i) => i.risk === "high" || i.risk === "critical");
  if (highRisk.length > 0) {
    findings.push({
      id: "wallet-high-risk-interactions",
      category: "Security",
      severity: "high",
      title: "High-risk counterparty interactions",
      description: `${highRisk.length} high-risk interaction(s) labeled in provider data.`,
      scoreImpact: 18,
      evidence: [{ reason: "labeled high-risk interactions", source: src, raw: highRisk }],
    });
  }

  if (wallet.rapidMovement) {
    findings.push({
      id: "wallet-rapid-movement",
      category: "Wallet",
      severity: "moderate",
      title: "Rapid fund movement pattern",
      description: "Funds appear to move quickly after receipt (heuristic).",
      scoreImpact: 14,
      evidence: [{ reason: "rapidMovement=true", source: src }],
    });
  }

  if (typeof wallet.newContractInteractions === "number" && wallet.newContractInteractions > 5) {
    findings.push({
      id: "wallet-new-contracts",
      category: "Wallet",
      severity: "moderate",
      title: "Frequent new contract interactions",
      description: `${wallet.newContractInteractions} recent interactions with newly seen contracts.`,
      scoreImpact: 10,
      evidence: [{ reason: `newContractInteractions=${wallet.newContractInteractions}`, source: src }],
    });
  }

  if (wallet.fundingSource) {
    const risk = wallet.fundingSource.risk ?? "unknown";
    if (risk === "high" || risk === "critical") {
      findings.push({
        id: "wallet-funding-risk",
        category: "Security",
        severity: "high",
        title: "Elevated funding source risk",
        description: `Funding source labeled ${risk}: ${wallet.fundingSource.label ?? wallet.fundingSource.address}`,
        scoreImpact: 16,
        evidence: [{ reason: "funding source risk label", source: src, raw: wallet.fundingSource }],
      });
    } else if (risk === "low") {
      findings.push({
        id: "wallet-funding-ok",
        category: "Wallet",
        severity: "positive",
        title: "Funding source appears conventional",
        description: wallet.fundingSource.label ?? wallet.fundingSource.address,
        scoreImpact: -4,
        positive: true,
        evidence: [{ reason: "funding source low risk", source: src, raw: wallet.fundingSource }],
      });
    }
  }

  if (security?.sanctionsHit || security?.knownMalicious) {
    findings.push({
      id: "wallet-sanctions",
      category: "Security",
      severity: "critical",
      title: "Security intel hit",
      description: "Address flagged by security intelligence provider.",
      scoreImpact: 50,
      evidence: [
        {
          reason: "sanctions or knownMalicious",
          source: security.sources.join(", "),
          raw: security,
        },
      ],
    });
  }

  return findings;
}
