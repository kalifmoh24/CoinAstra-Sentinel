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

export type ActivityRiskLevel = "critical" | "high" | "moderate" | "low" | "info" | "unknown";

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
  /** Actionable guidance for critical/high findings (engine or id-mapped). */
  recommendation?: string;
}

export interface CategoryScore {
  category: RiskCategory;
  score: number;
  weight: number;
  summary: string;
}

/** Recent wallet tx row when provider/demo fixtures supply history. */
export interface WalletActivityItem {
  date: string;
  amount?: string | null;
  asset?: string | null;
  from?: string | null;
  to?: string | null;
  riskLevel?: ActivityRiskLevel;
  contractInteraction?: boolean;
  hash?: string | null;
  method?: string | null;
}

/** Subject header fields for token/contract results — only when present in provider data. */
export interface SubjectMeta {
  name?: string | null;
  symbol?: string | null;
  chain?: string;
  verified?: boolean | null;
  deployer?: string | null;
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
  /** Wallet activity timeline when available from provider/demo. */
  activity?: WalletActivityItem[];
  /** Token/contract header metadata when available (never invent facts). */
  subject?: SubjectMeta;
  txMeta?: {
    from?: string | null;
    to?: string | null;
    valueEth?: number | null;
    method?: string | null;
    status?: string | null;
    timestamp?: string | null;
    interactsWithContract?: boolean;
  };
  walletMeta?: {
    firstSeen?: string | null;
    txCount?: number | null;
    balanceEth?: number | null;
    labels?: string[];
  };
  /** Structured ERC-20 approvals when evaluated (null/omit = not evaluated). */
  approvals?: TokenApproval[] | null;
  /** Structured holdings when evaluated (null/omit = not evaluated). */
  holdings?: WalletHolding[] | null;
}


export interface TokenApproval {
  token: string;
  spender: string;
  /** Human-readable allowance when known; null = Insufficient data (never invent 0/unlimited) */
  allowance: string | null;
  allowanceRaw?: string | null;
  unlimited: boolean;
  lastSeen?: string | null;
  evidence: Evidence[];
  sources: string[];
  demo?: boolean;
}

export interface WalletHolding {
  token: string;
  symbol?: string | null;
  decimals?: number | null;
  /** Human-readable balance when known; omit/null when unknown — never invent balances */
  balance: string | null;
  balanceRaw?: string | null;
  evidence: Evidence[];
  sources: string[];
  demo?: boolean;
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
  /** true/false only when detected; null = not evaluated (never invent false-clean) */
  rapidMovement?: boolean | null;
  /** count when computed; null = not evaluated */
  newContractInteractions?: number | null;
  /** true/false only when detected; null = not evaluated (never invent false-clean) */
  mixerExposure?: boolean | null;
  /** Recent activity rows when tx history is available. */
  activity?: WalletActivityItem[];
  /** null = not evaluated; [] = evaluated empty only when provider truly returned empty */
  approvals?: TokenApproval[] | null;
  /** null = not evaluated; [] = evaluated empty only when provider truly returned empty */
  holdings?: WalletHolding[] | null;
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
  /** Deployer/creator when known from provider — never invented. */
  deployer?: string | null;
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
  /** true = confirmed hit; false = confirmed clear; null = vendor data unavailable */
  sanctionsHit?: boolean | null;
  /** report count when known; null = vendor data unavailable (never invent 0) */
  phishingReports?: number | null;
  /** true = confirmed malicious; false = confirmed clear; null = vendor data unavailable */
  knownMalicious?: boolean | null;
  notes?: string[];
  demo?: boolean;
  sources: string[];
}

export const DISCLAIMER =
  "Sentinel scores are analytical assessments based on available on-chain and provider data. They are not financial, legal, or security guarantees. Always do your own research before signing transactions or interacting with contracts.";
