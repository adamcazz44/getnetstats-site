"use client";

import { useEffect, useState } from "react";
import AdSlot from "./AdSlot";
import { AFFILIATES, type Affiliate } from "./affiliates";

interface AffiliateAdProps {
  width?: number;
  height?: number;
  className?: string;
  /** Rotation interval in ms (default 12s). */
  intervalMs?: number;
  /** Override the creative list (defaults to AFFILIATES). */
  creatives?: Affiliate[];
}

/**
 * Affiliate creative slot (default 300×250). Rotates through `creatives` on a
 * timer: random first pick (fair first-impression split), pauses when the tab
 * is hidden, and — for prefers-reduced-motion users — shows a single static
 * pick with no auto-swap. Each creative is the official banner image when `img`
 * is set, otherwise an on-brand CTA card. Renders the placeholder when the list
 * is empty.
 */
export default function AffiliateAd({
  width = 300,
  height = 250,
  className = "mrec",
  intervalMs = 12000,
  creatives = AFFILIATES,
}: AffiliateAdProps) {
  const [idx, setIdx] = useState(0);
  const [reduced, setReduced] = useState(false);

  // Random starting creative + read reduced-motion, after mount (avoids any
  // SSR/client mismatch; the slot only mounts client-side via AdSlot anyway).
  useEffect(() => {
    if (creatives.length > 1) setIdx(Math.floor(Math.random() * creatives.length));
    setReduced(!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  }, [creatives.length]);

  // Auto-rotate, paused when the tab is hidden. Skipped under reduced motion.
  useEffect(() => {
    if (reduced || creatives.length < 2) return;
    let timer = 0;
    const tick = () => setIdx((i) => (i + 1) % creatives.length);
    const start = () => {
      timer = window.setInterval(tick, intervalMs);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, creatives.length, intervalMs]);

  if (creatives.length === 0) {
    return <AdSlot width={width} height={height} className={className} />;
  }
  const c = creatives[idx] ?? creatives[0];

  return (
    <AdSlot width={width} height={height} className={className}>
      <a
        className="aff"
        href={c.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={c.alt}
      >
        {c.img ? (
          // External banner creative — plain img keeps it provider-agnostic.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.img} width={width} height={height} alt={c.alt} loading="lazy" />
        ) : (
          <span className="aff-card">
            <span className="aff-spon">Sponsored</span>
            <span className="aff-body">
              <span className="aff-name">{c.name}</span>
              <span className="aff-tag">{c.tagline}</span>
            </span>
            <span className="aff-cta">
              {c.cta} <span aria-hidden="true">→</span>
            </span>
          </span>
        )}
      </a>
    </AdSlot>
  );
}
