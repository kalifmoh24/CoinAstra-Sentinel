/**
 * Polygon — out of scope for Phase 1 beyond scaffold.
 * Full multi-chain adapters are out of scope for Phase 1 MVP.
 */

export const chainId = "polygon";

export async function notImplemented(action: string): Promise<never> {
  throw new Error(`[polygon] ${action} not implemented in Phase 1`);
}
