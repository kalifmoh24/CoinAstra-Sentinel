import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Exposure Checker — Coming soon · CoinAstra Sentinel",
  description: "Exposure Checker is on the CoinAstra roadmap and is not live yet.",
};

export default function Page() {
  return <ComingSoon id="exposure-checker" />;
}
