import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NetworkMesh from "@/components/guides/NetworkMesh";

const SITE = "https://getnetstats.com";
const PUBLISHED = "2026-06-22";

export const metadata: Metadata = {
  title: "What Is an ASN? Autonomous Systems Explained | GetNetStats",
  description:
    "What an ASN (Autonomous System Number) is, in plain English — how networks route traffic with BGP, what an ASN reveals about an IP (residential vs hosting vs mobile), who assigns them, and how to check any IP's ASN.",
  keywords: [
    "what is an asn",
    "autonomous system number",
    "asn explained",
    "bgp routing",
    "residential vs hosting ip",
    "regional internet registry",
    "ip asn lookup",
  ],
  alternates: { canonical: "/what-is-an-asn/" },
  openGraph: {
    type: "article",
    siteName: "GetNetStats",
    title: "What Is an ASN? Autonomous Systems Explained",
    description:
      "The number that identifies who actually runs a piece of the internet — and what it reveals about an IP.",
    url: `${SITE}/what-is-an-asn/`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GetNetStats" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "What Is an ASN? — GetNetStats",
    description: "Autonomous System Numbers explained, and what they reveal about an IP.",
  },
};

export default function WhatIsAnAsnPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "What Is an ASN?", item: `${SITE}/what-is-an-asn/` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What Is an ASN? Autonomous Systems Explained",
    description:
      "What an ASN is, how networks route traffic with BGP, what an ASN reveals about an IP (residential vs hosting vs mobile), who assigns them, and how to check any IP's ASN.",
    image: [`${SITE}/og.png`],
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/what-is-an-asn/` },
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
        <section className="page" aria-labelledby="asn-h">
          <div className="wrap">
            <div className="eyebrow">
              <a className="eyebrow-home" href="/">Home</a> // learn
            </div>
            <h1 id="asn-h">What is an ASN? Autonomous systems explained</h1>
            <p className="page-sub">
              The number that identifies who actually runs a piece of the internet — and what it
              reveals about an IP.
            </p>
            <p className="updated">Last reviewed: June 22, 2026</p>

            <div className="prose">
              <h2>The internet is a network of networks</h2>
              <p>
                The internet isn&apos;t one big system — it&apos;s thousands of independent networks
                (ISPs, hosting companies, universities, cloud providers, big tech firms) all
                interconnected. Each of these networks needs a way to be identified so traffic can be
                routed between them. That identifier is an <strong>ASN</strong> — an Autonomous System
                Number.
              </p>

              <figure className="guide-diagram">
                <NetworkMesh />
                <figcaption className="guide-figcap">
                  AS7922 and AS15169 are the real, publicly registered ASNs for Comcast and Google —
                  every independent network on the internet has one.
                </figcaption>
              </figure>

              <h2>What an ASN actually is</h2>
              <p>
                An autonomous system (AS) is a collection of IP addresses managed under a single
                organization with one consistent routing policy. Its ASN is the unique number assigned
                to it, written like <span className="mono">AS7922</span> (Comcast) or{" "}
                <span className="mono">AS15169</span> (Google). Think of it as a network&apos;s
                official ID in the internet&apos;s routing system — the way a phone area code
                identifies a region, an ASN identifies a network.
              </p>
              <p>
                When data travels across the internet, it hops from one autonomous system to another
                until it reaches its destination. The networks announce to each other &quot;I can
                reach these IP ranges&quot; using their ASNs, via a protocol called{" "}
                <strong>BGP</strong> (Border Gateway Protocol). You don&apos;t need to know BGP&apos;s
                details — just that ASNs are how networks tell each other where traffic should go.
              </p>

              <h2>Why an ASN matters (what it reveals)</h2>
              <p>
                For an ordinary person checking an IP, the ASN and its organization answer a
                surprisingly useful question: <em>who really runs this connection?</em> That&apos;s
                more revealing than it sounds:
              </p>
              <ul>
                <li>
                  <b>The operator&apos;s identity</b> — the AS organization names the ISP, host, or
                  company behind an IP. This is often clearer than the &quot;ISP&quot; label alone.
                </li>
                <li>
                  <b>Residential vs. hosting vs. mobile</b> — this is the big one. An IP belonging to
                  a consumer ISP&apos;s ASN looks like a normal home user. An IP belonging to a
                  hosting/data-center ASN (like a cloud provider) is a server — which is what VPNs,
                  bots, scrapers, and automated traffic typically run on. A mobile carrier&apos;s ASN
                  means a phone network. Sites use this signal constantly: to flag suspicious logins,
                  decide whether to show a CAPTCHA, or detect VPN traffic.
                </li>
                <li>
                  <b>Routing footprint</b> — large networks hold multiple ASNs and huge IP ranges; the
                  ASN hints at the scale and type of the operator.
                </li>
              </ul>

              <h2>An honest caveat about &quot;connection type&quot;</h2>
              <p>
                Classifying an IP as residential, hosting, or mobile is an educated inference, not a
                hard fact. It&apos;s usually derived from the operator&apos;s name and public
                databases, and it can be wrong — a legitimate business connection might look unusual,
                and some networks blur the lines. Treat the connection-type label as a{" "}
                <strong>strong hint, not proof</strong>. The ASN and operator name themselves are
                generally reliable; the interpretation around them is informed guesswork.
              </p>

              <h2>Who assigns ASNs?</h2>
              <p>
                ASNs are handed out by the <strong>Regional Internet Registries</strong> (RIRs) — the
                same bodies that allocate IP address blocks (ARIN for North America, RIPE for Europe,
                APNIC for Asia-Pacific, and others). An organization that needs to run its own
                independent routing applies for an ASN and the IP ranges that go with it. This is all
                public information, which is why tools can look it up.
              </p>

              <h2>How to check an IP&apos;s ASN</h2>
              <p>You can see the autonomous system behind any IP — including your own — right here:</p>
              <ol>
                <li>
                  Open the <a href="/asn-routing/">ASN &amp; Routing tool</a> on GetNetStats. Your own
                  IP is filled in by default; paste any other IP to analyze it instead.
                </li>
                <li>
                  You&apos;ll see the ASN, the operator, a best-effort connection-type estimate, and
                  the reverse-DNS hostname.
                </li>
                <li>
                  It runs in your browser using public routing data — nothing stored, no sign-up.
                </li>
              </ol>
              <p>
                A useful experiment: check your home IP, then check a public one like{" "}
                <span className="mono">8.8.8.8</span> (Google&apos;s DNS). Yours will likely show your
                ISP&apos;s ASN classified as residential; Google&apos;s will show a hosting/data-center
                ASN — a clear illustration of how ASNs distinguish a home connection from a server.
              </p>

              <h2>Check an IP&apos;s ASN</h2>
              <p>
                Try it now with the <a href="/asn-routing/">ASN &amp; Routing tool</a> — see the
                network behind any IP address.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
