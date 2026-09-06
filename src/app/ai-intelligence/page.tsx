import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "AI Intelligence — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. AI Intelligence surface.",
};

export default function AiIntelligencePage() {
  const item = getNavItem("/ai-intelligence");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
