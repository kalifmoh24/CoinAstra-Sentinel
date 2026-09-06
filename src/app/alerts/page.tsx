import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Alerts — Coming soon · CoinAstra Sentinel",
  description: "Alerts is on the CoinAstra roadmap and is not live yet.",
};

export default function Page() {
  return <ComingSoon id="alerts" />;
}
