import type { Metadata } from "next";
import { XrayUnlock } from "@/components/XrayUnlock";
import { Disclaimer } from "@/components/Disclaimer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "X-Ray — Unlock the Coin — CoinAstra Sentinel",
  description:
    "Deconstruct a crypto asset from public market and contract evidence. Missing layers stay labeled.",
};

export default function XrayPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-36 pt-8 sm:px-6 sm:pb-16">
      <XrayUnlock />
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
