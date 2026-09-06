import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Watchlist — Coming soon · CoinAstra Sentinel",
  description: "Watchlist is on the CoinAstra roadmap and is not live yet.",
};

export default function Page() {
  return <ComingSoon id="watchlist" />;
}
