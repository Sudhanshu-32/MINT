import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { AuditResult } from "@/types";
import { PRICING_DATA } from "@/lib/pricingData";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function generateFallbackSummary(audit: AuditResult): string {
  const { totalMonthlySavings, formData, recommendations } = audit;
  const highSeverity = recommendations.filter(
    (r) => r.severity === "high"
  ).length;

  if (totalMonthlySavings === 0) {
    return `Your AI tool stack looks well-optimized for a ${formData.teamSize}-person team focused on ${formData.useCase}. You're making smart spending decisions — no major inefficiencies found. Keep an eye on usage as your team grows, as plan needs can shift quickly with headcount changes.`;
  }

  return `Your AI tool audit reveals $${totalMonthlySavings}/month in potential savings — that's $${totalMonthlySavings * 12}/year. With ${highSeverity} high-priority recommendation${highSeverity !== 1 ? "s" : ""}, your ${formData.teamSize}-person team has clear opportunities to optimize spend without sacrificing capability. The biggest wins come from right-sizing plans to your actual team size and consolidating overlapping tools.`;
}

export async function POST(req: NextRequest) {
  try {
    const audit: AuditResult = await req.json();

    const toolList = audit.recommendations
      .map((r) => {
        const displayName =
          PRICING_DATA[r.tool]?.displayName || r.tool;
        return `- ${displayName} (${r.currentPlan}): $${r.currentSpend}/mo → ${r.recommendedAction} (saves $${r.monthlySavings}/mo)`;
      })
      .join("\n");

    const prompt = `You are an expert in SaaS spend optimization. Write a personalized 80-100 word summary paragraph for this AI tool audit. Be specific, use the actual numbers, and end with one actionable next step. Do not use bullet points — write flowing prose only.

Team: ${audit.formData.teamSize} people, primary use case: ${audit.formData.useCase}
Total monthly savings opportunity: $${audit.totalMonthlySavings}
Total annual savings: $${audit.totalAnnualSavings}

Tool breakdown:
${toolList}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const summary =
      message.content[0].type === "text"
        ? message.content[0].text
        : generateFallbackSummary(audit);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary generation error:", error);
    // Graceful fallback — never crash the user experience
    const audit: AuditResult = await req.json().catch(() => null);
    const fallback = audit
      ? generateFallbackSummary(audit)
      : "Your audit is complete. Review the recommendations above to optimize your AI tool spend.";

    return NextResponse.json({ summary: fallback });
  }
}