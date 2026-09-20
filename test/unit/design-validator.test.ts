import { describe, it, expect } from "vitest";
import { validateDesignCraft } from "../../src/domain/verification/design-validator.js";

describe("Design Craft & Anti-Slop Validator", () => {
  it("penalizes generic AI indigo/violet gradient tropes", () => {
    const slop = `
      .card {
        background: linear-gradient(135deg, #6366f1, #a855f7);
        font-size: 16px;
      }
    `;

    const report = validateDesignCraft(slop);
    expect(report.antiSlopChecks.noGenericGradients).toBe(false);
    expect(report.score).toBeLessThan(70);
    expect(report.remediationAdvice.some((r) => r.includes("gradient"))).toBe(true);
  });

  it("rewards fluid clamp typography, layered shadows, and semantic HTML", () => {
    const bespoke = `
      <header><nav></nav></header>
      <main>
        <section style="font-size: clamp(1rem, 2vw, 2.5rem); box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);">
        </section>
      </main>
      <footer></footer>
    `;

    const report = validateDesignCraft(bespoke);
    expect(report.antiSlopChecks.usesFluidTypography).toBe(true);
    expect(report.antiSlopChecks.hasLayeredShadows).toBe(true);
    expect(report.antiSlopChecks.hasSemanticHtml).toBe(true);
    expect(report.score).toBeGreaterThanOrEqual(85);
    expect(["S", "A"]).toContain(report.grade);
  });
});
