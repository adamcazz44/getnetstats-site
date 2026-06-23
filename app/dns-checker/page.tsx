import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DnsTool from "@/components/tools/DnsTool";

export const metadata: Metadata = {
  title: "DNS Checker — Free A, AAAA, MX, TXT, NS & CNAME Lookup | GetNetStats",
  description:
    "Look up a domain's DNS records live in your browser — A, AAAA, MX, TXT, NS and CNAME — via public DNS-over-HTTPS resolvers. Free, no sign-up, nothing stored.",
  keywords: [
    "dns checker",
    "dns lookup",
    "dns record lookup",
    "mx record lookup",
    "txt record check",
    "ns record",
    "cname lookup",
    "dns over https",
  ],
  alternates: { canonical: "/dns-checker/" },
  openGraph: {
    type: "website",
    siteName: "GetNetStats",
    title: "DNS Checker — A, AAAA, MX, TXT, NS & CNAME Lookup",
    description:
      "Look up any domain's DNS records live in your browser via public DoH resolvers. Free, no sign-up.",
    url: "https://getnetstats.com/dns-checker/",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "GetNetStats — free network tools" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "DNS Checker — GetNetStats",
    description: "Live A, AAAA, MX, TXT, NS and CNAME lookups in your browser.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "DNS Checker",
      url: "https://getnetstats.com/dns-checker/",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires a modern web browser",
      description:
        "Look up a domain's A, AAAA, MX, TXT, NS and CNAME records live in your browser via public DNS-over-HTTPS resolvers. Free, no sign-up.",
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
          name: "DNS Checker",
          item: "https://getnetstats.com/dns-checker/",
        },
      ],
    },
  ],
};

export default function DnsCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <SiteHeader />
      <main id="top">
        <DnsTool />

        <div className="wrap">
          <hr className="divider" />
        </div>

        <section aria-labelledby="dns-learn-h">
          <div className="wrap">
            <div className="eyebrow">Understand the results</div>
            <h2 className="sec" id="dns-learn-h">
              What each DNS record means
            </h2>
            <a className="read-more" href="/what-is-a-dns-record/">
              New to DNS? Read the guide <span aria-hidden="true">→</span>
            </a>
            <div className="content-grid">
              <div className="prose">
                <h3>A record (IPv4 address)</h3>
                <p>
                  The <strong>A record</strong> maps a domain to the <strong>IPv4 address</strong> of
                  the server that hosts it — the numeric address your browser actually connects to
                  after it looks the name up. A domain can have several, for redundancy or load
                  balancing.
                </p>

                <h3>AAAA record (IPv6 address)</h3>
                <p>
                  The <strong>AAAA record</strong> is the same idea for <strong>IPv6</strong> — the
                  newer, much larger address space. Many domains publish both A and AAAA records so
                  visitors connect over whichever their network supports.
                </p>

                <h3>MX record (mail servers)</h3>
                <p>
                  <strong>MX records</strong> tell other mail servers where to deliver email for the
                  domain. Each has a <strong>priority</strong> number — lower is tried first, with
                  higher numbers acting as backups. No MX record usually means the domain
                  doesn&apos;t receive email.
                </p>

                <h3>TXT record (text records)</h3>
                <p>
                  <strong>TXT records</strong> hold free-form text used for verification and email
                  authentication — things like <span className="mono">SPF</span>,{" "}
                  <span className="mono">DKIM</span>, and domain-ownership checks. They&apos;re how a
                  domain proves to other services that it controls itself.
                </p>

                <h3>NS record (name servers)</h3>
                <p>
                  <strong>NS records</strong> list the authoritative <strong>name servers</strong>{" "}
                  responsible for the domain — the servers that hold the real answers for it. They
                  tell the rest of the internet who to ask.
                </p>

                <h3>CNAME record (alias)</h3>
                <p>
                  A <strong>CNAME</strong> points one name at another — for example,{" "}
                  <span className="mono">www</span> pointing at the root domain. The lookup then
                  follows the target&apos;s records. It&apos;s an alias, not a destination address.
                </p>
              </div>

              <aside>
                <div className="note-card">
                  <h4>
                    <span className="d" />
                    How this check works
                  </h4>
                  <p>
                    This runs entirely in your browser using{" "}
                    <strong style={{ color: "var(--text)" }}>DNS-over-HTTPS</strong> — it asks
                    Cloudflare&apos;s public resolver (with Google&apos;s as a fallback) and shows
                    whichever answered. Nothing is stored and there&apos;s no sign-up.
                  </p>
                  <p>
                    One honest note:{" "}
                    <strong style={{ color: "var(--text)" }}>
                      the query goes to a public resolver
                    </strong>
                    , so it isn&apos;t private the way a query you never send would be — the resolver
                    sees the domain you ask about.
                  </p>
                  <p>
                    DNS also doesn&apos;t update everywhere at once. Records are cached for a set time
                    (their <span className="mono">TTL</span>), so a recent change can take minutes to
                    a couple of days to appear, and two resolvers may briefly disagree —
                    that&apos;s normal <em>propagation</em>, not an error.
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
