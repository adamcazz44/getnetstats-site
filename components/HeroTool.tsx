"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as GNS from "@/lib/gns";
import type { ConnectionInfo, IPInfo, PingResult, QualityLabel } from "@/lib/gns";
import AnimatedNumber, { fmtInt, fmtSpeed } from "./AnimatedNumber";
import Radar from "./Radar";
import CopyIP from "./CopyIP";
import Readout from "./Readout";
import GoogleAd from "./ads/GoogleAd";
import AffiliateAd from "./ads/AffiliateAd";
import { NORDVPN_HREF } from "./ads/affiliates";
import EkgLine from "./EkgLine";

type Phase = "idle" | "running" | "done";
type Quality = QualityLabel & { score: number };
interface ConnState {
  label: string;
  detail: ConnectionInfo;
}
interface Shown {
  ip: boolean;
  ping: boolean;
  ul: boolean;
  conn: boolean;
  dl: boolean;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

declare global {
  interface Window {
    __GNS_DEMO?: boolean;
  }
}

export default function HeroTool() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [phaseText, setPhaseText] = useState("Ready");
  const [prog, setProg] = useState(0);

  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [ipv6, setIpv6] = useState<string | null>(null);
  const [ipErr, setIpErr] = useState(false);

  const [ping, setPing] = useState<PingResult | null>(null);
  const [dlLive, setDlLive] = useState(0);
  const [dl, setDl] = useState<number | null>(null);
  const [ul, setUl] = useState<number | null>(null);
  const [conn, setConn] = useState<ConnState | null>(null);
  const [quality, setQuality] = useState<Quality | null>(null);
  const [netErr, setNetErr] = useState(false);

  // which cells are revealed
  const [shown, setShown] = useState<Shown>({
    ip: false,
    ping: false,
    ul: false,
    conn: false,
    dl: false,
  });
  const reveal = (key: keyof Shown) => setShown((s) => ({ ...s, [key]: true }));

  // Online state. Default to `true` so server and first client render agree
  // (some browsers report navigator.onLine === false at load → hydration
  // mismatch). Read the real value after mount and stay reactive to changes.
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

  const runningRef = useRef(false);

