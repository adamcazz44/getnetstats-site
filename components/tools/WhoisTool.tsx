"use client";

import { useCallback, useEffect, useState } from "react";
import type { WhoisData } from "@/lib/whois/types";
import type { ApiErrorCode, ApiResponse } from "@/lib/api/types";

type Status = "idle" | "loading" | "success" | "error";

interface ApiErr {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
}
interface Success {
  target: string;
  data: WhoisData;
  cached: boolean;
  tookMs: number;
}

const DEFAULT_DOMAIN = "example.com";

const RotateIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-3.5-7.1" />
    <path d="M21 3v5h-5" />
  </svg>
);

function fmtDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC", // registry dates are UTC — don't shift by the viewer's locale
  }).format(d);
}

export default function WhoisTool() {
  const [query, setQuery] = useState(DEFAULT_DOMAIN);
  const [submitted, setSubmitted] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Success | null>(null);
  const [error, setError] = useState<ApiErr | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  const run = useCallback(async (domainRaw: string) => {
    const q = domainRaw.trim();
    if (!q) {
      setInputError("Enter a domain to look up.");
      return;
    }
    setInputError(null);
    setSubmitted(q);
    setStatus("loading");
    setError(null);
    setResult(null);

    let json: ApiResponse<WhoisData>;
    try {
      const r = await fetch("/api/whois?target=" + encodeURIComponent(q));
      json = (await r.json()) as ApiResponse<WhoisData>;
    } catch {
      setStatus("error");
      setError({
        code: "UPSTREAM_ERROR",
        message: "Couldn't reach the lookup service. Check your connection and try again.",
      });
      return;
    }

    if (json.ok) {
      setResult({
        target: json.target,
        data: json.data,
        cached: json.cached,
        tookMs: json.tookMs,
      });
      setStatus("success");
    } else if (json.error.code === "INVALID_TARGET") {
      setInputError(json.error.message);
      setStatus("idle");
    } else {
      setError(json.error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    run(DEFAULT_DOMAIN); /* show a populated example on load */
  }, [run]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(query);
  };

  // status pill
  let pillState = "good";
  let pillText = "Ready";
  if (status === "loading") {
    pillState = "wait";
    pillText = "Looking up…";
  } else if (status === "error") {
    pillState = "bad";
    pillText =
      error?.code === "UNSUPPORTED_TLD"
        ? "No RDAP"
        : error?.code === "NOT_FOUND"
          ? "Not found"
          : "Lookup failed";
  } else if (status === "success" && result) {
    pillText = result.tookMs + " ms" + (result.cached ? " · cached" : "");
  }

  return (
    <section className="hero">
      <div className="wrap">
        <div className="stage solo">
          <div className="stage-controls">
            <span className={"conn-pill " + pillState}>
              <span className="led" />
              {pillText}
            </span>
          </div>

          <div className="tool-head">
            <div className="lede">// registration lookup</div>
            <h1 className="headline">
              WHOIS <em>lookup</em>
            </h1>
            <p className="subhead">
              Registrar, status, key dates, name servers and abuse contact for any domain —
              pulled live from the official RDAP registry. Runs server-side, nothing stored.
            </p>
          </div>

          <form className="whois-form" onSubmit={onSubmit}>
            <input
              className="whois-input"
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="example.com"
              aria-label="Domain to look up"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="rerun-pill" type="submit" disabled={status === "loading"}>
              <RotateIcon />
              {status === "loading" ? "Looking up…" : "Look up"}
            </button>
          </form>
          {inputError ? <div className="whois-invalid">{inputError}</div> : null}

          {status === "loading" ? (
            <div className="tool-msg loading">
              <div className="h">
                <RotateIcon /> Looking up {submitted}…
              </div>
            </div>
          ) : null}

          {status === "error" && error ? <ErrorPanel error={error} domain={submitted} /> : null}

          {status === "success" && result ? <Result result={result} /> : null}
        </div>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="whois-row">
      <div className="lbl">{label}</div>
      <div className="val">{children}</div>
    </div>
  );
}

function Result({ result }: { result: Success }) {
  const d = result.data;
  const created = fmtDate(d.createdDate);
  const updated = fmtDate(d.updatedDate);
  const expires = fmtDate(d.expiryDate);

  return (
    <>
      <div className="whois-rows">
        <Row label="Domain">
          <span className="mono">{d.domain ?? result.target}</span>
        </Row>
        <Row label="Registrar">
          {d.registrar ?? <span className="sub">Not disclosed</span>}
          {d.registrarIanaId ? (
            <span className="sub"> · IANA #{d.registrarIanaId}</span>
          ) : null}
        </Row>
        {d.statuses.length ? (
          <Row label="Status">
            <div className="whois-chips">
              {d.statuses.map((s) => (
                <span className="whois-chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </Row>
        ) : null}
        <Row label="Registered">
          {created ? <span className="mono">{created}</span> : <span className="sub">—</span>}
        </Row>
        <Row label="Updated">
          {updated ? <span className="mono">{updated}</span> : <span className="sub">—</span>}
        </Row>
        <Row label="Expires">
          {expires ? <span className="mono">{expires}</span> : <span className="sub">—</span>}
        </Row>
        {d.nameservers.length ? (
          <Row label="Name servers">
            {d.nameservers.map((ns) => (
              <span className="ns" key={ns}>
                {ns}
              </span>
            ))}
          </Row>
        ) : null}
        {d.abuseEmail || d.abusePhone ? (
          <Row label="Abuse contact">
            {d.abuseEmail ? <span className="ns">{d.abuseEmail}</span> : null}
            {d.abusePhone ? <span className="ns sub">{d.abusePhone}</span> : null}
          </Row>
        ) : null}
      </div>
      <div className="whois-meta">
        <span>via RDAP{result.cached ? " · cached" : ""}</span>
        <span>{result.tookMs} ms</span>
        <span>{d.rdapServer}</span>
      </div>
    </>
  );
}

function ErrorPanel({ error, domain }: { error: ApiErr; domain: string }) {
  if (error.code === "UNSUPPORTED_TLD") {
    const tld = error.details?.tld as string | undefined;
    const note = error.details?.note as string | undefined;
    return (
      <div className="tool-msg warn">
        <div className="h">
          <span className="d" />
          RDAP isn&apos;t available{tld ? ` for .${tld}` : ""}
        </div>
        <p>
          {note ||
            "This top-level domain doesn't publish structured RDAP data, so a registration lookup isn't available here. Many country-code TLDs fall into this category."}
        </p>
      </div>
    );
  }
  if (error.code === "NOT_FOUND") {
    return (
      <div className="tool-msg neutral">
        <div className="h">
          <span className="d" />
          No registration found
        </div>
        <p>
          We couldn&apos;t find a registration for <strong>{domain}</strong>. It may be
          unregistered, or its registry doesn&apos;t expose public RDAP data.
        </p>
      </div>
    );
  }
  if (error.code === "RATE_LIMITED") {
    return (
      <div className="tool-msg warn">
        <div className="h">
          <span className="d" />
          Too many lookups
        </div>
        <p>You&apos;ve hit the rate limit — wait a moment and try again.</p>
      </div>
    );
  }
  return (
    <div className="tool-msg error">
      <div className="h">
        <span className="d" />
        Lookup failed
      </div>
      <p>{error.message || "Something went wrong reaching the registry. Please try again."}</p>
    </div>
  );
}
