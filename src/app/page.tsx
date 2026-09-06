import { SearchBox } from "@/components/SearchBox";
import { WhatSentinelChecks } from "@/components/WhatSentinelChecks";
import { Disclaimer } from "@/components/Disclaimer";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-grid opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-accent-cyan">
              The security intelligence layer for crypto.
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Know Before You Sign.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-slate-400 sm:text-lg">
              CoinAstra Sentinel turns wallet, token, contract, and transaction data into a
              deterministic risk score with evidence — then explains it. AI never invents the facts.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <SearchBox />
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <Disclaimer compact />
          </div>
        </div>
      </section>
      <WhatSentinelChecks />
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-white/5 bg-ink-900/40 p-6 sm:p-8">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="mt-4 grid gap-4 text-sm text-slate-400 sm:grid-cols-4">
            <li>
              <span className="font-mono text-accent-cyan">01</span>
              <p className="mt-1 text-slate-200">Ingest blockchain & provider data</p>
            </li>
            <li>
              <span className="font-mono text-accent-cyan">02</span>
              <p className="mt-1 text-slate-200">Deterministic risk engine + evidence</p>
            </li>
            <li>
              <span className="font-mono text-accent-cyan">03</span>
              <p className="mt-1 text-slate-200">Sentinel AI explains findings only</p>
            </li>
            <li>
              <span className="font-mono text-accent-cyan">04</span>
              <p className="mt-1 text-slate-200">You decide before you sign</p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
