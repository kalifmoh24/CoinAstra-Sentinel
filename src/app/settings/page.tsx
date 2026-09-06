import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Settings — CoinAstra",
  description: "Settings scaffolding. No payments processed.",
};

export default function SettingsPage() {
  const item = getNavItem("/settings");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
