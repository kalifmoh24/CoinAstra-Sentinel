import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Portfolio — Coming soon · CoinAstra Sentinel",
  description: "Portfolio is on the CoinAstra roadmap and is not live yet.",
};

export default function Page() {
  return <ComingSoon id="portfolio" />;
}
