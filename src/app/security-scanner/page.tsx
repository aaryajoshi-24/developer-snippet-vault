
"use client";

import { useState } from "react";
import { scanCode } from "@/lib/securityScanner";
import type { SecurityFinding } from "@/lib/securityScanner";
import SecurityScanResults from "@/components/SecurityScanResults";

export default function SecurityScannerPage() {
  const [code, setCode] = useState("");
  const [findings, setFindings] = useState<SecurityFinding[] | null>(null);

  function handleScan() {
    setFindings(scanCode(code));
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Code Security Scanner</h1>
        <p className="mt-2 text-gray-600">
          Check code for potential hardcoded secrets, passwords, and
          database credentials.
        </p>
      </div>

      <div className="space-y-3">
        <label htmlFor="code-input" className="block font-medium">
          Paste your code
        </label>

        <textarea
          id="code-input"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder={'const api_key = "FAKE_TEST_KEY_123456";'}
          className="min-h-64 w-full rounded-xl border p-4 font-mono text-sm"
          spellCheck={false}
        />

        <button
          type="button"
          onClick={handleScan}
          disabled={!code.trim()}
          className="rounded-lg bg-black px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Scan Code
        </button>
      </div>

      {findings !== null && (
        <SecurityScanResults findings={findings} />
      )}
    </main>
  );
}
