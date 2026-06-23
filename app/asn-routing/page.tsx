import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AsnTool from "@/components/tools/AsnTool";

export const metadata: Metadata = {
  title: "ASN & Routing Lookup — Free IP ASN, Operator & Reverse DNS | GetNetStats",
  description:
    "Look up the network behind any IP — ASN, AS organization, ISP/operator, a best-effort connection-type estimate, and reverse-DNS hostname. Runs in your browser, free, no sign-up.",
  keywords: [
    "asn lookup",
    "ip asn",
    "autonomous system number",
    "reverse dns lookup",
    "ptr record",
    "ip routing info",
    "hosting or residential ip",
  ],
  alternates: { canonical: "/asn-routing/" },
  openGraph: {
    type: "website",
    siteName: "GetNetStats",
    title: "ASN & Routing Lookup — ASN, Operator & Reverse DNS",
    description:
      "The network behind any IP: ASN, AS organization, operator, connection-type estimate, and reverse DNS. Free, no sign-up.",
    url: "https://getnetstats.com/asn-routing/",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "GetNetStats — free network tools" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "ASN & Routing Lookup — GetNetStats",
    description: "ASN, AS org, operator, connection-type estimate and reverse DNS for any IP.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "ASN & Routing Lookup",
      url: "https://getnetstats.com/asn-routing/",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires a modern web browser",
      description:
        "Look up the ASN, AS organization, ISP/operator, connection-type estimate and reverse-DNS hostname behind any IP address, live in your browser. Free, no sign-up.",
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
          name: "ASN & Routing Lookup",
          item: "https://getnetstats.com/asn-routing/",
        },
      ],
    },
  ],
};

export default function AsnRoutingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main id="top">
        <AsnTool />

        <div className="wrap">
          <hr className="divider" />
        </div>

        <section aria-labelledby="asn-learn-h">
          <div className="wrap">
            <div className="eyebrow">Understand the results</div>
            <h2 className="sec" id="asn-learn-h">
              What the routing fields mean
            </h2>
            <div className="content-grid">
              <div className="prose">
                <h3>ASN (autonomous system number)</h3>
                <p>
                  An <strong>ASN</strong> identifies the <strong>autonomous system</strong> — a block
                  of IP addresses run under one routing policy — that an IP belongs to. It&apos;s how
                  networks announce routes to each other across the internet. Every IP that&apos;s
                  reachable online sits inside some ASN.
                </p>

                <h3>AS organization</h3>
                <p>
                  The <strong>AS organization</strong> is the entity that operates that autonomous
                  system — an ISP, a hosting company, a university, a cloud provider. It&apos;s the
                  clearest signal of <em>who</em> actually runs the network an IP lives on.
                </p>

                <h3>Connection type</h3>
                <p>
                  This is a <strong>best-effort estimate</strong>, not a certainty. We infer
                  &quot;hosting / datacenter,&quot; &quot;mobile,&quot; or &quot;residential / ISP&quot;
                  from the operator&apos;s name — there&apos;s no perfectly reliable public signal for
                  it, so treat it as a strong hint rather than a fact. A residential connection behind
                  an unusual operator name can be misclassified.
                </p>

                <h3>ISP / operator</h3>
                <p>
                  The <strong>ISP or operator</strong> is the network provider serving the IP. It
                  often matches the AS organization, but not always — resellers and sub-allocations
                  can differ.
                </p>

                <h3>Location</h3>
                <p>
                  The <strong>location</strong> is an <em>estimate</em> derived from IP geolocation
                  databases — usually accurate to the city or region, but sometimes off by a wide
                  margin. It is never a precise position, and it&apos;s the same class of estimate the{" "}
                  <a href="/what-is-an-ip-address/">homepage IP lookup</a> shows.
                </p>

                <h3>Reverse DNS (PTR)</h3>
                <p>
                  A <strong>PTR record</strong> maps an IP back to a hostname — the reverse of a
                  normal lookup. Hosting and mail servers usually have one (it often hints at the
                  provider); many residential IPs don&apos;t, so <strong>&quot;Not available&quot;</strong>{" "}
                  is completely normal and not an error.
                </p>
              </div>

              <aside>
                <div className="note-card">
                  <h4>
                    <span className="d" />
                    How this check works
                  </h4>
                  <p>
                    Routing data comes from public IP databases (
                    <strong style={{ color: "var(--text)" }}>ipwho.is</strong>, with ipapi.co as a
                    fallback), and the reverse-DNS hostname comes from a{" "}
                    <strong style={{ color: "var(--text)" }}>DNS-over-HTTPS</strong> PTR query
                    (Cloudflare, then Google). It all runs in your browser — nothing is stored, no
                    sign-up.
                  </p>
                  <p>
                    Two honest caveats:{" "}
                    <strong style={{ color: "var(--text)" }}>
                      connection type is a classification, not a guarantee
                    </strong>
                    , and the <strong style={{ color: "var(--text)" }}>location is an estimate</strong>{" "}
                    — city-level at best, and sometimes wrong. ASN and operator are the most reliable
                    fields here.
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
