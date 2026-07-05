"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isValidIp, lookupAsn, normalizeIp, type AsnInfo } from "@/lib/asn";
import { lookupPtr } from "@/lib/dns";

type Phase = "detecting" | "running" | "done" | "error";
interface PtrState {
  loading: boolean;
  hostname: string | null;
  resolver: string | null;
}

export default function AsnTool() {
  const [ip, setIp] = useState("");
  const [phase, setPhase] = useState<Phase>("detecting");
  const [result, setResult] = useState<AsnInfo | null>(null);
  const [ptr, setPtr] = useState<PtrState | null>(null);
  const [error, setError] = useState<string | null>(null);
  // True while the readouts show the VISITOR'S OWN IP (auto-detected on load).
  // When they analyze someone else's IP (e.g. 8.8.8.8) it flips false, so we
  // only mask the visitor's own data from Clarity replays — a looked-up public
  // IP isn't sensitive and stays visible for support/debugging.
  const [isOwnIp, setIsOwnIp] = useState(true);

  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const analyze = useCallback(async (raw?: string) => {
    // explicit input → validate; undefined → detect own IP
    if (raw !== undefined) {
      const norm = normalizeIp(raw);
      if (!isValidIp(norm)) {
        setPhase("error");
        setResult(null);
        setPtr(null);
        setError(`"${raw.trim()}" isn't a valid IPv4 or IPv6 address.`);
        return;
      }
    }
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setPhase(raw === undefined ? "detecting" : "running");
    setIsOwnIp(raw === undefined);
    setError(null);
    setPtr(null);

    try {
      const res = await lookupAsn(raw === undefined ? undefined : normalizeIp(raw), ac.signal);
      if (ac.signal.aborted) return;
      setResult(res);
      setIp(res.ip);
      setPhase("done");

      // reverse-DNS runs after the routing data is on screen
      setPtr({ loading: true, hostname: null, resolver: null });
      const p = await lookupPtr(res.ip, ac.signal);
      if (ac.signal.aborted) return;
      setPtr({ loading: false, hostname: p.hostname, resolver: p.resolver });
    } catch (err) {
      if (ac.signal.aborted) return;
      setResult(null);
      setPtr(null);
      setError("Couldn't reach the IP routing service. Check your connection and try again.");
      setPhase("error");
    } finally {
      if (abortRef.current === ac) abortRef.current = null;
    }
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      analyze(ip);
    },
    [ip, analyze],
  );

  const runExample = useCallback(
    (v: string) => {
      setIp(v);
      analyze(v);
    },
    [analyze],
  );

  // detect the visitor's own IP on load
  useEffect(() => {
    analyze(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // status pill
  let pillState = "good";
  let pillText = "Ready";
  if (phase === "detecting") {
    pillState = "wait";
    pillText = "Detecting your IP…";
  } else if (phase === "running") {
    pillState = "wait";
    pillText = "Analyzing…";
  } else if (phase === "error") {
    pillState = "bad";
    pillText = "Lookup failed";
  } else if (phase === "done" && result) {
    pillText = `Analyzed via ${result.source}`;
  }

  const busy = phase === "detecting" || phase === "running";

  const location =
    result && (result.city || result.region || result.country)
      ? [result.city, result.region, result.country].filter(Boolean).join(", ")
      : null;

  const na = (v: string | null | undefined) =>
    v ? <>{v}</> : <span className="na">Not available</span>;

  return (
    <section className="hero">
      <div className="wrap">
        <div className="stage solo">
          <div className="tool-head">
            <div className="lede">
              <a className="eyebrow-home" href="/">Home</a> // asn &amp; routing
            </div>
            <h1 className="headline">
              ASN &amp; <em>routing</em>
            </h1>
            <p className="subhead">
              See the network behind any IP — its ASN, operator, a best-effort connection-type
              estimate, and reverse-DNS hostname. Runs in your browser, nothing stored.
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <label className="dns-label" htmlFor="asn-ip">
              Enter any IP address — we&apos;ve filled in yours to start.
            </label>
            <div className="dns-form">
              <div className="dns-input-wrap">
                <input
                  id="asn-ip"
                  ref={inputRef}
                  className="dns-input mono"
                  type="text"
                  inputMode="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-label="IP address to analyze"
                  placeholder="8.8.8.8"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                />
                {ip ? (
                  <button
                    type="button"
                    className="dns-clear"
                    aria-label="Clear IP address"
                    onClick={() => {
                      setIp("");
                      inputRef.current?.focus();
                    }}
                  >
                    ✕
                  </button>
                ) : null}
              </div>
              <button className="dns-go" type="submit" disabled={busy}>
                {busy ? "Analyzing…" : "Analyze"}
              </button>
            </div>
            <p className="dns-hint">Paste any IPv4 or IPv6 address to analyze it instead.</p>
            <div className="dns-chips">
              <button type="button" className="dns-chip" onClick={() => runExample("8.8.8.8")}>
                Try 8.8.8.8
              </button>
              <button type="button" className="dns-chip" onClick={() => runExample("1.1.1.1")}>
                Try 1.1.1.1
              </button>
            </div>
          </form>

          <div className="dns-status">
            <span className={"conn-pill " + pillState}>
              <span className="led" />
              {pillText}
            </span>
          </div>

          {phase === "error" && error ? (
            <p className="dns-error" role="alert">
              {error}
            </p>
          ) : null}

          {result ? (
            // Mask the routing readouts from Clarity replays only when they show
            // the visitor's OWN IP/ASN; a looked-up public IP isn't masked.
            <div
              className="readouts"
              style={{ marginTop: 20 }}
              data-clarity-mask={isOwnIp ? "true" : undefined}
            >
              <div className="ro">
                <div className="k">ASN</div>
                <div className="v mono">{na(result.asn)}</div>
                <div className="sub">autonomous system number</div>
              </div>
              <div className="ro">
                <div className="k">AS organization</div>
                <div className="v txt">{na(result.org)}</div>
                <div className="sub">who runs the network</div>
              </div>
              <div className="ro">
                <div className="k">Connection type</div>
                <div className="v txt">{result.connectionType}</div>
                <div className="sub">best-effort estimate</div>
              </div>
              <div className="ro">
                <div className="k">ISP / operator</div>
                <div className="v txt">{na(result.isp)}</div>
                <div className="sub">network provider</div>
              </div>
              <div className="ro">
                <div className="k">Location</div>
                <div className="v txt">{na(location)}</div>
                <div className="sub">approximate, from IP</div>
              </div>
              <div className="ro">
                <div className="k">Reverse DNS (PTR)</div>
                <div className="v mono" style={{ fontSize: 15, wordBreak: "break-all" }}>
                  {ptr?.loading ? (
                    <span className="na">Looking up…</span>
                  ) : (
                    na(ptr?.hostname ?? null)
                  )}
                </div>
                <div className="sub">
                  {result.ip} · {result.version}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
