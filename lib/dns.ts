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
