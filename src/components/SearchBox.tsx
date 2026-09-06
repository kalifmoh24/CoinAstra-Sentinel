'use client';

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { detectInputType } from "@/lib/detect";
import { ScanLoading } from "./ScanLoading";

export function SearchBox() {
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
        body: JSON.stringify({ input: value.trim(), chain: "ethereum" }),
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

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-2 shadow-glow backdrop-blur">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Wallet, token, contract, or tx hash"
              className="w-full rounded-xl border border-transparent bg-ink-800/80 px-4 py-3.5 font-mono text-sm text-white placeholder:text-slate-500 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/40"
              spellCheck={false}
              autoComplete="off"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-slate-500">
              {value.trim() ? detected : "auto-detect"}
            </div>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-accent to-sky-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:brightness-110"
          >
            Scan with Sentinel
          </button>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-accent-rose">{error}</p>}
      <p className="mt-3 text-xs text-slate-500">
        Try a demo address in DEMO_MODE — any valid 0x address or 66-char tx hash works with labeled fixtures.
      </p>
    </form>
  );
}
