import type { Metadata, Viewport } from "next";
import { Geist, Spline_Sans_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Google AdSense publisher id, e.g. "ca-pub-1234567890123456". When unset,
// no AdSense script/verification renders and ad slots stay placeholders.
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spline-mono",
  display: "swap",
});

const SITE_URL = "https://getnetstats.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:
    "What Is My IP Address? Free IP Lookup & Internet Speed Test — GetNetStats",
  description:
    "See your public IP address, ISP and location instantly — then run a free internet speed test for real download, upload, ping and connection quality. No app, no sign-up. Check your network in one tap.",
  keywords: [
    "what is my IP",
    "IP address lookup",
    "internet speed test",
    "download speed",
    "upload speed",
    "ping test",
    "IPv4",
    "IPv6",
    "ISP lookup",
    "connection test",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "GetNetStats",
    title: "What Is My IP Address? Free IP Lookup & Speed Test",
    description:
      "Instantly see your IP, ISP and location, then test real download, upload and ping. Free, fast, no sign-up.",
    url: `${SITE_URL}/`,
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
    title: "GetNetStats — What Is My IP & How Fast Is My Internet?",
    description:
      "Free IP lookup and internet speed test. Real download, upload, ping and connection quality in one tap.",
  },
  // AdSense site-verification meta (rendered only when the publisher id is set).
  ...(ADSENSE_CLIENT ? { other: { "google-adsense-account": ADSENSE_CLIENT } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#070b12",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "GetNetStats",
      url: `${SITE_URL}/`,
      description:
        "Fast, private, no-signup network tools — IP lookup, speed test, ping, WHOIS and DNS — plus guides to understand the results.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "GetNetStats",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "WebApplication",
      name: "GetNetStats IP & Speed Test",
      url: `${SITE_URL}/`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires a modern web browser",
      description:
        "Check your public IP address, ISP and location, and run a real internet speed test measuring download, upload, ping and connection quality — free and in your browser.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "IP Address & Speed Test",
          item: `${SITE_URL}/`,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does GetNetStats find my IP address?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Your browser makes a normal request to our lookup endpoint, and the public IP your network presents is read back to you. It happens in your browser — no account is required and your address is not stored.",
          },
        },
        {
          "@type": "Question",
          name: "Can a website really see my WiFi signal strength?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Browsers deliberately do not expose WiFi radio signal to web pages. GetNetStats shows a Connection quality estimate built from your real measured latency, throughput and the browser Network Information API, not a reading of your router signal.",
          },
        },
        {
          "@type": "Question",
          name: "Is the speed test accurate?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It streams real data to and from a global content-delivery network and measures actual throughput, so it reflects what your browser can really do. Results vary with WiFi interference, other devices, time of day and server load — run it a few times for a representative figure.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between IPv4 and IPv6?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "IPv4 is the original 32-bit addressing scheme with about 4.3 billion addresses, now exhausted. IPv6 is the 128-bit successor with a practically unlimited pool. Most connections run both, and GetNetStats shows whichever your network presents, plus your IPv6 address when available.",
          },
        },
        {
          "@type": "Question",
          name: "Does GetNetStats store or sell my data?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The tools run client-side in your browser, there is no sign-up, and personal data is not sold. Ads on the page keep the free tools free.",
          },
        },
        {
          "@type": "Question",
          name: "Why is my IP different here than on another tool?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Common reasons include using a VPN or proxy, seeing an IPv6 address on one tool and IPv4 on another, or an ISP using carrier-grade NAT that shares one public IP across many customers. All are normal.",
          },
        },
        {
          "@type": "Question",
          name: "How do I hide my IP address?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Route your traffic through a VPN (the most practical choice), a proxy server, or the Tor network. Each replaces your visible IP with the intermediary address. Reload the page afterward to confirm the change.",
          },
        },
        {
          "@type": "Question",
          name: "Is GetNetStats free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Every tool is free with no account and no limits. The site is supported by the ads shown alongside the results.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${splineMono.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {/* AdSense library — loaded once sitewide so Google can verify/serve.
            async + afterInteractive means it never blocks first paint or the scan.
            Renders only when the publisher id is configured. */}
        {ADSENSE_CLIENT ? (
          <Script
            id="adsbygoogle-lib"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        ) : null}
      </body>
    </html>
  );
}
