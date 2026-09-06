import type { SecurityIntel } from "../types";
import { DEMO_SECURITY } from "../demo/fixtures";
import { isDemoMode } from "../db";

export interface SecurityDataProvider {
  screenAddress(address: string): Promise<SecurityIntel>;
}

export const securityProvider: SecurityDataProvider = {
  async screenAddress(address: string) {
    if (isDemoMode()) {
      return { ...DEMO_SECURITY, notes: [...(DEMO_SECURITY.notes ?? []), `screened:${address}`] };
    }
    // Live screening integrations (Chainalysis/TRM/etc.) — Phase 1+; insufficient data if unset
    return {
      sanctionsHit: false,
      phishingReports: 0,
      knownMalicious: false,
      notes: ["Insufficient data: no live security vendor key configured"],
      demo: false,
      sources: ["security-provider-stub"],
    };
  },
};
