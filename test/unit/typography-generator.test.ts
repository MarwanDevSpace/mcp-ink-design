import { describe, it, expect } from "vitest";
import {
  generateFluidClamp,
  generateTypographySystem
} from "../../src/domain/design-tokens/typography-generator.js";

describe("Fluid Typography Generator", () => {
  it("computes standard clamp() formula without NaN or infinities", () => {
    const clamp = generateFluidClamp(20, 36, 360, 1440);
    expect(clamp).toMatch(/^clamp\(\d+(\.\d+)?rem,\s*-?\d+(\.\d+)?rem\s*\+\s*\d+(\.\d+)?vw,\s*\d+(\.\d+)?rem\)$/);
  });

  it("generates a complete optical typography scale with font families", () => {
    const system = generateTypographySystem("modern-editorial");
    expect(system.scaleName).toBe("modern-editorial");
    expect(system.steps.display).toBeDefined();
    expect(system.steps.display.clampCss).toContain("clamp(");
    expect(system.steps.h1.lineHeight).toBeLessThanOrEqual(1.2);
    expect(system.steps.body.lineHeight).toBeGreaterThanOrEqual(1.5);
    expect(system.cssVariables).toContain("--ink-font-display");
    expect(system.cssVariables).toContain("--ink-text-display");
  });
});
