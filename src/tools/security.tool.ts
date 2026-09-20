/**
 * Tool: ink_security_audit
 * Audits code against OWASP client-side threats, DOM XSS, and security headers.
 */

import { SecurityAuditInput, SecurityAuditInputSchema } from "../contracts/index.js";
import { auditCodeSecurity } from "../domain/security/security-engine.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const securityTool = {
  name: "ink_security_audit",
  title: "Audit Web Code Security & Auth Patterns",
  description:
    "Audit frontend/fullstack code for DOM XSS, dangerous sinks (eval, innerHTML), auth token storage risks, missing security headers, and CSP recommendations.",
  inputSchema: SecurityAuditInputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: SecurityAuditInput = SecurityAuditInputSchema.parse(rawInput);
    const auditResult = auditCodeSecurity(input.code);

    const summary = auditResult.passed
      ? `Security audit passed for ${input.filename} (Score: ${auditResult.score}/100, 0 critical/high findings).`
      : `Security audit flagged ${auditResult.criticalCount} critical and ${auditResult.highCount} high findings in ${input.filename} (Score: ${auditResult.score}/100).`;

    return createSuccessEnvelope(
      summary,
      {
        filename: input.filename,
        passed: auditResult.passed,
        securityScore: auditResult.score,
        findingsSummary: {
          critical: auditResult.criticalCount,
          high: auditResult.highCount,
          medium: auditResult.mediumCount,
          total: auditResult.findings.length
        },
        findings: auditResult.findings,
        recommendedCspHeader: auditResult.recommendedCspHeader,
        recommendedAuthPattern: auditResult.recommendedAuthPattern
      },
      {
        warnings: auditResult.passed ? [] : ["Resolve critical and high security findings before deploying to production."],
        nextActions: auditResult.passed
          ? ["Apply the recommended CSP header to your server or meta tag."]
          : ["Replace innerHTML with textContent or DOMPurify.", "Remove dynamic eval/Function execution."]
      }
    );
  }
};
