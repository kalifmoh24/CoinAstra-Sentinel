"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { SHELL_NAV, findNavItem } from "@/lib/shell-nav";
import { BottomNav } from "@/components/BottomNav";

function NavLink({
  href,
  label,
  status,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  status: "live" | "soon";
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex min-h-[44px] items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-accent/15 text-accent-cyan"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="truncate">{label}</span>
      {status === "soon" ? (
        <span className="shrink-0 rounded-full border border-accent-amber/25 bg-accent-amber/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-amber">
          Soon
        </span>
      ) : null}
    </Link>
  );
}

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="group flex min-h-[44px] items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-cyan text-xs font-bold text-ink-950">
        CA
      </span>
      <span className="font-semibold tracking-tight">
        CoinAstra{" "}
        <span className="text-slate-400 transition-colors group-hover:text-accent-cyan">Sentinel</span>
      </span>
    </Link>
  );
}

function ShellNavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = findNavItem(pathname);

  return (
    <nav aria-label="CoinAstra" className="flex flex-col gap-0.5">
      {SHELL_NAV.map((item) => (
        <NavLink
          key={item.id}
          href={item.href}
          label={item.label}
          status={item.status}
          active={active?.id === item.id}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerTitleId = useId();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Desktop left sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col overflow-y-auto overflow-x-hidden border-r border-white/5 bg-ink-950/95 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:flex">
        <div className="flex h-14 shrink-0 items-center px-4">
          <Brand />
        </div>
        <div className="flex-1 px-2 pb-4">
          <ShellNavList pathname={pathname} />
        </div>
        <div className="shrink-0 border-t border-white/5 px-4 py-3 text-xs text-slate-500">
          <Link href="/pricing" className="inline-flex min-h-[44px] items-center hover:text-slate-300">
            Pricing
          </Link>
          <p className="mt-1">coinastra.io</p>
        </div>
      </aside>

      {/* Mobile top bar + hamburger */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Brand />
          <button
            type="button"
            aria-expanded={drawerOpen}
            aria-controls="coinastra-nav-drawer"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/10 bg-ink-900/60 text-slate-200 hover:bg-white/5"
          >
            <span className="sr-only">Open menu</span>
            <span aria-hidden className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded bg-current" />
              <span className="block h-0.5 w-5 rounded bg-current" />
              <span className="block h-0.5 w-5 rounded bg-current" />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby={drawerTitleId}>
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            id="coinastra-nav-drawer"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,100%)] max-w-full flex-col overflow-y-auto overflow-x-hidden border-r border-white/10 bg-ink-950 pt-[env(safe-area-inset-top)] shadow-glow"
          >
            <div className="flex h-14 shrink-0 items-center justify-between px-4">
              <h2 id={drawerTitleId} className="sr-only">
                Navigation
              </h2>
              <Brand onNavigate={() => setDrawerOpen(false)} />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <span className="sr-only">Close</span>
                <span aria-hidden className="text-xl leading-none">
                  ×
                </span>
              </button>
            </div>
            <div className="flex-1 px-2 pb-6">
              <ShellNavList pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            </div>
            <div className="shrink-0 border-t border-white/5 px-4 py-3 text-xs text-slate-500">
              <Link
                href="/pricing"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex min-h-[44px] items-center hover:text-slate-300"
              >
                Pricing
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <main className="min-w-0 overflow-x-hidden pb-20 lg:pb-0">{children}</main>
        <footer className="mb-16 border-t border-white/5 py-8 text-center text-xs text-slate-600 lg:mb-0">
          © {new Date().getFullYear()} CoinAstra · Sentinel Phase 2 · coinastra.io
        </footer>
      </div>

      <BottomNav />
    </div>
  );
}
