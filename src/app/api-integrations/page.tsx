import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "API/Integrations — Coming soon · CoinAstra Sentinel",
  description: "API/Integrations is on the CoinAstra roadmap and is not live yet.",
};

export default function Page() {
  return <ComingSoon id="api-integrations" />;
}
