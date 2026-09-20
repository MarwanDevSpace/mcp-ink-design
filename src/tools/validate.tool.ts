/**
 * Tool: ink_validate_design
 * Audits frontend code for craftsmanship, anti-slop rules, and contrast ratios.
 */

import { ValidateDesignInput, ValidateDesignInputSchema } from "../contracts/index.js";
import { validateDesignCraft } from "../domain/verification/design-validator.js";
import { calculateContrastRatio } from "../domain/design-tokens/color-math.js";
import { createSuccessEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const validateTool = {
  name: "ink_validate_design",
  title: "Validate Design Craft & Anti-AI-Slop Compliance",
  description:
    "Evaluate web code against anti-AI-slop rules (generic gradient tropes, fluid clamp typography, layered shadows, semantic HTML) and verify WCAG contrast ratios.",
  inputSchema: ValidateDesignInputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: ValidateDesignInput = ValidateDesignInputSchema.parse(rawInput);
    const craft = validateDesignCraft(input.code);
    const contrast = calculateContrastRatio(input.foregroundHex, input.backgroundHex);

    const isHighCraft = craft.score >= 75 && contrast.normalTextAA;

    return createSuccessEnvelope(
      `Design validation complete: Craft Grade [${craft.grade}] (${craft.score}/100), Contrast: ${contrast.ratio}:1 [${contrast.grade}].`,
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
        strengths: craft.strengths,
        remediationAdvice: craft.remediationAdvice
      },
      {
        warnings: isHighCraft ? [] : ["Refinements needed to reach Grade A/S craft standard."],
        nextActions: isHighCraft
          ? ["Ready for production. Run ink_python_test_runner for deep external headless verification."]
          : craft.remediationAdvice
      }
    );
  }
};
