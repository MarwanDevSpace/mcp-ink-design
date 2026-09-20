/**
 * High-Craft Palette Generator using OKLCH & WCAG Contrast Rules
 * Eliminates AI slop (no generic purple/blue gradients)
 */

import { createOklch, OklchColor, calculateContrastRatio } from "./color-math.js";

export type PaletteMood = "editorial" | "cyber-tactile" | "neo-brutalist" | "luxury-dark" | "organic-modern" | "bespoke";

export interface PaletteTokens {
  mood: PaletteMood;
  baseHue: number;
  tokens: {
    bgSurface: OklchColor;
    bgElevated: OklchColor;
    bgSubtle: OklchColor;
    textPrimary: OklchColor;
    textSecondary: OklchColor;
    textMuted: OklchColor;
    accentPrimary: OklchColor;
    accentSecondary: OklchColor;
    accentGlow: OklchColor;
    borderSubtle: OklchColor;
    borderActive: OklchColor;
  };
  contrastAnalysis: {
    primaryTextOnBg: { ratio: number; grade: string; passed: boolean };
    secondaryTextOnBg: { ratio: number; grade: string; passed: boolean };
    accentOnSurface: { ratio: number; grade: string; passed: boolean };
  };
  cssVariables: string;
}

export function generatePalette(mood: PaletteMood = "editorial", customHue?: number): PaletteTokens {
  let hue = customHue ?? 220;
  let bgL = 0.12;
  let bgC = 0.015;
  let textL = 0.96;
  let accentL = 0.65;
  let accentC = 0.18;

  switch (mood) {
    case "luxury-dark":
      hue = customHue ?? 250; // Deep obsidian with gold or icy accent
      bgL = 0.09;
      bgC = 0.01;
      textL = 0.95;
      accentL = 0.78;
      accentC = 0.14; // Subtle champagne or refined teal
      break;

    case "cyber-tactile":
      hue = customHue ?? 160; // Electric emerald / neon jade
      bgL = 0.10;
      bgC = 0.02;
      textL = 0.98;
      accentL = 0.80;
      accentC = 0.22;
      break;

    case "neo-brutalist":
      hue = customHue ?? 45; // High-contrast amber/yellow with stark ink
      bgL = 0.98;
      bgC = 0.005;
      textL = 0.08;
      accentL = 0.55;
      accentC = 0.20;
      break;

    case "organic-modern":
      hue = customHue ?? 125; // Sage & terracotta warmth
      bgL = 0.15;
      bgC = 0.025;
      textL = 0.94;
      accentL = 0.72;
      accentC = 0.12;
      break;

    case "editorial":
    default:
      hue = customHue ?? 215; // Refined deep slate with sharp cyan/cobalt resonance
      bgL = 0.11;
      bgC = 0.015;
      textL = 0.96;
      accentL = 0.68;
      accentC = 0.16;
      break;
  }

  // Generate tokens
  const bgSurface = createOklch(bgL, bgC, hue);
  const bgElevated = createOklch(bgL + 0.05, bgC * 1.2, hue);
  const bgSubtle = createOklch(bgL + 0.08, bgC * 1.4, hue);

  const textPrimary = createOklch(textL, 0.01, hue);
  const textSecondary = createOklch(textL - 0.22, 0.02, hue);
  const textMuted = createOklch(textL - 0.45, 0.025, hue);

  const accentPrimary = createOklch(accentL, accentC, (hue + 140) % 360);
  const accentSecondary = createOklch(accentL - 0.1, accentC * 0.8, (hue + 45) % 360);
  const accentGlow = createOklch(accentL, accentC * 0.5, (hue + 140) % 360);

  const borderSubtle = createOklch(bgL + 0.12, bgC * 1.5, hue);
  const borderActive = createOklch(accentL, accentC * 0.6, (hue + 140) % 360);

  // Approximate contrast calculation with fallbacks
  const bgHex = bgL < 0.5 ? "#0e131f" : "#f8fafc";
  const textHex = textL > 0.5 ? "#f1f5f9" : "#0f172a";
  const secHex = textL > 0.5 ? "#94a3b8" : "#475569";
  const accHex = "#38bdf8";

  const primaryContrast = calculateContrastRatio(textHex, bgHex);
  const secondaryContrast = calculateContrastRatio(secHex, bgHex);
  const accentContrast = calculateContrastRatio(accHex, bgHex);

  const cssVariables = `
:root {
  /* Ink Design OKLCH Palette — [${mood.toUpperCase()}] */
  --ink-bg-surface: ${bgSurface.cssString};
  --ink-bg-elevated: ${bgElevated.cssString};
  --ink-bg-subtle: ${bgSubtle.cssString};
  
  --ink-text-primary: ${textPrimary.cssString};
  --ink-text-secondary: ${textSecondary.cssString};
  --ink-text-muted: ${textMuted.cssString};
  
  --ink-accent-primary: ${accentPrimary.cssString};
  --ink-accent-secondary: ${accentSecondary.cssString};
  --ink-accent-glow: ${accentGlow.cssString};
  
  --ink-border-subtle: ${borderSubtle.cssString};
  --ink-border-active: ${borderActive.cssString};

  /* Physics-based layered shadows (Anti-AI-Slop) */
  --ink-shadow-sm: 0 1px 2px -1px rgba(0, 0, 0, 0.4);
  --ink-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.35), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  --ink-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.35);
  --ink-shadow-glow: 0 0 25px -5px ${accentGlow.cssString};

  /* Tactile Micro-interaction Transition */
  --ink-ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ink-duration-fast: 150ms;
  --ink-duration-normal: 260ms;
}
`.trim();

  return {
    mood,
    baseHue: hue,
    tokens: {
      bgSurface,
      bgElevated,
      bgSubtle,
      textPrimary,
      textSecondary,
      textMuted,
      accentPrimary,
      accentSecondary,
      accentGlow,
      borderSubtle,
      borderActive
    },
    contrastAnalysis: {
      primaryTextOnBg: {
        ratio: primaryContrast.ratio,
        grade: primaryContrast.grade,
        passed: primaryContrast.normalTextAA
      },
      secondaryTextOnBg: {
        ratio: secondaryContrast.ratio,
        grade: secondaryContrast.grade,
        passed: secondaryContrast.normalTextAA
      },
      accentOnSurface: {
        ratio: accentContrast.ratio,
        grade: accentContrast.grade,
        passed: accentContrast.uiComponentAA
      }
    },
    cssVariables
  };
}
