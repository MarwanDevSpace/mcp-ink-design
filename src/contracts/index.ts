/**
 * Zod Schemas and Public Contract Definitions for all 11 MCP Tools.
 * Standardized to Glama Benchmark Tier-S criteria:
 * - Strict verb_noun naming
 * - 100% Parameter semantic documentation with constraints and interactions
 * - Fully typed Output Schemas conforming to MCP ResultEnvelope standards
 * - Complete behavioral annotations (readOnlyHint, destructiveHint, idempotentHint, openWorldHint)
 */

import { z } from "zod";

// ============================================================================
// Tool Annotation Hints (MCP 2025-11-25 / SEP Specification)
// ============================================================================

export interface ToolAnnotations {
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}

export const ReadOnlyAnnotations: ToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false
};

export const OpenWorldReadOnlyAnnotations: ToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true
};

export const ViewportCaptureAnnotations: ToolAnnotations = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true
};

// ============================================================================
// Standard Result Envelope Schema Generator
// ============================================================================

export function createEnvelopeOutputSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    status: z.enum(["success", "partial", "blocked", "failed"]).describe("Execution outcome status"),
    summary: z.string().describe("Concise, human-readable executive summary of the tool outcome"),
    data: dataSchema.describe("Domain-specific typed payload returned by the tool"),
    warnings: z.array(z.string()).describe("Operational cautions, craft advice, or non-blocking warnings"),
    evidence: z
      .object({
        inputsDigest: z.string().optional(),
        sources: z.array(z.object({ label: z.string(), uri: z.string().optional(), retrievedAt: z.string().optional() })).optional(),
        artifacts: z.array(z.object({ label: z.string(), uri: z.string().optional(), sha256: z.string().optional() })).optional()
      })
      .optional()
      .describe("Audit trail, source references, and generated artifact locations"),
    nextActions: z.array(z.string()).optional().describe("Actionable sequential recommendations or subsequent tool suggestions")
  });
}

// ============================================================================
// 1. ink_create_base (Verb: create, Noun: base)
// ============================================================================

export const CreateBaseInputSchema = z.object({
  projectName: z
    .string()
    .default("ink-craft-app")
    .describe("Name of the web application or project folder (used in document title and manifest metadata)"),
  designStyle: z
    .enum(["editorial", "cyber-tactile", "neo-brutalist", "luxury-dark", "organic-modern"])
    .default("editorial")
    .describe("Aesthetic foundation archetype governing OKLCH color harmonies, typography ratios, and border radius"),
  direction: z
    .enum(["rtl", "ltr", "auto"])
    .default("auto")
    .describe("Document writing direction: 'rtl' sets dir='rtl' for Arabic, 'ltr' for English, 'auto' configures bidirectional CSS logical properties"),
  language: z
    .enum(["ar", "en", "bilingual"])
    .default("bilingual")
    .describe("Primary language mode: 'ar' optimizes Arabic optical hierarchy, 'en' optimizes Latin, 'bilingual' isolates bidi text with <bdi> chips"),
  arabicFont: z
    .enum(["ibm-plex", "cairo-display", "tajawal-modern", "readex-tech", "amiri-editorial"])
    .default("ibm-plex")
    .describe("Curated Arabic font family loaded from Google Fonts; pairs with Latin typography with matching optical x-height"),
  includeThreeJs: z
    .boolean()
    .default(false)
    .describe("When true, mounts a responsive WebGL Three.js canvas in the hero section and includes CDN script tags"),
  includePwaMeta: z
    .boolean()
    .default(true)
    .describe("When true, injects mobile viewport constraints, theme-color meta tags, and color-scheme dark/light preferences")
});
export type CreateBaseInput = z.infer<typeof CreateBaseInputSchema>;

export const CreateBaseOutputDataSchema = z.object({
  projectName: z.string(),
  designStyle: z.string(),
  direction: z.string(),
  language: z.string(),
  files: z.record(z.string(), z.string()).describe("In-memory project files mapping (e.g. index.html, styles.css, main.js, manifest.json)"),
  tokens: z.record(z.string(), z.unknown()),
  arabicTypography: z.record(z.string(), z.unknown()).nullable(),
  threeJsConfig: z.record(z.string(), z.unknown()).nullable()
}).passthrough();

export const CreateBaseOutputSchema = createEnvelopeOutputSchema(CreateBaseOutputDataSchema);
export type CreateBaseOutput = z.infer<typeof CreateBaseOutputSchema>;

