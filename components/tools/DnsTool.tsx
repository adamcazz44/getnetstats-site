"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DNS_TYPES,
  DNS_TYPE_LABELS,
  isValidDomain,
  lookupDns,
  normalizeDomain,
  type DnsLookupResult,
} from "@/lib/dns";

type Phase = "idle" | "running" | "done" | "error";
const DEFAULT_DOMAIN = "getnetstats.com";

export default function DnsTool() {
  const [domain, setDomain] = useState(DEFAULT_DOMAIN);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<DnsLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runningRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const run = useCallback(async (raw: string) => {
    const d = normalizeDomain(raw);
    if (!isValidDomain(d)) {
      setPhase("error");
      setResult(null);
      setError(`"${raw.trim()}" doesn't look like a valid domain. Try something like example.com.`);
      return;
    }
    // cancel any in-flight lookup
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    runningRef.current = true;
    setPhase("running");
    setError(null);

    try {
      const res = await lookupDns(d, ac.signal);
      if (ac.signal.aborted) return;
      setResult(res);
      setPhase("done");
    } catch (err) {
      if (ac.signal.aborted) return;
      setResult(null);
      setError("Couldn't reach a DNS resolver. Check your connection and try again.");
      setPhase("error");
    } finally {
      if (abortRef.current === ac) abortRef.current = null;
      runningRef.current = false;
    }
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      run(domain);
    },
    [domain, run],
  );

  // example chip: fill the field and run immediately
  const runExample = useCallback(
    (d: string) => {
      setDomain(d);
      run(d);
    },
    [run],
  );

  // auto-run once on load for the default domain
  useEffect(() => {
    run(DEFAULT_DOMAIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // status pill
  let pillState = "good";
  let pillText = "Ready";
  if (phase === "running") {
    pillState = "wait";
    pillText = "Looking up…";
  } else if (phase === "error") {
    pillState = "bad";
    pillText = "Lookup failed";
  } else if (phase === "done" && result) {
    pillText = result.notFound ? "Domain not found" : `Resolved via ${result.resolver}`;
    if (result.notFound) pillState = "bad";
  }

  const busy = phase === "running";

  return (
    <section className="hero">
      <div className="wrap">
        <div className="stage solo">
          <div className="tool-head">
            <div className="lede">
              <a className="eyebrow-home" href="/">Home</a> // dns lookup
            </div>
            <h1 className="headline">
              DNS <em>checker</em>
            </h1>
            <p className="subhead">
              Look up a domain&apos;s A, AAAA, MX, TXT, NS and CNAME records live, straight from your
              browser via public DNS-over-HTTPS resolvers. Free, no sign-up, nothing stored.
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <label className="dns-label" htmlFor="dns-domain">
              Enter any domain — we&apos;ve filled in ours to start.
            </label>
            <div className="dns-form">
              <div className="dns-input-wrap">
                <input
                  id="dns-domain"
                  ref={inputRef}
                  className="dns-input mono"
                  type="text"
                  inputMode="url"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-label="Domain to look up"
                  placeholder="google.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
                {domain ? (
                  <button
                    type="button"
                    className="dns-clear"
                    aria-label="Clear domain"
                    onClick={() => {
                      setDomain("");
                      inputRef.current?.focus();
                    }}
                  >
                    ✕
                  </button>
                ) : null}
              </div>
              <button className="dns-go" type="submit" disabled={busy}>
                {busy ? "Checking…" : "Check"}
              </button>
            </div>
            <p className="dns-hint">Check any domain, e.g. google.com.</p>
            <div className="dns-chips">
              <button type="button" className="dns-chip" onClick={() => runExample("google.com")}>
                Try google.com
              </button>
              <button type="button" className="dns-chip" onClick={() => runExample("github.com")}>
                Try github.com
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

          {result && !result.notFound ? (
            <div className="dns-results">
              {DNS_TYPES.map((type) => {
                const recs = result.records[type];
                return (
                  <div className="dns-rec" key={type}>
                    <div className="dns-rec-h">
                      <span className="dns-rec-type">{type}</span>
                      <span className="dns-rec-name">{DNS_TYPE_LABELS[type]}</span>
                    </div>
                    {recs.length ? (
                      <ul className="dns-rec-vals">
                        {recs.map((r, i) => (
                          <li key={i}>
                            {r.priority != null ? (
                              <span className="dns-prio" title="priority">
                                {r.priority}
                              </span>
                            ) : null}
                            {r.value}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="dns-none">None found</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}

          {result && result.notFound ? (
            <p className="dns-error" role="alert">
              No DNS records exist for <span className="mono">{result.domain}</span> — the domain may
              be unregistered or mistyped.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
