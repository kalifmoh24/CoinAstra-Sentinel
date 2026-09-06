import { clsx, type ClassValue } from "clsx";
import type { RiskBand } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function bandFromScore(score: number): RiskBand {
  if (score >= 85) return "Critical";
  if (score >= 70) return "High";
  if (score >= 45) return "Moderate";
  if (score >= 25) return "Low";
  return "Very Low";
}

export function bandColor(band: RiskBand): string {
  switch (band) {
    case "Very Low":
      return "text-risk-very-low";
    case "Low":
      return "text-risk-low";
    case "Moderate":
      return "text-risk-moderate";
    case "High":
      return "text-risk-high";
    case "Critical":
      return "text-risk-critical";
  }
}

export function bandBg(band: RiskBand): string {
  switch (band) {
    case "Very Low":
      return "bg-risk-very-low/15 border-risk-very-low/40";
    case "Low":
      return "bg-risk-low/15 border-risk-low/40";
    case "Moderate":
      return "bg-risk-moderate/15 border-risk-moderate/40";
    case "High":
      return "bg-risk-high/15 border-risk-high/40";
    case "Critical":
      return "bg-risk-critical/15 border-risk-critical/40";
  }
}

export function shortAddr(addr: string, size = 4): string {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 2 + size)}…${addr.slice(-size)}`;
}

export function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}
