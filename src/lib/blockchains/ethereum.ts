import type {
  ActivityRiskLevel,
  ContractData,
  TransactionData,
  WalletActivityItem,
  WalletData,
} from "../types";
import { demoContractFor, demoTxFor, demoWalletFor } from "../demo/fixtures";
import { isDemoMode } from "../db";
import { ethGetBalanceWei, ethGetCode, ethRpc } from "../live/rpc";

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
  const qs = new URLSearchParams({ ...params, ...(key ? { apikey: key } : {}) });
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

function activityFromTxlist(rows: EtherscanTx[], walletAddress: string, limit = 8): WalletActivityItem[] {
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

function weiToEth(wei: string | null): number | null {
  if (!wei) return null;
  try {
    return Number(BigInt(wei)) / 1e18;
  } catch {
    return null;
  }
}

export async function getEthereumWallet(address: string): Promise<WalletData> {
  if (isDemoMode()) return demoWalletFor(address);

  const sources: string[] = [];
  const txlist = await etherscan<{ status: string; result: EtherscanTx[] | string }>({
    module: "account",
    action: "txlist",
    address,
    startblock: "0",
    endblock: "99999999",
    page: "1",
    offset: "100",
    sort: "asc",
  });

  let firstSeen: string | null = null;
  let txCount: number | null = null;
  let activity: WalletActivityItem[] | undefined;

  if (txlist && txlist.status === "1" && Array.isArray(txlist.result)) {
    sources.push("etherscan.txlist");
    const rows = txlist.result;
    txCount = rows.length;
    const first = rows[0];
    firstSeen = first ? new Date(Number(first.timeStamp) * 1000).toISOString() : null;
    activity = activityFromTxlist(rows, address);
  } else if (txlist && txlist.status === "0" && typeof txlist.result === "string" && /no transactions/i.test(txlist.result)) {
    sources.push("etherscan.txlist");
    txCount = 0;
    activity = [];
  }

  const balanceScan = await etherscan<{ status: string; result: string }>({
    module: "account",
    action: "balance",
    address,
    tag: "latest",
  });
  let balanceEth: number | null = null;
  if (balanceScan?.status === "1" && balanceScan.result != null) {
    sources.push("etherscan.balance");
    balanceEth = Number(balanceScan.result) / 1e18;
  } else {
    const wei = await ethGetBalanceWei(address, "ethereum");
    if (wei) {
      sources.push("public-rpc.eth_getBalance");
      balanceEth = weiToEth(wei);
    }
  }

  if (!sources.length) sources.push("insufficient");

  return {
    address,
    chain: "ethereum",
    firstSeen,
    txCount,
    balanceEth,
    interactions: [],
    fundingSource: null,
    rapidMovement: null,
    newContractInteractions: null,
    mixerExposure: null,
    activity,
    approvals: null,
    holdings: null,
    demo: false,
    sources,
  };
}

export async function getEthereumContract(address: string): Promise<ContractData> {
  if (isDemoMode()) return demoContractFor(address);

  const sources: string[] = [];
  const code = await ethGetCode(address, "ethereum");
  if (code != null) sources.push("public-rpc.eth_getCode");
  const isContract = Boolean(code && code !== "0x");

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

  const row = info?.status === "1" ? info.result?.[0] : undefined;
  if (row) sources.push("etherscan.getsourcecode");

  let abi: unknown[] | null = null;
  try {
    abi = row?.ABI && row.ABI !== "Contract source code not verified" ? JSON.parse(row.ABI) : null;
  } catch {
    abi = null;
  }

  const verified = Boolean(row?.SourceCode && row.SourceCode.length > 0);
  const abiText = JSON.stringify(abi ?? []);

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
  if (deployer) sources.push("etherscan.getcontractcreation");

  if (!sources.length) sources.push("insufficient");

  return {
    address,
    chain: "ethereum",
    isContract,
    verified: row ? verified : null,
    name: row?.ContractName || null,
    compiler: row?.CompilerVersion || null,
    createdAt: null,
    isProxy: row ? row.Proxy === "1" : null,
    implementation: row?.Implementation || null,
    owner: null,
    deployer,
    abi,
    sourceCode: row?.SourceCode ? "[verified source present]" : null,
    flags: {
      mint: /mint/i.test(abiText),
      pause: /pause/i.test(abiText),
      blacklist: /blacklist/i.test(abiText),
      upgradeable: row ? row.Proxy === "1" : null,
      honeypotHeuristic: null,
    },
    demo: false,
    sources,
  };
}

export async function getEthereumTransaction(hash: string): Promise<TransactionData> {
  if (isDemoMode()) return demoTxFor(hash);

  const sources: string[] = [];
  const viaRpc = await ethRpc<{
    from?: string;
    to?: string;
    value?: string;
    input?: string;
    blockNumber?: string;
  }>("eth_getTransactionByHash", [hash], "ethereum");

  let from: string | null = null;
  let to: string | null = null;
  let valueEth: number | null = null;
  let method: string | null = null;
  let interactsWithContract = false;
  let timestamp: string | null = null;
  let status: string | null = "unknown";

  if (viaRpc) {
    sources.push("public-rpc.eth_getTransactionByHash");
    from = viaRpc.from ?? null;
    to = viaRpc.to ?? null;
    valueEth = weiToEth(viaRpc.value ?? null);
    method = viaRpc.input && viaRpc.input !== "0x" ? viaRpc.input.slice(0, 10) : null;
    interactsWithContract = Boolean(viaRpc.input && viaRpc.input !== "0x");

    const receipt = await ethRpc<{ status?: string; blockNumber?: string }>(
      "eth_getTransactionReceipt",
      [hash],
      "ethereum",
    );
    if (receipt) {
      sources.push("public-rpc.eth_getTransactionReceipt");
      if (receipt.status === "0x1") status = "success";
      else if (receipt.status === "0x0") status = "reverted";
    }
    if (viaRpc.blockNumber) {
      const block = await ethRpc<{ timestamp?: string }>("eth_getBlockByNumber", [viaRpc.blockNumber, false], "ethereum");
      if (block?.timestamp) {
        sources.push("public-rpc.eth_getBlockByNumber");
        timestamp = new Date(Number(BigInt(block.timestamp)) * 1000).toISOString();
      }
    }
  } else {
    const tx = await etherscan<{
      result?: { from?: string; to?: string; value?: string; input?: string };
    }>({
      module: "proxy",
      action: "eth_getTransactionByHash",
      txhash: hash,
    });
    if (tx?.result) {
      sources.push("etherscan.eth_getTransactionByHash");
      from = tx.result.from ?? null;
      to = tx.result.to ?? null;
      valueEth = weiToEth(tx.result.value ?? null);
      method = tx.result.input && tx.result.input !== "0x" ? tx.result.input.slice(0, 10) : null;
      interactsWithContract = Boolean(tx.result.input && tx.result.input !== "0x");
    }
  }

  if (!sources.length) sources.push("insufficient");

  return {
    hash,
    chain: "ethereum",
    from,
    to,
    valueEth,
    timestamp,
    status,
    method,
    interactsWithContract,
    demo: false,
    sources,
  };
}
