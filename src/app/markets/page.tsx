import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Markets — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. Markets surface.",
};

export default function MarketsPage() {
  const item = getNavItem("/markets");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
