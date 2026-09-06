/** CoinAstra X-Ray — live CoinGecko + fail-closed scoring. Never invent unlocks/whales. */

export type XrayDim = {
  key: string;
  label: string;
  score: number | null;
  confidence: "high" | "medium" | "low";
  note: string;
};

export type XrayFinding = {
  severity: "positive" | "moderate" | "high" | "critical" | "info";
  title: string;
  evidence: string;
  source: string;
};

export type XrayReport = {
  id: string;
  name: string;
  symbol: string;
  image: string | null;
  chain: string;
  contract: string | null;
  homepage: string | null;
  description: string | null;
  priceUsd: number | null;
  marketCap: number | null;
  fdv: number | null;
  volume24h: number | null;
  change24h: number | null;
  circulating: number | null;
  totalSupply: number | null;
  ath: number | null;
  xrayScore: number | null;
  classification: string;
  dimensions: XrayDim[];
  findings: XrayFinding[];
  strengths: string[];
  risks: string[];
  missing: string[];
  sources: string[];
  updatedAt: string;
};

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function band(score: number | null) {
  if (score == null) return "Insufficient data";
  if (score >= 81) return "STRONG PROFILE — STILL NOT A GUARANTEE";
  if (score >= 61) return "SOLID WITH MATERIAL RISK";
  if (score >= 41) return "MIXED / MODERATE RISK";
  if (score >= 21) return "ELEVATED RISK";
  return "CRITICAL / THIN EVIDENCE";
}

type GeckoCoin = {
  id: string;
  name?: string;
  symbol?: string;
  image?: { small?: string; large?: string };
  description?: { en?: string };
  links?: { homepage?: string[] };
  platforms?: Record<string, string | null>;
  market_data?: {
    current_price?: { usd?: number };
    market_cap?: { usd?: number };
    fully_diluted_valuation?: { usd?: number };
    total_volume?: { usd?: number };
    price_change_percentage_24h?: number;
    circulating_supply?: number;
    total_supply?: number;
    ath?: { usd?: number };
  };
};

export async function searchGecko(query: string): Promise<{ id: string; name: string; symbol: string } | null> {
  const q = query.trim();
  if (!q) return null;
  if (/^0x[a-fA-F0-9]{40}$/.test(q)) {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${q}`, {
        next: { revalidate: 60 },
        headers: { accept: "application/json" },
      });
      if (res.ok) {
        const j = (await res.json()) as { id?: string; name?: string; symbol?: string };
        if (j.id) return { id: j.id, name: j.name ?? q, symbol: (j.symbol ?? "").toUpperCase() };
      }
    } catch {
      /* miss */
    }
  }
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`,
      { next: { revalidate: 30 }, headers: { accept: "application/json" } },
    );
    if (!res.ok) return null;
    const j = (await res.json()) as { coins?: Array<{ id: string; name: string; symbol: string }> };
    const first = j.coins?.[0];
    return first ? { id: first.id, name: first.name, symbol: first.symbol } : null;
  } catch {
    return null;
  }
}

