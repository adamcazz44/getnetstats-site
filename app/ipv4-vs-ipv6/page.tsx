import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const SITE = "https://getnetstats.com";
const PUBLISHED = "2026-06-22";

export const metadata: Metadata = {
  title: "IPv4 vs IPv6: What's the Difference? | GetNetStats",
  description:
    "Why the internet runs two address systems — IPv4 vs IPv6 explained in plain English: what they look like, why IPv6 exists, the practical differences, which you're using, and what it means for privacy and speed.",
  keywords: [
    "ipv4 vs ipv6",
    "difference between ipv4 and ipv6",
    "what is ipv6",
    "ipv6 address",
    "dual stack",
    "ipv4 address exhaustion",
    "ip address format",
  ],
  alternates: { canonical: "/ipv4-vs-ipv6/" },
  openGraph: {
    type: "article",
    siteName: "GetNetStats",
    title: "IPv4 vs IPv6: What's the Difference?",
    description:
      "What IPv4 and IPv6 look like, why IPv6 exists, the practical differences, which you're using, and what it means for privacy and speed.",
    url: `${SITE}/ipv4-vs-ipv6/`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GetNetStats" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "IPv4 vs IPv6: What's the Difference? — GetNetStats",
    description: "Why the internet runs two address systems, and what it means for you.",
  },
};

export default function Ipv4VsIpv6Page() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "IPv4 vs IPv6", item: `${SITE}/ipv4-vs-ipv6/` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "IPv4 vs IPv6: What's the Difference?",
    description:
      "Why the internet runs two address systems — what IPv4 and IPv6 look like, why IPv6 exists, the practical differences, which you're using, and what it means for privacy and speed.",
    image: [`${SITE}/og.png`],
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/ipv4-vs-ipv6/` },
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
        <section className="page" aria-labelledby="ipv-h">
          <div className="wrap">
            <div className="eyebrow">
              <a className="eyebrow-home" href="/">Home</a> // learn
            </div>
            <h1 id="ipv-h">IPv4 vs IPv6: what&apos;s the difference?</h1>
            <p className="page-sub">
              Why the internet runs two address systems — and what it means for you.
            </p>
            <p className="updated">Last reviewed: June 22, 2026</p>

            <div className="prose">
              <h2>The short version</h2>
              <p>
                IPv4 and IPv6 are two versions of the system that gives every device on the internet
                an address. IPv4 came first and is still the most common; IPv6 is the newer, much
                larger system built to fix IPv4&apos;s biggest problem — the world ran out of
                addresses. Both do the same core job: identify devices so data reaches the right
                place.
              </p>

              <h2>What they look like</h2>
              <p>The easiest way to tell them apart is the format:</p>
              <ul>
                <li>
                  <b>IPv4</b> uses four numbers separated by dots, each from 0 to 255 — for example,{" "}
                  <span className="mono">192.0.2.146</span>. Short, familiar, easy to read.
                </li>
                <li>
                  <b>IPv6</b> is much longer, using groups of letters and numbers separated by colons
                  — for example,{" "}
                  <span className="mono">2001:0db8:85a3:0000:0000:8a2e:0370:7334</span>. It often
                  gets shortened by collapsing zeros (
                  <span className="mono">2001:db8:85a3::8a2e:370:7334</span>).
                </li>
              </ul>
              <p>
                If the address at the top of <a href="/">this page</a> has dots, you&apos;re seeing
                IPv4; if it has colons and hex characters, that&apos;s IPv6. Many connections show
                both.
              </p>

              <h2>Why IPv6 exists</h2>
              <p>
                IPv4 allows about 4.3 billion unique addresses. That sounded limitless in the 1980s —
                but with phones, laptops, smart TVs, doorbells, and countless other connected
                devices, the world simply ran out. IPv6 solves this with a staggeringly larger pool:
                roughly 340 undecillion addresses (that&apos;s 340 followed by 36 zeros) — effectively
                unlimited, enough for every device imaginable to have its own unique address with room
                to spare.
              </p>

              <h2>The practical differences</h2>
              <p>Beyond size, a few differences matter:</p>
              <ul>
                <li>
                  <b>Address space:</b> IPv4 is scarce; IPv6 is effectively infinite. This is the
                  headline reason IPv6 exists.
                </li>
                <li>
                  <b>Configuration:</b> IPv6 can let devices self-assign addresses more easily,
                  simplifying network setup.
                </li>
                <li>
                  <b>No more workarounds:</b> IPv4&apos;s shortage forced techniques like NAT (sharing
                  one public address across many devices). IPv6&apos;s abundance reduces the need for
                  those.
                </li>
                <li>
                  <b>Adoption:</b> Despite its advantages, IPv6 rollout has been gradual. Both systems
                  run side by side today, and most networks support both — a setup called &quot;dual
                  stack.&quot;
                </li>
              </ul>

              <h2>Which one are you using?</h2>
              <p>
                Likely both. Your device and ISP negotiate whichever works for a given connection,
                often preferring IPv6 where available and falling back to IPv4. You don&apos;t need to
                choose or configure anything — it happens automatically.
              </p>

              <h2>Does it affect your privacy or speed?</h2>
              <p>
                For everyday use, the version you&apos;re on makes little practical difference to
                speed. On privacy, the two behave similarly in what they reveal — both expose your ISP
                and an estimated location, and neither identifies you personally on its own. (See our{" "}
                <a href="/what-is-an-ip-address/">guide on what your IP address reveals</a> for the
                full picture.)
              </p>

              <h2>See yours</h2>
              <p>
                <a href="/">GetNetStats</a> shows your current IP address — IPv4, IPv6, or both —
                instantly and privately, with nothing stored.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
