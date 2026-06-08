/* Shared response contract for all Tier 2 serverless tools.
   Every /api/<tool> returns one of these shapes so the front-end can render
   any tool off the same structure. */

export type ApiErrorCode =
  | "INVALID_TARGET" // malformed/missing input
  | "BLOCKED_TARGET" // SSRF guard rejected the resolved host
  | "UNSUPPORTED_TLD" // no RDAP/data source for this TLD
  | "NOT_FOUND" // upstream says the target doesn't exist
  | "RATE_LIMITED" // per-IP limiter tripped
  | "FORBIDDEN" // cross-origin / not same-site
  | "UPSTREAM_TIMEOUT" // bounded upstream call timed out
  | "UPSTREAM_ERROR"; // upstream failed / unexpected error

export interface ApiSuccess<T> {
  ok: true;
  tool: string;
  target: string;
  data: T;
  cached: boolean;
  tookMs: number;
}

export interface ApiError {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