export async function loadXray(query: string): Promise<XrayReport | null> {
  const hit = await searchGecko(query);
  if (!hit) return null;
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(hit.id)}?localization=false&tickers=false&community_data=false&developer_data=false`,
    { next: { revalidate: 60 }, headers: { accept: "application/json" } },
  );
  if (!res.ok) return null;
  const c = (await res.json()) as GeckoCoin;
  const md = c.market_data;
  const evmPlatform =
    c.platforms?.ethereum ||
    c.platforms?.base ||
    c.platforms?.["polygon-pos"] ||
    c.platforms?.["arbitrum-one"] ||
    c.platforms?.["binance-smart-chain"] ||
    null;
  const contract = evmPlatform && /^0x[a-fA-F0-9]{40}$/.test(evmPlatform) ? evmPlatform : evmPlatform || null;
  const chain = c.platforms?.ethereum
    ? "ethereum"
    : c.platforms?.base
      ? "base"
      : c.platforms?.["polygon-pos"]
        ? "polygon"
        : c.platforms?.["arbitrum-one"]
          ? "arbitrum"
          : c.platforms?.["binance-smart-chain"]
            ? "bsc"
            : Object.keys(c.platforms ?? {})[0] || "unknown";

  let codeHex: string | null = null;
  let erc20: { symbol: string | null; decimals: number | null; name: string | null } | null = null;
  const rpcChain = ["ethereum", "base", "polygon", "arbitrum", "bsc"].includes(chain) ? chain : null;
  if (contract && /^0x[a-fA-F0-9]{40}$/.test(contract) && rpcChain) {
    const { ethGetCode, erc20Meta } = await import("./rpc");
    codeHex = await ethGetCode(contract, rpcChain);
    if (codeHex && codeHex !== "0x") {
      erc20 = await erc20Meta(contract, rpcChain);
    }
  }

  const circ = md?.circulating_supply ?? null;
  const total = md?.total_supply ?? null;
  const circRatio = circ && total && total > 0 ? circ / total : null;
  const vol = md?.total_volume?.usd ?? null;
  const mcap = md?.market_cap?.usd ?? null;
  const volRatio = vol && mcap && mcap > 0 ? vol / mcap : null;

  const tokenomics =
    circRatio == null ? null : clamp(40 + circRatio * 50 - (circRatio < 0.2 ? 15 : 0));
  const liquidity = volRatio == null ? null : clamp(Math.min(95, 30 + volRatio * 400));
  const market =
    md?.price_change_percentage_24h == null
      ? null
      : clamp(70 - Math.min(40, Math.abs(md.price_change_percentage_24h)));
  const onchain = vol == null ? null : clamp(Math.min(90, 40 + Math.log10(Math.max(vol, 1)) * 6));
  const ecosystem = mcap == null ? null : clamp(Math.min(92, 35 + Math.log10(Math.max(mcap, 1)) * 5));
  const hasCode = Boolean(codeHex && codeHex !== "0x");
  const security = !contract
    ? null
    : !rpcChain
      ? 50
      : codeHex == null
        ? null
        : hasCode
          ? erc20?.symbol
            ? 68
            : 58
          : 18;

  const dims: XrayDim[] = [
    {
      key: "security",
      label: "Security",
      score: security,
      confidence: hasCode ? "medium" : "low",
      note: !contract
        ? "No EVM contract on this listing. Security score withheld."
        : codeHex == null
          ? "Contract mapped, but RPC bytecode lookup was unavailable."
          : hasCode
            ? erc20?.symbol
              ? `On-chain code present; ERC-20 symbol ${erc20.symbol}. Privileges still need Token Scanner.`
              : "On-chain code present. ERC-20 metadata did not decode — run Token Scanner."
            : "Mapped address returned empty bytecode on the public RPC.",
    },
    {
      key: "tokenomics",
      label: "Tokenomics",
      score: tokenomics,
      confidence: circRatio == null ? "low" : "medium",
      note:
        circRatio == null
          ? "Circulating/total supply unavailable."
          : `Circulating ratio ${(circRatio * 100).toFixed(1)}% of reported total supply.`,
    },
    {
      key: "liquidity",
      label: "Liquidity",
      score: liquidity,
      confidence: volRatio == null ? "low" : "medium",
      note:
        volRatio == null
          ? "Volume/market-cap unavailable."
          : `24h volume / market cap = ${(volRatio * 100).toFixed(2)}% (spot proxy, not DEX depth).`,
    },
    {
      key: "onchain",
      label: "On-chain activity",
      score: onchain,
      confidence: vol == null ? "low" : "low",
      note: "Proxy from reported 24h volume only — not unique users.",
    },
    {
      key: "market",
      label: "Market structure",
      score: market,
      confidence: md?.price_change_percentage_24h == null ? "low" : "medium",
      note:
        md?.price_change_percentage_24h == null
          ? "24h change unavailable."
          : `24h change ${md.price_change_percentage_24h.toFixed(2)}%. Volatility is not a prediction.`,
    },
    {
      key: "ecosystem",
      label: "Ecosystem",
      score: ecosystem,
      confidence: mcap == null ? "low" : "low",
      note: "Size proxy from market cap only — not app/TVL coverage.",
    },
  ];

  const scored = dims.map((d) => d.score).filter((n): n is number => n != null);
  const xrayScore = scored.length ? clamp(scored.reduce((a, b) => a + b, 0) / scored.length) : null;

  const findings: XrayFinding[] = [];
  if (contract) {
    findings.push({
      severity: "info",
      title: "EVM contract mapped",
      evidence: `${chain} ${contract}`,
      source: "coingecko.platforms",
    });
  }
  if (contract && rpcChain && codeHex == null) {
    findings.push({
      severity: "info",
      title: "Bytecode lookup unavailable",
      evidence: "Public RPC did not return eth_getCode. Security score withheld.",
      source: "public-rpc",
    });
  }
  if (contract && rpcChain && codeHex === "0x") {
    findings.push({
      severity: "critical",
      title: "No contract bytecode",
      evidence: `${contract} returned empty code on ${rpcChain}`,
      source: "public-rpc.eth_getCode",
    });
  }
  if (hasCode && erc20?.symbol) {
    findings.push({
      severity: "positive",
      title: "ERC-20 interface responds",
      evidence: `${erc20.name ?? "token"} (${erc20.symbol})${erc20.decimals != null ? `, ${erc20.decimals} decimals` : ""}`,
      source: "public-rpc.erc20",
    });
  }
  if (circRatio != null && circRatio < 0.25) {
    findings.push({
      severity: "high",
      title: "Low circulating ratio",
      evidence: `${(circRatio * 100).toFixed(1)}% circulating vs reported total supply`,
      source: "coingecko.market_data",
    });
  }
  if (volRatio != null && volRatio < 0.01) {
    findings.push({
      severity: "moderate",
      title: "Thin relative volume",
      evidence: `24h volume is ${(volRatio * 100).toFixed(2)}% of market cap`,
      source: "coingecko.market_data",
    });
  }
  if (md?.price_change_percentage_24h != null && Math.abs(md.price_change_percentage_24h) > 12) {
    findings.push({
      severity: "moderate",
      title: "Elevated 24h move",
      evidence: `${md.price_change_percentage_24h.toFixed(2)}% 24h`,
      source: "coingecko.market_data",
    });
  }

  const missing: string[] = [];
  if (!contract) missing.push("Verified EVM contract / ABI privileges");
  if (codeHex == null && contract) missing.push("Live bytecode (RPC miss)");
  missing.push("Unlock / vesting calendar");
  missing.push("Holder concentration & whale clustering");
  missing.push("DEX pool depth / LP lock");
  missing.push("Treasury & governance");
  missing.push("Developer repository activity");

  return {
    id: c.id,
    name: c.name ?? hit.name,
    symbol: (c.symbol ?? hit.symbol).toUpperCase(),
    image: c.image?.large || c.image?.small || null,
    chain,
    contract,
    homepage: c.links?.homepage?.[0] || null,
    description: c.description?.en ? c.description.en.replace(/<[^>]+>/g, "").slice(0, 420) : null,
    priceUsd: md?.current_price?.usd ?? null,
    marketCap: mcap,
    fdv: md?.fully_diluted_valuation?.usd ?? null,
    volume24h: vol,
    change24h: md?.price_change_percentage_24h ?? null,
    circulating: circ,
    totalSupply: total,
    ath: md?.ath?.usd ?? null,
    xrayScore,
    classification: band(xrayScore),
    dimensions: dims,
    findings,
    strengths: findings.filter((f) => f.severity === "positive" || f.severity === "info").map((f) => f.title),
    risks: findings.filter((f) => f.severity === "high" || f.severity === "critical" || f.severity === "moderate").map((f) => f.title),
    missing,
    sources: hasCode || codeHex != null ? ["coingecko", "public-rpc"] : ["coingecko"],
    updatedAt: new Date().toISOString(),
  };
}
