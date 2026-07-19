/** Static diagram for the "what is an IP address" guide: three home devices, each
 *  with a private IP, connect through a router that shows one public IP to the
 *  internet. 192.168.1.x and 192.0.2.146 are the same example ranges the guide's
 *  own copy already uses (192.0.2.0/24 is the reserved documentation range). */
export default function HomeNetworkMap() {
  return (
    <svg
      className="net-map"
      viewBox="0 0 520 260"
      role="img"
      aria-label="Diagram: three home devices, each with a private IP address, connect through a router. The router shows one public IP address to the internet."
    >
      <line x1="160" y1="35" x2="210" y2="120" />
      <line x1="160" y1="120" x2="210" y2="120" />
      <line x1="160" y1="205" x2="210" y2="120" />
      <line x1="320" y1="120" x2="390" y2="120" />

      <rect className="box" x="10" y="8" width="150" height="54" rx="10" />
      <text x="85" y="30" textAnchor="middle" className="lbl-strong" fontSize="14">Laptop</text>
      <text x="85" y="48" textAnchor="middle" className="lbl-muted" fontSize="11">192.168.1.2</text>

      <rect className="box" x="10" y="93" width="150" height="54" rx="10" />
      <text x="85" y="115" textAnchor="middle" className="lbl-strong" fontSize="14">Phone</text>
      <text x="85" y="133" textAnchor="middle" className="lbl-muted" fontSize="11">192.168.1.3</text>

      <rect className="box" x="10" y="178" width="150" height="54" rx="10" />
      <text x="85" y="200" textAnchor="middle" className="lbl-strong" fontSize="14">Smart TV</text>
      <text x="85" y="218" textAnchor="middle" className="lbl-muted" fontSize="11">192.168.1.4</text>

      <rect className="box router" x="210" y="93" width="110" height="54" rx="10" />
      <text x="265" y="115" textAnchor="middle" className="lbl-strong" fontSize="14">Router</text>
      <text x="265" y="133" textAnchor="middle" className="lbl-muted" fontSize="10">home network</text>

      <rect className="box internet" x="390" y="93" width="120" height="54" rx="10" />
      <text x="450" y="120" textAnchor="middle" className="lbl-strong" fontSize="14">The internet</text>

      <text x="355" y="85" textAnchor="middle" className="lbl-accent" fontSize="9.5">
        192.0.2.146
      </text>
    </svg>
  );
}
