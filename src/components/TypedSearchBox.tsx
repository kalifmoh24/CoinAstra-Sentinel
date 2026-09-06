'use client';

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { isEvmAddress, isTxHash } from "@/lib/detect";
import { ScanLoading } from "./ScanLoading";
import type { InputType } from "@/lib/types";

type ScanType = Exclude<InputType, "unknown">;

const META: Record<
  ScanType,
  { placeholder: string; hint: string; validate: (v: string) => string | null; cta: string }
> = {
  wallet: {
    placeholder: "0x… wallet address",
    hint: "Paste an EVM wallet (EOA) address. DEMO_MODE works with any valid 0x address.",
    validate: (v) => (isEvmAddress(v) ? null : "Enter an EVM address (0x + 40 hex)."),
    cta: "Scan wallet",
  },
  token: {
    placeholder: "0x… token contract",
    hint: "Paste a token contract address for security & liquidity signals.",
    validate: (v) => (isEvmAddress(v) ? null : "Enter a token contract address (0x + 40 hex)."),
    cta: "Scan token",
  },
  contract: {
    placeholder: "0x… smart contract",
    hint: "Paste a contract address for verification, privileges, and proxy checks.",
    validate: (v) => (isEvmAddress(v) ? null : "Enter a contract address (0x + 40 hex)."),
    cta: "Scan contract",
  },
  transaction: {
    placeholder: "0x… transaction hash",
    hint: "Analysis only — Sentinel never signs or broadcasts transactions.",
    validate: (v) =>
      isTxHash(v) ? null : "Enter a transaction hash (0x + 64 hex).",
    cta: "Analyze transaction",
  },
};

export function TypedSearchBox({
  type,
  stickyCta = true,
}: {
  type: ScanType;
  stickyCta?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const meta = META[type];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = value.trim();
    const vErr = meta.validate(trimmed);
    if (vErr) {
      setError(vErr);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed, chain: "ethereum", type }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Scan failed");
        setLoading(false);
        return;
      }
      router.push(`/scan/${data.id}`);
    } catch {
      setError("Network error — try again.");
      setLoading(false);
    }
  }

  if (loading) {
    return <ScanLoading input={value.trim()} />;
  }

  const submitBtn = (
    <button
      type="submit"
      className="min-h-[48px] w-full rounded-xl bg-gradient-to-r from-accent to-accent-violet px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition hover:brightness-110 active:scale-[0.99] sm:w-auto sm:min-w-[160px]"
    >
      {meta.cta}
    </button>
  );

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-2 shadow-glow backdrop-blur sm:p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="relative flex-1">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={meta.placeholder}
              className="min-h-[48px] w-full rounded-xl border border-transparent bg-ink-800/80 px-4 py-3.5 font-mono text-base text-white placeholder:text-slate-500 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/40"
              spellCheck={false}
              autoComplete="off"
              inputMode="text"
              enterKeyHint="go"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-slate-500">
              {type}
            </div>
          </div>
          {!stickyCta && <div className="sm:flex sm:items-center">{submitBtn}</div>}
          {stickyCta && <div className="hidden sm:flex sm:items-center">{submitBtn}</div>}
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-accent-rose">{error}</p>}
      <p className="mt-3 text-xs leading-relaxed text-slate-500">{meta.hint}</p>

      {stickyCta && (
        <div className="sentinel-sticky-cta sm:hidden">
          <div className="mx-auto max-w-lg px-1">{submitBtn}</div>
        </div>
      )}
    </form>
  );
}
