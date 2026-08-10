/* ===========================================================
   GetNetStats — interactive app (hero tool + page composition)
   Orchestrates the real scan-to-reveal using window.GNS.
   =========================================================== */
const { useState, useEffect, useRef, useCallback } = React;

/* ---- tweened number ---- */
function AnimatedNumber({ value, fmt, dur = 700 }) {
  const [disp, setDisp] = useState(value == null ? null : value);
  const fromRef = useRef(0);
  const rafRef = useRef(0);
  useEffect(() => {
    if (value == null) { setDisp(null); return; }
    const from = fromRef.current || 0;
    const to = value;
    const t0 = performance.now();
    cancelAnimationFrame(rafRef.current);
    const tick = (t) => {
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
const fmtSpeed = (n) => (n >= 100 ? Math.round(n).toString() : n.toFixed(1));
const fmtInt = (n) => Math.round(n).toString();

/* ---- radar (now reads connection / WiFi signal quality) ---- */
function Radar({ scanning, done, quality, phaseText, prog }) {
  const R = 48, C = 2 * Math.PI * R;
  const bars = quality ? quality.bars : 0;
  const qcls = quality ? quality.cls : '';
  const BAR_COLORS = { 'q-good': '#34d399', 'q-fair': '#fbbf24', 'q-bad': '#f87171' };
  const activeColor = BAR_COLORS[qcls] || '#34d399';
  return (
    <div className={"radar" + (scanning ? " scanning" : "") + (done ? " done" : "")}>
      <svg className="progress-ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - Math.max(0, Math.min(1, prog)))}
          style={{ transition: "stroke-dashoffset .2s linear", filter: "drop-shadow(0 0 5px rgba(34,211,238,.6))" }} />
      </svg>
      <div className="ring"></div><div className="ring r2"></div><div className="ring r3"></div><div className="ring r4"></div>
      <div className="cross"></div><div className="crossv"></div>
      <div className="sweep"></div>
      <div className="center">
        <div className={"sig " + qcls} key={qcls || 'idle'} aria-hidden="true">
          {[0,1,2,3,4].map((i) => {
            const on = quality && i < bars;
            return <i key={i} className={on ? '' : 'off'} style={{ height: (16 + i * 8) + 'px', backgroundColor: on ? activeColor : '#6f8096', opacity: on ? 1 : 0.22 }}></i>;
          })}
        </div>
        <div className={"big-sig mono " + qcls}>{quality ? quality.label : '— — —'}</div>
        <div className="lbl">Wi-Fi Signal</div>
        <div className="phase">{phaseText}</div>
      </div>
    </div>
  );
}

/* ---- copy button ---- */
function CopyIP({ ip }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!ip) return;
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ip).then(done).catch(done);
    else done();
  };
  return (
    <button className={"copy-btn" + (copied ? " copied" : "")} onClick={copy} disabled={!ip} aria-label="Copy IP address">
      {copied
        ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg> Copied</>
        : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg> Copy</>}
    </button>
  );
}

/* ---- a stat readout cell ---- */
function Readout({ shown, k, children, sub, kIcon }) {
  return (
    <div className={"ro reveal" + (shown ? " in" : "")}>
      <div className="k">{kIcon}{k}</div>
      {children}
      {sub ? <div className="sub">{sub}</div> : null}
    </div>
  );
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function HeroTool() {
  const [phase, setPhase] = useState('idle');     // idle | running | done
  const [phaseText, setPhaseText] = useState('Ready');
  const [prog, setProg] = useState(0);

  const [ipInfo, setIpInfo] = useState(null);
  const [ipv6, setIpv6] = useState(null);
  const [ipErr, setIpErr] = useState(false);

  const [ping, setPing] = useState(null);
  const [dlLive, setDlLive] = useState(0);
  const [dl, setDl] = useState(null);
  const [ul, setUl] = useState(null);
  const [conn, setConn] = useState(null);
  const [quality, setQuality] = useState(null);
  const [netErr, setNetErr] = useState(false);

  // which cells are revealed
  const [shown, setShown] = useState({ ip: false, ping: false, ul: false, conn: false, dl: false });
  const reveal = (key) => setShown((s) => ({ ...s, [key]: true }));

  const runningRef = useRef(false);

  const run = useCallback(async () => {
    if (runningRef.current) return;
    const DEMO = (typeof location !== 'undefined' && /[?&]demo/.test(location.search)) || window.__GNS_DEMO;
    runningRef.current = true;
    setPhase('running'); setNetErr(false); setIpErr(false);
    setShown({ ip: false, ping: false, ul: false, conn: false, dl: false });
    setPing(null); setDl(null); setUl(null); setQuality(null); setDlLive(0); setProg(0);

    // ---- demo mode: full reveal with representative numbers, no network ----
    if (DEMO) {
      setPhaseText('Locating…'); setProg(0.08); await wait(500);
      setIpInfo({ ip: '98.142.6.71', version: 'IPv4', isp: 'Comcast Cable', city: 'Denver', region: 'Colorado', country: 'United States' });
      setIpv6('2604:6000:1a08:b1e2::4f');
      reveal('ip');
      setPhaseText('Pinging…'); setProg(0.18); await wait(650);
      setPing({ ping: 38, jitter: 4 }); reveal('ping'); reveal('conn');
      setConn({ label: 'Wi-Fi', detail: { downlink: 320, effectiveType: '4g' } });
      setPhaseText('Testing download…'); reveal('dl');
      const target = 312; const t0 = performance.now(); const dur = 2600;
      await new Promise((res) => {
        const tick = () => {
          const k = Math.min(1, (performance.now() - t0) / dur);
          const e = 1 - Math.pow(1 - k, 2);
          setDlLive(target * e * (0.85 + Math.random() * 0.3));
          setProg(0.22 + k * 0.56);
          if (k < 1) requestAnimationFrame(tick); else { setDlLive(target); res(); }
        };
        requestAnimationFrame(tick);
      });
      setDl(target); setProg(0.8);
      setPhaseText('Testing upload…'); await wait(900);
      setUl(42.6); reveal('ul'); setProg(0.94);
      const score = window.GNS.qualityScore(target, 38);
      setQuality(Object.assign({ score }, window.GNS.qualityLabel(score)));
      setProg(1); setPhaseText(''); setPhase('done');
      runningRef.current = false;
      return;
    }

    // connection class is instant
    const c = window.GNS.getConnection();
    setConn({ label: window.GNS.connectionLabel(c), detail: c });

    // IP in parallel
    setPhaseText('Locating…'); setProg(0.06);
    const ipP = window.GNS.getIPInfo()
      .then((info) => { setIpInfo(info); reveal('ip'); return info; })
      .catch(() => { setIpErr(true); reveal('ip'); return null; });
    window.GNS.getIPv6().then((v6) => { if (v6) setIpv6(v6); });

    let anyNet = false;

    // ping
    setPhaseText('Pinging…'); setProg(0.16);
    const pingRes = await window.GNS.measurePing(6);
    if (pingRes) { setPing(pingRes); reveal('ping'); anyNet = true; }
    else reveal('ping');
    setProg(0.22);

    // reveal connection now that we have a moment
    reveal('conn');

    // download (live number feeds the Download tile; radar shows signal)
    setPhaseText('Testing download…'); reveal('dl');
    const dlRes = await window.GNS.measureDownload((mbps, pr) => {
      setDlLive(mbps);
      setProg(0.22 + Math.max(0, Math.min(1, pr)) * 0.56);
    }, 9000);
    if (dlRes != null) { setDl(dlRes); setDlLive(dlRes); anyNet = true; }
    setProg(0.8);

    // upload
    setPhaseText('Testing upload…');
    const ulRes = await window.GNS.measureUpload(10000000);
    if (ulRes != null) { setUl(ulRes); anyNet = true; }
    reveal('ul');
    setProg(0.94);

    // quality (derived) + finish
    const score = window.GNS.qualityScore(dlRes, pingRes ? pingRes.ping : null);
    setQuality(Object.assign({ score }, window.GNS.qualityLabel(score)));
    setProg(1);
    setNetErr(!anyNet);
    setPhaseText('');
    setPhase('done');
    runningRef.current = false;
    await ipP;
  }, []);

  useEffect(() => { run(); /* auto-run once on load */ }, [run]);

  const loc = ipInfo && (ipInfo.city || ipInfo.country)
    ? [ipInfo.city, ipInfo.region, ipInfo.country].filter(Boolean).join(', ') : null;
  const connLabel = conn ? conn.label : '—';
  const connDetail = conn && conn.detail.downlink ? '≈ ' + conn.detail.downlink + ' Mbps est.'
    : (conn && conn.detail.effectiveType ? conn.detail.effectiveType.toUpperCase() + ' profile' : 'Network class');
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
  let connState = 'good', connText = 'Connected';
  if (phase === 'running' && !ping) { connState = 'wait'; connText = 'Connecting…'; }
  else if (netErr || !online) { connState = 'bad'; connText = 'Offline'; }
  else if (ping) { connText = 'Connected · ' + ping.ping + 'ms'; }

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="stage">
          <div className="stage-controls">
            <span className={"conn-pill " + connState}><span className="led"></span>{connText}</span>
            <button className="rerun-pill" onClick={run} disabled={phase === 'running'}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3.5-7.1" /><path d="M21 3v5h-5" /></svg>
              {phase === 'running' ? 'Scanning…' : phase === 'done' ? 'Re-run Test' : 'Run Test'}
            </button>
          </div>
          <div>
            <div className="lede">{phase === 'running' ? '// scanning network interface' : phase === 'done' ? '// scan complete' : '// network scanner ready'}</div>
            <h1 className="headline">How fast is your <em>internet</em>, really?</h1>
            <p className="subhead">One tap reveals your IP address, connection quality, latency and real-world speed — no app, no sign-up, nothing stored.</p>

            <div className="ip-row">
              <div className={"ip-box reveal" + (shown.ip ? " in" : "")}>
                <div style={{ minWidth: 0 }}>
                  <div className="k">Your IP address</div>
                  <div className="ip">{ipErr ? 'Unavailable' : (ipInfo ? ipInfo.ip : '···')}</div>
                  <div className="meta">
                    {ipErr ? 'Could not reach lookup service' : (ipInfo
                      ? <>{ipInfo.version ? <span className="ver">{ipInfo.version}</span> : null}{ipInfo.isp ? ' · ' + ipInfo.isp : ''}{loc ? ' · ' + loc : ''}</>
                      : 'Detecting…')}
                  </div>
                  {ipv6 ? <div className="meta"><span className="ver">IPv6</span> {ipv6}</div> : null}
                </div>
              </div>
              <CopyIP ip={ipInfo ? ipInfo.ip : null} />
            </div>

            <div className="readouts">
              <Readout shown={shown.ping} k="Ping">
                <div className="v mono">{ping ? <AnimatedNumber value={ping.ping} fmt={fmtInt} /> : '—'}<small> ms</small></div>
                {ping ? <div className="sub">{ping.jitter} ms jitter</div> : <div className="sub">latency</div>}
              </Readout>
              <Readout shown={shown.ul} k="Upload">
                <div className="v mono">{ul != null ? <AnimatedNumber value={ul} fmt={fmtSpeed} /> : '—'}<small> Mbps</small></div>
                <div className="sub">↑ to server</div>
              </Readout>
              <Readout shown={shown.conn} k="Connection">
                <div className="v txt">{connLabel}</div>
                <div className="sub">{connDetail}</div>
              </Readout>
              <Readout shown={shown.dl} k="Download">
                <div className="v mono" style={{ color: 'var(--accent-2)' }}>{dl != null ? <AnimatedNumber value={dl} fmt={fmtSpeed} /> : (phase === 'running' && dlLive > 0 ? fmtSpeed(dlLive) : '—')}<small style={{ color: 'var(--dim)' }}> Mbps</small></div>
                <div className="sub">↓ from server</div>
              </Readout>
            </div>
          </div>

          <div className="radar-wrap">
            <Radar scanning={phase === 'running'} done={phase === 'done'} quality={quality} phaseText={phaseText} prog={prog} />
            {netErr ? <div className="mono" style={{ fontSize: '11.5px', color: 'var(--warn)', textAlign: 'center', maxWidth: '260px' }}>Couldn't reach the measurement servers from this network. IP lookup still works — try again on an open connection.</div> : null}
          </div>
        </div>

        <aside className="rail" aria-label="Advertisement">
          <div className="ad halfpage"><span className="lab">Advertisement</span><span className="big">300 × 600</span></div>
          <div className="ad mrec" style={{ minHeight: '250px', flex: '0 0 250px' }}><span className="lab">Advertisement</span><span className="big">300 × 250</span></div>
        </aside>
      </div>
    </section>
  );
}

/* ---- header (mirrors hero status) ---- */
function SiteHeader() {
  return (
    <header className="site">
      <div className="wrap bar">
        <div className="brand"><span className="dot"></span><b>GetNet<span>Stats</span></b></div>
        <nav className="main">
          <a href="#how">How It Works</a>
          <a href="#faq">FAQ</a>
        </nav>
      </div>
    </header>
  );
}

function App() {
  const HowItWorks = window.HowItWorks, RelatedTools = window.RelatedTools, Education = window.Education,
        FAQSection = window.FAQSection, SiteFooter = window.SiteFooter;
  return (
    <React.Fragment>
      <SiteHeader />
      <main id="top">
        <HeroTool />
        <div className="wrap"><hr className="divider" /></div>
        <HowItWorks />
        <div className="wrap"><hr className="divider" /></div>
        <RelatedTools />
        <div className="wrap"><hr className="divider" /></div>
        <Education />
        <div className="wrap"><hr className="divider" /></div>
        <FAQSection />
      </main>
      <SiteFooter />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
