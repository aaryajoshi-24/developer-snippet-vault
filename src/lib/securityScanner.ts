
export type SecurityFinding = {
  ruleId: string;
  title: string;
  severity: "high" | "medium";
  line: number;
  message: string;
  recommendation: string;
};

export function scanCode(code: string): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const lines = code.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (
      /\b(api[_-]?key|access[_-]?token|secret[_-]?key)\b\s*[:=]\s*["'][^"']{8,}["']/i.test(line)
    ) {
      findings.push({
        ruleId: "HARDCODED_SECRET",
        title: "Possible hardcoded secret",
        severity: "high",
        line: index + 1,
        message: "A possible API key or secret is hardcoded.",
        recommendation: "Use an environment variable or secret manager.",
      });
    }

    if (
      /\b(password|passwd|pwd)\b\s*[:=]\s*["'][^"']{4,}["']/i.test(line)
    ) {
      findings.push({
        ruleId: "HARDCODED_PASSWORD",
        title: "Possible hardcoded password",
        severity: "high",
        line: index + 1,
        message: "A possible password is hardcoded.",
        recommendation: "Store passwords securely outside source code.",
      });
    }

    if (
      /\b(mysql|postgres(?:ql)?):\/\/[^/\s:@]+:[^/\s@]+@/i.test(line)
    ) {
      findings.push({
        ruleId: "DATABASE_CREDENTIALS",
        title: "Possible database credentials",
        severity: "high",
        line: index + 1,
        message: "A database URL may contain credentials.",
        recommendation: "Use a secure environment variable for the database URL.",
      });
    }

    if (/http:\/\//i.test(line) && !/localhost|127\.0\.0\.1/i.test(line)) {
      findings.push({
        ruleId: "HTTP_WITHOUT_TLS",
        title: "Possible insecure HTTP URL",
        severity: "medium",
        line: index + 1,
        message: "The URL uses HTTP instead of HTTPS.",
        recommendation: "Use HTTPS where secure transport is required.",
      });
    }
  });

  return findings;
}
