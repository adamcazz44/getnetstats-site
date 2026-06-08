import { ApiException } from "./errors";

/**
 * Per-IP fixed-window rate limiter.
 *
 * NOTE: in-memory and per-instance (same caveat as the cache) — swap for a
 * managed limiter (Upstash/host built-in) in production. Signature is stable.
 */

interface Bucket {
  count: number;
  reset: number; // epoch ms when the window resets
}

const buckets = new Map<string, Bucket>();

/** Best-effort client IP from proxy headers. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/** Throws RATE_LIMITED (with Retry-After) when the per-key budget is exceeded. */
export function enforceRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): void {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return;
  }
  if (b.count >= limit) {
    throw new ApiException("RATE_LIMITED", "Too many requests — slow down.", 429, {
      retryAfter: Math.max(1, Math.ceil((b.reset - now) / 1000)),
    });
  }
  b.count++;
}
