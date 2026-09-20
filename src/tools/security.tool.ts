import {
  SecurityAuditInput,
  SecurityAuditInputSchema,
  SecurityAuditOutputSchema,
  ReadOnlyAnnotations
} from "../contracts/index.js";
import { auditCodeSecurity } from "../domain/security/security-engine.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const securityTool = {
  name: "ink_audit_security",
  title: "Audit Frontend Code Security & Headers",
  description:
    "PURPOSE: Audit frontend and full-stack web code for client-side security vulnerabilities (DOM XSS, eval/Function sinks, innerHTML execution, plain-text token storage in localStorage, missing security headers, and strict CSP generation).\n\nBEHAVIOR: Executes AST and regex static security scanning in-memory. Purely read-only; never executes or mutates the audited code, and never transmits source code over external networks. Emits severity ratings (critical, high, medium, low) and exact code remediations.\n\nUSAGE GUIDELINES:\n- When to use: Use prior to deployment or code review to ensure zero client-side injection vulnerabilities, secure token handling, and robust Content-Security-Policy headers.\n- When NOT to use: Do NOT use to validate CSS aesthetic quality, color contrast, or fluid typography rules (use ink_validate_design instead), nor for external URL penetration testing.\n- Alternatives: Use ink_validate_design for design system, contrast, and bidi compliance checks; use ink_run_python_tests for Python AST test suites.\n\nRETURNS: ResultEnvelope containing 'securityScore', pass/fail boolean, structured 'findings' array with line numbers and remediations, recommended 'recommendedCspHeader', and safe authentication storage patterns.",
  annotations: ReadOnlyAnnotations,
  inputSchema: SecurityAuditInputSchema,
  outputSchema: SecurityAuditOutputSchema,
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
