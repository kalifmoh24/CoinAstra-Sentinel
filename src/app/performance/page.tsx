import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Performance — CoinAstra",
  description: "Performance scaffolding. No invented returns.",
};

export default function PerformancePage() {
  const item = getNavItem("/performance");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
