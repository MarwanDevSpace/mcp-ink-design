import { describe, it, expect } from "vitest";
import { generateCustomFontImports } from "../../src/domain/assets/font-importer.js";

describe("Dynamic Font Importer & Custom Assets", () => {
  it("generates Google Fonts HTML link tags and CSS import rule for Cairo and Outfit", () => {
    const res = generateCustomFontImports({
      primaryFont: "Cairo",
      displayFont: "Outfit",
      weights: [400, 600, 700]
    });

    expect(res.htmlLinkTags).toContain("fonts.googleapis.com");
    expect(res.htmlLinkTags).toContain("family=Cairo:wght@400;600;700");
    expect(res.htmlLinkTags).toContain("family=Outfit:wght@400;600;700");
    expect(res.cssImportRule).toContain("@import url(");
    expect(res.cssVariables).toContain("--ink-font-body: 'Cairo'");
    expect(res.cssVariables).toContain("--ink-font-display: 'Outfit'");
    expect(res.opticalLineHeightRecommendation).toBeGreaterThanOrEqual(1.7);
  });
});
