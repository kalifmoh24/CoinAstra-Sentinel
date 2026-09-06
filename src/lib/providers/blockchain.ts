import type { ContractData, TransactionData, WalletData } from "../types";
import * as ethereum from "../blockchains/ethereum";
import { isDemoMode } from "../db";
import { demoContractFor, demoTxFor, demoWalletFor } from "../demo/fixtures";
import { ethGetCode } from "../live/rpc";

export interface BlockchainDataProvider {
  getWallet(address: string, chain?: string): Promise<WalletData>;
  getContract(address: string, chain?: string): Promise<ContractData>;
  getTransaction(hash: string, chain?: string): Promise<TransactionData>;
  hasCode(address: string, chain?: string): Promise<boolean>;
}

export const blockchainProvider: BlockchainDataProvider = {
  async getWallet(address, chain = "ethereum") {
    if (chain !== "ethereum") {
      return {
        address,
        chain,
        firstSeen: null,
        txCount: null,
        balanceEth: null,
        interactions: [],
        fundingSource: null,
        rapidMovement: null,
        newContractInteractions: null,
        mixerExposure: null,
        activity: undefined,
        approvals: null,
        holdings: null,
        demo: false,
        sources: [`${chain}-unsupported`],
      };
    }
    if (isDemoMode()) return demoWalletFor(address);
    return ethereum.getEthereumWallet(address);
  },
  async getContract(address, chain = "ethereum") {
    if (chain !== "ethereum") {
      return {
        address,
        chain,
        isContract: false,
        verified: null,
        name: null,
        compiler: null,
        createdAt: null,
        isProxy: null,
        implementation: null,
        owner: null,
        deployer: null,
        abi: null,
        sourceCode: null,
        flags: { honeypotHeuristic: null },
        demo: false,
        sources: [`${chain}-unsupported`],
      };
    }
    if (isDemoMode()) return demoContractFor(address);
    return ethereum.getEthereumContract(address);
  },
  async getTransaction(hash, chain = "ethereum") {
    if (chain !== "ethereum") {
      return {
        hash,
        chain,
        from: null,
        to: null,
        valueEth: null,
        timestamp: null,
        status: "unknown",
        method: null,
        interactsWithContract: false,
        demo: false,
        sources: [`${chain}-unsupported`],
      };
    }
    if (isDemoMode()) return demoTxFor(hash);
    return ethereum.getEthereumTransaction(hash);
  },
  async hasCode(address, chain = "ethereum") {
    if (isDemoMode()) {
      const demoContract = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      return address.toLowerCase() === demoContract.toLowerCase();
    }
    const code = await ethGetCode(address, chain);
    if (code == null) return false;
    return code !== "0x" && code !== "0x0";
  },
};

export { isDemoMode };
