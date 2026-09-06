import type { Metadata } from "next";
import { ScannerPageShell } from "@/components/ScannerPageShell";

export const metadata: Metadata = {
  title: "Approval Checker — CoinAstra Sentinel",
  description:
    "List ERC-20 allowances with evidence. Unlimited and risky spenders flagged. DEMO fixtures labeled. No revoke broadcast.",
};

export default function ApprovalCheckerPage() {
  return (
    <ScannerPageShell
      type="wallet"
      title="Approval Checker"
      subtitle="Know which spenders can move tokens — evidence-backed allowances only."
      bullets={[
        "Lists structured ERC-20 allowances when providers supply them",
        "Flags unlimited allowances and high-risk spenders",
        "Missing inventory surfaces as Insufficient data (not “all clear”)",
        "DEMO fixtures are labeled DEMO — Sentinel never invents approvals",
        "Guidance only: does not broadcast revoke transactions",
      ]}
    />
  );
}
