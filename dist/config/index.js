/**
 * Server Configuration and Environment Options
 */
export function loadConfig() {
    return {
        serverName: "mcp-ink-design",
        serverVersion: "1.2.0",
        logLevel: process.env.INK_LOG_LEVEL || "info",
        pythonExecutable: process.env.INK_PYTHON_PATH || "python",
        projectRoot: process.cwd()
    };
}
//# sourceMappingURL=index.js.map