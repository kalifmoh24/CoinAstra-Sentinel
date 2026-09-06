import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Dashboard — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. Dashboard surface.",
};

export default function DashboardPage() {
  const item = getNavItem("/dashboard");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
