import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const SITE = "https://getnetstats.com";
const PUBLISHED = "2026-06-22";

export const metadata: Metadata = {
  title: "What Is an IP Address? What It Actually Reveals About You | GetNetStats",
  description:
    "A plain-English guide to your IP address: public vs private, what your public IP really reveals (and what it can't), why it changes, IPv4 vs IPv6, and how to hide it. No sign-up.",
  keywords: [
    "what is an ip address",
    "public vs private ip",
    "what does my ip reveal",
    "ip geolocation accuracy",
    "dynamic vs static ip",
    "ipv4 vs ipv6",
    "hide your ip",
  ],
  alternates: { canonical: "/what-is-an-ip-address/" },
  openGraph: {
    type: "article",
    siteName: "GetNetStats",
    title: "What Is an IP Address? (And What It Actually Reveals About You)",
    description:
      "Public vs private IP, what your public IP really reveals, why it changes, IPv4 vs IPv6, and how to hide it — the honest version.",
    url: `${SITE}/what-is-an-ip-address/`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GetNetStats" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "What Is an IP Address? — GetNetStats",
    description: "What your IP reveals, what it can't, and how to hide it — the honest version.",
  },
};

export default function WhatIsAnIpAddressPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "What Is an IP Address?", item: `${SITE}/what-is-an-ip-address/` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What Is an IP Address? (And What It Actually Reveals About You)",
    description:
      "A plain-English guide to the number that identifies your device on the internet — public vs private, what it reveals, why it changes, IPv4 vs IPv6, and how to hide it.",
    image: [`${SITE}/og.png`],
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/what-is-an-ip-address/` },
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
        <section className="page" aria-labelledby="ip-h">
          <div className="wrap">
            <div className="eyebrow">
              <a className="eyebrow-home" href="/">Home</a> // learn
            </div>
            <h1 id="ip-h">What is an IP address? (and what it actually reveals about you)</h1>
            <p className="page-sub">
              A plain-English guide to the number that identifies your device on the internet.
            </p>

            <div className="prose">
              <h2>The basics</h2>
              <p>
                An <strong>IP address</strong> (Internet Protocol address) is a unique label assigned
                to your device so the internet knows where to send the data you ask for. When you
                load a website, your request travels out with your IP attached — like a return
                address on an envelope — so the response knows how to find its way back. Without one,
                your device couldn&apos;t communicate online at all.
              </p>

              <h2>Public vs. private — two different addresses</h2>
              <p>
                Most people have two IP addresses, and confusing them causes a lot of
                misunderstanding:
              </p>
              <ul>
                <li>
                  <b>Your public IP</b> is the address the outside internet sees. It&apos;s assigned
                  by your internet provider (ISP) and shared by every device on your network. This is
                  the one shown at the top of <a href="/">this page</a>.
                </li>
                <li>
                  <b>Your private IP</b> is what your home router assigns to each device inside your
                  network (your laptop, phone, TV). These usually start with{" "}
                  <span className="mono">192.168.</span> or <span className="mono">10.</span> and
                  never leave your network.
                </li>
              </ul>
              <p>
                So when a website &quot;sees your IP,&quot; it sees your public one — your
                router&apos;s address, not your individual device.
              </p>

              <h2>What your public IP actually reveals</h2>
              <p>
                This is where honesty matters, because it&apos;s often over- and under-stated:
              </p>
              <ul>
                <li>
                  <b>Your ISP</b> — the company providing your connection is usually identifiable
                  from your IP.
                </li>
                <li>
                  <b>A rough location</b> — typically your city or region. Crucially, this is an{" "}
                  <em>estimate</em>, not GPS. IP geolocation is frequently off by a wide margin,
                  sometimes placing you in the wrong city, state, or even country. Any site
                  (including this one) that shows your location from your IP is making an educated
                  guess.
                </li>
                <li>
                  <b>What it does not reveal:</b> your name, your street address, your specific
                  device, or what you&apos;re doing online. Your IP alone can&apos;t identify you
                  personally — that requires information your ISP holds and doesn&apos;t hand out
                  without legal process.
                </li>
              </ul>

              <h2>Why it changes</h2>
              <p>
                Most home IPs are <strong>dynamic</strong> — your ISP rotates them periodically, so
                yours may differ week to week. Some connections have a <strong>static</strong>{" "}
                (fixed) IP, more common for businesses. Either is normal.
              </p>

              <h2>IPv4 and IPv6</h2>
              <p>
                You may see two formats. IPv4 looks like{" "}
                <span className="mono">192.0.2.146</span> — four numbers separated by dots. IPv6 is
                longer, like <span className="mono">2001:0db8:85a3::8a2e:0370:7334</span>, and exists
                because the world ran out of IPv4 addresses. We cover the differences in detail in our{" "}
                <a href="/ipv4-vs-ipv6/">IPv4 vs IPv6 guide</a>.
              </p>

              <h2>Can you hide it?</h2>
              <p>
                Yes — a VPN or proxy replaces your visible public IP with the server&apos;s, so sites
                see that address instead of yours. It&apos;s the most common way to mask your IP and
                rough location. (See our <a href="/#hide-ip">guide on hiding your IP</a> for the
                honest version of what that does and doesn&apos;t protect.)
              </p>

              <h2>Check yours</h2>
              <p>
                You can see your own public IP, ISP, and estimated location instantly using the{" "}
                <a href="/">tool at the top of GetNetStats</a> — nothing is stored, and no sign-up is
                needed.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
