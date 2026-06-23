/* ===========================================================
   GetNetStats — client-side ASN & routing lookup.
   Tier 1, no backend: reuses the same public IP APIs as the homepage
   (ipwho.is primary, ipapi.co fallback) to surface ASN / AS org /
   ISP / location for any IP, plus a best-effort connection-type
   classification derived from the network operator's name.
   Honest: connection type is an ESTIMATE inferred from the AS org,
   not a guaranteed fact; location is approximate. Nothing is stored.
   =========================================================== */

export type ConnectionClass = "Hosting / datacenter" | "Mobile / cellular" | "Residential / ISP" | "Unknown";

export interface AsnInfo {
  ip: string;
  version: string; // IPv4 / IPv6
  asn: string | null; // e.g. "AS15169"
  org: string | null; // AS organization
  isp: string | null; // network operator / ISP
  connectionType: ConnectionClass; // best-effort, estimated
  city: string | null;
  region: string | null;
  country: string | null;
  source: "ipwho.is" | "ipapi.co";
}

const HOSTING_RE =
  /\b(hosting|host|cloud|data ?cent(er|re)|server|colo|amazon|aws|google|microsoft|azure|digital ?ocean|ovh|linode|hetzner|vultr|leaseweb|akamai|fastly|cloudflare|oracle|gcore|scaleway|contabo|godaddy|namecheap|m247|choopa|quadranet)\b/i;
const MOBILE_RE =
  /\b(mobile|wireless|cellular|vodafone|t-?mobile|verizon wireless|at&t mobility|orange|telekom|lte|gsm|cellco|sprint pcs)\b/i;

/** Best-effort classification from the operator/org/domain text. Estimated. */
export function classifyConnection(text: string | null | undefined): ConnectionClass {
  const t = (text ?? "").trim();
  if (!t) return "Unknown";
  if (HOSTING_RE.test(t)) return "Hosting / datacenter";
  if (MOBILE_RE.test(t)) return "Mobile / cellular";
  return "Residential / ISP";
}

export function normalizeIp(input: string): string {
  return input.trim().replace(/^\[|\]$/g, "");
}

export function isValidIp(s: string): boolean {
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(s)) return s.split(".").every((o) => Number(o) <= 255);
  // loose IPv6: hex groups + colons, at most one "::"
  return /^[0-9a-f:]+$/i.test(s) && s.includes(":") && (s.match(/::/g) ?? []).length <= 1;
}

function fetchT(url: string, ms: number, signal?: AbortSignal): Promise<Response> {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  if (signal) signal.addEventListener("abort", () => c.abort(), { once: true });
  return fetch(url, { signal: c.signal, cache: "no-store" }).finally(() => clearTimeout(t));
}

/** Look up routing data for an IP (omit `ip` for the visitor's own).
 *  ipwho.is primary, ipapi.co fallback — same discipline as the homepage. */
export async function lookupAsn(ip?: string, signal?: AbortSignal): Promise<AsnInfo> {
  // ---- primary: ipwho.is ----
  try {
    const r = await fetchT(`https://ipwho.is/${ip ?? ""}`, 7000, signal);
    const j = await r.json();
    if (j && j.success !== false && j.ip) {
      const conn = j.connection || {};
      const org = conn.org || j.org || null;
      const isp = conn.isp || conn.org || null;
      return {
        ip: j.ip,
        version: j.type || (String(j.ip).includes(":") ? "IPv6" : "IPv4"),
        asn: conn.asn ? `AS${conn.asn}` : null,
        org,
        isp,
        connectionType: classifyConnection(`${org ?? ""} ${isp ?? ""} ${conn.domain ?? ""}`),
        city: j.city ?? null,
        region: j.region ?? null,
        country: j.country ?? null,
        source: "ipwho.is",
      };
    }
  } catch (err) {
    if (signal?.aborted) throw err;
    /* fall through to fallback */
  }

  // ---- fallback: ipapi.co ----
  try {
    const r = await fetchT(`https://ipapi.co/${ip ? `${ip}/` : ""}json/`, 7000, signal);
    const j = await r.json();
    if (j && j.ip && !j.error) {
      const org = j.org || null;
      return {
        ip: j.ip,
        version: j.version || (String(j.ip).includes(":") ? "IPv6" : "IPv4"),
        asn: j.asn || null,
        org,
        isp: org,
        connectionType: classifyConnection(org),
        city: j.city ?? null,
        region: j.region ?? null,
        country: j.country_name ?? null,
        source: "ipapi.co",
      };
    }
  } catch (err) {
    if (signal?.aborted) throw err;
    /* fall through */
  }

  throw new Error("asn-unavailable");
}
