import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Portfolio — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. Portfolio surface.",
};

export default function PortfolioPage() {
  const item = getNavItem("/portfolio");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
