"use client";

import { useState } from "react";

/** Copies the IP, flipping to a green "Copied" confirmation for 1.6s. Graceful fallback. */
export default function CopyIP({ ip }: { ip: string | null }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!ip) return;
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ip).then(done).catch(done);
    } else {
      done();
    }
  };

  return (
    <button
      className={"copy-btn" + (copied ? " copied" : "")}
      onClick={copy}
      disabled={!ip}
      aria-label="Copy IP address"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>{" "}
          Copied
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>{" "}
          Copy
        </>
      )}
    </button>
  );
}
