import type {
  ApprovalDelta,
  AssetDelta,
  Finding,
  SimulationStep,
  TransactionData,
  TxSimulation,
} from "../types";

const SENSITIVE = /approve|permit|setapprovalforall|transferownership|upgrade|selfdestruct|multicall|executetransaction/i;

/**
 * Build a TxSimulation from structured tx data only.
 * Without eth_call/trace/tenderly: status insufficient_data — never invent amounts/gas.
 * DEMO fixtures may attach a labeled simulation on TransactionData.simulation.
 */
export function buildTxSimulation(tx: TransactionData): TxSimulation {
  if (tx.simulation) {
    return tx.simulation;
  }

  // Live / no simulator backend: fail closed
  const src = tx.sources.join(", ") || "tx-simulator";
  return {
    status: "insufficient_data",
    steps: null,
    assetDeltas: null,
    approvalDeltas: null,
    gasUsedEstimate: null,
    revertReason: null,
    evidence: [
      {
        reason: "No eth_call/trace/tenderly simulator configured — cannot invent receive amounts or gas",
        source: src,
      },
    ],
    sources: ["tx-simulator-stub", src],
    demo: false,
  };
}

export function analyzeSimulation(sim: TxSimulation, tx?: TransactionData): Finding[] {
  const findings: Finding[] = [];
  const src = sim.sources.join(", ") || "tx-simulator";

  findings.push({
    id: "sim-analysis-only",
    category: "Transaction",
    severity: "info",
    title: "Simulation is analysis-only",
    description:
      "Sentinel never signs, broadcasts, or submits transactions. Results are evidence-backed assessments only.",
    scoreImpact: 0,
    evidence: [{ reason: "analysis-only disclaimer", source: "risk-engine" }],
  });

  if (sim.status === "insufficient_data" || sim.status === "unavailable") {
    findings.push({
      id: "sim-insufficient-data",
      category: "Transaction",
      severity: "info",
      title: "Insufficient data: simulation",
      description:
        sim.status === "unavailable"
          ? "Simulation backend unavailable. Treat outcomes as unknown — not safe."
          : "No eth_call/trace simulation available. Receive amounts and gas are unknown — not invented.",
      scoreImpact: 6,
      evidence: sim.evidence.length ? sim.evidence : [{ reason: `status=${sim.status}`, source: src }],
      recommendation: "Use Transaction Preview evidence and verify on a primary explorer before signing.",
    });
  }

  if (sim.status === "simulated" && sim.steps) {
    const reverted = sim.steps.filter((s) => s.status === "revert");
    if (reverted.length > 0) {
      findings.push({
        id: "sim-revert",
        category: "Transaction",
        severity: "high",
        title: "Simulation indicates revert",
        description: `${reverted.length} step(s) marked revert${sim.revertReason ? `: ${sim.revertReason}` : "."}`,
        scoreImpact: 22,
        evidence: [
          {
            reason: sim.revertReason ? `revertReason=${sim.revertReason}` : "step status=revert",
            source: src,
            raw: reverted,
          },
        ],
        recommendation: "Do not sign a similar transaction until the revert cause is understood.",
      });
    }
  }

  const outs = (sim.assetDeltas ?? []).filter((d) => d.direction === "out");
  for (const d of outs) {
    findings.push({
      id: "sim-value-out",
      category: "Transaction",
      severity: d.amount === null ? "info" : "moderate",
      title: d.amount === null ? "Insufficient data: outbound asset amount" : "Outbound asset movement",
      description:
        d.amount === null
          ? `Outbound ${d.symbol ?? d.token} amount unknown — not invented.`
          : `Outbound ${d.symbol ?? d.token}: ${d.amount}`,
      scoreImpact: d.amount === null ? 4 : 10,
      evidence: d.evidence.length ? d.evidence : [{ reason: `direction=out token=${d.token}`, source: src, raw: d }],
    });
  }

  for (const a of sim.approvalDeltas ?? []) {
    if (a.unlimited || (a.allowanceAfter && /unlimited|max/i.test(a.allowanceAfter))) {
      findings.push({
        id: "sim-unlimited-approval",
        category: "Security",
        severity: "high",
        title: "Simulation shows unlimited approval",
        description: `Unlimited allowance grant to ${a.spender} for ${a.token}.`,
        scoreImpact: 20,
        evidence: a.evidence.length
          ? a.evidence
          : [{ reason: "unlimited approval delta", source: src, raw: a }],
        recommendation: "Confirm spender and prefer exact allowances — Sentinel does not broadcast revokes.",
      });
    }
  }

  const method = tx?.method ?? "";
  const selectorHints = [
    method,
    ...(sim.steps ?? []).map((s) => s.op),
    ...(sim.steps ?? []).map((s) => s.selector ?? ""),
  ].join(" ");
  if (SENSITIVE.test(selectorHints) || SENSITIVE.test(method)) {
    findings.push({
      id: "sim-sensitive-method",
      category: "Transaction",
      severity: "moderate",
      title: "Sensitive method in simulation scope",
      description: `Sensitive op/method detected (${method || "see steps"}). Review carefully before signing.`,
      scoreImpact: 12,
      evidence: [
        {
          reason: `sensitive method/op hint`,
          source: src,
          raw: { method, steps: sim.steps?.map((s) => s.op) },
        },
      ],
    });
  }

  return findings;
}
