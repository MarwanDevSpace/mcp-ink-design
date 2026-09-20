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
  includeTypography: z.boolean().default(true).describe("Include fluid clamp() typography scale tokens")
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
  backgroundHex: z.string().default("#0b0f19").describe("Background surface color to test contrast")
});
export type ValidateDesignInput = z.infer<typeof ValidateDesignInputSchema>;

// 8. ink_python_test_runner
export const PythonRunnerInputSchema = z.object({
  action: z
    .enum(["contrast", "security", "visual", "audit", "full"])
    .default("full")
    .describe("Test action to execute in Python verification suite"),
  code: z.string().optional().describe("Code snippet to analyze with Python AST and regex engines"),
  foregroundHex: z.string().optional().describe("Foreground color for contrast calculation"),
  backgroundHex: z.string().optional().describe("Background color for contrast calculation")
});
export type PythonRunnerInput = z.infer<typeof PythonRunnerInputSchema>;
