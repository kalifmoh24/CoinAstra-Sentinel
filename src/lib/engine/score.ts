import type { CategoryScore, Finding, RiskBand, RiskCategory } from "../types";
import { bandFromScore, clamp } from "../utils";

const WEIGHTS: Record<RiskCategory, number> = {
  Security: 0.22,
  Contract: 0.2,
  Wallet: 0.18,
  Liquidity: 0.12,
  Ownership: 0.16,
  Transaction: 0.12,
};

export function aggregateScore(findings: Finding[]): {
  score: number;
  band: RiskBand;
  categories: CategoryScore[];
} {
  const byCat = new Map<RiskCategory, Finding[]>();
  for (const f of findings) {
    const list = byCat.get(f.category) ?? [];
    list.push(f);
    byCat.set(f.category, list);
  }

  const categories: CategoryScore[] = (Object.keys(WEIGHTS) as RiskCategory[]).map((category) => {
    const items = byCat.get(category) ?? [];
    const impact = items.reduce((s, f) => s + f.scoreImpact, 0);
    const score = clamp(Math.round(impact));
    const summary =
      items.length === 0
        ? "Insufficient data"
        : items
            .slice()
            .sort((a, b) => Math.abs(b.scoreImpact) - Math.abs(a.scoreImpact))
            .slice(0, 2)
            .map((f) => f.title)
            .join("; ");
    return { category, score, weight: WEIGHTS[category], summary };
  });

  const weighted = categories.reduce((s, c) => s + c.score * c.weight, 0);
  const score = clamp(Math.round(weighted));
  return { score, band: bandFromScore(score), categories };
}
