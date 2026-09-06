import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Launchpad Intelligence — Coming soon · CoinAstra Sentinel",
  description: "Launchpad Intelligence is on the CoinAstra roadmap and is not live yet.",
};

export default function Page() {
  return <ComingSoon id="launchpad-intelligence" />;
}
