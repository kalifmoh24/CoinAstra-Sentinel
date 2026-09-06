import type {
  Evidence,
  Finding,
  RiskBand,
  XRayDimensionId,
  XRayDimensionScore,
  XRayProfile,
} from "../types";
import { DISCLAIMER } from "../types";
import { bandFromScore, clamp } from "../utils";

export const XRAY_WEIGHTS: Record<XRayDimensionId, number> = {
  security: 0.25,
  tokenomics: 0.15,
  liquidity: 0.2,
  onchain: 0.15,
  market: 0.1,
  ecosystem: 0.15,
};

export const XRAY_DIMS: XRayDimensionId[] = [
  "security",
  "tokenomics",
  "liquidity",
  "onchain",
  "market",
  "ecosystem",
];

function band(score: number | null): RiskBand | undefined {
  if (score == null) return undefined;
  return bandFromScore(score);
}

function dim(partial: Omit<XRayDimensionScore, "weight" | "band"> & { weight?: number }): XRayDimensionScore {
  const weight = partial.weight ?? XRAY_WEIGHTS[partial.id];
  return {
    ...partial,
    weight,
    band: band(partial.score),
  };
}

export function aggregateXRayOverall(dimensions: XRayDimensionScore[]): {
  overallScore: number | null;
  overallBand?: RiskBand;
  gaps: XRayDimensionId[];
} {
  const scored = dimensions.filter((d) => d.status === "scored" && d.score != null);
  const gaps = dimensions.filter((d) => d.score == null || d.status === "insufficient_data").map((d) => d.id);
  if (scored.length === 0) return { overallScore: null, gaps };
  const wSum = scored.reduce((s, d) => s + d.weight, 0);
  if (wSum <= 0) return { overallScore: null, gaps };
  const overallScore = clamp(Math.round(scored.reduce((s, d) => s + (d.score as number) * d.weight, 0) / wSum));
  return { overallScore, overallBand: bandFromScore(overallScore), gaps };
}

/** Fail-closed live profile when dimension providers are missing. */
export function buildInsufficientXRay(subject: string, chain: string): XRayProfile {
  const dimensions = XRAY_DIMS.map((id) =>
    dim({
      id,
      score: null,
      summary: "Insufficient data — dimension not evaluated (no invent).",
      findings: [
        {
          id: `xray-${id}-insufficient`,
          category: "Security",
          severity: "info",
          title: `Insufficient data: ${id}`,
          description: `No provider data for X-Ray ${id} dimension.`,
          scoreImpact: 5,
          evidence: [{ reason: `${id}=not_evaluated`, source: "xray-engine" }],
        },
      ],
      evidence: [{ reason: `${id} not evaluated`, source: "xray-engine" }],
      status: "insufficient_data",
    }),
  );
  const { overallScore, overallBand, gaps } = aggregateXRayOverall(dimensions);
  return {
    subject,
    chain,
    dimensions,
    overallScore,
    overallBand,
    gaps,
    sources: ["xray-engine"],
    demo: false,
    disclaimer: DISCLAIMER,
  };
}

export function buildDemoXRay(subject: string, chain = "ethereum"): XRayProfile {
  const ev = (reason: string): Evidence[] => [{ reason, source: "DEMO_FIXTURE" }];
  const finding = (id: string, title: string, description: string, scoreImpact: number): Finding => ({
    id,
    category: "Security",
    severity: scoreImpact >= 20 ? "high" : scoreImpact >= 10 ? "moderate" : "info",
    title,
    description,
    scoreImpact,
    evidence: ev(title),
  });

  const dimensions: XRayDimensionScore[] = [
    dim({
      id: "security",
      score: 72,
      summary: "Verified contract with privilege surface (DEMO).",
      findings: [finding("xray-sec-proxy", "Proxy/upgradeable pattern", "DEMO: proxy flags present.", 12)],
      evidence: ev("DEMO security dimension"),
      status: "demo",
      demo: true,
    }),
    dim({
      id: "tokenomics",
      score: 58,
      summary: "Supply and unlock heuristics (DEMO) — holders/unlocks folded here.",
      findings: [finding("xray-tok-unlock", "Unlock schedule unknown", "DEMO: unlock subpanel insufficient.", 8)],
      evidence: ev("DEMO tokenomics"),
      status: "demo",
      demo: true,
    }),
    dim({
      id: "liquidity",
      score: 64,
      summary: "Pool depth example (DEMO) — not live prices.",
      findings: [finding("xray-liq-depth", "Moderate DEMO liquidity", "DEMO fixture liquidity band.", 6)],
      evidence: ev("DEMO liquidity"),
      status: "demo",
      demo: true,
    }),
    dim({
      id: "onchain",
      score: 70,
      summary: "Activity and whale-fold heuristics (DEMO).",
      findings: [finding("xray-oc-activity", "Active DEMO transfers", "DEMO on-chain activity.", 4)],
      evidence: ev("DEMO onchain"),
      status: "demo",
      demo: true,
    }),
    dim({
      id: "market",
      score: null,
      summary: "Insufficient data — no live market feed (fail closed).",
      findings: [
        finding("xray-mkt-insufficient", "Insufficient data: market", "Market dimension not scored without feed.", 5),
      ],
      evidence: ev("market not evaluated in DEMO partial"),
      status: "insufficient_data",
      demo: true,
    }),
    dim({
      id: "ecosystem",
      score: 61,
      summary: "Integrations/governance fold (DEMO).",
      findings: [finding("xray-eco-gov", "Governance surface present", "DEMO ecosystem/governance.", 5)],
      evidence: ev("DEMO ecosystem"),
      status: "demo",
      demo: true,
    }),
  ];

  // Treat demo scored dims as scored for overall (status demo still has numeric score)
  const forOverall = dimensions.map((d) =>
    d.score != null ? { ...d, status: "scored" as const } : d,
  );
  const { overallScore, overallBand, gaps } = aggregateXRayOverall(forOverall);

  return {
    subject,
    chain,
    dimensions,
    overallScore,
    overallBand,
    gaps,
    sources: ["DEMO_FIXTURE", "xray-engine"],
    demo: true,
    disclaimer: DISCLAIMER,
    aiExplanation:
      "DEMO X-Ray: dimension scores are fixture-labeled. Market left insufficient on purpose. AI does not invent scores.",
  };
}

export function runXRay(subject: string, chain: string, demo: boolean): XRayProfile {
  if (demo) return buildDemoXRay(subject, chain);
  return buildInsufficientXRay(subject, chain);
}
