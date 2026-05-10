import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import LeadModel from "@/models/Lead";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      email,
      auditId,
      companyName,
      role,
      teamSize,
      totalMonthlySavings,
    } = body;

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ success: true });
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

    // Check for duplicate
    const existing = await LeadModel.findOne({ email, auditId });
    if (existing) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    // Save lead
    await LeadModel.create({
      auditId,
      email,
      companyName,
      role,
      teamSize,
      totalMonthlySavings,
      createdAt: new Date(),
    });

    // Send confirmation email
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const auditUrl = `${baseUrl}/audit/${auditId}`;
    const isHighSavings = totalMonthlySavings >= 500;

    await resend.emails.send({
      from: "Mint Audit <onboarding@resend.dev>",
      to: email,
      subject: isHighSavings
        ? `Your audit found $${totalMonthlySavings}/mo in savings`
        : "Your AI spend audit is ready",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #0f172a; font-size: 24px;">
            ${isHighSavings
              ? `💰 You could save $${totalMonthlySavings}/mo on AI tools`
              : "✅ Your AI stack looks optimized"
            }
          </h1>
          <p style="color: #475569; font-size: 16px;">
            ${isHighSavings
              ? `We found $${totalMonthlySavings}/month ($${totalMonthlySavings * 12}/year) in potential savings for your team.`
              : "Good news — your AI tool spend looks well optimized for your team size and use case."
            }
          </p>
          <a
            href="${auditUrl}"
            style="display: inline-block; background: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;"
          >
            View your full audit →
          </a>
          ${isHighSavings ? `
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin-top: 16px;">
            <p style="color: #166534; font-weight: 600; margin: 0 0 8px;">
              Want to capture these savings?
            </p>
            <p style="color: #15803d; margin: 0 0 12px;">
              Credex sells discounted AI credits at substantial discounts.
              Our team will reach out within 24 hours.
            </p>
            <a href="https://credex.rocks" style="color: #059669; font-weight: 600;">
              Learn about Credex →
            </a>
          </div>
          ` : ""}
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
            Powered by Mint · Free AI Spend Audit Tool
          </p>
        </div>
      `,
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