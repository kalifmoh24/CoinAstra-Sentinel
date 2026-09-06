import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Holdings — CoinAstra",
  description: "Holdings scaffolding. No invented balances.",
};

export default function HoldingsPage() {
  const item = getNavItem("/holdings");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
