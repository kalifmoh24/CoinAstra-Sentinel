import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Transaction Simulator — Coming soon · CoinAstra Sentinel",
  description: "Transaction Simulator is on the CoinAstra roadmap and is not live yet.",
};

export default function Page() {
  return <ComingSoon id="transaction-simulator" />;
}
