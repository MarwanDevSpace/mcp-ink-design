/**
 * Tool: ink_inspect_website_style
 * Reverse-engineers design DNA from external URLs or HTML/CSS code snippets.
 */

import { InspectWebsiteStyleInput, InspectWebsiteStyleInputSchema } from "../contracts/index.js";
import { inspectDesignStyle } from "../domain/inspection/style-extractor.js";
import { PythonBridge } from "../integrations/python/python-bridge.js";
import { createSuccessEnvelope, createErrorEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const inspectTool = {
  name: "ink_inspect_website_style",
  title: "Reverse-Engineer & Inspect Website Design Style",
  description:
    "Deconstruct any website (via URL or HTML/CSS code) to extract its color palette, fonts, shadows, and layout DNA, generating an actionable OKLCH upgrade blueprint.",
  inputSchema: InspectWebsiteStyleInputSchema,
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
            "Use ink_design_palette_tokens with tailored baseHue to generate high-craft tokens."
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
