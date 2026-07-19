interface PathRow {
  method: string;
  hops: string[];
  note: string;
  color: string;
}

/* Hop counts and notes come straight from the guide's own text: a VPN and a proxy
 * each route through one server the guide already says "can see your traffic";
 * Tor "bounces through several relays," which is why it gets more hop-dots. */
const ROWS: PathRow[] = [
  { method: "VPN", hops: ["You", "VPN server", "Internet"], note: "provider can see your traffic", color: "var(--accent-2)" },
  { method: "Proxy", hops: ["You", "Proxy server", "Internet"], note: "usually unencrypted", color: "var(--warn)" },
  { method: "Tor", hops: ["You", "Relay", "Relay", "Relay", "Internet"], note: "no single relay sees both ends", color: "var(--good)" },
];

/** Three privacy methods as hop chains — visualizes how many parties see your
 *  traffic under each approach (hide-your-ip-address guide's "three main ways"). */
export default function PrivacyPaths() {
  return (
    <div className="privacy-paths">
      {ROWS.map((r) => (
        <div className="pp-row" key={r.method}>
          <span className="pp-method" style={{ color: r.color }}>{r.method}</span>
          <div className="pp-track">
            {r.hops.map((h, i) => (
              <span className="pp-hop" key={i}>
                <span className="pp-dot" style={{ background: r.color }} />
                <span className="pp-hop-label">{h}</span>
                {i < r.hops.length - 1 ? <span className="pp-line" style={{ background: r.color }} /> : null}
              </span>
            ))}
          </div>
          <span className="pp-note">{r.note}</span>
        </div>
      ))}
    </div>
  );
}
