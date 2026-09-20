/**
 * Zod Schemas and Public Contract Definitions for all MCP Tools
 */

import { z } from "zod";

// 1. ink_create_base
export const CreateBaseInputSchema = z.object({
  projectName: z.string().default("ink-craft-app").describe("Name of the web project or application"),
  designStyle: z
    .enum(["editorial", "cyber-tactile", "neo-brutalist", "luxury-dark", "organic-modern"])
    .default("editorial")
    .describe("High-craft visual design style"),
  direction: z.enum(["rtl", "ltr", "auto"]).default("auto").describe("Document writing direction (RTL for Arabic, LTR for English, auto for bidirectional)"),
  language: z.enum(["ar", "en", "bilingual"]).default("bilingual").describe("Language mode of the scaffolded application"),
  arabicFont: z
    .enum(["ibm-plex", "cairo-display", "tajawal-modern", "readex-tech", "amiri-editorial"])
    .default("ibm-plex")
    .describe("Curated Arabic typography stack"),
  includeThreeJs: z.boolean().default(false).describe("Include Three.js canvas setup in scaffold"),
  includePwaMeta: z.boolean().default(true).describe("Include mobile web app viewport and theme-color meta tags")
});
export type CreateBaseInput = z.infer<typeof CreateBaseInputSchema>;

// 2. ink_design_palette_tokens
export const PaletteTokensInputSchema = z.object({
  mood: z
    .enum(["editorial", "cyber-tactile", "neo-brutalist", "luxury-dark", "organic-modern"])
    .default("editorial")
    .describe("Creative aesthetic mood"),
  baseHue: z
    .number()
    .min(0)
    .max(360)
    .optional()
    .describe("Optional base hue angle (0-360) for tailored brand color harmony"),
  includeTypography: z.boolean().default(true).describe("Include fluid clamp() typography scale tokens"),
  includeArabicTokens: z.boolean().default(true).describe("Include Arabic optical line-height and font variables")
});
export type PaletteTokensInput = z.infer<typeof PaletteTokensInputSchema>;

// 3. ink_craft_component
export const CraftComponentInputSchema = z.object({
  componentType: z
    .enum(["hero-section", "glass-card", "tactile-button", "navigation-bar", "metrics-grid", "modal-dialog"])
    .default("hero-section")
    .describe("Type of bespoke UI component to generate"),
  title: z.string().default("Craft Architecture").describe("Headline or primary component label"),
  description: z.string().default("Engineered with optical precision").describe("Descriptive body text"),
  direction: z.enum(["rtl", "ltr", "auto"]).default("auto").describe("Component writing direction"),
  interactivePhysics: z.boolean().default(true).describe("Include tactile spring micro-interaction JavaScript")
});
export type CraftComponentInput = z.infer<typeof CraftComponentInputSchema>;

// 4. ink_threejs_experience
export const ThreeExperienceInputSchema = z.object({
  sceneType: z
    .enum(["particle-constellation", "geometric-wireframe", "morphing-mesh", "interactive-hero-canvas"])
    .default("particle-constellation")
    .describe("Type of 3D WebGL scene"),
  accentColorHex: z.string().default("#38bdf8").describe("Hex color used for light/particles/wireframe"),
  particleCount: z.number().min(100).max(5000).default(1200).describe("Number of particle points (clamped for performance)"),
  enableMouseParallax: z.boolean().default(true).describe("Enable smooth pointer parallax damping")
});
export type ThreeExperienceInput = z.infer<typeof ThreeExperienceInputSchema>;

// 5. ink_script_logic
export const ScriptLogicInputSchema = z.object({
  pattern: z
    .enum(["state-store", "event-bus", "scroll-observer", "theme-toggle", "form-validator"])
    .default("state-store")
    .describe("Architectural JavaScript pattern to implement"),
  moduleName: z.string().default("AppStore").describe("Name of the exported class or module"),
  typescript: z.boolean().default(false).describe("Generate TypeScript types alongside JavaScript")
});
export type ScriptLogicInput = z.infer<typeof ScriptLogicInputSchema>;

// 6. ink_security_audit
export const SecurityAuditInputSchema = z.object({
  code: z.string().describe("Source code (HTML, JS, or CSS) to audit for security vulnerabilities"),
  filename: z.string().default("index.html").describe("Virtual filename or context for audit findings")
});
export type SecurityAuditInput = z.infer<typeof SecurityAuditInputSchema>;

// 7. ink_validate_design
export const ValidateDesignInputSchema = z.object({
  code: z.string().describe("HTML and CSS code to evaluate for anti-slop rules, fluid scaling, and craft quality"),
  foregroundHex: z.string().default("#f8fafc").describe("Primary text color to test contrast"),
  backgroundHex: z.string().default("#0b0f19").describe("Background surface color to test contrast"),
  checkBidi: z.boolean().default(true).describe("Audit CSS logical properties and Arabic RTL/LTR balance"),
  checkCentering: z.boolean().default(true).describe("Detect optical centering abuse and horizontal overflow risks")
});
export type ValidateDesignInput = z.infer<typeof ValidateDesignInputSchema>;

// 8. ink_python_test_runner
export const PythonRunnerInputSchema = z.object({
  action: z
    .enum(["contrast", "security", "visual", "audit", "full", "bidi", "inspect", "capture"])
    .default("full")
    .describe("Test action to execute in Python verification suite"),
  code: z.string().optional().describe("Code snippet to analyze with Python AST and regex engines"),
  target: z.string().optional().describe("URL or code string for site inspection"),
  foregroundHex: z.string().optional().describe("Foreground color for contrast calculation"),
  backgroundHex: z.string().optional().describe("Background color for contrast calculation")
});
export type PythonRunnerInput = z.infer<typeof PythonRunnerInputSchema>;

// 9. ink_capture_viewport (NEW)
export const CaptureViewportInputSchema = z.object({
  htmlOrUrl: z.string().describe("HTML code string, local file path, or public URL to capture"),
  title: z.string().default("Site Snapshot").describe("Title or label for the captured snapshot"),
  outputDirectory: z.string().optional().describe("Target folder where 16:9, 9:16, and mobile screenshots are saved")
});
export type CaptureViewportInput = z.infer<typeof CaptureViewportInputSchema>;

// 10. ink_inspect_website_style (NEW)
export const InspectWebsiteStyleInputSchema = z.object({
  urlOrCode: z.string().describe("Target website URL (e.g. https://example.com) or raw HTML/CSS to reverse-engineer"),
  extractOklchPalette: z.boolean().default(true).describe("Convert extracted HEX/RGB colors into perceptual OKLCH tokens")
});
export type InspectWebsiteStyleInput = z.infer<typeof InspectWebsiteStyleInputSchema>;

// 11. ink_import_custom_assets (NEW)
export const ImportCustomAssetsInputSchema = z.object({
  primaryFont: z.string().default("IBM Plex Sans Arabic").describe("Primary font family name to import"),
  displayFont: z.string().optional().describe("Secondary/Display font family name"),
  weights: z.array(z.number()).default([400, 500, 600, 700]).describe("Font weight numeric values to load"),
  includeArabic: z.boolean().default(true).describe("Include Arabic optical sizing and fallback stacks")
});
export type ImportCustomAssetsInput = z.infer<typeof ImportCustomAssetsInputSchema>;
