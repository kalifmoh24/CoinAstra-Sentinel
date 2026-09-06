const ITEMS = [
  {
    title: "Security",
    desc: "Mixer exposure stubs, high-risk counterparties, sanctions/phishing intel when available.",
  },
  {
    title: "Contract",
    desc: "Verification, age, proxy/upgradeability, ABI privilege heuristics.",
  },
  {
    title: "Wallet",
    desc: "Age, activity, funding source risk, rapid movement, new contract interactions.",
  },
  {
    title: "Liquidity",
    desc: "Reported liquidity depth and related market signals when providers return data.",
  },
  {
    title: "Ownership",
    desc: "Owner privileges, mint/pause/blacklist controls from verified ABI heuristics.",
  },
  {
    title: "Transaction",
    desc: "Sensitive methods (approve, ownership), value, contract interaction context.",
  },
];

export function WhatSentinelChecks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-medium text-accent-cyan">Coverage</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          What Sentinel Checks
        </h2>
        <p className="mt-3 text-slate-400">
          Deterministic indicators first. AI only explains structured findings — it never invents
          the score or on-chain facts.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-white/5 bg-ink-900/50 p-5 shadow-glow transition hover:border-accent/30"
          >
            <h3 className="font-medium text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
