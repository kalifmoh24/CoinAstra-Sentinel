import { prisma } from "../db";
import type { Finding, ScanResult } from "../types";

export type WatchRow = {
  id: string;
  subject: string;
  subjectType: string;
  chain: string;
  label: string | null;
  lastScore: number | null;
  lastBand: string | null;
  lastScanId: string | null;
  note: string | null;
  updatedAt: string;
};

function shorten(input: string) {
  if (input.length <= 14) return input;
  return `${input.slice(0, 6)}…${input.slice(-4)}`;
}

export async function listWatchItems(ownerKey: string): Promise<WatchRow[]> {
  try {
    const rows = await prisma.watchItem.findMany({
      where: { ownerKey },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map((r) => ({
      id: r.id,
      subject: r.subject,
      subjectType: r.subjectType,
      chain: r.chain,
      label: r.label,
      lastScore: r.lastScore,
      lastBand: r.lastBand,
      lastScanId: r.lastScanId,
      note: r.note,
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function upsertWatchItem(input: {
  ownerKey: string;
  subject: string;
  subjectType: string;
  chain?: string;
  label?: string | null;
  lastScore?: number | null;
  lastBand?: string | null;
  lastScanId?: string | null;
  note?: string | null;
}) {
  const chain = input.chain || "ethereum";
  const subject = input.subject.trim();
  return prisma.watchItem.upsert({
    where: {
      ownerKey_subject_subjectType_chain: {
        ownerKey: input.ownerKey,
        subject,
        subjectType: input.subjectType,
        chain,
      },
    },
    create: {
      ownerKey: input.ownerKey,
      subject,
      subjectType: input.subjectType,
      chain,
      label: input.label || shorten(subject),
      lastScore: input.lastScore ?? null,
      lastBand: input.lastBand ?? null,
      lastScanId: input.lastScanId ?? null,
      note: input.note ?? null,
    },
    update: {
      label: input.label || undefined,
      lastScore: input.lastScore ?? undefined,
      lastBand: input.lastBand ?? undefined,
      lastScanId: input.lastScanId ?? undefined,
      note: input.note ?? undefined,
    },
  });
}

export async function deleteWatchItem(ownerKey: string, id: string) {
  return prisma.watchItem.deleteMany({ where: { id, ownerKey } });
}

export async function recordScanAlerts(opts: {
  ownerKey: string;
  result: ScanResult;
}) {
  const { ownerKey, result } = opts;
  const findings: Finding[] = (result.criticalFindings?.length
    ? result.criticalFindings
    : result.findings
  ).filter((f) => f.severity === "critical" || f.severity === "high");

  try {
    await prisma.watchItem.updateMany({
      where: { subject: result.input, chain: result.chain },
      data: {
        lastScore: result.score,
        lastBand: result.band,
        lastScanId: result.id,
      },
    });
  } catch {
    /* table may not exist yet */
  }

  if (!findings.length) return;
  try {
    await prisma.alertEvent.createMany({
      data: findings.slice(0, 6).map((f) => ({
        ownerKey,
        scanId: result.id,
        subject: result.input,
        subjectType: result.inputType,
        severity: f.severity,
        title: f.title,
        description: f.description,
        evidence: (f.evidence ?? []).map((e) => e.reason).join("; ") || "engine finding",
        recommendation: f.recommendation ?? null,
        href: `/scan/${result.id}`,
      })),
    });
  } catch {
    /* table may not exist yet */
  }
}

export async function listAlerts(ownerKey: string, limit = 24) {
  try {
    const rows = await prisma.alertEvent.findMany({
      where: {
        OR: [{ ownerKey }, { ownerKey: null }],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows;
  } catch {
    return [];
  }
}
