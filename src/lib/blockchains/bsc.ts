/**
 * BNB Smart Chain — out of scope for Phase 1 beyond scaffold.
 * Full multi-chain adapters are out of scope for Phase 1 MVP.
 */

export const chainId = "bsc";

export async function notImplemented(action: string): Promise<never> {
  throw new Error(`[bsc] ${action} not implemented in Phase 1`);
}
