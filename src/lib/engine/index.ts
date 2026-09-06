import type {
  ContractData,
  Finding,
  MarketData,
  ScanResult,
  SecurityIntel,
  SubjectMeta,
  TokenData,
  TransactionData,
  WalletData,
} from "../types";
import { DISCLAIMER } from "../types";
import { analyzeContract } from "./contract";
import { analyzeToken } from "./token";
import { aggregateScore } from "./score";
import { analyzeTransaction } from "./transaction";
import { analyzeWallet } from "./wallet";
import { withRecommendations } from "./recommendations";

export interface EngineInput {
  id: string;
  input: string;
  inputType: ScanResult["inputType"];
  chain: string;
  demo: boolean;
  wallet?: WalletData | null;
  contract?: ContractData | TokenData | null;
  token?: TokenData | null;
  tx?: TransactionData | null;
  market?: MarketData | null;
  security?: SecurityIntel | null;
  aiExplanation: string;
  createdAt?: string;
}

function buildSubject(
  inputType: ScanResult["inputType"],
  chain: string,
  contract?: ContractData | TokenData | null,
  token?: TokenData | null,
): SubjectMeta | undefined {
  if (inputType !== "token" && inputType !== "contract") return undefined;
  const src = token ?? contract;
  if (!src) return undefined;
  const meta: SubjectMeta = { chain };
  if (src.name != null) meta.name = src.name;
  const symbol =
    token?.symbol ??
    ("symbol" in src ? (src as TokenData).symbol : undefined);
  if (symbol != null) meta.symbol = symbol;
  if (src.verified !== undefined) meta.verified = src.verified;
  if (src.deployer != null) meta.deployer = src.deployer;
  // Only attach when at least one subject field beyond chain is present
  if (
    meta.name == null &&
    meta.symbol == null &&
    meta.verified === undefined &&
    meta.deployer == null
  ) {
    return undefined;
  }
  return meta;
}

export function runRiskEngine(input: EngineInput): ScanResult {
  let findings: Finding[] = [];

  if (input.wallet) findings.push(...analyzeWallet(input.wallet, input.security ?? undefined));

  // Prefer token analyzer when subject is a token (includes contract heuristics + token signals)
  if (input.inputType === "token" && input.token) {
    findings.push(...analyzeToken(input.token, input.market ?? undefined));
  } else if (input.token && !input.contract) {
    findings.push(...analyzeToken(input.token, input.market ?? undefined));
  } else if (input.contract) {
    if (input.inputType === "token" || (input.token && "symbol" in input.token && input.token.symbol)) {
      findings.push(...analyzeToken((input.token ?? input.contract) as TokenData, input.market ?? undefined));
    } else {
      findings.push(...analyzeContract(input.contract, input.market ?? undefined));
    }
  } else if (input.token) {
    findings.push(...analyzeToken(input.token, input.market ?? undefined));
  }

  if (input.tx) findings.push(...analyzeTransaction(input.tx));

  if (findings.length === 0) {
    findings.push({
      id: "insufficient-global",
      category: "Security",
      severity: "info",
      title: "Insufficient data",
      description: "Providers returned insufficient structured data to score this subject.",
      scoreImpact: 15,
      evidence: [{ reason: "no analyzer findings", source: "risk-engine" }],
    });
  }

  findings = withRecommendations(findings);

  const { score, band, categories } = aggregateScore(findings);
  const dataSources = Array.from(
    new Set(
      [
        ...(input.wallet?.sources ?? []),
        ...(input.contract?.sources ?? []),
        ...(input.token?.sources ?? []),
        ...(input.tx?.sources ?? []),
        ...(input.market?.sources ?? []),
        ...(input.security?.sources ?? []),
        "risk-engine",
      ].filter(Boolean),
    ),
  );

  const activity =
    input.inputType === "wallet" && input.wallet?.activity && input.wallet.activity.length > 0
      ? input.wallet.activity
      : undefined;

  const subject = buildSubject(input.inputType, input.chain, input.contract, input.token);

  return {
    id: input.id,
    createdAt: input.createdAt ?? new Date().toISOString(),
    input: input.input,
    inputType: input.inputType,
    chain: input.chain,
    demo: input.demo,
    score,
    band,
    categories,
    findings,
    criticalFindings: findings.filter((f) => f.severity === "critical" || f.severity === "high"),
    positiveFindings: findings.filter((f) => f.positive || f.severity === "positive"),
    aiExplanation: input.aiExplanation,
    dataSources,
    disclaimer: DISCLAIMER,
    insufficientData: findings.every((f) => f.title.toLowerCase().includes("insufficient")),
    activity,
    subject,
  };
}

export { analyzeWallet, analyzeContract, analyzeToken, analyzeTransaction, aggregateScore };
export { withRecommendations, recommendationForFinding, isDangerousPermissionFinding } from "./recommendations";
