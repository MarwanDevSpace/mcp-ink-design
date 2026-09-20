/**
 * Central MCP Server Assembly
 * Registers tools, resources, and prompts under the Ink Design architecture.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadConfig } from "./config/index.js";
import { logger } from "./core/logger.js";
import { ResultEnvelope } from "./core/result-envelope.js";

import {
  CreateBaseInputSchema,
  PaletteTokensInputSchema,
  CraftComponentInputSchema,
  ThreeExperienceInputSchema,
  ScriptLogicInputSchema,
  SecurityAuditInputSchema,
  ValidateDesignInputSchema,
  PythonRunnerInputSchema
} from "./contracts/index.js";

import { createBaseTool } from "./tools/base.tool.js";
import { tokensTool } from "./tools/tokens.tool.js";
import { componentTool } from "./tools/component.tool.js";
import { threejsTool } from "./tools/threejs.tool.js";
import { scriptTool } from "./tools/script.tool.js";
import { securityTool } from "./tools/security.tool.js";
import { validateTool } from "./tools/validate.tool.js";
import { pythonRunnerTool } from "./tools/python-runner.tool.js";
import { inkResources } from "./resources/index.js";
import { inkPrompts } from "./prompts/index.js";

export function createServer(): McpServer {
  const config = loadConfig();

  const server = new McpServer({
    name: config.serverName,
    version: config.serverVersion
  });

  const formatToolResult = (envelope: ResultEnvelope<unknown>) => {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(envelope, null, 2)
        }
      ]
    };
  };

  // 1. ink_create_base
  server.tool(
    createBaseTool.name,
    createBaseTool.description,
    CreateBaseInputSchema.shape,
    async (args) => {
      logger.debug(`Executing ${createBaseTool.name}`, args);
      const res = await createBaseTool.execute(args);
      return formatToolResult(res);
    }
  );

  // 2. ink_design_palette_tokens
  server.tool(
    tokensTool.name,
    tokensTool.description,
    PaletteTokensInputSchema.shape,
    async (args) => {
      logger.debug(`Executing ${tokensTool.name}`, args);
      const res = await tokensTool.execute(args);
      return formatToolResult(res);
    }
  );

  // 3. ink_craft_component
  server.tool(
    componentTool.name,
    componentTool.description,
    CraftComponentInputSchema.shape,
    async (args) => {
      logger.debug(`Executing ${componentTool.name}`, args);
      const res = await componentTool.execute(args);
      return formatToolResult(res);
    }
  );

  // 4. ink_threejs_experience
  server.tool(
    threejsTool.name,
    threejsTool.description,
    ThreeExperienceInputSchema.shape,
    async (args) => {
      logger.debug(`Executing ${threejsTool.name}`, args);
      const res = await threejsTool.execute(args);
      return formatToolResult(res);
    }
  );

  // 5. ink_script_logic
  server.tool(
    scriptTool.name,
    scriptTool.description,
    ScriptLogicInputSchema.shape,
    async (args) => {
      logger.debug(`Executing ${scriptTool.name}`, args);
      const res = await scriptTool.execute(args);
      return formatToolResult(res);
    }
  );

  // 6. ink_security_audit
  server.tool(
    securityTool.name,
    securityTool.description,
    SecurityAuditInputSchema.shape,
    async (args) => {
      logger.debug(`Executing ${securityTool.name}`, args);
      const res = await securityTool.execute(args);
      return formatToolResult(res);
    }
  );

  // 7. ink_validate_design
  server.tool(
    validateTool.name,
    validateTool.description,
    ValidateDesignInputSchema.shape,
    async (args) => {
      logger.debug(`Executing ${validateTool.name}`, args);
      const res = await validateTool.execute(args);
      return formatToolResult(res);
    }
  );

  // 8. ink_python_test_runner
  server.tool(
    pythonRunnerTool.name,
    pythonRunnerTool.description,
    PythonRunnerInputSchema.shape,
    async (args) => {
      logger.debug(`Executing ${pythonRunnerTool.name}`, args);
      const res = await pythonRunnerTool.execute(args);
      return formatToolResult(res);
    }
  );

  // Register MCP Resources
  for (const r of inkResources) {
    server.resource(r.name, r.uri, async (uri) => {
      logger.debug(`Reading resource ${uri.href}`);
      const data = await r.read();
      return {
        contents: data.contents.map((c) => ({
          uri: uri.href,
          mimeType: c.mimeType,
          text: c.text
        }))
      };
    });
  }

  // Register MCP Prompts
  for (const p of inkPrompts) {
    const promptArgsShape: Record<string, z.ZodTypeAny> = {};
    if (p.arguments) {
      for (const a of p.arguments) {
        promptArgsShape[a.name] = a.required ? z.string() : z.string().optional();
      }
    }

    server.prompt(p.name, p.description, promptArgsShape, async (args) => {
      logger.debug(`Generating prompt ${p.name}`, args);
      return p.generateMessages(args as Record<string, string>);
    });
  }

  return server;
}
