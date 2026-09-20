/**
 * Server Configuration and Environment Options
 */

export interface ServerConfig {
  serverName: string;
  serverVersion: string;
  logLevel: "debug" | "info" | "warn" | "error";
  pythonExecutable: string;
  projectRoot: string;
}

export function loadConfig(): ServerConfig {
  return {
    serverName: "mcp-ink-design",
    serverVersion: "1.0.0",
    logLevel: (process.env.INK_LOG_LEVEL as ServerConfig["logLevel"]) || "info",
    pythonExecutable: process.env.INK_PYTHON_PATH || "python",
    projectRoot: process.cwd()
  };
}
