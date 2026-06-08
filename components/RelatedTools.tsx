import type { ReactNode } from "react";

/* ---- small inline icons (simple shapes only) ---- */
function Ic({ d, vb }: { d: ReactNode; vb?: string }) {
  return (
    <svg
      viewBox={vb || "0 0 24 24"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {d}
    </svg>
  );
}

const ICONS: Record<string, ReactNode> = {
  ip: (
    <Ic
      d={
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
        </>
      }
    />
  ),
  speed: (
    <Ic
      d={
        <>
          <path d="M12 13l5-5" />
          <path d="M5.5 18a9 9 0 1 1 13 0" />
          <circle cx="12" cy="13" r="1.4" fill="currentColor" />
        </>
      }
    />
  ),
  ping: <Ic d={<path d="M3 12h4l2 5 4-12 2 7h6" />} />,
  whois: (
    <Ic
      d={
        <>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </>
      }
    />
  ),
  dns: (
    <Ic
      d={
        <>
          <ellipse cx="12" cy="6" rx="7.5" ry="3" />
          <path d="M4.5 6v12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
          <path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" />
        </>
      }
    />
  ),
  isp: (
    <Ic
      d={
        <>
          <path d="M5 13a7 7 0 0 1 14 0" />
          <path d="M8.5 15.5a3.5 3.5 0 0 1 7 0" />
          <circle cx="12" cy="18.5" r="1.2" fill="currentColor" />
        </>
      }
    />
  ),
};

const ARROW = (
  <svg
    className="arrow"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

interface Tool {
  k: string;
  t: string;
  d: string;
  href?: string; // live tools link here
  soon?: boolean; // not-yet-built: rendered as a disabled "Soon" card (no link)
}

const TOOLS: Tool[] = [
  { k: "ip", t: "IP Address Lookup", d: "See the public IP, ISP, and location of any address — yours or one you paste in.", href: "/" },
  { k: "speed", t: "Internet Speed Test", d: "Measure real download, upload, latency and jitter against a global CDN.", href: "/" },
  { k: "ping", t: "Ping & Jitter Test", d: "Check round-trip latency and stability — the numbers that matter for calls and gaming.", href: "/ping-test" },
  { k: "whois", t: "WHOIS Lookup", d: "Pull registration, registrar and ownership records for any domain.", soon: true },
  { k: "dns", t: "DNS Checker", d: "Inspect A, AAAA, MX and TXT records and how they resolve worldwide.", soon: true },
  { k: "isp", t: "What's My ISP", d: "Identify your provider, connection type and the network you are routed through.", soon: true },
];

export default function RelatedTools() {
  return (
    <section id="tools" aria-labelledby="tools-h">
      <div className="wrap">
        <div className="eyebrow">The network toolkit</div>
        <h2 className="sec" id="tools-h">
          Every network check in one place
        </h2>
        <p className="sec-intro">
          GetNetStats is a growing hub of fast, no-signup network utilities. Each tool runs in
          your browser and links back here — bookmark the set you use most.
        </p>
        <div className="tools-grid">
          {TOOLS.map((tool) =>
            tool.soon ? (
              <div className="tool-card soon" key={tool.k} aria-disabled="true">
                <span className="ico">{ICONS[tool.k]}</span>
                <span className="t">
                  {tool.t} <span className="tool-soon">Soon</span>
                </span>
                <span className="d">{tool.d}</span>
              </div>
            ) : (
              <a className="tool-card" href={tool.href} key={tool.k}>
                <span className="ico">{ICONS[tool.k]}</span>
                <span className="t">
                  {tool.t} {ARROW}
                </span>
                <span className="d">{tool.d}</span>
              </a>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
