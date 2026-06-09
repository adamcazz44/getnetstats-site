"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { measureUploadLive } from "@/lib/gns";

type Phase = "idle" | "running" | "done";
const BARS = 36;
const CHUNK_BYTES = 2_000_000;
const BUDGET_MS = 12000;

interface Stats {
  avg: number | null; // overall average Mbps
  peak: number | null; // best window Mbps
  bytes: number; // total bytes sent
  durationMs: number; // elapsed test time
}
const EMPTY: Stats = { avg: null, peak: null, bytes: 0, durationMs: 0 };

interface Grade {
  label: string;
  cls: string;
  note: string;
}
function uploadGrade(mbps: number | null): Grade {
  if (mbps == null)
    return { label: "— — —", cls: "", note: "Sending data up to a global edge server to measure your upload speed…" };
  if (mbps < 3)
    return { label: "Slow", cls: "q-bad", note: "Email and browsing are fine, but video calls, backups and large uploads will struggle." };
  if (mbps < 10)
    return { label: "OK", cls: "q-fair", note: "Comfortable for HD video calls and everyday photo and file sharing." };
  if (mbps < 25)
    return { label: "Good", cls: "q-good", note: "Smooth video calls, cloud backups and posting content without waiting." };
  if (mbps < 100)
    return { label: "Fast", cls: "q-good", note: "Large uploads, live streaming and multiple users with room to spare." };
  return { label: "Excellent", cls: "q-good", note: "Symmetrical-class upload — heavy creation, streaming and backup workloads." };
}

// Mbps formatter: integer at/above 100, one decimal below.
function fmtMbps(n: number | null): string {
  if (n == null) return "—";
  return n >= 100 ? Math.round(n).toString() : (Math.round(n * 10) / 10).toString();
}
const fmtMB = (bytes: number) => (bytes / 1e6).toFixed(0);
const fmtSec = (ms: number) => (ms / 1000).toFixed(1);

export default function UploadTool() {
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

    const res = await measureUploadLive({
      chunkBytes: CHUNK_BYTES,
      budgetMs: BUDGET_MS,
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

  const grade = uploadGrade(stats.avg);

  // bar scale: relative to the best window so far, floor at 5 Mbps so a slow
  // upload still shows readable bars.
  const scaleMax = Math.max(5, stats.peak ?? 0);

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
      (phase === "running" ? "Testing · " : "Upload · ") + fmtMbps(stats.avg) + " Mbps";
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
              <a className="eyebrow-home" href="/">Home</a> // upload probe
            </div>
            <h1 className="headline">
              Upload <em>speed</em> test
            </h1>
            <p className="subhead">
              Real upload throughput measured live by sending data to a global edge network —
              the number that decides how fast video calls, cloud backups, photos and live
              streams leave your device. Runs in your browser, nothing stored.
            </p>
          </div>

          <div className="ping-hero">
            <span className={"big mono " + grade.cls}>{fmtMbps(stats.avg)}</span>
            <span className="unit">Mbps up</span>
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
              {phase === "running" ? "sending…" : fmtMB(stats.bytes) + " MB sent"}
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
              <div className="sub">sent up</div>
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
