import { TrendingDown } from "lucide-react";

interface HeroSavingsProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export default function HeroSavings({
  totalMonthlySavings,
  totalAnnualSavings,
}: HeroSavingsProps) {
  const isOptimal = totalMonthlySavings === 0;
  const isHighSavings = totalMonthlySavings >= 500;

  if (isOptimal) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
        <div className="text-4xl">✅</div>
        <h2 className="text-2xl font-bold text-emerald-800">
          You're spending well
        </h2>
        <p className="text-emerald-700 max-w-md mx-auto">
          Your AI tool stack is well-optimized for your team size and use
          case. No major inefficiencies found.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-8 text-center space-y-4 ${
        isHighSavings
          ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white"
          : "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200"
      }`}
    >
      <div className="flex justify-center">
        <TrendingDown
          size={40}
          className={
            isHighSavings ? "text-emerald-200" : "text-amber-500"
          }
        />
      </div>

      <div>
        <p
          className={`text-sm font-medium uppercase tracking-wide ${
            isHighSavings ? "text-emerald-200" : "text-amber-600"
          }`}
        >
          Potential monthly savings
        </p>
        <p
          className={`text-6xl font-bold mt-1 ${
            isHighSavings ? "text-white" : "text-amber-700"
          }`}
        >
          ${totalMonthlySavings.toLocaleString()}
        </p>
        <p
          className={`text-lg mt-1 ${
            isHighSavings ? "text-emerald-100" : "text-amber-600"
          }`}
        >
          ${totalAnnualSavings.toLocaleString()} per year
        </p>
      </div>

      {/* Credex CTA for high savings */}
      {isHighSavings && (
        <div className="bg-white/10 rounded-xl p-4 mt-2 text-left space-y-2">
          <p className="text-emerald-100 text-sm font-medium">
            💡 Want to capture even more savings?
          </p>
          <p className="text-emerald-200 text-sm">
            Credex sells discounted AI credits — Cursor, Claude, ChatGPT
            Enterprise — at substantial discounts.
          </p>
           <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 bg-white text-emerald-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Book a Credex consultation →
          </a>
        </div>
      )}
    </div>
  );
}