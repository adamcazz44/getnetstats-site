import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const SITE = "https://getnetstats.com";
const PUBLISHED = "2026-06-23";

export const metadata: Metadata = {
  title: "What Is an ISP? Internet Service Providers Explained | GetNetStats",
  description:
    "What an ISP (Internet Service Provider) is and does, the main connection types (fiber, cable, DSL, fixed wireless, satellite, mobile), what your ISP can and can't see, and how to choose one.",
  keywords: [
    "what is an isp",
    "internet service provider",
    "isp explained",
    "fiber vs cable internet",
    "what can my isp see",
    "how to choose an isp",
    "types of internet connection",
  ],
  alternates: { canonical: "/what-is-an-isp/" },
  openGraph: {
    type: "article",
    siteName: "GetNetStats",
    title: "What Is an ISP? Internet Service Providers Explained",
    description:
      "The company that connects you to the internet — what it does, what it sees, and how to choose one.",
    url: `${SITE}/what-is-an-isp/`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GetNetStats" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "What Is an ISP? — GetNetStats",
    description: "What an ISP does, what it can see, and how to choose one.",
  },
};

export default function WhatIsAnIspPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "What Is an ISP?", item: `${SITE}/what-is-an-isp/` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What Is an ISP? Internet Service Providers Explained",
    description:
      "What an ISP is and does, the main connection types, what your ISP can and can't see, and how to choose or compare one.",
    image: [`${SITE}/og.png`],
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/what-is-an-isp/` },
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
        <section className="page" aria-labelledby="isp-h">
          <div className="wrap">
            <div className="eyebrow">
              <a className="eyebrow-home" href="/">Home</a> // learn
            </div>
            <h1 id="isp-h">What is an ISP? Internet service providers explained</h1>
            <p className="page-sub">
              The company that connects you to the internet — what it does, what it sees, and how to
              choose one.
            </p>
            <p className="updated">Last reviewed: June 23, 2026</p>

            <div className="prose">
              <h2>The basics</h2>
              <p>
                An <strong>ISP</strong> — Internet Service Provider — is the company that gives you
                access to the internet. When you pay a monthly bill for home internet or mobile data,
                you&apos;re paying an ISP. They own or lease the physical infrastructure (cables,
                fiber, cell towers) that carries your traffic from your home or phone out to the wider
                internet, and back. Without an ISP, your devices would have no path to anything online.
              </p>

              <h2>What an ISP actually does</h2>
              <p>Think of the ISP as the on-ramp to the internet&apos;s highway system:</p>
              <ul>
                <li>
                  <b>Connects you physically</b> — via fiber, cable, DSL, fixed wireless, satellite, or
                  a mobile network.
                </li>
                <li>
                  <b>Assigns your public IP address</b> — the address the rest of the internet sees you
                  as. (This is why a tool can show you your ISP: your IP is registered to their network
                  — see <a href="/what-is-an-asn/">What is an ASN?</a> for how that mapping works.)
                </li>
                <li>
                  <b>Routes your traffic</b> — passing your requests toward their destination and
                  bringing responses back.
                </li>
                <li>
                  <b>Provides supporting services</b> — like DNS resolution (translating domain names to
                  addresses), and sometimes email, Wi-Fi equipment, or TV bundles.
                </li>
              </ul>

              <h2>The main types of ISP connection</h2>
              <p>
                Not all ISPs deliver the internet the same way, and the method largely determines your
                speed and reliability:
              </p>
              <ul>
                <li>
                  <b>Fiber</b> — data over light through glass cables. The fastest and most reliable,
                  with strong upload speeds, where available.
                </li>
                <li>
                  <b>Cable</b> — over the same coaxial lines as cable TV. Fast downloads, common, but
                  upload is often much lower and speeds can dip when the neighborhood is busy.
                </li>
                <li>
                  <b>DSL</b> — over telephone lines. Widely available but slower; being phased out in
                  many areas.
                </li>
                <li>
                  <b>Fixed wireless / 5G home internet</b> — internet beamed to an antenna at your home.
                  Increasingly competitive.
                </li>
                <li>
                  <b>Satellite</b> — available almost anywhere, but historically higher latency (newer
                  low-orbit services have improved this).
                </li>
                <li>
                  <b>Mobile</b> — your cellular carrier is also an ISP for your phone&apos;s data.
                </li>
              </ul>

              <h2>What your ISP can see (the honest part)</h2>
              <p>This is worth being straight about, because it&apos;s often misunderstood:</p>
              <ul>
                <li>
                  Your ISP can see <b>which sites you connect to</b> (the domains), since your traffic
                  routes through them and they often handle your DNS. Most modern sites use HTTPS
                  encryption, so they generally can&apos;t see the specific content or pages within a
                  site — but the destinations, timing, and volume are visible to them.
                </li>
                <li>
                  Your ISP <b>assigns and knows your IP address</b>, and ties it to your account —
                  which is the one piece of information that can connect online activity back to a real
                  subscriber (something they don&apos;t share without legal process).
                </li>
              </ul>
              <p>
                This is exactly why some people use a VPN: it encrypts traffic between you and the VPN
                server, so your ISP sees only that you&apos;re connected to a VPN, not which sites
                you&apos;re visiting. (See <a href="/hide-your-ip-address/">How to hide your IP address</a>{" "}
                for the honest version of what a VPN does and doesn&apos;t protect.)
              </p>

              <h2>How to choose or compare an ISP</h2>
              <p>A few things that matter more than the headline speed:</p>
              <ul>
                <li>
                  <b>What&apos;s actually available at your address</b> — ISP options are
                  location-dependent; fiber may exist on one street and not the next.
                </li>
                <li>
                  <b>Upload speed, not just download</b> — important if you work from home, video call,
                  or upload often.
                </li>
                <li>
                  <b>Real-world reliability</b> — local reviews and outage history often matter more than
                  the advertised maximum.
                </li>
                <li>
                  <b>Data caps and contract terms</b> — some plans throttle or charge after a data
                  limit, or raise prices after a promo period.
                </li>
                <li>
                  <b>Equipment</b> — whether you must rent their router/modem or can use your own.
                </li>
              </ul>

              <h2>See your ISP and connection details</h2>
              <p>
                You can see which ISP your current connection belongs to — along with your public IP
                and estimated location — instantly at the top of <a href="/">GetNetStats</a>, nothing
                stored, no sign-up. To see the network identity behind it (the ASN and operator), use
                the <a href="/asn-routing/">ASN &amp; Routing tool</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
