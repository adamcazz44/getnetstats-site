"use client";

import { useEffect } from "react";
import AdSlot from "./AdSlot";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface GoogleAdProps {
  /** AdSense ad-unit slot id. Falls back to NEXT_PUBLIC_ADSENSE_HALFPAGE_SLOT. */
  slot?: string;
  width?: number;
  height?: number;
  className?: string;
}

/** Registers one ad unit on mount. The adsbygoogle library is loaded once
 *  sitewide from the layout (gated on NEXT_PUBLIC_ADSENSE_CLIENT), so this
 *  only renders the <ins> slot and pushes it. */
function GoogleInsTag({
  client,
  slot,
  width,
  height,
}: {
  client: string;
  slot: string;
  width: number;
  height: number;
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense library not ready / blocked — ignore */
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", width, height }}
      data-ad-client={client}
      data-ad-slot={slot}
    />
  );
}

/**
 * Google display slot (default 300×600 half-page). Renders the dashed
 * placeholder until both the publisher client and a slot id are configured,
 * so it's safe to ship before AdSense is set up.
 *
 * Env: NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-…), NEXT_PUBLIC_ADSENSE_HALFPAGE_SLOT.
 */
export default function GoogleAd({
  slot,
  width = 300,
  height = 600,
  className = "halfpage",
}: GoogleAdProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slotId = slot ?? process.env.NEXT_PUBLIC_ADSENSE_HALFPAGE_SLOT;
  const enabled = Boolean(client && slotId);

  // PARKED UNTIL ADSENSE APPROVES. With no slot id configured we render nothing
  // (rather than the dashed "Advertisement 300×600" placeholder), so no empty ad
  // box shows while ads aren't serving. Re-enabling is a one-line change: set
  // NEXT_PUBLIC_ADSENSE_HALFPAGE_SLOT in .env.production and rebuild — `enabled`
  // flips true and the real <ins> unit renders here in place.
  // NOTE: this parks the visual slot ONLY. AdSense account verification — the
  // adsbygoogle loader (app/layout.tsx), the google-adsense-account meta, and
  // public/ads.txt — is separate and deliberately left untouched.
  if (!enabled) return null;

  return (
    <AdSlot width={width} height={height} className={className}>
      <GoogleInsTag client={client!} slot={slotId!} width={width} height={height} />
    </AdSlot>
  );
}
