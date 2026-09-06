import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true";
}

export function liveConfig() {
  return {
    demoMode: isDemoMode(),
    etherscan: Boolean(process.env.ETHERSCAN_API_KEY),
    alchemy: Boolean(process.env.ALCHEMY_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    database: Boolean(process.env.DATABASE_URL),
  };
}
