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
    "An honest guide to VPNs and online privacy: what a VPN actually does, what it can't do (it isn't anonymity and won't speed up your connection), whether you need one, and how to check it's working. Free, no sign-up.",
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
      "What a VPN actually does, what it can't do, whether you need one, and how to check it's working — honest and free.",
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

            <div className="prose">
              <p>
                A VPN is one of the most over-marketed tools on the internet — sold as a magic cloak
                that makes you invisible and your connection faster. The reality is more useful and
                more honest: a VPN is a specific privacy and security tool that does a few things
                genuinely well, and a few things not at all. Here&apos;s the straight version — what
                it does, what it doesn&apos;t, whether you need one, and how to confirm it&apos;s
                actually working.
              </p>

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
                A VPN — virtual private network — creates an encrypted tunnel between your device and
                a server run by the VPN provider. All your internet traffic travels through that
                tunnel, which has two effects. The websites and apps you connect to see the{" "}
                <strong>VPN server&apos;s</strong> IP address and location instead of your own. And
                anyone watching your local network — your internet provider, the operator of a public
                Wi-Fi hotspot — sees only encrypted data heading to the VPN, not which sites
                you&apos;re visiting or what you&apos;re sending.
              </p>

              <h2>What it does well</h2>
              <ul>
                <li>
                  <b>Hides your real IP and rough location</b> from the sites and services you
                  connect to — they see the VPN&apos;s exit server instead.
                </li>
                <li>
                  <b>Encrypts your traffic on untrusted networks</b> — airport, hotel, and café
                  Wi-Fi — so it can&apos;t be read or tampered with by others on that network.
                </li>
                <li>
                  <b>Keeps your browsing private from your ISP.</b> Your provider sees encrypted
                  traffic to the VPN, not the individual sites you visit.
                </li>
                <li>
                  <b>Restores the open internet in restrictive regions</b> by routing your connection
                  through a server in another country.
                </li>
                <li>
                  <b>Lets you appear to be elsewhere</b> for region-locked content — where the
                  service&apos;s own terms permit it.
                </li>
              </ul>

              <h2>What it doesn&apos;t do</h2>
              <p>
                This is where the marketing oversells. Be clear-eyed about the limits — a VPN is a
                tool, not a force field:
              </p>
              <ul>
                <li>
                  <b>It won&apos;t make you anonymous.</b> You&apos;re moving your trust from your ISP
                  to the VPN provider, so choose one with a real, independently audited no-logs
                  policy. And logins, cookies, and browser fingerprinting still identify you across
                  sites no matter what IP you use.
                </li>
                <li>
                  <b>It won&apos;t make your connection faster.</b> Encrypting and rerouting traffic
                  adds overhead, so a VPN is typically a little <em>slower</em>, never faster. (If
                  your ISP throttles a specific service it can sometimes sidestep that — but it
                  isn&apos;t adding bandwidth.)
                </li>
                <li>
                  <b>It&apos;s not antivirus.</b> It doesn&apos;t stop malware, phishing, or you
                  typing your password into a fake login page.
                </li>
                <li>
                  <b>It doesn&apos;t encrypt everything end-to-end.</b> It protects the link to the
                  VPN server; from there to the destination, ordinary web security (HTTPS) takes
                  over.
                </li>
              </ul>

              <h2>Do you need one?</h2>
              <p>
                There&apos;s no universal &quot;everyone must use a VPN.&quot; It depends on what you
                do:
              </p>
              <ul>
                <li>
                  <b>Often on public Wi-Fi?</b> Yes — the encryption is genuinely worth it.
                </li>
                <li>
                  <b>Want to keep browsing private from your ISP, or mask your IP from sites?</b> A
                  VPN helps directly.
                </li>
                <li>
                  <b>In a region that blocks parts of the internet?</b> A VPN is often the practical
                  fix.
                </li>
                <li>
                  <b>Mostly at home on your own trusted network, visiting HTTPS sites?</b> The
                  security gain is smaller — your traffic is already encrypted site-by-site — though
                  the IP-masking and ISP-privacy benefits still apply.
                </li>
              </ul>

              <h2>How to check it&apos;s working</h2>
              <p>
                Once you&apos;re connected, confirm the VPN is actually doing its job rather than
                assuming it:
              </p>
              <ul>
                <li>
                  <b>Note your real IP first.</b> With the VPN off, check your public IP, ISP, and
                  location on the <a href="/">GetNetStats homepage</a>.
                </li>
                <li>
                  <b>Connect, then re-check.</b> Turn the VPN on, reload, and look again — your IP,
                  ISP, and country should now be the VPN server&apos;s, not your own.
                </li>
                <li>
                  <b>Test for leaks.</b> Your provider usually has a DNS/WebRTC leak-test page; your
                  real IP shouldn&apos;t appear anywhere on it.
                </li>
                <li>
                  <b>Run a speed test before and after.</b> Expect a modest drop — a server closer to
                  you generally means a smaller one.
                </li>
              </ul>

              <h2>Our recommendation</h2>
              <p>
                If you&apos;ve decided a VPN fits your situation, we use and recommend{" "}
                <strong>NordVPN</strong> — fast, with an independently audited no-logs policy and
                apps on every platform. It&apos;s the one we&apos;d point a friend to.
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
