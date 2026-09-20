import {
  CaptureViewportInput,
  CaptureViewportInputSchema,
  CaptureViewportOutputSchema,
  ViewportCaptureAnnotations
} from "../contracts/index.js";
import { PythonBridge } from "../integrations/python/python-bridge.js";
import { createSuccessEnvelope, createErrorEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const captureTool = {
  name: "ink_capture_viewport",
  title: "Capture Multi-Viewport Responsive Snapshots",
  description:
    "PURPOSE: Capture 3 high-resolution viewport snapshots (16:9 Desktop Landscape 1920x1080, 9:16 Vertical Story 1080x1920, and Mobile View 390x844) via headless Chromium to verify layout integrity, responsiveness, and optical centering.\n\nBEHAVIOR: Launches local headless Chromium with an isolated temporary user-data profile. Renders the provided HTML string or URL, waits for network idle, and writes 3 PNG image files to the target outputDirectory (defaults to '.ink_snapshots/'). Detects horizontal scrollbar leaks and viewport overflow. Requires local Chromium/Chrome installed.\n\nUSAGE GUIDELINES:\n- When to use: Call after making HTML/CSS modifications or finishing a component to visually confirm that elements align properly across desktop, mobile, and tall vertical screens.\n- When NOT to use: Do NOT use for fast code syntax or contrast checks without browser rendering (use ink_validate_design instead).\n- Alternatives: Use ink_validate_design for fast static design linting; use ink_inspect_website_style to reverse-engineer design tokens from live URLs.\n\nRETURNS: ResultEnvelope containing structured 'snapshots' list (with label, viewport, exact dimensions, file path, and size) and layout overflow metrics.",
  annotations: ViewportCaptureAnnotations,
  inputSchema: CaptureViewportInputSchema,
  outputSchema: CaptureViewportOutputSchema,
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
