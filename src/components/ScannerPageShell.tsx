import Link from "next/link";
import { Disclaimer } from "./Disclaimer";
import { TypedSearchBox } from "./TypedSearchBox";
import type { InputType } from "@/lib/types";

type ScanType = Exclude<InputType, "unknown">;

const LINKS: { href: string; label: string; type: ScanType }[] = [
  { href: "/scan/wallet", label: "Wallet", type: "wallet" },
  { href: "/scan/token", label: "Token", type: "token" },
  { href: "/scan/contract", label: "Contract", type: "contract" },
  { href: "/scan/transaction", label: "Transaction", type: "transaction" },
];

export function ScannerPageShell({
  type,
  title,
  subtitle,
  bullets,
}: {
  type: ScanType;
  title: string;
  subtitle: string;
  bullets: string[];
}) {
  return (
    <div className="mx-auto max-w-3xl overflow-x-hidden px-4 pb-36 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
      <div className="mb-6 flex flex-wrap gap-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2.5 text-sm font-medium transition ${
              l.type === type
                ? "border-accent/50 bg-accent/15 text-accent-purple"
                : "border-white/10 bg-ink-900/50 text-slate-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <p className="text-sm font-medium text-accent-purple">Dedicated scanner</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base text-slate-400">{subtitle}</p>

      <ul className="mt-5 space-y-2 text-sm text-slate-400">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-accent-purple">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <TypedSearchBox type={type} stickyCta />
      </div>

      <div className="mt-8">
        <Disclaimer />
      </div>

      <p className="mt-4 text-center text-xs text-slate-600">
        Prefer the dashboard?{" "}
        <Link href="/dashboard" className="text-accent-purple hover:underline">
          Open dashboard
        </Link>
      </p>
    </div>
  );
}
