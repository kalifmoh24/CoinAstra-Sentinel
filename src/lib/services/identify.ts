import { detectInputType, isEvmAddress, isTxHash } from "@/lib/detect";
import { blockchainProvider } from "@/lib/providers";
import { searchGecko } from "@/lib/live/xray";
import { erc20Meta, normalizeChain } from "@/lib/live/rpc";

export type IdentifiedKind =
  | "wallet"
  | "token"
  | "contract"
  | "transaction"
  | "market"
  | "unknown";

export type IdentifyResult = {
  kind: IdentifiedKind;
  chain: string;
  input: string;
  address: string | null;
  hash: string | null;
  name: string | null;
  symbol: string | null;
  geckoId: string | null;
  status: string;
  confidence: "high" | "medium" | "low";
  next: "scan" | "xray" | "none";
  href: string;
  error?: string;
};

export async function identifyInput(raw: string, chainHint = "ethereum"): Promise<IdentifyResult> {
  const input = raw.trim();
  const chain = normalizeChain(chainHint);
  const unknown = (error: string): IdentifyResult => ({
    kind: "unknown",
    chain,
    input,
    address: null,
    hash: null,
    name: null,
    symbol: null,
    geckoId: null,
    status: "Unable to identify this address or transaction.",
    confidence: "low",
    next: "none",
    href: "/dashboard",
    error,
  });

  if (!input || input.length < 2) {
    return unknown("Enter a wallet, contract, transaction hash, or token symbol.");
  }

  if (isTxHash(input)) {
    return {
      kind: "transaction",
      chain,
      input,
      address: null,
      hash: input,
      name: null,
      symbol: null,
      geckoId: null,
      status: `${chain} transaction hash detected.`,
      confidence: "high",
      next: "scan",
      href: "/scan/transaction",
    };
  }

  if (isEvmAddress(input)) {
    let hasCode = false;
    try {
      hasCode = await blockchainProvider.hasCode(input, chain);
    } catch {
      hasCode = false;
    }
    if (hasCode) {
      const meta = await erc20Meta(input, chain);
      if (meta.symbol || meta.decimals != null) {
        return {
          kind: "token",
          chain,
          input,
          address: input,
          hash: null,
          name: meta.name,
          symbol: meta.symbol,
          geckoId: null,
          status: `${chain} ERC-20 token detected${meta.symbol ? `: ${meta.symbol}` : ""}.`,
          confidence: "high",
          next: "scan",
          href: "/scan/token",
        };
      }
      return {
        kind: "contract",
        chain,
        input,
        address: input,
        hash: null,
        name: null,
        symbol: null,
        geckoId: null,
        status: `${chain} contract detected.`,
        confidence: "high",
        next: "scan",
        href: "/scan/contract",
      };
    }
    return {
      kind: "wallet",
      chain,
      input,
      address: input,
      hash: null,
      name: null,
      symbol: null,
      geckoId: null,
      status: `${chain} wallet detected.`,
      confidence: "high",
      next: "scan",
      href: "/scan/wallet",
    };
  }

  const detected = detectInputType(input);
  if (detected !== "unknown") {
    return unknown("Unable to identify this address or transaction.");
  }

  const hit = await searchGecko(input);
  if (!hit) {
    return unknown("Unable to identify this address or transaction.");
  }

  return {
    kind: "market",
    chain,
    input,
    address: null,
    hash: null,
    name: hit.name,
    symbol: hit.symbol,
    geckoId: hit.id,
    status: `Market asset detected: ${hit.name} (${hit.symbol}).`,
    confidence: "medium",
    next: "xray",
    href: `/xray?q=${encodeURIComponent(hit.id)}`,
  };
}
