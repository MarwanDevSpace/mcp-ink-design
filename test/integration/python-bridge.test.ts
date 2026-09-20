import { describe, it, expect } from "vitest";
import { PythonBridge } from "../../src/integrations/python/python-bridge.js";
import { pythonRunnerTool } from "../../src/tools/python-runner.tool.js";

describe("Python Bridge & External Suite Integration", () => {
  it("executes Python contrast check via stdin stream", async () => {
    const result = await PythonBridge.execute({
      action: "contrast",
      payload: { foreground: "#ffffff", background: "#000000" }
    });

    expect(result.status).toBe("success");
    const data = result.data as any;
    expect(data.ratio).toBe(21.0);
    expect(data.wcag.normal_text_aaa).toBe(true);
  });

  it("executes Python security linter catching bad code", async () => {
    const result = await PythonBridge.execute({
      action: "security",
      payload: { code: "element.innerHTML = userInput; eval('bad');" }
    });

    expect(result.status).toBe("success");
    const data = result.data as any;
    expect(data.passed).toBe(false);
    expect(data.total_findings).toBeGreaterThanOrEqual(2);
  });

  it("runs the full ink_python_test_runner tool with envelope wrapping", async () => {
    const envelope = await pythonRunnerTool.execute({
      action: "full",
      code: "<header><nav></nav></header><main style='font-size: clamp(1rem, 2vw, 2rem)'></main>",
      foregroundHex: "#f8fafc",
      backgroundHex: "#0b0f19"
    });

    expect(envelope.status).toBe("success");
    expect(envelope.evidence.sources).toBeDefined();
    const data = envelope.data as any;
    expect(data.visual_audit).toBeDefined();
    expect(data.security_lint).toBeDefined();
    expect(data.contrast_check).toBeDefined();
  });
});
