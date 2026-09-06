import type { Metadata } from "next";
import { StubPageShell } from "@/components/StubPageShell";
import { getNavItem } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Approval Checker — CoinAstra",
  description: "CoinAstra platform · Sentinel security engine. Approval Checker surface.",
};

export default function ApprovalCheckerPage() {
  const item = getNavItem("/approval-checker");
  if (!item) return null;
  return <StubPageShell item={item} />;
}
