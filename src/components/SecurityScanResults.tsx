
"use client";

import type { SecurityFinding } from "@/lib/securityScanner";

type Props = {
  findings: SecurityFinding[];
};

export default function SecurityScanResults({ findings }: Props) {
  if (findings.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
        <h3 className="font-semibold">No issues detected</h3>
        <p className="mt-1 text-sm">
          The scanner did not find any patterns covered by its current rules.
          This does not guarantee that the code is secure.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">
        Security Findings ({findings.length})
      </h3>

      {findings.map((finding, index) => (
        <div
          key={`${finding.ruleId}-${finding.line}-${index}`}
          className="rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-semibold text-red-900">
              {finding.title}
            </h4>

            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase text-red-800">
              {finding.severity}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-700">
            Line {finding.line}: {finding.message}
          </p>

          <p className="mt-2 text-sm text-gray-800">
            <strong>Recommendation:</strong> {finding.recommendation}
          </p>
        </div>
      ))}
    </div>
  );
}
