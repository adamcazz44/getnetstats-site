import { ApiException } from "./errors";

/**
 * Bounded upstream fetch: every external call is time-limited and its failure
 * modes are mapped to stable API error codes (UPSTREAM_TIMEOUT / UPSTREAM_ERROR).
 * Returns the raw Response so callers can branch on status.
 */
export async function fetchUpstream(
  url: string,
  opts: { timeoutMs?: number; headers?: Record<string, string> } = {},
): Promise<Response> {
  const timeoutMs = opts.timeoutMs ?? 8000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { accept: "application/json", ...opts.headers },
      cache: "no-store",
    });
  } catch (e) {
    if (controller.signal.aborted) {
      throw new ApiException("UPSTREAM_TIMEOUT", "The upstream service timed out.", 504);
    }
    throw new ApiException("UPSTREAM_ERROR", "Could not reach the upstream service.", 502);
  } finally {
    clearTimeout(timer);
  }
}

/** fetchUpstream + JSON parse, mapping parse failures to UPSTREAM_ERROR. */
export async function fetchUpstreamJson<T = unknown>(
  url: string,
  opts: { timeoutMs?: number; headers?: Record<string, string> } = {},
): Promise<{ status: number; json: T }> {
  const res = await fetchUpstream(url, opts);
  let json: T;
  try {
    json = (await res.json()) as T;
  } catch {
    throw new ApiException("UPSTREAM_ERROR", "Upstream returned an invalid response.", 502);
  }
  return { status: res.status, json };
}
