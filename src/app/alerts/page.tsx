import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Alerts — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. Alerts surface.",
};

export default function AlertsPage() {
  const item = getNavItem("/alerts");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