// ============================================================================
// 2. ink_generate_palette_tokens (Verb: generate, Noun: palette_tokens)
// ============================================================================

export const PaletteTokensInputSchema = z.object({
  mood: z
    .enum(["editorial", "cyber-tactile", "neo-brutalist", "luxury-dark", "organic-modern"])
    .default("editorial")
    .describe("Creative aesthetic mood determining surface depths, text luminance steps, and brand accents"),
  baseHue: z
    .number()
    .min(0)
    .max(360)
    .optional()
    .describe("Optional hue angle (0-360) on OKLCH color wheel (e.g., 210 for cyan, 260 for indigo, 30 for warm bronze, 145 for emerald)"),
  includeTypography: z
    .boolean()
    .default(true)
    .describe("When true, calculates fluid clamp() typography scale tokens (steps -1 through 5)"),
  includeArabicTokens: z
    .boolean()
    .default(true)
    .describe("When true, includes Arabic line-height ratios (1.7-1.85) and font fallback variables")
});
export type PaletteTokensInput = z.infer<typeof PaletteTokensInputSchema>;

export const PaletteTokensOutputDataSchema = z.object({
  mood: z.string(),
  baseHue: z.number(),
  tokens: z.record(z.string(), z.string()).describe("Dictionary of semantic CSS token names to OKLCH values"),
  contrastAnalysis: z.array(z.record(z.string(), z.unknown())).describe("Computed WCAG AAA and AA contrast ratio audit per pairing"),
  typographyScale: z.record(z.string(), z.unknown()).optional(),
  cssVariables: z.string().describe("Ready-to-paste CSS block with :root variables and semantic color tokens")
}).passthrough();

export const PaletteTokensOutputSchema = createEnvelopeOutputSchema(PaletteTokensOutputDataSchema);
export type PaletteTokensOutput = z.infer<typeof PaletteTokensOutputSchema>;

// ============================================================================
// 3. ink_craft_component (Verb: craft, Noun: component)
// ============================================================================

export const CraftComponentInputSchema = z.object({
  componentType: z
    .enum(["hero-section", "glass-card", "tactile-button", "navigation-bar", "metrics-grid", "modal-dialog"])
    .default("hero-section")
    .describe("Type of bespoke UI component to synthesize"),
  title: z
    .string()
    .default("Craft Architecture")
    .describe("Primary headline or action label of the component"),
  description: z
    .string()
    .default("Engineered with optical precision")
    .describe("Subheading or explanatory body copy"),
  direction: z
    .enum(["rtl", "ltr", "auto"])
    .default("auto")
    .describe("Writing direction; 'auto' enforces CSS logical properties (margin-inline, inset-inline)"),
  interactivePhysics: z
    .boolean()
    .default(true)
    .describe("When true, attaches mouse spring drag, ripple physics, and keyboard navigation handlers")
});
export type CraftComponentInput = z.infer<typeof CraftComponentInputSchema>;

export const CraftComponentOutputDataSchema = z.object({
  componentType: z.string(),
  html: z.string().describe("Semantic HTML5 markup with ARIA roles and logical structure"),
  css: z.string().describe("Scoped CSS using logical properties, fluid clamp values, and OKLCH color tokens"),
  js: z.string().describe("Tactile micro-interaction JavaScript with automatic teardown"),
  accessibilityNotes: z.array(z.string()).describe("Accessibility considerations and ARIA keyboard patterns")
}).passthrough();

export const CraftComponentOutputSchema = createEnvelopeOutputSchema(CraftComponentOutputDataSchema);
export type CraftComponentOutput = z.infer<typeof CraftComponentOutputSchema>;

// ============================================================================
// 4. ink_build_threejs_experience (Verb: build, Noun: threejs_experience)
// ============================================================================

export const ThreeExperienceInputSchema = z.object({
  sceneType: z
    .enum(["particle-constellation", "geometric-wireframe", "morphing-mesh", "interactive-hero-canvas"])
    .default("particle-constellation")
    .describe("Type of 3D WebGL scene to generate with Three.js"),
  accentColorHex: z
    .string()
    .default("#38bdf8")
    .describe("Primary accent color in 6-digit hex format (#RRGGBB) used for points, materials, and point lights"),
  particleCount: z
    .number()
    .min(100)
    .max(5000)
    .default(1200)
    .describe("Number of particle points (clamped between 100 and 5000 for GPU thermal and battery efficiency)"),
  enableMouseParallax: z
    .boolean()
    .default(true)
    .describe("When true, registers smooth pointer move listeners with lerp damping for gentle depth parallax")
});
export type ThreeExperienceInput = z.infer<typeof ThreeExperienceInputSchema>;

