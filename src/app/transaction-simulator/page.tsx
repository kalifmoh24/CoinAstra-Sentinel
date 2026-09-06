import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Transaction Simulator — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. Transaction Simulator surface.",
};

export default function TransactionSimulatorPage() {
  const item = getNavItem("/transaction-simulator");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
