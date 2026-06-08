/* ===========================================================
   GetNetStats — static content sections (content hub + SEO)
   Exports to window: RelatedTools, Education, FAQSection, SiteFooter
   =========================================================== */
const { useState: _useState } = React;

/* ---- small inline icons (simple shapes only) ---- */
function Ic({ d, vb }) {
  return (
    <svg viewBox={vb || "0 0 24 24"} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );
}
const ICONS = {
  ip:     <Ic d={<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></>} />,
  speed:  <Ic d={<><path d="M12 13l5-5" /><path d="M5.5 18a9 9 0 1 1 13 0" /><circle cx="12" cy="13" r="1.4" fill="currentColor" /></>} />,
  ping:   <Ic d={<><path d="M3 12h4l2 5 4-12 2 7h6" /></>} />,
  whois:  <Ic d={<><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>} />,
  dns:    <Ic d={<><ellipse cx="12" cy="6" rx="7.5" ry="3" /><path d="M4.5 6v12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" /><path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" /></>} />,
  isp:    <Ic d={<><path d="M5 13a7 7 0 0 1 14 0" /><path d="M8.5 15.5a3.5 3.5 0 0 1 7 0" /><circle cx="12" cy="18.5" r="1.2" fill="currentColor" /></>} />,
};
const ARROW = (
  <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg>
);

const TOOLS = [
  { k: 'ip',    t: 'IP Address Lookup',  d: 'See the public IP, ISP, and location of any address — yours or one you paste in.' },
  { k: 'speed', t: 'Internet Speed Test', d: 'Measure real download, upload, latency and jitter against a global CDN.' },
  { k: 'ping',  t: 'Ping & Jitter Test', d: 'Check round-trip latency and stability — the numbers that matter for calls and gaming.' },
  { k: 'whois', t: 'WHOIS Lookup',       d: 'Pull registration, registrar and ownership records for any domain.' },
  { k: 'dns',   t: 'DNS Checker',        d: 'Inspect A, AAAA, MX and TXT records and how they resolve worldwide.' },
  { k: 'isp',   t: "What's My ISP",      d: 'Identify your provider, connection type and the network you are routed through.' },
];

function HowItWorks() {
  const steps = [
    { n: '01', t: 'Detect your IP', d: 'We read the public IP address, ISP and approximate location your network presents — instantly, with nothing stored.' },
    { n: '02', t: 'Measure latency', d: 'Warm round-trips to a global content-delivery network clock your real ping and jitter — the numbers that matter for calls and gaming.' },
    { n: '03', t: 'Test real speed', d: 'Live byte streams up and down the wire measure your true download and upload throughput, then score overall connection quality.' },
  ];
  return (
    <section id="how" aria-labelledby="how-h">
      <div className="wrap">
        <div className="eyebrow">// how it works</div>
        <h2 className="sec" id="how-h">Three steps, about ten seconds</h2>
        <p className="sec-intro">GetNetStats runs entirely in your browser — no app, no sign-up, nothing stored. Hit run and the scanner walks through three live measurements.</p>
        <div className="how-grid">
          {steps.map((s) => (
            <div className="how-step" key={s.n}>
              <div className="how-n mono">{s.n}</div>
              <div className="how-t">{s.t}</div>
              <div className="how-d">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedTools() {
  return (
    <section id="tools" aria-labelledby="tools-h">
      <div className="wrap">
        <div className="eyebrow">The network toolkit</div>
        <h2 className="sec" id="tools-h">Every network check in one place</h2>
        <p className="sec-intro">GetNetStats is a growing hub of fast, no-signup network utilities. Each tool runs in your browser and links back here — bookmark the set you use most.</p>
        <div className="tools-grid">
          {TOOLS.map((tool) => (
            <a className="tool-card" href={'#' + tool.k} key={tool.k}>
              <span className="ico">{ICONS[tool.k]}</span>
              <span className="t">{tool.t} {ARROW}</span>
              <span className="d">{tool.d}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="learn" aria-labelledby="learn-h">
      <div className="wrap">
        <div className="eyebrow">Understand your connection</div>
        <h2 className="sec" id="learn-h">What is an IP address?</h2>
        <div className="content-grid">
          <div className="prose">
            <p>An <strong>IP address</strong> (Internet Protocol address) is the unique number your network uses to send and receive data on the internet. Every request you make — loading a page, sending a message, streaming video — is tagged with your public IP so the response knows where to come back to. Think of it as the return address on a letter.</p>
            <p>The address you see at the top of this page is your <strong>public IP</strong>: the one your router presents to the wider internet, assigned by your <strong>ISP</strong> (internet service provider). Devices inside your home each have a separate <em>private</em> IP that never leaves your local network.</p>

            <h3 id="ipv4-ipv6">IPv4 vs IPv6: what's the difference?</h3>
            <p>The internet is mid-migration between two addressing systems. <strong>IPv4</strong> is the original 32-bit format and is running out of room; <strong>IPv6</strong> is its 128-bit successor, with effectively unlimited addresses. Most networks now run both side by side.</p>
            <table className="cmp">
              <thead>
                <tr><th></th><th>IPv4</th><th>IPv6</th></tr>
              </thead>
              <tbody>
                <tr><th>Format</th><td><span className="tag v4">192.0.2.146</span></td><td><span className="tag v6">2001:db8::8a2e:7334</span></td></tr>
                <tr><th>Length</th><td>32-bit</td><td>128-bit</td></tr>
                <tr><th>Total addresses</th><td>~4.3 billion</td><td>~340 undecillion</td></tr>
                <tr><th>Notation</th><td>4 decimal blocks</td><td>8 hex groups</td></tr>
                <tr><th>Status</th><td>Exhausted, still dominant</td><td>The future, growing fast</td></tr>
              </tbody>
            </table>

            <h3 id="find-ip">How to find your IP address on any device</h3>
            <ul>
              <li><b>Any device:</b> the fastest way is to open this page — your public IP is shown at the top instantly.</li>
              <li><b>Windows:</b> open Command Prompt and run <span className="mono">ipconfig</span> to see your local IPv4/IPv6.</li>
              <li><b>macOS:</b> System Settings → Network → Details, or run <span className="mono">ifconfig</span> in Terminal.</li>
              <li><b>iPhone / iPad:</b> Settings → Wi-Fi → tap the (i) next to your network.</li>
              <li><b>Android:</b> Settings → About phone → Status, or Network &amp; internet → your Wi-Fi.</li>
            </ul>

            <h3 id="hide-ip">How to hide your IP address</h3>
            <p>Your public IP can reveal your approximate location and ISP. To keep it private you can route your traffic through an intermediary:</p>
            <ul>
              <li><b>VPN</b> — encrypts your connection and replaces your IP with the VPN server's. The most practical option for everyday privacy.</li>
              <li><b>Proxy server</b> — forwards your requests so sites see the proxy's IP. Lighter than a VPN, usually without encryption.</li>
              <li><b>Tor</b> — bounces traffic through volunteer relays for strong anonymity, at the cost of speed.</li>
            </ul>
            <p>Whichever you use, reload GetNetStats afterward to confirm your visible IP and location have actually changed.</p>
          </div>

          <aside>
            <div className="note-card">
              <h4><span className="d"></span>About the signal reading</h4>
              <p>Worth knowing: <strong style={{color:'var(--text)'}}>web browsers can't read your WiFi radio signal strength</strong> — there's no API for it, by design, for privacy and security.</p>
              <p>So our <strong style={{color:'var(--text)'}}>Connection quality</strong> meter isn't a fake bars-of-signal readout. It's an honest estimate derived from your <em>real</em> measured latency, download throughput, and the browser's Network Information API.</p>
              <p>For true radio signal strength, check your device's WiFi menu or your router's admin page.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: 'How does GetNetStats find my IP address?',
    a: <>Your browser makes a normal request to our lookup endpoint, and the public IP your network presents on that request is read back to you. It happens in your browser — we don't require an account and don't store your address.</> },
  { q: "Can a website really see my WiFi signal strength?",
    a: <>No. Browsers deliberately don't expose WiFi radio signal to web pages. Our "Connection quality" score is an <em>estimate</em> built from your real latency, measured throughput, and the Network Information API — not a reading of your router's signal. For true signal bars, use your device's WiFi menu.</> },
  { q: 'Is the speed test accurate?',
    a: <>It streams real data to and from a global content-delivery network and measures actual throughput, so it reflects what your browser can really do right now. Results naturally vary with WiFi interference, other devices on your network, the time of day, and server load — run it a few times for a representative figure.</> },
  { q: 'What is the difference between IPv4 and IPv6?',
    a: <>IPv4 is the original 32-bit addressing scheme (about 4.3 billion addresses, now exhausted); IPv6 is the 128-bit successor with a practically unlimited pool. Most connections run both — GetNetStats shows whichever your network presents, and your IPv6 address too when available.</> },
  { q: 'Does GetNetStats store or sell my data?',
    a: <>No. The tools run client-side in your browser, there's no sign-up, and we don't sell personal data. Ads on the page are how the free tools stay free.</> },
  { q: 'Why is my IP different here than on another tool?',
    a: <>Common reasons: you're on a VPN or proxy, you're seeing an IPv6 address on one tool and IPv4 on another, or your ISP uses carrier-grade NAT that shares one public IP across many customers. All are normal.</> },
  { q: 'How do I hide my IP address?',
    a: <>Route your traffic through a VPN (the most practical choice), a proxy server, or the Tor network. Each replaces your visible IP with the intermediary's. Reload this page afterward to confirm the change took effect.</> },
  { q: 'Is GetNetStats free to use?',
    a: <>Yes — every tool is free, with no account and no limits. The site is supported by the ads you see alongside the results.</> },
];

function FAQSection() {
  return (
    <section id="faq" aria-labelledby="faq-h">
      <div className="wrap">
        <div className="eyebrow">Answers</div>
        <h2 className="sec" id="faq-h">Frequently asked questions</h2>
        <div className="faq">
          {FAQS.map((f, i) => (
            <details className="faq-item" key={i} open={i === 0}>
              <summary>{f.q}<span className="pm"></span></summary>
              <div className="a">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const col = (title, links) => (
    <div className="foot-col">
      <h5>{title}</h5>
      {links.map((l) => <a href={l[1]} key={l[0]}>{l[0]}</a>)}
    </div>
  );
  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col foot-brand">
            <div className="brand"><span className="dot"></span><b>GetNet<span>Stats</span></b></div>
            <p>Fast, private, no-signup network tools — and the guides to make sense of the results.</p>
          </div>
          {col('Tools', [['IP Address Lookup','#tools'],['Speed Test','#'],['Ping Test','#'],['WHOIS Lookup','#'],['DNS Checker','#']])}
          {col('Guides', [['What is an IP Address?','#learn'],['IPv4 vs IPv6','#ipv4-ipv6'],['Find Your IP on Any Device','#find-ip'],['How to Hide Your IP','#hide-ip']])}
          {col('Company', [['About','#'],['Privacy','#'],['Terms','#'],['Contact','#']])}
        </div>
        <div className="foot-bottom">
          <span>© 2026 GetNetStats. All rights reserved.</span>
          <span className="mono">getnetstats.com</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { HowItWorks, RelatedTools, Education, FAQSection, SiteFooter });
