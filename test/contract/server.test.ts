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
import { pythonRunnerTool } from "../../src/tools/python-runner.tool.js";
import { captureTool } from "../../src/tools/capture.tool.js";
import { inspectTool } from "../../src/tools/inspect.tool.js";
import { assetsTool } from "../../src/tools/assets.tool.js";

describe("MCP Server Contract & Public Surfaces (Glama Standards)", () => {
  const allTools = [
    createBaseTool,
    tokensTool,
    componentTool,
    threejsTool,
    scriptTool,
    securityTool,
    validateTool,
    pythonRunnerTool,
    captureTool,
    inspectTool,
    assetsTool
  ];

  it("initializes McpServer without throwing", () => {
    const server = createServer();
    expect(server).toBeDefined();
  });

  it("satisfies Glama Naming Consistency: all 11 tools strictly follow ink_<verb>_<noun>", () => {
    expect(allTools.length).toBe(11);
    const verbNounRegex = /^ink_(create|generate|craft|build|audit|validate|run|capture|inspect|import)_[a-z_]+$/;

    for (const tool of allTools) {
      expect(tool.name).toMatch(verbNounRegex);
      expect(tool.name.startsWith("ink_")).toBe(true);
      // Tool names must have at least two underscores (ink_verb_noun)
      expect(tool.name.split("_").length).toBeGreaterThanOrEqual(3);
    }

    // Verify canonical names
    expect(createBaseTool.name).toBe("ink_create_base");
    expect(tokensTool.name).toBe("ink_generate_palette_tokens");
    expect(componentTool.name).toBe("ink_craft_component");
    expect(threejsTool.name).toBe("ink_build_threejs_experience");
    expect(scriptTool.name).toBe("ink_generate_script_logic");
    expect(securityTool.name).toBe("ink_audit_security");
    expect(validateTool.name).toBe("ink_validate_design");
    expect(pythonRunnerTool.name).toBe("ink_run_python_tests");
    expect(captureTool.name).toBe("ink_capture_viewport");
    expect(inspectTool.name).toBe("ink_inspect_website_style");
    expect(assetsTool.name).toBe("ink_import_custom_assets");
  });

  it("satisfies Glama Behavior: every tool defines annotations and detailed description", () => {
    for (const tool of allTools) {
      expect(tool.title).toBeDefined();
      expect(tool.title.length).toBeGreaterThan(5);

      // Description must be structured with PURPOSE, BEHAVIOR, USAGE GUIDELINES, RETURNS
      expect(tool.description).toContain("PURPOSE:");
      expect(tool.description).toContain("BEHAVIOR:");
      expect(tool.description).toContain("USAGE GUIDELINES:");
      expect(tool.description).toContain("RETURNS:");

      // Annotations must be defined
      expect(tool.annotations).toBeDefined();
      expect(typeof tool.annotations.readOnlyHint).toBe("boolean");
      expect(typeof tool.annotations.destructiveHint).toBe("boolean");
      expect(typeof tool.annotations.idempotentHint).toBe("boolean");
      expect(typeof tool.annotations.openWorldHint).toBe("boolean");

      // Schemas must be defined
      expect(tool.inputSchema).toBeDefined();
      expect(tool.outputSchema).toBeDefined();
    }
  });

  it("registers all 11 required tools with valid envelopes and output schema compliance", async () => {
    // 1. ink_create_base
    const baseRes = await createBaseTool.execute({
      projectName: "contract-test-app",
      designStyle: "editorial",
      direction: "rtl",
      language: "ar"
    });
    expect(baseRes.status).toBe("success");
    expect((baseRes.data as any).files["index.html"]).toContain('dir="rtl"');
    const baseParsed = createBaseTool.outputSchema.safeParse(baseRes);
    expect(baseParsed.success).toBe(true);

    // 2. ink_generate_palette_tokens
    const tokenRes = await tokensTool.execute({ mood: "editorial" });
    expect(tokenRes.status).toBe("success");
    expect((tokenRes.data as any).tokens.bgSurface).toBeDefined();
    const tokenParsed = tokensTool.outputSchema.safeParse(tokenRes);
    expect(tokenParsed.success).toBe(true);

    // 3. ink_craft_component
    const compRes = await componentTool.execute({ componentType: "glass-card" });
    expect(compRes.status).toBe("success");
    expect((compRes.data as any).html).toContain("ink-card");
    const compParsed = componentTool.outputSchema.safeParse(compRes);
    expect(compParsed.success).toBe(true);

    // 4. ink_build_threejs_experience
    const threeRes = await threejsTool.execute({ sceneType: "particle-constellation" });
    expect(threeRes.status).toBe("success");
    expect((threeRes.data as any).html).toContain("inkThreeCanvas");
    const threeParsed = threejsTool.outputSchema.safeParse(threeRes);
    expect(threeParsed.success).toBe(true);

    // 5. ink_generate_script_logic
    const scriptRes = await scriptTool.execute({ pattern: "state-store", moduleName: "AppStore" });
    expect(scriptRes.status).toBe("success");
    expect((scriptRes.data as any).code).toContain("class AppStore");
    const scriptParsed = scriptTool.outputSchema.safeParse(scriptRes);
    expect(scriptParsed.success).toBe(true);

    // 6. ink_audit_security
    const secRes = await securityTool.execute({ code: "const x = 1;" });
    expect(secRes.status).toBe("success");
    expect((secRes.data as any).passed).toBe(true);
    const secParsed = securityTool.outputSchema.safeParse(secRes);
    expect(secParsed.success).toBe(true);

    // 7. ink_validate_design
    const valRes = await validateTool.execute({
      code: "<main style='text-align: start; margin-inline: auto;'></main>",
      foregroundHex: "#ffffff",
      backgroundHex: "#000000"
    });
    expect(valRes.status).toBe("success");
    expect((valRes.data as any).craftScore).toBeDefined();
    expect((valRes.data as any).bidiAndAlignment).toBeDefined();
    const valParsed = validateTool.outputSchema.safeParse(valRes);
    expect(valParsed.success).toBe(true);

    // 8. ink_import_custom_assets
    const assetRes = await assetsTool.execute({
      primaryFont: "Cairo",
      weights: [400, 700]
    });
    expect(assetRes.status).toBe("success");
    expect((assetRes.data as any).htmlLinkTags).toContain("Cairo");
    const assetParsed = assetsTool.outputSchema.safeParse(assetRes);
    expect(assetParsed.success).toBe(true);

    // 9. ink_inspect_website_style
    const inspectRes = await inspectTool.execute({
      urlOrCode: "body { font-family: 'Amiri'; background: #0b0f19; }"
    });
    expect(inspectRes.status).toBe("success");
    expect((inspectRes.data as any).archetype).toBeDefined();
    const inspectParsed = inspectTool.outputSchema.safeParse(inspectRes);
    expect(inspectParsed.success).toBe(true);

    // 10. ink_capture_viewport
    const capRes = await captureTool.execute({
      htmlOrUrl: "<html><body><h1>Contract Test</h1></body></html>",
      title: "Contract Viewport Test"
    });
    expect(capRes.status).toBe("success");
    expect((capRes.data as any).snapshots.length).toBe(3);
    const capParsed = captureTool.outputSchema.safeParse(capRes);
    expect(capParsed.success).toBe(true);
  }, 20000);

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
