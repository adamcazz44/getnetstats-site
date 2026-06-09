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

  return (
    <AdSlot width={width} height={height} className={className}>
      {enabled ? (
        <GoogleInsTag client={client!} slot={slotId!} width={width} height={height} />
      ) : null}
    </AdSlot>
  );
}
