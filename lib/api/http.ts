import { NextResponse } from "next/server";
import { ApiException } from "./errors";
import type { ApiError } from "./types";

/** Origins allowed to call the functions from a browser. These functions are
 *  not a public API — keep them locked to the site's own origin(s). */
const ALLOWED_ORIGINS = (
  process.env.API_ALLOWED_ORIGINS ||
  "http://localhost:3000,https://getnetstats.com,https://www.getnetstats.com"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/**
 * Reject cross-origin browser calls. Same-origin GETs don't send an Origin
 * header (and server-to-server callers omit it), so a missing Origin is fine;
 * a present-but-unlisted Origin is forbidden. We intentionally never emit
 * Access-Control-Allow-Origin, so other sites' browsers can't read responses.
 */
export function assertSameOrigin(req: Request): void {
  const origin = req.headers.get("origin");
  if (!origin) return;
  let normalized: string;
  try {
    normalized = new URL(origin).origin;
  } catch {
    throw new ApiException("FORBIDDEN", "Malformed Origin header.", 403);
  }
  if (!ALLOWED_ORIGINS.includes(normalized)) {
    throw new ApiException("FORBIDDEN", "Cross-origin requests are not allowed.", 403);
  }
}

export function successResponse<T>(
  tool: string,
  target: string,
  data: T,
  cached: boolean,
  tookMs: number,
): NextResponse {
  return NextResponse.json({ ok: true, tool, target, data, cached, tookMs });
}

export function errorResponse(e: ApiException): NextResponse {
  const headers: Record<string, string> = {};
  if (e.opts.retryAfter != null) headers["Retry-After"] = String(e.opts.retryAfter);
  const body: ApiError = {
    ok: false,
    error: {
      code: e.code,
      message: e.message,
      ...(e.opts.details ? { details: e.opts.details } : {}),
    },
  };
  return NextResponse.json(body, { status: e.status, headers });
}

/** Normalize any thrown value into an ApiException for the error response. */
export function toApiException(e: unknown): ApiException {
  if (e instanceof ApiException) return e;
  return new ApiException("UPSTREAM_ERROR", "An unexpected error occurred.", 502);
}
