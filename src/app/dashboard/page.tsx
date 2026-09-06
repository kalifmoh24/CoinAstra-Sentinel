import type { Metadata } from "next";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { Disclaimer } from "@/components/Disclaimer";
import { RiskScore } from "@/components/RiskScore";
import type { CategoryScore } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard — CoinAstra Sentinel",
  description: "CoinAstra Sentinel command center. DEMO widgets are clearly labeled.",
};

/** Clearly labeled DEMO/example figures — never presented as live market data. */
const DEMO_STATS = [
  { label: "Scans Performed", value: "24", delta: "+12%", up: true },
  { label: "High Risk Detected", value: "7", delta: "+3%", up: false },
  { label: "Assets Monitored", value: "18", delta: "+5%", up: true },
  { label: "Alerts Triggered", value: "12", delta: "+8%", up: false },
];

const DEMO_CATEGORIES: CategoryScore[] = [
  { category: "Security", score: 92, weight: 1, summary: "DEMO example radar" },
  { category: "Contract", score: 78, weight: 1, summary: "DEMO example radar" },
  { category: "Liquidity", score: 55, weight: 1, summary: "DEMO example radar" },
  { category: "Ownership", score: 88, weight: 1, summary: "DEMO example radar" },
  { category: "Transaction", score: 70, weight: 1, summary: "DEMO example radar" },
  { category: "Wallet", score: 85, weight: 1, summary: "DEMO example radar" },
];

const DEMO_SCANS = [
  { type: "Wallet", target: "0x742d…bEb0", score: 91, level: "Critical", time: "2m ago" },
  { type: "Token", target: "0xA0b8…eB48", score: 62, level: "Moderate", time: "18m ago" },
  { type: "Tx", target: "0xabc1…7890", score: 78, level: "High", time: "1h ago" },
  { type: "Contract", target: "0x1111…0582", score: 34, level: "Low", time: "3h ago" },
];

const DEMO_ALERTS = [
  { title: "High Risk Interaction", desc: "Counterparty flagged in DEMO fixture", time: "2m ago", tone: "critical" },
  { title: "Approval Risk", desc: "Unlimited allowance pattern (DEMO)", time: "14m ago", tone: "high" },
  { title: "Mixer-like Exposure", desc: "Heuristic match — DEMO only", time: "1h ago", tone: "high" },
];

const DEMO_WATCHLIST = [
  { name: "ETH", price: "$3,412.00", change: "+1.2%", up: true },
  { name: "BTC", price: "$94,200.00", change: "-0.4%", up: false },
  { name: "SOL", price: "$178.40", change: "+2.8%", up: true },
];

const DEMO_FINDINGS = [
  { title: "High-Risk Address Exposure", level: "Critical" },
  { title: "Mixer Interaction Detected", level: "High" },
  { title: "Unlimited Token Approvals", level: "High" },
];

const TOOLS = [
  { href: "/ai-security-analyst", label: "AI Security Analyst", icon: "✦" },
  { href: "/scan/transaction", label: "Transaction Preview", icon: "⇄" },
  { href: "/scan/wallet", label: "Wallet Monitor", icon: "W" },
  { href: "/approval-checker", label: "Approval Checker", icon: "✓" },
  { href: "/exposure-checker", label: "Exposure Checker", icon: "◎" },
  { href: "/risk-intel", label: "Risk Intel", icon: "◈" },
];

