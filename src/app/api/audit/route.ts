import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AuditModel from "@/models/Audit";
import { runAudit } from "@/lib/auditEngine";
import { FormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: FormData = await req.json();

    // Basic validation
    if (!body.tools || body.tools.length === 0) {
      return NextResponse.json(
        { error: "At least one tool is required" },
        { status: 400 }
      );
    }

    if (!body.teamSize || !body.useCase) {
      return NextResponse.json(
        { error: "Team size and use case are required" },
        { status: 400 }
      );
    }

    // Run the audit engine
    const auditResult = runAudit(body);

    // Save to MongoDB
    await connectDB();
    await AuditModel.create(auditResult);

    return NextResponse.json(auditResult, { status: 201 });
  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json(
      { error: "Failed to create audit" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Audit ID required" },
        { status: 400 }
      );
    }

    await connectDB();
    const audit = await AuditModel.findOne({ id });

    if (!audit) {
      return NextResponse.json(
        { error: "Audit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(audit);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit" },
      { status: 500 }
    );
  }
}