import { Zap } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-emerald-600 rounded-lg p-1.5">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg">Mint</span>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
            Free
          </span>
        </Link>
        <div className="flex items-center gap-4">
         
          <Link
            href="/"
            className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            New audit →
          </Link>
        </div>
      </div>
    </nav>
  );
}