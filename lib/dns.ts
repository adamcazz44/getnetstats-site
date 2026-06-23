/* ===========================================================
   GetNetStats — client-side DNS lookup via DNS-over-HTTPS (DoH).
   Tier 1, no backend: queries public, CORS-enabled JSON resolvers
   directly from the browser. Cloudflare is primary; Google is the
   fallback if Cloudflare errors at the network level.
   Honest: the query goes to a PUBLIC resolver — it is not private the
   way a local lookup is. Nothing is stored here.
   =========================================================== */

export const DNS_TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME"] as const;
export type DnsType = (typeof DNS_TYPES)[number];

/** Human label shown next to each record type. */
export const DNS_TYPE_LABELS: Record<DnsType, string> = {
  A: "IPv4 address",
  AAAA: "IPv6 address",
  MX: "Mail servers",
  TXT: "Text records",
  NS: "Name servers",
  CNAME: "Canonical name (alias)",
};

/** DoH `type` numbers (RFC 1035 / 3596). */
const TYPE_NUM: Record<DnsType, number> = { A: 1, AAAA: 28, MX: 15, TXT: 16, NS: 2, CNAME: 5 };

const RESOLVERS = {
  Cloudflare: "https://cloudflare-dns.com/dns-query",
  Google: "https://dns.google/resolve",
} as const;
export type ResolverName = keyof typeof RESOLVERS;

export interface DnsRecord {
  value: string; // display value (mono)
  priority?: number; // MX only
  ttl?: number;
}
export type DnsRecords = Record<DnsType, DnsRecord[]>;

export interface DnsLookupResult {
  domain: string;
  resolver: ResolverName;
  records: DnsRecords;
  notFound: boolean; // NXDOMAIN — domain doesn't exist
}

interface DohAnswer {
  name: string;
  type: number;
  TTL?: number;
  data: string;
}
interface DohResponse {
  Status: number; // DNS RCODE: 0 = NOERROR, 3 = NXDOMAIN
  Answer?: DohAnswer[];
}

/** Strip scheme/path/trailing-dot and lowercase, so a pasted URL still works. */
export function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "") // scheme
    .replace(/\/.*$/, "") // path/query
    .replace(/\.$/, ""); // trailing dot
}

/** Light sanity check — the resolver rejects true garbage anyway. */
export function isValidDomain(d: string): boolean {
  return /^(?=.{1,253}$)([a-z0-9](-?[a-z0-9])*\.)+[a-z]{2,}$/.test(d);
}

function parseData(type: DnsType, raw: string): DnsRecord {
  if (type === "MX") {
    // "10 mail.example.com." → priority 10, host mail.example.com
    const m = raw.match(/^(\d+)\s+(.+?)\.?$/);
    return m ? { value: m[2], priority: Number(m[1]) } : { value: raw };
  }
  if (type === "TXT") {
    // DoH returns TXT quoted, and long strings arrive as chunked quoted
    // segments: "v=spf1 ..." "more" — join them and drop the quotes.
    const parts = raw.match(/"((?:[^"\\]|\\.)*)"/g);
    const text = parts
      ? parts.map((p) => p.slice(1, -1).replace(/\\"/g, '"')).join("")
      : raw.replace(/^"|"$/g, "");
    return { value: text };
  }
  // NS / CNAME usually carry a trailing dot
  return { value: raw.replace(/\.$/, "") };
}

async function queryType(
  base: string,
  domain: string,
  type: DnsType,
  signal?: AbortSignal,
): Promise<{ status: number; records: DnsRecord[] }> {
  const url = `${base}?name=${encodeURIComponent(domain)}&type=${type}`;
  const res = await fetch(url, { headers: { Accept: "application/dns-json" }, signal });
  if (!res.ok) throw new Error(`DoH HTTP ${res.status}`);
  const json: DohResponse = await res.json();
  let records = (json.Answer ?? [])
    .filter((a) => a.type === TYPE_NUM[type]) // ignore CNAME chains in A answers, etc.
    .map((a) => ({ ...parseData(type, a.data), ttl: a.TTL }));
  if (type === "MX") records = records.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  return { status: json.Status, records };
}

