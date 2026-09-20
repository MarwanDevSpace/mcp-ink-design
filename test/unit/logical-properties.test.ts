import { describe, it, expect } from "vitest";
import { auditLogicalProperties } from "../../src/domain/bidi/logical-properties.js";

describe("CSS Logical Properties & Alignment Auditor", () => {
  it("flags physical margin-left and padding-right in CSS", () => {
    const physicalCss = `
      .card {
        margin-left: 1.5rem;
        padding-right: 2rem;
        text-align: left;
      }
    `;

    const report = auditLogicalProperties(physicalCss);
    expect(report.isFullyLogical).toBe(false);
    expect(report.findings.length).toBeGreaterThanOrEqual(3);
    const props = report.findings.map((f) => f.property);
    expect(props).toContain("margin-left");
    expect(props).toContain("padding-right");
    expect(props).toContain("text-align: left");
    expect(report.remediationSnippet).toContain("margin-inline-start");
  });

  it("passes clean CSS using modern logical properties", () => {
    const logicalCss = `
      .card {
        margin-inline: auto;
        padding-inline-start: 1.5rem;
        text-align: start;
      }
    `;

    const report = auditLogicalProperties(logicalCss);
    expect(report.isFullyLogical).toBe(true);
    expect(report.score).toBe(100);
    expect(report.findings.length).toBe(0);
  });

  it("detects bilingual content without bidi isolation", () => {
    const mixed = "<div>مرحبا بكم في عالم الـ Web Design المتطور</div>";
    const report = auditLogicalProperties(mixed);
    expect(report.isBilingual).toBe(true);
    expect(report.bidiIsolationPassed).toBe(false);
  });
});
