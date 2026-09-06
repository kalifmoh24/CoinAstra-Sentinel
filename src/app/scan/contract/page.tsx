import type { Metadata } from "next";
import { ScannerPageShell } from "@/components/ScannerPageShell";

export const metadata: Metadata = {
  title: "Contract scanner — CoinAstra Sentinel",
  description: "Smart contract scan: verification, ownership, proxy patterns, and ABI privileges.",
};

export default function ContractScanPage() {
  return (
    <ScannerPageShell
      type="contract"
      title="Smart contract scanner"
      subtitle="Inspect verification, ownership, and dangerous ABI privileges before you sign."
      bullets={[
        "Source verification and deployment age",
        "Proxy / upgradeable patterns and owner status",
        "Self-destruct, mint, pause, blacklist heuristics",
        "Honeypot heuristic hook when providers return it",
      ]}
    />
  );
}
