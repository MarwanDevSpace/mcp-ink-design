/**
 * Tool: ink_create_base
 * Scaffolds high-craft modern web application foundation without boilerplate slop.
 */

import { CreateBaseInput, CreateBaseInputSchema } from "../contracts/index.js";
import { generatePalette } from "../domain/design-tokens/palette-generator.js";
import { generateTypographySystem } from "../domain/design-tokens/typography-generator.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const createBaseTool = {
  name: "ink_create_base",
  title: "Scaffold High-Craft Base Web Architecture",
  description:
    "Scaffold a clean, modern, semantic web project with OKLCH design tokens, fluid typography, and zero-slop architecture. Use this tool at the start of building any high-quality web experience.",
  inputSchema: CreateBaseInputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: CreateBaseInput = CreateBaseInputSchema.parse(rawInput);
    const { projectName, designStyle, includeThreeJs, includePwaMeta } = input;

    const palette = generatePalette(designStyle);
    const typography = generateTypographySystem(
      designStyle === "editorial" ? "modern-editorial" : designStyle === "neo-brutalist" ? "brutalist" : "modern-editorial"
    );

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${includePwaMeta ? '<meta name="theme-color" content="#0b0f19">\n  <meta name="color-scheme" content="dark">' : ""}
  <title>${projectName} — Engineered with Ink Design</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;500;700&display=swap" rel="stylesheet">
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
        <a href="#features" class="ink-nav-link">Architecture</a>
        <a href="#showcase" class="ink-nav-link">Craft</a>
        <a href="#docs" class="ink-nav-link">Specifications</a>
      </nav>
      <a href="#action" class="ink-btn-nav">Initiate Flow</a>
    </div>
  </header>

  <main class="ink-main">
    <section class="ink-hero-section">
      <div class="ink-container ink-hero-content">
        <div class="ink-badge-pill">
          <span class="ink-pulse-dot"></span>
          <span>Anti-AI-Slop Certified Design</span>
        </div>
        <h1 class="ink-hero-title">Experience Web Craftsmanship in Pure Harmony</h1>
        <p class="ink-hero-lead">
          Built on OKLCH perceptual color spaces, fluid clamp() typography scales, and tactile micro-interactions.
        </p>
        <div class="ink-cta-group">
          <a href="#start" class="ink-btn-primary">Explore Blueprint</a>
          <a href="#github" class="ink-btn-secondary">View Tokens</a>
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

    const css = `
${palette.cssVariables}

${typography.cssVariables}

/* Modern CSS Reset & Baseline */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body.ink-body {
  min-height: 100vh;
  background-color: var(--ink-bg-surface);
  color: var(--ink-text-primary);
  font-family: var(--ink-font-body);
  font-size: var(--ink-text-body);
  line-height: var(--ink-leading-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  position: relative;
}

.ink-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
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
          typographySteps: Object.keys(typography.steps)
        }
      },
      {
        nextActions: [
          "Call ink_craft_component to build custom interactive components (cards, metrics, navbars).",
          "Call ink_threejs_experience to mount an interactive 3D WebGL hero canvas.",
          "Call ink_validate_design to verify anti-slop score and contrast compliance."
        ]
      }
    );
  }
};
