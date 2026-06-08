import { ApiException } from "./errors";

/** What kind of target an endpoint accepts. */
export type TargetKind = "domain" | "ip" | "host";

const DOMAIN_RE =
  /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
const IPV4_RE =
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const IPV6_RE = /^[0-9a-f:]+$/i; // loose; refined by a colon + group check below

/** Strictly parse/normalize a domain. Accepts a pasted URL or trailing dot. */
export function validateDomain(input: string | null | undefined): string {
  if (!input || !input.trim()) {
    throw new ApiException("INVALID_TARGET", "Provide a domain via ?target=", 400);
  }
  let s = input.trim().toLowerCase();
  // tolerate a pasted URL — pull out the hostname
  if (s.includes("/") || s.includes("://")) {
    try {
      s = new URL(s.includes("://") ? s : "http://" + s).hostname;
    } catch {
      /* fall through to regex rejection */
    }
  }
  s = s.replace(/\.$/, ""); // drop FQDN trailing dot
  if (!DOMAIN_RE.test(s)) {
    throw new ApiException(
      "INVALID_TARGET",
      `"${input}" is not a valid domain name.`,
      400,
    );
  }
  return s;
}

export function validateIp(input: string | null | undefined): string {
  if (!input || !input.trim()) {
    throw new ApiException("INVALID_TARGET", "Provide an IP via ?target=", 400);
  }
  const s = input.trim();
  const isV6 = s.includes(":") && IPV6_RE.test(s) && s.split(":").length >= 3;
  if (!IPV4_RE.test(s) && !isV6) {
    throw new ApiException("INVALID_TARGET", `"${input}" is not a valid IP address.`, 400);
  }
  return s.toLowerCase();
}

/** Generic dispatch so each endpoint declares what it accepts. */
export function validateTarget(
  input: string | null | undefined,
  opts: { allow: TargetKind },
): string {
  switch (opts.allow) {
    case "domain":
      return validateDomain(input);
    case "ip":
      return validateIp(input);
    case "host":
      try {
        return validateIp(input);
      } catch {
        return validateDomain(input);
      }
  }
}

/** The TLD (last label) of an already-validated domain. */
export function tldOf(domain: string): string {
  const parts = domain.split(".");
  return parts[parts.length - 1];
}
