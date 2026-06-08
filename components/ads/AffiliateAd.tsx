"use client";

import AdSlot from "./AdSlot";

interface AffiliateAdProps {
  href?: string;
  img?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Affiliate creative slot (default 300×250 rectangle) — wired for the VPN
 * affiliate unit. Renders the dashed placeholder until a destination URL and
 * creative image are configured, so it's safe to ship before real links exist.
 *
 * Env: NEXT_PUBLIC_AFFILIATE_URL, NEXT_PUBLIC_AFFILIATE_IMG, NEXT_PUBLIC_AFFILIATE_ALT.
 */
export default function AffiliateAd({
  href,
  img,
  alt,
  width = 300,
  height = 250,
  className = "mrec",
}: AffiliateAdProps) {
  const url = href ?? process.env.NEXT_PUBLIC_AFFILIATE_URL;
  const image = img ?? process.env.NEXT_PUBLIC_AFFILIATE_IMG;
  const label = alt ?? process.env.NEXT_PUBLIC_AFFILIATE_ALT ?? "Sponsored";
  const enabled = Boolean(url && image);

  return (
    <AdSlot width={width} height={height} className={className}>
      {enabled ? (
        <a href={url} target="_blank" rel="sponsored noopener noreferrer" aria-label={label}>
          {/* External ad creative — plain img keeps it provider-agnostic and
              avoids next/image remote-domain config. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} width={width} height={height} alt={label} loading="lazy" />
        </a>
      ) : null}
    </AdSlot>
  );
}
