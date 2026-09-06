import type {
  ContractData,
  MarketData,
  SecurityIntel,
  TokenApproval,
  TokenData,
  TransactionData,
  WalletActivityItem,
  WalletData,
  WalletHolding,
} from "../types";

/** DEMO fixtures — clearly labeled; used when DEMO_MODE or API keys missing. */

export const DEMO_WALLET_ACTIVITY: WalletActivityItem[] = [
  {
    date: "2024-11-02T15:22:11.000Z",
    amount: "0",
    asset: "ETH",
    from: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
    to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    riskLevel: "moderate",
    contractInteraction: true,
    hash: "0xabc123def4567890abc123def4567890abc123def4567890abc123def4567890",
    method: "approve",
  },
  {
    date: "2024-10-18T09:11:00.000Z",
    amount: "1.25",
    asset: "ETH",
    from: "0xDemoCEXHotWallet00000000000000000001",
    to: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
    riskLevel: "low",
    contractInteraction: false,
    hash: "0xdemo000000000000000000000000000000000000000000000000000000000001",
    method: "transfer",
  },
  {
    date: "2024-09-01T14:05:33.000Z",
    amount: "0.4",
    asset: "ETH",
    from: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
    to: "0xDemoMixerStub000000000000000000000001",
    riskLevel: "high",
    contractInteraction: true,
    hash: "0xdemo000000000000000000000000000000000000000000000000000000000002",
    method: "deposit",
  },
  {
    date: "2024-08-12T11:40:00.000Z",
    amount: "2.0",
    asset: "ETH",
    from: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
    to: "0x1111111254EEB25477B68fb85Ed929f73A960582",
    riskLevel: "low",
    contractInteraction: true,
    hash: "0xdemo000000000000000000000000000000000000000000000000000000000003",
    method: "swap",
  },
];


export const DEMO_APPROVALS: TokenApproval[] = [
  {
    token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    spender: "0x1111111254EEB25477B68fb85Ed929f73A960582",
    allowance: "unlimited",
    allowanceRaw: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    unlimited: true,
    lastSeen: "2024-11-02T15:22:11.000Z",
    evidence: [
      {
        reason: "DEMO fixture: Approval log value MaxUint256 for aggregation router spender",
        source: "DEMO_FIXTURE",
        raw: { unlimited: true },
      },
    ],
    sources: ["DEMO_FIXTURE"],
    demo: true,
  },
  {
    token: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    spender: "0xDemoSpenderRisk000000000000000000000001",
    allowance: "500000.0",
    allowanceRaw: "500000000000",
    unlimited: false,
    lastSeen: "2024-09-01T14:05:33.000Z",
    evidence: [
      {
        reason: "DEMO fixture: finite allowance to unlabeled/risky spender stub",
        source: "DEMO_FIXTURE",
        raw: { risk: "high" },
      },
    ],
    sources: ["DEMO_FIXTURE"],
    demo: true,
  },
  {
    token: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    spender: "0xDemoMixerStub000000000000000000000001",
    allowance: "unlimited",
    allowanceRaw: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    unlimited: true,
    lastSeen: "2024-08-12T11:40:00.000Z",
    evidence: [
      {
        reason: "DEMO fixture: unlimited allowance to mixer-like high-risk spender",
        source: "DEMO_FIXTURE",
        raw: { spenderRisk: "high" },
      },
    ],
    sources: ["DEMO_FIXTURE"],
    demo: true,
  },
  {
    token: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    spender: "0xOldRouterStub00000000000000000000000001",
    allowance: "1000.0",
    allowanceRaw: "1000000000000000000000",
    unlimited: false,
    lastSeen: "2022-01-15T10:00:00.000Z",
    evidence: [
      {
        reason: "DEMO fixture: stale approval lastSeen > 365 days ago",
        source: "DEMO_FIXTURE",
        raw: { stale: true },
      },
    ],
    sources: ["DEMO_FIXTURE"],
    demo: true,
  },
];


export const DEMO_HOLDINGS: WalletHolding[] = [
  {
    token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "DUSDC",
    decimals: 6,
    balance: "12500.5",
    balanceRaw: "12500500000",
    evidence: [{ reason: "DEMO fixture token balance", source: "DEMO_FIXTURE" }],
    sources: ["DEMO_FIXTURE"],
    demo: true,
  },
  {
    token: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    symbol: "DDAI",
    decimals: 18,
    balance: "320.0",
    balanceRaw: "320000000000000000000",
    evidence: [{ reason: "DEMO fixture token balance", source: "DEMO_FIXTURE" }],
    sources: ["DEMO_FIXTURE"],
    demo: true,
  },
  {
    token: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "DTUSDT",
    decimals: 6,
    balance: "890.25",
    balanceRaw: "890250000",
    evidence: [{ reason: "DEMO fixture token balance", source: "DEMO_FIXTURE" }],
    sources: ["DEMO_FIXTURE"],
    demo: true,
  },
];


