"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MoreMenu } from "./MoreMenu";

const DESKTOP_PRIMARY = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scan/wallet", label: "Wallet" },
  { href: "/scan/token", label: "Token" },
  { href: "/scan/contract", label: "Contract" },
  { href: "/scan/transaction", label: "Tx Preview" },
  { href: "/risk-intel", label: "Risk Intel" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" className="group flex min-h-[44px] shrink-0 items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-cyan text-xs font-bold text-ink-950">
                CA
              </span>
              <span className="font-semibold tracking-tight">
                CoinAstra{" "}
                <span className="hidden text-slate-400 transition-colors group-hover:text-accent-cyan sm:inline">
                  Sentinel
                </span>
              </span>
            </Link>
            <nav className="hidden items-center gap-0.5 text-sm text-slate-400 lg:flex">
              {DESKTOP_PRIMARY.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex min-h-[44px] items-center rounded-lg px-2 py-2 hover:bg-white/5 hover:text-white ${
                      active ? "text-accent-cyan" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                className="inline-flex min-h-[44px] items-center rounded-lg px-2.5 py-2 hover:bg-white/5 hover:text-white"
              >
                More
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden rounded-full border border-white/10 bg-ink-800/80 px-2.5 py-1 xl:inline">
              coinastra.io
            </span>
            <Link
              href="/pricing"
              className="inline-flex min-h-[44px] items-center rounded-lg px-2.5 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
            >
              Pricing
            </Link>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className="inline-flex min-h-[44px] items-center rounded-md border border-white/10 bg-ink-800/80 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-ink-700 lg:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </header>
      <MoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
