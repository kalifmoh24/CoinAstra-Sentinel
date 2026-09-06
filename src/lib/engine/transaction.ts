import type { Finding, TransactionData } from "../types";

const SENSITIVE = new Set([
  "approve",
  "setapprovalforall",
  "transferownership",
  "permit",
  "increasetotalallowance",
  "permit2",
  "executetransaction",
  "multicall",
  "swapandbridge",
]);

const ULTRA_SENSITIVE = new Set([
  "setapprovalforall",
  "transferownership",
  "upgradeTo",
  "upgradeto",
  "upgradetoandcall",
  "selfdestruct",
]);

/**
 * Transaction preview / analysis only — never executes or signs.
 */
export function analyzeTransaction(tx: TransactionData): Finding[] {
  const findings: Finding[] = [];
  const src = tx.sources.join(", ") || "blockchain";

  findings.push({
    id: "tx-analysis-only",
    category: "Transaction",
    severity: "info",
    title: "Analysis only — not executed",
    description:
      "Sentinel previews and scores this transaction from available data. It never signs, broadcasts, or submits transactions.",
    scoreImpact: 0,
    evidence: [{ reason: "analysis-only mode", source: "risk-engine" }],
  });

  if (tx.status && tx.status !== "success") {
    findings.push({
      id: "tx-failed",
      category: "Transaction",
      severity: "moderate",
      title: "Transaction not successful",
      description: `Status: ${tx.status}`,
      scoreImpact: 8,
      evidence: [{ reason: `status=${tx.status}`, source: src }],
    });
  } else if (tx.status === "success") {
    findings.push({
      id: "tx-success",
      category: "Transaction",
      severity: "info",
      title: "Transaction succeeded on-chain",
      description: "Explorer/provider reports a successful status for this hash.",
      scoreImpact: 0,
      evidence: [{ reason: "status=success", source: src }],
    });
  } else {
    findings.push({
      id: "tx-status-unknown",
      category: "Transaction",
      severity: "info",
      title: "Insufficient data: status",
      description: "Transaction status was not available from providers.",
      scoreImpact: 2,
      evidence: [{ reason: "status missing", source: src }],
    });
  }

  if (tx.method) {
    const methodKey = tx.method.toLowerCase();
    if (ULTRA_SENSITIVE.has(methodKey) || ULTRA_SENSITIVE.has(tx.method)) {
      findings.push({
        id: "tx-ultra-sensitive",
        category: "Transaction",
        severity: "high",
        title: `High-impact method: ${tx.method}`,
        description:
          "This method can permanently change approvals, ownership, or upgrade paths — review carefully before signing similar transactions.",
        scoreImpact: 20,
        evidence: [{ reason: `method=${tx.method}`, source: src }],
      });
    } else if (SENSITIVE.has(methodKey)) {
      findings.push({
        id: "tx-sensitive-method",
        category: "Transaction",
        severity: "moderate",
        title: `Sensitive method: ${tx.method}`,
        description:
          "This method can grant spending rights or change control — review carefully before signing similar txs.",
        scoreImpact: 12,
        evidence: [{ reason: `method=${tx.method}`, source: src }],
      });
    } else {
      findings.push({
        id: "tx-method",
        category: "Transaction",
        severity: "info",
        title: `Method: ${tx.method}`,
        description: "Decoded method name from available data.",
        scoreImpact: 2,
        evidence: [{ reason: `method=${tx.method}`, source: src }],
      });
    }

    if (methodKey === "approve" || methodKey === "permit") {
      findings.push({
        id: "tx-approve-review",
        category: "Security",
        severity: "moderate",
        title: "Token approval pattern",
        description:
          "Approve/permit can grant a spender unlimited or large allowances. Confirm the spender and amount before signing similar txs.",
        scoreImpact: 10,
        evidence: [{ reason: `method=${tx.method} (approval family)`, source: src }],
      });
    }
  } else {
    findings.push({
      id: "tx-method-unknown",
      category: "Transaction",
      severity: "info",
      title: "Insufficient data: method",
      description: "Could not decode method selector.",
      scoreImpact: 3,
      evidence: [{ reason: "method missing", source: src }],
    });
  }

  if (tx.interactsWithContract) {
    findings.push({
      id: "tx-contract-interaction",
      category: "Transaction",
      severity: "info",
      title: "Interacts with a contract",
      description: "Transaction target appears to be a contract account.",
      scoreImpact: 4,
      evidence: [{ reason: "interactsWithContract=true", source: src, raw: { to: tx.to } }],
    });
  } else if (tx.to) {
    findings.push({
      id: "tx-eoa-transfer",
      category: "Transaction",
      severity: "info",
      title: "Appears to target an EOA",
      description: "No contract-interaction flag on the recipient from available data.",
      scoreImpact: 1,
      evidence: [{ reason: "interactsWithContract=false", source: src, raw: { to: tx.to } }],
    });
  }

  if (typeof tx.valueEth === "number") {
    if (tx.valueEth > 50) {
      findings.push({
        id: "tx-very-high-value",
        category: "Transaction",
        severity: "high",
        title: "Very high native value transfer",
        description: `Value ~${tx.valueEth} ETH.`,
        scoreImpact: 14,
        evidence: [{ reason: `valueEth=${tx.valueEth}`, source: src }],
      });
    } else if (tx.valueEth > 10) {
      findings.push({
        id: "tx-high-value",
        category: "Transaction",
        severity: "moderate",
        title: "High native value transfer",
        description: `Value ~${tx.valueEth} ETH.`,
        scoreImpact: 8,
        evidence: [{ reason: `valueEth=${tx.valueEth}`, source: src }],
      });
    } else if (tx.valueEth > 0) {
      findings.push({
        id: "tx-value",
        category: "Transaction",
        severity: "info",
        title: "Native value attached",
        description: `Value ~${tx.valueEth} ETH.`,
        scoreImpact: 2,
        evidence: [{ reason: `valueEth=${tx.valueEth}`, source: src }],
      });
    }
  } else {
    findings.push({
      id: "tx-value-unknown",
      category: "Transaction",
      severity: "info",
      title: "Insufficient data: value",
      description: "Native transfer value was not available.",
      scoreImpact: 2,
      evidence: [{ reason: "valueEth missing", source: src }],
    });
  }

  if (tx.from && tx.to && tx.from.toLowerCase() === tx.to.toLowerCase()) {
    findings.push({
      id: "tx-self",
      category: "Transaction",
      severity: "info",
      title: "Self-directed transaction",
      description: "From and to addresses match.",
      scoreImpact: 1,
      evidence: [{ reason: "from===to", source: src }],
    });
  }

  if (!tx.from || !tx.to) {
    findings.push({
      id: "tx-parties-unknown",
      category: "Transaction",
      severity: "info",
      title: "Insufficient data: parties",
      description: "From and/or to address missing from provider response.",
      scoreImpact: 3,
      evidence: [{ reason: "from/to incomplete", source: src, raw: { from: tx.from, to: tx.to } }],
    });
  }

  if (tx.timestamp) {
    findings.push({
      id: "tx-timestamp",
      category: "Transaction",
      severity: "info",
      title: "Timestamp observed",
      description: `Provider timestamp: ${tx.timestamp}`,
      scoreImpact: 0,
      evidence: [{ reason: `timestamp=${tx.timestamp}`, source: src }],
    });
  }

  return findings;
}
