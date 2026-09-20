/**
 * Tool: ink_import_custom_assets
 * Generates dynamic font imports and customizable element configuration.
 */

import { ImportCustomAssetsInput, ImportCustomAssetsInputSchema } from "../contracts/index.js";
import { generateCustomFontImports } from "../domain/assets/font-importer.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const assetsTool = {
  name: "ink_import_custom_assets",
  title: "Import & Configure Custom Fonts and Elements",
  description:
    "Dynamically import and configure Google Fonts or custom web fonts (Arabic and Latin), generating preconnect HTML link tags, CSS @import rules, optical line-height variables, and accessible fallback stacks.",
  inputSchema: ImportCustomAssetsInputSchema,
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
