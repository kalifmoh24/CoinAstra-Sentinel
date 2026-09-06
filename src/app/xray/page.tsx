import type { Metadata } from "next";
import { Suspense } from "react";
import { XrayUnlock } from "@/components/XrayUnlock";
import { Disclaimer } from "@/components/Disclaimer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "X-Ray — Unlock the Coin — CoinAstra Sentinel",
  description:
    "Deconstruct a crypto asset from public market and contract evidence. Missing layers stay labeled unavailable.",
};

export default function XrayPage() {
  return (
    <div className="mx-auto max-w-5xl px-3 pb-36 pt-5 sm:px-6 sm:pb-16 sm:pt-8">
      <Suspense
        fallback={
          <div className="card-glow p-6">
            <p className="text-sm text-slate-400">Loading X-Ray…</p>
          </div>
        }
      >
        <XrayUnlock />
      </Suspense>
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
