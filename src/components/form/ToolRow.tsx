"use client";

import { ToolInput, ToolName } from "@/types";
import { PRICING_DATA } from "@/lib/pricingData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface ToolRowProps {
  toolInput: ToolInput;
  onChange: (updated: ToolInput) => void;
  onRemove: () => void;
}

export default function ToolRow({
  toolInput,
  onChange,
  onRemove,
}: ToolRowProps) {
  const pricing = PRICING_DATA[toolInput.tool];
  const plans = pricing ? Object.keys(pricing.plans) : [];
  const currentPlan = pricing?.plans[toolInput.plan];

  const expectedCost =
    currentPlan && currentPlan.pricePerSeat > 0
      ? currentPlan.pricePerSeat * toolInput.seats
      : null;

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-800">
            {pricing?.displayName || toolInput.tool}
          </span>
          <Badge variant="secondary" className="text-xs">
            {pricing?.category}
          </Badge>
        </div>
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-red-500 transition-colors"
          aria-label="Remove tool"
        >
          <X size={18} />
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Plan */}
        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Plan</Label>
          <Select
            value={toolInput.plan}
            onValueChange={(val) => onChange({ ...toolInput, plan: val })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan) => (
                <SelectItem key={plan} value={plan}>
                  {pricing?.plans[plan].name}
                  {pricing?.plans[plan].pricePerSeat > 0
                    ? ` — $${pricing.plans[plan].pricePerSeat}/seat`
                    : " — Free"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Seats */}
        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Seats</Label>
          <Input
            type="number"
            min={1}
            value={toolInput.seats}
            onChange={(e) =>
              onChange({ ...toolInput, seats: parseInt(e.target.value) || 1 })
            }
            className="h-9"
          />
        </div>

        {/* Monthly Spend */}
        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Monthly spend ($)</Label>
          <Input
            type="number"
            min={0}
            value={toolInput.monthlySpend}
            onChange={(e) =>
              onChange({
                ...toolInput,
                monthlySpend: parseFloat(e.target.value) || 0,
              })
            }
            className="h-9"
          />
        </div>
      </div>

      {/* Expected cost hint */}
      {expectedCost !== null && (
        <p className="text-xs text-slate-400">
          Expected at list price:{" "}
          <span className="font-medium text-slate-600">
            ${expectedCost}/mo
          </span>{" "}
          {toolInput.monthlySpend > expectedCost * 1.1 && (
            <span className="text-amber-500 font-medium">
              ⚠ You may be overpaying
            </span>
          )}
        </p>
      )}
    </div>
  );
}