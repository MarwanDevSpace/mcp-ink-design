import { describe, it, expect } from "vitest";
import { generatePalette } from "../../src/domain/design-tokens/palette-generator.js";

describe("Palette Generator & Design Tokens", () => {
  it("generates editorial palette with valid OKLCH tokens and high contrast", () => {
    const palette = generatePalette("editorial");
    expect(palette.mood).toBe("editorial");
    expect(palette.tokens.bgSurface.cssString).toContain("oklch(");
    expect(palette.tokens.textPrimary.cssString).toContain("oklch(");
    expect(palette.tokens.accentPrimary.cssString).toContain("oklch(");
    expect(palette.contrastAnalysis.primaryTextOnBg.ratio).toBeGreaterThanOrEqual(7.0);
    expect(palette.contrastAnalysis.primaryTextOnBg.passed).toBe(true);
    expect(palette.cssVariables).toContain("--ink-bg-surface");
    expect(palette.cssVariables).toContain("--ink-shadow-glow");
  });

  it("supports all required mood styles", () => {
    const moods = ["editorial", "cyber-tactile", "neo-brutalist", "luxury-dark", "organic-modern"] as const;
    for (const mood of moods) {
      const p = generatePalette(mood);
      expect(p.mood).toBe(mood);
      expect(p.tokens.bgSurface).toBeDefined();
      expect(p.tokens.textPrimary).toBeDefined();
    }
  });

  it("allows custom base hue overrides", () => {
    const p = generatePalette("bespoke", 310);
    expect(p.baseHue).toBe(310);
    expect(p.tokens.bgSurface.h).toBe(310);
  });
});
