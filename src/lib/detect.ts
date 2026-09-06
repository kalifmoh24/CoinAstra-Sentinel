import type { InputType } from "./types";

const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const TX_HASH = /^0x[a-fA-F0-9]{64}$/;

export function detectInputType(raw: string): InputType {
  const input = raw.trim();
  if (TX_HASH.test(input)) return "transaction";
  if (EVM_ADDRESS.test(input)) return "wallet"; // refined server-side if code present
  return "unknown";
}

export function isEvmAddress(raw: string): boolean {
  return EVM_ADDRESS.test(raw.trim());
}

export function isTxHash(raw: string): boolean {
  return TX_HASH.test(raw.trim());
}

export function normalizeInput(raw: string): string {
  return raw.trim();
}
