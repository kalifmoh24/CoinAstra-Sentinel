"use client";

import { FormEvent, useState } from "react";
import type { XRayProfile } from "@/lib/types";
import { XRayProfileView } from "./XRayProfileView";
import { ScanLoading } from "./ScanLoading";

export function XRayUnlockClient() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<XRayProfile | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setProfile(null);
    setLoading(true);
    try {
      const res = await fetch("/api/xray", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: value.trim(), chain: "ethereum" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "X-Ray failed");
        setLoading(false);
        return;
      }
      setProfile(data.profile as XRayProfile);
      setLoading(false);
    } catch {
      setError("Network error — try again.");
      setLoading(false);
    }
  }

  if (loading) {
    return <ScanLoading input={value.trim()} />;
  }

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="w-full">
        <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-2 shadow-glow backdrop-blur sm:p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste token or contract address to unlock…"
              className="min-h-[48px] w-full flex-1 rounded-xl border border-transparent bg-ink-800/80 px-4 py-3.5 font-mono text-base text-white placeholder:text-slate-500 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/40"
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="submit"
              className="min-h-[48px] rounded-xl bg-gradient-to-r from-accent to-accent-violet px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/30 transition hover:brightness-110 sm:min-w-[168px]"
            >
              Unlock X-Ray →
            </button>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-accent-rose">{error}</p>}
        <p className="mt-3 text-xs text-slate-500">
          Analysis only. DEMO fixtures labeled when DEMO_MODE / no explorer keys. AI explains evidence — never invents
          scores.
        </p>
      </form>
      {profile && (
        <div className="mt-8">
          <XRayProfileView profile={profile} />
        </div>
      )}
    </div>
  );
}
