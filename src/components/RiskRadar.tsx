"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { CategoryScore, RiskBand } from "@/lib/types";

const AXES = ["Security", "Contract", "Liquidity", "Ownership", "Transaction", "Wallet"] as const;

function bandStroke(band: RiskBand): string {
  switch (band) {
    case "Critical":
      return "#f43f5e";
    case "High":
      return "#fb923c";
    case "Moderate":
      return "#fbbf24";
    case "Low":
    case "Very Low":
      return "#34d399";
  }
}

export function RiskRadar({
  categories,
  band,
  size = 200,
}: {
  categories: CategoryScore[];
  band: RiskBand;
  size?: number;
}) {
  const byCat = new Map(categories.map((c) => [c.category, c.score]));
  const data = AXES.map((name) => ({
    subject: name,
    score: byCat.get(name) ?? 0,
    fullMark: 100,
  }));
  const stroke = bandStroke(band);

  return (
    <div className="mx-auto w-full" style={{ maxWidth: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.12)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#94a3b8", fontSize: 10 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Risk"
            dataKey="score"
            stroke={stroke}
            fill={stroke}
            fillOpacity={0.35}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
