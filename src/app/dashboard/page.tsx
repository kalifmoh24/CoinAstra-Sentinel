import type { Metadata } from "next";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { Disclaimer } from "@/components/Disclaimer";
import { RiskScore } from "@/components/RiskScore";
import { Sparkline } from "@/components/Sparkline";
import { PortfolioDonut } from "@/components/PortfolioDonut";
import { SegmentedRiskBar } from "@/components/SegmentedRiskBar";
import { HeroShield } from "@/components/HeroShield";
import type { CategoryScore } from "@/lib/types";
import {
  Sparkles,
  ArrowLeftRight,
  Wallet,
  Radar,
  ShieldCheck,
  Bot,
  CandlestickChart,
  Rocket,
  Coins,
  FileCode2,
  ChevronDown,
  Crown,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — CoinAstra Sentinel",
  description: "CoinAstra Sentinel command center. DEMO widgets are clearly labeled.",
};

/** Clearly labeled DEMO/example figures — never presented as live market data. */
const DEMO_STATS = [
  {
    label: "Scans Performed",
    value: "24",
    delta: "+20% from last 7 days",
    up: true,
    color: "#38bdf8",
    spark: [8, 10, 9, 14, 12, 16, 18, 20, 22, 24],
  },
  {
    label: "High Risk Detected",
    value: "7",
    delta: "↑ 16% from last 7 days",
    up: false,
    color: "#f43f5e",
    spark: [3, 4, 3, 5, 6, 5, 7, 6, 7, 7],
  },
  {
    label: "Assets Monitored",
    value: "18",
    delta: "↑ 8% from last 7 days",
    up: true,
    color: "#34d399",
    spark: [10, 11, 12, 13, 14, 15, 16, 16, 17, 18],
  },
  {
    label: "Alerts Triggered",
    value: "12",
    delta: "↑ 33% from last 7 days",
    up: false,
    color: "#fb923c",
    spark: [4, 5, 6, 5, 7, 8, 9, 10, 11, 12],
  },
];

const DEMO_CATEGORIES: CategoryScore[] = [
  { category: "Security", score: 92, weight: 1, summary: "DEMO example radar" },
  { category: "Contract", score: 74, weight: 1, summary: "DEMO example radar" },
  { category: "Liquidity", score: 35, weight: 1, summary: "DEMO example radar" },
  { category: "Ownership", score: 78, weight: 1, summary: "DEMO example radar" },
  { category: "Transaction", score: 78, weight: 1, summary: "DEMO example radar" },
  { category: "Wallet", score: 92, weight: 1, summary: "DEMO example radar" },
];

const DEMO_SCANS = [
  { type: "Wallet", target: "0x742d…bEb0", score: 91, level: "Critical", time: "2m ago" },
  { type: "Token", target: "0xA0b8…eB48", score: 62, level: "Moderate", time: "18m ago" },
  { type: "Tx", target: "0xabc1…7890", score: 78, level: "High", time: "1h ago" },
  { type: "Contract", target: "0x1111…0582", score: 34, level: "Low", time: "3h ago" },
  { type: "Wallet", target: "0xDeaD…0000", score: 55, level: "Moderate", time: "5h ago" },
];

const DEMO_ALERTS = [
  {
    title: "High Risk Address Interaction",
    desc: "Counterparty flagged in DEMO fixture — verify before signing.",
    time: "2m ago",
    tone: "critical",
  },
  {
    title: "Unlimited Approval Detected",
    desc: "USDC allowance pattern (DEMO example).",
    time: "15m ago",
    tone: "high",
  },
  {
    title: "Funds at Risk",
    desc: "Heuristic exposure match — DEMO only.",
    time: "1h ago",
    tone: "high",
  },
  {
    title: "Mixer-like Exposure",
    desc: "DEMO heuristic — not a live chain alert.",
    time: "3h ago",
    tone: "high",
  },
];

