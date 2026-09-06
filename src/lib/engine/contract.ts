import type { ContractData, Finding, MarketData, TokenData } from "../types";

function abiHas(abi: unknown[] | null | undefined, name: string): boolean {
  if (!abi) return false;
  return abi.some((item) => {
    if (!item || typeof item !== "object") return false;
    const rec = item as { type?: string; name?: string };
    return rec.type === "function" && rec.name?.toLowerCase() === name.toLowerCase();
  });
}

export function analyzeContract(
  contract: ContractData | TokenData,
  market?: MarketData,
): Finding[] {
  const findings: Finding[] = [];
  const src = contract.sources.join(", ") || "contract-analysis";

  if (!contract.isContract) {
    findings.push({
      id: "not-a-contract",
      category: "Contract",
      severity: "info",
      title: "Address is not a contract",
      description: "No on-chain code detected at this address.",
      scoreImpact: 0,
      evidence: [{ reason: "isContract=false", source: src }],
    });
    return findings;
  }

  if (contract.verified === true) {
    findings.push({
      id: "contract-verified",
      category: "Contract",
      severity: "positive",
      title: "Verified source code",
      description: contract.name ? `Verified as ${contract.name}` : "Contract source is verified.",
      scoreImpact: -10,
      positive: true,
      evidence: [{ reason: "verified=true", source: src, raw: { name: contract.name } }],
    });
  } else if (contract.verified === false) {
    findings.push({
      id: "contract-unverified",
      category: "Contract",
      severity: "high",
      title: "Unverified contract",
      description: "Source code is not verified on the explorer.",
      scoreImpact: 22,
      evidence: [{ reason: "verified=false", source: src }],
    });
  } else {
    findings.push({
      id: "contract-verified-unknown",
      category: "Contract",
      severity: "info",
      title: "Insufficient data: verification status",
      description: "Could not determine whether source is verified.",
      scoreImpact: 6,
      evidence: [{ reason: "verified=null", source: src }],
    });
  }

  if (contract.createdAt) {
    const ageDays = (Date.now() - new Date(contract.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays < 14) {
      findings.push({
        id: "contract-new",
        category: "Contract",
        severity: "high",
        title: "Newly deployed contract",
        description: `Deployed ~${Math.round(ageDays)} days ago.`,
        scoreImpact: 18,
        evidence: [{ reason: `createdAt=${contract.createdAt}`, source: src, raw: { ageDays } }],
      });
    } else if (ageDays > 365) {
      findings.push({
        id: "contract-mature",
        category: "Contract",
        severity: "positive",
        title: "Mature deployment age",
        description: `On-chain for ~${Math.round(ageDays)} days.`,
        scoreImpact: -6,
        positive: true,
        evidence: [{ reason: `createdAt=${contract.createdAt}`, source: src, raw: { ageDays } }],
      });
    }
  }

  const upgradeable = contract.isProxy || contract.flags?.upgradeable;
  if (upgradeable) {
    findings.push({
      id: "contract-proxy",
      category: "Ownership",
      severity: "moderate",
      title: "Proxy / upgradeable pattern",
      description: "Contract appears proxy-based or upgradeable; implementation may change.",
      scoreImpact: 12,
      evidence: [
        {
          reason: "isProxy or upgradeable flag",
          source: src,
          raw: { isProxy: contract.isProxy, implementation: contract.implementation },
        },
      ],
    });
  }

  const mint = contract.flags?.mint ?? abiHas(contract.abi, "mint");
  const pause = contract.flags?.pause ?? abiHas(contract.abi, "pause");
  const blacklist =
    contract.flags?.blacklist ??
    (abiHas(contract.abi, "blacklist") || abiHas(contract.abi, "addToBlacklist"));

  if (mint) {
    findings.push({
      id: "abi-mint",
      category: "Ownership",
      severity: "moderate",
      title: "Mint privilege present",
      description: "ABI/heuristics indicate a mint function.",
      scoreImpact: 10,
      evidence: [{ reason: "mint flag/ABI", source: src }],
    });
  }
  if (pause) {
    findings.push({
      id: "abi-pause",
      category: "Ownership",
      severity: "moderate",
      title: "Pause privilege present",
      description: "ABI/heuristics indicate a pause function.",
      scoreImpact: 8,
      evidence: [{ reason: "pause flag/ABI", source: src }],
    });
  }
  if (blacklist) {
    findings.push({
      id: "abi-blacklist",
      category: "Ownership",
      severity: "high",
      title: "Blacklist privilege present",
      description: "ABI/heuristics indicate blacklist controls.",
      scoreImpact: 14,
      evidence: [{ reason: "blacklist flag/ABI", source: src }],
    });
  }

  if (contract.owner) {
    findings.push({
      id: "has-owner",
      category: "Ownership",
      severity: "info",
      title: "Owner address observed",
      description: `Owner/admin candidate: ${contract.owner}`,
      scoreImpact: 4,
      evidence: [{ reason: `owner=${contract.owner}`, source: src }],
    });
  }

  if (contract.flags?.honeypotHeuristic === true) {
    findings.push({
      id: "honeypot",
      category: "Security",
      severity: "critical",
      title: "Honeypot heuristic triggered",
      description: "Sell/transfer simulation heuristics suggest possible honeypot behavior.",
      scoreImpact: 40,
      evidence: [{ reason: "honeypotHeuristic=true", source: src }],
    });
  } else if (contract.flags?.honeypotHeuristic === false) {
    findings.push({
      id: "honeypot-clear",
      category: "Security",
      severity: "positive",
      title: "No honeypot heuristic hit",
      description: "Available heuristics did not flag honeypot behavior.",
      scoreImpact: -5,
      positive: true,
      evidence: [{ reason: "honeypotHeuristic=false", source: src }],
    });
  }

  const liq = market?.liquidityUsd ?? (contract as TokenData).liquidityUsd;
  if (typeof liq === "number") {
    if (liq < 10_000) {
      findings.push({
        id: "low-liquidity",
        category: "Liquidity",
        severity: "high",
        title: "Low liquidity",
        description: `Reported liquidity ~$${liq.toLocaleString()}.`,
        scoreImpact: 20,
        evidence: [{ reason: `liquidityUsd=${liq}`, source: market?.sources.join(", ") || src }],
      });
    } else if (liq > 1_000_000) {
      findings.push({
        id: "healthy-liquidity",
        category: "Liquidity",
        severity: "positive",
        title: "Healthy liquidity depth",
        description: `Reported liquidity ~$${liq.toLocaleString()}.`,
        scoreImpact: -6,
        positive: true,
        evidence: [{ reason: `liquidityUsd=${liq}`, source: market?.sources.join(", ") || src }],
      });
    } else {
      findings.push({
        id: "moderate-liquidity",
        category: "Liquidity",
        severity: "info",
        title: "Moderate liquidity",
        description: `Reported liquidity ~$${liq.toLocaleString()}.`,
        scoreImpact: 4,
        evidence: [{ reason: `liquidityUsd=${liq}`, source: market?.sources.join(", ") || src }],
      });
    }
  } else {
    findings.push({
      id: "liquidity-unknown",
      category: "Liquidity",
      severity: "info",
      title: "Insufficient data: liquidity",
      description: "No liquidity figure available from providers.",
      scoreImpact: 5,
      evidence: [{ reason: "liquidityUsd missing", source: src }],
    });
  }

  return findings;
}
