import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import IconRow from "@/components/guides/IconRow";
import { IconDesktop, IconLaptop, IconPhone } from "@/components/guides/icons";

const SITE = "https://getnetstats.com";
const PUBLISHED = "2026-06-22";

export const metadata: Metadata = {
  title: "How to Find Your IP Address on Any Device | GetNetStats",
  description:
    "Find your IP address on any device — Windows, macOS, iPhone, iPad, Android, or your router. The fast way to your public IP, plus where each device shows its private IP.",
  keywords: [
    "how to find your ip address",
    "find ip address windows",
    "find ip address mac",
    "find ip address iphone",
    "find ip address android",
    "router ip address",
    "public vs private ip",
  ],
  alternates: { canonical: "/find-your-ip-address/" },
  openGraph: {
    type: "article",
    siteName: "GetNetStats",
    title: "How to Find Your IP Address on Any Device",
    description:
      "Where to look on Windows, macOS, iPhone, iPad, Android, and your router — public or private IP.",
    url: `${SITE}/find-your-ip-address/`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GetNetStats" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "How to Find Your IP Address on Any Device — GetNetStats",
    description: "Public or private, on any phone or computer — here's where to look.",
  },
};

export default function FindYourIpPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "How to Find Your IP Address", item: `${SITE}/find-your-ip-address/` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Find Your IP Address on Any Device",
    description:
      "Where to find your IP address on Windows, macOS, iPhone, iPad, Android, and your router — public or private — plus the fastest way to your public IP.",
    image: [`${SITE}/og.png`],
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/find-your-ip-address/` },
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
        <section className="page" aria-labelledby="find-h">
          <div className="wrap">
            <div className="eyebrow">
              <a className="eyebrow-home" href="/">Home</a> // learn
            </div>
            <h1 id="find-h">How to find your IP address on any device</h1>
            <p className="page-sub">
              Public or private, on any phone or computer — here&apos;s where to look.
            </p>
            <p className="updated">Last reviewed: June 22, 2026</p>

            <div className="prose">
              <h2>First: which IP do you want?</h2>
              <p>
                There are two different addresses, and the steps differ. Your{" "}
                <strong>public IP</strong> is what the internet sees (assigned by your ISP, shared by
                your whole network) — the fastest way to find it is to look at the top of{" "}
                <a href="/">this page</a>; GetNetStats shows it instantly. Your{" "}
                <strong>private IP</strong> is what your router assigns to a specific device inside
                your home network (usually starting with <span className="mono">192.168.</span> or{" "}
                <span className="mono">10.</span>) — you find that in your device&apos;s settings,
                below. Most steps below find your private IP.
              </p>

              <figure className="guide-diagram">
                <IconRow
                  items={[
                    { icon: <IconDesktop />, label: "Windows", sublabel: "Command Prompt" },
                    { icon: <IconLaptop />, label: "macOS", sublabel: "Network settings" },
                    { icon: <IconPhone />, label: "iPhone / iPad", sublabel: "Wi-Fi settings" },
                    { icon: <IconPhone />, label: "Android", sublabel: "Wi-Fi settings" },
                  ]}
                />
              </figure>

              <h2>On Windows</h2>
              <ol>
                <li>Open the Start menu, type Command Prompt, and open it.</li>
                <li>
                  Type <span className="mono">ipconfig</span> and press Enter.
                </li>
                <li>
                  Look for <strong>IPv4 Address</strong> (and IPv6, if shown) under your active
                  connection.
                </li>
              </ol>
              <p>
                Or, without the command line: Settings → Network &amp; Internet → Wi-Fi (or Ethernet)
                → your network → Properties, and find the IP address.
              </p>

              <h2>On macOS</h2>
              <ol>
                <li>Open System Settings → Network.</li>
                <li>Select your active connection (Wi-Fi or Ethernet).</li>
                <li>Your IP is in the connection details (click Details if needed).</li>
              </ol>

              <h2>On iPhone / iPad</h2>
              <ol>
                <li>Open Settings → Wi-Fi.</li>
                <li>Tap the ⓘ next to your connected network.</li>
                <li>
                  Scroll to <strong>IP Address</strong> under the IPv4 (and IPv6) section.
                </li>
              </ol>

              <h2>On Android</h2>
              <p>(Menus vary slightly by manufacturer.)</p>
              <ol>
                <li>Open Settings → Network &amp; Internet → Wi-Fi (or Connections → Wi-Fi).</li>
                <li>Tap your connected network&apos;s name or its settings gear.</li>
                <li>
                  Find <strong>IP address</strong> in the network details. (Also under Settings →
                  About phone → Status on many devices.)
                </li>
              </ol>

              <h2>On your router</h2>
              <p>
                Your router&apos;s admin page lists every device&apos;s private IP and your
                network&apos;s public IP. Type your gateway address (often{" "}
                <span className="mono">192.168.0.1</span> or{" "}
                <span className="mono">192.168.1.1</span>) into a browser and sign in. The default
                address and login are usually on a label on the router.
              </p>

              <h2>The fastest method of all</h2>
              <p>
                If all you want is your public IP, ISP, and rough location, skip the steps above —
                just open <a href="/">GetNetStats</a>. It shows them in seconds, runs entirely in
                your browser, stores nothing, and needs no sign-up.
              </p>

              <h2>A note on accuracy</h2>
              <p>
                Whatever method you use, the location tied to your public IP is an estimate, not a
                precise position — usually city-level and sometimes off by a fair margin. That&apos;s
                normal for all IP-based location. (More in our{" "}
                <a href="/what-is-an-ip-address/">guide on what your IP reveals</a>.)
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
