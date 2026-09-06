import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Launchpad Intelligence — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. Launchpad Intelligence surface.",
};

export default function LaunchpadIntelligencePage() {
  const item = getNavItem("/launchpad-intelligence");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
