
"use client";

import { useState } from "react";
import { scanCode } from "@/lib/securityScanner";
import SecurityScanResults from "@/components/SecurityScanResults";
import type { SecurityFinding } from "@/lib/securityScanner";

type Props = {
  code: string;
};

export default function ScanSnippetButton({ code }: Props) {
  const [findings, setFindings] = useState<SecurityFinding[] | null>(null);
  const [showResults, setShowResults] = useState(false);

  function handleScan() {
    setFindings(scanCode(code));
    setShowResults(true);
  }

  return (
    <div className="border-t border-white/10 bg-[#0f1d18] px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleScan}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/20 hover:border-emerald-400/40 transition active:scale-95"
        >
          <span aria-hidden="true">🛡️</span>
          <span>Scan Secrets</span>
        </button>

        {showResults && (
          <button
            type="button"
            onClick={() => setShowResults(false)}
            className="text-xs text-emerald-200/70 hover:text-emerald-100 underline transition"
          >
            Hide results
          </button>
        )}
      </div>

      {showResults && findings !== null && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <SecurityScanResults findings={findings} />
        </div>
      )}
    </div>
  );
}
