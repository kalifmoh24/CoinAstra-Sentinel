import type { Evidence, Finding, SecurityIntel, WalletData } from "../types";

function secSource(security?: SecurityIntel): string {
  return security?.sources?.join(", ") || "security-provider";
}

function evidence(reason: string, source: string, raw?: unknown): Evidence[] {
  return raw === undefined ? [{ reason, source }] : [{ reason, source, raw }];
}

export function analyzeWallet(wallet: WalletData, security?: SecurityIntel): Finding[] {
  const findings: Finding[] = [];
  const src = wallet.sources.join(", ") || "blockchain";
  const secSrc = secSource(security);

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
        evidence: evidence(`firstSeen=${wallet.firstSeen}`, src, { ageDays }),
      });
    } else if (ageDays < 90) {
      findings.push({
        id: "wallet-age-young",
        category: "Wallet",
        severity: "moderate",
        title: "Young wallet",
        description: `Wallet age ~${Math.round(ageDays)} days.`,
        scoreImpact: 12,
        evidence: evidence(`firstSeen=${wallet.firstSeen}`, src, { ageDays }),
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
        evidence: evidence(`firstSeen=${wallet.firstSeen}`, src, { ageDays }),
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
      evidence: evidence("firstSeen missing", src),
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
        evidence: evidence(`txCount=${wallet.txCount}`, src),
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
        evidence: evidence(`txCount=${wallet.txCount}`, src),
      });
    }
  }

  // Mixer: only from structured mixerExposure + supporting interaction evidence
  if (wallet.mixerExposure === true) {
    const mixerLike = (wallet.interactions ?? []).filter(
      (i) =>
        i.risk === "high" ||
        i.risk === "critical" ||
        /mixer|tornado|privacy\s*pool|blender/i.test(i.label ?? ""),
    );
    findings.push({
      id: "wallet-mixer",
      category: "Security",
      severity: "critical",
      title: "Possible mixer exposure",
      description:
        mixerLike.length > 0
          ? `Provider flagged mixerExposure with ${mixerLike.length} supporting high-risk/mixer-labeled interaction(s).`
          : "Provider flagged mixerExposure=true; no supporting interaction labels were present in structured data.",
      scoreImpact: 35,
      evidence: evidence("mixerExposure=true", src, {
        mixerExposure: true,
        supportingInteractions: mixerLike,
      }),
    });
  }

  const highRisk = (wallet.interactions ?? []).filter(
    (i) => i.risk === "high" || i.risk === "critical",
  );
  if (highRisk.length > 0) {
    const addresses = highRisk.map((i) => i.address);
    findings.push({
      id: "wallet-high-risk-interactions",
      category: "Security",
      severity: "high",
      title: "High-risk counterparty interactions",
      description: `${highRisk.length} high-risk interaction(s) labeled in provider data: ${highRisk
        .map((i) => i.label ?? i.address)
        .slice(0, 5)
        .join(", ")}`,
      scoreImpact: Math.min(30, 12 + highRisk.length * 3),
      evidence: evidence(
        `high-risk counterparties count=${highRisk.length}`,
        src,
        { addresses, interactions: highRisk },
      ),
    });
  }

  if (wallet.rapidMovement === true) {
    findings.push({
      id: "wallet-rapid-movement",
      category: "Wallet",
      severity: "moderate",
      title: "Rapid fund movement pattern",
      description: "Provider flagged rapidMovement=true on structured wallet data.",
      scoreImpact: 14,
      evidence: evidence("rapidMovement=true", src, { rapidMovement: true }),
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
      evidence: evidence(
        `newContractInteractions=${wallet.newContractInteractions}`,
        src,
        { newContractInteractions: wallet.newContractInteractions },
      ),
    });
  }

  if (wallet.fundingSource) {
    const risk = wallet.fundingSource.risk ?? "unknown";
    const fundingLabel = wallet.fundingSource.label ?? wallet.fundingSource.address;
    if (risk === "high" || risk === "critical") {
      findings.push({
        id: "wallet-funding-risk",
        category: "Security",
        severity: "high",
        title: "Elevated funding source risk",
        description: `Funding source labeled ${risk}: ${fundingLabel}`,
        scoreImpact: 16,
        evidence: evidence(
          `fundingSource.risk=${risk} address=${wallet.fundingSource.address}`,
          src,
          wallet.fundingSource,
        ),
      });
    } else if (risk === "low") {
      findings.push({
        id: "wallet-funding-ok",
        category: "Wallet",
        severity: "positive",
        title: "Funding source appears conventional",
        description: fundingLabel,
        scoreImpact: -4,
        positive: true,
        evidence: evidence(
          `fundingSource.risk=low address=${wallet.fundingSource.address}`,
          src,
          wallet.fundingSource,
        ),
      });
    } else if (risk === "unknown") {
      findings.push({
        id: "wallet-funding-unknown",
        category: "Wallet",
        severity: "info",
        title: "Insufficient data: funding source risk",
        description: `Funding source present (${fundingLabel}) but risk label unknown.`,
        scoreImpact: 4,
        evidence: evidence(
          `fundingSource.risk=unknown address=${wallet.fundingSource.address}`,
          src,
          wallet.fundingSource,
        ),
      });
    }
  }

  // Security intel — fail closed: only true fires hits; null → Insufficient data; false is confirmed clear (vendor present)
  if (security) {
    if (security.sanctionsHit === true) {
      findings.push({
        id: "wallet-sanctions",
        category: "Security",
        severity: "critical",
        title: "Sanctions intelligence hit",
        description: "Address flagged on a sanctions list by the security intelligence provider.",
        scoreImpact: 50,
        evidence: evidence("sanctionsHit=true", secSrc, {
          sanctionsHit: true,
          notes: security.notes,
        }),
      });
    } else if (security.sanctionsHit === null || security.sanctionsHit === undefined) {
      findings.push({
        id: "wallet-sanctions-unknown",
        category: "Security",
        severity: "info",
        title: "Insufficient data: sanctions screening",
        description:
          "No live sanctions vendor result available; treat sanctions status as unknown, not clear.",
        scoreImpact: 6,
        evidence: evidence("sanctionsHit=null|missing", secSrc, {
          notes: security.notes,
        }),
      });
    }

    if (security.knownMalicious === true) {
      findings.push({
        id: "wallet-known-malicious",
        category: "Security",
        severity: "critical",
        title: "Known-malicious intelligence hit",
        description: "Address flagged as known malicious by the security intelligence provider.",
        scoreImpact: 48,
        evidence: evidence("knownMalicious=true", secSrc, {
          knownMalicious: true,
          notes: security.notes,
        }),
      });
    } else if (security.knownMalicious === null || security.knownMalicious === undefined) {
      findings.push({
        id: "wallet-known-malicious-unknown",
        category: "Security",
        severity: "info",
        title: "Insufficient data: malicious-address screening",
        description:
          "No live malicious-address vendor result available; treat status as unknown, not clear.",
        scoreImpact: 6,
        evidence: evidence("knownMalicious=null|missing", secSrc, {
          notes: security.notes,
        }),
      });
    }

    if (typeof security.phishingReports === "number" && security.phishingReports > 0) {
      const n = security.phishingReports;
      findings.push({
        id: "wallet-phishing-reports",
        category: "Security",
        severity: n >= 5 ? "critical" : n >= 2 ? "high" : "moderate",
        title: "Phishing reports on address",
        description: `${n} phishing report(s) recorded by the security intelligence provider.`,
        scoreImpact: Math.min(40, 10 + n * 5),
        evidence: evidence(`phishingReports=${n}`, secSrc, { phishingReports: n }),
      });
    } else if (security.phishingReports === null || security.phishingReports === undefined) {
      findings.push({
        id: "wallet-phishing-unknown",
        category: "Security",
        severity: "info",
        title: "Insufficient data: phishing reports",
        description:
          "No live phishing-report vendor result available; absence of a count is not zero reports.",
        scoreImpact: 5,
        evidence: evidence("phishingReports=null|missing", secSrc, {
          notes: security.notes,
        }),
      });
    }
    // phishingReports === 0 with a real vendor: confirmed clear — no finding (do not invent risk)
  }

  return findings;
}
