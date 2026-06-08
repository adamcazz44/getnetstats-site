"use client";

import { useEffect } from "react";
import Script from "next/script";
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

/** Loads the AdSense library lazily and registers one ad unit on mount. */
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
      /* AdSense not ready / blocked — ignore */
    }
  }, []);

  return (
    <>
      {/* lazyOnload: never blocks first paint or the measurement scan. */}
      <Script
        id="adsbygoogle-lib"
        strategy="lazyOnload"
        crossOrigin="anonymous"
        src={
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
          client
        }
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block", width, height }}
        data-ad-client={client}
        data-ad-slot={slot}
      />
    </>
  );
}

/**
 * Google display slot (default 300×600 half-page). Renders the dashed
 * placeholder until both the publisher client and a slot id are configured,
 * so it's safe to ship before real tags exist.
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
