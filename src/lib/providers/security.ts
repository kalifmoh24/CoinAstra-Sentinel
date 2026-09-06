import type { SecurityIntel } from "../types";
import { DEMO_SECURITY } from "../demo/fixtures";
import { isDemoMode } from "../db";

export interface SecurityDataProvider {
  screenAddress(address: string): Promise<SecurityIntel>;
}

/**
 * Live screening without a vendor key must fail closed:
 * null fields mean Insufficient data — never false/0 (fake clean bill of health).
 * DEMO_MODE may return explicit false/0 only because fixtures are DEMO-labeled.
 */
export const securityProvider: SecurityDataProvider = {
  async screenAddress(address: string) {
    if (isDemoMode()) {
      return { ...DEMO_SECURITY, notes: [...(DEMO_SECURITY.notes ?? []), `screened:${address}`] };
    }
    // Live screening integrations (Chainalysis/TRM/etc.) — not configured yet
    return {
      sanctionsHit: null,
      phishingReports: null,
      knownMalicious: null,
      notes: ["Insufficient data: no live security vendor key configured"],
      demo: false,
      sources: ["security-provider-stub"],
    };
  },
};