export const DEMO_WALLET: WalletData = {
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
  chain: "ethereum",
  firstSeen: "2021-03-14T12:00:00.000Z",
  txCount: 1842,
  balanceEth: 12.4,
  labels: ["DEMO"],
  interactions: [
    { address: "0x1111111254EEB25477B68fb85Ed929f73A960582", label: "Aggregation router", risk: "low" },
    { address: "0xDemoMixerStub000000000000000000000001", label: "Mixer-like stub (DEMO)", risk: "high" },
  ],
  fundingSource: {
    address: "0xDemoCEXHotWallet00000000000000000001",
    label: "CEX hot wallet (DEMO)",
    risk: "low",
  },
  rapidMovement: false,
  newContractInteractions: 3,
  mixerExposure: true,
  activity: DEMO_WALLET_ACTIVITY,
  approvals: DEMO_APPROVALS,
  holdings: DEMO_HOLDINGS,
  demo: true,
  sources: ["DEMO_FIXTURE"],
};

export const DEMO_CONTRACT: ContractData = {
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  chain: "ethereum",
  isContract: true,
  verified: true,
  name: "DemoUSD Coin (DEMO)",
  compiler: "v0.8.20",
  createdAt: "2020-01-01T00:00:00.000Z",
  isProxy: true,
  implementation: "0x43506849D7C04F9138D1A2050bbF3A0c054402dd",
  owner: "0xDemoOwnerMultisig0000000000000000001",
  deployer: "0xDemoDeployer00000000000000000000000001",
  abi: [
    { type: "function", name: "mint", inputs: [{ type: "address" }, { type: "uint256" }] },
    { type: "function", name: "pause", inputs: [] },
    { type: "function", name: "blacklist", inputs: [{ type: "address" }] },
    { type: "function", name: "transfer", inputs: [{ type: "address" }, { type: "uint256" }] },
  ],
  flags: {
    mint: true,
    pause: true,
    blacklist: true,
    upgradeable: true,
    honeypotHeuristic: false,
  },
  demo: true,
  sources: ["DEMO_FIXTURE"],
};

export const DEMO_TOKEN: TokenData = {
  ...DEMO_CONTRACT,
  symbol: "DUSDC",
  decimals: 6,
  totalSupply: "1000000000000000",
  holdersApprox: 125000,
  liquidityUsd: 42000000,
};

export const DEMO_TX: TransactionData = {
  hash: "0xabc123def4567890abc123def4567890abc123def4567890abc123def4567890",
  chain: "ethereum",
  from: DEMO_WALLET.address,
  to: DEMO_CONTRACT.address,
  valueEth: 0,
  timestamp: "2024-11-02T15:22:11.000Z",
  status: "success",
  method: "approve",
  interactsWithContract: true,
  demo: true,
  sources: ["DEMO_FIXTURE"],
};

export const DEMO_MARKET: MarketData = {
  priceUsd: 1.0,
  liquidityUsd: 42000000,
  volume24h: 8500000,
  demo: true,
  sources: ["DEMO_FIXTURE"],
};

export const DEMO_SECURITY: SecurityIntel = {
  sanctionsHit: false,
  phishingReports: 0,
  knownMalicious: false,
  notes: ["DEMO security intel — no live screening performed"],
  demo: true,
  sources: ["DEMO_FIXTURE"],
};

export function demoWalletFor(address: string): WalletData {
  const activity = DEMO_WALLET_ACTIVITY.map((row) => ({
    ...row,
    from: row.from === DEMO_WALLET.address ? address : row.from,
    to: row.to === DEMO_WALLET.address ? address : row.to,
  }));
  const approvals = DEMO_APPROVALS.map((a) => ({
    ...a,
    evidence: a.evidence.map((e) => ({ ...e })),
    sources: [...a.sources],
    demo: true,
  }));
  const holdings = DEMO_HOLDINGS.map((h) => ({
    ...h,
    evidence: h.evidence.map((e) => ({ ...e })),
    sources: [...h.sources],
    demo: true,
  }));
  return { ...DEMO_WALLET, address, activity, approvals, holdings, demo: true };
}

export function demoContractFor(address: string): ContractData {
  return { ...DEMO_CONTRACT, address, demo: true };
}

export function demoTokenFor(address: string): TokenData {
  return { ...DEMO_TOKEN, address, demo: true };
}

export function demoTxFor(hash: string): TransactionData {
  return { ...DEMO_TX, hash, demo: true };
}
