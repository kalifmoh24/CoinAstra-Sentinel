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
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return { priceUsd: null, liquidityUsd: null, volume24h: null, demo: false, sources: ["market-invalid-address"] };
    }
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`, {
        next: { revalidate: 60 },
        headers: { accept: "application/json" },
      });
      if (!res.ok) {
        return {
          priceUsd: null,
          liquidityUsd: null,
          volume24h: null,
          demo: false,
          sources: ["coingecko-miss"],
        };
      }
      const j = (await res.json()) as {
        market_data?: {
          current_price?: { usd?: number };
          total_volume?: { usd?: number };
        };
      };
      const price = j.market_data?.current_price?.usd ?? null;
      const volume24h = j.market_data?.total_volume?.usd ?? null;
      return {
        priceUsd: price,
        liquidityUsd: null,
        volume24h,
        demo: false,
        sources: ["coingecko.contract"],
      };
    } catch {
      return {
        priceUsd: null,
        liquidityUsd: null,
        volume24h: null,
        demo: false,
        sources: ["coingecko-unavailable"],
      };
    }
  },
};
