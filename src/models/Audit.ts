import mongoose, { Schema } from "mongoose";

const ToolInputSchema = new Schema({
  tool: String,
  plan: String,
  monthlySpend: Number,
  seats: Number,
});

const RecommendationSchema = new Schema({
  tool: String,
  currentPlan: String,
  currentSpend: Number,
  recommendedAction: String,
  recommendedPlan: String,
  estimatedCost: Number,
  monthlySavings: Number,
  reason: String,
  severity: String,
});

const AuditSchema = new Schema({
  id: { type: String, required: true, unique: true },
  formData: {
    tools: [ToolInputSchema],
    teamSize: Number,
    useCase: String,
  },
  recommendations: [RecommendationSchema],
  totalMonthlySavings: Number,
  totalAnnualSavings: Number,
  summary: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Audit ||
  mongoose.model("Audit", AuditSchema);