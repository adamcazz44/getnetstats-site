import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const SITE = "https://getnetstats.com";
const PUBLISHED = "2026-06-22";

export const metadata: Metadata = {
  title: "What Is a DNS Record? A Practical Guide | GetNetStats",
  description:
    "DNS records explained in plain English — what they are, the six types that matter (A, AAAA, CNAME, MX, TXT, NS), how TTL and propagation work, and how to read any domain's live records.",
  keywords: [
    "what is a dns record",
    "dns records explained",
    "a record",
    "mx record",
    "txt record",
    "dns ttl",
    "dns propagation",
  ],
  alternates: { canonical: "/what-is-a-dns-record/" },
  openGraph: {
    type: "article",
    siteName: "GetNetStats",
    title: "What Is a DNS Record? A Practical Guide",
    description:
      "The internet's address book, explained — the record types that matter, TTL, propagation, and how to read your own.",
    url: `${SITE}/what-is-a-dns-record/`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GetNetStats" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "What Is a DNS Record? — GetNetStats",
    description: "DNS records, TTL and propagation explained in plain English.",
  },
};

export default function WhatIsADnsRecordPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "What Is a DNS Record?", item: `${SITE}/what-is-a-dns-record/` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What Is a DNS Record? A Practical Guide",
    description:
      "What DNS records are, the six types that matter (A, AAAA, CNAME, MX, TXT, NS), how TTL and propagation work, and how to read any domain's live records.",
    image: [`${SITE}/og.png`],
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/what-is-a-dns-record/` },
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
        <section className="page" aria-labelledby="dnsrec-h">
          <div className="wrap">
            <div className="eyebrow">
              <a className="eyebrow-home" href="/">Home</a> // learn
            </div>
            <h1 id="dnsrec-h">What is a DNS record? A practical guide</h1>
            <p className="page-sub">
              The internet&apos;s address book, explained — plus how to read your own records.
            </p>

            <div className="prose">
              <h2>The problem DNS solves</h2>
              <p>
                People remember names like <span className="mono">getnetstats.com</span>; computers
                route traffic using numeric IP addresses like{" "}
                <span className="mono">185.199.108.153</span>. DNS — the Domain Name System — is the
                translation layer between the two. When you type a domain, your device asks DNS
                &quot;what&apos;s the address for this name?&quot; and DNS answers using a set of
                stored entries called records. Without it, you&apos;d have to memorize IP addresses
                for every site you visit.
              </p>

              <h2>What a DNS record actually is</h2>
              <p>
                A DNS record is a single instruction stored in a domain&apos;s zone file, telling the
                internet one specific fact about that domain — where its website lives, where its
                email goes, who&apos;s allowed to send mail as it, and so on. Each record has a{" "}
                <strong>type</strong> (a short code like <span className="mono">A</span> or{" "}
                <span className="mono">MX</span>) that defines what kind of information it holds. A
                domain typically has many records working together.
              </p>

              <h2>The record types that matter</h2>
              <p>Here are the ones you&apos;ll actually encounter, in plain English:</p>
              <ul>
                <li>
                  <b>A record</b> — maps the domain to its IPv4 address (the server it lives on). The
                  most fundamental record; visiting a site starts here.
                </li>
                <li>
                  <b>AAAA record</b> — the same thing for IPv6, the newer, larger address format. Many
                  domains publish both.
                </li>
                <li>
                  <b>CNAME record</b> — an alias that points one name at another (e.g.,{" "}
                  <span className="mono">www.example.com → example.com</span>). Useful so you only
                  update the address in one place.
                </li>
                <li>
                  <b>MX record</b> — mail exchange: names the servers that receive email for the
                  domain, each with a priority (lower numbers tried first). No MX usually means the
                  domain doesn&apos;t accept email.
                </li>
                <li>
                  <b>TXT record</b> — free-form text, used in practice for domain verification and
                  email-security policies (<span className="mono">SPF</span>,{" "}
                  <span className="mono">DKIM</span>, <span className="mono">DMARC</span>) that control
                  who&apos;s allowed to send mail as the domain. If you&apos;ve ever &quot;verified a
                  domain&quot; by pasting a code, that&apos;s a TXT record.
                </li>
                <li>
                  <b>NS record</b> — name servers: the authoritative servers that actually hold the
                  domain&apos;s records, usually run by its registrar or DNS host.
                </li>
              </ul>
              <p>
                There are more (<span className="mono">SOA</span>, <span className="mono">CAA</span>,{" "}
                <span className="mono">SRV</span>, <span className="mono">PTR</span>), but those six
                cover the vast majority of what a domain needs.
              </p>

              <h2>TTL — why DNS doesn&apos;t update instantly</h2>
              <p>
                Every record carries a <strong>TTL</strong> (Time To Live) — a number, in seconds,
                telling other servers how long they&apos;re allowed to cache the answer before
                checking again. A TTL of <span className="mono">3600</span> means &quot;remember this
                for an hour.&quot; TTL is why DNS feels slow to change: when you update a record,
                servers and devices that already cached the old value keep using it until their TTL
                expires. Lower TTLs update faster but mean more lookups; higher TTLs are more
                efficient but slower to change.
              </p>

              <h2>Propagation — the &quot;it&apos;s not updated yet&quot; feeling</h2>
              <p>
                When people say a DNS change is &quot;propagating,&quot; they mean the world is
                gradually letting go of the old cached values as TTLs expire across countless
                resolvers. There&apos;s no single switch — different networks pick up the change at
                different times. A change can appear for you in minutes but take up to a day or two to
                be visible everywhere. This is completely normal, not a sign anything&apos;s broken —
                and it&apos;s why two DNS-checking tools can briefly disagree.
              </p>

              <h2>How to read your own records</h2>
              <p>You don&apos;t need command-line tools. You can look up any domain&apos;s live DNS records right here:</p>
              <ol>
                <li>
                  Enter the domain in the <a href="/dns-checker/">DNS Checker</a> on GetNetStats.
                </li>
                <li>
                  You&apos;ll see its A, AAAA, MX, TXT, NS, and CNAME records as they currently
                  resolve.
                </li>
                <li>
                  It runs in your browser via public DNS-over-HTTPS resolvers — nothing stored, no
                  sign-up.
                </li>
              </ol>
              <p>
                One honest note: a DNS lookup sends the domain you&apos;re checking to a public
                resolver (that&apos;s how every DNS query works, anywhere), and results reflect what
                that resolver currently has cached — so right after a change, give propagation time
                before assuming something&apos;s wrong.
              </p>

              <h2>Check a domain&apos;s records</h2>
              <p>
                Try it now with the <a href="/dns-checker/">DNS Checker</a> — look up any domain and
                see exactly what its DNS says.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
