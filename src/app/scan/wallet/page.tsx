import type { Metadata } from "next";
import { ScannerPageShell } from "@/components/ScannerPageShell";

export const metadata: Metadata = {
  title: "Wallet scanner — CoinAstra Sentinel",
  description: "Scan an EVM wallet for age, activity, funding risk, and security heuristics.",
};

export default function WalletScanPage() {
  return (
    <ScannerPageShell
      type="wallet"
      title="Wallet scanner"
      subtitle="Know the story behind an address before you interact."
      bullets={[
        "Wallet age, tx count, and activity patterns",
        "Funding source and high-risk counterparty labels",
        "Mixer / rapid-movement heuristics (evidence-backed)",
        "DEMO fixtures labeled when DEMO_MODE is on",
      ]}
    />
  );
}
