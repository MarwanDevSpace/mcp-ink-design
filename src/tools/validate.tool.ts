import {
  ValidateDesignInput,
  ValidateDesignInputSchema,
  ValidateDesignOutputSchema,
  ReadOnlyAnnotations
} from "../contracts/index.js";
import { validateDesignCraft } from "../domain/verification/design-validator.js";
import { calculateContrastRatio } from "../domain/design-tokens/color-math.js";
import { auditLogicalProperties } from "../domain/bidi/logical-properties.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const validateTool = {
  name: "ink_validate_design",
  title: "Validate Design Craft & Contrast Compliance",
  description:
    "PURPOSE: Evaluate HTML and CSS code against anti-AI-slop design heuristics (detecting generic AI purple gradients, hardcoded pixel font sizes, missing semantic tags), verify WCAG AAA color contrast ratios, and audit Arabic RTL/LTR logical properties.\n\nBEHAVIOR: Executes in-memory static AST and regex analysis on the supplied code strings. Completely read-only with zero filesystem writes, no network requests, and deterministic score computation. Emits a letter grade (S, A, B, C, F), numerical score (0-100), and specific remediation diff advice.\n\nUSAGE GUIDELINES:\n- When to use: Call after creating or modifying web layouts, components, or stylesheets to verify craft quality, contrast compliance, and bidi readiness before committing.\n- When NOT to use: Do NOT use for JavaScript security vulnerability scanning (use ink_audit_security instead) or for capturing real-browser screenshots (use ink_capture_viewport instead).\n- Alternatives: Use ink_audit_security for security/XSS checks; use ink_capture_viewport for visual multi-viewport screenshot verification.\n\nRETURNS: ResultEnvelope containing 'craftScore', 'craftGrade', 'isHighCraft' boolean, 'antiSlopChecks' results, computed 'contrast' analysis, 'bidiAndAlignment' report, and prioritized 'remediationAdvice'.",
  annotations: ReadOnlyAnnotations,
  inputSchema: ValidateDesignInputSchema,
  outputSchema: ValidateDesignOutputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: ValidateDesignInput = ValidateDesignInputSchema.parse(rawInput);
    const craft = validateDesignCraft(input.code);
    const contrast = calculateContrastRatio(input.foregroundHex, input.backgroundHex);
    const bidiReport = input.checkBidi ? auditLogicalProperties(input.code) : null;

    const isHighCraft = craft.score >= 75 && contrast.normalTextAA && (bidiReport ? bidiReport.score >= 70 : true);

    const summaryParts = [
      `Craft Grade [${craft.grade}] (${craft.score}/100)`,
      `Contrast: ${contrast.ratio}:1 [${contrast.grade}]`
    ];
    if (bidiReport) {
      summaryParts.push(`Bidi/Logical: ${bidiReport.score}/100`);
    }

    return createSuccessEnvelope(
      `Design validation complete: ${summaryParts.join(" | ")}.`,
      {
        craftScore: craft.score,
        craftGrade: craft.grade,
        isHighCraft,
        antiSlopChecks: craft.antiSlopChecks,
        contrast: {
          foreground: input.foregroundHex,
          background: input.backgroundHex,
          ratio: contrast.ratio,
          grade: contrast.grade,
          wcagAAA: contrast.normalTextAAA,
          wcagAA: contrast.normalTextAA
        },
        bidiAndAlignment: bidiReport,
        strengths: craft.strengths,
        remediationAdvice: [
          ...craft.remediationAdvice,
          ...(bidiReport?.findings.map((f) => `Replace '${f.property}' with '${f.recommended}': ${f.reason}`) || [])
        ]
      },
      {
        warnings: isHighCraft ? [] : ["Refinements needed to reach Grade A/S craft standard."],
        nextActions: isHighCraft
          ? [
              "Ready for production.",
              "Run ink_capture_viewport to generate 16:9, 9:16, and mobile visual snapshots."
            ]
          : craft.remediationAdvice
      }
    );
  }
};
