/** Static waveform comparison for the ping-vs-jitter guide: a steady, evenly-spaced
 *  trace versus an irregular one, at the same average height — visualizes "same
 *  average delay, different consistency" without animation (no reduced-motion concerns). */
export default function JitterWaveform() {
  return (
    <div className="jitter-compare">
      <div className="jitter-row">
        <span className="jitter-label good">Low jitter — steady</span>
        <svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 20 L20 20 L25 8 L30 20 L50 20 L55 8 L60 20 L80 20 L85 8 L90 20 L110 20 L115 8 L120 20 L140 20 L145 8 L150 20 L170 20 L175 8 L180 20 L200 20" />
        </svg>
      </div>
      <div className="jitter-row">
        <span className="jitter-label bad">High jitter — erratic</span>
        <svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 20 L15 20 L20 4 L28 28 L35 20 L48 20 L60 2 L68 32 L75 20 L95 20 L100 10 L108 30 L118 20 L130 20 L138 6 L148 26 L155 20 L175 20 L182 14 L190 24 L200 20" />
        </svg>
      </div>
    </div>
  );
}
