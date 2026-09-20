/**
 * Standard Result Envelope per MarwanDevMCP's standard
 */

export type EnvelopeStatus = "success" | "partial" | "blocked" | "failed";

export interface ResultEvidence {
  inputsDigest?: string;
  sources?: Array<{ label: string; uri?: string; retrievedAt?: string }>;
  artifacts?: Array<{ label: string; uri?: string; sha256?: string }>;
}

export interface ResultEnvelope<T = unknown> {
  status: EnvelopeStatus;
  summary: string;
  data: T;
  warnings: string[];
  evidence: ResultEvidence;
  nextActions?: string[];
}

export function createSuccessEnvelope<T>(
  summary: string,
  data: T,
  options?: {
    warnings?: string[];
    evidence?: ResultEvidence;
    nextActions?: string[];
  }
): ResultEnvelope<T> {
  return {
    status: "success",
    summary,
    data,
    warnings: options?.warnings ?? [],
    evidence: options?.evidence ?? {},
    nextActions: options?.nextActions ?? []
  };
}

export function createErrorEnvelope<T = Record<string, unknown>>(
  summary: string,
  errorData: T,
  options?: {
    warnings?: string[];
    evidence?: ResultEvidence;
    nextActions?: string[];
    status?: EnvelopeStatus;
  }
): ResultEnvelope<T> {
  return {
    status: options?.status ?? "failed",
    summary,
    data: errorData,
    warnings: options?.warnings ?? [],
    evidence: options?.evidence ?? {},
    nextActions: options?.nextActions ?? []
  };
}
