"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Quick scanners — Home + four live scanners. Full IA lives in AppShell drawer/sidebar. */
const ITEMS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/scan/wallet", label: "Wallet", icon: "W" },
  { href: "/scan/token", label: "Token", icon: "T" },
  { href: "/scan/contract", label: "Contract", icon: "C" },
  { href: "/scan/transaction", label: "Tx", icon: "Ξ" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Quick scanners"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/95 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between overflow-x-hidden px-1 pt-1">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition ${
                  active ? "text-accent-cyan" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${
                    active ? "bg-accent/20" : "bg-ink-800/80"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
