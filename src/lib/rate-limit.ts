import { prisma } from "./db";

const FREE_DAILY_LIMIT = 5;

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export async function checkAndIncrementRateLimit(key: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
}> {
  const day = dayKey();
  const existing = await prisma.rateLimitBucket.findUnique({
    where: { key_day: { key, day } },
  });

  if (!existing) {
    await prisma.rateLimitBucket.create({ data: { key, day, count: 1 } });
    return { allowed: true, remaining: FREE_DAILY_LIMIT - 1, limit: FREE_DAILY_LIMIT };
  }

  if (existing.count >= FREE_DAILY_LIMIT) {
    return { allowed: false, remaining: 0, limit: FREE_DAILY_LIMIT };
  }

  const updated = await prisma.rateLimitBucket.update({
    where: { key_day: { key, day } },
    data: { count: { increment: 1 } },
  });

  return {
    allowed: true,
    remaining: Math.max(0, FREE_DAILY_LIMIT - updated.count),
    limit: FREE_DAILY_LIMIT,
  };
}

export function clientKeyFromRequest(ip?: string | null, cookieId?: string | null): string {
  if (cookieId && cookieId.length > 8) return `cookie:${cookieId}`;
  if (ip) return `ip:${ip}`;
  return "ip:unknown";
}
