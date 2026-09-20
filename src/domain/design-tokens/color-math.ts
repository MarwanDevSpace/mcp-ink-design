/**
 * Pure TypeScript Color Math & Contrast Engine
 * Computes luminance, WCAG 2.1/2.2 contrast ratios, and OKLCH color spaces.
 */

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface ContrastResult {
  ratio: number;
  grade: "AAA" | "AA" | "AA Large" | "Fail";
  normalTextAA: boolean;
  normalTextAAA: boolean;
  largeTextAA: boolean;
  largeTextAAA: boolean;
  uiComponentAA: boolean;
}

export function parseHexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "").trim().toLowerCase();
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0]! + clean[0]!, 16),
      g: parseInt(clean[1]! + clean[1]!, 16),
      b: parseInt(clean[2]! + clean[2]!, 16)
    };
  }
  if (clean.length >= 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16)
    };
  }
  return { r: 0, g: 0, b: 0 };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (c: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(c)));
    return clamped.toString(16).padStart(2, "0");
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function channelToLinear(c: number): number {
  const norm = c / 255;
  return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

export function calculateRelativeLuminance(rgb: RGB): number {
  const rLin = channelToLinear(rgb.r);
  const gLin = channelToLinear(rgb.g);
  const bLin = channelToLinear(rgb.b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

export function calculateContrastRatio(fgHex: string, bgHex: string): ContrastResult {
  const fg = parseHexToRgb(fgHex);
  const bg = parseHexToRgb(bgHex);

  const lumFg = calculateRelativeLuminance(fg);
  const lumBg = calculateRelativeLuminance(bg);

  const lighter = Math.max(lumFg, lumBg);
  const darker = Math.min(lumFg, lumBg);

  const ratio = Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));

  const normalTextAA = ratio >= 4.5;
  const normalTextAAA = ratio >= 7.0;
  const largeTextAA = ratio >= 3.0;
  const largeTextAAA = ratio >= 4.5;
  const uiComponentAA = ratio >= 3.0;

  const grade: ContrastResult["grade"] = normalTextAAA
    ? "AAA"
    : normalTextAA
    ? "AA"
    : largeTextAA
    ? "AA Large"
    : "Fail";

  return {
    ratio,
    grade,
    normalTextAA,
    normalTextAAA,
    largeTextAA,
    largeTextAAA,
    uiComponentAA
  };
}

export interface OklchColor {
  l: number; // 0.0 - 1.0
  c: number; // 0.0 - 0.4
  h: number; // 0 - 360 degrees
  cssString: string;
}

export function createOklch(l: number, c: number, h: number): OklchColor {
  const clampedL = Math.max(0, Math.min(1, Number(l.toFixed(3))));
  const clampedC = Math.max(0, Math.min(0.4, Number(c.toFixed(3))));
  const clampedH = ((h % 360) + 360) % 360;
  return {
    l: clampedL,
    c: clampedC,
    h: Math.round(clampedH),
    cssString: `oklch(${clampedL} ${clampedC} ${Math.round(clampedH)})`
  };
}