export const ThreeExperienceOutputDataSchema = z.object({
  sceneType: z.string(),
  html: z.string().describe("HTML canvas mounting container"),
  css: z.string().describe("Absolute full-bleed canvas styling with pointer-events isolation"),
  js: z.string().describe("Complete Three.js module code with initInkThreeScene, resize listener, and teardown disposal"),
  lifecycle: z.object({
    init: z.string(),
    renderLoop: z.string(),
    teardown: z.string()
  }).optional()
}).passthrough();

export const ThreeExperienceOutputSchema = createEnvelopeOutputSchema(ThreeExperienceOutputDataSchema);
export type ThreeExperienceOutput = z.infer<typeof ThreeExperienceOutputSchema>;

// ============================================================================
// 5. ink_generate_script_logic (Verb: generate, Noun: script_logic)
// ============================================================================

export const ScriptLogicInputSchema = z.object({
  pattern: z
    .enum(["state-store", "event-bus", "scroll-observer", "theme-toggle", "form-validator"])
    .default("state-store")
    .describe("Architectural runtime pattern: 'state-store' (pub/sub state container), 'event-bus' (typed decoupled messaging), 'scroll-observer' (IntersectionObserver animator), 'theme-toggle' (dark/light/system theme switcher with persistence), 'form-validator' (real-time accessible field validation)"),
  moduleName: z
    .string()
    .default("AppStore")
    .describe("Name of the exported JavaScript/TypeScript class or module"),
  typescript: z
    .boolean()
    .default(false)
    .describe("When true, emits strict TypeScript interfaces and generic typings alongside the implementation")
});
export type ScriptLogicInput = z.infer<typeof ScriptLogicInputSchema>;

export const ScriptLogicOutputDataSchema = z.object({
  pattern: z.string(),
  moduleName: z.string(),
  description: z.string(),
  code: z.string().describe("Zero-dependency ES module code with automatic teardown"),
  typescriptTypes: z.string().optional().describe("Companion TypeScript declarations"),
  usageExample: z.string().describe("Usage demonstration snippet showing initialization and consumption")
}).passthrough();

export const ScriptLogicOutputSchema = createEnvelopeOutputSchema(ScriptLogicOutputDataSchema);
export type ScriptLogicOutput = z.infer<typeof ScriptLogicOutputSchema>;

// ============================================================================
// 6. ink_audit_security (Verb: audit, Noun: security)
// ============================================================================

export const SecurityAuditInputSchema = z.object({
  code: z
    .string()
    .describe("Source code string (HTML, JavaScript, or CSS) to inspect for client-side web vulnerabilities"),
  filename: z
    .string()
    .default("index.html")
    .describe("Virtual file path context for reporting findings (e.g., 'src/main.js' or 'index.html')")
});
export type SecurityAuditInput = z.infer<typeof SecurityAuditInputSchema>;

export const SecurityAuditOutputDataSchema = z.object({
  filename: z.string(),
  passed: z.boolean().describe("True if score >= 80 and zero critical or high vulnerabilities are detected"),
  securityScore: z.number().min(0).max(100).describe("Composite security score out of 100"),
  findingsSummary: z.object({
    critical: z.number(),
    high: z.number(),
    medium: z.number(),
    total: z.number()
  }),
  findings: z.array(
    z.object({
      id: z.string(),
      severity: z.enum(["critical", "high", "medium", "low", "info"]),
      category: z.string(),
      title: z.string(),
      description: z.string(),
      codeSnippet: z.string().optional(),
      line: z.number().optional(),
      recommendation: z.string()
    })
  ).describe("Granular list of identified vulnerabilities with line numbers and remediations"),
  recommendedCspHeader: z.string().describe("Hardened Content-Security-Policy header directive recommendation"),
  recommendedAuthPattern: z.string().describe("Secure client authentication storage recommendations")
}).passthrough();

export const SecurityAuditOutputSchema = createEnvelopeOutputSchema(SecurityAuditOutputDataSchema);
export type SecurityAuditOutput = z.infer<typeof SecurityAuditOutputSchema>;

// ============================================================================
// 7. ink_validate_design (Verb: validate, Noun: design)
// ============================================================================

