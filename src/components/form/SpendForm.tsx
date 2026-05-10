"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormData, ToolInput, ToolName, UseCase } from "@/types";
import { PRICING_DATA } from "@/lib/pricingData";
import ToolRow from "./ToolRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Zap } from "lucide-react";

const ALL_TOOLS = Object.keys(PRICING_DATA) as ToolName[];

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding / Engineering" },
  { value: "writing", label: "Writing / Content" },
  { value: "data", label: "Data / Analysis" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / General" },
];

const STORAGE_KEY = "mint_form_data";

function defaultTool(tool: ToolName): ToolInput {
  return {
    tool,
    plan: "",
    monthlySpend: 0,
    seats: 1,
  };
}

export default function SpendForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    tools: [defaultTool("cursor"), defaultTool("claude")],
    teamSize: 0,
    useCase: "" as UseCase,
  });

  // Load persisted form state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch {}
    }
  }, []);

  // Persist form state on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const addTool = (tool: ToolName) => {
    const alreadyAdded = formData.tools.some((t) => t.tool === tool);
    if (alreadyAdded) return;
    setFormData((prev) => ({
      ...prev,
      tools: [...prev.tools, defaultTool(tool)],
    }));
  };

  const removeTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  };

  const updateTool = (index: number, updated: ToolInput) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.map((t, i) => (i === index ? updated : t)),
    }));
  };

  const handleSubmit = async () => {
    if (formData.tools.length === 0) {
      setError("Please add at least one AI tool.");
      return;
    }

    const unselectedPlans = formData.tools.filter((t) => !t.plan);
    if (unselectedPlans.length > 0) {
      setError("Please select a plan for all tools.");
      return;
    }

    if (!formData.teamSize || formData.teamSize < 1) {
      setError("Please enter your team size.");
      return;
    }

    if (!formData.useCase) {
      setError("Please select a primary use case.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Create audit
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create audit");
      const audit = await res.json();

      // Step 2: Wait for AI summary before redirecting
      await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(audit),
      });

      // Step 3: Now redirect — summary is ready
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/audit/${audit.id}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const availableTools = ALL_TOOLS.filter(
    (t) => !formData.tools.some((ft) => ft.tool === t)
  );

  const totalSpend = formData.tools.reduce(
    (sum, t) => sum + t.monthlySpend,
    0
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">
          <Zap size={14} />
          Free AI Spend Audit
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Are you overpaying for AI?
        </h1>
        <p className="text-slate-500 text-lg">
          Enter your current AI tools and get an instant audit —
          no signup required.
        </p>
      </div>

      {/* Team Info */}
      <div className="bg-slate-50 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-slate-700">Your team</h2>
        <div className="grid grid-cols-2 gap-4">

          {/* Team size — fully keyboard editable */}
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Team size</Label>
            <Input
              type="number"
              min={1}
              max={100000}
              value={formData.teamSize === 0 ? "" : formData.teamSize}
              onChange={(e) => {
                const val = e.target.value;
                const size = val === "" ? 0 : parseInt(val);
                setFormData((prev) => ({
                  ...prev,
                  teamSize: isNaN(size) ? 0 : size,
                }));
              }}
              onBlur={(e) => {
                if (!e.target.value || parseInt(e.target.value) < 1) {
                  setFormData((prev) => ({ ...prev, teamSize: 1 }));
                }
              }}
              placeholder="e.g. 10"
              className="h-9 bg-white"
            />
          </div>

          {/* Use case — defaults to Select use case */}
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Primary use case</Label>
            <Select
              value={formData.useCase || ""}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  useCase: val as UseCase,
                }))
              }
            >
              <SelectTrigger className="h-9 bg-white">
                <SelectValue placeholder="Select use case" />
              </SelectTrigger>
              <SelectContent>
                {USE_CASES.map((uc) => (
                  <SelectItem key={uc.value} value={uc.value}>
                    {uc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Inline warnings */}
        <div className="space-y-1">
          {(!formData.teamSize || formData.teamSize < 1) && (
            <p className="text-xs text-amber-500">
              ⚠ Please enter your team size
            </p>
          )}
          {!formData.useCase && (
            <p className="text-xs text-amber-500">
              ⚠ Please select a use case
            </p>
          )}
        </div>
      </div>

      {/* Tool Rows */}
      <div className="space-y-3">
        <h2 className="font-semibold text-slate-700">
          Your AI tools
          <span className="ml-2 text-sm font-normal text-slate-400">
            (total: ${totalSpend}/mo)
          </span>
        </h2>

        {formData.tools.map((tool, index) => (
          <ToolRow
            key={tool.tool}
            toolInput={tool}
            onChange={(updated) => updateTool(index, updated)}
            onRemove={() => removeTool(index)}
          />
        ))}

        {/* Add Tool */}
        {availableTools.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {availableTools.map((tool) => (
              <button
                key={tool}
                onClick={() => addTool(tool)}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600 border border-slate-200 hover:border-emerald-300 rounded-lg px-3 py-1.5 transition-all bg-white"
              >
                <Plus size={14} />
                {PRICING_DATA[tool].displayName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={loading || formData.tools.length === 0}
        className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin mr-2" />
            Analyzing your stack...
          </>
        ) : (
          <>
            <Zap size={18} className="mr-2" />
            Run Free Audit →
          </>
        )}
      </Button>

      <p className="text-center text-xs text-slate-400">
        No account needed. Your data is never sold.
      </p>
    </div>
  );
}