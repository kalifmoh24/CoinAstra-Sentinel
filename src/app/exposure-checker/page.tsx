import type { Metadata } from "next";
import { ScannerPageShell } from "@/components/ScannerPageShell";

export const metadata: Metadata = {
  title: "Exposure Checker — CoinAstra Sentinel",
  description:
    "Map holdings and approval-driven exposure from structured evidence. Balances never invented. DEMO labeled.",
};

export default function ExposureCheckerPage() {
  return (
    <ScannerPageShell
      type="wallet"
      title="Exposure Checker"
      subtitle="See counterparty and holding exposure before you size risk."
      bullets={[
        "High-risk counterparty exposure from labeled interactions",
        "Holdings inventory when providers supply balances — never invented",
        "Concentration and unlimited-approval exposure findings",
        "Missing holdings → Insufficient data, not a clean bill of health",
        "DEMO fixtures stay labeled DEMO",
      ]}
    />
  );
}
