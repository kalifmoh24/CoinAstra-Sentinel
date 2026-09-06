"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { XrayFinding, XrayReport } from "@/lib/live/xray";
import { HeroShield } from "./HeroShield";

function money(n: number | null) {
  if (n == null) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toLocaleString()}`;
}

function scoreTone(score: number | null) {
  if (score == null) return "text-slate-300 border-white/15 bg-white/5";
  if (score >= 81) return "text-emerald-300 border-emerald-500/30 bg-emerald-500/10";
  if (score >= 61) return "text-sky-300 border-sky-500/30 bg-sky-500/10";
  if (score >= 41) return "text-amber-300 border-amber-500/30 bg-amber-500/10";
  if (score >= 21) return "text-orange-300 border-orange-500/30 bg-orange-500/10";
  return "text-rose-300 border-rose-500/30 bg-rose-500/10";
}

const STEPS = [
  "Identifying asset",
  "Mapping contract",
  "Reading market data",
  "Checking on-chain code",
  "Coin unlocked",
];

const CHIPS = [
  { q: "ethereum", label: "ETH" },
  { q: "bitcoin", label: "BTC" },
  { q: "solana", label: "SOL" },
  { q: "usd-coin", label: "USDC" },
];

const TABS = ["Overview", "Findings", "Gaps"] as const;
type Tab = (typeof TABS)[number];

export function XrayUnlock() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<XrayReport | null>(null);

  async function run(query: string) {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    setError(null);
    setReport(null);
    setLoading(true);
    setStep(0);
    const tick = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 2)), 380);
    try {
      const res = await fetch(`/api/xray?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      clearInterval(tick);
      setStep(STEPS.length - 1);
      if (!res.ok) {
        setError(data.error || "Unlock failed");
        setLoading(false);
        return;
      }
      setReport(data.report as XrayReport);
    } catch {
      clearInterval(tick);
      setError("Network error — try again.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (initial.length >= 2) void run(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run(q);
  }

  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="card-glow p-4 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-5 lg:items-center">
          <div className="lg:col-span-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent-purple">
              CoinAstra X-Ray
            </p>
            <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-white sm:text-4xl">
              Unlock the Coin
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
              Public market data + mapped contract evidence. Unlock calendars, whales, and LP locks
              stay labeled unavailable — never invented.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Token, symbol or 0x contract…"
                className="min-h-[48px] flex-1 rounded-xl border border-white/10 bg-ink-800/80 px-4 font-mono text-sm text-white placeholder:text-slate-500 focus:border-accent/50 focus:outline-none"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
              <button
                type="submit"
                disabled={loading || q.trim().length < 2}
                className="min-h-[48px] rounded-xl bg-gradient-to-r from-accent to-accent-violet px-5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading ? "Unlocking…" : "Unlock Coin →"}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {CHIPS.map((c) => (
                <button
                  key={c.q}
                  type="button"
                  onClick={() => {
                    setQ(c.q);
                    void run(c.q);
                  }}
                  className="min-h-[36px] rounded-full border border-white/10 bg-ink-950/50 px-3 text-xs font-medium text-slate-300 hover:border-accent/40"
                >
                  {c.label}
                </button>
              ))}
            </div>
            {error && <p className="mt-3 text-sm text-accent-rose">{error}</p>}
          </div>
          <div className="hidden justify-center sm:flex lg:col-span-2">
            <HeroShield />
          </div>
        </div>
        {loading && (
          <ol className="mt-5 grid gap-2 text-[11px] uppercase tracking-wider text-slate-500 sm:grid-cols-5">
            {STEPS.map((s, i) => (
              <li
                key={s}
                className={`rounded-lg border px-2 py-1.5 ${
                  i <= step ? "border-accent/30 text-accent-purple" : "border-white/5"
                }`}
              >
                {i <= step ? "✓ " : "○ "}
                {s}
              </li>
            ))}
          </ol>
        )}
      </form>

      {report && <XrayResult report={report} />}
    </div>
  );
}

function severityClass(s: XrayFinding["severity"]) {
  if (s === "critical") return "text-rose-300";
  if (s === "high") return "text-orange-300";
  if (s === "moderate") return "text-amber-300";
  if (s === "positive") return "text-emerald-300";
  return "text-slate-400";
}

