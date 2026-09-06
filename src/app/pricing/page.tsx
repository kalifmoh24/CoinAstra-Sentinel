import Link from "next/link";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    blurb: "Explore Sentinel with daily limits.",
    features: ["5 scans / day", "Ethereum DEMO + live when keyed", "Evidence-backed score", "Templated AI explanation"],
    cta: "Start scanning",
    href: "/",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Soon",
    blurb: "Power users and desks — payments stub.",
    features: ["Higher limits", "Priority providers", "OpenAI explanations", "Export JSON"],
    cta: "Join waitlist (stub)",
    href: "/",
    highlight: true,
  },
  {
    name: "Business",
    price: "Soon",
    blurb: "Teams, monitoring, and API — scaffold only.",
    features: ["API access", "Monitoring / alerts (later)", "SSO (later)", "SLA (later)"],
    cta: "Contact (stub)",
    href: "/",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-accent-cyan">Pricing</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple tiers. Payments later.
        </h1>
        <p className="mt-3 text-slate-400">
          CoinAstra platform · Sentinel security engine. Free tier stub (5 scans/day via cookie/IP).
          Pro and Business are placeholders — no payments yet.
        </p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`flex flex-col rounded-2xl border p-6 ${
              t.highlight
                ? "border-accent/40 bg-ink-900/80 shadow-glow"
                : "border-white/5 bg-ink-900/40"
            }`}
          >
            <h2 className="text-lg font-semibold">{t.name}</h2>
            <p className="mt-2 text-3xl font-semibold text-white">{t.price}</p>
            <p className="mt-2 text-sm text-slate-400">{t.blurb}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-300">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-accent-emerald">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={t.href}
              className={`mt-8 rounded-xl px-4 py-2.5 text-center text-sm font-semibold ${
                t.highlight
                  ? "bg-accent text-white hover:brightness-110"
                  : "bg-ink-700 text-white hover:bg-ink-600"
              }`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-white/10 bg-ink-900/40 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">We don&apos;t do this</p>
        <p className="mt-3 text-sm text-slate-300">
          No AI BTC candle predictions. No generic signal spam. No invented prices or &quot;buy now&quot; tips.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          CoinAstra is a research and security platform. Sentinel scores risk from evidence — DEMO
          fixtures stay labeled DEMO, and missing data is Insufficient data.
        </p>
      </div>
    </div>
  );
}