export const ValidateDesignInputSchema = z.object({
  code: z
    .string()
    .describe("HTML and CSS code string to evaluate for anti-slop rules, typography scaling, and alignment"),
  foregroundHex: z
    .string()
    .default("#f8fafc")
    .describe("Primary foreground text color in 6-digit hex (#RRGGBB) to verify against surface"),
  backgroundHex: z
    .string()
    .default("#0b0f19")
    .describe("Surface background color in 6-digit hex (#RRGGBB) to verify contrast ratio against text"),
  checkBidi: z
    .boolean()
    .default(true)
    .describe("When true, audits CSS logical property compliance (e.g. flagging margin-left instead of margin-inline-start)"),
  checkCentering: z
    .boolean()
    .default(true)
    .describe("When true, verifies optical centering balance and checks for horizontal overflow risks (e.g. 100vw, fixed large widths)")
});
export type ValidateDesignInput = z.infer<typeof ValidateDesignInputSchema>;

export const ValidateDesignOutputDataSchema = z.object({
  craftScore: z.number().min(0).max(100).describe("Overall design craftsmanship rating (0-100)"),
  craftGrade: z.string().describe("Letter grade (S, A, B, C, F)"),
  isHighCraft: z.boolean().describe("True if craftScore >= 75 and contrast passes WCAG AA"),
  antiSlopChecks: z.array(z.record(z.string(), z.unknown())).describe("Results for anti-slop rules (generic AI gradients, fluid clamp, semantic markup)"),
  contrast: z.object({
    foreground: z.string(),
    background: z.string(),
    ratio: z.number(),
    grade: z.string(),
    wcagAAA: z.boolean(),
    wcagAA: z.boolean()
  }).describe("Mathematical WCAG contrast calculation results"),
  bidiAndAlignment: z.record(z.string(), z.unknown()).nullable().describe("CSS logical property and optical alignment audit details"),
  strengths: z.array(z.string()).describe("Design elements adhering to high-craft principles"),
  remediationAdvice: z.array(z.string()).describe("Specific, actionable code edits to reach Grade A/S craft")
}).passthrough();

export const ValidateDesignOutputSchema = createEnvelopeOutputSchema(ValidateDesignOutputDataSchema);
export type ValidateDesignOutput = z.infer<typeof ValidateDesignOutputSchema>;

// ============================================================================
// 8. ink_run_python_tests (Verb: run, Noun: python_tests)
// ============================================================================

export const PythonRunnerInputSchema = z.object({
  action: z
    .enum(["contrast", "security", "visual", "audit", "full", "bidi", "inspect", "capture"])
    .default("full")
    .describe("Verification action: 'contrast' (WCAG/APCA matrix calculation), 'security' (Python AST sink linter), 'visual' (anti-slop rule engine), 'audit' (combined static analysis), 'full' (all static + dynamic checks), 'bidi' (RTL/LTR logical property AST analysis), 'inspect' (reverse-engineer URL design), 'capture' (headless browser multi-viewport snapshots)"),
  code: z
    .string()
    .optional()
    .describe("Source code snippet to analyze with Python AST and regex engines (required when action is 'security', 'visual', 'audit', 'bidi', or 'full')"),
  target: z
    .string()
    .optional()
    .describe("Website URL or local HTML file path (required when action is 'inspect' or 'capture')"),
  foregroundHex: z
    .string()
    .optional()
    .describe("Foreground text color in 6-digit hex (used when action is 'contrast')"),
  backgroundHex: z
    .string()
    .optional()
    .describe("Background surface color in 6-digit hex (used when action is 'contrast')")
});
export type PythonRunnerInput = z.infer<typeof PythonRunnerInputSchema>;

export const PythonRunnerOutputDataSchema = z.record(z.string(), z.unknown()).describe("Raw structured test outcomes from Python ink_verifier engine");

export const PythonRunnerOutputSchema = createEnvelopeOutputSchema(PythonRunnerOutputDataSchema);
export type PythonRunnerOutput = z.infer<typeof PythonRunnerOutputSchema>;

// ============================================================================
// 9. ink_capture_viewport (Verb: capture, Noun: viewport)
// ============================================================================

export const CaptureViewportInputSchema = z.object({
  htmlOrUrl: z
    .string()
    .describe("HTML markup string, local file path (e.g. 'file:///index.html'), or public HTTP/HTTPS URL to render and photograph"),
  title: z
    .string()
    .default("Site Snapshot")
    .describe("Human-readable label used for image naming and output organization"),
  outputDirectory: z
    .string()
    .optional()
    .describe("Target folder where 16:9, 9:16, and mobile PNG snapshots are written (defaults to '.ink_snapshots')")
});
export type CaptureViewportInput = z.infer<typeof CaptureViewportInputSchema>;

