"use client";

import type { QualityLabel } from "@/lib/gns";

interface RadarProps {
  scanning: boolean;
  done: boolean;
  quality: (QualityLabel & { score: number }) | null;
  phaseText: string;
  prog: number;
}

const BAR_COLORS: Record<string, string> = {
  "q-good": "#34d399",
  "q-fair": "#fbbf24",
  "q-bad": "#f87171",
};

/** The radar "scan-to-reveal": rings, sweep, progress ring, and a derived signal readout. */
export default function Radar({ scanning, done, quality, phaseText, prog }: RadarProps) {
  const R = 48;
  const C = 2 * Math.PI * R;
  const bars = quality ? quality.bars : 0;
  const qcls = quality ? quality.cls : "";
  const activeColor = BAR_COLORS[qcls] || "#34d399";

  return (
    <div className={"radar" + (scanning ? " scanning" : "") + (done ? " done" : "")}>
      <svg className="progress-ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - Math.max(0, Math.min(1, prog)))}
          style={{
            transition: "stroke-dashoffset .2s linear",
            filter: "drop-shadow(0 0 5px rgba(34,211,238,.6))",
          }}
        />
      </svg>
      <div className="ring" />
      <div className="ring r2" />
      <div className="ring r3" />
      <div className="ring r4" />
      <div className="cross" />
      <div className="crossv" />
      <div className="sweep" />
      <div className="center">
        {/* Keyed on the quality class to force fresh DOM nodes on category change —
            works around a GPU repaint bug where the continuously-animating sweep
            (compositor layer) left reused sibling bars showing stale colors. */}
        <div className={"sig " + qcls} key={qcls || "idle"} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => {
            const on = quality != null && i < bars;
            return (
              <i
                key={i}
                className={on ? "" : "off"}
                style={{
                  height: 16 + i * 8 + "px",
                  backgroundColor: on ? activeColor : "#6f8096",
                  opacity: on ? 1 : 0.22,
                }}
              />
            );
          })}
        </div>
        <div className={"big-sig mono " + qcls}>{quality ? quality.label : "— — —"}</div>
        <div className="lbl">Wi-Fi Signal</div>
        <div className="phase">{phaseText}</div>
      </div>
    </div>
  );
}