function levelClass(level: string) {
  if (level === "Critical") return "text-risk-critical";
  if (level === "High") return "text-risk-high";
  if (level === "Moderate") return "text-risk-moderate";
  return "text-risk-low";
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome back, Astra 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sentinel command center — scan before you sign. Example widgets are labeled DEMO.
          </p>
        </div>
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
          DEMO widgets
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {DEMO_STATS.map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{s.value}</p>
            <p className={`mt-1 text-xs ${s.up ? "text-accent-emerald" : "text-risk-high"}`}>
              {s.delta}{" "}
              <span className="text-slate-600">DEMO</span>
            </p>
          </div>
        ))}
      </div>

      {/* Scan + Risk */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card-glow space-y-4 p-5 lg:col-span-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Scan Anything, Before You Sign</h2>
            <p className="mt-1 text-sm text-slate-400">
              Wallet, token, contract, or transaction hash — deterministic score with evidence.
            </p>
          </div>
          <SearchBox />
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/scan/wallet", label: "Wallet", color: "bg-sky-500/20 text-sky-300" },
              { href: "/scan/token", label: "Token", color: "bg-emerald-500/20 text-emerald-300" },
              { href: "/scan/contract", label: "Contract", color: "bg-orange-500/20 text-orange-300" },
              { href: "/scan/transaction", label: "Transaction", color: "bg-accent/20 text-accent-purple" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`inline-flex min-h-[40px] items-center rounded-xl px-3.5 text-sm font-medium ${t.color}`}
              >
                {t.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-slate-500">
            {["ETH", "BSC", "Polygon", "Base", "Arbitrum", "Solana"].map((c) => (
              <span key={c} className="rounded-md border border-white/10 px-2 py-1">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <RiskScore
            score={91}
            band="Critical"
            demo
            categories={DEMO_CATEGORIES}
            compact
          />
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            DEMO example card illustrating a critical 6-axis radar. Not a live scan of your
            wallet.
          </p>
          <Link
            href="/scan/wallet"
            className="mt-3 inline-flex min-h-[40px] items-center text-sm font-medium text-accent-purple hover:underline"
          >
            View Full Analysis →
          </Link>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <div className="card-surface overflow-hidden p-4 xl:col-span-2">
          <h2 className="text-sm font-medium text-slate-300">Recent Scans</h2>
          <p className="text-[10px] text-amber-300/80">DEMO example rows</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Target</th>
                  <th className="pb-2 font-medium">Score</th>
                  <th className="pb-2 font-medium">Level</th>
                  <th className="pb-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {DEMO_SCANS.map((r) => (
                  <tr key={r.target} className="border-t border-white/5">
                    <td className="py-2.5">{r.type}</td>
                    <td className="py-2.5 font-mono">{r.target}</td>
                    <td className="py-2.5 tabular-nums">{r.score}</td>
                    <td className={`py-2.5 font-medium ${levelClass(r.level)}`}>{r.level}</td>
                    <td className="py-2.5 text-slate-500">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-surface p-4">
          <h2 className="text-sm font-medium text-slate-300">Top Risk Alerts</h2>
          <p className="text-[10px] text-amber-300/80">DEMO examples</p>
          <ul className="mt-3 space-y-2.5">
            {DEMO_ALERTS.map((a) => (
              <li key={a.title} className="rounded-xl border border-white/5 bg-ink-950/40 p-3">
                <p className="text-sm font-medium text-white">{a.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{a.desc}</p>
                <p className="mt-1 text-[10px] text-slate-600">{a.time}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-surface p-4">
          <h2 className="text-sm font-medium text-slate-300">Your Watchlist</h2>
          <p className="text-[10px] text-amber-300/80">DEMO prices — not live</p>
          <ul className="mt-3 space-y-2.5">
            {DEMO_WATCHLIST.map((w) => (
              <li
                key={w.name}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-950/40 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-white">{w.name}</p>
                  <p className="font-mono text-xs text-slate-400">{w.price}</p>
                </div>
                <span className={`text-xs font-medium ${w.up ? "text-accent-emerald" : "text-risk-critical"}`}>
                  {w.change}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/watchlist" className="mt-3 block text-xs text-accent-purple hover:underline">
            Open watchlist →
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-4">
          <h2 className="text-sm font-medium text-slate-300">Critical Findings</h2>
          <p className="text-[10px] text-amber-300/80">DEMO examples</p>
          <ul className="mt-3 space-y-2">
            {DEMO_FINDINGS.map((f) => (
              <li
                key={f.title}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-ink-950/40 px-3 py-2 text-sm"
              >
                <span className="text-slate-200">{f.title}</span>
                <span className={`text-[10px] uppercase ${levelClass(f.level)}`}>{f.level}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-surface p-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-slate-300">Powerful Tools & Intelligence</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex min-h-[72px] flex-col justify-center rounded-xl border border-white/5 bg-ink-950/40 p-3 transition hover:border-accent/40 hover:bg-accent/10"
              >
                <span className="text-accent-purple">{t.icon}</span>
                <span className="mt-1 text-xs font-medium text-white">{t.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-4">
          <h2 className="text-sm font-medium text-slate-300">Market Overview</h2>
          <p className="text-[10px] text-amber-300/80">DEMO top gainers — not live</p>
          <ul className="mt-3 space-y-2">
            {DEMO_WATCHLIST.map((w) => (
              <li key={w.name} className="flex justify-between text-sm">
                <span className="text-slate-300">{w.name}</span>
                <span className={w.up ? "text-accent-emerald" : "text-risk-critical"}>{w.change}</span>
              </li>
            ))}
          </ul>
          <Link href="/markets" className="mt-3 block text-xs text-accent-purple hover:underline">
            Markets →
          </Link>
        </div>

        <div className="card-surface p-4">
          <h2 className="text-sm font-medium text-slate-300">Portfolio Overview</h2>
          <p className="text-[10px] text-amber-300/80">DEMO allocation — not live balances</p>
          <p className="mt-3 text-2xl font-semibold text-white">$24,692.18</p>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full">
            <div className="w-[40%] bg-accent" title="ETH DEMO" />
            <div className="w-[30%] bg-amber-400" title="BTC DEMO" />
            <div className="w-[20%] bg-sky-400" title="SOL DEMO" />
            <div className="w-[10%] bg-slate-600" title="Other DEMO" />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">ETH 40% · BTC 30% · SOL 20% · Other 10%</p>
          <Link href="/portfolio" className="mt-3 block text-xs text-accent-purple hover:underline">
            Portfolio →
          </Link>
        </div>

        <div className="rounded-2xl bg-purple-cta p-5 shadow-glow-purple">
          <p className="text-lg font-semibold text-white">Go Pro</p>
          <ul className="mt-3 space-y-1.5 text-sm text-white/85">
            <li>✓ Unlimited Scans</li>
            <li>✓ Real-time Alerts</li>
            <li>✓ Advanced AI Analysis</li>
            <li>✓ Priority providers</li>
          </ul>
          <p className="mt-2 text-[11px] text-white/70">Payments stub — no real charges.</p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex min-h-[40px] w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-violet-900 hover:bg-white/95"
          >
            Upgrade Now
          </Link>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
