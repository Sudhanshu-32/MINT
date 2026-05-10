"use client";

import { ToolInput } from "@/types";
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

        {/* Plan dropdown */}
        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Plan</Label>
          <Select
            value={toolInput.plan || ""}
            onValueChange={(val) =>
              onChange({
                ...toolInput,
                plan: val,
                monthlySpend:
                  pricing?.plans[val]?.pricePerSeat * toolInput.seats || 0,
              })
            }
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

        {/* Seats — fully keyboard editable */}
        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Seats</Label>
          <Input
            type="number"
            min={1}
            max={10000}
            value={toolInput.seats === 0 ? "" : toolInput.seats}
            onChange={(e) => {
              const val = e.target.value;
              const seats = val === "" ? 0 : parseInt(val);
              const planPrice =
                pricing?.plans[toolInput.plan]?.pricePerSeat || 0;
              onChange({
                ...toolInput,
                seats: isNaN(seats) ? 1 : seats,
                monthlySpend: planPrice * (isNaN(seats) ? 1 : seats),
              });
            }}
            onBlur={(e) => {
              if (!e.target.value || parseInt(e.target.value) < 1) {
                onChange({ ...toolInput, seats: 1 });
              }
            }}
            placeholder="e.g. 5"
            className="h-9"
          />
        </div>

        {/* Monthly spend — fully keyboard editable */}
        <div className="space-y-1">
          <Label className="text-xs text-slate-500">Monthly spend ($)</Label>
          <Input
            type="number"
            min={0}
            value={toolInput.monthlySpend === 0 ? "" : toolInput.monthlySpend}
            onChange={(e) => {
              const val = e.target.value;
              const spend = val === "" ? 0 : parseFloat(val);
              onChange({
                ...toolInput,
                monthlySpend: isNaN(spend) ? 0 : spend,
              });
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                onChange({ ...toolInput, monthlySpend: 0 });
              }
            }}
            placeholder="e.g. 200"
            className="h-9"
          />
        </div>
      </div>

      {/* Expected cost hint */}
      {expectedCost !== null && toolInput.plan && (
        <p className="text-xs text-slate-400">
          Expected at list price:{" "}
          <span className="font-medium text-slate-600">
            ${expectedCost}/mo
          </span>{" "}
          {toolInput.monthlySpend > expectedCost * 1.1 && expectedCost > 0 && (
            <span className="text-amber-500 font-medium">
              ⚠ You may be overpaying
            </span>
          )}
        </p>
      )}

      {/* Warning if no plan selected */}
      {!toolInput.plan && (
        <p className="text-xs text-amber-500">
          ⚠ Please select a plan to continue
        </p>
      )}
    </div>
  );
}