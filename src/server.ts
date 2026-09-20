/**
 * Central MCP Server Assembly
 * Registers tools, resources, and prompts under the Ink Design architecture.
 * Upgraded to Glama Benchmark Tier-S (5.0/5.0) standards:
 * - Uses server.registerTool with explicit titles, outputSchemas, and annotations
 * - Dual result formatting (content string for compatibility + structuredContent matching outputSchema)
 * - Strict verb_noun naming
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadConfig } from "./config/index.js";
import { logger } from "./core/logger.js";
import { ResultEnvelope } from "./core/result-envelope.js";

import { createBaseTool } from "./tools/base.tool.js";
import { tokensTool } from "./tools/tokens.tool.js";
import { componentTool } from "./tools/component.tool.js";
import { threejsTool } from "./tools/threejs.tool.js";
import { scriptTool } from "./tools/script.tool.js";
import { securityTool } from "./tools/security.tool.js";
import { validateTool } from "./tools/validate.tool.js";
import { pythonRunnerTool } from "./tools/python-runner.tool.js";
import { captureTool } from "./tools/capture.tool.js";
import { inspectTool } from "./tools/inspect.tool.js";
import { assetsTool } from "./tools/assets.tool.js";
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
      ],
      structuredContent: envelope as Record<string, unknown>
    };
  };

  // List of all 11 standardized tools
  const tools = [
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

  // Register all 11 tools with full schema contracts and annotations
  for (const tool of tools) {
    (server as any).registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema.shape,
        outputSchema: tool.outputSchema.shape,
        annotations: tool.annotations
      },
      async (args: any) => {
        logger.debug(`Executing ${tool.name}`, args);
        const res = await tool.execute(args);
        return formatToolResult(res);
      }
    );
  }

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
