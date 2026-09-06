import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Exposure Checker — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. Exposure Checker surface.",
};

export default function ExposureCheckerPage() {
  const item = getNavItem("/exposure-checker");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
