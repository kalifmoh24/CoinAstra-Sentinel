import type { Metadata } from "next";
import { XRayUnlockClient } from "@/components/XRayUnlockClient";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "CoinAstra X-Ray — Unlock the Coin",
  description:
    "Full crypto intelligence profile — six evidence-backed dimensions. Not price prediction. DEMO labeled; fail-closed on missing data.",
};

export default function XRayPage() {
  return (
    <div className="mx-auto max-w-5xl overflow-x-hidden px-4 pb-36 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
      <p className="text-sm font-medium text-accent-purple">CoinAstra X-Ray</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Unlock the Coin
      </h1>
      <p className="mt-3 max-w-2xl text-base text-slate-400">
        Six deterministic dimension scores with evidence — Security, Tokenomics, Liquidity, On-Chain, Market,
        Ecosystem. Not price prediction or signal spam. Missing data is Insufficient data, never invent.
      </p>
      <div className="mt-8">
        <XRayUnlockClient />
      </div>
      <div className="mt-10">
        <Disclaimer />
      </div>
    </div>
  );
}
