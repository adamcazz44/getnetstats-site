import type { ReactNode } from "react";
import { NORDVPN_HREF } from "@/components/ads/affiliates";

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "How does GetNetStats find my IP address?",
    a: (
      <>
        Your browser makes a normal request to our lookup endpoint, and the public IP your
        network presents on that request is read back to you. It happens in your browser — we
        don&apos;t require an account and don&apos;t store your address.
      </>
    ),
  },
  {
    q: "Can a website really see my WiFi signal strength?",
    a: (
      <>
        No. Browsers deliberately don&apos;t expose WiFi radio signal to web pages. Our
        &quot;Connection quality&quot; score is an <em>estimate</em> built from your real latency,
        measured throughput, and the Network Information API — not a reading of your router&apos;s
        signal. For true signal bars, use your device&apos;s WiFi menu.
      </>
    ),
  },
  {
    q: "Is the speed test accurate?",
    a: (
      <>
        It streams real data to and from a global content-delivery network and measures actual
        throughput, so it reflects what your browser can really do right now. Results naturally
        vary with WiFi interference, other devices on your network, the time of day, and server
        load — run it a few times for a representative figure.
      </>
    ),
  },
  {
    q: "What is the difference between IPv4 and IPv6?",
    a: (
      <>
        IPv4 is the original 32-bit addressing scheme (about 4.3 billion addresses, now
        exhausted); IPv6 is the 128-bit successor with a practically unlimited pool. Most
        connections run both — GetNetStats shows whichever your network presents, and your IPv6
        address too when available.
      </>
    ),
  },
  {
    q: "Does GetNetStats store or sell my data?",
    a: (
      <>
        No. The tools run client-side in your browser, there&apos;s no sign-up, and we don&apos;t
        sell personal data. Ads on the page are how the free tools stay free.
      </>
    ),
  },
  {
    q: "Why is my IP different here than on another tool?",
    a: (
      <>
        Common reasons: you&apos;re on a VPN or proxy, you&apos;re seeing an IPv6 address on one
        tool and IPv4 on another, or your ISP uses carrier-grade NAT that shares one public IP
        across many customers. All are normal.
      </>
    ),
  },
  {
    q: "How do I hide my IP address?",
    a: (
      <>
        Route your traffic through a VPN (the most practical choice), a proxy server, or the Tor
        network. Each replaces your visible IP with the intermediary&apos;s. Reload this page
        afterward to confirm the change took effect.{" "}
        <a
          className="ip-cta"
          href={NORDVPN_HREF}
          target="_blank"
          rel="sponsored noopener noreferrer"
        >
          Get NordVPN <span aria-hidden="true">→</span>
        </a>
      </>
    ),
  },
  {
    q: "Is GetNetStats free to use?",
    a: (
      <>
        Yes — every tool is free, with no account and no limits. The site is supported by the ads
        you see alongside the results.
      </>
    ),
  },
];

export default function FAQSection() {
  return (
    <section id="faq" aria-labelledby="faq-h">
      <div className="wrap">
        <div className="eyebrow">Answers</div>
        <h2 className="sec" id="faq-h">
          Frequently asked questions
        </h2>
        <div className="faq">
          {FAQS.map((f, i) => (
            <details className="faq-item" key={i} open={i === 0}>
              <summary>
                {f.q}
                <span className="pm" />
              </summary>
              <div className="a">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
