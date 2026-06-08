import type { ApiErrorCode } from "./types";

/** Throwable error that carries an HTTP status + the stable API error code.
 *  Route handlers catch this and map it to the uniform error response. */
export class ApiException extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly status: number,
    public readonly opts: {
      retryAfter?: number;
      details?: Record<string, unknown>;
    } = {},
  ) {
    super(message);
    this.name = "ApiException";
  }
}
