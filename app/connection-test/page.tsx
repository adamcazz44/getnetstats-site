import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ConnectionTool from "@/components/tools/ConnectionTool";

export const metadata: Metadata = {
  title: "Connection Test — Check Your Network Type, Class & Latency | GetNetStats",
  description:
    "See what your browser knows about your connection: type (Wi-Fi, cellular, ethernet), speed class, estimated downlink and round-trip latency. Free, private, no sign-up.",
  keywords: [
    "connection test",
    "network type",
    "wifi or cellular",
    "connection quality",
    "network information",
    "effective connection type",
    "what connection am i on",
  ],
  alternates: { canonical: "/connection-test/" },
  openGraph: {
    type: "website",
    siteName: "GetNetStats",
    title: "Connection Test — Network Type, Class & Latency",
    description:
      "See your connection type, speed class and estimated latency, read from your browser. Free, no sign-up.",
    url: "https://getnetstats.com/connection-test/",
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
    title: "Connection Test — GetNetStats",
    description: "Your connection type, class and estimated latency, in your browser.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Connection Test",
      url: "https://getnetstats.com/connection-test/",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires a modern web browser",
      description:
        "Check your connection type, speed class, estimated downlink and round-trip latency, read from your browser. Free, no sign-up.",
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
          name: "Connection Test",
          item: "https://getnetstats.com/connection-test/",
        },
      ],
    },
  ],
};

export default function ConnectionTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main id="top">
        <ConnectionTool />

        <div className="wrap">
          <hr className="divider" />
        </div>

        <section aria-labelledby="conn-learn-h">
          <div className="wrap">
            <div className="eyebrow">Understand the numbers</div>
            <h2 className="sec" id="conn-learn-h">
              Your connection, explained
            </h2>
            <div className="content-grid">
              <div className="prose">
                <h3>What this test shows</h3>
                <p>
                  This reads your browser&apos;s <strong>Network Information API</strong> — a
                  best-effort summary the browser keeps about your current connection. It can
                  include the <strong>type</strong> (Wi-Fi, cellular, ethernet), an{" "}
                  <strong>effective speed class</strong>, an estimated <strong>downlink</strong>,
                  and a rough <strong>round-trip</strong> latency.
                </p>

                <h3>Why these are estimates</h3>
                <p>
                  The browser derives these from recent network activity, not a fresh measurement
                  — so the downlink and round-trip are <em>approximations</em>, and the speed
                  class is a coarse bucket (like &quot;4G-class&quot;) rather than an exact figure.
                  For real, measured numbers, use the live{" "}
                  <a href="/download-test/">download</a>, <a href="/upload-test/">upload</a> and{" "}
                  <a href="/ping-test/">ping</a> tests.
                </p>

                <h3>Not all browsers share this</h3>
                <p>
                  The Network Information API is supported in Chrome, Edge and most Android
                  browsers, but <strong>Safari and Firefox restrict it</strong> for privacy. On
                  those browsers this page will show that the details aren&apos;t exposed — which
                  is by design, not an error.
                </p>

                <h3>What about Wi-Fi signal strength?</h3>
                <p>
                  Browsers <strong>can&apos;t read your Wi-Fi radio signal</strong> — there&apos;s
                  no web API for it. To judge real-world connection quality, lean on measured
                  latency and throughput from our speed tests; for raw signal bars, check your
                  device&apos;s Wi-Fi menu or your router.
                </p>
              </div>

              <aside>
                <div className="note-card">
                  <h4>
                    <span className="d" />
                    How this test works
                  </h4>
                  <p>
                    We read the values your{" "}
                    <strong style={{ color: "var(--text)" }}>browser already reports</strong> via
                    the Network Information API and present them clearly. Nothing is sent to a
                    server and nothing is stored.
                  </p>
                  <p>
                    Because it&apos;s instant device info rather than a live probe, &quot;Re-detect&quot;
                    simply re-reads the current values. For measured performance, run the live
                    speed and ping tests.
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
