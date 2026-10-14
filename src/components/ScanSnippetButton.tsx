
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
    <div className="mt-4">
      <button
        type="button"
        onClick={handleScan}
        className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
      >
        <span aria-hidden="true">🛡️ </span>
        Scan for Security Issues
      </button>

      {showResults && findings !== null && (
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => setShowResults(false)}
            className="text-sm font-medium text-gray-600 underline"
          >
            Hide scan results
          </button>

          <SecurityScanResults findings={findings} />
        </div>
      )}
    </div>
  );
}
