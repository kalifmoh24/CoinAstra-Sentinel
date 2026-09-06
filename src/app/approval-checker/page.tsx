import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Approval Checker — Coming soon · CoinAstra Sentinel",
  description: "Approval Checker is on the CoinAstra roadmap and is not live yet.",
};

export default function Page() {
  return <ComingSoon id="approval-checker" />;
}
