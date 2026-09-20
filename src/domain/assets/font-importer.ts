/**
 * Dynamic Font Importer & Customizable Element Assets Engine
 * Generates Google Fonts preconnect/link tags, @import statements, and fallback stacks.
 */

export interface FontImportOptions {
  primaryFont: string;
  displayFont?: string;
  monoFont?: string;
  weights?: number[];
  includeArabic?: boolean;
}

export interface FontImportResult {
  primaryFont: string;
  displayFont: string;
  htmlLinkTags: string;
  cssImportRule: string;
  cssVariables: string;
  opticalLineHeightRecommendation: number;
}

export function generateCustomFontImports(options: FontImportOptions): FontImportResult {
  const {
    primaryFont = "IBM Plex Sans Arabic",
    displayFont = primaryFont,
    monoFont = "JetBrains Mono",
    weights = [400, 500, 600, 700],
    includeArabic = true
  } = options;

  const weightStr = `wght@${weights.sort((a, b) => a - b).join(";")}`;

  const formatFontNameForUrl = (name: string) => name.trim().replace(/\s+/g, "+");

  const families = [
    `family=${formatFontNameForUrl(primaryFont)}:${weightStr}`
  ];

  if (displayFont && displayFont !== primaryFont) {
    families.push(`family=${formatFontNameForUrl(displayFont)}:${weightStr}`);
  }

  if (monoFont && !monoFont.includes("monospace")) {
    families.push(`family=${formatFontNameForUrl(monoFont)}:wght@400;600`);
  }

  const googleUrl = `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;

  const htmlLinkTags = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${googleUrl}" rel="stylesheet">
`.trim();

  const cssImportRule = `@import url('${googleUrl}');`;

  const isArabicPrimary =
    includeArabic ||
    ["cairo", "tajawal", "amiri", "readex", "plex sans arabic", "almarai"].some((ar) =>
      primaryFont.toLowerCase().includes(ar)
    );

  const fallbackSans = isArabicPrimary
    ? "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  const primaryStack = `'${primaryFont}', ${fallbackSans}`;
  const displayStack = displayFont ? `'${displayFont}', ${fallbackSans}` : primaryStack;
  const monoStack = `'${monoFont}', monospace`;

  const opticalLineHeightRecommendation = isArabicPrimary ? 1.75 : 1.6;

  const cssVariables = `
:root {
  --ink-font-body: ${primaryStack};
  --ink-font-display: ${displayStack};
  --ink-font-mono: ${monoStack};
  --ink-leading-body: ${opticalLineHeightRecommendation};
}
`.trim();

  return {
    primaryFont,
    displayFont,
    htmlLinkTags,
    cssImportRule,
    cssVariables,
    opticalLineHeightRecommendation
  };
}
