import type {
  ActivityRiskLevel,
  ContractData,
  TransactionData,
  WalletActivityItem,
  WalletData,
} from "../types";
import {
  demoContractFor,
  demoTxFor,
  demoWalletFor,
} from "../demo/fixtures";
import { isDemoMode } from "../db";

const EXPLORER = "https://api.etherscan.io/api";

type EtherscanTx = {
  timeStamp: string;
  from?: string;
  to?: string;
  value?: string;
  hash?: string;
  input?: string;
  functionName?: string;
  isError?: string;
  contractAddress?: string;
};

async function etherscan<T>(params: Record<string, string>): Promise<T | null> {
  const key = process.env.ETHERSCAN_API_KEY;
  if (!key) return null;
  const qs = new URLSearchParams({ ...params, apikey: key });
  try {
    const res = await fetch(`${EXPLORER}?${qs.toString()}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function methodFromTx(tx: EtherscanTx): string | null {
  if (tx.functionName && tx.functionName.trim()) {
    return tx.functionName.split("(")[0]?.trim() || null;
  }
  if (tx.input && tx.input !== "0x" && tx.input.length >= 10) {
    return tx.input.slice(0, 10);
  }
  return null;
}

function riskForTx(tx: EtherscanTx, walletAddress: string): ActivityRiskLevel {
  const method = (methodFromTx(tx) ?? "").toLowerCase();
  if (tx.isError === "1") return "moderate";
  if (/approve|permit|increaseallowance|setapproval/.test(method)) return "moderate";
  if (/selfdestruct|delegatecall|upgrade|blacklist|pause|mint/.test(method)) return "high";
  const interacts = Boolean(tx.input && tx.input !== "0x");
  if (interacts && tx.to && tx.to.toLowerCase() !== walletAddress.toLowerCase()) return "info";
  return "low";
}

function activityFromTxlist(
  rows: EtherscanTx[],
  walletAddress: string,
  limit = 8,
): WalletActivityItem[] {
  // rows are ascending by timestamp when sort=asc — take newest first
  const newest = [...rows].reverse().slice(0, limit);
  return newest.map((tx) => {
    const valueWei = tx.value ? Number(tx.value) : 0;
    const amount = Number.isFinite(valueWei) ? String(valueWei / 1e18) : null;
    const contractInteraction = Boolean(
      (tx.input && tx.input !== "0x") || (tx.contractAddress && tx.contractAddress !== ""),
    );
    return {
      date: new Date(Number(tx.timeStamp) * 1000).toISOString(),
      amount,
      asset: "ETH",
      from: tx.from ?? null,
      to: tx.to ?? null,
      riskLevel: riskForTx(tx, walletAddress),
      contractInteraction,
      hash: tx.hash ?? null,
      method: methodFromTx(tx),
    };
  });
}

export async function getEthereumWallet(address: string): Promise<WalletData> {
  if (isDemoMode()) return demoWalletFor(address);

  const txlist = await etherscan<{ status: string; result: EtherscanTx[] }>({
    module: "account",
    action: "txlist",
    address,
    startblock: "0",
    endblock: "99999999",
    page: "1",
    offset: "100",
    sort: "asc",
  });

  const balance = await etherscan<{ status: string; result: string }>({
    module: "account",
    action: "balance",
    address,
    tag: "latest",
  });

  if (!txlist || txlist.status !== "1") {
    // Fall back to labeled demo rather than inventing facts
    return { ...demoWalletFor(address), sources: ["DEMO_FIXTURE", "etherscan-insufficient"] };
  }

  const first = txlist.result[0];
  const txCount = txlist.result.length;
  const balanceEth =
    balance?.status === "1" ? Number(balance.result) / 1e18 : null;
  const activity = activityFromTxlist(txlist.result, address);

  return {
    address,
    chain: "ethereum",
    firstSeen: first ? new Date(Number(first.timeStamp) * 1000).toISOString() : null,
    txCount,
    balanceEth,
    interactions: [],
    fundingSource: null,
    // Threat heuristics not derived from txlist alone — null = unknown, not clean
    rapidMovement: null,
    newContractInteractions: null,
    mixerExposure: null,
    activity,
    demo: false,
    sources: ["etherscan"],
  };
}

export async function getEthereumContract(address: string): Promise<ContractData> {
  if (isDemoMode()) return demoContractFor(address);

  const info = await etherscan<{
    status: string;
    result: Array<{
      SourceCode?: string;
      ContractName?: string;
      CompilerVersion?: string;
      Proxy?: string;
      Implementation?: string;
      ABI?: string;
    }>;
  }>({
    module: "contract",
    action: "getsourcecode",
    address,
  });

  if (!info || info.status !== "1" || !info.result?.[0]) {
    return { ...demoContractFor(address), sources: ["DEMO_FIXTURE", "etherscan-insufficient"] };
  }

  const row = info.result[0];
  let abi: unknown[] | null = null;
  try {
    abi = row.ABI && row.ABI !== "Contract source code not verified" ? JSON.parse(row.ABI) : null;
  } catch {
    abi = null;
  }

  const verified = Boolean(row.SourceCode && row.SourceCode.length > 0);
  const abiText = JSON.stringify(abi ?? []);

  // Creator/deployer only when explorer returns it — do not invent
  const creation = await etherscan<{
    status: string;
    result: Array<{ contractCreator?: string; contractAddress?: string }>;
  }>({
    module: "contract",
    action: "getcontractcreation",
    contractaddresses: address,
  });
  const deployer =
    creation?.status === "1" && creation.result?.[0]?.contractCreator
      ? creation.result[0].contractCreator
      : null;

  return {
    address,
    chain: "ethereum",
    isContract: true,
    verified,
    name: row.ContractName || null,
    compiler: row.CompilerVersion || null,
    createdAt: null,
    isProxy: row.Proxy === "1",
    implementation: row.Implementation || null,
    owner: null,
    deployer,
    abi,
    sourceCode: row.SourceCode ? "[verified source present]" : null,
    flags: {
      mint: /mint/i.test(abiText),
      pause: /pause/i.test(abiText),
      blacklist: /blacklist/i.test(abiText),
      upgradeable: row.Proxy === "1",
      honeypotHeuristic: null,
    },
    demo: false,
    sources: ["etherscan"],
  };
}

export async function getEthereumTransaction(hash: string): Promise<TransactionData> {
  if (isDemoMode()) return demoTxFor(hash);

  const tx = await etherscan<{
    status: string;
    result: {
      from?: string;
      to?: string;
      value?: string;
      timeStamp?: string;
      methodId?: string;
      functionName?: string;
      isError?: string;
      contractAddress?: string;
    };
  }>({
    module: "proxy",
    action: "eth_getTransactionByHash",
    txhash: hash,
  });

  // etherscan proxy shape varies — if insufficient, DEMO-label fallback
  if (!tx || !("result" in tx) || !tx.result) {
    return { ...demoTxFor(hash), sources: ["DEMO_FIXTURE", "etherscan-insufficient"] };
  }

  const r = tx.result as {
    from?: string;
    to?: string;
    value?: string;
    blockNumber?: string;
    input?: string;
  };

  return {
    hash,
    chain: "ethereum",
    from: r.from ?? null,
    to: r.to ?? null,
    valueEth: r.value ? Number(BigInt(r.value)) / 1e18 : null,
    timestamp: null,
    status: "unknown",
    method: r.input && r.input !== "0x" ? r.input.slice(0, 10) : null,
    interactsWithContract: Boolean(r.input && r.input !== "0x"),
    demo: false,
    sources: ["etherscan"],
  };
}
