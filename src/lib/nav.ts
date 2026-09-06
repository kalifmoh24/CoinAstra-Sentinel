/** Locked CoinAstra IA — sidebar groups match product mockups. */

export type NavStatus = "live" | "beta" | "soon";

export type NavGroupId = "dashboard" | "scanners" | "intel" | "portfolio" | "more";

/** Lucide icon keys resolved in AppShell / BottomNav / MoreMenu. */
export type NavIconKey =
  | "home"
  | "wallet"
  | "coins"
  | "fileCode"
  | "arrowLeftRight"
  | "shieldCheck"
  | "radar"
  | "bot"
  | "sparkles"
  | "shieldAlert"
  | "bell"
  | "star"
  | "candlestick"
  | "rocket"
  | "brain"
  | "pieChart"
  | "layers"
  | "trendingUp"
  | "lineChart"
  | "plug"
  | "settings"
  | "badgeDollar"
  | "flaskConical";

export type NavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  status: NavStatus;
  description: string;
  relatedHref?: string;
  relatedLabel?: string;
  group: NavGroupId;
  icon: NavIconKey;
  /** Show notification badge count in sidebar (DEMO) */
  badgeDemo?: number;
  /** Hide from desktop sidebar (still in More sheet / routes) */
  sidebarHidden?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Home",
    status: "live",
    description:
      "Your CoinAstra command center — overview of recent Sentinel scans and watch items. DEMO widgets are labeled.",
    group: "dashboard",
    icon: "home",
  },
  {
    href: "/scan/wallet",
    label: "Wallet Scanner",
    shortLabel: "Wallet",
    status: "live",
    description: "Scan an EVM wallet for age, activity, funding risk, and security heuristics.",
    group: "scanners",
    icon: "wallet",
  },
  {
    href: "/scan/token",
    label: "Token Scanner",
    shortLabel: "Token",
    status: "live",
    description:
      "Token security checks with evidence — honeypot hooks, ownership, and liquidity signals when data exists.",
    group: "scanners",
    icon: "coins",
  },
  {
    href: "/scan/contract",
    label: "Contract Scanner",
    shortLabel: "Contract",
    status: "live",
    description: "Smart contract risk: verified status, proxy/upgradeable patterns, dangerous permissions.",
    group: "scanners",
    icon: "fileCode",
  },
  {
    href: "/scan/transaction",
    label: "Transaction Preview",
    shortLabel: "Tx",
    status: "live",
    description: "Analyze a transaction before you sign. Analysis only — never signs or executes.",
    group: "scanners",
    icon: "arrowLeftRight",
  },
  {
    href: "/approval-checker",
    label: "Approval Checker",
    shortLabel: "Approvals",
    status: "live",
    description:
      "List ERC-20 allowances with evidence — unlimited and risky spenders flagged. DEMO labeled when fixtures used.",
    relatedHref: "/scan/token",
    relatedLabel: "Token Scanner",
    group: "scanners",
    icon: "shieldCheck",
  },
  {
    href: "/exposure-checker",
    label: "Exposure Checker",
    shortLabel: "Exposure",
    status: "live",
    description:
      "Map holdings and approval-driven exposure from structured evidence. Balances never invented. DEMO labeled.",
    relatedHref: "/scan/wallet",
    relatedLabel: "Wallet Scanner",
    group: "scanners",
    icon: "radar",
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
    group: "scanners",
    icon: "bot",
  },
  {
    href: "/transaction-simulator",
    label: "Transaction Simulator",
    shortLabel: "Simulate",
    status: "live",
    description:
      "Simulate call outcomes without broadcasting. Fail-closed without eth_call/trace. DEMO labeled. Never executes.",
    relatedHref: "/scan/transaction",
    relatedLabel: "Transaction Preview",
    group: "scanners",
    icon: "flaskConical",
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
    group: "intel",
    icon: "sparkles",
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
    icon: "shieldAlert",
  },
  {
    href: "/alerts",
    label: "Alerts",
    status: "soon",
    description: "Monitoring and alert rules for watched addresses and contracts — scaffolding only for now.",
    relatedHref: "/watchlist",
    relatedLabel: "Watchlist",
    group: "intel",
    icon: "bell",
    badgeDemo: 8,
  },
  {
    href: "/watchlist",
    label: "Watchlist",
    status: "soon",
    description: "Save wallets, tokens, and contracts to revisit. No fake price ticks or signal spam.",
    relatedHref: "/scan/token",
    relatedLabel: "Token Scanner",
    group: "intel",
    icon: "star",
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
    icon: "candlestick",
  },
  {
    href: "/launchpad-intelligence",
    label: "Launchpad Intel",
    shortLabel: "Launchpad",
    status: "soon",
    description:
      "Early-token and launchpad contract posture. Sentinel assesses security; it does not pump listings.",
    relatedHref: "/scan/contract",
    relatedLabel: "Contract Scanner",
    group: "intel",
    icon: "rocket",
  },
  {
    href: "/ai-intelligence",
    label: "AI Intelligence",
    shortLabel: "AI Intel",
    status: "beta",
    description:
      "How Sentinel AI explains evidence-backed findings. AI never invents blockchain facts or risk scores.",
    relatedHref: "/dashboard",
    relatedLabel: "Dashboard",
    group: "intel",
    icon: "brain",
    sidebarHidden: true,
  },
  {
    href: "/portfolio",
    label: "Portfolio Overview",
    shortLabel: "Portfolio",
    status: "soon",
    description:
      "Connect holdings later to surface security exposure. Sentinel assesses risk; it does not invent balances.",
    group: "portfolio",
    icon: "pieChart",
  },
  {
    href: "/holdings",
    label: "Holdings",
    status: "soon",
    description: "Holdings list for connected wallets — scaffolding. No invented balances.",
    relatedHref: "/portfolio",
    relatedLabel: "Portfolio Overview",
    group: "portfolio",
    icon: "layers",
  },
  {
    href: "/performance",
    label: "Performance",
    status: "soon",
    description: "Performance views when portfolio data is connected — scaffolding only.",
    relatedHref: "/portfolio",
    relatedLabel: "Portfolio Overview",
    group: "portfolio",
    icon: "trendingUp",
  },
  {
    href: "/markets",
    label: "Markets",
    status: "soon",
    description:
      "Market context for assets you already researched — not price-prediction charts or signal spam. DEMO figures stay labeled.",
    group: "portfolio",
    icon: "lineChart",
    sidebarHidden: true,
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
    group: "more",
    icon: "plug",
  },
  {
    href: "/settings",
    label: "Settings",
    status: "soon",
    description: "Account and preference settings — scaffolding. No payments processed here.",
    relatedHref: "/pricing",
    relatedLabel: "Pricing",
    group: "more",
    icon: "settings",
  },
  {
    href: "/pricing",
    label: "Pricing",
    status: "beta",
    description: "Plan tiers. Payments are stubbed — no real charges.",
    group: "more",
    icon: "badgeDollar",
    sidebarHidden: true,
  },
];

export const NAV_GROUPS: { id: NavGroupId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "scanners", label: "Security Scanners" },
  { id: "intel", label: "Intelligence" },
  { id: "portfolio", label: "Portfolio" },
  { id: "more", label: "More" },
];

/** Mobile bottom bar — Home / Markets / Portfolio / Alerts / More */
export const BOTTOM_PRIMARY = [
  { href: "/dashboard", label: "Home", icon: "home" as const },
  { href: "/markets", label: "Markets", icon: "lineChart" as const },
  { href: "/portfolio", label: "Portfolio", icon: "pieChart" as const },
  { href: "/alerts", label: "Alerts", icon: "bell" as const },
] as const;

export function statusLabel(status: NavStatus): string {
  if (status === "live") return "Live";
  if (status === "beta") return "Beta stub";
  return "Coming soon";
}

export function getNavItem(href: string): NavItem | undefined {
  return NAV_ITEMS.find((i) => i.href === href);
}
