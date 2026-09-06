import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "DEX Intelligence — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. DEX Intelligence surface.",
};

export default function DexIntelligencePage() {
  const item = getNavItem("/dex-intelligence");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
