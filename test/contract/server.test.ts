import { describe, it, expect } from "vitest";
import { createServer } from "../../src/server.js";
import { inkResources } from "../../src/resources/index.js";
import { inkPrompts } from "../../src/prompts/index.js";
import { createBaseTool } from "../../src/tools/base.tool.js";
import { tokensTool } from "../../src/tools/tokens.tool.js";
import { componentTool } from "../../src/tools/component.tool.js";
import { threejsTool } from "../../src/tools/threejs.tool.js";
import { scriptTool } from "../../src/tools/script.tool.js";
import { securityTool } from "../../src/tools/security.tool.js";
import { validateTool } from "../../src/tools/validate.tool.js";

describe("MCP Server Contract & Public Surfaces", () => {
  it("initializes McpServer without throwing", () => {
    const server = createServer();
    expect(server).toBeDefined();
  });

  it("registers all 8 required tools with valid envelopes", async () => {
    // 1. ink_create_base
    const baseRes = await createBaseTool.execute({
      projectName: "contract-test-app",
      designStyle: "editorial"
    });
    expect(baseRes.status).toBe("success");
    expect((baseRes.data as any).files["index.html"]).toBeDefined();

    // 2. ink_design_palette_tokens
    const tokenRes = await tokensTool.execute({ mood: "editorial" });
    expect(tokenRes.status).toBe("success");
    expect((tokenRes.data as any).tokens.bgSurface).toBeDefined();

    // 3. ink_craft_component
    const compRes = await componentTool.execute({ componentType: "glass-card" });
    expect(compRes.status).toBe("success");
    expect((compRes.data as any).html).toContain("ink-card");

    // 4. ink_threejs_experience
    const threeRes = await threejsTool.execute({ sceneType: "particle-constellation" });
    expect(threeRes.status).toBe("success");
    expect((threeRes.data as any).html).toContain("inkThreeCanvas");

    // 5. ink_script_logic
    const scriptRes = await scriptTool.execute({ pattern: "state-store", moduleName: "AppStore" });
    expect(scriptRes.status).toBe("success");
    expect((scriptRes.data as any).code).toContain("class AppStore");

    // 6. ink_security_audit
    const secRes = await securityTool.execute({ code: "const x = 1;" });
    expect(secRes.status).toBe("success");
    expect((secRes.data as any).passed).toBe(true);

    // 7. ink_validate_design
    const valRes = await validateTool.execute({ code: "<main></main>", foregroundHex: "#ffffff", backgroundHex: "#000000" });
    expect(valRes.status).toBe("success");
    expect((valRes.data as any).craftScore).toBeDefined();
  });

  it("exposes ink://master/philosophy resource returning constitution text", async () => {
    const res = inkResources.find((r) => r.uri === "ink://master/philosophy");
    expect(res).toBeDefined();
    const data = await res!.read();
    expect(data.contents[0]!.text).toContain("INK_MASTER");
  });

  it("generates structured prompt messages for creative direction", () => {
    const prompt = inkPrompts.find((p) => p.name === "ink_creative_direction");
    expect(prompt).toBeDefined();
    const generated = prompt!.generateMessages({ product_description: "Fintech Dashboard", desired_vibe: "luxury-dark" });
    expect(generated.messages[0]!.content.text).toContain("Fintech Dashboard");
    expect(generated.messages[0]!.content.text).toContain("luxury-dark");
  });
});
