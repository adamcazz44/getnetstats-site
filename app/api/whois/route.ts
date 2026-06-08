import {
  assertSameOrigin,
  errorResponse,
  successResponse,
  toApiException,
} from "@/lib/api/http";
import { validateDomain } from "@/lib/api/validate";
import { clientIp, enforceRateLimit } from "@/lib/api/ratelimit";
import { cached } from "@/lib/api/cache";
import { whoisLookup } from "@/lib/whois/rdap";

// Needs the Node runtime: the SSRF guard resolves hostnames via node:dns.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WHOIS_TTL_MS = 5 * 60 * 1000; // short cache — registration data moves slowly
const RATE_LIMIT = 30; // requests…
const RATE_WINDOW_MS = 60 * 1000; // …per IP per minute

/**
 * GET /api/whois?target=<domain>
 *
 * Reference implementation for the Tier 2 serverless pattern: same-origin lock,
 * strict validation, per-IP rate limit, short-TTL cache, RDAP lookup via the
 * IANA bootstrap, and the uniform { ok, tool, target, data, cached, tookMs }
 * response. All the guards live in lib/api/* so the next endpoints reuse them.
 */
export async function GET(req: Request): Promise<Response> {
  const start = Date.now();
  try {
    assertSameOrigin(req);

    const { searchParams } = new URL(req.url);
    const domain = validateDomain(
      searchParams.get("target") ?? searchParams.get("domain"),
    );

    enforceRateLimit(`whois:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS);

    const { value, cached: wasCached } = await cached(
      `whois:${domain}`,
      WHOIS_TTL_MS,
      () => whoisLookup(domain),
    );

    return successResponse("whois", domain, value, wasCached, Date.now() - start);
  } catch (e) {
    return errorResponse(toApiException(e));
  }
}
