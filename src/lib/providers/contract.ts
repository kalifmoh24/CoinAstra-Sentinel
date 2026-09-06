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
    const { erc20Meta } = await import("../live/rpc");
    const meta = await erc20Meta(address, chain);
    return {
      ...base,
      name: meta.name || base.name,
      symbol: meta.symbol ?? base.name?.slice(0, 8)?.toUpperCase() ?? null,
      decimals: meta.decimals,
      totalSupply: null,
      holdersApprox: null,
      liquidityUsd: null,
    };
  },
};
