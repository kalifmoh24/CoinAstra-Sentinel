import type { ContractData, TokenData } from "../types";
import { blockchainProvider } from "./blockchain";
import { demoTokenFor } from "../demo/fixtures";
import { isDemoMode } from "../db";

export interface ContractAnalysisProvider {
  analyze(address: string, chain?: string): Promise<ContractData>;
  asToken(address: string, chain?: string): Promise<TokenData>;
}

export const contractAnalysisProvider: ContractAnalysisProvider = {
  async analyze(address, chain = "ethereum") {
    return blockchainProvider.getContract(address, chain);
  },
  async asToken(address, chain = "ethereum") {
    if (isDemoMode()) return { ...demoTokenFor(address), chain };
    const base = await blockchainProvider.getContract(address, chain);
    return {
      ...base,
      symbol: base.name?.slice(0, 6)?.toUpperCase() ?? null,
      decimals: null,
      totalSupply: null,
      holdersApprox: null,
      liquidityUsd: null,
    };
  },
};
