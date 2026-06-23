import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LiteYouTube from "@/components/LiteYouTube";
import { GUIDE_VIDEOS } from "@/lib/videos";
import { NORDVPN_HREF } from "@/components/ads/affiliates";

const SITE = "https://getnetstats.com";

export const metadata: Metadata = {
  title: "VPN & Online Privacy Guide — What a VPN Does (and Doesn't) | GetNetStats",
  description:
    "An honest guide to VPNs and online privacy: what a VPN actually does, what it doesn't (it isn't anonymity and won't make you faster), whether you need one, and how to check it's working. Free, no sign-up.",
  keywords: [
    "vpn guide",
    "what is a vpn",
    "what a vpn does",
    "do i need a vpn",
    "online privacy",
    "hide your IP",
    "check vpn is working",
  ],
  alternates: { canonical: "/vpn-guide/" },
  openGraph: {
    type: "website",
    siteName: "GetNetStats",
    title: "VPN & Online Privacy Guide — GetNetStats",
    description:
      "What a VPN actually does, what it doesn't, whether you need one, and how to check it's working — honest and free.",
    url: `${SITE}/vpn-guide/`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GetNetStats" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "VPN & Online Privacy Guide — GetNetStats",
    description: "What a VPN does, what it doesn't, and whether you need one.",
  },
};

export default function VpnGuidePage() {
  const intro = GUIDE_VIDEOS.find((v) => v.slug === "what-is-a-vpn" && v.youtubeId);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "VPN & Online Privacy Guide", item: `${SITE}/vpn-guide/` },
    ],
  };

  const videoLd = intro
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: intro.topic,
        description: intro.blurb,
        thumbnailUrl: [`https://i.ytimg.com/vi/${intro.youtubeId}/hqdefault.jpg`],
        ...(intro.uploaded ? { uploadDate: intro.uploaded } : {}),
        embedUrl: `https://www.youtube-nocookie.com/embed/${intro.youtubeId}`,
        contentUrl: `https://www.youtube.com/watch?v=${intro.youtubeId}`,
        publisher: { "@type": "Organization", name: "GetNetStats", "@id": `${SITE}/#org` },
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {videoLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }}
        />
      ) : null}
      <SiteHeader />
      <main id="top">
        <section className="page" aria-labelledby="guide-h">
          <div className="wrap">
            <div className="eyebrow">
              <a className="eyebrow-home" href="/">Home</a> // learn
            </div>
            <h1 id="guide-h">VPN &amp; online privacy guide</h1>
            <p className="page-sub">
              What a VPN actually does, what it doesn&apos;t, and whether you need one.
            </p>

            <div className="prose">
              {intro ? (
                <figure className="guide-video">
                  <LiteYouTube id={intro.youtubeId!} title={intro.topic} />
                  <figcaption className="guide-figcap">
                    Watch: {intro.topic} — a 2-minute primer (loads only when you press play)
                  </figcaption>
                </figure>
              ) : null}

              <h2>What is a VPN?</h2>
              <p>
                A VPN (Virtual Private Network) routes your internet traffic through an encrypted
                tunnel to a server run by the VPN provider. Two things happen as a result: the
                websites you visit see the VPN server&apos;s IP address instead of your real one, and
                anyone watching your connection — your internet provider, a public Wi-Fi network, a
                network administrator — sees only encrypted traffic to the VPN, not what you&apos;re
                actually doing. In short, a VPN changes what your IP reveals and who can read your
                traffic.
              </p>

              <h2>What a VPN does well</h2>
              <ul>
                <li>
                  <b>Hides your real IP and rough location</b> from the sites you visit. Run the{" "}
                  <a href="/">IP check on this site</a> before and after connecting and you&apos;ll
                  see the address change.
                </li>
                <li>
                  <b>Encrypts your traffic on untrusted networks</b> — coffee-shop, airport, and
                  hotel Wi-Fi are the classic cases, where you don&apos;t control the network.
                </li>
                <li>
                  <b>Stops your ISP from logging which sites you visit</b>, since they only see
                  encrypted traffic to the VPN server.
                </li>
                <li>
                  <b>Lets you appear to be in another region</b>, which can matter for travel or
                  accessing services tied to location.
                </li>
              </ul>

              <h2>What a VPN does not do</h2>
              <p>
                This is where a lot of marketing oversells it, so here&apos;s the honest version:
              </p>
              <ul>
                <li>
                  <b>A VPN is not anonymity.</b> You&apos;re trusting the VPN provider instead of
                  your ISP — they can see your traffic, so the provider&apos;s logging policy matters
                  enormously. &quot;No-logs,&quot; independently audited providers are the ones worth
                  considering.
                </li>
                <li>
                  <b>It won&apos;t make you faster.</b> Routing through an extra server almost always
                  reduces speed slightly. (You can measure the difference with the{" "}
                  <a href="/">speed test on this site</a>.)
                </li>
                <li>
                  <b>It doesn&apos;t replace good security habits.</b> It won&apos;t stop malware,
                  phishing, or you handing over your password on a fake site.
                </li>
                <li>
                  <b>It doesn&apos;t fully stop tracking.</b> Sites can still identify you through
                  logins, cookies, and browser fingerprinting regardless of your IP.
                </li>
              </ul>

              <h2>Do you actually need one?</h2>
              <p>Honestly, it depends on what you&apos;re trying to solve:</p>
              <ul>
                <li>
                  <b>Often worth it:</b> you regularly use public Wi-Fi, you want your ISP to stop
                  seeing your browsing, or you travel and need a stable home region.
                </li>
                <li>
                  <b>Less necessary:</b> you&apos;re only ever on your own trusted home network and
                  your main goal is &quot;be faster&quot; — a VPN won&apos;t help there.
                </li>
              </ul>
              <p>
                A VPN is one privacy tool, not a magic cloak. The right move is matching the tool to
                the actual problem.
              </p>

              <h2>How to check it&apos;s working</h2>
              <ol>
                <li>
                  Note your current IP and location using the <a href="/">IP lookup on this page</a>.
                </li>
                <li>Connect to your VPN and pick a server.</li>
                <li>
                  Reload and check your IP again — it should now show the VPN server&apos;s address
                  and region, not your own. If it still shows your real IP, the VPN isn&apos;t routing
                  correctly (a &quot;DNS or IP leak&quot;).
                </li>
              </ol>

              <h2>The VPN we recommend</h2>
              <p>
                <strong>NordVPN</strong> — a fast, independently audited no-logs provider with apps on
                every platform. It&apos;s the one we&apos;d point a friend to.
              </p>
              <a
                className="guide-cta"
                href={NORDVPN_HREF}
                target="_blank"
                rel="sponsored noopener noreferrer"
              >
                <span className="guide-cta-ad">Ad</span>
                Get NordVPN <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
