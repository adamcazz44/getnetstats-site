"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number | null;
  fmt?: (n: number) => string;
  dur?: number;
}

/** Tweens to its final value with a cubic ease-out. Tabular figures keep widths stable. */
export default function AnimatedNumber({ value, fmt, dur = 700 }: AnimatedNumberProps) {
  const [disp, setDisp] = useState<number | null>(value);
  const fromRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (value == null) {
      setDisp(null);
      return;
    }
    // Respect prefers-reduced-motion: jump straight to the resolved value,
    // no tween. (CSS animations are gated separately in globals.css.)
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      fromRef.current = value;
      setDisp(value);
      return;
    }
    const from = fromRef.current || 0;
    const to = value;
    const t0 = performance.now();
    cancelAnimationFrame(rafRef.current);
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      const cur = from + (to - from) * e;
      setDisp(cur);
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, dur]);

  if (disp == null) return <span>—</span>;
  return <span>{fmt ? fmt(disp) : Math.round(disp)}</span>;
}

export const fmtSpeed = (n: number): string =>
  n >= 100 ? Math.round(n).toString() : n.toFixed(1);
export const fmtInt = (n: number): string => Math.round(n).toString();
