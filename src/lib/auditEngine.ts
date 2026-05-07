import { FormData, ToolRecommendation, AuditResult } from "@/types";
import { PRICING_DATA } from "./pricingData";
import { nanoid } from "nanoid";

export function runAudit(formData: FormData): AuditResult {
  const recommendations: ToolRecommendation[] = [];

  for (const toolInput of formData.tools) {
    const pricing = PRICING_DATA[toolInput.tool];
    if (!pricing) continue;

    const rec = evaluateTool(toolInput, formData);
    if (rec) recommendations.push(rec);
  }

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );

  return {
    id: nanoid(10),
    formData,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    createdAt: new Date(),
  };
}

function evaluateTool(
  toolInput: { tool: string; plan: string; monthlySpend: number; seats: number },
  formData: FormData
): ToolRecommendation | null {
  const pricing = PRICING_DATA[toolInput.tool];
  if (!pricing) return null;

  const currentPlanInfo = pricing.plans[toolInput.plan];
  if (!currentPlanInfo) return null;

  const currentSpend = toolInput.monthlySpend;
  const seats = toolInput.seats;
  const useCase = formData.useCase;
  const teamSize = formData.teamSize;

  // Check 1: Are they overpaying vs calculated price?
  const expectedCost = currentPlanInfo.pricePerSeat * seats;
  const isOverpaying = currentSpend > expectedCost * 1.1 && expectedCost > 0;

  // Check 2: Team plan for very small teams
  if (
    toolInput.plan === "team" &&
    seats <= 2 &&
    (toolInput.tool === "claude" || toolInput.tool === "chatgpt")
  ) {
    const proPlan = pricing.plans["pro"];
    if (proPlan) {
      const proTotal = proPlan.pricePerSeat * seats;
      const savings = currentSpend - proTotal;
      if (savings > 0) {
        return {
          tool: toolInput.tool as any,
          currentPlan: toolInput.plan,
          currentSpend,
          recommendedAction: "Downgrade to Pro",
          recommendedPlan: "pro",
          estimatedCost: proTotal,
          monthlySavings: savings,
          reason: `Team plan requires min 5 seats but you only have ${seats}. Pro plan covers your needs at $${proTotal}/mo.`,
          severity: "high",
        };
      }
    }
  }

  // Check 3: Cursor vs Windsurf for coding use case
  if (
    toolInput.tool === "cursor" &&
    toolInput.plan === "business" &&
    (useCase === "coding" || useCase === "mixed")
  ) {
    const windsurfPro = PRICING_DATA["windsurf"]?.plans["pro"];
    if (windsurfPro) {
      const windsurfTotal = windsurfPro.pricePerSeat * seats;
      const savings = currentSpend - windsurfTotal;
      if (savings > 50) {
        return {
          tool: toolInput.tool as any,
          currentPlan: toolInput.plan,
          currentSpend,
          recommendedAction: "Switch to Windsurf Pro",
          recommendedPlan: "pro",
          estimatedCost: windsurfTotal,
          monthlySavings: savings,
          reason: `Windsurf Pro at $15/seat offers similar AI coding features for ${seats} devs at $${windsurfTotal}/mo vs your current $${currentSpend}/mo.`,
          severity: savings > 200 ? "high" : "medium",
        };
      }
    }
  }

  // Check 4: GitHub Copilot Enterprise overkill
  if (
    toolInput.tool === "github_copilot" &&
    toolInput.plan === "enterprise" &&
    teamSize < 50
  ) {
    const bizPlan = pricing.plans["business"];
    if (bizPlan) {
      const bizTotal = bizPlan.pricePerSeat * seats;
      const savings = currentSpend - bizTotal;
      if (savings > 0) {
        return {
          tool: toolInput.tool as any,
          currentPlan: toolInput.plan,
          currentSpend,
          recommendedAction: "Downgrade to Business",
          recommendedPlan: "business",
          estimatedCost: bizTotal,
          monthlySavings: savings,
          reason: `Enterprise is designed for 50+ seat orgs with compliance needs. Business plan saves $${savings}/mo with no meaningful feature loss for your team size.`,
          severity: "high",
        };
      }
    }
  }

  // Check 5: Claude Max for non-power users
  if (toolInput.tool === "claude" && toolInput.plan === "max" && seats <= 3) {
    const proPlan = pricing.plans["pro"];
    if (proPlan) {
      const proTotal = proPlan.pricePerSeat * seats;
      const savings = currentSpend - proTotal;
      if (savings > 0) {
        return {
          tool: toolInput.tool as any,
          currentPlan: toolInput.plan,
          currentSpend,
          recommendedAction: "Downgrade to Pro",
          recommendedPlan: "pro",
          estimatedCost: proTotal,
          monthlySavings: savings,
          reason: `Claude Max gives 20x usage — typically only needed by power users processing hundreds of documents daily. Pro is sufficient for most teams.`,
          severity: "medium",
        };
      }
    }
  }

  // Check 6: Duplicate tools — both Claude and ChatGPT for same use case
  const hasClaude = formData.tools.some((t) => t.tool === "claude");
  const hasChatGPT = formData.tools.some((t) => t.tool === "chatgpt");
  if (
    hasClaude &&
    hasChatGPT &&
    toolInput.tool === "chatgpt" &&
    useCase === "writing"
  ) {
    return {
      tool: toolInput.tool as any,
      currentPlan: toolInput.plan,
      currentSpend,
      recommendedAction: "Consolidate to Claude",
      estimatedCost: 0,
      monthlySavings: currentSpend,
      reason: `You're paying for both Claude and ChatGPT for writing. Claude scores higher on writing benchmarks — consolidating saves $${currentSpend}/mo.`,
      severity: "high",
    };
  }

  // Check 7: API direct — flag if spend is very high
  if (
    (toolInput.tool === "anthropic_api" || toolInput.tool === "openai_api") &&
    currentSpend > 500
  ) {
    return {
      tool: toolInput.tool as any,
      currentPlan: toolInput.plan,
      currentSpend,
      recommendedAction: "Audit API usage + consider credits",
      estimatedCost: currentSpend * 0.7,
      monthlySavings: currentSpend * 0.3,
      reason: `At $${currentSpend}/mo on API, you qualify for volume discounts or discounted credits through Credex — potential 30% savings.`,
      severity: currentSpend > 1000 ? "high" : "medium",
    };
  }

  // Default: already optimal
  return {
    tool: toolInput.tool as any,
    currentPlan: toolInput.plan,
    currentSpend,
    recommendedAction: "No change needed",
    estimatedCost: currentSpend,
    monthlySavings: 0,
    reason: `Your ${pricing.displayName} ${currentPlanInfo.name} plan is well matched to your team size and use case.`,
    severity: "optimal",
  };
}