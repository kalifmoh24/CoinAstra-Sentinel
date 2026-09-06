import type { Metadata } from "next";
import { ScannerPageShell } from "@/components/ScannerPageShell";

export const metadata: Metadata = {
  title: "Token scanner — CoinAstra Sentinel",
  description: "Token security scan: verification, liquidity, holders, and privilege heuristics.",
};

export default function TokenScanPage() {
  return (
    <ScannerPageShell
      type="token"
      title="Token security scanner"
      subtitle="Liquidity, holders, and contract privileges — scored with evidence."
      bullets={[
        "Verification, age, proxy / upgradeability",
        "Mint, pause, blacklist, fee-control ABI heuristics",
        "Liquidity depth, holder breadth, volume signals",
        "AI explains findings only — never invents the score",
      ]}
    />
  );
}
