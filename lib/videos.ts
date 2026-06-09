/** Videos for the /vpn-guide page. Add a `youtubeId` as each video goes live on
 *  the GetNetStats YouTube channel; sections without an id are simply not
 *  rendered yet, so the page grows as uploads land. `uploaded` is the YouTube
 *  publish date (YYYY-MM-DD) — used for VideoObject schema. */
export interface GuideVideo {
  slug: string;
  topic: string; // section heading
  blurb: string; // description + VideoObject description
  cta: string; // affiliate CTA label
  youtubeId?: string;
  uploaded?: string;
}

export const GUIDE_VIDEOS: GuideVideo[] = [
  {
    slug: "what-is-a-vpn",
    topic: "What is a VPN?",
    blurb:
      "A VPN encrypts your internet traffic and routes it through a secure server, hiding your real IP address and shielding your data — especially on public Wi-Fi.",
    cta: "Get NordVPN",
    youtubeId: "QdKTM3l3YF0",
    uploaded: "2026-06-09",
  },
  {
    slug: "what-is-an-ip",
    topic: "What is an IP address?",
    blurb:
      "Your public IP is the address your network shows to the internet. It reveals your ISP and approximate location — which is why many people choose to mask it.",
    cta: "Hide your IP with NordVPN",
  },
  {
    slug: "unsecured-connection",
    topic: "The risk of an unsecured connection",
    blurb:
      "On open or public networks, unencrypted traffic can be intercepted. Here's what's exposed and how to tell when you're at risk.",
    cta: "Secure your connection with NordVPN",
  },
  {
    slug: "secure-your-data",
    topic: "How to secure your online data",
    blurb:
      "Practical ways to protect your data online — encryption, a trustworthy VPN, and a few good habits that go a long way.",
    cta: "Get NordVPN",
  },
  {
    slug: "set-up-a-vpn",
    topic: "How to set up a VPN",
    blurb:
      "Getting started with a VPN takes just a couple of minutes. Follow along and you'll be protected by the end of the video.",
    cta: "Get NordVPN",
  },
  {
    slug: "restrictive-regions",
    topic: "Using the internet freely in restrictive regions",
    blurb:
      "In regions with censorship or heavy restrictions, a VPN can restore access to the open internet by routing your traffic through another country.",
    cta: "Get NordVPN",
  },
];
