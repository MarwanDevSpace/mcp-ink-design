import {
  ImportCustomAssetsInput,
  ImportCustomAssetsInputSchema,
  ImportCustomAssetsOutputSchema,
  ReadOnlyAnnotations
} from "../contracts/index.js";
import { generateCustomFontImports } from "../domain/assets/font-importer.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const assetsTool = {
  name: "ink_import_custom_assets",
  title: "Import & Configure Web Fonts and Assets",
  description:
    "PURPOSE: Dynamically configure and generate Google Fonts preconnect tags, CSS @import rules, optical line-height variables, and accessible font fallbacks for multilingual Arabic and Latin projects.\n\nBEHAVIOR: Generates HTML link tags, CSS @import rules, and stylesheet font-family declarations purely in-memory. Does not download font binaries or write files to disk directly. Formulates tailored optical line-height variables (1.7-1.85 for Arabic, 1.5-1.6 for Latin) to eliminate clipping.\n\nUSAGE GUIDELINES:\n- When to use: Call when setting up web fonts, adding Arabic typographic scales, or loading bespoke font families into a project.\n- When NOT to use: Do NOT use to synthesize fluid clamp font-size scales (use ink_generate_palette_tokens instead) or to scaffold an entire project (use ink_create_base instead).\n- Alternatives: Use ink_generate_palette_tokens for fluid typography size scales; use ink_create_base for full HTML document scaffolding.\n\nRETURNS: ResultEnvelope containing 'htmlLinkTags', 'cssImportRule', 'cssVariables' with font-family definitions, and an accessible 'fallbackStack'.",
  annotations: ReadOnlyAnnotations,
  inputSchema: ImportCustomAssetsInputSchema,
  outputSchema: ImportCustomAssetsOutputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: ImportCustomAssetsInput = ImportCustomAssetsInputSchema.parse(rawInput);
    const result = generateCustomFontImports({
      primaryFont: input.primaryFont,
      displayFont: input.displayFont,
      weights: input.weights,
      includeArabic: input.includeArabic
    });

    return createSuccessEnvelope(
      `Configured dynamic font assets for: ${input.primaryFont}${input.displayFont ? ` + ${input.displayFont}` : ""}.`,
      result,
      {
        nextActions: [
          "Place the HTML link tags inside your <head> element.",
          "Add the generated CSS variables into your stylesheet :root block."
        ]
      }
    );
  }
};
