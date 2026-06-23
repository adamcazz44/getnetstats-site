import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const SITE = "https://getnetstats.com";
const PUBLISHED = "2026-06-22";

export const metadata: Metadata = {
  title: "Why Is My Wi-Fi Slow? A Plain-English Troubleshooting Guide | GetNetStats",
  description:
    "Why your Wi-Fi is slow and how to fix it, in order — find where the problem actually is, the most common causes (router placement, bands, congestion, old hardware, your plan), Wi-Fi vs wired, and what a speed test can and can't tell you.",
  keywords: [
    "why is my wifi slow",
    "slow wifi fix",
    "wifi troubleshooting",
    "2.4 ghz vs 5 ghz",
    "router placement",
    "wifi vs wired",
    "slow internet",
  ],
  alternates: { canonical: "/why-is-my-wifi-slow/" },
  openGraph: {
    type: "article",
    siteName: "GetNetStats",
    title: "Why Is My Wi-Fi Slow? A Plain-English Troubleshooting Guide",
    description:
      "The common causes of a sluggish connection — and how to fix them, in order — plus what a speed test can and can't tell you.",
    url: `${SITE}/why-is-my-wifi-slow/`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GetNetStats" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "Why Is My Wi-Fi Slow? — GetNetStats",
    description: "The common causes of a sluggish connection, and how to fix them in order.",
  },
};

export default function WhyIsMyWifiSlowPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Why Is My Wi-Fi Slow?", item: `${SITE}/why-is-my-wifi-slow/` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Why Is My Wi-Fi Slow? A Plain-English Troubleshooting Guide",
    description:
      "The common causes of a sluggish connection and how to fix them in order — where the problem actually is, router and band fixes, Wi-Fi vs wired, and what a speed test can and can't tell you.",
    image: [`${SITE}/og.png`],
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/why-is-my-wifi-slow/` },
    author: { "@type": "Organization", name: "GetNetStats", "@id": `${SITE}/#org` },
    publisher: { "@type": "Organization", name: "GetNetStats", "@id": `${SITE}/#org` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <SiteHeader />
      <main id="top">
        <section className="page" aria-labelledby="wifi-h">
          <div className="wrap">
            <div className="eyebrow">
              <a className="eyebrow-home" href="/">Home</a> // learn
            </div>
            <h1 id="wifi-h">Why is my Wi-Fi slow? A plain-English troubleshooting guide</h1>
            <p className="page-sub">
              The common causes of a sluggish connection — and how to fix them, in order.
            </p>

            <div className="prose">
              <h2>First, find out where the problem actually is</h2>
              <p>
                Before changing anything, figure out what&apos;s slow. Run a{" "}
                <a href="/">speed test</a> (the one on this page works) on the device that feels
                sluggish, then on another device next to your router. This quickly tells you which of
                three things you&apos;re dealing with:
              </p>
              <ul>
                <li>
                  <b>Slow on every device</b> → likely your internet plan or your provider.
                </li>
                <li>
                  <b>Slow on one device only</b> → that device, not your network.
                </li>
                <li>
                  <b>Slow far from the router but fine nearby</b> → a Wi-Fi coverage problem, not a
                  speed problem.
                </li>
              </ul>
              <p>Knowing which bucket you&apos;re in saves you from fixing the wrong thing.</p>

              <h2>The most common causes, easiest fixes first</h2>
              <ol>
                <li>
                  <b>Restart your router and modem.</b> Unplug both for 30 seconds, plug the modem
                  back first, then the router. It&apos;s a cliché because it genuinely resolves a
                  large share of slowdowns — background glitches clear on reboot.
                </li>
                <li>
                  <b>You&apos;re too far from the router (or there&apos;s too much in the way).</b>{" "}
                  Wi-Fi weakens with distance and through walls, floors, and appliances. Microwaves
                  and some cordless devices interfere on the 2.4 GHz band. Move closer, or move the
                  router to a central, open, elevated spot — not inside a cabinet or behind the TV.
                </li>
                <li>
                  <b>Too many devices at once.</b> Streaming, downloads, game updates, and smart-home
                  gadgets all share your bandwidth. One big download or update in the background can
                  throttle everything else. Pause or schedule the heavy stuff.
                </li>
                <li>
                  <b>2.4 GHz vs 5 GHz band.</b> Most modern routers broadcast both. 2.4 GHz reaches
                  farther but is slower and more congested; 5 GHz is much faster but shorter-range.
                  For speed near the router, connect to the 5 GHz network; for range, use 2.4 GHz.
                </li>
                <li>
                  <b>Network congestion at peak times.</b> Evenings, when the whole neighborhood is
                  online, can slow shared connections. If speeds dip only at certain hours, this is
                  likely the cause — and largely out of your hands.
                </li>
                <li>
                  <b>An outdated router.</b> Old hardware can&apos;t deliver speeds you&apos;re paying
                  for. If your router is many years old, it may be the bottleneck — a newer one can be
                  the single biggest upgrade.
                </li>
                <li>
                  <b>Your plan simply isn&apos;t fast enough.</b> If every device is slow and a wired
                  test matches your speeds, you may have{" "}
                  <a href="/what-is-a-good-internet-speed/">outgrown your plan</a> (more people, more devices
                  than when you signed up).
                </li>
              </ol>

              <h2>Wi-Fi vs wired — the honest truth</h2>
              <p>
                Wi-Fi is convenient but always loses some speed and stability to interference and
                distance. For anything that needs maximum reliability — gaming, video calls, big
                uploads — a <a href="/wifi-vs-ethernet/">wired Ethernet connection</a> is consistently
                better. If a device sits near the router, plugging in is the simplest real fix.
              </p>

              <h2>A note on what a speed test can and can&apos;t tell you</h2>
              <p>
                A speed test measures your connection at that moment, from your device to a server —
                so a slow result confirms there&apos;s a problem but doesn&apos;t pinpoint the cause.
                Run it a few times, in a few spots, to separate a true slowdown from a momentary dip.
                Remember it&apos;s an honest snapshot, not a fixed number.
              </p>

              <h2>Quick checklist</h2>
              <p>
                Reboot router → test near vs far → switch to 5 GHz up close → pause big downloads →
                try a wired cable → if all devices are still slow, check your plan or router age.
              </p>

              <h2>Check your speed</h2>
              <p>
                You can run a real download, upload, and{" "}
                <a href="/ping-vs-jitter/">ping</a> test right here on{" "}
                <a href="/">GetNetStats</a> — in your browser, nothing stored, no sign-up.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
