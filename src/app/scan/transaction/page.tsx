import type { Metadata } from "next";
import { ScannerPageShell } from "@/components/ScannerPageShell";

export const metadata: Metadata = {
  title: "Transaction preview — CoinAstra Sentinel",
  description: "Analyze a transaction hash. Preview only — Sentinel never executes or signs.",
};

export default function TransactionScanPage() {
  return (
    <ScannerPageShell
      type="transaction"
      title="Transaction preview"
      subtitle="Analysis only. Sentinel never signs, broadcasts, or submits transactions."
      bullets={[
        "Decoded method sensitivity (approve, ownership, upgrades)",
        "Native value and contract-interaction context",
        "Status and party evidence from providers",
        "Pair with contract/wallet scans for deeper context",
      ]}
    />
  );
}
