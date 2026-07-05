"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getConnection, connectionLabel, type ConnectionInfo } from "@/lib/gns";

type Phase = "idle" | "detecting" | "done";

interface Grade {
  label: string;
  cls: string;
  note: string;
}
function connGrade(conn: ConnectionInfo | null): Grade {
  if (!conn || !conn.supported)
    return {
      label: "Not exposed",
      cls: "q-fair",
      note:
        "Your browser doesn’t share connection details — Safari and Firefox restrict this API for privacy. For real numbers, run the live Download, Upload or Ping tests.",
    };
  const et = conn.effectiveType;
  if (et === "4g")
    return { label: "Broadband-class", cls: "q-good", note: "A modern, fast connection profile — good for streaming, calls and large transfers." };
  if (et === "3g")
    return { label: "Moderate", cls: "q-fair", note: "A mid-tier mobile-class profile — fine for browsing and SD video, slower for big files." };
  if (et === "2g" || et === "slow-2g")
    return { label: "Limited", cls: "q-bad", note: "A constrained profile — best for text and light browsing; media will be slow." };
  return { label: "Detected", cls: "q-good", note: "Your browser reported its connection details below." };
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ConnectionTool() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [conn, setConn] = useState<ConnectionInfo | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Online state — default true so SSR and first client render agree.
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const run = useCallback(() => {
    setPhase("detecting");
    setConn(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    // brief beat so the re-detect reads as an action, then read the live values
    timerRef.current = setTimeout(() => {
      setConn(getConnection());
      setPhase("done");
    }, 420);
  }, []);

  useEffect(() => {
    run(); /* auto-detect once on load */
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [run]);

  const grade = connGrade(conn);
  const supported = !!conn?.supported;

  const typeLabel = conn && supported ? connectionLabel(conn) : phase === "done" ? "Unknown" : "—";
  const classLabel =
    conn && conn.effectiveType ? conn.effectiveType.toUpperCase() + "-class" : "—";
  const downlink = conn && conn.downlink != null ? conn.downlink.toString() : "—";
  const rtt = conn && conn.rtt != null ? Math.round(conn.rtt).toString() : "—";
  const saver =
    conn && supported ? (conn.saveData ? "On" : "Off") : "—";

  // status pill
  let connState = "good";
  let connText = "Ready";
  if (phase === "detecting") {
    connState = "wait";
    connText = "Detecting…";
  } else if (!online) {
    connState = "bad";
    connText = "Offline";
  } else if (phase === "done" && !supported) {
    connState = "wait";
    connText = "Not exposed";
  } else if (phase === "done") {
    connText = "Detected · " + typeLabel;
  }

  return (
    <section className="hero">
      <div className="wrap">
        <div className="stage solo">
          <div className="stage-controls">
            <span className={"conn-pill " + connState}>
              <span className="led" />
              {connText}
            </span>
            <button className="rerun-pill" onClick={run} disabled={phase === "detecting"}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-3.5-7.1" />
                <path d="M21 3v5h-5" />
              </svg>
              {phase === "detecting" ? "Detecting…" : "Re-detect"}
            </button>
          </div>

          <div className="tool-head">
            <div className="lede">
              <a className="eyebrow-home" href="/">Home</a> // connection probe
            </div>
            <h1 className="headline">
              Connection <em>type</em> test
            </h1>
            <p className="subhead">
              What your browser can tell you about this connection — its type, speed class and
              estimated latency, read straight from the device. Honest about its limits, with
              nothing stored.
            </p>
          </div>

          <div className="ping-hero">
            <span className={"big mono conn-big " + grade.cls}>{typeLabel}</span>
            <span className="unit">connection type</span>
          </div>
          <div className={"tool-grade " + grade.cls}>{grade.label}</div>
          <p className="tool-grade-note">{grade.note}</p>

          {/* Live readouts of the visitor's own connection — value cells are
              masked from Clarity session replays (data-clarity-mask). The static
              labels stay visible so replays keep their context. */}
          <div className="readouts" style={{ marginTop: 26 }}>
            <div className="ro">
              <div className="k">Speed class</div>
              <div className="v txt" data-clarity-mask="true">{classLabel}</div>
              <div className="sub">browser profile</div>
            </div>
            <div className="ro">
              <div className="k">Est. downlink</div>
              <div className="v mono" data-clarity-mask="true">
                {downlink}
                <small> Mbps</small>
              </div>
              <div className="sub">browser estimate</div>
            </div>
            <div className="ro">
              <div className="k">Round-trip</div>
              <div className="v mono" data-clarity-mask="true">
                {rtt}
                <small> ms</small>
              </div>
              <div className="sub">estimated latency</div>
            </div>
            <div className="ro">
              <div className="k">Data saver</div>
              <div className="v txt" data-clarity-mask="true">{saver}</div>
              <div className="sub">reduced-data mode</div>
            </div>
          </div>

          {phase === "done" && supported ? (
            <p className="tool-grade-note" style={{ marginTop: 18 }}>
              These are the browser’s own estimates, not a live measurement. For real,
              measured numbers, run the{" "}
              <a className="eyebrow-home" href="/download-test/">download</a>,{" "}
              <a className="eyebrow-home" href="/upload-test/">upload</a> or{" "}
              <a className="eyebrow-home" href="/ping-test/">ping</a> tests.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
