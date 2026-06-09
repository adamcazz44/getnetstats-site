import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DownloadTool from "@/components/tools/DownloadTool";

export const metadata: Metadata = {
  title: "Download Speed Test — Free Live Mbps Check in Your Browser | GetNetStats",
  description:
    "Test your real download speed live in your browser. Sustained Mbps measured by streaming from a global edge network — the number that decides how fast pages, files and 4K video load. Free, no sign-up.",
  keywords: [
    "download speed test",
    "internet speed test",
    "mbps test",
    "broadband speed test",
    "download bandwidth",
    "how fast is my internet",
    "wifi speed test",
  ],
  alternates: { canonical: "/download-test/" },
  openGraph: {
    type: "website",
    siteName: "GetNetStats",
    title: "Download Speed Test — Live Mbps Check",
    description:
      "Measure your real download throughput live in your browser. Free, no sign-up.",
    url: "https://getnetstats.com/download-test/",
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
    title: "Download Speed Test — GetNetStats",
    description: "Live download speed in Mbps, measured in your browser.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Download Speed Test",
      url: "https://getnetstats.com/download-test/",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires a modern web browser",
      description:
        "Measure your real download speed live in your browser — sustained Mbps streamed from a global edge network. Free, no sign-up.",
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
          name: "Download Speed Test",
          item: "https://getnetstats.com/download-test/",
        },
      ],
    },
  ],
};

export default function DownloadTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main id="top">
        <DownloadTool />

        <div className="wrap">
          <hr className="divider" />
        </div>

        <section aria-labelledby="dl-learn-h">
          <div className="wrap">
            <div className="eyebrow">Understand the numbers</div>
            <h2 className="sec" id="dl-learn-h">
              Download speed explained
            </h2>
            <div className="content-grid">
              <div className="prose">
                <h3>What is download speed?</h3>
                <p>
                  <strong>Download speed</strong> is how much data your connection can pull
                  <em> from</em> the internet per second, measured in megabits per second
                  (Mbps). It governs how quickly web pages, photos, files, software updates
                  and streaming video arrive. Higher is better — and it&apos;s the headline
                  number internet plans are usually sold on.
                </p>

                <h3>Mbps vs. MB/s — why they differ</h3>
                <p>
                  Speeds are quoted in mega<strong>bits</strong> (Mbps), but files are sized in
                  mega<strong>bytes</strong> (MB). There are 8 bits in a byte, so a 100&nbsp;Mbps
                  line downloads at roughly <strong>12.5&nbsp;MB/s</strong> at best. That&apos;s
                  why a &quot;fast&quot; connection can still feel slower than the number suggests.
                </p>

                <h3>What&apos;s a good download speed?</h3>
                <ul>
                  <li>
                    <b>Under 10&nbsp;Mbps:</b> slow — basic browsing and SD video; HD may buffer.
                  </li>
                  <li>
                    <b>10–50&nbsp;Mbps:</b> OK — HD streaming and video calls on a few devices.
                  </li>
                  <li>
                    <b>50–150&nbsp;Mbps:</b> good — smooth 4K and a busy household.
                  </li>
                  <li>
                    <b>150&nbsp;Mbps and up:</b> fast to gigabit — heavy multi-device use with ease.
                  </li>
                </ul>

                <h3>Why your result can vary</h3>
                <p>
                  Wi-Fi interference, distance from your router, other devices sharing the line,
                  your device&apos;s hardware, and time-of-day congestion all move the number.
                  For the truest read, test more than once — and try a wired connection if you
                  can. Your speed will also never exceed the rate your plan provides.
                </p>
              </div>

              <aside>
                <div className="note-card">
                  <h4>
                    <span className="d" />
                    How this test works
                  </h4>
                  <p>
                    We stream real data from{" "}
                    <strong style={{ color: "var(--text)" }}>Cloudflare&apos;s global edge
                    network</strong>{" "}
                    for about ten seconds and report your live throughput — the running average,
                    the best single window (peak), and how much data was sampled.
                  </p>
                  <p>
                    It runs entirely in your browser with no sign-up and nothing stored. Browser
                    measurement can&apos;t fully bypass caching and overhead the way a dedicated
                    app might, so treat this as a close, consistent estimate of your real-world
                    download speed.
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
