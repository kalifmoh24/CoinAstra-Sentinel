export type InputType = "wallet" | "token" | "contract" | "transaction" | "unknown";

export type RiskBand = "Very Low" | "Low" | "Moderate" | "High" | "Critical";

export type RiskCategory =
  | "Security"
  | "Contract"
  | "Wallet"
  | "Liquidity"
  | "Ownership"
  | "Transaction";

export type FindingSeverity = "critical" | "high" | "moderate" | "low" | "info" | "positive";

export interface Evidence {
  reason: string;
  source: string;
  raw?: unknown;
}

export interface Finding {
  id: string;
  category: RiskCategory;
  severity: FindingSeverity;
  title: string;
  description: string;
  scoreImpact: number;
  evidence: Evidence[];
  positive?: boolean;
}

export interface CategoryScore {
  category: RiskCategory;
  score: number;
  weight: number;
  summary: string;
}

export interface ScanResult {
  id: string;
  createdAt: string;
  input: string;
  inputType: InputType;
  chain: string;
  demo: boolean;
  score: number;
  band: RiskBand;
  categories: CategoryScore[];
  findings: Finding[];
  criticalFindings: Finding[];
  positiveFindings: Finding[];
  aiExplanation: string;
  dataSources: string[];
  disclaimer: string;
  insufficientData?: boolean;
}

export interface WalletData {
  address: string;
  chain: string;
  firstSeen?: string | null;
  txCount?: number | null;
  balanceEth?: number | null;
  labels?: string[];
  interactions?: Array<{ address: string; label?: string; risk?: string }>;
  fundingSource?: { address: string; label?: string; risk?: string } | null;
  rapidMovement?: boolean;
  newContractInteractions?: number;
  mixerExposure?: boolean;
  demo?: boolean;
  sources: string[];
}

export interface ContractData {
  address: string;
  chain: string;
  isContract: boolean;
  verified?: boolean | null;
  name?: string | null;
  compiler?: string | null;
  createdAt?: string | null;
  isProxy?: boolean | null;
  implementation?: string | null;
  owner?: string | null;
  abi?: unknown[] | null;
  sourceCode?: string | null;
  flags?: {
    mint?: boolean;
    pause?: boolean;
    blacklist?: boolean;
    upgradeable?: boolean;
    honeypotHeuristic?: boolean | null;
  };
  demo?: boolean;
  sources: string[];
}

export interface TokenData extends ContractData {
  symbol?: string | null;
  decimals?: number | null;
  totalSupply?: string | null;
  holdersApprox?: number | null;
  liquidityUsd?: number | null;
}

export interface TransactionData {
  hash: string;
  chain: string;
  from?: string | null;
  to?: string | null;
  valueEth?: number | null;
  timestamp?: string | null;
  status?: string | null;
  method?: string | null;
  interactsWithContract?: boolean;
  demo?: boolean;
  sources: string[];
}

export interface MarketData {
  priceUsd?: number | null;
  liquidityUsd?: number | null;
  volume24h?: number | null;
  demo?: boolean;
  sources: string[];
}

export interface SecurityIntel {
  sanctionsHit?: boolean;
  phishingReports?: number;
  knownMalicious?: boolean;
  notes?: string[];
  demo?: boolean;
  sources: string[];
}

export const DISCLAIMER =
  "Sentinel scores are analytical assessments based on available on-chain and provider data. They are not financial, legal, or security guarantees. Always do your own research before signing transactions or interacting with contracts.";
