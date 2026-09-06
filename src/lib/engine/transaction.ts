import type { Finding, TransactionData } from "../types";

export function analyzeTransaction(tx: TransactionData): Finding[] {
  const findings: Finding[] = [];
  const src = tx.sources.join(", ") || "blockchain";

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
  }

  if (tx.method) {
    const risky = ["approve", "setapprovalforall", "transferownership", "permit"];
    if (risky.includes(tx.method.toLowerCase())) {
      findings.push({
        id: "tx-sensitive-method",
        category: "Transaction",
        severity: "moderate",
        title: `Sensitive method: ${tx.method}`,
        description: "This method can grant spending rights or change control — review carefully before signing similar txs.",
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
  }

  if (typeof tx.valueEth === "number" && tx.valueEth > 10) {
    findings.push({
      id: "tx-high-value",
      category: "Transaction",
      severity: "moderate",
      title: "High native value transfer",
      description: `Value ~${tx.valueEth} ETH.`,
      scoreImpact: 8,
      evidence: [{ reason: `valueEth=${tx.valueEth}`, source: src }],
    });
  }

  return findings;
}
