#!/usr/bin/env node
/**
 * Stdio Transport Entry Point for mcp-ink-design
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { logger } from "./core/logger.js";
import { loadConfig } from "./config/index.js";

async function main() {
  const config = loadConfig();
  logger.info(`Starting ${config.serverName} v${config.serverVersion} on stdio transport...`);

  const server = createServer();
  const transport = new StdioServerTransport();

  process.on("SIGINT", async () => {
    logger.info("Received SIGINT, closing server...");
    await server.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    logger.info("Received SIGTERM, closing server...");
    await server.close();
    process.exit(0);
  });

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", reason);
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", error);
    process.exit(1);
  });

  await server.connect(transport);
  logger.info(`${config.serverName} connected and listening on stdio.`);
}

main().catch((err) => {
  logger.error("Fatal startup error", err);
  process.exit(1);
});
