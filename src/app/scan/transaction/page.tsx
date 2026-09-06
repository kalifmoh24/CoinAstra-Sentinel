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
      title="Transaction Preview"
      subtitle="Before you sign — analysis only. Sentinel never signs, broadcasts, simulates execution, or submits transactions."
      bullets={[
        "Swap-style summary fields when from/to/value/method exist in evidence",
        "Risk gauge + band from deterministic scoring",
        "Dangerous permissions and approval heuristics when present",
        "Proceed Anyway stays disabled — Cancel returns here",
      ]}
    />
  );
}
