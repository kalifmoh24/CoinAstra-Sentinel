import type { Finding } from "../types";

/**
 * Deterministic recommendations keyed by finding id.
 * Applied for critical/high findings when the engine did not set recommendation.
 */
const BY_ID: Record<string, string> = {
  "wallet-mixer":
    "Avoid sending funds that must remain attributable; verify counterparties and consider isolating this wallet from high-value holdings.",
  "wallet-sanctions":
    "Do not transact with this address. Escalate to compliance review if you are obligated to screen counterparties.",
  "wallet-known-malicious":
    "Treat as hostile. Do not approve spending, sign messages, or send assets to this address.",
  "wallet-phishing-reports":
    "Verify any site or dApp that referenced this address out-of-band before interacting.",
  "wallet-high-risk-interactions":
    "Review the labeled counterparties; revoke lingering approvals to those contracts if you control the wallet.",
  "wallet-funding-risk":
    "Trace funding provenance before accepting large inbound transfers from this wallet.",
  "wallet-age-new":
    "Prefer waiting for more history or using a secondary wallet for first interactions with untrusted contracts.",
  "contract-unverified":
    "Do not approve unlimited allowances until source is verified or audited by a party you trust.",
  "contract-new":
    "Limit exposure size; newly deployed contracts have short track records and higher rug/exploit incidence.",
  "abi-blacklist":
    "Assume transfers can be blocked for selected addresses; avoid relying on free transferability.",
  "abi-mint":
    "Check who can mint and under what constraints — uncapped mint can dilute holders.",
  "abi-pause":
    "Confirm pause authority and conditions; paused contracts can freeze user funds temporarily.",
  "abi-selfdestruct":
    "Avoid depositing value into contracts that can self-destruct unless you fully understand the control path.",
  "abi-fee-controls":
    "Review max fee bounds and who can change them before swapping or providing liquidity.",
  "contract-proxy":
    "Inspect the current implementation and admin/upgrade keys; upgradeable logic can change without a new address.",
  honeypot:
    "Do not buy or approve. Honeypot heuristics suggest sells/transfers may fail for holders.",
  "low-liquidity":
    "Expect high slippage and exit risk; size positions accordingly or skip thin pools.",
  "not-a-contract":
    "Confirm you intended a wallet address rather than a token/contract interaction.",
};

const CATEGORY_FALLBACK: Partial<Record<Finding["category"], string>> = {
  Security:
    "Pause interaction until you can corroborate this signal with primary explorer and security sources.",
  Ownership:
    "Identify who holds privileged roles and whether those keys are multisig/timelocked before trusting the contract.",
  Contract:
    "Read verified source (or refuse to interact if unverified) and limit approvals to exact spend amounts.",
  Wallet:
    "Use a throwaway or low-balance wallet until counterparties and funding paths look conventional.",
  Liquidity:
    "Check pool depth and lock status on a primary DEX explorer before trading size.",
  Transaction:
    "Simulate or dry-run the call, revoke unused approvals, and confirm the method and spender before signing.",
};

export function recommendationForFinding(f: Finding): string | undefined {
  if (f.recommendation) return f.recommendation;
  if (f.severity !== "critical" && f.severity !== "high") return undefined;
  return BY_ID[f.id] ?? CATEGORY_FALLBACK[f.category];
}

/** Attach recommendations onto critical/high findings (mutates copies). */
export function withRecommendations(findings: Finding[]): Finding[] {
  return findings.map((f) => {
    const recommendation = recommendationForFinding(f);
    if (!recommendation || f.recommendation === recommendation) return f;
    return { ...f, recommendation };
  });
}

/** Privilege / dangerous-permission finding ids shown in the dedicated panel. */
export const DANGEROUS_PERMISSION_IDS = new Set([
  "abi-mint",
  "abi-pause",
  "abi-blacklist",
  "abi-selfdestruct",
  "abi-fee-controls",
  "contract-proxy",
  "has-owner",
  "abi-ownership-transfer",
]);

export function isDangerousPermissionFinding(f: Finding): boolean {
  return DANGEROUS_PERMISSION_IDS.has(f.id);
}
