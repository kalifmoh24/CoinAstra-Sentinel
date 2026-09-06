import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "API / Integrations — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. API / Integrations surface.",
};

export default function ApiIntegrationsPage() {
  const item = getNavItem("/api-integrations");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
