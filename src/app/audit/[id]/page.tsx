import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import AuditModel from "@/models/Audit";
import HeroSavings from "@/components/results/HeroSavings";
import ToolBreakdown from "@/components/results/ToolBreakdown";
import LeadCapture from "@/components/results/LeadCapture";
import ShareButton from "@/components/results/ShareButton";
import { AuditResult } from "@/types";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const audit = await AuditModel.findOne({ id }).lean();

  if (!audit) notFound();

  const a = audit as unknown as AuditResult;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/audit/${id}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">

        {/* Header */}
        <div className="text-center space-y-1">
          <p className="text-sm text-slate-400">Your AI Spend Audit</p>
          <h1 className="text-3xl font-bold text-slate-900">
            Audit Results
          </h1>
          <p className="text-slate-500 text-sm">
            {a.formData.teamSize}-person team ·{" "}
            {a.formData.useCase} focus ·{" "}
            {a.recommendations.length} tools audited
          </p>
        </div>

        {/* Hero savings */}
        <HeroSavings
          totalMonthlySavings={a.totalMonthlySavings}
          totalAnnualSavings={a.totalAnnualSavings}
        />

        {/* AI Summary */}
{a.summary ? (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
    <p className="text-xs font-medium text-blue-500 uppercase tracking-wide mb-2">
      AI Analysis
    </p>
    <p className="text-slate-700 text-sm leading-relaxed">
      {a.summary}
    </p>
  </div>
) : (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
    <p className="text-xs font-medium text-blue-500 uppercase tracking-wide mb-2">
      AI Analysis
    </p>
    <p className="text-slate-400 text-sm italic">
      Generating your personalized summary...
    </p>
  </div>
)}

        {/* Per tool breakdown */}
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-700">
            Tool breakdown
          </h2>
          {a.recommendations.map((rec, i) => (
            <ToolBreakdown key={i} recommendation={rec} />
          ))}
        </div>

        {/* Lead capture */}
        <LeadCapture
          auditId={id}
          totalMonthlySavings={a.totalMonthlySavings}
          teamSize={a.formData.teamSize}
        />

        {/* Share + new audit */}
        <div className="flex flex-col sm:flex-row gap-3">
          <ShareButton shareUrl={shareUrl} />
           <a
            href="/"
            className="flex-1 text-center border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl py-3 text-sm font-medium transition-colors"
          >
            ← Run another audit
          </a>
        </div>

        <p className="text-center text-xs text-slate-400">
          Audit ID: {id} · Powered by Mint
        </p>

      </div>
    </main>
  );
}