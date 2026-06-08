/** Normalized, WHOIS-style result returned by /api/whois.
 *  Kept in its own module (no server-only imports) so client components can
 *  import the type without pulling in node:dns from the RDAP lookup. */
export interface WhoisData {
  domain: string | null;
  registrar: string | null;
  registrarIanaId: string | null;
  statuses: string[];
  createdDate: string | null;
  updatedDate: string | null;
  expiryDate: string | null;
  nameservers: string[];
  abuseEmail: string | null;
  abusePhone: string | null;
  source: "rdap";
  rdapServer: string;
}
