/**
 * Tool: ink_capture_viewport
 * Captures 16:9, 9:16, and Mobile viewports using headless browser with isolated temp profiles.
 */

import { CaptureViewportInput, CaptureViewportInputSchema } from "../contracts/index.js";
import { PythonBridge } from "../integrations/python/python-bridge.js";
import { createSuccessEnvelope, createErrorEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const captureTool = {
  name: "ink_capture_viewport",
  title: "Capture Multi-Viewport Responsive Snapshots (16:9, 9:16, Mobile)",
  description:
    "Capture 3 high-resolution viewport snapshots (16:9 Desktop Landscape, 9:16 Vertical Story, and 390x844 Mobile View) after code modifications to verify layout integrity, prevent overflow leaks, and validate responsiveness.",
  inputSchema: CaptureViewportInputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: CaptureViewportInput = CaptureViewportInputSchema.parse(rawInput);

    try {
      const pythonResult = await PythonBridge.execute({
        action: "capture",
        payload: {
          url: input.htmlOrUrl.startsWith("http") || input.htmlOrUrl.startsWith("file") ? input.htmlOrUrl : undefined,
          html: !input.htmlOrUrl.startsWith("http") && !input.htmlOrUrl.startsWith("file") ? input.htmlOrUrl : undefined,
          output_dir: input.outputDirectory,
          title: input.title
        }
      });

      if (pythonResult.status === "error") {
        return createErrorEnvelope(
          `Viewport capture engine reported an error: ${pythonResult.message}`,
          { error: pythonResult.message }
        );
      }

      const captureData = pythonResult.data as any;

      return createSuccessEnvelope(
        `Successfully captured 3 responsive viewports (16:9, 9:16, Mobile) for: ${input.title}.`,
        captureData,
        {
          evidence: {
            sources: [
              {
                label: "Headless Browser Viewport Capture",
                uri: captureData?.outputDirectory || ".ink_snapshots",
                retrievedAt: new Date().toISOString()
              }
            ],
            artifacts: captureData?.snapshots?.map((s: any) => ({
              label: `${s.label} [${s.aspect_ratio}]`,
              uri: s.filePath
            }))
          },
          nextActions: [
            "Inspect the generated snapshots in .ink_snapshots/ to verify optical centering and alignment.",
            "Confirm no horizontal scrollbars appeared on the mobile_view (390x844) viewport."
          ]
        }
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return createErrorEnvelope(
        `Failed to execute viewport capture: ${errorMsg}`,
        { error: errorMsg }
      );
    }
  }
};
