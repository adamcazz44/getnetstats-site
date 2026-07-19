/** "Network of networks" diagram for the what-is-an-asn guide. AS7922 and
 *  AS15169 are the exact examples the guide's own copy already cites (Comcast,
 *  Google); AS64512 is the real IANA-reserved documentation/private ASN range
 *  (RFC 6996) — the ASN equivalent of the 192.0.2.0/24 test-IP range used
 *  elsewhere on the site. The other two nodes stay unlabeled rather than
 *  inventing more specific network identities. */
export default function NetworkMesh() {
  return (
    <svg
      className="net-mesh"
      viewBox="0 0 480 260"
      role="img"
      aria-label="Diagram: several interconnected independent networks, each identified by an ASN, forming the internet's routing mesh."
    >
      <path d="M110 70 A200 130 0 0 1 370 70" />
      <line x1="110" y1="70" x2="240" y2="150" />
      <line x1="370" y1="70" x2="240" y2="150" />
      <line x1="240" y1="150" x2="90" y2="220" />
      <line x1="240" y1="150" x2="390" y2="220" />

      <circle className="node" cx="110" cy="70" r="26" />
      <text x="110" y="75" textAnchor="middle" className="lbl-strong" fontSize="12">AS7922</text>
      <text x="110" y="112" textAnchor="middle" className="lbl-muted" fontSize="10">Comcast</text>

      <circle className="node" cx="370" cy="70" r="26" />
      <text x="370" y="75" textAnchor="middle" className="lbl-strong" fontSize="12">AS15169</text>
      <text x="370" y="112" textAnchor="middle" className="lbl-muted" fontSize="10">Google</text>

      <circle className="node hub" cx="240" cy="150" r="26" />
      <text x="240" y="155" textAnchor="middle" className="lbl-accent" fontSize="12">AS64512</text>
      <text x="240" y="192" textAnchor="middle" className="lbl-muted" fontSize="10">example range</text>

      <circle className="node" cx="90" cy="220" r="20" />
      <circle className="node" cx="390" cy="220" r="20" />
    </svg>
  );
}
