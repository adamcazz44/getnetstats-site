import { NORDVPN_HREF } from "@/components/ads/affiliates";

export default function Education() {
  return (
    <section id="learn" aria-labelledby="learn-h">
      <div className="wrap">
        <div className="eyebrow">Understand your connection</div>
        <h2 className="sec" id="learn-h">
          What is an IP address?
        </h2>
        <div className="content-grid">
          <div className="prose">
            <p>
              An <strong>IP address</strong> (Internet Protocol address) is the unique number your
              network uses to send and receive data online. The <strong>public IP</strong> shown at
              the top of this page is the one your router presents to the wider internet — assigned
              by your <strong>ISP</strong> — while each device in your home keeps a separate{" "}
              <em>private</em> IP that never leaves your network.
            </p>

            <a className="read-more" href="/what-is-an-ip-address/">
              Read the full guide: what an IP reveals about you{" "}
              <span aria-hidden="true">→</span>
            </a>

            <h3 id="ipv4-ipv6">IPv4 vs IPv6: what&apos;s the difference?</h3>
            <p>
              The internet is mid-migration between two addressing systems. <strong>IPv4</strong>{" "}
              is the original 32-bit format and is running out of room; <strong>IPv6</strong> is
              its 128-bit successor, with effectively unlimited addresses. Most networks now run
              both side by side.
            </p>
            <a className="read-more" href="/ipv4-vs-ipv6/">
              Read the full guide: IPv4 vs IPv6 <span aria-hidden="true">→</span>
            </a>

            <h3 id="find-ip">How to find your IP address on any device</h3>
            <ul>
              <li>
                <b>Any device:</b> the fastest way is to open this page — your public IP is shown
                at the top instantly.
              </li>
              <li>
                <b>Windows:</b> open Command Prompt and run <span className="mono">ipconfig</span>{" "}
                to see your local IPv4/IPv6.
              </li>
              <li>
                <b>macOS:</b> System Settings → Network → Details, or run{" "}
                <span className="mono">ifconfig</span> in Terminal.
              </li>
              <li>
                <b>iPhone / iPad:</b> Settings → Wi-Fi → tap the (i) next to your network.
              </li>
              <li>
                <b>Android:</b> Settings → About phone → Status, or Network &amp; internet → your
                Wi-Fi.
              </li>
            </ul>

            <h3 id="hide-ip">How to hide your IP address</h3>
            <p>
              Your public IP can reveal your approximate location and ISP. The common ways to mask
              it are a <strong>VPN</strong> — which encrypts your traffic and replaces your IP, the
              practical pick for everyday privacy{" "}
              <a
                className="ip-cta"
                href={NORDVPN_HREF}
                target="_blank"
                rel="sponsored noopener noreferrer"
              >
                Get NordVPN <span aria-hidden="true">→</span>
              </a>{" "}
              — a <strong>proxy</strong>, or <strong>Tor</strong> for stronger anonymity at the cost
              of speed.
            </p>
            <a className="read-more" href="/hide-your-ip-address/">
              Read the full guide: how to hide your IP <span aria-hidden="true">→</span>
            </a>
          </div>

          <aside>
            <div className="note-card">
              <h4>
                <span className="d" />
                About the signal reading
              </h4>
              <p>
                Worth knowing:{" "}
                <strong style={{ color: "var(--text)" }}>
                  web browsers can&apos;t read your WiFi radio signal strength
                </strong>{" "}
                — there&apos;s no API for it, by design, for privacy and security.
              </p>
              <p>
                So our <strong style={{ color: "var(--text)" }}>Connection quality</strong> meter
                isn&apos;t a fake bars-of-signal readout. It&apos;s an honest estimate derived from
                your <em>real</em> measured latency, download throughput, and the browser&apos;s
                Network Information API.
              </p>
              <p>
                For true radio signal strength, check your device&apos;s WiFi menu or your
                router&apos;s admin page.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
