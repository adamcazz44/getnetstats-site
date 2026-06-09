"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { measureDownloadLive } from "@/lib/gns";

type Phase = "idle" | "running" | "done";
const BARS = 40;
const BUDGET_MS = 10000;
const WINDOW_MS = 250;

interface Stats {
  avg: number | null; // overall average Mbps
  peak: number | null; // best window Mbps
  bytes: number; // total bytes received
  durationMs: number; // elapsed test time
}
const EMPTY: Stats = { avg: null, peak: null, bytes: 0, durationMs: 0 };

interface Grade {
  label: string;
  cls: string;
  note: string;
}
function downloadGrade(mbps: number | null): Grade {
  if (mbps == null)
    return { label: "— — —", cls: "", note: "Streaming data from a global edge server to measure your download speed…" };
  if (mbps < 10)
    return { label: "Slow", cls: "q-bad", note: "Basic browsing and SD video; HD streaming may buffer or take a while." };
  if (mbps < 50)
    return { label: "OK", cls: "q-fair", note: "Comfortable for HD streaming, video calls and everyday use on a few devices." };
  if (mbps < 150)
    return { label: "Good", cls: "q-good", note: "Smooth 4K streaming, large downloads and a busy household." };
  if (mbps < 500)
    return { label: "Fast", cls: "q-good", note: "Multiple 4K streams and big files with room to spare." };
  return { label: "Excellent", cls: "q-good", note: "Gigabit-class — just about anything, all at once." };
}

// Mbps formatter: integer at/above 100, one decimal below.
function fmtMbps(n: number | null): string {
  if (n == null) return "—";
  return n >= 100 ? Math.round(n).toString() : (Math.round(n * 10) / 10).toString();
}
const fmtMB = (bytes: number) => (bytes / 1e6).toFixed(0);
const fmtSec = (ms: number) => (ms / 1000).toFixed(1);

export default function DownloadTool() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [samples, setSamples] = useState<number[]>([]);
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

    const res = await measureDownloadLive({
      budgetMs: BUDGET_MS,
      windowMs: WINDOW_MS,
      onSample: (s) => {
        setSamples((prev) => {
          const next = prev.slice();
          next[s.index] = s.instMbps;
          return next;
        });
        setStats({
          avg: s.avgMbps,
          peak: s.peakMbps,
          bytes: s.bytes,
          durationMs: 0,
        });
      },
      signal: ac.signal,
    });

    setStats({
      avg: res.avgMbps,
      peak: res.peakMbps,
      bytes: res.bytes,
      durationMs: res.durationMs,
    });
    runningRef.current = false;
    abortRef.current = null;
    setPhase("done");
  }, []);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  useEffect(() => {
    run(); /* auto-run once on load */
  }, [run]);

  const grade = downloadGrade(stats.avg);

  // bar scale: relative to the best window so far, floor at 10 Mbps so a slow
  // line still shows readable bars.
  const scaleMax = Math.max(10, stats.peak ?? 0);

  // status pill
  let connState = "good";
  let connText = "Ready";
  if (phase === "running" && stats.avg == null) {
    connState = "wait";
    connText = "Testing…";
  } else if (!online) {
    connState = "bad";
    connText = "Offline";
  } else if (phase === "done" && stats.avg == null) {
    connState = "bad";
    connText = "No data";
  } else if (stats.avg != null) {
    connText =
      (phase === "running" ? "Testing · " : "Download · ") + fmtMbps(stats.avg) + " Mbps";
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
            <div className="lede">
              <a className="eyebrow-home" href="/">Home</a> // download probe
            </div>
            <h1 className="headline">
              Download <em>speed</em> test
            </h1>
            <p className="subhead">
              Real download throughput measured live by streaming data from a global edge
              network — the number that decides how fast pages, files, 4K video and game
              updates arrive. Runs in your browser, nothing stored.
            </p>
          </div>

          <div className="ping-hero">
            <span className={"big mono " + grade.cls}>{fmtMbps(stats.avg)}</span>
            <span className="unit">Mbps down</span>
          </div>
          <div className={"tool-grade " + grade.cls}>{grade.label}</div>
          <p className="tool-grade-note">{grade.note}</p>

          <div className="ping-bars" aria-hidden="true">
            {Array.from({ length: BARS }, (_, i) => {
              const v = i < samples.length ? samples[i] : undefined;
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
            <span>throughput over time</span>
            <span className="mono">
              {phase === "running" ? "measuring…" : fmtMB(stats.bytes) + " MB sampled"}
            </span>
          </div>

          <div className="readouts" style={{ marginTop: 22 }}>
            <div className="ro">
              <div className="k">Average</div>
              <div className="v mono">
                {fmtMbps(stats.avg)}
                <small> Mbps</small>
              </div>
              <div className="sub">sustained speed</div>
            </div>
            <div className="ro">
              <div className="k">Peak</div>
              <div className="v mono">
                {fmtMbps(stats.peak)}
                <small> Mbps</small>
              </div>
              <div className="sub">best window</div>
            </div>
            <div className="ro">
              <div className="k">Data</div>
              <div className="v mono">
                {fmtMB(stats.bytes)}
                <small> MB</small>
              </div>
              <div className="sub">transferred</div>
            </div>
            <div className="ro">
              <div className="k">Duration</div>
              <div className="v mono">
                {phase === "done" ? fmtSec(stats.durationMs) : "—"}
                <small> s</small>
              </div>
              <div className="sub">test length</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
