/**
 * Arabic Typography and Optical Sizing Engine
 * Calibrates fluid scales, line-height compensation, and font stacks for Arabic & Bilingual interfaces.
 */

import { generateFluidClamp, FluidTypeStep } from "../design-tokens/typography-generator.js";

export type ArabicFontStyle =
  | "ibm-plex"
  | "cairo-display"
  | "tajawal-modern"
  | "readex-tech"
  | "amiri-editorial";

export interface ArabicTypographyScale {
  style: ArabicFontStyle;
  fontFamilies: {
    primary: string;
    display: string;
    mono: string;
  };
  googleFontsLink: string;
  steps: {
    display: FluidTypeStep;
    h1: FluidTypeStep;
    h2: FluidTypeStep;
    h3: FluidTypeStep;
    bodyLarge: FluidTypeStep;
    body: FluidTypeStep;
    caption: FluidTypeStep;
  };
  cssVariables: string;
}

export function generateArabicTypography(style: ArabicFontStyle = "ibm-plex"): ArabicTypographyScale {
  let primaryFont = "'IBM Plex Sans Arabic', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  let displayFont = "'IBM Plex Sans Arabic', 'Outfit', system-ui, -apple-system, sans-serif";
  let googleFontQuery = "family=IBM+Plex+Sans+Arabic:wght@400;500;600;700";

  switch (style) {
    case "cairo-display":
      primaryFont = "'Cairo', 'Plus Jakarta Sans', system-ui, sans-serif";
      displayFont = "'Cairo', 'Outfit', system-ui, sans-serif";
      googleFontQuery = "family=Cairo:wght@500;700;900";
      break;

    case "tajawal-modern":
      primaryFont = "'Tajawal', 'Inter', system-ui, sans-serif";
      displayFont = "'Tajawal', 'Plus Jakarta Sans', system-ui, sans-serif";
      googleFontQuery = "family=Tajawal:wght@400;500;700;800";
      break;

    case "readex-tech":
      primaryFont = "'Readex Pro', system-ui, sans-serif";
      displayFont = "'Readex Pro', system-ui, sans-serif";
      googleFontQuery = "family=Readex+Pro:wght@400;500;600;700";
      break;

    case "amiri-editorial":
      primaryFont = "'Amiri', 'Newsreader', Georgia, serif";
      displayFont = "'Amiri', Georgia, serif";
      googleFontQuery = "family=Amiri:ital,wght@0,400;0,700;1,400";
      break;
  }

  const monoFont = "'JetBrains Mono', 'Fira Code', monospace";

  // Optical compensation for Arabic glyph ascenders and descenders: line-height is tuned higher than Latin
  const steps = {
    display: {
      name: "display",
      minPx: 36,
      maxPx: 64,
      clampCss: generateFluidClamp(36, 64),
      lineHeight: 1.3,
      letterSpacing: "0em"
    },
    h1: {
      name: "h1",
      minPx: 28,
      maxPx: 48,
      clampCss: generateFluidClamp(28, 48),
      lineHeight: 1.35,
      letterSpacing: "0em"
    },
    h2: {
      name: "h2",
      minPx: 22,
      maxPx: 34,
      clampCss: generateFluidClamp(22, 34),
      lineHeight: 1.4,
      letterSpacing: "0em"
    },
    h3: {
      name: "h3",
      minPx: 19,
      maxPx: 24,
      clampCss: generateFluidClamp(19, 24),
      lineHeight: 1.45,
      letterSpacing: "0em"
    },
    bodyLarge: {
      name: "bodyLarge",
      minPx: 17,
      maxPx: 20,
      clampCss: generateFluidClamp(17, 20),
      lineHeight: 1.75,
      letterSpacing: "0em"
    },
    body: {
      name: "body",
      minPx: 15,
      maxPx: 16.5,
      clampCss: generateFluidClamp(15, 16.5),
      lineHeight: 1.8,
      letterSpacing: "0em"
    },
    caption: {
      name: "caption",
      minPx: 13,
      maxPx: 14,
      clampCss: generateFluidClamp(13, 14),
      lineHeight: 1.65,
      letterSpacing: "0em"
    }
  };

  const googleFontsLink = `https://fonts.googleapis.com/css2?${googleFontQuery}&display=swap`;

  const cssVariables = `
:root {
  /* Arabic & Bilingual High-Craft Typography */
  --ink-font-ar-primary: ${primaryFont};
  --ink-font-ar-display: ${displayFont};
  --ink-font-mono: ${monoFont};

  /* Fluid Steps */
  --ink-text-display: ${steps.display.clampCss};
  --ink-text-h1: ${steps.h1.clampCss};
  --ink-text-h2: ${steps.h2.clampCss};
  --ink-text-h3: ${steps.h3.clampCss};
  --ink-text-body-lg: ${steps.bodyLarge.clampCss};
  --ink-text-body: ${steps.body.clampCss};
  --ink-text-caption: ${steps.caption.clampCss};

  /* Arabic Line Heights */
  --ink-leading-display: ${steps.display.lineHeight};
  --ink-leading-heading: ${steps.h1.lineHeight};
  --ink-leading-body: ${steps.body.lineHeight};
}

/* Base direction-aware text rules */
[dir="rtl"] {
  font-family: var(--ink-font-ar-primary);
  text-align: start;
}
`.trim();

  return {
    style,
    fontFamilies: {
      primary: primaryFont,
      display: displayFont,
      mono: monoFont
    },
    googleFontsLink,
    steps,
    cssVariables
  };
}
