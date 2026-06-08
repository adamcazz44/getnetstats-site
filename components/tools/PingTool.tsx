"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { measurePingLive } from "@/lib/gns";

type Phase = "idle" | "running" | "done";
const COUNT = 20;

interface Stats {
  median: number | null;
  jitter: number | null;
  min: number | null;
  max: number | null;
  lossPct: number;
}
const EMPTY: Stats = { median: null, jitter: null, min: null, max: null, lossPct: 0 };

interface Grade {
  label: string;
  cls: string;
  note: string;
}
function latencyGrade(median: number | null): Grade {
  if (median == null)
    return { label: "— — —", cls: "", note: "Measuring round-trip time to a global edge server…" };
  if (median < 20)
    return { label: "Excellent", cls: "q-good", note: "Great for competitive gaming, video calls and anything real-time." };
  if (median < 50)
    return { label: "Good", cls: "q-good", note: "Smooth for calls, gaming and streaming." };
  if (median < 100)
    return { label: "Fair", cls: "q-fair", note: "Fine for browsing and streaming; you may notice lag in fast-paced games or calls." };
  if (median < 150)
    return { label: "High", cls: "q-bad", note: "Calls and games may stutter; pages still load normally." };
  return { label: "Poor", cls: "q-bad", note: "Noticeable lag in interactive apps — worth checking your connection." };
}

const fmtMs = (n: number | null) => (n == null ? "—" : Math.round(n).toString());

export default function PingTool() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [samples, setSamples] = useState<(number | null)[]>([]);
  const [stats, setStats] = useState<Stats>(EMPTY);

  const runningRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

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

  const run = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    const ac = new AbortController();
    abortRef.current = ac;
    setPhase("running");
    setSamples([]);
    setStats(EMPTY);

    const res = await measurePingLive({
      count: COUNT,
      onSample: (s) => {
        setSamples((prev) => {
          const next = prev.slice();
          next[s.index] = s.rttMs;
          return next;
        });
        setStats({
          median: s.runningMedian,
          jitter: s.jitter,
          min: s.min,
          max: s.max,
          lossPct: s.lossPct,
        });
      },
      signal: ac.signal,
    });

    setStats({
      median: res.median,
      jitter: res.jitter,
      min: res.min,
      max: res.max,
      lossPct: res.lossPct,
    });
    runningRef.current = false;
    abortRef.current = null;
    setPhase("done");
  }, []);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  useEffect(() => {
    run(); /* auto-run once on load */
  }, [run]);

  const sentSoFar = samples.length;
  const receivedSoFar = samples.filter((v) => v !== null).length;
  const grade = latencyGrade(stats.median);

  // bar scale: at least 150ms so a fast connection's bars stay readable
  const scaleMax = Math.max(150, stats.max ?? 0);

  // connection status pill
  let connState = "good";
  let connText = "Ready";
  if (phase === "running" && stats.median == null) {
    connState = "wait";
    connText = "Pinging…";
  } else if (!online) {
    connState = "bad";
    connText = "Offline";
  } else if (phase === "done" && receivedSoFar === 0) {
    connState = "bad";
    connText = "No replies";
  } else if (stats.median != null) {
    connText =
      (phase === "running" ? "Pinging · " : "Median · ") + stats.median + "ms";
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
            {phase === "running" ? (
              <button className="rerun-pill" onClick={stop}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
                Stop
              </button>
            ) : (
              <button className="rerun-pill" onClick={run}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-3.5-7.1" />
                  <path d="M21 3v5h-5" />
                </svg>
                {phase === "done" ? "Re-run Test" : "Run Test"}
              </button>
            )}
          </div>

          <div className="tool-head">
            <div className="lede">// latency probe</div>
            <h1 className="headline">
              Ping &amp; <em>jitter</em> test
            </h1>
            <p className="subhead">
              Round-trip latency, jitter and packet loss measured live against a global
              edge network — the numbers that decide whether calls and games feel smooth.
              Runs in your browser, nothing stored.
            </p>
          </div>

          <div className="ping-hero">
            <span className={"big mono " + grade.cls}>{fmtMs(stats.median)}</span>
            <span className="unit">ms median</span>
          </div>
          <div className={"tool-grade " + grade.cls}>{grade.label}</div>
          <p className="tool-grade-note">{grade.note}</p>

          <div className="ping-bars" aria-hidden="true">
            {Array.from({ length: COUNT }, (_, i) => {
              const v = i < samples.length ? samples[i] : undefined;
              if (v === null) {
                return <div key={i} className="ping-bar lost" />;
              }
              const pct =
                v === undefined
                  ? 0
                  : Math.max(6, Math.min(100, (v / scaleMax) * 100));
              return (
                <div
                  key={i}
                  className={"ping-bar" + (v === undefined ? "" : " on")}
                  style={{ height: pct + "%" }}
                />
              );
            })}
          </div>
          <div className="ping-axis">
            <span>round-trips</span>
            <span className="mono">
              {receivedSoFar}/{sentSoFar || COUNT} replies
            </span>
          </div>

          <div className="readouts" style={{ marginTop: 22 }}>
            <div className="ro">
              <div className="k">Median</div>
              <div className="v mono">
                {fmtMs(stats.median)}
                <small> ms</small>
              </div>
              <div className="sub">typical round-trip</div>
            </div>
            <div className="ro">
              <div className="k">Jitter</div>
              <div className="v mono">
                {fmtMs(stats.jitter)}
                <small> ms</small>
              </div>
              <div className="sub">latency variation</div>
            </div>
            <div className="ro">
              <div className="k">Best / Worst</div>
              <div className="v mono">
                {fmtMs(stats.min)}
                <small> / {fmtMs(stats.max)} ms</small>
              </div>
              <div className="sub">fastest &amp; slowest</div>
            </div>
            <div className="ro">
              <div className="k">Packet loss</div>
              <div
                className={
                  "v mono " + (stats.lossPct > 0 ? "q-bad" : "")
                }
              >
                {Math.round(stats.lossPct)}
                <small> %</small>
              </div>
              <div className="sub">
                {receivedSoFar}/{sentSoFar || COUNT} replies
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
