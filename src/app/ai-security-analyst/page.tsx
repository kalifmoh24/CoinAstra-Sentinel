import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "AI Security Analyst — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. AI Security Analyst surface.",
};

export default function AiSecurityAnalystPage() {
  const item = getNavItem("/ai-security-analyst");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