async function resolveWith(
  name: ResolverName,
  domain: string,
  signal?: AbortSignal,
): Promise<DnsLookupResult> {
  const base = RESOLVERS[name];
  const results = await Promise.all(DNS_TYPES.map((t) => queryType(base, domain, t, signal)));
  const records = {} as DnsRecords;
  DNS_TYPES.forEach((t, i) => {
    records[t] = results[i].records;
  });
  const allEmpty = results.every((r) => r.records.length === 0);
  const notFound = allEmpty && results.some((r) => r.status === 3);
  return { domain, resolver: name, records, notFound };
}

/** Look up all record types for a domain. Cloudflare first; on a network-level
 *  failure, retry the whole batch against Google. Aborts propagate. */
export async function lookupDns(domain: string, signal?: AbortSignal): Promise<DnsLookupResult> {
  try {
    return await resolveWith("Cloudflare", domain, signal);
  } catch (err) {
    if (signal?.aborted) throw err;
    return await resolveWith("Google", domain, signal);
  }
}

/* ---------- reverse DNS (PTR) — used by the ASN & Routing tool ---------- */

/** Expand an IPv6 address to its 32 lowercase hex nibbles, or null if malformed. */
function expandIpv6(ip: string): string | null {
  const halves = ip.toLowerCase().split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 ? (halves[1] ? halves[1].split(":") : []) : null;
  let groups: string[];
  if (tail === null) {
    groups = head;
    if (groups.length !== 8) return null;
  } else {
    const missing = 8 - (head.length + tail.length);
    if (missing < 1) return null; // "::" must stand in for at least one group
    groups = [...head, ...Array(missing).fill("0"), ...tail];
  }
  const nibbles = groups.map((g) => g.padStart(4, "0")).join("");
  return nibbles.length === 32 && /^[0-9a-f]{32}$/.test(nibbles) ? nibbles : null;
}

/** Build the reverse-DNS name for an IPv4/IPv6 address, or null if invalid. */
export function reverseDnsName(ip: string): string | null {
  if (ip.includes(":")) {
    const nib = expandIpv6(ip);
    return nib ? nib.split("").reverse().join(".") + ".ip6.arpa" : null;
  }
  const octets = ip.split(".");
  if (octets.length !== 4 || octets.some((o) => !/^\d{1,3}$/.test(o) || Number(o) > 255)) return null;
  return octets.reverse().join(".") + ".in-addr.arpa";
}

export interface PtrResult {
  hostname: string | null; // null = resolved but no PTR record
  resolver: ResolverName | null; // null = couldn't reach any resolver / invalid IP
}

/** Reverse-DNS (PTR) lookup via DoH. Cloudflare first; on a network/HTTP error
 *  (not an empty answer) fall back to Google. */
export async function lookupPtr(ip: string, signal?: AbortSignal): Promise<PtrResult> {
  const name = reverseDnsName(ip);
  if (!name) return { hostname: null, resolver: null };
  const order: ResolverName[] = ["Cloudflare", "Google"];
  for (const rn of order) {
    try {
      const url = `${RESOLVERS[rn]}?name=${encodeURIComponent(name)}&type=PTR`;
      const res = await fetch(url, { headers: { Accept: "application/dns-json" }, signal });
      if (!res.ok) throw new Error(`DoH HTTP ${res.status}`);
      const json: DohResponse = await res.json();
      const ptr = (json.Answer ?? []).find((a) => a.type === 12); // PTR = 12
      return { hostname: ptr ? ptr.data.replace(/\.$/, "") : null, resolver: rn };
    } catch (err) {
      if (signal?.aborted) throw err;
      // network/HTTP error → try the next resolver
    }
  }
  return { hostname: null, resolver: null };
}
