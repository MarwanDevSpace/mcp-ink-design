/**
 * Fluid Mathematical Typography Generator using CSS clamp()
 * Prevents rigid font-size slop and creates harmonious editorial optical scaling.
 */

export interface FluidTypeStep {
  name: string;
  minPx: number;
  maxPx: number;
  clampCss: string;
  lineHeight: number;
  letterSpacing: string;
}

export interface TypographySteps {
  display: FluidTypeStep;
  h1: FluidTypeStep;
  h2: FluidTypeStep;
  h3: FluidTypeStep;
  bodyLarge: FluidTypeStep;
  body: FluidTypeStep;
  caption: FluidTypeStep;
}

export interface TypographyScale {
  scaleName: string;
  fontFamilies: {
    display: string;
    body: string;
    mono: string;
  };
  steps: TypographySteps;
  cssVariables: string;
}

export function generateFluidClamp(
  minPx: number,
  maxPx: number,
  minViewportPx = 360,
  maxViewportPx = 1440
): string {
  const minRem = (minPx / 16).toFixed(3);
  const maxRem = (maxPx / 16).toFixed(3);

  const slope = (maxPx - minPx) / (maxViewportPx - minViewportPx);
  const yIntersection = -minViewportPx * slope + minPx;
  const yIntersectionRem = (yIntersection / 16).toFixed(3);
  const slopeVw = (slope * 100).toFixed(2);

  return `clamp(${minRem}rem, ${yIntersectionRem}rem + ${slopeVw}vw, ${maxRem}rem)`;
}

export function generateTypographySystem(editorialStyle = "modern-editorial"): TypographyScale {
  const fontFamilies = {
    display: "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace"
  };

  if (editorialStyle === "editorial-serif") {
    fontFamilies.display = "'Playfair Display', 'Newsreader', Georgia, serif";
  } else if (editorialStyle === "brutalist") {
    fontFamilies.display = "'Space Grotesk', 'Syne', sans-serif";
    fontFamilies.body = "'Space Mono', monospace";
  }

  const steps: TypographySteps = {
    display: {
      name: "display",
      minPx: 38,
      maxPx: 72,
      clampCss: generateFluidClamp(38, 72),
      lineHeight: 1.08,
      letterSpacing: "-0.035em"
    },
    h1: {
      name: "h1",
      minPx: 30,
      maxPx: 52,
      clampCss: generateFluidClamp(30, 52),
      lineHeight: 1.15,
      letterSpacing: "-0.025em"
    },
    h2: {
      name: "h2",
      minPx: 24,
      maxPx: 38,
      clampCss: generateFluidClamp(24, 38),
      lineHeight: 1.2,
      letterSpacing: "-0.02em"
    },
    h3: {
      name: "h3",
      minPx: 20,
      maxPx: 26,
      clampCss: generateFluidClamp(20, 26),
      lineHeight: 1.3,
      letterSpacing: "-0.01em"
    },
    bodyLarge: {
      name: "bodyLarge",
      minPx: 17,
      maxPx: 20,
      clampCss: generateFluidClamp(17, 20),
      lineHeight: 1.6,
      letterSpacing: "0.005em"
    },
    body: {
      name: "body",
      minPx: 15,
      maxPx: 16.5,
      clampCss: generateFluidClamp(15, 16.5),
      lineHeight: 1.65,
      letterSpacing: "0.01em"
    },
    caption: {
      name: "caption",
      minPx: 12.5,
      maxPx: 13.5,
      clampCss: generateFluidClamp(12.5, 13.5),
      lineHeight: 1.5,
      letterSpacing: "0.025em"
    }
  };

  const cssVariables = `
:root {
  /* Font Family Stacks */
  --ink-font-display: ${fontFamilies.display};
  --ink-font-body: ${fontFamilies.body};
  --ink-font-mono: ${fontFamilies.mono};

  /* Fluid Typography Steps */
  --ink-text-display: ${steps.display.clampCss};
  --ink-text-h1: ${steps.h1.clampCss};
  --ink-text-h2: ${steps.h2.clampCss};
  --ink-text-h3: ${steps.h3.clampCss};
  --ink-text-body-lg: ${steps.bodyLarge.clampCss};
  --ink-text-body: ${steps.body.clampCss};
  --ink-text-caption: ${steps.caption.clampCss};

  /* Line Heights */
  --ink-leading-display: ${steps.display.lineHeight};
  --ink-leading-heading: ${steps.h1.lineHeight};
  --ink-leading-body: ${steps.body.lineHeight};
}
`.trim();

  return {
    scaleName: editorialStyle,
    fontFamilies,
    steps,
    cssVariables
  };
}
