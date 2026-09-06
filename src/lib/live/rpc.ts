/** Public JSON-RPC helpers. Fail closed — never invent results. */

const RPC_BY_CHAIN: Record<string, string[]> = {
  ethereum: [
    process.env.ETH_RPC_URL,
    process.env.ALCHEMY_API_KEY
      ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      : null,
    "https://cloudflare-eth.com",
    "https://rpc.ankr.com/eth",
    "https://1rpc.io/eth",
  ].filter((u): u is string => Boolean(u)),
  base: ["https://mainnet.base.org", "https://base.llamarpc.com", "https://1rpc.io/base"],
  polygon: ["https://polygon-rpc.com", "https://1rpc.io/matic"],
  bsc: ["https://bsc-dataseed.binance.org", "https://1rpc.io/bnb"],
  arbitrum: ["https://arb1.arbitrum.io/rpc", "https://1rpc.io/arb"],
};

export function normalizeChain(chain?: string): string {
  const c = (chain || "ethereum").toLowerCase();
  if (c === "eth" || c === "mainnet") return "ethereum";
  if (c === "matic") return "polygon";
  if (c === "bnb" || c === "binance") return "bsc";
  if (c === "arb") return "arbitrum";
  return c;
}

export async function ethRpc<T>(
  method: string,
  params: unknown[],
  chain = "ethereum",
): Promise<T | null> {
  const urls = RPC_BY_CHAIN[normalizeChain(chain)] ?? RPC_BY_CHAIN.ethereum;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        next: { revalidate: 20 },
      });
      if (!res.ok) continue;
      const json = (await res.json()) as { result?: T; error?: unknown };
      if (json.error || json.result === undefined) continue;
      return json.result;
    } catch {
      continue;
    }
  }
  return null;
}

export function padAddress(addr: string): string {
  return addr.replace(/^0x/i, "").toLowerCase().padStart(64, "0");
}

export async function ethGetCode(address: string, chain = "ethereum"): Promise<string | null> {
  return ethRpc<string>("eth_getCode", [address, "latest"], chain);
}

export async function ethGetBalanceWei(address: string, chain = "ethereum"): Promise<string | null> {
  return ethRpc<string>("eth_getBalance", [address, "latest"], chain);
}

export async function ethCall(to: string, data: string, chain = "ethereum"): Promise<string | null> {
  return ethRpc<string>("eth_call", [{ to, data }, "latest"], chain);
}

export async function erc20BalanceOf(
  token: string,
  owner: string,
  chain = "ethereum",
): Promise<bigint | null> {
  const data = `0x70a08231${padAddress(owner)}`;
  const raw = await ethCall(token, data, chain);
  if (!raw || raw === "0x") return null;
  try {
    return BigInt(raw);
  } catch {
    return null;
  }
}

export async function erc20Allowance(
  token: string,
  owner: string,
  spender: string,
  chain = "ethereum",
): Promise<bigint | null> {
  const data = `0xdd62ed3e${padAddress(owner)}${padAddress(spender)}`;
  const raw = await ethCall(token, data, chain);
  if (!raw || raw === "0x") return null;
  try {
    return BigInt(raw);
  } catch {
    return null;
  }
}

export async function erc20Meta(
  token: string,
  chain = "ethereum",
): Promise<{ symbol: string | null; decimals: number | null; name: string | null }> {
  const [symRaw, decRaw, nameRaw] = await Promise.all([
    ethCall(token, "0x95d89b41", chain),
    ethCall(token, "0x313ce567", chain),
    ethCall(token, "0x06fdde03", chain),
  ]);
  return {
    symbol: decodeAbiString(symRaw),
    decimals: decodeUint(decRaw),
    name: decodeAbiString(nameRaw),
  };
}

function decodeUint(raw: string | null): number | null {
  if (!raw || raw === "0x") return null;
  try {
    return Number(BigInt(raw));
  } catch {
    return null;
  }
}

function decodeAbiString(raw: string | null): string | null {
  if (!raw || raw === "0x" || raw.length < 10) return null;
  const hex = raw.replace(/^0x/, "");
  if (hex.length >= 192) {
    try {
      const len = Number(BigInt("0x" + hex.slice(64, 128)));
      if (!Number.isFinite(len) || len <= 0 || len > 64) return null;
      const data = hex.slice(128, 128 + len * 2);
      return Buffer.from(data, "hex").toString("utf8").replace(/\0/g, "").trim() || null;
    } catch {
      return null;
    }
  }
  try {
    return Buffer.from(hex.slice(0, 64), "hex").toString("utf8").replace(/\0/g, "").trim() || null;
  } catch {
    return null;
  }
}
