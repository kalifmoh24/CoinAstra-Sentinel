/**
 * AI Agent Firewall — evaluate only.
 * Never signs, broadcasts, or bypasses a deny rule.
 */

export type PolicyDecision = "allow" | "block" | "review";

export type SecurityPolicyInput = {
  maxUsd?: number | null;
  maxUnknownRecipient?: boolean;
  maxContractRisk?: number | null;
  blockedAddresses?: string[];
  blockedContracts?: string[];
};

export type PolicyProposal = {
  action: string;
  amountUsd?: number | null;
  recipient?: string | null;
  contract?: string | null;
  riskScore?: number | null;
  knownRecipient?: boolean | null;
};

export type PolicyVerdict = {
  decision: PolicyDecision;
  reason: string;
  policy: SecurityPolicyInput;
  proposal: PolicyProposal;
  evidence: Array<{ reason: string; source: string }>;
  engineVersion: string;
};

const DEFAULT_POLICY: SecurityPolicyInput = {
  maxUsd: 1000,
  maxUnknownRecipient: true,
  maxContractRisk: 80,
  blockedAddresses: [],
  blockedContracts: [],
};

export function evaluatePolicy(
  proposal: PolicyProposal,
  policy: SecurityPolicyInput = DEFAULT_POLICY,
): PolicyVerdict {
  const merged = { ...DEFAULT_POLICY, ...policy };
  const evidence: PolicyVerdict["evidence"] = [];
  const recip = proposal.recipient?.toLowerCase() ?? "";
  const contract = proposal.contract?.toLowerCase() ?? "";

  if (recip && (merged.blockedAddresses ?? []).some((a) => a.toLowerCase() === recip)) {
    return done("block", "Recipient is on the blocked-address policy list.", merged, proposal, [
      { reason: `blocked recipient ${proposal.recipient}`, source: "security-policy" },
    ]);
  }
  if (contract && (merged.blockedContracts ?? []).some((a) => a.toLowerCase() === contract)) {
    return done("block", "Contract is on the blocked-contract policy list.", merged, proposal, [
      { reason: `blocked contract ${proposal.contract}`, source: "security-policy" },
    ]);
  }
  if (merged.maxUsd != null && proposal.amountUsd != null && proposal.amountUsd > merged.maxUsd) {
    return done(
      "block",
      `Transaction exceeds configured policy (max $${merged.maxUsd}, requested $${proposal.amountUsd}).`,
      merged,
      proposal,
      [{ reason: `amount ${proposal.amountUsd} > max ${merged.maxUsd}`, source: "security-policy" }],
    );
  }
  if (merged.maxUnknownRecipient && proposal.recipient && proposal.knownRecipient === false) {
    return done("block", "Unknown recipient is not allowed by policy.", merged, proposal, [
      { reason: "knownRecipient=false", source: "security-policy" },
    ]);
  }
  if (
    merged.maxContractRisk != null &&
    proposal.riskScore != null &&
    proposal.riskScore >= merged.maxContractRisk
  ) {
    return done(
      "block",
      `Subject risk score ${proposal.riskScore} meets or exceeds policy max ${merged.maxContractRisk}.`,
      merged,
      proposal,
      [{ reason: `risk ${proposal.riskScore} >= ${merged.maxContractRisk}`, source: "security-policy" }],
    );
  }

  if (proposal.amountUsd == null && proposal.riskScore == null) {
    evidence.push({
      reason: "Amount and risk score not provided — cannot fully evaluate. Review required.",
      source: "security-policy",
    });
    return done("review", "Insufficient data to auto-allow. Manual review required.", merged, proposal, evidence);
  }

  return done("allow", "Proposal is within the configured policy.", merged, proposal, [
    { reason: "no deny rule matched", source: "security-policy" },
  ]);
}

function done(
  decision: PolicyDecision,
  reason: string,
  policy: SecurityPolicyInput,
  proposal: PolicyProposal,
  evidence: PolicyVerdict["evidence"],
): PolicyVerdict {
  return { decision, reason, policy, proposal, evidence, engineVersion: "policy-1.0" };
}
