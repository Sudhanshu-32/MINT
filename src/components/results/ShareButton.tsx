"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShareButton({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      className="flex-1 gap-2 rounded-xl border-slate-200"
    >
      {copied ? (
        <>
          <Check size={16} className="text-emerald-500" />
          Link copied!
        </>
      ) : (
        <>
          <Share2 size={16} />
          Share this audit
        </>
      )}
    </Button>
  );
}