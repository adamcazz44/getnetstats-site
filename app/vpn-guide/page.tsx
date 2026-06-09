import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LiteYouTube from "@/components/LiteYouTube";
import { GUIDE_VIDEOS } from "@/lib/videos";
import { NORDVPN_HREF } from "@/components/ads/affiliates";

const SITE = "https://getnetstats.com";

export const metadata: Metadata = {
  title: "VPN & Online Privacy Guide — Videos + How-Tos | GetNetStats",
  description:
    "Short, clear videos on VPNs, IP addresses, and staying private online — what a VPN is, how to set one up, securing your data, and unblocking the internet in restrictive regions.",
  keywords: [
    "vpn guide",
    "what is a vpn",
    "how to set up a vpn",
    "online privacy",
    "secure your data",
    "hide your IP",
    "vpn for restrictive regions",
  ],
  alternates: { canonical: "/vpn-guide/" },
  openGraph: {
    type: "website",
    siteName: "GetNetStats",
    title: "VPN & Online Privacy Guide — GetNetStats",
    description:
      "Short, clear videos on VPNs, IP addresses, and staying private online.",
    url: `${SITE}/vpn-guide/`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GetNetStats" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "VPN & Online Privacy Guide — GetNetStats",
    description: "Short, clear videos on VPNs, IPs, and staying private online.",
  },
};

export default function VpnGuidePage() {
  const live = GUIDE_VIDEOS.filter((v) => v.youtubeId);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "VPN & Online Privacy Guide", item: `${SITE}/vpn-guide/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <SiteHeader />
      <main id="top">
        <section aria-labelledby="guide-h">
          <div className="wrap">
            <div className="eyebrow">// learn</div>
            <h2 className="sec" id="guide-h">
              VPN &amp; online privacy guide
            </h2>
            <p className="sec-intro">
              Short, clear videos on how your connection works and how to keep it private — what a
              VPN is, how to set one up, securing your data, and reaching the open internet from
              anywhere. Free, no sign-up.
            </p>

            <div className="guide">
              {live.map((v) => {
                const videoLd = {
                  "@context": "https://schema.org",
                  "@type": "VideoObject",
                  name: v.topic,
                  description: v.blurb,
                  thumbnailUrl: [`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`],
                  ...(v.uploaded ? { uploadDate: v.uploaded } : {}),
                  embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
                  contentUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
                  publisher: { "@type": "Organization", name: "GetNetStats", "@id": `${SITE}/#org` },
                };
                return (
                  <article className="guide-item" key={v.slug} id={v.slug}>
                    <script
                      type="application/ld+json"
                      dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }}
                    />
                    <h3 className="guide-topic">{v.topic}</h3>
                    <p className="guide-blurb">{v.blurb}</p>
                    <LiteYouTube id={v.youtubeId!} title={v.topic} />
                    <a
                      className="guide-cta"
                      href={NORDVPN_HREF}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                    >
                      <span className="guide-cta-ad">Ad</span>
                      {v.cta} <span aria-hidden="true">→</span>
                    </a>
                  </article>
                );
              })}
            </div>

            {live.length < GUIDE_VIDEOS.length ? (
              <p className="guide-more mono">More videos coming soon.</p>
            ) : null}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
