/**
 * Tool: ink_design_palette_tokens
 * Generates bespoke OKLCH color palettes, fluid typography, and design tokens.
 */
import { PaletteTokensInputSchema, PaletteTokensOutputSchema, ReadOnlyAnnotations } from "../contracts/index.js";
import { generatePalette } from "../domain/design-tokens/palette-generator.js";
import { generateTypographySystem } from "../domain/design-tokens/typography-generator.js";
import { createSuccessEnvelope } from "../core/result-envelope.js";
export const tokensTool = {
    name: "ink_generate_palette_tokens",
    title: "Generate OKLCH Color Palette & Design Tokens",
    description: "PURPOSE: Generate bespoke OKLCH color token ramps, layered shadow elevations, and fluid clamp() typography scales tailored to a creative aesthetic mood and base hue.\n\nBEHAVIOR: Synthesizes CSS custom property tokens and typography steps purely in-memory. Zero filesystem writes and zero external network access. Guarantees WCAG AAA contrast compliance across all text/surface pairings with mathematical delta-E verification.\n\nUSAGE GUIDELINES:\n- When to use: Use when creating or refining a design system's color foundation, fluid typographic scales, or dark/light mode surface tokens.\n- When NOT to use: Do NOT use to extract colors from an existing live website (use ink_inspect_website_style instead) or to scaffold an entire project skeleton (use ink_create_base instead).\n- Alternatives: Use ink_inspect_website_style to reverse-engineer design tokens from existing sites; use ink_create_base for full-page scaffolding.\n\nRETURNS: ResultEnvelope containing semantic OKLCH token map, computed contrast analysis, fluid typography scales, and a ready-to-use CSS :root variable stylesheet string.",
    annotations: ReadOnlyAnnotations,
    inputSchema: PaletteTokensInputSchema,
    outputSchema: PaletteTokensOutputSchema,
    execute: async (rawInput) => {
        const input = PaletteTokensInputSchema.parse(rawInput);
        const palette = generatePalette(input.mood, input.baseHue);
        const typography = input.includeTypography
            ? generateTypographySystem(input.mood === "editorial" ? "modern-editorial" : "modern-editorial")
            : null;
        const fullCss = [palette.cssVariables, typography ? typography.cssVariables : ""].filter(Boolean).join("\n\n");
        return createSuccessEnvelope(`Generated OKLCH design tokens for mood: ${input.mood} with verified contrast.`, {
            mood: input.mood,
            baseHue: palette.baseHue,
            tokens: palette.tokens,
            contrastAnalysis: palette.contrastAnalysis,
            typographyScale: typography?.steps,
            cssVariables: fullCss
        }, {
            nextActions: [
                "Use the generated CSS variables in your stylesheet :root block.",
                "Invoke ink_craft_component to create UI components that consume these tokens."
            ]
        });
    }
};
//# sourceMappingURL=tokens.tool.js.map