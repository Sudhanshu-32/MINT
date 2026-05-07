import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LeadModel from "@/models/Lead";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, auditId, companyName, role, teamSize, totalMonthlySavings } =
      body;

    // Honeypot check — bots fill this field, humans don't see it
    if (body.website) {
      return NextResponse.json({ success: true }); // silently ignore
    }

    if (!email || !auditId) {
      return NextResponse.json(
        { error: "Email and audit ID are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for duplicate lead
    const existing = await LeadModel.findOne({ email, auditId });
    if (existing) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    await LeadModel.create({
      auditId,
      email,
      companyName,
      role,
      teamSize,
      totalMonthlySavings,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 }
    );
  }
}