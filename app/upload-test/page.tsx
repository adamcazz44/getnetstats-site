import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import UploadTool from "@/components/tools/UploadTool";

export const metadata: Metadata = {
  title: "Upload Speed Test — Free Live Mbps Check in Your Browser | GetNetStats",
  description:
    "Test your real upload speed live in your browser. Sustained Mbps measured by sending data to a global edge network — the number behind video calls, cloud backups and live streams. Free, no sign-up.",
  keywords: [
    "upload speed test",
    "internet upload test",
    "mbps upload",
    "upload bandwidth",
    "video call speed",
    "streaming upload speed",
    "wifi upload test",
  ],
  alternates: { canonical: "/upload-test/" },
  openGraph: {
    type: "website",
    siteName: "GetNetStats",
    title: "Upload Speed Test — Live Mbps Check",
    description:
      "Measure your real upload throughput live in your browser. Free, no sign-up.",
    url: "https://getnetstats.com/upload-test/",
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
    title: "Upload Speed Test — GetNetStats",
    description: "Live upload speed in Mbps, measured in your browser.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Upload Speed Test",
      url: "https://getnetstats.com/upload-test/",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires a modern web browser",
      description:
        "Measure your real upload speed live in your browser — sustained Mbps sent to a global edge network. Free, no sign-up.",
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
          name: "Upload Speed Test",
          item: "https://getnetstats.com/upload-test/",
        },
      ],
    },
  ],
};

export default function UploadTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main id="top">
        <UploadTool />

        <div className="wrap">
          <hr className="divider" />
        </div>

        <section aria-labelledby="ul-learn-h">
          <div className="wrap">
            <div className="eyebrow">Understand the numbers</div>
            <h2 className="sec" id="ul-learn-h">
              Upload speed explained
            </h2>
            <div className="content-grid">
              <div className="prose">
                <h3>What is upload speed?</h3>
                <p>
                  <strong>Upload speed</strong> is how much data your connection can send
                  <em> to</em> the internet per second, in megabits per second (Mbps). It governs
                  video-call quality, cloud backups, sending large files and email attachments,
                  posting photos and video, and live streaming or screen-sharing.
                </p>

                <h3>Why upload is usually slower than download</h3>
                <p>
                  Most home connections are <strong>asymmetric</strong> — cable and DSL plans
                  devote far more capacity to download than upload, because people typically pull
                  down more than they push up. A 300&nbsp;Mbps download plan might only upload at
                  10–20&nbsp;Mbps. Fiber is often <strong>symmetric</strong>, with matching upload
                  and download.
                </p>

                <h3>What&apos;s a good upload speed?</h3>
                <ul>
                  <li>
                    <b>Under 3&nbsp;Mbps:</b> slow — calls and large uploads will struggle.
                  </li>
                  <li>
                    <b>3–10&nbsp;Mbps:</b> OK — solid HD video calls and everyday sharing.
                  </li>
                  <li>
                    <b>10–25&nbsp;Mbps:</b> good — smooth calls, backups and content uploads.
                  </li>
                  <li>
                    <b>25&nbsp;Mbps and up:</b> fast — live streaming and heavy upload work with ease.
                  </li>
                </ul>

                <h3>When upload matters most</h3>
                <p>
                  If your video calls freeze while <em>you</em> talk, cloud backups crawl, or your
                  game stutters when you&apos;re hosting, upload — not download — is usually the
                  bottleneck. Wi-Fi distance, other devices and time-of-day congestion all affect
                  it, so test more than once for a fair read.
                </p>
              </div>

              <aside>
                <div className="note-card">
                  <h4>
                    <span className="d" />
                    How this test works
                  </h4>
                  <p>
                    We send real data up to{" "}
                    <strong style={{ color: "var(--text)" }}>Cloudflare&apos;s global edge
                    network</strong>{" "}
                    and watch your live upload throughput — the running average, the best single
                    window (peak), and how much data was sent.
                  </p>
                  <p>
                    It runs entirely in your browser with no sign-up and nothing stored. Browser
                    upload timing carries a little extra overhead, so treat this as a close,
                    consistent estimate of your real-world upload speed.
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
