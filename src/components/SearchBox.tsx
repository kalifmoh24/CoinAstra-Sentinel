'use client';

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { detectInputType } from "@/lib/detect";
import { ScanLoading } from "./ScanLoading";

export function SearchBox({ stickyCta = false }: { stickyCta?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const detected = useMemo(() => detectInputType(value), [value]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (detected === "unknown") {
      setError("Enter an EVM address (0x + 40 hex) or transaction hash (0x + 64 hex).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: value.trim(), chain: "ethereum", type: "auto" }),
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
      className="min-h-[48px] w-full rounded-xl bg-gradient-to-r from-accent to-sky-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition hover:brightness-110 active:scale-[0.99] sm:w-auto sm:min-w-[168px]"
    >
      Scan with Sentinel
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
              placeholder="Wallet, token, contract, or tx hash"
              className="min-h-[48px] w-full rounded-xl border border-transparent bg-ink-800/80 px-4 py-3.5 font-mono text-base text-white placeholder:text-slate-500 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/40"
              spellCheck={false}
              autoComplete="off"
              enterKeyHint="go"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-slate-500">
              {value.trim() ? detected : "auto-detect"}
            </div>
          </div>
          <div className={`sm:flex sm:items-center ${stickyCta ? "hidden sm:flex" : ""}`}>
            {submitBtn}
          </div>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-accent-rose">{error}</p>}
      <p className="mt-3 text-xs text-slate-500">
        Try a demo address in DEMO_MODE — any valid 0x address or 66-char tx hash works with labeled
        fixtures.
      </p>

      {stickyCta && (
        <div className="sentinel-sticky-cta sm:hidden">
          <div className="mx-auto max-w-lg px-1">{submitBtn}</div>
        </div>
      )}
    </form>
  );
}
