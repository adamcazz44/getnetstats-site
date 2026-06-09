"use client";

import type { ReactNode } from "react";
import { useInView } from "./useInView";

interface AdSlotProps {
  width: number;
  height: number;
  /** Extra class on the .ad container (e.g. "halfpage" | "mrec"). */
  className?: string;
  /** The real ad markup. Mounted only once the slot scrolls into view.
   *  When null/undefined, the dashed placeholder is shown instead. */
  children?: ReactNode;
}

/**
 * Generic ad slot: reserves its box to avoid layout shift, lazy-mounts the
 * provider markup on scroll, and falls back to the design's dashed
 * "Advertisement {w}×{h}" placeholder when no creative is configured.
 *
 * Swap the creative by passing different children — see GoogleAd / AffiliateAd.
 */
export default function AdSlot({ width, height, className, children }: AdSlotProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const ready = inView && children != null;

  return (
    <div
      ref={ref}
      className={"ad" + (className ? " " + className : "") + (ready ? " filled" : "")}
      style={{ minWidth: width, minHeight: height }}
      role="complementary"
      aria-label="Advertisement"
    >
      {ready ? (
        children
      ) : (
        <>
          <span className="lab">Advertisement</span>
          <span className="big">
            {width} × {height}
          </span>
        </>
      )}
    </div>
  );
}
