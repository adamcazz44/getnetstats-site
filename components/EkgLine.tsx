/**
 * A tiny live EKG/heart-monitor trace for the connection pill. Two identical
 * heartbeats tile the 80-unit viewBox; the strip scrolls left by exactly one
 * beat (-50%) on a loop, so the QRS "blip" sweeps across seamlessly like a real
 * monitor. Green to match the connected LED (and authentic to a monitor screen).
 */
export default function EkgLine() {
  return (
    <span className="ekg" aria-hidden="true">
      <svg viewBox="0 0 80 20" preserveAspectRatio="none">
        <path
          d="M0 10 L8 10 L10 8.5 L12 10 L15 10 L16 11 L17.5 3 L19 16 L20.5 9.5 L23 10 L27 7.5 L31 10 L40 10
             L48 10 L50 8.5 L52 10 L55 10 L56 11 L57.5 3 L59 16 L60.5 9.5 L63 10 L67 7.5 L71 10 L80 10"
        />
      </svg>
    </span>
  );
}