  const run = useCallback(async () => {
    if (runningRef.current) return;
    const DEMO =
      (typeof location !== "undefined" && /[?&]demo/.test(location.search)) ||
      (typeof window !== "undefined" && window.__GNS_DEMO);
    runningRef.current = true;
    setPhase("running");
    setNetErr(false);
    setIpErr(false);
    setShown({ ip: false, ping: false, ul: false, conn: false, dl: false });
    setPing(null);
    setDl(null);
    setUl(null);
    setQuality(null);
    setDlLive(0);
    setProg(0);

    // ---- demo mode: full reveal with representative numbers, no network ----
    if (DEMO) {
      setPhaseText("Locating…");
      setProg(0.08);
      await wait(500);
      setIpInfo({
        ip: "98.142.6.71",
        version: "IPv4",
        isp: "Comcast Cable",
        city: "Denver",
        region: "Colorado",
        country: "United States",
        source: "ipwho.is",
      });
      setIpv6("2604:6000:1a08:b1e2::4f");
      reveal("ip");
      setPhaseText("Pinging…");
      setProg(0.18);
      await wait(650);
      setPing({ ping: 38, jitter: 4 });
      reveal("ping");
      reveal("conn");
      setConn({
        label: "Wi-Fi",
        detail: {
          type: "wifi",
          downlink: 320,
          effectiveType: "4g",
          rtt: null,
          supported: true,
        },
      });
      setPhaseText("Testing download…");
      reveal("dl");
      const target = 312;
      const t0 = performance.now();
      const dur = 2600;
      await new Promise<void>((res) => {
        const tick = () => {
          const k = Math.min(1, (performance.now() - t0) / dur);
          const e = 1 - Math.pow(1 - k, 2);
          setDlLive(target * e * (0.85 + Math.random() * 0.3));
          setProg(0.22 + k * 0.56);
          if (k < 1) requestAnimationFrame(tick);
          else {
            setDlLive(target);
            res();
          }
        };
        requestAnimationFrame(tick);
      });
      setDl(target);
      setProg(0.8);
      setPhaseText("Testing upload…");
      await wait(900);
      setUl(42.6);
      reveal("ul");
      setProg(0.94);
      const score = GNS.qualityScore(target, 38);
      setQuality({ score, ...GNS.qualityLabel(score) });
      setProg(1);
      setPhaseText("");
      setPhase("done");
      runningRef.current = false;
      return;
    }

    // connection class is instant
    const c = GNS.getConnection();
    setConn({ label: GNS.connectionLabel(c), detail: c });

    // IP in parallel
    setPhaseText("Locating…");
    setProg(0.06);
    const ipP = GNS.getIPInfo()
      .then((info) => {
        setIpInfo(info);
        reveal("ip");
        return info;
      })
      .catch(() => {
        setIpErr(true);
        reveal("ip");
        return null;
      });
    GNS.getIPv6().then((v6) => {
      if (v6) setIpv6(v6);
    });

    let anyNet = false;

    // ping
    setPhaseText("Pinging…");
    setProg(0.16);
    const pingRes = await GNS.measurePing(6);
    if (pingRes) {
      setPing(pingRes);
      reveal("ping");
      anyNet = true;
    } else {
      reveal("ping");
    }
    setProg(0.22);

    // reveal connection now that we have a moment
    reveal("conn");

    // download (live number feeds the Download tile; radar shows signal)
    setPhaseText("Testing download…");
    reveal("dl");
    const dlRes = await GNS.measureDownload((mbps, pr) => {
      setDlLive(mbps);
      setProg(0.22 + Math.max(0, Math.min(1, pr)) * 0.56);
    }, 9000);
    if (dlRes != null) {
      setDl(dlRes);
      setDlLive(dlRes);
      anyNet = true;
    }
    setProg(0.8);

    // upload
    setPhaseText("Testing upload…");
    const ulRes = await GNS.measureUpload(10_000_000);
    if (ulRes != null) {
      setUl(ulRes);
      anyNet = true;
    }
    reveal("ul");
    setProg(0.94);

    // quality (derived) + finish
    const score = GNS.qualityScore(dlRes, pingRes ? pingRes.ping : null);
    setQuality({ score, ...GNS.qualityLabel(score) });
    setProg(1);
    setNetErr(!anyNet);
    setPhaseText("");
    setPhase("done");
    runningRef.current = false;
    await ipP;
  }, []);

  useEffect(() => {
    run(); /* auto-run once on load */
  }, [run]);

  const loc =
    ipInfo && (ipInfo.city || ipInfo.country)
      ? [ipInfo.city, ipInfo.region, ipInfo.country].filter(Boolean).join(", ")
      : null;
  const connLabel = conn ? conn.label : "—";
  const connDetail =
    conn && conn.detail.downlink
      ? "≈ " + conn.detail.downlink + " Mbps est."
      : conn && conn.detail.effectiveType
        ? conn.detail.effectiveType.toUpperCase() + " profile"
        : "Network class";
  let connState = "good";
  let connText = "Connected";
  if (phase === "running" && !ping) {
    connState = "wait";
    connText = "Connecting…";
  } else if (netErr || !online) {
    connState = "bad";
    connText = "Offline";
  }
  // "good" state stays just "Connected" — the live ms reading lives in the Ping
  // tile; this pill is the live-connection reassurance (see the animated LED).

  // Shared "Test" pill for the readout cards → the Ping & Jitter test.
  const testPill = (
    <a className="ro-test" href="/ping-test" aria-label="Open the Ping & Jitter test">
      Test <span aria-hidden="true">→</span>
    </a>
  );

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="stage">
          <div className="stage-controls">
            <span className={"conn-pill " + connState}>
              <span className="led" />
              {connText}
              {connState === "good" ? <EkgLine /> : null}
            </span>
            <button className="rerun-pill" onClick={run} disabled={phase === "running"}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-3.5-7.1" />
                <path d="M21 3v5h-5" />
              </svg>
              {phase === "running" ? "Scanning…" : phase === "done" ? "Re-run Test" : "Run Test"}
            </button>
          </div>
          <div>
            <div className="lede">
              {phase === "running"
                ? "// scanning network interface"
                : phase === "done"
                  ? "// scan complete"
                  : "// network scanner ready"}
            </div>
            <h1 className="headline">
              How fast is your <em>internet</em>, really?
            </h1>
            <p className="subhead">
              One tap reveals your IP address, connection quality, latency and real-world
              speed — no app, no sign-up, nothing stored.
            </p>

