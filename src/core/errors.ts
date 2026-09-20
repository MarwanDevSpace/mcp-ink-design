/**
 * Domain and protocol error taxonomy
 */

export type ErrorCode =
  | "INVALID_INPUT"
  | "SCHEMA_VIOLATION"
  | "SECURITY_VIOLATION"
  | "VERIFICATION_FAILED"
  | "PYTHON_EXECUTION_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export class McpInkError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "McpInkError";
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, McpInkError.prototype);
  }

  public toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}
