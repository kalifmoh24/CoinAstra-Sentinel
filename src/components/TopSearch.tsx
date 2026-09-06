"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ScanLine } from "./NavIcons";

export function TopSearch({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setBusy(true);
    setHint(null);
    try {
      const idRes = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed, chain: "ethereum" }),
      });
      const identified = await idRes.json();
      if (!idRes.ok || identified.kind === "unknown" || identified.next === "none") {
        setHint(identified.status || "Unable to identify this address or transaction.");
        setBusy(false);
        return;
      }
      setHint(identified.status ?? null);
      if (identified.next === "xray") {
        router.push(identified.href || `/xray?q=${encodeURIComponent(trimmed)}`);
        return;
      }
      const scanType =
        identified.kind === "wallet" ||
        identified.kind === "token" ||
        identified.kind === "contract" ||
        identified.kind === "transaction"
          ? identified.kind
          : "auto";
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed, chain: "ethereum", type: scanType }),
      });
      const data = await res.json();
      if (res.ok && data.id) router.push(`/scan/${data.id}`);
      else setHint(data.error || "Scan failed. Data unavailable.");
    } catch {
      setHint("Data unavailable");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div
        className={`flex items-center gap-2 rounded-xl border border-white/10 bg-ink-900/70 ${
          compact ? "px-3 py-1.5" : "px-3 py-2"
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} aria-hidden />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search wallet, token, contract, transaction hash..."
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          spellCheck={false}
          autoComplete="off"
          disabled={busy}
        />
        {busy ? (
          <span className="text-[10px] text-accent-purple">Identifying…</span>
        ) : compact ? (
          <ScanLine className="h-4 w-4 shrink-0 text-slate-500" strokeWidth={1.75} aria-hidden />
        ) : (
          <kbd className="hidden shrink-0 rounded border border-white/10 bg-ink-800 px-1.5 py-0.5 font-sans text-[10px] text-slate-500 sm:inline">
            ⌘ K
          </kbd>
        )}
      </div>
      {hint ? <p className="mt-1 truncate px-1 text-[10px] text-slate-500">{hint}</p> : null}
    </form>
  );
}
