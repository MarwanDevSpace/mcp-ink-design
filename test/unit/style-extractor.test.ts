import { describe, it, expect } from "vitest";
import { inspectDesignStyle } from "../../src/domain/inspection/style-extractor.js";

describe("Style Extractor & Reverse-Engineering", () => {
  it("extracts colors, fonts, and detects glassmorphism from code snippet", () => {
    const code = `
      :root {
        --surface: #0b0f19;
        --accent: #38bdf8;
      }
      body {
        font-family: 'Cairo', 'Outfit', sans-serif;
      }
      .card {
        backdrop-filter: blur(16px);
      }
    `;

    const report = inspectDesignStyle(code);
    expect(report.colors).toContain("#0b0f19");
    expect(report.colors).toContain("#38bdf8");
    expect(report.fonts).toContain("Cairo");
    expect(report.hasGlassmorphism).toBe(true);
    expect(report.hasArabicTypography).toBe(true);
    expect(report.upgradeBlueprint.bgSurfaceOklch).toContain("oklch(");
  });
});
