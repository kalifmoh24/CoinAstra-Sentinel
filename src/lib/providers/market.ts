import type { MarketData } from "../types";
import { DEMO_MARKET } from "../demo/fixtures";
import { isDemoMode } from "../db";

export interface MarketDataProvider {
  getTokenMarket(address: string): Promise<MarketData>;
}

export const marketProvider: MarketDataProvider = {
  async getTokenMarket(address: string) {
    if (isDemoMode()) {
      return { ...DEMO_MARKET, sources: ["DEMO_FIXTURE", `token:${address}`] };
    }
    // CoinGecko/DexScreener — optional Phase 1+ enrichment
    return {
      priceUsd: null,
      liquidityUsd: null,
      volume24h: null,
      demo: false,
      sources: ["market-provider-insufficient"],
    };
  },
};
