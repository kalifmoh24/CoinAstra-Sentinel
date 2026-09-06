"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/nav";
import { BrandLogo } from "./BrandLogo";
import { MoreMenu } from "./MoreMenu";
import { TopSearch } from "./TopSearch";
import { NavIcon, Menu, Bell, Sun, Moon, ChevronDown, Crown } from "./NavIcons";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [themeDark, setThemeDark] = useState(true);

  return (
    <>
      {/* Desktop left sidebar — ~188px */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[188px] flex-col border-r border-white/5 bg-ink-950/98 lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-white/5 px-3">
          <Link href="/dashboard" className="group flex min-w-0 items-center gap-2">
            <BrandLogo size={28} className="shrink-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.45)]" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[13px] font-semibold tracking-tight text-white">
                CoinAstra
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-purple">
                Sentinel
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {NAV_GROUPS.map((g) => {
            const items = NAV_ITEMS.filter((i) => i.group === g.id && !i.sidebarHidden);
            if (!items.length) return null;
            return (
              <div key={g.id} className="mb-4">
                <p className="mb-1 px-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
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
                          className={`flex min-h-[32px] items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] transition ${
                            active
                              ? "bg-accent/15 text-accent-purple"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <NavIcon
                            name={item.icon}
                            className={`h-3.5 w-3.5 shrink-0 ${active ? "text-accent-purple" : "text-slate-500"}`}
                          />
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.badgeDemo != null && (
                            <span className="rounded-full bg-risk-critical px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                              {item.badgeDemo}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="space-y-2.5 border-t border-white/5 p-2.5">
          <div className="rounded-xl bg-purple-cta p-3 shadow-glow">
            <div className="flex items-center gap-1.5">
              <Crown className="h-3.5 w-3.5 text-amber-200" strokeWidth={2} aria-hidden />
              <p className="text-xs font-semibold text-white">Upgrade to Pro</p>
            </div>
            <p className="mt-1 text-[10px] leading-snug text-white/80">
              Unlimited scans, real-time alerts, advanced AI
            </p>
            <Link
              href="/pricing"
              className="mt-2 inline-flex min-h-[32px] w-full items-center justify-center rounded-lg bg-white/95 text-[11px] font-semibold text-violet-900 hover:bg-white"
            >
              Upgrade Now
            </Link>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-ink-900/70 px-2 py-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/30 text-[11px] font-bold text-accent-purple">
              A
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">Astra</p>
              <span className="mt-0.5 inline-flex rounded-full border border-white/10 bg-ink-800 px-1.5 py-0.5 text-[9px] font-medium text-slate-400">
                Astra Free Plan
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Top header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:app-main-offset">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <BrandLogo size={26} />
            <span className="text-sm font-semibold tracking-tight">
              CoinAstra <span className="text-accent-purple">SENTINEL</span>
            </span>
          </Link>

          <div className="mx-auto hidden max-w-2xl flex-1 md:block lg:mx-0">
            <TopSearch />
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-ink-900/80 px-2.5 py-1.5 text-xs text-slate-300 sm:inline-flex"
              aria-label="Network selector"
            >
              <span className="h-2 w-2 rounded-full bg-accent-emerald" />
              Ethereum
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setThemeDark((v) => !v)}
              className="hidden min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white sm:inline-flex"
              aria-label="Toggle theme"
              title="Theme toggle (visual)"
            >
              {themeDark ? (
                <Sun className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Moon className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
            <Link
              href="/alerts"
              className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" strokeWidth={1.75} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-risk-critical ring-2 ring-ink-950" />
              <span className="absolute -right-0.5 top-1 rounded-full bg-risk-critical px-1 text-[9px] font-bold text-white lg:hidden">
                8
              </span>
            </Link>
            <span
              className="hidden h-8 w-8 items-center justify-center rounded-full bg-accent/30 text-xs font-bold text-accent-purple sm:inline-flex"
              aria-label="Astra avatar"
            >
              A
            </span>
          </div>
        </div>
        <div className="border-t border-white/5 px-3 py-2 md:hidden">
          <TopSearch compact />
        </div>
      </header>

      <div className="app-main-offset min-w-0">{children}</div>

      <MoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
