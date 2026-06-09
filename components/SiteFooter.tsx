type Link = [label: string, href: string];

function FootCol({ title, links }: { title: string; links: Link[] }) {
  return (
    <div className="foot-col">
      <h5>{title}</h5>
      {links.map((l) => (
        <a href={l[1]} key={l[0]}>
          {l[0]}
        </a>
      ))}
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col foot-brand">
            <div className="brand">
              <span className="dot" />
              <b>
                GetNet<span>Stats</span>
              </b>
            </div>
            <p>
              Fast, private, no-signup network tools — and the guides to make sense of the
              results.
            </p>
          </div>
          <FootCol
            title="Tools"
            links={[
              ["IP Address Lookup", "/"],
              ["Speed Test", "/"],
              ["Ping Test", "/ping-test"],
            ]}
          />
          <FootCol
            title="Guides"
            links={[
              ["VPN & Privacy Guide", "/vpn-guide"],
              ["What is an IP Address?", "/#learn"],
              ["IPv4 vs IPv6", "/#ipv4-ipv6"],
              ["Find Your IP on Any Device", "/#find-ip"],
              ["How to Hide Your IP", "/#hide-ip"],
            ]}
          />
          <FootCol
            title="Company"
            links={[
              ["About", "/about"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Contact", "mailto:hello@getnetstats.com"],
            ]}
          />
        </div>
        <div className="foot-bottom">
          <span>© 2026 GetNetStats. All rights reserved.</span>
          <span className="mono">getnetstats.com</span>
        </div>
      </div>
    </footer>
  );
}
