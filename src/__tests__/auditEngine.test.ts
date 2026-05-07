import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/auditEngine";
import { FormData } from "@/types";

describe("Audit Engine", () => {
  it("detects team plan overkill for small teams", () => {
    const input: FormData = {
      tools: [{ tool: "claude", plan: "team", monthlySpend: 30, seats: 1 }],
      teamSize: 1,
      useCase: "writing",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.severity).toBe("high");
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  it("recommends windsurf for cursor business with coding use case", () => {
    const input: FormData = {
      tools: [{ tool: "cursor", plan: "business", monthlySpend: 200, seats: 5 }],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.recommendedAction).toContain("Windsurf");
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  it("flags github copilot enterprise for small teams", () => {
    const input: FormData = {
      tools: [{ tool: "github_copilot", plan: "enterprise", monthlySpend: 195, seats: 5 }],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.severity).toBe("high");
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  it("calculates correct annual savings", () => {
    const input: FormData = {
      tools: [{ tool: "claude", plan: "team", monthlySpend: 60, seats: 2 }],
      teamSize: 2,
      useCase: "writing",
    };
    const result = runAudit(input);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it("returns optimal for well matched plans", () => {
    const input: FormData = {
      tools: [{ tool: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.severity).toBe("optimal");
    expect(rec.monthlySavings).toBe(0);
  });

  it("generates unique audit ids", () => {
    const input: FormData = {
      tools: [{ tool: "claude", plan: "pro", monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: "writing",
    };
    const result1 = runAudit(input);
    const result2 = runAudit(input);
    expect(result1.id).not.toBe(result2.id);
  });
});