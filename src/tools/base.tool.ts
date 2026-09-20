/**
 * Tool: ink_create_base
 * Scaffolds high-craft modern web application foundation without boilerplate slop.
 */

import {
  CreateBaseInput,
  CreateBaseInputSchema,
  CreateBaseOutputSchema,
  ReadOnlyAnnotations
} from "../contracts/index.js";
import { generatePalette } from "../domain/design-tokens/palette-generator.js";
import { generateTypographySystem } from "../domain/design-tokens/typography-generator.js";
import { generateArabicTypography } from "../domain/bidi/arabic-typography.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const createBaseTool = {
  name: "ink_create_base",
  title: "Scaffold Web Application Foundation",
  description:
    "PURPOSE: Scaffold a complete, production-grade semantic web application foundation featuring OKLCH color token architecture, fluid typography scales, modern CSS logical properties, and bilingual Arabic RTL/LTR layout balance.\n\nBEHAVIOR: Generates complete in-memory application files (index.html, styles.css, main.js) within the structured result envelope. Operates purely in-memory with zero direct filesystem side effects; callers receive the code ready to be written to disk. Requires no external credentials or elevated permissions.\n\nUSAGE GUIDELINES:\n- When to use: Call at the start of a web project to establish root HTML semantics, CSS custom property foundations, viewport meta tags, and font configurations.\n- When NOT to use: Do NOT use to craft isolated UI widgets (use ink_craft_component instead) or to synthesize standalone color variables without project markup (use ink_generate_palette_tokens instead).\n- Alternatives: Use ink_craft_component for individual components; use ink_generate_palette_tokens for standalone CSS color tokens.\n\nRETURNS: ResultEnvelope containing structured 'files' dictionary (index.html, styles.css, main.js), OKLCH tokensOverview, contrast verification analysis, and typography scales.",
  annotations: ReadOnlyAnnotations,
  inputSchema: CreateBaseInputSchema,
  outputSchema: CreateBaseOutputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: CreateBaseInput = CreateBaseInputSchema.parse(rawInput);
    const { projectName, designStyle, direction, language, arabicFont, includeThreeJs, includePwaMeta } = input;

    const palette = generatePalette(designStyle);
    const latinTypography = generateTypographySystem(
      designStyle === "editorial" ? "modern-editorial" : designStyle === "neo-brutalist" ? "brutalist" : "modern-editorial"
    );
    const arabicTypography = language !== "en" ? generateArabicTypography(arabicFont) : null;

    const fontLinks = arabicTypography
      ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${arabicTypography.googleFontsLink}&family=Outfit:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap" rel="stylesheet">`
      : `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap" rel="stylesheet">`;

    const heroTitle = language === "ar"
      ? "هندسة الويب وتصميم فائق الحرفية"
      : language === "bilingual"
      ? '<span>هندسة الويب الفاخرة</span> <bdi class="ink-chip">Bespoke Craft</bdi>'
      : "Experience Web Craftsmanship in Pure Harmony";

    const heroLead = language === "ar"
      ? "مبني على أبعاد OKLCH الفيزيائية للألوان، وخطوط رياضية سائلة، وخصائص منطقية تدعم العربية والإنجليزية بانسيابية تامة."
      : "Built on OKLCH perceptual color spaces, mathematical fluid clamp() scales, and modern CSS logical properties.";

    const html = `
<!DOCTYPE html>
<html lang="${language === "ar" ? "ar" : "en"}" dir="${direction}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${includePwaMeta ? '<meta name="theme-color" content="#0b0f19">\n  <meta name="color-scheme" content="dark">' : ""}
  <title>${projectName} — Engineered with Ink Design</title>
  ${fontLinks}
  <link rel="stylesheet" href="styles.css">
  ${includeThreeJs ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>' : ""}
  <script type="module" src="main.js" defer></script>
</head>
<body class="ink-body">
  ${includeThreeJs ? '<div id="canvas-container" class="ink-threejs-viewport" aria-hidden="true"><canvas id="webgl-canvas"></canvas></div>' : ""}
  
  <header class="ink-navbar">
    <div class="ink-container ink-nav-inner">
      <a href="#" class="ink-brand">
        <span class="ink-brand-mark">●</span>
        <span>${projectName}</span>
      </a>
      <nav class="ink-nav-links">
        <a href="#features" class="ink-nav-link">${language === "ar" ? "المعمارية" : "Architecture"}</a>
        <a href="#showcase" class="ink-nav-link">${language === "ar" ? "الحرفية" : "Craft"}</a>
        <a href="#docs" class="ink-nav-link">${language === "ar" ? "المواصفات" : "Specs"}</a>
      </nav>
      <a href="#action" class="ink-btn-nav">${language === "ar" ? "ابدأ الآن" : "Initiate Flow"}</a>
    </div>
  </header>

  <main class="ink-main">
    <section class="ink-hero-section">
      <div class="ink-container ink-hero-content">
        <div class="ink-badge-pill">
          <span class="ink-pulse-dot"></span>
          <span>${language === "ar" ? "معمارية معتمدة ضد الركاكة" : "Anti-AI-Slop Certified Design"}</span>
        </div>
        <h1 class="ink-hero-title">${heroTitle}</h1>
        <p class="ink-hero-lead">${heroLead}</p>
        <div class="ink-cta-group">
          <a href="#start" class="ink-btn-primary">${language === "ar" ? "استكشف المخطط" : "Explore Blueprint"}</a>
          <a href="#tokens" class="ink-btn-secondary">${language === "ar" ? "استعراض التوكنز" : "View Tokens"}</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="ink-footer">
    <div class="ink-container ink-footer-inner">
      <p>© ${new Date().getFullYear()} ${projectName}. Crafted with mcp-ink-design.</p>
    </div>
  </footer>
</body>
</html>
`.trim();

    const typoVariables = arabicTypography ? arabicTypography.cssVariables : latinTypography.cssVariables;

    const css = `
${palette.cssVariables}

${typoVariables}

/* Modern CSS Reset & Logical Baseline */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body.ink-body {
  min-height: 100vh;
  background-color: var(--ink-bg-surface);
  color: var(--ink-text-primary);
  font-family: var(--ink-font-body, var(--ink-font-ar-primary, sans-serif));
  font-size: var(--ink-text-body);
  line-height: var(--ink-leading-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  position: relative;
  text-align: start;
}

.ink-container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 1.5rem;
}

/* Navigation Bar */
.ink-navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: color-mix(in oklch, var(--ink-bg-surface) 80%, transparent);
  border-bottom: 1px solid var(--ink-border-subtle);
  padding: 1rem 0;
}
.ink-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ink-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--ink-font-display);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--ink-text-primary);
  text-decoration: none;
}
.ink-brand-mark {
  color: var(--ink-accent-primary);
}
.ink-nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.ink-nav-link {
  color: var(--ink-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color var(--ink-duration-fast) ease;
}
.ink-nav-link:hover {
  color: var(--ink-text-primary);
}
.ink-btn-nav {
  padding: 0.55rem 1.25rem;
  border-radius: 8px;
  background: var(--ink-accent-primary);
  color: var(--ink-bg-surface);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: transform var(--ink-duration-fast) var(--ink-ease-spring), box-shadow var(--ink-duration-fast) ease;
}
.ink-btn-nav:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--ink-accent-glow);
}

/* Hero Section */
.ink-hero-section {
  padding: 8rem 0 6rem 0;
  text-align: center;
  position: relative;
  z-index: 10;
}
.ink-hero-content {
  max-width: 860px;
}
.ink-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 1.1rem;
  border-radius: 9999px;
  background: var(--ink-bg-elevated);
  border: 1px solid var(--ink-border-subtle);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--ink-text-secondary);
  margin-bottom: 2rem;
}
.ink-pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ink-accent-primary);
  box-shadow: 0 0 10px var(--ink-accent-primary);
}
.ink-hero-title {
  font-family: var(--ink-font-display);
  font-size: var(--ink-text-display);
  font-weight: 800;
  line-height: var(--ink-leading-display);
  letter-spacing: -0.035em;
  margin-bottom: 1.5rem;
}
.ink-hero-lead {
  font-size: var(--ink-text-body-lg);
  color: var(--ink-text-secondary);
  line-height: var(--ink-leading-body);
  margin-bottom: 2.5rem;
}
.ink-cta-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}
.ink-btn-primary {
  padding: 0.95rem 2.2rem;
  border-radius: 12px;
  background: var(--ink-accent-primary);
  color: var(--ink-bg-surface);
  font-weight: 600;
  text-decoration: none;
  transition: transform var(--ink-duration-fast) var(--ink-ease-spring), box-shadow var(--ink-duration-fast) ease;
  box-shadow: var(--ink-shadow-md);
}
.ink-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--ink-shadow-lg), var(--ink-shadow-glow);
}
.ink-btn-secondary {
  padding: 0.95rem 2.2rem;
  border-radius: 12px;
  background: transparent;
  color: var(--ink-text-primary);
  border: 1px solid var(--ink-border-subtle);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--ink-duration-fast) ease;
}
.ink-btn-secondary:hover {
  background: var(--ink-bg-elevated);
  border-color: var(--ink-border-active);
}

/* Footer */
.ink-footer {
  padding: 3rem 0;
  border-top: 1px solid var(--ink-border-subtle);
  text-align: center;
  color: var(--ink-text-muted);
  font-size: 0.9rem;
}
`.trim();

    const js = `
/**
 * Application Entry Point - ${projectName}
 * Initialized with Ink Design Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Ink Design] Application initialized with high-craft tokens.');
});
`.trim();

    return createSuccessEnvelope(
      `Successfully generated high-craft base architecture for ${projectName} (${designStyle} style).`,
      {
        projectName,
        designStyle,
        files: {
          "index.html": html,
          "styles.css": css,
          "main.js": js
        },
        tokensOverview: {
          paletteTokens: palette.tokens,
          contrastReport: palette.contrastAnalysis,
          typographySteps: Object.keys((arabicTypography || latinTypography).steps)
        }
      },
      {
        nextActions: [
          "Call ink_craft_component to build custom interactive components (cards, metrics, navbars).",
          "Call ink_build_threejs_experience to mount an interactive 3D WebGL hero canvas.",
          "Call ink_validate_design to verify anti-slop score and contrast compliance."
        ]
      }
    );
  }
};
