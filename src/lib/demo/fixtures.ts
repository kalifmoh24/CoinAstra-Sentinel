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
    allowanceRaw: "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    unlimited: true,
    lastSeen: "2024-11-02T15:22:11.000Z",
    evidence: [
      {
        reason: "DEMO fixture unlimited USDC allowance to aggregation router",
        source: "DEMO_FIXTURE",
        raw: { method: "approve" },
      },
    ],
    sources: ["DEMO_FIXTURE"],
    demo: true,
  },
  {
    token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    spender: "0xDemoMixerStub000000000000000000000001",
    allowance: "500000",
    allowanceRaw: "500000000000",
    unlimited: false,
    lastSeen: "2024-09-01T14:05:33.000Z",
    evidence: [
      {
        reason: "DEMO fixture allowance to mixer-like stub spender",
        source: "DEMO_FIXTURE",
        raw: { risk: "high" },
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
    balance: "125000.00",
    balanceRaw: "125000000000",
    evidence: [{ reason: "DEMO fixture token balance", source: "DEMO_FIXTURE" }],
    sources: ["DEMO_FIXTURE"],
    demo: true,
  },
  {
    token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "WETH",
    decimals: 18,
    balance: "8.50",
    balanceRaw: "8500000000000000000",
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
  return {
    ...DEMO_WALLET,
    address,
    activity,
    approvals: DEMO_APPROVALS.map((a) => ({ ...a, demo: true })),
    holdings: DEMO_HOLDINGS.map((h) => ({ ...h, demo: true })),
    demo: true,
  };
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