            <div className="ip-row">
              <div className={"ip-box reveal" + (shown.ip ? " in" : "")}>
                <div className="ip-content">
                  <div className="k">Your IP address</div>
                  <div className="ip">{ipErr ? "Unavailable" : ipInfo ? ipInfo.ip : "···"}</div>
                  <div className="meta isp">
                    {ipErr ? (
                      "Could not reach lookup service"
                    ) : ipInfo ? (
                      <>
                        {ipInfo.version ? <span className="ver">{ipInfo.version}</span> : null}
                        {ipInfo.isp ? " · " + ipInfo.isp : ""}
                        {loc ? " · " + loc : ""}
                      </>
                    ) : (
                      "Detecting…"
                    )}
                  </div>
                  {ipv6 ? (
                    <div className="meta">
                      <span className="ver">IPv6</span> {ipv6}
                    </div>
                  ) : null}
                </div>
                <CopyIP ip={ipInfo ? ipInfo.ip : null} />
              </div>
            </div>

            <div className="readouts">
              <Readout shown={shown.ping} k="Ping" action={testPill}>
                <div className="v mono">
                  {ping ? <AnimatedNumber value={ping.ping} fmt={fmtInt} /> : "—"}
                  <small> ms</small>
                </div>
                {ping ? (
                  <div className="sub">{ping.jitter} ms jitter</div>
                ) : (
                  <div className="sub">latency</div>
                )}
              </Readout>
              <Readout shown={shown.ul} k="Upload" action={testPill}>
                <div className="v mono">
                  {ul != null ? <AnimatedNumber value={ul} fmt={fmtSpeed} /> : "—"}
                  <small> Mbps</small>
                </div>
                <div className="sub">↑ to server</div>
              </Readout>
              <Readout shown={shown.conn} k="Connection" action={testPill}>
                <div className="v txt">{connLabel}</div>
                <div className="sub">{connDetail}</div>
              </Readout>
              <Readout shown={shown.dl} k="Download" action={testPill}>
                <div className="v mono" style={{ color: "var(--accent-2)" }}>
                  {dl != null ? (
                    <AnimatedNumber value={dl} fmt={fmtSpeed} />
                  ) : phase === "running" && dlLive > 0 ? (
                    fmtSpeed(dlLive)
                  ) : (
                    "—"
                  )}
                  <small style={{ color: "var(--dim)" }}> Mbps</small>
                </div>
                <div className="sub">↓ from server</div>
              </Readout>
            </div>

            {shown.ip && !ipErr ? (
              <div className="ip-hide-cta reveal in">
                <span>Your IP can reveal your location and ISP.</span>{" "}
                <a
                  className="ip-cta"
                  href={NORDVPN_HREF}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  Hide it with NordVPN <span aria-hidden="true">→</span>
                </a>
              </div>
            ) : null}
          </div>

          <div className="radar-wrap">
            <Radar
              scanning={phase === "running"}
              done={phase === "done"}
              quality={quality}
              phaseText={phaseText}
              prog={prog}
            />
            {netErr ? (
              <div
                className="mono"
                style={{
                  fontSize: "11.5px",
                  color: "var(--warn)",
                  textAlign: "center",
                  maxWidth: "260px",
                }}
              >
                Couldn&apos;t reach the measurement servers from this network. IP lookup still
                works — try again on an open connection.
              </div>
            ) : null}
          </div>
        </div>

        <aside className="rail" aria-label="Advertisements">
          {/* Swappable, lazy-loaded ad slots. Google → 300×600 half-page,
              affiliate → 300×250 rectangle. Publisher/slot ids come from env
              (see .env.example); both fall back to the dashed placeholder until
              configured. Google is first in source order so it stays the
              priority unit when the rail stacks on mobile. */}
          <GoogleAd width={300} height={600} className="halfpage" />
          <AffiliateAd width={300} height={250} className="mrec" />
        </aside>
      </div>
    </section>
  );
}
