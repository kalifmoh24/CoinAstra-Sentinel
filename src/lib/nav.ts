/** Locked CoinAstra IA — all primary nav items (Mohamed). */

export type NavStatus = "live" | "beta" | "soon";

export type NavItem = {
  href: string;
  label: string;
  /** Short label for bottom bar / compact UI */
  shortLabel?: string;
  status: NavStatus;
  description: string;
  /** Related live scanner when this is a stub */
  relatedHref?: string;
  relatedLabel?: string;
  group: "platform" | "scanners" | "intel" | "security" | "integrations";
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Home",
    status: "beta",
    description:
      "Your CoinAstra command center — overview of recent Sentinel scans and watch items. No invented market prices.",
    group: "platform",
  },
  {
    href: "/markets",
    label: "Markets",
    status: "soon",
    description:
      "Market context for assets you already researched — not price-prediction charts or signal spam.",
    group: "platform",
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    status: "soon",
    description:
      "Connect holdings later to surface security exposure. Sentinel assesses risk; it does not invent balances.",
    group: "platform",
  },
  {
    href: "/ai-intelligence",
    label: "AI Intelligence",
    shortLabel: "AI Intel",
    status: "beta",
    description:
      "How Sentinel AI explains evidence-backed findings. AI never invents blockchain facts or risk scores.",
    relatedHref: "/",
    relatedLabel: "Run a scan",
    group: "intel",
  },
  {
    href: "/scan/wallet",
    label: "Wallet Scanner",
    shortLabel: "Wallet",
    status: "live",
    description: "Scan an EVM wallet for age, activity, funding risk, and security heuristics.",
    group: "scanners",
  },
  {
    href: "/scan/token",
    label: "Token Scanner",
    shortLabel: "Token",
    status: "live",
    description:
      "Token security checks with evidence — honeypot hooks, ownership, and liquidity signals when data exists.",
    group: "scanners",
  },
  {
    href: "/scan/contract",
    label: "Contract Scanner",
    shortLabel: "Contract",
    status: "live",
    description: "Smart contract risk: verified status, proxy/upgradeable patterns, dangerous permissions.",
    group: "scanners",
  },
  {
    href: "/scan/transaction",
    label: "Transaction Preview",
    shortLabel: "Tx",
    status: "live",
    description: "Analyze a transaction before you sign. Analysis only — never signs or executes.",
    group: "scanners",
  },
  {
    href: "/risk-intel",
    label: "Risk Intel",
    status: "beta",
    description:
      "Cross-cutting risk narratives from Sentinel findings. Scores are analytical assessments, not guarantees.",
    relatedHref: "/scan/wallet",
    relatedLabel: "Wallet Scanner",
    group: "intel",
  },
  {
    href: "/alerts",
    label: "Alerts",
    status: "soon",
    description: "Monitoring and alert rules for watched addresses and contracts — scaffolding only for now.",
    relatedHref: "/watchlist",
    relatedLabel: "Watchlist",
    group: "platform",
  },
  {
    href: "/watchlist",
    label: "Watchlist",
    status: "soon",
    description: "Save wallets, tokens, and contracts to revisit. No fake price ticks or signal spam.",
    relatedHref: "/scan/token",
    relatedLabel: "Token Scanner",
    group: "platform",
  },
  {
    href: "/exposure-checker",
    label: "Exposure Checker",
    shortLabel: "Exposure",
    status: "beta",
    description:
      "Map counterparty and contract exposure from scan evidence. DEMO fixtures stay labeled DEMO.",
    relatedHref: "/scan/wallet",
    relatedLabel: "Wallet Scanner",
    group: "security",
  },
  {
    href: "/ai-security-analyst",
    label: "AI Security Analyst",
    shortLabel: "Analyst",
    status: "beta",
    description:
      "Ask Sentinel AI about a completed scan's findings. Explanations are grounded in engine evidence only.",
    relatedHref: "/scan/contract",
    relatedLabel: "Contract Scanner",
    group: "security",
  },
  {
    href: "/transaction-simulator",
    label: "Transaction Simulator",
    shortLabel: "Simulate",
    status: "soon",
    description:
      "Simulate call outcomes without broadcasting. Companion to Transaction Preview — never executes on-chain.",
    relatedHref: "/scan/transaction",
    relatedLabel: "Transaction Preview",
    group: "security",
  },
  {
    href: "/approval-checker",
    label: "Approval Checker",
    shortLabel: "Approvals",
    status: "beta",
    description:
      "Review allowance and approval risk patterns. Use Contract / Token scanners for live checks today.",
    relatedHref: "/scan/token",
    relatedLabel: "Token Scanner",
    group: "security",
  },
  {
    href: "/ai-agent-firewall",
    label: "AI Agent Firewall",
    shortLabel: "Firewall",
    status: "soon",
    description:
      "Policy layer for AI agents that propose on-chain actions — fail-closed intent, no auto-signing.",
    relatedHref: "/scan/transaction",
    relatedLabel: "Transaction Preview",
    group: "security",
  },
  {
    href: "/dex-intelligence",
    label: "DEX Intelligence",
    shortLabel: "DEX",
    status: "soon",
    description:
      "Liquidity and pool risk context when data is available — not candle predictions or trade signals.",
    relatedHref: "/scan/token",
    relatedLabel: "Token Scanner",
    group: "intel",
  },
  {
    href: "/launchpad-intelligence",
    label: "Launchpad Intelligence",
    shortLabel: "Launchpad",
    status: "soon",
    description:
      "Early-token and launchpad contract posture. Sentinel assesses security; it does not pump listings.",
    relatedHref: "/scan/contract",
    relatedLabel: "Contract Scanner",
    group: "intel",
  },
  {
    href: "/api-integrations",
    label: "API / Integrations",
    shortLabel: "API",
    status: "beta",
    description:
      "Programmatic access to Sentinel scans. v1 stubs exist for wallet, token, contract, and transaction.",
    relatedHref: "/pricing",
    relatedLabel: "Pricing",
    group: "integrations",
  },
];

export const NAV_GROUPS: { id: NavItem["group"]; label: string }[] = [
  { id: "platform", label: "Platform" },
  { id: "scanners", label: "Scanners" },
  { id: "intel", label: "Intelligence" },
  { id: "security", label: "Security" },
  { id: "integrations", label: "Integrations" },
];

/** Primary bottom-bar slots (More opens the full IA). */
export const BOTTOM_PRIMARY = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/scan/wallet", label: "Wallet", icon: "W" },
  { href: "/scan/token", label: "Token", icon: "T" },
  { href: "/scan/transaction", label: "Tx", icon: "Ξ" },
] as const;

export function statusLabel(status: NavStatus): string {
  if (status === "live") return "Live";
  if (status === "beta") return "Beta stub";
  return "Coming soon";
}

export function getNavItem(href: string): NavItem | undefined {
  return NAV_ITEMS.find((i) => i.href === href);
}
