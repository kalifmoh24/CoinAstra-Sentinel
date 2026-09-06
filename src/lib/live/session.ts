import { cookies } from "next/headers";

export const OWNER_COOKIE = "sentinel_rid";

export async function getOwnerKey(): Promise<string> {
  const store = await cookies();
  return store.get(OWNER_COOKIE)?.value || "anon";
}

export function ownerCookieHeader(rid: string) {
  return {
    name: OWNER_COOKIE,
    value: rid,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}
