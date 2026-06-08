import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PingTool from "@/components/tools/PingTool";

export const metadata: Metadata = {
  title: "Ping & Jitter Test — Free Live Latency & Packet Loss Check | GetNetStats",
  description:
    "Test your ping, jitter and packet loss live in your browser. Real round-trip latency measured against a global edge network — the numbers that matter for gaming and video calls. Free, no sign-up.",
  keywords: [
    "ping test",
    "jitter test",
    "latency test",
    "packet loss test",
    "ping and jitter",
    "round trip time",
    "gaming ping",
    "internet latency",
  ],
  alternates: { canonical: "/ping-test/" },
  openGraph: {
    type: "website",
    siteName: "GetNetStats",
    title: "Ping & Jitter Test — Live Latency & Packet Loss",
    description:
      "Measure real round-trip latency, jitter and packet loss live in your browser. Free, no sign-up.",
    url: "https://getnetstats.com/ping-test/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "GetNetStats — free IP lookup & internet speed test",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "Ping & Jitter Test — GetNetStats",
    description: "Live ping, jitter and packet loss, measured in your browser.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Ping & Jitter Test",
      url: "https://getnetstats.com/ping-test/",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires a modern web browser",
      description:
        "Measure your ping, jitter and packet loss live in your browser — real round-trip latency against a global edge network. Free, no sign-up.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isPartOf: { "@id": "https://getnetstats.com/#website" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://getnetstats.com/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Ping & Jitter Test",
          item: "https://getnetstats.com/ping-test/",
        },
      ],
    },
  ],
};

export default function PingTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main id="top">
        <PingTool />

        <div className="wrap">
          <hr className="divider" />
        </div>

        <section aria-labelledby="ping-learn-h">
          <div className="wrap">
            <div className="eyebrow">Understand the numbers</div>
            <h2 className="sec" id="ping-learn-h">
              Ping, jitter and packet loss explained
            </h2>
            <div className="content-grid">
              <div className="prose">
                <h3>What is ping?</h3>
                <p>
                  <strong>Ping</strong> (or latency) is the round-trip time for a small packet
                  to travel from your device to a server and back, measured in milliseconds.
                  Lower is better. It&apos;s the single biggest factor in how <em>responsive</em>{" "}
                  your connection feels — distinct from bandwidth, which is how <em>much</em> data
                  you can move at once. A fast download speed with high ping still feels laggy in
                  calls and games.
                </p>

                <h3>What is jitter?</h3>
                <p>
                  <strong>Jitter</strong> is how much your ping varies between probes. A steady
                  40&nbsp;ms is far better than a connection that bounces between 20 and 120&nbsp;ms,
                  even if the average is the same — variable latency is what causes audio to
                  break up and game characters to &quot;teleport.&quot; We measure it as the
                  average change between consecutive round-trips.
                </p>

                <h3>What is packet loss?</h3>
                <p>
                  <strong>Packet loss</strong> is the share of probes that never came back. Any
                  sustained loss above zero is worth investigating — it forces data to be resent
                  and shows up as stutter, dropped calls and rubber-banding. Here, a probe that
                  times out counts as one lost packet.
                </p>

                <h3>What&apos;s a good ping?</h3>
                <ul>
                  <li>
                    <b>Under 20&nbsp;ms:</b> excellent — competitive gaming and crisp video calls.
                  </li>
                  <li>
                    <b>20–50&nbsp;ms:</b> good — smooth for almost everything.
                  </li>
                  <li>
                    <b>50–100&nbsp;ms:</b> fair — fine for browsing and streaming, some lag in
                    fast games.
                  </li>
                  <li>
                    <b>Over 100&nbsp;ms:</b> high — interactive apps start to feel sluggish.
                  </li>
                </ul>
                <p>
                  Results vary with Wi-Fi interference, distance to the server, and other devices
                  on your network — run the test a few times for a representative picture.
                </p>
              </div>

              <aside>
                <div className="note-card">
                  <h4>
                    <span className="d" />
                    How this test works
                  </h4>
                  <p>
                    We time {""}
                    <strong style={{ color: "var(--text)" }}>real round-trips</strong> to
                    Cloudflare&apos;s global edge network and report the live median, jitter, best
                    and worst times, and packet loss.
                  </p>
                  <p>
                    It runs entirely in your browser with no sign-up and nothing stored. Browser
                    timing has slightly more overhead than a native <span className="mono">ping</span>{" "}
                    command, so treat these as a close, consistent estimate rather than an exact
                    ICMP reading.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