const DEMO_WATCHLIST = [
  { name: "ETH", price: "$3,412.00", change: "+1.24%", up: true, spark: [3100, 3150, 3200, 3180, 3300, 3350, 3400, 3412] },
  { name: "ARB", price: "$1.12", change: "-0.82%", up: false, spark: [1.2, 1.18, 1.15, 1.16, 1.14, 1.13, 1.11, 1.12] },
  { name: "LINK", price: "$18.40", change: "+2.10%", up: true, spark: [16, 16.5, 17, 17.2, 17.8, 18, 18.2, 18.4] },
  { name: "AAVE", price: "$245.00", change: "+0.55%", up: true, spark: [230, 235, 238, 240, 242, 241, 244, 245] },
  { name: "UNI", price: "$9.80", change: "-1.10%", up: false, spark: [10.4, 10.2, 10.1, 9.9, 10.0, 9.85, 9.9, 9.8] },
];

const DEMO_FINDINGS = [
  { title: "Mixer Interaction Detected", desc: "Heuristic match against DEMO mixer stub.", level: "Critical" },
  { title: "High-Risk Address Exposure", desc: "Counterparty in DEMO high-risk set.", level: "Critical" },
  { title: "Unlimited Token Approvals", desc: "DEMO allowance pattern for illustration.", level: "High" },
  { title: "New Contract Interaction", desc: "Recent first-seen contract (DEMO).", level: "High" },
];

const DEMO_MARKET = [
  { name: "BTC", price: "$94,200", change: "+2.1%", up: true, spark: [88, 90, 91, 89, 92, 93, 94, 94.2] },
  { name: "ETH", price: "$3,412", change: "+1.2%", up: true, spark: [3100, 3200, 3180, 3300, 3350, 3400, 3410, 3412] },
  { name: "BNB", price: "$612", change: "-0.4%", up: false, spark: [620, 618, 615, 610, 608, 614, 611, 612] },
  { name: "SOL", price: "$178", change: "+3.4%", up: true, spark: [160, 165, 168, 170, 172, 175, 177, 178] },
];

const DEMO_NEWS = [
  { title: "SEC approves new crypto custody rules (DEMO headline)", source: "Intel Wire", time: "2h ago" },
  { title: "Major DEX reports patched router vulnerability (DEMO)", source: "Security Desk", time: "5h ago" },
  { title: "Stablecoin issuer publishes attestation update (DEMO)", source: "Market Brief", time: "8h ago" },
];

const DEMO_PORTFOLIO_SLICES = [
  { label: "ETH", pct: 45.2, color: "#a855f7" },
  { label: "BTC", pct: 32.1, color: "#fbbf24" },
  { label: "SOL", pct: 12.3, color: "#38bdf8" },
  { label: "Others", pct: 10.4, color: "#64748b" },
];

const DEMO_RISK_24H = [
  { label: "Low", pct: 20, color: "#34d399" },
  { label: "Medium", pct: 30, color: "#fbbf24" },
  { label: "High", pct: 30, color: "#fb923c" },
  { label: "Critical", pct: 20, color: "#f43f5e" },
];

const DEMO_RISK_SPARK = [62, 65, 68, 70, 72, 74, 76, 75, 77, 78];

const CHAINS = ["ETH", "BNB", "Polygon", "ARB", "OP", "AVAX", "SOL", "Base"];

const TOOLS = [
  { href: "/ai-security-analyst", label: "AI Security Analyst", desc: "Evidence-grounded scan explanations", Icon: Sparkles, cta: "Ask Analyst →" },
  { href: "/scan/transaction", label: "Transaction Preview", desc: "Analyze before you sign", Icon: ArrowLeftRight, cta: "Preview →" },
  { href: "/scan/wallet", label: "Wallet Monitor", desc: "Live wallet risk scanner", Icon: Wallet, cta: "Monitor →" },
  { href: "/exposure-checker", label: "Exposure Checker", desc: "Counterparty exposure map", Icon: Radar, cta: "Check →" },
  { href: "/approval-checker", label: "Approval Checker", desc: "Allowance risk patterns", Icon: ShieldCheck, cta: "Review →" },
  { href: "/ai-agent-firewall", label: "AI Agent Firewall", desc: "Fail-closed agent policies", Icon: Bot, cta: "Policies →" },
  { href: "/dex-intelligence", label: "DEX Intelligence", desc: "Pool & router intel (stub)", Icon: CandlestickChart, cta: "Explore →" },
  { href: "/launchpad-intelligence", label: "Launchpad Intel", desc: "Launch risk surface (stub)", Icon: Rocket, cta: "Intel →" },
];

