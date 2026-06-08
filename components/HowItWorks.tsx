const STEPS = [
  {
    n: "01",
    t: "Detect your IP",
    d: "We read the public IP address, ISP and approximate location your network presents — instantly, with nothing stored.",
  },
  {
    n: "02",
    t: "Measure latency",
    d: "Warm round-trips to a global content-delivery network clock your real ping and jitter — the numbers that matter for calls and gaming.",
  },
  {
    n: "03",
    t: "Test real speed",
    d: "Live byte streams up and down the wire measure your true download and upload throughput, then score overall connection quality.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-h">
      <div className="wrap">
        <div className="eyebrow">// how it works</div>
        <h2 className="sec" id="how-h">
          Three steps, about ten seconds
        </h2>
        <p className="sec-intro">
          GetNetStats runs entirely in your browser — no app, no sign-up, nothing stored. Hit
          run and the scanner walks through three live measurements.
        </p>
        <div className="how-grid">
          {STEPS.map((s) => (
            <div className="how-step" key={s.n}>
              <div className="how-n mono">{s.n}</div>
              <div className="how-t">{s.t}</div>
              <div className="how-d">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
