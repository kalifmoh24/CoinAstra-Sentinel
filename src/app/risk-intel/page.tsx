import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Risk Intel — Coming soon · CoinAstra Sentinel",
  description: "Risk Intel is on the CoinAstra roadmap and is not live yet.",
};

export default function Page() {
  return <ComingSoon id="risk-intel" />;
}
