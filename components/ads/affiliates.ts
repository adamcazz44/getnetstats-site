/** Affiliate creatives shown (and rotated) in the 300×250 slot.
 *  Add/remove entries to change what rotates. When `img` is set, the banner
 *  image is shown; otherwise an on-brand CTA card is rendered from name/tagline/
 *  cta. `href` is the affiliate tracking link. These are public links, so it's
 *  fine to keep them in source. */
export interface Affiliate {
  name: string;
  href: string;
  alt: string;
  /** Optional 300×250 banner image URL. When omitted, a CTA card renders. */
  img?: string;
  /** CTA-card copy (used only when img is absent). */
  tagline: string;
  cta: string;
}

// Shared so in-content CTAs (e.g. the "how to hide your IP" VPN link) and the
// rotating banner use the same tracking link.
export const NORDVPN_HREF =
  "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=150104&url_id=902";

export const AFFILIATES: Affiliate[] = [
  {
    name: "NordVPN",
    href: NORDVPN_HREF,
    alt: "NordVPN — fast, secure, no-logs VPN",
    tagline: "Hide your IP and encrypt your connection with a fast, no-logs VPN.",
    cta: "Get NordVPN",
  },
  {
    name: "NordPass",
    href: "https://go.nordpass.io/aff_c?offer_id=488&aff_id=150104&url_id=9356",
    alt: "NordPass — secure password manager",
    tagline: "Store and autofill strong passwords, from the makers of NordVPN.",
    cta: "Try NordPass",
  },
];
