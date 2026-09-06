import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "AI Agent Firewall — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. AI Agent Firewall surface.",
};

export default function AiAgentFirewallPage() {
  const item = getNavItem("/ai-agent-firewall");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