export const CaptureViewportOutputDataSchema = z.object({
  title: z.string(),
  outputDirectory: z.string(),
  snapshots: z.array(
    z.object({
      label: z.string().describe("Viewport descriptor (e.g., '16:9 Desktop Landscape', '9:16 Vertical Story', 'Mobile View')"),
      viewport: z.string(),
      dimensions: z.string().describe("Exact pixel dimensions (e.g. '1920x1080', '1080x1920', '390x844')"),
      aspect_ratio: z.string(),
      filePath: z.string().describe("Absolute path to the saved PNG snapshot file"),
      fileSize: z.number().optional().describe("Size of the PNG file in bytes")
    })
  ).describe("List of 3 captured viewport images"),
  layoutMetrics: z.record(z.string(), z.unknown()).optional().describe("Computed scrollWidth, scrollHeight, and overflow metrics")
}).passthrough();

export const CaptureViewportOutputSchema = createEnvelopeOutputSchema(CaptureViewportOutputDataSchema);
export type CaptureViewportOutput = z.infer<typeof CaptureViewportOutputSchema>;

// ============================================================================
// 10. ink_inspect_website_style (Verb: inspect, Noun: website_style)
// ============================================================================

export const InspectWebsiteStyleInputSchema = z.object({
  urlOrCode: z
    .string()
    .describe("Public website URL (e.g. 'https://stripe.com') or raw HTML/CSS code snippet to reverse-engineer"),
  extractOklchPalette: z
    .boolean()
    .default(true)
    .describe("When true, converts extracted HEX and RGB colors into perceptual OKLCH color tokens")
});
export type InspectWebsiteStyleInput = z.infer<typeof InspectWebsiteStyleInputSchema>;

export const InspectWebsiteStyleOutputDataSchema = z.object({
  archetype: z.string().describe("Detected aesthetic archetype (editorial, luxury-dark, brutalist, cyber-tactile, organic)"),
  colors: z.array(z.record(z.string(), z.unknown())).describe("Extracted colors with HEX, RGB, OKLCH, and usage frequency"),
  typography: z.record(z.string(), z.unknown()).describe("Detected font families, font sizes, line heights, and weights"),
  shadows: z.array(z.string()).describe("Extracted elevation shadow definitions"),
  layoutDna: z.record(z.string(), z.unknown()).describe("Layout DNA analysis (flexbox, grid, gap values, border radii)"),
  recommendedOklchPalette: z.string().optional().describe("Actionable CSS token block upgrade")
}).passthrough();

export const InspectWebsiteStyleOutputSchema = createEnvelopeOutputSchema(InspectWebsiteStyleOutputDataSchema);
export type InspectWebsiteStyleOutput = z.infer<typeof InspectWebsiteStyleOutputSchema>;

// ============================================================================
// 11. ink_import_custom_assets (Verb: import, Noun: custom_assets)
// ============================================================================

export const ImportCustomAssetsInputSchema = z.object({
  primaryFont: z
    .string()
    .default("IBM Plex Sans Arabic")
    .describe("Primary font family name to import (e.g. 'IBM Plex Sans Arabic', 'Inter', 'Outfit')"),
  displayFont: z
    .string()
    .optional()
    .describe("Optional display/headline font family name (e.g. 'Amiri', 'Playfair Display', 'Clash Display')"),
  weights: z
    .array(z.number())
    .default([400, 500, 600, 700])
    .describe("Array of numeric font weights to import (e.g. [400, 600, 700])"),
  includeArabic: z
    .boolean()
    .default(true)
    .describe("When true, loads Arabic character subsets, sets optical line heights (1.7-1.85), and adds bidi fallbacks")
});
export type ImportCustomAssetsInput = z.infer<typeof ImportCustomAssetsInputSchema>;

export const ImportCustomAssetsOutputDataSchema = z.object({
  primaryFont: z.string(),
  displayFont: z.string().optional(),
  htmlLinkTags: z.string().describe("Preconnect and Google Fonts <link> tags ready for HTML <head>"),
  cssImportRule: z.string().describe("CSS @import statement for stylesheets"),
  cssVariables: z.string().describe("CSS font-family and line-height custom property variables"),
  fallbackStack: z.string().describe("Accessible system fallback font stack")
}).passthrough();

export const ImportCustomAssetsOutputSchema = createEnvelopeOutputSchema(ImportCustomAssetsOutputDataSchema);
export type ImportCustomAssetsOutput = z.infer<typeof ImportCustomAssetsOutputSchema>;
