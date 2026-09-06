import { detectInputType, isEvmAddress, isTxHash } from "@/lib/detect";
import { blockchainProvider } from "@/lib/providers";
import { searchGecko } from "@/lib/live/xray";
import { normalizeChain } from "@/lib/live/rpc";

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
    status: `Market asset detected: ${hit.name} (${hit.symbol}). No on-chain scan until a contract is mapped.`,
    confidence: "medium",
    next: "xray",
  };
}
