import { lookup } from "node:dns/promises";
import { ApiException } from "./errors";

/**
 * SSRF guard. The single most important safeguard for any tool that fetches a
 * host: resolve it and reject private/reserved/loopback/link-local ranges so a
 * function can't be coerced into hitting internal infrastructure or cloud
 * metadata endpoints. Reusable across every Tier 2 endpoint.
 */

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0;
}

function inV4(ip: string, cidr: string): boolean {
  const [range, bitsStr] = cidr.split("/");
  const bits = parseInt(bitsStr, 10);
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(range) & mask);
}

const BLOCKED_V4 = [
  "0.0.0.0/8",
  "10.0.0.0/8",
  "100.64.0.0/10", // CGNAT
  "127.0.0.0/8", // loopback
  "169.254.0.0/16", // link-local (incl. 169.254.169.254 metadata)
  "172.16.0.0/12",
  "192.0.0.0/24",
  "192.168.0.0/16",
  "198.18.0.0/15",
  "fd00::/8", // (placeholder; v6 handled below)
];

export function isPrivateIp(ip: string): boolean {
  if (ip.includes(":")) {
    const v = ip.toLowerCase();
    return (
      v === "::1" || // loopback
      v === "::" ||
      v.startsWith("fc") || // unique local fc00::/7
      v.startsWith("fd") ||
      v.startsWith("fe8") || // link-local fe80::/10
      v.startsWith("fe9") ||
      v.startsWith("fea") ||
      v.startsWith("feb") ||
      v.startsWith("::ffff:") // IPv4-mapped — caller should re-check the v4 part
    );
  }
  return BLOCKED_V4.filter((c) => c.includes(".")).some((cidr) => inV4(ip, cidr));
}

/**
 * Assert a URL is safe to fetch: must be https, hostname must not be a blocked
 * literal, and every resolved address must be public. Throws BLOCKED_TARGET
 * otherwise. Used before fetching any non-constant upstream URL.
 */
export async function assertPublicUrl(url: string): Promise<void> {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    throw new ApiException("BLOCKED_TARGET", "Malformed upstream URL.", 400);
  }
  if (u.protocol !== "https:") {
    throw new ApiException("BLOCKED_TARGET", "Only https upstreams are allowed.", 400);
  }
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new ApiException("BLOCKED_TARGET", "Upstream host is not public.", 400);
  }
  // Literal IP host → check directly.
  if (/^[0-9.]+$/.test(host) || host.includes(":")) {
    if (isPrivateIp(host)) {
      throw new ApiException("BLOCKED_TARGET", "Upstream resolves to a private address.", 400);
    }
    return;
  }
  // Hostname → resolve and verify every address is public.
  let addrs: { address: string }[];
  try {
    addrs = await lookup(host, { all: true });
  } catch {
    throw new ApiException("UPSTREAM_ERROR", "Could not resolve upstream host.", 502);
  }
  if (!addrs.length || addrs.some((a) => isPrivateIp(a.address))) {
    throw new ApiException("BLOCKED_TARGET", "Upstream resolves to a private address.", 400);
  }
}
