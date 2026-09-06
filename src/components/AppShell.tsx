"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_GROUPS, NAV_ITEMS, statusLabel, type NavStatus } from "@/lib/nav";
import { MoreMenu } from "./MoreMenu";
import { TopSearch } from "./TopSearch";

function statusDot(status: NavStatus) {
  if (status === "live") return "bg-accent-emerald";
  if (status === "beta") return "bg-accent-purple/80";
  return "bg-slate-600";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* Desktop left sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[16.5rem] flex-col border-r border-white/5 bg-ink-950/95 lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-white/5 px-4">
          <Link href="/dashboard" className="group flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-cta text-xs font-bold text-white shadow-glow">
              CA
            </span>
            <span className="font-semibold tracking-tight">
              CoinAstra{" "}
              <span className="text-accent-purple transition-colors group-hover:text-accent">
                SENTINEL
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((g) => {
            const items = NAV_ITEMS.filter((i) => i.group === g.id);
            if (!items.length) return null;
            return (
              <div key={g.id} className="mb-5">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {g.label}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")) ||
                      (item.href === "/dashboard" && (pathname === "/" || pathname === "/dashboard"));
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex min-h-[36px] items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition ${
                            active
                              ? "bg-accent/15 text-accent-purple"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          <span className="flex shrink-0 items-center gap-1.5">
                            {item.badgeDemo != null && (
                              <span className="rounded-full bg-risk-critical px-1.5 py-0.5 text-[9px] font-bold text-white">
                                {item.badgeDemo}
                              </span>
                            )}
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusDot(item.status)}`}
                              title={statusLabel(item.status)}
                            />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-white/5 p-3">
          <div className="rounded-xl bg-purple-cta p-3.5 shadow-glow">
            <p className="text-xs font-semibold text-white">Upgrade to Pro</p>
            <p className="mt-1 text-[11px] leading-snug text-white/80">
              Unlock unlimited scans, real-time alerts, and advanced AI analysis
            </p>
            <Link
              href="/pricing"
              className="mt-2.5 inline-flex min-h-[36px] w-full items-center justify-center rounded-lg bg-white/95 text-xs font-semibold text-violet-900 hover:bg-white"
            >
              Upgrade Now
            </Link>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-ink-900/60 px-2.5 py-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/30 text-xs font-bold text-accent-purple">
              A
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">Astra</p>
              <p className="text-[10px] text-slate-500">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Top header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:app-main-offset">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 lg:hidden"
            aria-label="Open menu"
          >
            ≡
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-cta text-[10px] font-bold text-white">
              CA
            </span>
            <span className="text-sm font-semibold">Sentinel</span>
          </Link>

          <div className="mx-auto hidden max-w-xl flex-1 md:block lg:mx-0 lg:max-w-2xl">
            <TopSearch />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-ink-900/80 px-2.5 py-1.5 text-xs text-slate-300 sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-accent-emerald" />
              Ethereum
            </span>
            <Link
              href="/alerts"
              className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
              aria-label="Alerts"
            >
              ⚑
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-risk-critical" />
            </Link>
            <Link
              href="/pricing"
              className="hidden min-h-[36px] items-center rounded-lg bg-purple-cta px-3 py-1.5 text-xs font-semibold text-white shadow-glow sm:inline-flex"
            >
              Upgrade
            </Link>
          </div>
        </div>
        <div className="border-t border-white/5 px-4 py-2 md:hidden">
          <TopSearch compact />
        </div>
      </header>

      <div className="app-main-offset min-w-0">{children}</div>

      <MoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
