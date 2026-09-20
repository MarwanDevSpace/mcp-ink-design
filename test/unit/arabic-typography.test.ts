import { describe, it, expect } from "vitest";
import { generateArabicTypography } from "../../src/domain/bidi/arabic-typography.js";

describe("Arabic Typography & Optical Sizing", () => {
  it("generates IBM Plex Sans Arabic scale with elevated line heights", () => {
    const scale = generateArabicTypography("ibm-plex");
    expect(scale.style).toBe("ibm-plex");
    expect(scale.fontFamilies.primary).toContain("IBM Plex Sans Arabic");
    expect(scale.googleFontsLink).toContain("family=IBM+Plex+Sans+Arabic");
    // Arabic body line-height must be compensated higher (>= 1.7)
    expect(scale.steps.body.lineHeight).toBeGreaterThanOrEqual(1.7);
    expect(scale.steps.display.clampCss).toContain("clamp(");
    expect(scale.cssVariables).toContain("--ink-font-ar-primary");
    expect(scale.cssVariables).toContain('[dir="rtl"]');
  });

  it("supports Cairo Display and Amiri Editorial font styles", () => {
    const cairo = generateArabicTypography("cairo-display");
    expect(cairo.fontFamilies.primary).toContain("Cairo");

    const amiri = generateArabicTypography("amiri-editorial");
    expect(amiri.fontFamilies.primary).toContain("Amiri");
  });
});
