"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BOTTOM_PRIMARY } from "@/lib/nav";
import { MoreMenu } from "./MoreMenu";
import { NavIcon, Menu } from "./NavIcons";

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/95 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1">
          {BOTTOM_PRIMARY.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition ${
                    active ? "text-accent-purple" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${
                      active ? "bg-accent/20 text-accent" : "bg-ink-800/80 text-slate-400"
                    }`}
                  >
                    <NavIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={`flex w-full min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition ${
                moreOpen ? "text-accent-purple" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-md ${
                  moreOpen ? "bg-accent/20 text-accent" : "bg-ink-800/80 text-slate-400"
                }`}
              >
                <Menu className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              More
            </button>
          </li>
        </ul>
      </nav>
      <MoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
