import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "DEX Intelligence — Coming soon · CoinAstra Sentinel",
  description: "DEX Intelligence is on the CoinAstra roadmap and is not live yet.",
};

export default function Page() {
  return <ComingSoon id="dex-intelligence" />;
}
