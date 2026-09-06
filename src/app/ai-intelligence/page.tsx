import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "AI Intelligence — Coming soon · CoinAstra Sentinel",
  description: "AI Intelligence is on the CoinAstra roadmap and is not live yet.",
};

export default function Page() {
  return <ComingSoon id="ai-intelligence" />;
}
