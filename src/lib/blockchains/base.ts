/**
 * Base L2 — Phase 1 stub; route to ethereum-style providers later.
 * Full multi-chain adapters are out of scope for Phase 1 MVP.
 */

export const chainId = "base";

export async function notImplemented(action: string): Promise<never> {
  throw new Error(`[base] ${action} not implemented in Phase 1`);
}
