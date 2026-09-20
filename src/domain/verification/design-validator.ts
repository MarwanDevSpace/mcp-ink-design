/**
 * Design Craftsmanship & Anti-AI-Slop Validator
 * Evaluates frontend code against human-grade design standards.
 */

export interface CraftEvaluation {
  score: number; // 0 - 100
  grade: "S" | "A" | "B" | "C" | "F";
  antiSlopChecks: {
    noGenericGradients: boolean;
    usesFluidTypography: boolean;
    hasLayeredShadows: boolean;
    hasSemanticHtml: boolean;
    hasMicroInteractions: boolean;
  };
  strengths: string[];
  remediationAdvice: string[];
}

export function validateDesignCraft(sourceCode: string): CraftEvaluation {
  const strengths: string[] = [];
  const remediation: string[] = [];
  let score = 80;

  // 1. Generic gradients check
  const genericGradientRegex = /linear-gradient\s*\([^)]*(?:#6366f1|#a855f7|#8b5cf6|#3b82f6)[^)]*\)/i;
  const hasGenericGradient = genericGradientRegex.test(sourceCode);
  if (hasGenericGradient) {
    score -= 25;
    remediation.push("Replace cliche AI violet/indigo gradients with bespoke OKLCH tonal scales or physical lighting.");
  } else {
    strengths.push("Zero generic AI gradient cliches detected.");
  }

  // 2. Fluid typography
  const hasFluidTypography = /clamp\s*\(/i.test(sourceCode);
  if (hasFluidTypography) {
    score += 10;
    strengths.push("Fluid mathematical typography with clamp() ensures seamless responsive scaling.");
  } else if (/font-size:\s*\d{2,}px/i.test(sourceCode)) {
    score -= 10;
    remediation.push("Fixed pixel font sizes detected. Upgrade to clamp() for responsive optical sizing.");
  }

  // 3. Layered shadows
  const hasLayeredShadows = /box-shadow:[^;]*,[^;]*rgba/i.test(sourceCode);
  if (hasLayeredShadows) {
    score += 5;
    strengths.push("Multi-layered ambient occlusion box shadows provide authentic physical depth.");
  } else {
    remediation.push("Add multi-layered shadow stacks instead of single harsh drop-shadows.");
  }

  // 4. Semantic HTML landmarks
  const semanticTags = ["<header", "<nav", "<main", "<section", "<article", "<footer"];
  const matches = semanticTags.filter((t) => sourceCode.toLowerCase().includes(t));
  const hasSemanticHtml = matches.length >= 3;
  if (hasSemanticHtml) {
    score += 5;
    strengths.push(`Rich semantic HTML5 structure with ${matches.length} landmarks.`);
  } else if (sourceCode.toLowerCase().includes("<div") && matches.length === 0) {
    score -= 15;
    remediation.push("Div-heavy layout detected. Structure with <main>, <header>, <nav>, and <section> tags.");
  }

  // 5. Micro-interactions
  const hasMicroInteractions = /cubic-bezier/i.test(sourceCode) || /--ink-ease-spring/i.test(sourceCode);
  if (hasMicroInteractions) {
    score += 5;
    strengths.push("Spring physics cubic-bezier timing curves power tactile micro-interactions.");
  }

  score = Math.max(0, Math.min(100, score));

  const grade: CraftEvaluation["grade"] =
    score >= 90 ? "S" : score >= 75 ? "A" : score >= 60 ? "B" : score >= 45 ? "C" : "F";

  return {
    score,
    grade,
    antiSlopChecks: {
      noGenericGradients: !hasGenericGradient,
      usesFluidTypography: hasFluidTypography,
      hasLayeredShadows: hasLayeredShadows,
      hasSemanticHtml: hasSemanticHtml,
      hasMicroInteractions: hasMicroInteractions
    },
    strengths,
    remediationAdvice: remediation.length > 0 ? remediation : ["Design adheres to high-craft bespoke standards."]
  };
}
