import { describe, it, expect } from "vitest";
import { auditCodeSecurity } from "../../src/domain/security/security-engine.js";

describe("Security Engine", () => {
  it("flags dynamic innerHTML, eval, and insecure localStorage tokens", () => {
    const malicious = `
      function render(data) {
        document.getElementById('root').innerHTML = data;
        eval('window.__state = ' + data);
        localStorage.setItem('auth_token', 'secret123');
      }
    `;

    const report = auditCodeSecurity(malicious);
    expect(report.passed).toBe(false);
    expect(report.criticalCount).toBeGreaterThanOrEqual(1);
    expect(report.highCount).toBeGreaterThanOrEqual(1);
    expect(report.mediumCount).toBeGreaterThanOrEqual(1);
    expect(report.score).toBeLessThan(60);

    const ids = report.findings.map((f) => f.id);
    expect(ids).toContain("SEC-DOM-001");
    expect(ids).toContain("SEC-DOM-002");
    expect(ids).toContain("SEC-AUTH-001");
  });

  it("passes clean code with high score and recommended CSP header", () => {
    const clean = `
      function renderSafe(data) {
        const el = document.getElementById('root');
        el.textContent = data.title;
      }
    `;

    const report = auditCodeSecurity(clean);
    expect(report.passed).toBe(true);
    expect(report.score).toBe(100);
    expect(report.findings.length).toBe(0);
    expect(report.recommendedCspHeader).toContain("default-src 'self'");
    expect(report.recommendedAuthPattern.refreshTokenStorage).toContain("HttpOnly");
  });
});
