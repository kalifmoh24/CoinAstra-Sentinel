import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Watchlist — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. Watchlist surface.",
};

export default function WatchlistPage() {
  const item = getNavItem("/watchlist");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
