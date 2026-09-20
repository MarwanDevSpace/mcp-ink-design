/**
 * Python Verification Bridge
 * Safely executes Python ink_verifier via child_process using stdin JSON streaming.
 */

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { logger } from "../../core/logger.js";
import { McpInkError } from "../../core/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface PythonRunnerOptions {
  action: "contrast" | "security" | "visual" | "audit" | "full";
  payload: Record<string, unknown>;
  pythonPath?: string;
  timeoutMs?: number;
}

export interface PythonRunnerResult {
  action: string;
  status: "success" | "error";
  data?: unknown;
  message?: string;
}

export class PythonBridge {
  public static getPythonScriptPath(): string {
    const candidates = [
      path.resolve(process.cwd(), "python/ink_verifier/cli.py"),
      path.resolve(__dirname, "../../../python/ink_verifier/cli.py"),
      path.resolve(__dirname, "../../python/ink_verifier/cli.py")
    ];

    for (const c of candidates) {
      if (fs.existsSync(c)) {
        return c;
      }
    }
    return candidates[0]!;
  }

  public static async execute(options: PythonRunnerOptions): Promise<PythonRunnerResult> {
    const {
      action,
      payload,
      pythonPath = process.env.INK_PYTHON_PATH || "python",
      timeoutMs = 12000
    } = options;

    const scriptPath = this.getPythonScriptPath();

    if (!fs.existsSync(scriptPath)) {
      throw new McpInkError(
        "PYTHON_EXECUTION_ERROR",
        `Python verifier script not found at ${scriptPath}`
      );
    }

    return new Promise((resolve, reject) => {
      const child = spawn(pythonPath, ["-m", "python.ink_verifier.cli", "--action", action, "--stdin"], {
        cwd: process.cwd(),
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, PYTHONPATH: process.cwd() }
      });

      let stdoutData = "";
      let stderrData = "";
      let isTimedOut = false;

      const timer = setTimeout(() => {
        isTimedOut = true;
        child.kill();
        reject(
          new McpInkError(
            "PYTHON_EXECUTION_ERROR",
            `Python process timed out after ${timeoutMs}ms`
          )
        );
      }, timeoutMs);

      child.stdout.on("data", (chunk) => {
        stdoutData += chunk.toString("utf-8");
      });

      child.stderr.on("data", (chunk) => {
        stderrData += chunk.toString("utf-8");
      });

      child.on("error", (err) => {
        clearTimeout(timer);
        logger.error("Failed to spawn python verifier", err);
        reject(
          new McpInkError(
            "PYTHON_EXECUTION_ERROR",
            `Failed to execute Python process: ${err.message}`,
            { stderr: stderrData }
          )
        );
      });

      child.on("close", (code) => {
        clearTimeout(timer);
        if (isTimedOut) return;

        if (code !== 0) {
          logger.warn(`Python runner exited with code ${code}`, { stderr: stderrData });
          resolve({
            action,
            status: "error",
            message: stderrData.trim() || `Python exited with code ${code}`,
            data: null
          });
          return;
        }

        try {
          const parsed = JSON.parse(stdoutData.trim());
          resolve(parsed as PythonRunnerResult);
        } catch (parseErr) {
          logger.error("Failed to parse Python JSON output", { stdout: stdoutData, err: parseErr });
          resolve({
            action,
            status: "error",
            message: `Invalid JSON returned by python script: ${stdoutData.slice(0, 200)}`,
            data: null
          });
        }
      });

      // Write payload to stdin and close
      try {
        child.stdin.write(JSON.stringify(payload));
        child.stdin.end();
      } catch (writeErr) {
        clearTimeout(timer);
        reject(
          new McpInkError(
            "PYTHON_EXECUTION_ERROR",
            `Failed to write to Python stdin: ${String(writeErr)}`
          )
        );
      }
    });
  }
}
