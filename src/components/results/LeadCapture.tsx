"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

interface LeadCaptureProps {
  auditId: string;
  totalMonthlySavings: number;
  teamSize: number;
}

export default function LeadCapture({
  auditId,
  totalMonthlySavings,
  teamSize,
}: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Honeypot field — hidden from humans, bots fill it
  const [website, setWebsite] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          auditId,
          companyName,
          role,
          teamSize,
          totalMonthlySavings,
          website, // honeypot
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
        <CheckCircle size={40} className="text-emerald-500 mx-auto" />
        <h3 className="text-xl font-bold text-emerald-800">
          Report sent to your inbox!
        </h3>
        <p className="text-emerald-700 text-sm">
          {totalMonthlySavings >= 500
            ? "Our team will reach out about Credex credits — the fastest way to capture these savings."
            : "We'll notify you when new optimizations apply to your stack."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Mail size={20} className="text-slate-500" />
        <h3 className="font-semibold text-slate-800">
          {totalMonthlySavings >= 500
            ? "Get your full report + Credex savings plan"
            : "Get notified when new optimizations apply"}
        </h3>
      </div>

      <p className="text-sm text-slate-500">
        {totalMonthlySavings >= 500
          ? `You have $${totalMonthlySavings}/mo in savings opportunities. We'll send the full breakdown and connect you with Credex.`
          : "Your stack looks good. Drop your email and we'll let you know when better options emerge for your tools."}
      </p>

      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ display: "none" }}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs text-slate-500">
            Work email <span className="text-red-400">*</span>
          </Label>
          <Input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">
              Company (optional)
            </Label>
            <Input
              placeholder="Acme Inc"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Role (optional)</Label>
            <Input
              placeholder="CTO / Founder"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Sending...
            </>
          ) : (
            "Send me the report →"
          )}
        </Button>

        <p className="text-xs text-slate-400 text-center">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}