import { prisma } from "../db";
import type { Finding, ScanResult } from "../types";

export type RecentScanRow = {
  id: string;
  type: string;
  target: string;
  score: number;
  level: string;
  time: string;
  demo: boolean;
};

export type LiveAlert = {
  id: string;
  title: string;
  desc: string;
  time: string;
  tone: string;
  href: string;
};

function shorten(input: string) {
  if (input.length <= 12) return input;
  return `${input.slice(0, 6)}…${input.slice(-4)}`;
}

function timeAgo(iso: Date) {
  const ms = Date.now() - iso.getTime();
  const m = Math.max(1, Math.round(ms / 60000));
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export async function loadRecentScans(limit = 12): Promise<RecentScanRow[]> {
  try {
    const rows = await prisma.scan.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map((s) => ({
      id: s.id,
      type: s.inputType,
      target: shorten(s.input),
      score: s.score,
      level: s.band,
      time: timeAgo(s.createdAt),
      demo: s.demo,
    }));
  } catch {
    return [];
  }
}

export async function loadAlertsFromScans(limit = 8): Promise<LiveAlert[]> {
  try {
    const rows = await prisma.scan.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const alerts: LiveAlert[] = [];
    for (const s of rows) {
      let findings: Finding[] = [];
      try {
        const result = JSON.parse(s.resultJson) as ScanResult;
        findings = result.criticalFindings?.length
          ? result.criticalFindings
          : (result.findings ?? []).filter((f) => f.severity === "critical" || f.severity === "high");
      } catch {
        continue;
      }
      for (const f of findings.slice(0, 2)) {
        alerts.push({
          id: `${s.id}-${f.id}`,
          title: f.title,
          desc: f.description,
          time: timeAgo(s.createdAt),
          tone: f.severity === "critical" ? "critical" : "high",
          href: `/scan/${s.id}`,
        });
      }
      if (alerts.length >= limit) break;
    }
    return alerts.slice(0, limit);
  } catch {
    return [];
  }
}

export async function loadScanStats() {
  const scans = await loadRecentScans(100);
  const high = scans.filter((s) => s.level === "High" || s.level === "Critical").length;
  return {
    scans: scans.length,
    highRisk: high,
    lastScore: scans[0]?.score ?? null,
    lastBand: scans[0]?.level ?? null,
  };
}
