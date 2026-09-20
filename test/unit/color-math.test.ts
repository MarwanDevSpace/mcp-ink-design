import { describe, it, expect } from "vitest";
import {
  parseHexToRgb,
  calculateContrastRatio,
  calculateRelativeLuminance,
  createOklch
} from "../../src/domain/design-tokens/color-math.js";

describe("Color Math & Contrast Engine", () => {
  it("parses 3-digit and 6-digit hex colors correctly", () => {
    const white3 = parseHexToRgb("#fff");
    expect(white3).toEqual({ r: 255, g: 255, b: 255 });

    const black6 = parseHexToRgb("#000000");
    expect(black6).toEqual({ r: 0, g: 0, b: 0 });

    const custom = parseHexToRgb("#38bdf8");
    expect(custom.r).toBe(56);
    expect(custom.g).toBe(189);
    expect(custom.b).toBe(248);
  });

  it("calculates relative luminance per WCAG specifications", () => {
    const whiteLum = calculateRelativeLuminance({ r: 255, g: 255, b: 255 });
    const blackLum = calculateRelativeLuminance({ r: 0, g: 0, b: 0 });

    expect(whiteLum).toBeCloseTo(1.0, 3);
    expect(blackLum).toBeCloseTo(0.0, 3);
  });

  it("calculates exact 21:1 contrast ratio for pure black on white", () => {
    const res = calculateContrastRatio("#ffffff", "#000000");
    expect(res.ratio).toBe(21.0);
    expect(res.grade).toBe("AAA");
    expect(res.normalTextAAA).toBe(true);
    expect(res.uiComponentAA).toBe(true);
  });

  it("flags failing contrast for low-contrast grey combinations", () => {
    const res = calculateContrastRatio("#777777", "#888888");
    expect(res.ratio).toBeLessThan(3.0);
    expect(res.grade).toBe("Fail");
    expect(res.normalTextAA).toBe(false);
  });

  it("creates valid OKLCH color representations with clamped values", () => {
    const oklch = createOklch(0.85, 0.18, 220);
    expect(oklch.l).toBe(0.85);
    expect(oklch.c).toBe(0.18);
    expect(oklch.h).toBe(220);
    expect(oklch.cssString).toBe("oklch(0.85 0.18 220)");
  });
});
