/**
 * Tool: ink_design_palette_tokens
 * Generates bespoke OKLCH color palettes, fluid typography, and design tokens.
 */

import { PaletteTokensInput, PaletteTokensInputSchema } from "../contracts/index.js";
import { generatePalette } from "../domain/design-tokens/palette-generator.js";
import { generateTypographySystem } from "../domain/design-tokens/typography-generator.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const tokensTool = {
  name: "ink_design_palette_tokens",
  title: "Generate OKLCH Color Harmony & Design Tokens",
  description:
    "Generate harmonious, bespoke OKLCH color tokens, layered shadow systems, and fluid typography scales. Eliminates generic AI gradients and guarantees WCAG AAA contrast.",
  inputSchema: PaletteTokensInputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: PaletteTokensInput = PaletteTokensInputSchema.parse(rawInput);
    const palette = generatePalette(input.mood, input.baseHue);
    const typography = input.includeTypography
      ? generateTypographySystem(input.mood === "editorial" ? "modern-editorial" : "modern-editorial")
      : null;

    const fullCss = [palette.cssVariables, typography ? typography.cssVariables : ""].filter(Boolean).join("\n\n");

    return createSuccessEnvelope(
      `Generated OKLCH design tokens for mood: ${input.mood} with verified contrast.`,
      {
        mood: input.mood,
        baseHue: palette.baseHue,
        tokens: palette.tokens,
        contrastAnalysis: palette.contrastAnalysis,
        typographyScale: typography?.steps,
        cssVariables: fullCss
      },
      {
        nextActions: [
          "Use the generated CSS variables in your stylesheet :root block.",
          "Invoke ink_craft_component to create UI components that consume these tokens."
        ]
      }
    );
  }
};
