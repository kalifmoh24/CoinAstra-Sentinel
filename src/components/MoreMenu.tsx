"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NAV_GROUPS, NAV_ITEMS, statusLabel, type NavStatus } from "@/lib/nav";
import { NavIcon } from "./NavIcons";

function badgeClass(status: NavStatus) {
  if (status === "live") return "text-accent-emerald";
  if (status === "beta") return "text-accent-purple";
  return "text-slate-500";
}

export function MoreMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="All CoinAstra routes">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-white/10 bg-ink-950 shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-full sm:max-w-md sm:rounded-none sm:rounded-l-2xl"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-ink-950/95 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs font-medium text-accent-purple">CoinAstra</p>
            <h2 className="text-sm font-semibold text-white">All routes</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 px-4 py-4">
          {NAV_GROUPS.map((g) => {
            const items = NAV_ITEMS.filter((i) => i.group === g.id);
            if (!items.length) return null;
            return (
              <section key={g.id}>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {g.label}
                </h3>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const active =
                      pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`flex min-h-[44px] items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition ${
                            active
                              ? "bg-accent/15 text-accent-purple"
                              : "text-slate-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <NavIcon
                              name={item.icon}
                              className={`h-4 w-4 shrink-0 ${active ? "text-accent-purple" : "text-slate-500"}`}
                            />
                            <span className="truncate">{item.label}</span>
                            {item.badgeDemo != null && (
                              <span className="rounded-full bg-risk-critical px-1.5 py-0.5 text-[9px] font-bold text-white">
                                {item.badgeDemo}
                              </span>
                            )}
                          </span>
                          <span className={`shrink-0 text-[10px] font-medium ${badgeClass(item.status)}`}>
                            {statusLabel(item.status)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
          <p className="border-t border-white/5 pt-4 text-xs text-slate-600">
            We don&apos;t do AI BTC candle predictions or generic signal spam. Sentinel explains
            evidence — it does not invent market data.
          </p>
        </div>
      </div>
    </div>
  );
}
