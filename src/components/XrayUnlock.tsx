"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import type { XrayReport } from "@/lib/live/xray";
import { HeroShield } from "./HeroShield";

function money(n: number | null) {
  if (n == null) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

const STEPS = [
  "IDENTIFYING ASSET",
  "VERIFYING CONTRACT",
  "READING MARKET DATA",
  "SCORING DIMENSIONS",
  "COIN UNLOCKED",
];

export function XrayUnlock() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<XrayReport | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setReport(null);
    setLoading(true);
    setStep(0);
    const tick = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 2)), 350);
    try {
      const res = await fetch(`/api/xray?q=${encodeURIComponent(q.trim())}`);
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

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="card-glow p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-5 lg:items-center">
          <div className="lg:col-span-3">
            <p className="text-sm font-medium text-accent-purple">CoinAstra X-Ray</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Unlock the Coin
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              See what the market doesn&apos;t show you. Public market + contract mapping only —
              missing layers stay labeled unavailable.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search token, symbol or contract address…"
                className="min-h-[48px] flex-1 rounded-xl border border-white/10 bg-ink-800/80 px-4 font-mono text-sm text-white placeholder:text-slate-500 focus:border-accent/50 focus:outline-none"
                spellCheck={false}
              />
              <button
                type="submit"
                disabled={loading || q.trim().length < 2}
                className="min-h-[48px] rounded-xl bg-gradient-to-r from-accent to-accent-violet px-5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading ? "Unlocking…" : "Unlock Coin →"}
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-accent-rose">{error}</p>}
          </div>
          <div className="flex justify-center lg:col-span-2">
            <HeroShield />
          </div>
        </div>
        {loading && (
          <ol className="mt-5 grid gap-1 text-[11px] uppercase tracking-wider text-slate-500 sm:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s} className={i <= step ? "text-accent-purple" : ""}>
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

function XrayResult({ report }: { report: XrayReport }) {
  return (
    <div className="space-y-4">
      <div className="card-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {report.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={report.image} alt="" className="h-12 w-12 rounded-full" />
            ) : null}
            <div>
              <h2 className="text-xl font-semibold text-white">
                {report.name}{" "}
                <span className="text-sm font-medium text-slate-400">{report.symbol}</span>
              </h2>
              <p className="mt-1 font-mono text-xs text-slate-500">
                {report.chain} {report.contract ?? "· no EVM contract mapped"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-slate-500">Coin X-Ray Score</p>
            <p className="text-4xl font-semibold tabular-nums text-white">
              {report.xrayScore ?? "—"}
              <span className="text-lg text-slate-500">/100</span>
            </p>
            <p className="mt-1 text-[11px] font-medium text-accent-purple">{report.classification}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          {report.description || "No public description in the market feed."}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-[11px] text-slate-500">Price</dt>
            <dd className="font-mono text-white">{money(report.priceUsd)}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-slate-500">Market cap</dt>
            <dd className="font-mono text-white">{money(report.marketCap)}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-slate-500">24h volume</dt>
            <dd className="font-mono text-white">{money(report.volume24h)}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-slate-500">24h</dt>
            <dd className={report.change24h != null && report.change24h >= 0 ? "text-accent-emerald" : "text-accent-rose"}>
              {report.change24h == null ? "—" : `${report.change24h.toFixed(2)}%`}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {report.dimensions.map((d) => (
          <div key={d.key} className="card-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">{d.label}</p>
              <span className="text-lg font-semibold tabular-nums text-white">
                {d.score ?? "—"}
              </span>
            </div>
            <p className="mt-1 text-[10px] uppercase text-slate-500">Confidence {d.confidence}</p>
            <p className="mt-2 text-xs text-slate-400">{d.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-4">
          <h3 className="text-sm font-medium text-white">Findings (evidence only)</h3>
          <ul className="mt-3 space-y-2">
            {report.findings.length === 0 && (
              <li className="text-sm text-slate-500">No structured findings from the public feed.</li>
            )}
            {report.findings.map((f) => (
              <li key={f.title} className="rounded-xl border border-white/5 bg-ink-950/40 p-3">
                <p className="text-sm font-medium text-white">{f.title}</p>
                <p className="mt-1 text-xs text-slate-400">{f.evidence}</p>
                <p className="mt-1 text-[10px] text-slate-600">{f.source}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface p-4">
          <h3 className="text-sm font-medium text-white">Missing data (by design)</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
            {report.missing.map((m) => (
              <li key={m}>○ {m}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Honesty about gaps is part of X-Ray. Unlock calendars, whales, and DEX depth ship when a
            provider is wired — they are never invented.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {report.contract && (
          <Link
            href="/scan/token"
            className="inline-flex min-h-[44px] items-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white"
          >
            Run Token Scanner
          </Link>
        )}
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
          Ask X-Ray AI
        </Link>
      </div>
    </div>
  );
}
