import type { Finding, RiskBand, ScanResult } from "../types";

function templatedExplanation(args: {
  input: string;
  inputType: string;
  score: number;
  band: RiskBand;
  findings: Finding[];
  demo: boolean;
}): string {
  const critical = args.findings.filter((f) => f.severity === "critical" || f.severity === "high");
  const positive = args.findings.filter((f) => f.positive || f.severity === "positive");
  const lines: string[] = [];

  if (args.demo) {
    lines.push("DEMO MODE: This explanation is derived only from labeled demo fixtures and deterministic findings — not live chain state.");
  }

  lines.push(
    `Sentinel assessed ${args.inputType} \`${args.input}\` at risk score ${args.score}/100 (${args.band}).`,
  );
  lines.push(
    "The score is produced solely by the deterministic risk engine from structured evidence; this text does not invent on-chain facts.",
  );

  if (critical.length) {
    lines.push("Key risk drivers:");
    for (const f of critical.slice(0, 5)) {
      const src = f.evidence.map((e) => e.source).join(", ");
      lines.push(`- ${f.title}: ${f.description} (evidence: ${src})`);
    }
  } else {
    lines.push("No critical/high findings were present in the structured result set.");
  }

  if (positive.length) {
    lines.push("Mitigating / positive signals:");
    for (const f of positive.slice(0, 4)) {
      lines.push(`- ${f.title}: ${f.description}`);
    }
  }

  lines.push(
    "If any category shows Insufficient data, treat that dimension as unknown rather than safe. Scores are analytical assessments, not guarantees.",
  );

  return lines.join("\n");
}

async function openaiExplain(prompt: string): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are Sentinel AI for CoinAstra. Explain crypto risk findings. NEVER invent blockchain facts, addresses, scores, or evidence. Only restate and clarify the structured JSON findings provided. If data is missing, say Insufficient data. Keep under 220 words. Professional tone.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function explainFindings( partial: Omit<ScanResult, "aiExplanation" | "disclaimer"> & { disclaimer?: string },
): Promise<string> {
  const fallback = templatedExplanation({
    input: partial.input,
    inputType: partial.inputType,
    score: partial.score,
    band: partial.band,
    findings: partial.findings,
    demo: partial.demo,
  });

  const payload = {
    score: partial.score,
    band: partial.band,
    inputType: partial.inputType,
    demo: partial.demo,
    findings: partial.findings.map((f) => ({
      title: f.title,
      severity: f.severity,
      category: f.category,
      description: f.description,
      evidence: f.evidence.map((e) => ({ reason: e.reason, source: e.source })),
      positive: f.positive,
    })),
  };

  const llm = await openaiExplain(
    `Explain this Sentinel scan using ONLY this JSON. Do not add facts:\n${JSON.stringify(payload)}`,
  );

  return llm ?? fallback;
}
