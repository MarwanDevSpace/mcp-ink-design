import {
  InspectWebsiteStyleInput,
  InspectWebsiteStyleInputSchema,
  InspectWebsiteStyleOutputSchema,
  OpenWorldReadOnlyAnnotations
} from "../contracts/index.js";
import { inspectDesignStyle } from "../domain/inspection/style-extractor.js";
import { PythonBridge } from "../integrations/python/python-bridge.js";
import { createSuccessEnvelope, createErrorEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const inspectTool = {
  name: "ink_inspect_website_style",
  title: "Inspect & Reverse-Engineer Website Style",
  description:
    "PURPOSE: Deconstruct existing live websites or HTML/CSS templates to reverse-engineer color palettes, typography scales, elevation shadows, and layout DNA into modern OKLCH tokens.\n\nBEHAVIOR: Fetches public website markup over HTTPS or parses local HTML/CSS code strings in-memory. Strictly read-only with zero disk modifications. Remote network requests enforce a 10s timeout, safe redirect limits, and private subnet IP blocking. Converts extracted HEX/RGB values into perceptual OKLCH color variables.\n\nUSAGE GUIDELINES:\n- When to use: Use when analyzing a reference website or mockup to extract its visual hierarchy, typography system, and color ramps.\n- When NOT to use: Do NOT use to generate novel color tokens from scratch (use ink_generate_palette_tokens instead) or to evaluate code for anti-slop compliance (use ink_validate_design instead).\n- Alternatives: Use ink_generate_palette_tokens to synthesize new design tokens; use ink_capture_viewport to capture visual screenshots.\n\nRETURNS: ResultEnvelope containing detected 'archetype', extracted 'colors' (with HEX and OKLCH conversions), 'typography' hierarchy, 'shadows', 'layoutDna', and an actionable recommended OKLCH palette stylesheet.",
  annotations: OpenWorldReadOnlyAnnotations,
  inputSchema: InspectWebsiteStyleInputSchema,
  outputSchema: InspectWebsiteStyleOutputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: InspectWebsiteStyleInput = InspectWebsiteStyleInputSchema.parse(rawInput);
    const isUrl = input.urlOrCode.startsWith("http://") || input.urlOrCode.startsWith("https://");

    try {
      if (isUrl) {
        // Delegate remote fetching to Python engine
        const pythonResult = await PythonBridge.execute({
          action: "inspect",
          payload: { target: input.urlOrCode }
        });

        if (pythonResult.status === "error") {
          return createErrorEnvelope(
            `Failed to inspect URL: ${pythonResult.message}`,
            { error: pythonResult.message }
          );
        }

        return createSuccessEnvelope(
          `Successfully reverse-engineered design DNA for: ${input.urlOrCode}.`,
          pythonResult.data,
          {
            nextActions: [
              "Apply recommended OKLCH color tokens into your project :root block.",
              "Use ink_create_base to scaffold an upgraded, high-craft version."
            ]
          }
        );
      }

      // Inline code inspection
      const tsReport = inspectDesignStyle(input.urlOrCode);
      return createSuccessEnvelope(
        `Successfully extracted design style: [${tsReport.archetype}].`,
        tsReport,
        {
          nextActions: [
            "Review extracted colors and typography stacks.",
            "Use ink_generate_palette_tokens with tailored baseHue to generate high-craft tokens."
          ]
        }
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return createErrorEnvelope(
        `Failed to inspect website style: ${errorMsg}`,
        { error: errorMsg }
      );
    }
  }
};
