import { ApiException } from "@/lib/api/errors";
import { cached } from "@/lib/api/cache";
import { tldOf } from "@/lib/api/validate";
import { assertPublicUrl } from "@/lib/api/ssrf";
import { fetchUpstream, fetchUpstreamJson } from "@/lib/api/upstream";
import type { WhoisData } from "./types";

export type { WhoisData };

/* ---- minimal RDAP response shapes (responses vary; all fields optional) ---- */
interface RdapEvent {
  eventAction?: string;
  eventDate?: string;
}
interface RdapPublicId {
  type?: string;
  identifier?: string;
}
interface RdapEntity {
  roles?: string[];
  handle?: string;
  publicIds?: RdapPublicId[];
  vcardArray?: [string, unknown[]];
  entities?: RdapEntity[];
}
interface RdapNameserver {
  ldhName?: string;
}
interface RdapDomain {
  ldhName?: string;
  unicodeName?: string;
  status?: string[];
  events?: RdapEvent[];
  entities?: RdapEntity[];
  nameservers?: RdapNameserver[];
}

/* ---- IANA RDAP bootstrap: map each TLD → its RDAP base URL ---- */
const BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json";
interface Bootstrap {
  services?: [string[], string[]][];
}

async function loadBootstrap(): Promise<Map<string, string>> {
  // Cached 24h — the registry changes rarely and is large.
  const { value } = await cached("rdap:bootstrap", 24 * 60 * 60 * 1000, async () => {
    const { status, json } = await fetchUpstreamJson<Bootstrap>(BOOTSTRAP_URL, {
      timeoutMs: 8000,
    });
    if (status !== 200 || !json?.services) {
      throw new ApiException("UPSTREAM_ERROR", "Could not load the RDAP bootstrap registry.", 502);
    }
    const map: Record<string, string> = {};
    for (const [tlds, urls] of json.services) {
      const base = urls.find((u) => u.startsWith("https://")) || urls[0];
      if (!base) continue;
      const norm = base.endsWith("/") ? base : base + "/";
      for (const t of tlds) map[t.toLowerCase()] = norm;
    }
    return map;
  });
  return new Map(Object.entries(value));
}

/* ---- vCard / entity helpers ---- */
function vcardValue(entity: RdapEntity | null | undefined, prop: string): string | null {
  const arr = entity?.vcardArray?.[1];
  if (!Array.isArray(arr)) return null;
  for (const entry of arr) {
    if (Array.isArray(entry) && entry[0] === prop) {
      const v = entry[3];
      const str = typeof v === "string" ? v : Array.isArray(v) ? v.filter(Boolean).join(" ") : "";
      const trimmed = str.trim();
      if (trimmed) return trimmed; // treat empty vCard values as absent
    }
  }
  return null;
}

function findEntityByRole(
  entities: RdapEntity[] | undefined,
  role: string,
): RdapEntity | null {
  for (const e of entities || []) {
    if (e.roles?.includes(role)) return e;
    const nested = findEntityByRole(e.entities, role);
    if (nested) return nested;
  }
  return null;
}

function eventDate(events: RdapEvent[] | undefined, action: string): string | null {
  return (events || []).find((e) => e.eventAction === action)?.eventDate ?? null;
}

function normalize(rdap: RdapDomain, server: string): WhoisData {
  const registrar = findEntityByRole(rdap.entities, "registrar");
  const abuse = findEntityByRole(rdap.entities, "abuse");
  const abusePhoneRaw = vcardValue(abuse, "tel");

  return {
    domain: (rdap.ldhName || rdap.unicodeName || null)?.toLowerCase() ?? null,
    registrar: vcardValue(registrar, "fn") || registrar?.handle || null,
    registrarIanaId:
      registrar?.publicIds?.find((p) => /IANA/i.test(p.type || ""))?.identifier ?? null,
    statuses: rdap.status ?? [],
    createdDate: eventDate(rdap.events, "registration"),
    updatedDate: eventDate(rdap.events, "last changed"),
    expiryDate: eventDate(rdap.events, "expiration"),
    nameservers: (rdap.nameservers || [])
      .map((ns) => ns.ldhName?.toLowerCase())
      .filter((n): n is string => Boolean(n)),
    abuseEmail: vcardValue(abuse, "email"),
    abusePhone: abusePhoneRaw ? abusePhoneRaw.replace(/^tel:/, "") : null,
    source: "rdap",
    rdapServer: server,
  };
}

/** Resolve a domain's RDAP server via the IANA bootstrap and return WHOIS-style JSON. */
export async function whoisLookup(domain: string): Promise<WhoisData> {
  const tld = tldOf(domain);
  const bootstrap = await loadBootstrap();
  const base = bootstrap.get(tld);

  if (!base) {
    throw new ApiException(
      "UNSUPPORTED_TLD",
      `No RDAP service is published for ".${tld}".`,
      422,
      {
        details: {
          tld,
          note: "Many ccTLDs and some gTLDs don't expose RDAP. A raw-WHOIS (port 43) or paid-API fallback could be added for these if coverage matters.",
        },
      },
    );
  }

  const url = base + "domain/" + encodeURIComponent(domain);
  // SSRF guard: the base URL comes from the bootstrap registry, so verify it
  // resolves to a public host before fetching.
  await assertPublicUrl(url);

  const res = await fetchUpstream(url, {
    timeoutMs: 8000,
    headers: { accept: "application/rdap+json" },
  });

  if (res.status === 404) {
    throw new ApiException("NOT_FOUND", `No registration found for "${domain}".`, 404);
  }
  if (res.status === 429) {
    throw new ApiException("UPSTREAM_ERROR", "The RDAP server is rate-limiting requests.", 502);
  }
  if (!res.ok) {
    throw new ApiException("UPSTREAM_ERROR", `RDAP server returned status ${res.status}.`, 502);
  }

  let json: RdapDomain;
  try {
    json = (await res.json()) as RdapDomain;
  } catch {
    throw new ApiException("UPSTREAM_ERROR", "RDAP server returned invalid JSON.", 502);
  }
  return normalize(json, base);
}
