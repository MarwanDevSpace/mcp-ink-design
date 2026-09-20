/**
 * Stderr-only logger to preserve stdout purity for MCP stdio protocol.
 */

export const logger = {
  debug(msg: string, meta?: unknown) {
    if (process.env.INK_LOG_LEVEL === "debug") {
      process.stderr.write(`[DEBUG] [mcp-ink-design] ${msg} ${meta ? JSON.stringify(meta) : ""}\n`);
    }
  },
  info(msg: string, meta?: unknown) {
    process.stderr.write(`[INFO]  [mcp-ink-design] ${msg} ${meta ? JSON.stringify(meta) : ""}\n`);
  },
  warn(msg: string, meta?: unknown) {
    process.stderr.write(`[WARN]  [mcp-ink-design] ${msg} ${meta ? JSON.stringify(meta) : ""}\n`);
  },
  error(msg: string, meta?: unknown) {
    process.stderr.write(`[ERROR] [mcp-ink-design] ${msg} ${meta ? JSON.stringify(meta) : ""}\n`);
  }
};
