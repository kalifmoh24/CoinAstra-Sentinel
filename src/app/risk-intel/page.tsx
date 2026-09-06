import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Risk Intel — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. Risk Intel surface.",
};

export default function RiskIntelPage() {
  const item = getNavItem("/risk-intel");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
