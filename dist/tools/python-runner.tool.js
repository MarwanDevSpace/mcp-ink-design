/**
 * Tool: ink_python_test_runner
 * Executes the dedicated Python external verification suite for deep analysis.
 */
import { PythonRunnerInputSchema, PythonRunnerOutputSchema, ReadOnlyAnnotations } from "../contracts/index.js";
import { PythonBridge } from "../integrations/python/python-bridge.js";
import { createSuccessEnvelope, createErrorEnvelope } from "../core/result-envelope.js";
export const pythonRunnerTool = {
    name: "ink_run_python_tests",
    title: "Run Python AST & Contrast Verification Suite",
    description: "PURPOSE: Execute the external Python verification suite for deep AST static analysis, mathematical contrast matrix calculation, and headless layout audits.\n\nBEHAVIOR: Spawns the local Python 3 ink_verifier engine in a sandboxed subprocess. Purely read-only; does not mutate source files or modify disk state unless 'capture' is specifically invoked. Requires Python 3.10+ installed in the environment PATH. Returns comprehensive structured test metrics.\n\nUSAGE GUIDELINES:\n- When to use: Use when running deep multi-pass Python AST analysis, mathematical APCA/WCAG contrast calculation, or comprehensive verification across an entire codebase.\n- When NOT to use: Do NOT use for fast in-memory CSS validation without Python (use ink_validate_design instead) or for standalone client-side security audits (use ink_audit_security instead).\n- Alternatives: Use ink_validate_design for fast TypeScript-native design verification; use ink_audit_security for native security scanning.\n\nRETURNS: ResultEnvelope containing structured test outcomes from the Python verifier engine according to the invoked action ('contrast', 'security', 'visual', 'audit', 'full', 'bidi', 'inspect', or 'capture').",
    annotations: ReadOnlyAnnotations,
    inputSchema: PythonRunnerInputSchema,
    outputSchema: PythonRunnerOutputSchema,
    execute: async (rawInput) => {
        const input = PythonRunnerInputSchema.parse(rawInput);
        const payload = {
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
                return createErrorEnvelope(`Python verification engine encountered an error: ${pythonResult.message}`, { error: pythonResult.message }, {
                    warnings: ["Verify Python 3.10+ is available in system PATH."],
                    nextActions: ["Check Python environment or run inline TypeScript tools as fallback."]
                });
            }
            return createSuccessEnvelope(`Python verification suite (${input.action}) executed successfully.`, pythonResult.data, {
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
            });
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            return createErrorEnvelope(`Failed to run Python verification suite: ${errorMsg}`, { error: errorMsg }, {
                warnings: ["Ensure Python 3.10+ is installed and executable."],
                nextActions: ["Run 'npm run test:python' manually or use TS-native tools."]
            });
        }
    }
};
//# sourceMappingURL=python-runner.tool.js.map