import type { Finding, MarketData, TokenData } from "../types";
import { analyzeContract } from "./contract";

/**
 * Token-focused analyzer. Reuses contract heuristics, then adds token-specific
 * liquidity / supply / holder evidence. Deterministic only — no invented facts.
 */
export function analyzeToken(token: TokenData, market?: MarketData): Finding[] {
  const findings: Finding[] = analyzeContract(token, market);
  const src = token.sources.join(", ") || "token-analysis";

  if (token.symbol) {
    findings.push({
      id: "token-symbol",
      category: "Contract",
      severity: "info",
      title: `Token symbol: ${token.symbol}`,
      description: token.name
        ? `Reported as ${token.name} (${token.symbol}).`
        : `Symbol reported as ${token.symbol}.`,
      scoreImpact: 0,
      evidence: [
        {
          reason: `symbol=${token.symbol}`,
          source: src,
          raw: { symbol: token.symbol, name: token.name, decimals: token.decimals },
        },
      ],
    });
  } else {
    findings.push({
      id: "token-symbol-unknown",
      category: "Contract",
      severity: "info",
      title: "Insufficient data: token symbol",
      description: "Providers did not return a token symbol.",
      scoreImpact: 4,
      evidence: [{ reason: "symbol missing", source: src }],
    });
  }

  if (typeof token.decimals === "number") {
    if (token.decimals > 18 || token.decimals < 0) {
      findings.push({
        id: "token-decimals-unusual",
        category: "Contract",
        severity: "moderate",
        title: "Unusual decimals",
        description: `Decimals reported as ${token.decimals} (typical ERC-20 range is 0–18).`,
        scoreImpact: 8,
        evidence: [{ reason: `decimals=${token.decimals}`, source: src }],
      });
    }
  } else {
    findings.push({
      id: "token-decimals-unknown",
      category: "Contract",
      severity: "info",
      title: "Insufficient data: decimals",
      description: "Token decimals were not available from providers.",
      scoreImpact: 3,
      evidence: [{ reason: "decimals missing", source: src }],
    });
  }

  if (token.totalSupply) {
    findings.push({
      id: "token-supply",
      category: "Ownership",
      severity: "info",
      title: "Total supply observed",
      description: `Reported total supply: ${token.totalSupply}.`,
      scoreImpact: 2,
      evidence: [{ reason: `totalSupply=${token.totalSupply}`, source: src }],
    });
  } else {
    findings.push({
      id: "token-supply-unknown",
      category: "Ownership",
      severity: "info",
      title: "Insufficient data: total supply",
      description: "Total supply was not returned by providers.",
      scoreImpact: 4,
      evidence: [{ reason: "totalSupply missing", source: src }],
    });
  }

  if (typeof token.holdersApprox === "number") {
    if (token.holdersApprox < 50) {
      findings.push({
        id: "token-few-holders",
        category: "Liquidity",
        severity: "high",
        title: "Very few holders",
        description: `Approximately ${token.holdersApprox} holders reported — concentration risk.`,
        scoreImpact: 16,
        evidence: [{ reason: `holdersApprox=${token.holdersApprox}`, source: src }],
      });
    } else if (token.holdersApprox > 10_000) {
      findings.push({
        id: "token-broad-holders",
        category: "Liquidity",
        severity: "positive",
        title: "Broad holder base",
        description: `Approximately ${token.holdersApprox.toLocaleString()} holders reported.`,
        scoreImpact: -5,
        positive: true,
        evidence: [{ reason: `holdersApprox=${token.holdersApprox}`, source: src }],
      });
    } else {
      findings.push({
        id: "token-moderate-holders",
        category: "Liquidity",
        severity: "info",
        title: "Moderate holder count",
        description: `Approximately ${token.holdersApprox.toLocaleString()} holders reported.`,
        scoreImpact: 3,
        evidence: [{ reason: `holdersApprox=${token.holdersApprox}`, source: src }],
      });
    }
  } else {
    findings.push({
      id: "token-holders-unknown",
      category: "Liquidity",
      severity: "info",
      title: "Insufficient data: holders",
      description: "Holder count was not available from providers.",
      scoreImpact: 5,
      evidence: [{ reason: "holdersApprox missing", source: src }],
    });
  }

  const vol = market?.volume24h;
  if (typeof vol === "number") {
    if (vol < 1_000) {
      findings.push({
        id: "token-low-volume",
        category: "Liquidity",
        severity: "moderate",
        title: "Very low 24h volume",
        description: `Reported 24h volume ~$${vol.toLocaleString()}.`,
        scoreImpact: 10,
        evidence: [
          {
            reason: `volume24h=${vol}`,
            source: market?.sources.join(", ") || src,
          },
        ],
      });
    }
  }

  const price = market?.priceUsd;
  if (typeof price === "number" && price === 0) {
    findings.push({
      id: "token-zero-price",
      category: "Liquidity",
      severity: "high",
      title: "Zero reported price",
      description: "Market provider reported a $0 price — treat with caution.",
      scoreImpact: 14,
      evidence: [{ reason: "priceUsd=0", source: market?.sources.join(", ") || src }],
    });
  }

  return findings;
}
