/**
 * Frontend & Fullstack Web Security Engine
 * Audits code against OWASP client-side threats, generates CSP headers, and structures Auth flows.
 */

export interface SecurityFinding {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: string;
  message: string;
  line?: number;
  snippet?: string;
  remediation: string;
}

export interface SecurityAuditResult {
  passed: boolean;
  score: number; // 0 - 100
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  findings: SecurityFinding[];
  recommendedCspHeader: string;
  recommendedAuthPattern: {
    accessTokenStorage: string;
    refreshTokenStorage: string;
    csrfProtection: string;
  };
}

export function auditCodeSecurity(sourceCode: string): SecurityAuditResult {
  const findings: SecurityFinding[] = [];
  const lines = sourceCode.split("\n");

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Rule: DOM XSS via innerHTML / outerHTML
    if (/(?:\.innerHTML|\.outerHTML)\s*=\s*(?!['"][^'"]*['"])/i.test(line)) {
      findings.push({
        id: "SEC-DOM-001",
        severity: "HIGH",
        category: "DOM XSS",
        message: "Dynamic assignment to innerHTML/outerHTML detected.",
        line: lineNum,
        snippet: line.trim().slice(0, 100),
        remediation: "Use element.textContent or sanitize using DOMPurify.sanitize()."
      });
    }

    // Rule: eval() or new Function()
    if (/\b(?:eval|Function)\s*\(/i.test(line)) {
      findings.push({
        id: "SEC-DOM-002",
        severity: "CRITICAL",
        category: "Code Injection",
        message: "Use of eval() or dynamic Function constructor.",
        line: lineNum,
        snippet: line.trim().slice(0, 100),
        remediation: "Eliminate dynamic code execution. Parse data strictly with JSON.parse()."
      });
    }

    // Rule: document.write()
    if (/document\.write\s*\(/i.test(line)) {
      findings.push({
        id: "SEC-DOM-003",
        severity: "HIGH",
        category: "DOM XSS",
        message: "document.write() is obsolete and vulnerable to XSS.",
        line: lineNum,
        snippet: line.trim().slice(0, 100),
        remediation: "Use standard modern DOM insertion methods like appendChild() or insertAdjacentElement()."
      });
    }

    // Rule: Insecure token storage in localStorage
    if (/localStorage\.setItem\s*\(\s*['"][^'"]*(?:token|jwt|access|refresh|auth|secret)[^'"]*['"]/i.test(line)) {
      findings.push({
        id: "SEC-AUTH-001",
        severity: "MEDIUM",
        category: "Authentication Storage",
        message: "Sensitive auth tokens stored in localStorage can be stolen via any XSS vulnerability.",
        line: lineNum,
        snippet: line.trim().slice(0, 100),
        remediation: "Store Refresh Tokens in HttpOnly, Secure, SameSite=Strict cookies. Keep Access Tokens in memory."
      });
    }

    // Rule: reverse tabnabbing
    if (/<a\b[^>]*target=["']_blank["'](?![^>]*rel=["'][^"']*noopener)/i.test(line)) {
      findings.push({
        id: "SEC-HTML-001",
        severity: "MEDIUM",
        category: "Reverse Tabnabbing",
        message: "target='_blank' link lacks rel='noopener noreferrer'.",
        line: lineNum,
        snippet: line.trim().slice(0, 100),
        remediation: "Always add rel='noopener noreferrer' to external links."
      });
    }
  });

  const criticalCount = findings.filter((f) => f.severity === "CRITICAL").length;
  const highCount = findings.filter((f) => f.severity === "HIGH").length;
  const mediumCount = findings.filter((f) => f.severity === "MEDIUM").length;

  let score = 100 - criticalCount * 30 - highCount * 15 - mediumCount * 5;
  score = Math.max(0, Math.min(100, score));

  const passed = criticalCount === 0 && highCount === 0;

  const recommendedCspHeader = [
    "default-src 'self'",
    "script-src 'self' 'nonce-{RANDOM}' https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join("; ");

  return {
    passed,
    score,
    criticalCount,
    highCount,
    mediumCount,
    findings,
    recommendedCspHeader,
    recommendedAuthPattern: {
      accessTokenStorage: "In-memory variable or closure (short-lived 5-15 mins)",
      refreshTokenStorage: "HttpOnly, Secure, SameSite=Strict Cookie",
      csrfProtection: "SameSite cookies + Custom Header (e.g. X-Requested-With or CSRF token)"
    }
  };
}