const QUICK_SCAN = [
  { href: "/scan/wallet", label: "Wallet", color: "bg-sky-500/15 text-sky-300 border-sky-500/30", Icon: Wallet },
  { href: "/scan/token", label: "Token", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", Icon: Coins },
  { href: "/scan/contract", label: "Contract", color: "bg-orange-500/15 text-orange-300 border-orange-500/30", Icon: FileCode2 },
  { href: "/scan/transaction", label: "Transaction", color: "bg-accent/15 text-accent-purple border-accent/30", Icon: ArrowLeftRight },
];

function levelClass(level: string) {
  if (level === "Critical") return "text-risk-critical";
  if (level === "High") return "text-risk-high";
  if (level === "Moderate") return "text-risk-moderate";
  return "text-risk-low";
}

function toneDot(tone: string) {
  if (tone === "critical") return "bg-risk-critical";
  if (tone === "high") return "bg-risk-high";
  return "bg-risk-moderate";
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 overflow-x-hidden px-3 py-5 sm:px-5 sm:py-6 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-[28px]">
            Welcome back, Astra 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Your crypto security &amp; intelligence hub. Example widgets are labeled{" "}
            <span className="font-medium text-amber-300">DEMO</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-ink-900/70 px-3 py-1.5 text-xs text-slate-300"
            aria-label="7D Overview period"
          >
            7D Overview
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" strokeWidth={2} aria-hidden />
          </button>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
            DEMO widgets
          </span>
        </div>
      </div>

      {/* ——— Mobile denser stack ——— */}
      <section className="space-y-4 lg:hidden" aria-label="Mobile dashboard">
        <div className="card-glow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Quick Scan</p>
              <p className="text-[11px] text-slate-500">Powered by Sentinel AI</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <HeroShield className="h-28" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {QUICK_SCAN.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl border px-1 text-center text-[11px] font-semibold ${t.color}`}
              >
                <t.Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {t.label}
              </Link>
            ))}
          </div>
          <div className="mt-3">
            <SearchBox />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-300">Today&apos;s Overview</h2>
            <span className="text-[10px] text-amber-300/80">DEMO</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {DEMO_STATS.map((s) => (
              <div key={s.label} className="card-surface p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{s.label.split(" ")[0]}</p>
                <div className="mt-1 flex items-end justify-between gap-2">
                  <p className="text-xl font-semibold tabular-nums text-white">{s.value}</p>
                  <Sparkline points={s.spark} color={s.color} width={56} height={22} />
                </div>
                <p className={`mt-1 text-[11px] ${s.up ? "text-accent-emerald" : "text-risk-high"}`}>
                  {s.delta.split(" ")[0]} <span className="text-slate-600">DEMO</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Sentinel Risk Score (24h)</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <p className="text-3xl font-semibold tabular-nums text-risk-high">
                  78<span className="text-lg text-slate-500">/100</span>
                </p>
                <span className="rounded-full border border-risk-high/40 bg-risk-high/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-risk-high">
                  High Risk
                </span>
                <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-300">
                  DEMO
                </span>
              </div>
            </div>
            <Sparkline points={DEMO_RISK_SPARK} color="#fb923c" width={80} height={36} />
          </div>
          <div className="mt-4">
            <SegmentedRiskBar segments={DEMO_RISK_24H} />
          </div>
          <p className="mt-2 text-[10px] text-slate-600">
            Illustrative 24h risk mix — not live portfolio telemetry.
          </p>
        </div>

        <div className="card-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-300">Top Risk Alerts</h2>
            <Link href="/alerts" className="text-[11px] text-accent-purple hover:underline">
              View All
            </Link>
          </div>
          <p className="text-[10px] text-amber-300/80">DEMO examples</p>
          <ul className="mt-3 space-y-2.5">
            {DEMO_ALERTS.slice(0, 2).map((a) => (
              <li
                key={a.title}
                className="flex gap-3 rounded-xl border border-white/5 bg-ink-950/40 p-3"
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${toneDot(a.tone)}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{a.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{a.desc}</p>
                  <p className="mt-1 text-[10px] text-slate-600">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Desktop denser layout ——— */}
      <section className="hidden space-y-5 lg:block" aria-label="Desktop dashboard">
        <div className="grid grid-cols-4 gap-3">
          {DEMO_STATS.map((s) => (
            <div key={s.label} className="card-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">{s.label}</p>
                <Sparkline points={s.spark} color={s.color} width={64} height={24} />
              </div>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{s.value}</p>
              <p className={`mt-1 text-xs ${s.up ? "text-accent-emerald" : "text-risk-high"}`}>
                {s.delta} <span className="text-slate-600">DEMO</span>
              </p>
            </div>
          ))}
        </div>

        {/* Scan panel (2/3) + Risk (1/3) — shield inside scan panel */}
        <div className="grid items-stretch gap-4 lg:grid-cols-12">
          <div className="card-glow relative overflow-hidden p-5 lg:col-span-8">
            <div className="relative z-10 grid gap-4 lg:grid-cols-5 lg:items-center">
              <div className="space-y-4 lg:col-span-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Scan Anything, Before You Sign</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Wallet, token, contract, or transaction hash — deterministic score with evidence.
                  </p>
                </div>
                <SearchBox />
                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">
                    Supported Chains:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {CHAINS.map((c) => (
                      <span
                        key={c}
                        className="rounded-md border border-white/10 bg-ink-950/40 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-400"
                      >
                        {c}
                      </span>
                    ))}
                    <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent-purple">
                      +6
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:col-span-2">
                <HeroShield />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <RiskScore score={91} band="Critical" demo categories={DEMO_CATEGORIES} compact />
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              This address has multiple high-risk indicators (DEMO example). Not a live scan of your
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
        <div className="grid gap-4 xl:grid-cols-12">
          <div className="card-surface overflow-hidden p-4 xl:col-span-4">
            <h2 className="text-sm font-medium text-slate-300">Recent Scans</h2>
            <p className="text-[10px] text-amber-300/80">DEMO example rows</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[360px] text-left text-xs">
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
                    <tr key={`${r.type}-${r.target}`} className="border-t border-white/5">
                      <td className="py-2">{r.type}</td>
                      <td className="py-2 font-mono">{r.target}</td>
                      <td className="py-2 tabular-nums">{r.score}/100</td>
                      <td className={`py-2 font-medium ${levelClass(r.level)}`}>{r.level}</td>
                      <td className="py-2 text-slate-500">{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface p-4 xl:col-span-2">
            <h2 className="text-sm font-medium text-slate-300">Top Risk Alerts</h2>
            <p className="text-[10px] text-amber-300/80">DEMO examples</p>
            <ul className="mt-3 space-y-2">
              {DEMO_ALERTS.map((a) => (
                <li key={a.title} className="rounded-xl border border-white/5 bg-ink-950/40 p-2.5">
                  <div className="flex items-start gap-2">
                    <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${toneDot(a.tone)}`} />
                    <div>
                      <p className="text-xs font-medium text-white">{a.title}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">{a.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-surface p-4 xl:col-span-3">
            <h2 className="text-sm font-medium text-slate-300">Your Watchlist</h2>
            <p className="text-[10px] text-amber-300/80">DEMO prices — not live</p>
            <ul className="mt-3 space-y-2">
              {DEMO_WATCHLIST.map((w) => (
                <li
                  key={w.name}
                  className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-ink-950/40 px-2.5 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{w.name}</p>
                    <p className="font-mono text-[11px] text-slate-400">{w.price}</p>
                  </div>
                  <Sparkline points={w.spark} color={w.up ? "#34d399" : "#f43f5e"} width={48} height={20} />
                  <span className={`shrink-0 text-xs font-medium ${w.up ? "text-accent-emerald" : "text-risk-critical"}`}>
                    {w.change}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/watchlist" className="mt-3 block text-xs text-accent-purple hover:underline">
              Open watchlist →
            </Link>
          </div>

          <div className="card-surface p-4 xl:col-span-3">
            <h2 className="text-sm font-medium text-slate-300">Critical Findings</h2>
            <p className="text-[10px] text-amber-300/80">DEMO examples</p>
            <ul className="mt-3 space-y-2">
              {DEMO_FINDINGS.map((f) => (
                <li key={f.title} className="rounded-lg border border-white/5 bg-ink-950/40 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-slate-200">{f.title}</span>
                    <span className={`shrink-0 text-[10px] uppercase ${levelClass(f.level)}`}>{f.level}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">{f.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 8 tool tiles */}
        <div className="card-surface p-4">
          <h2 className="text-sm font-medium text-slate-300">Powerful Tools &amp; Intelligence</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
            {TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex min-h-[108px] flex-col justify-between rounded-xl border border-white/5 bg-ink-950/40 p-3 transition hover:border-accent/40 hover:bg-accent/10"
              >
                <div>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent-purple">
                    <t.Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <p className="mt-2 text-xs font-medium leading-snug text-white">{t.label}</p>
                  <p className="mt-1 text-[10px] leading-snug text-slate-500">{t.desc}</p>
                </div>
                <span className="mt-2 text-[11px] text-accent-purple">{t.cta}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="card-surface p-4 lg:col-span-3">
            <h2 className="text-sm font-medium text-slate-300">Market Overview</h2>
            <p className="text-[10px] text-amber-300/80">DEMO top movers — not live</p>
            <ul className="mt-3 space-y-2">
              {DEMO_MARKET.map((w) => (
                <li key={w.name} className="flex items-center justify-between gap-2 text-sm">
                  <span className="w-10 font-medium text-slate-300">{w.name}</span>
                  <Sparkline points={w.spark} color={w.up ? "#34d399" : "#f43f5e"} width={48} height={18} />
                  <span className="font-mono text-xs text-slate-400">{w.price}</span>
                  <span className={w.up ? "text-accent-emerald" : "text-risk-critical"}>{w.change}</span>
                </li>
              ))}
            </ul>
            <Link href="/markets" className="mt-3 block text-xs text-accent-purple hover:underline">
              Markets →
            </Link>
          </div>

          <div className="card-surface p-4 lg:col-span-3">
            <h2 className="text-sm font-medium text-slate-300">Portfolio Overview</h2>
            <p className="text-[10px] text-amber-300/80">DEMO allocation — not live balances</p>
            <div className="mt-3 flex items-center gap-4">
              <PortfolioDonut slices={DEMO_PORTFOLIO_SLICES} centerLabel="18" size={112} />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-semibold text-white">$24,692.18</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-accent-emerald">+2.35% (24h)</span>
                  <Sparkline
                    points={[22000, 22800, 23100, 23500, 24000, 24200, 24500, 24692]}
                    color="#34d399"
                    width={56}
                    height={20}
                  />
                </div>
                <ul className="mt-3 space-y-1 text-[11px] text-slate-400">
                  {DEMO_PORTFOLIO_SLICES.map((s) => (
                    <li key={s.label} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                      {s.label} {s.pct}%
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link href="/portfolio" className="mt-3 block text-xs text-accent-purple hover:underline">
              Portfolio →
            </Link>
          </div>

          <div className="card-surface p-4 lg:col-span-3">
            <h2 className="text-sm font-medium text-slate-300">News &amp; Intelligence</h2>
            <p className="text-[10px] text-amber-300/80">DEMO headlines — not live feeds</p>
            <ul className="mt-3 space-y-2.5">
              {DEMO_NEWS.map((n) => (
                <li key={n.title} className="rounded-xl border border-white/5 bg-ink-950/40 px-3 py-2.5">
                  <p className="text-xs font-medium leading-snug text-slate-200">{n.title}</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {n.source} · {n.time}
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/ai-intelligence" className="mt-3 block text-xs text-accent-purple hover:underline">
              Intelligence →
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-purple-cta p-5 shadow-glow-purple lg:col-span-3">
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-200" strokeWidth={2} aria-hidden />
                <p className="text-lg font-semibold text-white">Go Pro</p>
              </div>
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
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
