import mongoose, { Schema } from "mongoose";

const LeadSchema = new Schema({
  auditId: { type: String, required: true },
  email: { type: String, required: true },
  companyName: String,
  role: String,
  teamSize: Number,
  totalMonthlySavings: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lead ||
  mongoose.model("Lead", LeadSchema);