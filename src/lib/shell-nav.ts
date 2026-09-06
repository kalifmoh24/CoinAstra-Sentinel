export type ShellNavItem = {
  id: string;
  label: string;
  href: string;
  /** Live scanner or home — not a stub */
  status: "live" | "soon";
  description: string;
};

/** Full IA-locked CoinAstra nav (Mohamed). Do not collapse. */
export const SHELL_NAV: ShellNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    status: "live",
    description: "Universal search and Sentinel overview.",
  },
  {
    id: "markets",
    label: "Markets",
    href: "/markets",
    status: "soon",
    description: "Market context views — not live yet.",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    href: "/portfolio",
    status: "soon",
    description: "Portfolio tracking — not live yet.",
  },
  {
    id: "ai-intelligence",
    label: "AI Intelligence",
    href: "/ai-intelligence",
    status: "soon",
    description: "Broader AI intelligence surfaces — not live yet.",
  },
  {
    id: "wallet-scanner",
    label: "Wallet Scanner",
    href: "/scan/wallet",
    status: "live",
    description: "Evidence-backed wallet risk scan.",
  },
  {
    id: "token-scanner",
    label: "Token Scanner",
    href: "/scan/token",
    status: "live",
    description: "Token security scan with evidence.",
  },
  {
    id: "contract-scanner",
    label: "Contract Scanner",
    href: "/scan/contract",
    status: "live",
    description: "Smart contract risk scan.",
  },
  {
    id: "transaction-preview",
    label: "Transaction Preview",
    href: "/scan/transaction",
    status: "live",
    description: "Analysis-only transaction preview — never executes.",
  },
  {
    id: "risk-intel",
    label: "Risk Intel",
    href: "/risk-intel",
    status: "soon",
    description: "Aggregated risk intelligence — not live yet.",
  },
  {
    id: "alerts",
    label: "Alerts",
    href: "/alerts",
    status: "soon",
    description: "Monitoring alerts — not live yet.",
  },
  {
    id: "watchlist",
    label: "Watchlist",
    href: "/watchlist",
    status: "soon",
    description: "Saved watches — not live yet.",
  },
  {
    id: "exposure-checker",
    label: "Exposure Checker",
    href: "/exposure-checker",
    status: "soon",
    description: "Exposure analysis — not live yet.",
  },
  {
    id: "ai-security-analyst",
    label: "AI Security Analyst",
    href: "/ai-security-analyst",
    status: "soon",
    description: "Dedicated analyst workspace — not live yet.",
  },
  {
    id: "transaction-simulator",
    label: "Transaction Simulator",
    href: "/transaction-simulator",
    status: "soon",
    description: "Simulation tools — not live yet.",
  },
  {
    id: "approval-checker",
    label: "Approval Checker",
    href: "/approval-checker",
    status: "soon",
    description: "Approval / allowance checks — not live yet.",
  },
  {
    id: "ai-agent-firewall",
    label: "AI Agent Firewall",
    href: "/ai-agent-firewall",
    status: "soon",
    description: "Agent Firewall is Phase 4 — stub only.",
  },
  {
    id: "dex-intelligence",
    label: "DEX Intelligence",
    href: "/dex-intelligence",
    status: "soon",
    description: "DEX intelligence — not live yet.",
  },
  {
    id: "launchpad-intelligence",
    label: "Launchpad Intelligence",
    href: "/launchpad-intelligence",
    status: "soon",
    description: "Launchpad intelligence — not live yet.",
  },
  {
    id: "api-integrations",
    label: "API/Integrations",
    href: "/api-integrations",
    status: "soon",
    description: "API and integrations — not live yet.",
  },
];

export function findNavItem(pathname: string): ShellNavItem | undefined {
  if (pathname === "/") return SHELL_NAV.find((i) => i.href === "/");
  return SHELL_NAV.find(
    (i) => i.href !== "/" && (pathname === i.href || pathname.startsWith(i.href + "/")),
  );
}
