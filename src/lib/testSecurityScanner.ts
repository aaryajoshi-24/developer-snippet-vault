
import { scanCode } from "./securityScanner";

const sampleCode = `
const api_key = "FAKE_TEST_KEY_123456";
const password = "demoPassword123";
const database = "mysql://demo:fakepass@localhost/mydb";
`;

const findings = scanCode(sampleCode);

console.log("Security Scanner Test");
console.log("---------------------");
console.log("Findings detected:", findings.length);

for (const finding of findings) {
  console.log(
    `[${finding.severity.toUpperCase()}] Line ${finding.line}: ${finding.title}`
  );
  console.log("Recommendation:", finding.recommendation);
}

if (
  findings.some((finding) => finding.ruleId === "HARDCODED_SECRET") &&
  findings.some((finding) => finding.ruleId === "HARDCODED_PASSWORD") &&
  findings.some((finding) => finding.ruleId === "DATABASE_CREDENTIALS")
) {
  console.log("\nPASS: All three test patterns were detected.");
} else {
  console.log("\nFAIL: One or more test patterns were missed.");
  process.exitCode = 1;
}
