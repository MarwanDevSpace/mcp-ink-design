/**
 * Tool: ink_python_test_runner
 * Executes the dedicated Python external verification suite for deep analysis.
 */

import { PythonRunnerInput, PythonRunnerInputSchema } from "../contracts/index.js";
import { PythonBridge } from "../integrations/python/python-bridge.js";
import { createSuccessEnvelope, createErrorEnvelope, ResultEnvelope } from "../core/result-envelope.js";

export const pythonRunnerTool = {
  name: "ink_python_test_runner",
  title: "Run External Python Verification Suite",
  description:
    "Execute external Python-based automated testing for visual anti-slop heuristics, AST security linter, and contrast matrix verification.",
  inputSchema: PythonRunnerInputSchema,
  execute: async (rawInput: unknown): Promise<ResultEnvelope<unknown>> => {
    const input: PythonRunnerInput = PythonRunnerInputSchema.parse(rawInput);

    const payload: Record<string, unknown> = {
      code: input.code || "",
      foreground: input.foregroundHex || "#ffffff",
      background: input.backgroundHex || "#0b0f19"
    };

    try {
      const pythonResult = await PythonBridge.execute({
        action: input.action,
        payload
      });

      if (pythonResult.status === "error") {
        return createErrorEnvelope(
          `Python verification engine encountered an error: ${pythonResult.message}`,
          { error: pythonResult.message },
          {
            warnings: ["Verify Python 3.10+ is available in system PATH."],
            nextActions: ["Check Python environment or run inline TypeScript tools as fallback."]
          }
        );
      }

      return createSuccessEnvelope(
        `Python verification suite (${input.action}) executed successfully.`,
        pythonResult.data,
        {
          evidence: {
            sources: [
              {
                label: "Python ink_verifier engine",
                uri: "python/ink_verifier",
                retrievedAt: new Date().toISOString()
              }
            ]
          },
          nextActions: [
            "Review findings and contrast ratios reported by the Python verification engine."
          ]
        }
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return createErrorEnvelope(
        `Failed to run Python verification suite: ${errorMsg}`,
        { error: errorMsg },
        {
          warnings: ["Ensure Python 3.10+ is installed and executable."],
          nextActions: ["Run 'npm run test:python' manually or use TS-native tools."]
        }
      );
    }
  }
};
