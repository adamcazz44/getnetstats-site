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
              An <strong>IP address</strong> (Internet Protocol address) is the unique number
              your network uses to send and receive data on the internet. Every request you make
              — loading a page, sending a message, streaming video — is tagged with your public
              IP so the response knows where to come back to. Think of it as the return address
              on a letter.
            </p>
            <p>
              The address you see at the top of this page is your <strong>public IP</strong>: the
              one your router presents to the wider internet, assigned by your{" "}
              <strong>ISP</strong> (internet service provider). Devices inside your home each have
              a separate <em>private</em> IP that never leaves your local network.
            </p>

            <h3 id="ipv4-ipv6">IPv4 vs IPv6: what&apos;s the difference?</h3>
            <p>
              The internet is mid-migration between two addressing systems. <strong>IPv4</strong>{" "}
              is the original 32-bit format and is running out of room; <strong>IPv6</strong> is
              its 128-bit successor, with effectively unlimited addresses. Most networks now run
              both side by side.
            </p>
            <table className="cmp">
              <thead>
                <tr>
                  <th></th>
                  <th>IPv4</th>
                  <th>IPv6</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Format</th>
                  <td>
                    <span className="tag v4">192.0.2.146</span>
                  </td>
                  <td>
                    <span className="tag v6">2001:db8::8a2e:7334</span>
                  </td>
                </tr>
                <tr>
                  <th>Length</th>
                  <td>32-bit</td>
                  <td>128-bit</td>
                </tr>
                <tr>
                  <th>Total addresses</th>
                  <td>~4.3 billion</td>
                  <td>~340 undecillion</td>
                </tr>
                <tr>
                  <th>Notation</th>
                  <td>4 decimal blocks</td>
                  <td>8 hex groups</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>Exhausted, still dominant</td>
                  <td>The future, growing fast</td>
                </tr>
              </tbody>
            </table>

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
              Your public IP can reveal your approximate location and ISP. To keep it private you
              can route your traffic through an intermediary:
            </p>
            <ul>
              <li>
                <b>VPN</b> — encrypts your connection and replaces your IP with the VPN
                server&apos;s. The most practical option for everyday privacy.{" "}
                <a
                  className="ip-cta"
                  href={NORDVPN_HREF}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  Get NordVPN <span aria-hidden="true">→</span>
                </a>
              </li>
              <li>
                <b>Proxy server</b> — forwards your requests so sites see the proxy&apos;s IP.
                Lighter than a VPN, usually without encryption.
              </li>
              <li>
                <b>Tor</b> — bounces traffic through volunteer relays for strong anonymity, at the
                cost of speed.
              </li>
            </ul>
            <p>
              Whichever you use, reload GetNetStats afterward to confirm your visible IP and
              location have actually changed.
            </p>
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
