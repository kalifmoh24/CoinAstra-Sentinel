import type { ContractData, TransactionData, WalletData } from "../types";
import * as ethereum from "../blockchains/ethereum";
import { isDemoMode } from "../db";
import { demoContractFor, demoTxFor, demoWalletFor } from "../demo/fixtures";

export interface BlockchainDataProvider {
  getWallet(address: string, chain?: string): Promise<WalletData>;
  getContract(address: string, chain?: string): Promise<ContractData>;
  getTransaction(hash: string, chain?: string): Promise<TransactionData>;
  hasCode(address: string, chain?: string): Promise<boolean>;
}

export const blockchainProvider: BlockchainDataProvider = {
  async getWallet(address, chain = "ethereum") {
    if (chain !== "ethereum") {
      return { ...demoWalletFor(address), chain, sources: ["DEMO_FIXTURE", `${chain}-stub`] };
    }
    return ethereum.getEthereumWallet(address);
  },
  async getContract(address, chain = "ethereum") {
    if (chain !== "ethereum") {
      return { ...demoContractFor(address), chain, sources: ["DEMO_FIXTURE", `${chain}-stub`] };
    }
    return ethereum.getEthereumContract(address);
  },
  async getTransaction(hash, chain = "ethereum") {
    if (chain !== "ethereum") {
      return { ...demoTxFor(hash), chain, sources: ["DEMO_FIXTURE", `${chain}-stub`] };
    }
    return ethereum.getEthereumTransaction(hash);
  },
  async hasCode(address, chain = "ethereum") {
    // In DEMO_MODE, only the known demo contract address reports code so wallet scans work.
    if (isDemoMode()) {
      const demoContract = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      return address.toLowerCase() === demoContract.toLowerCase();
    }
    const c = await this.getContract(address, chain);
    return c.isContract;
  },
};

export { isDemoMode };
