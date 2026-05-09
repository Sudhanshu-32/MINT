import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { AuditResult } from "@/types";
import { PRICING_DATA } from "@/lib/pricingData";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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
  let audit: AuditResult | null = null;

  try {
    audit = await req.json();
    if (!audit) throw new Error("No audit data");

    const toolList = audit.recommendations
      .map((r) => {
        const displayName = PRICING_DATA[r.tool]?.displayName || r.tool;
        return `- ${displayName} (${r.currentPlan}): $${r.currentSpend}/mo → ${r.recommendedAction} (saves $${r.monthlySavings}/mo)`;
      })
      .join("\n");

    const prompt = `You are an expert in SaaS spend optimization. Write a personalized 80-100 word summary paragraph for this AI tool audit. Be specific, use the actual numbers, and end with one actionable next step. Write flowing prose only, no bullet points.

Team: ${audit.formData.teamSize} people, primary use case: ${audit.formData.useCase}
Total monthly savings opportunity: $${audit.totalMonthlySavings}
Total annual savings: $${audit.totalAnnualSavings}

Tool breakdown:
${toolList}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      max_tokens: 200,
      temperature: 0.7,
    });

    const summary =
      completion.choices[0]?.message?.content ||
      generateFallbackSummary(audit);

    // Save summary back to MongoDB
    const { default: connectDB } = await import("@/lib/mongodb");
    const { default: AuditModel } = await import("@/models/Audit");
    await connectDB();
    await AuditModel.findOneAndUpdate(
      { id: audit.id },
      { summary }
    );

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary generation error:", error);
    const fallback = audit
      ? generateFallbackSummary(audit)
      : "Your audit is complete. Review the recommendations above to optimize your AI tool spend.";
    return NextResponse.json({ summary: fallback });
  }
}