function XrayResult({ report }: { report: XrayReport }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const tokenHref = report.contract
    ? `/scan/token?address=${encodeURIComponent(report.contract)}`
    : "/scan/token";

  return (
    <div className="space-y-4 pb-28 lg:pb-4">
      <div className="card-surface p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {report.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={report.image} alt="" className="h-12 w-12 rounded-full" />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent-purple">
                {report.symbol.slice(0, 3)}
              </span>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-white sm:text-xl">
                {report.name}{" "}
                <span className="text-sm font-medium text-slate-400">{report.symbol}</span>
              </h2>
              <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">
                {report.chain}
                {report.contract ? ` · ${report.contract.slice(0, 6)}…${report.contract.slice(-4)}` : " · no EVM contract"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">X-Ray Score</p>
            <p className="text-4xl font-semibold tabular-nums text-white sm:text-5xl">
              {report.xrayScore ?? "—"}
              <span className="text-base text-slate-500">/100</span>
            </p>
            <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${scoreTone(report.xrayScore)}`}>
              {report.classification.split("—")[0].trim()}
            </span>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <Metric label="Price" value={money(report.priceUsd)} />
          <Metric label="Market cap" value={money(report.marketCap)} />
          <Metric label="24h volume" value={money(report.volume24h)} />
          <Metric
            label="24h"
            value={report.change24h == null ? "—" : `${report.change24h.toFixed(2)}%`}
            tone={report.change24h == null ? undefined : report.change24h >= 0 ? "up" : "down"}
          />
        </dl>
      </div>

      <div
        className="flex gap-1 rounded-full border border-white/5 bg-ink-950/70 p-1"
        role="tablist"
        aria-label="X-Ray report sections"
      >
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`min-h-[40px] flex-1 rounded-full px-3 text-sm font-medium transition ${
              tab === t ? "bg-accent text-white shadow-glow" : "text-slate-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="space-y-4">
          <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
            {report.dimensions.map((d) => (
              <div key={d.key} className="min-w-[148px] shrink-0 card-surface p-3 sm:min-w-0">
                <p className="text-[11px] text-slate-500">{d.label}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
                  {d.score ?? "—"}
                </p>
                <p className="mt-1 text-[10px] uppercase text-slate-500">Conf. {d.confidence}</p>
              </div>
            ))}
          </div>
          <div className="card-surface p-4">
            <h3 className="text-sm font-medium text-white">What we can say</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {report.description || "No public description in the market feed."}
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
              {report.dimensions.map((d) => (
                <li key={d.key}>
                  <span className="text-slate-300">{d.label}:</span> {d.note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "Findings" && (
        <div className="card-surface p-4">
          <h3 className="text-sm font-medium text-white">Evidence-backed findings</h3>
          <ul className="mt-3 space-y-2">
            {report.findings.length === 0 && (
              <li className="text-sm text-slate-500">No structured findings from the public feed.</li>
            )}
            {report.findings.map((f) => (
              <li key={f.title} className="rounded-xl border border-white/5 bg-ink-950/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-white">{f.title}</p>
                  <span className={`text-[10px] uppercase ${severityClass(f.severity)}`}>{f.severity}</span>
                </div>
                <p className="mt-1 break-all text-xs text-slate-400">{f.evidence}</p>
                <p className="mt-1 text-[10px] text-slate-600">{f.source}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "Gaps" && (
        <div className="card-surface p-4">
          <h3 className="text-sm font-medium text-white">Missing layers (by design)</h3>
          <ul className="mt-3 space-y-2">
            {report.missing.map((m) => (
              <li
                key={m}
                className="flex items-start gap-2 rounded-xl border border-dashed border-white/10 bg-ink-950/30 px-3 py-2 text-sm text-slate-400"
              >
                <span className="mt-0.5 text-slate-600">○</span>
                <span>{m} — unavailable</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Sources: {report.sources.join(", ")}. X-Ray does not invent unlock schedules, whale
            clusters, or DEX depth.
          </p>
        </div>
      )}

      <div className="hidden flex-wrap gap-2 lg:flex">
        <Link
          href={tokenHref}
          className="inline-flex min-h-[44px] items-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white"
        >
          Run Token Scanner
        </Link>
        <Link
          href="/watchlist"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-white/10 px-4 text-sm text-slate-200"
        >
          Add to Watchlist
        </Link>
        <Link
          href="/ai-security-analyst"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-white/10 px-4 text-sm text-slate-200"
        >
          Ask Analyst
        </Link>
      </div>

      <div className="sentinel-sticky-cta flex gap-2 lg:hidden">
        <Link
          href={tokenHref}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-violet-600 px-3 text-sm font-semibold text-white"
        >
          Token Scanner
        </Link>
        <Link
          href="/watchlist"
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-white/15 bg-ink-900 px-3 text-sm font-medium text-white"
        >
          Watchlist
        </Link>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-ink-950/40 px-3 py-2">
      <dt className="text-[10px] uppercase tracking-wider text-slate-500">{label}</dt>
      <dd
        className={`mt-0.5 font-mono text-sm ${
          tone === "up" ? "text-accent-emerald" : tone === "down" ? "text-accent-rose" : "text-white"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
