import type {
  ContractData,
  MarketData,
  SecurityIntel,
  TokenData,
  TransactionData,
  WalletData,
} from "../types";

/** DEMO fixtures — clearly labeled; used when DEMO_MODE or API keys missing. */

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
  return { ...DEMO_WALLET, address, demo: true };
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
