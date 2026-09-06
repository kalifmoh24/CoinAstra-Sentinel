/** DEMO monitor fixtures. Never presented as live on-chain events. */

export type AlertSeverity = "critical" | "high" | "moderate" | "info";
export type AlertKind =
  | "risk-change"
  | "unlimited-approval"
  | "mixer-interaction"
  | "new-contract"
  | "insufficient-data";

export type MonitorAlert = {
  id: string;
  demo: true;
  kind: AlertKind;
  severity: AlertSeverity;
  title: string;
  why: string;
  evidence: string;
  recommendation: string;
  subject: string;
  subjectType: "wallet" | "token" | "contract" | "transaction";
  href: string;
  age: string;
};

export type WatchItem = {
  id: string;
  demo: true;
  label: string;
  subject: string;
  subjectType: "wallet" | "token" | "contract";
  chain: string;
  lastScore: number | null;
  lastBand: string;
  note: string;
  href: string;
};

export const DEMO_ALERTS: MonitorAlert[] = [
  {
    id: "a1",
    demo: true,
    kind: "mixer-interaction",
    severity: "critical",
    title: "Mixer-pattern interaction on watched wallet",
    why: "Heuristic match against the DEMO mixer stub, not a confirmed mixer deposit.",
    evidence: "Counterparty 0xMixer…stub in DEMO wallet activity fixture.",
    recommendation: "Open Wallet Scanner and review the activity timeline before any further transfer.",
    subject: "0x742d…bEb0",
    subjectType: "wallet",
    href: "/scan/wallet",
    age: "2m ago",
  },
  {
    id: "a2",
    demo: true,
    kind: "unlimited-approval",
    severity: "critical",
    title: "Unlimited token approval detected",
    why: "Allowance equals max uint256 on a DEMO fixture spender.",
    evidence: "ERC-20 allowance field is unlimited; spender tagged high-risk in DEMO inventory.",
    recommendation: "Use Approval Checker for revoke guidance. Sentinel does not broadcast revokes.",
    subject: "0xA0b8…eB48",
    subjectType: "token",
    href: "/approval-checker",
    age: "15m ago",
  },
  {
    id: "a3",
    demo: true,
    kind: "risk-change",
    severity: "high",
    title: "Watched contract risk band moved Moderate → High",
    why: "Engine re-score on DEMO fixture after ownership / upgrade findings.",
    evidence: "Score 62 → 78 on last DEMO pass. Band change only — no live mempool watch.",
    recommendation: "Re-run Contract Scanner and read Dangerous permissions before interacting.",
    subject: "0x1111…0582",
    subjectType: "contract",
    href: "/scan/contract",
    age: "1h ago",
  },
  {
    id: "a4",
    demo: true,
    kind: "new-contract",
    severity: "high",
    title: "First interaction with a new unverified contract",
    why: "Wallet activity includes a contract younger than the DEMO age threshold.",
    evidence: "Contract age field in DEMO fixture is below the engine cutoff; verified=false.",
    recommendation: "Preview the transaction and run Contract Scanner before signing.",
    subject: "0xDead…0000",
    subjectType: "wallet",
    href: "/scan/transaction",
    age: "3h ago",
  },
  {
    id: "a5",
    demo: true,
    kind: "insufficient-data",
    severity: "info",
    title: "Live allowances unavailable — not an all-clear",
    why: "Fail-closed: missing inventory is labeled, never treated as zero risk.",
    evidence: "Provider returned null approvals on the live Ethereum path.",
    recommendation: "Keep DEMO_MODE or supply explorer keys. Do not assume the wallet is clean.",
    subject: "Live path",
    subjectType: "wallet",
    href: "/exposure-checker",
    age: "5h ago",
  },
  {
    id: "a6",
    demo: true,
    kind: "risk-change",
    severity: "moderate",
    title: "Watchlist item score drifted +6",
    why: "Deterministic engine delta on a DEMO holding, not a price alert.",
    evidence: "Last two DEMO scores: 49 then 55. No candle or signal product.",
    recommendation: "Open Exposure Checker and confirm holdings still match the fixture.",
    subject: "0x742d…bEb0",
    subjectType: "wallet",
    href: "/watchlist",
    age: "8h ago",
  },
];

export const DEMO_WATCHLIST: WatchItem[] = [
  {
    id: "w1",
    demo: true,
    label: "Treasury wallet (DEMO)",
    subject: "0x742d35Cc6634C0532925a3b844Bc9e7595f4bEb0",
    subjectType: "wallet",
    chain: "ethereum",
    lastScore: 91,
    lastBand: "Critical",
    note: "DEMO fixture — mixer stub + high-risk counterparties.",
    href: "/scan/wallet",
  },
  {
    id: "w2",
    demo: true,
    label: "Watched token (DEMO)",
    subject: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    subjectType: "token",
    chain: "ethereum",
    lastScore: 62,
    lastBand: "Moderate",
    note: "DEMO — unlimited approval flagged on Approval Checker.",
    href: "/scan/token",
  },
  {
    id: "w3",
    demo: true,
    label: "Upgrade proxy (DEMO)",
    subject: "0x1111111111111111111111111111111111110582",
    subjectType: "contract",
    chain: "ethereum",
    lastScore: 34,
    lastBand: "Low",
    note: "DEMO contract posture. Re-scan after any owner change.",
    href: "/scan/contract",
  },
  {
    id: "w4",
    demo: true,
    label: "Cold wallet (DEMO)",
    subject: "0xDead000000000000000000000000000000000000",
    subjectType: "wallet",
    chain: "ethereum",
    lastScore: 55,
    lastBand: "Moderate",
    note: "DEMO — new-contract interaction in activity timeline.",
    href: "/scan/wallet",
  },
];
