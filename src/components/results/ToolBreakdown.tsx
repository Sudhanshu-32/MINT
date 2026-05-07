import { ToolRecommendation } from "@/types";
import { PRICING_DATA } from "@/lib/pricingData";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  TrendingDown,
} from "lucide-react";

interface ToolBreakdownProps {
  recommendation: ToolRecommendation;
}

const severityConfig = {
  high: {
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    icon: <AlertCircle size={16} className="text-red-500" />,
    label: "High savings",
  },
  medium: {
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    icon: <AlertTriangle size={16} className="text-amber-500" />,
    label: "Medium savings",
  },
  low: {
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    icon: <TrendingDown size={16} className="text-blue-500" />,
    label: "Low savings",
  },
  optimal: {
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle size={16} className="text-emerald-500" />,
    label: "Optimal",
  },
};

export default function ToolBreakdown({ recommendation }: ToolBreakdownProps) {
  const config = severityConfig[recommendation.severity];
  const pricing = PRICING_DATA[recommendation.tool];
  const displayName = pricing?.displayName || recommendation.tool;
  const annualSavings = recommendation.monthlySavings * 12;

  return (
    <div className={`rounded-xl border p-5 space-y-3 ${config.color}`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="font-semibold text-slate-800">{displayName}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}
          >
            {config.label}
          </span>
        </div>
        {recommendation.monthlySavings > 0 && (
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-slate-800">
              −${recommendation.monthlySavings}/mo
            </p>
            <p className="text-xs text-slate-500">
              ${annualSavings}/yr saved
            </p>
          </div>
        )}
      </div>

      {/* Spend flow */}
      <div className="flex items-center gap-2 text-sm">
        <div className="bg-white rounded-lg px-3 py-1.5 border border-slate-200">
          <p className="text-xs text-slate-400">Current</p>
          <p className="font-semibold text-slate-700">
            ${recommendation.currentSpend}/mo
          </p>
          <p className="text-xs text-slate-400 capitalize">
            {recommendation.currentPlan} plan
          </p>
        </div>

        {recommendation.severity !== "optimal" && (
          <>
            <ArrowRight size={16} className="text-slate-400 shrink-0" />
            <div className="bg-white rounded-lg px-3 py-1.5 border border-slate-200">
              <p className="text-xs text-slate-400">Recommended</p>
              <p className="font-semibold text-emerald-600">
                ${recommendation.estimatedCost}/mo
              </p>
              <p className="text-xs text-slate-400">
                {recommendation.recommendedAction}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Reason */}
      <p className="text-sm text-slate-600 leading-relaxed">
        {recommendation.reason}
      </p>
    </div>
  );
}