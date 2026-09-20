/**
 * Website Style Reverse-Engineering & Inspection (TypeScript Domain)
 * Extracts typography, colors, shadows, and design archetypes from code snippets.
 */

export interface InspectedDesignStyle {
  archetype: string;
  colors: string[];
  fonts: string[];
  hasGlassmorphism: boolean;
  hasFluidTypography: boolean;
  hasArabicTypography: boolean;
  upgradeBlueprint: {
    bgSurfaceOklch: string;
    accentPrimaryOklch: string;
    textPrimaryOklch: string;
    shadowSystem: string;
  };
}

export function inspectDesignStyle(code: string): InspectedDesignStyle {
  const hexColors = Array.from(new Set(code.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g) || [])).slice(0, 10);
  const fonts = Array.from(
    new Set(
      (code.match(/font-family\s*:\s*([^;]+);/gi) || [])
        .map((f) => f.replace(/font-family\s*:\s*/i, "").replace(";", ""))
        .flatMap((s) => s.split(","))
        .map((p) => p.trim().replace(/['"]/g, ""))
        .filter((p) => !["sans-serif", "serif", "monospace", "inherit"].includes(p.toLowerCase()))
    )
  ).slice(0, 6);

  const hasGlassmorphism = /backdrop-filter|blur\(/i.test(code);
  const hasFluidTypography = /clamp\(/i.test(code);
  const hasArabicTypography = /cairo|tajawal|amiri|readex|plex sans arabic|almarai/i.test(code);

  const isDark = /background(?:-color)?\s*:\s*(?:#0[0-9a-fA-F]{2,5}|#1[0-9a-fA-F]{2,5})/i.test(code);
  const archetype = isDark && hasGlassmorphism ? "Luxury Dark" : hasArabicTypography ? "Bilingual High-Craft" : "Modern Editorial";

  return {
    archetype,
    colors: hexColors,
    fonts,
    hasGlassmorphism,
    hasFluidTypography,
    hasArabicTypography,
    upgradeBlueprint: {
      bgSurfaceOklch: "oklch(0.12 0.015 220)",
      accentPrimaryOklch: "oklch(0.68 0.16 200)",
      textPrimaryOklch: "oklch(0.96 0.01 220)",
      shadowSystem: "0 4px 6px -1px rgba(0,0,0,0.35), 0 2px 4px -2px rgba(0,0,0,0.3)"
    }
  };
}
