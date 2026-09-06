import type { Metadata } from "next";
import { ScannerPageShell } from "@/components/ScannerPageShell";

export const metadata: Metadata = {
  title: "Transaction Simulator — CoinAstra Sentinel",
  description:
    "Simulate call outcomes without broadcasting. Fail-closed without eth_call/trace. DEMO labeled. Analysis only.",
};

export default function TransactionSimulatorPage() {
  return (
    <ScannerPageShell
      type="transaction"
      title="Transaction Simulator"
      subtitle="Preview what a transaction implies — never signs or broadcasts."
      bullets={[
        "Paste a transaction hash to analyze + attach a simulation result",
        "Without eth_call/trace backends: Insufficient data (no invented amounts or gas)",
        "Flags reverts, unlimited approvals, sensitive methods, outbound value",
        "DEMO fixtures are labeled DEMO",
        "Analysis only — not execution",
      ]}
    />
  );
}
