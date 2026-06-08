import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhoisTool from "@/components/tools/WhoisTool";

export const metadata: Metadata = {
  title: "WHOIS Lookup — Free Domain Registration & RDAP Check | GetNetStats",
  description:
    "Look up any domain's registrar, status, registration and expiry dates, name servers and abuse contact — live from the official RDAP registry. Free, no sign-up.",
  keywords: [
    "whois lookup",
    "domain lookup",
    "rdap",
    "domain registrar",
    "domain expiry",
    "who owns a domain",
    "domain registration check",
    "name server lookup",
  ],
  alternates: { canonical: "/whois" },
  openGraph: {
    type: "website",
    siteName: "GetNetStats",
    title: "WHOIS Lookup — Domain Registration & RDAP Check",
    description:
      "Registrar, status, dates, name servers and abuse contact for any domain, live from RDAP. Free, no sign-up.",
    url: "https://getnetstats.com/whois",
  },
  twitter: {
    card: "summary_large_image",
    title: "WHOIS Lookup — GetNetStats",
    description: "Domain registrar, status, dates and name servers, live from RDAP.",
  },
};

export default function WhoisPage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <WhoisTool />

        <div className="wrap">
          <hr className="divider" />
        </div>

        <section aria-labelledby="whois-learn-h">
          <div className="wrap">
            <div className="eyebrow">Understand the record</div>
            <h2 className="sec" id="whois-learn-h">
              What a WHOIS lookup tells you
            </h2>
            <div className="content-grid">
              <div className="prose">
                <h3>What is WHOIS?</h3>
                <p>
                  <strong>WHOIS</strong> is the public directory of domain registrations. Every
                  registered domain has a record naming its <strong>registrar</strong> (the
                  company it was bought through), when it was registered and when it expires, the{" "}
                  <strong>name servers</strong> that run its DNS, and an <strong>abuse
                  contact</strong> for reporting problems.
                </p>
                <p>
                  This tool reads that data over <strong>RDAP</strong> — the Registration Data
                  Access Protocol, the modern, structured JSON replacement for the old text-based
                  WHOIS. RDAP returns clean, consistent fields straight from the registry.
                </p>

                <h3>What the fields mean</h3>
                <ul>
                  <li>
                    <b>Registrar:</b> where the domain is managed, with its IANA accreditation
                    number.
                  </li>
                  <li>
                    <b>Status:</b> EPP codes like <span className="mono">clientTransferProhibited</span>{" "}
                    that lock the domain against transfers or deletion.
                  </li>
                  <li>
                    <b>Dates:</b> when it was first registered, last changed, and when it expires.
                  </li>
                  <li>
                    <b>Name servers:</b> the DNS servers authoritative for the domain.
                  </li>
                  <li>
                    <b>Abuse contact:</b> where to report spam, phishing or other misuse.
                  </li>
                </ul>

                <h3>Why some lookups come back empty</h3>
                <p>
                  Registrant names and emails are usually <strong>redacted</strong> for privacy
                  (GDPR and registrar policies), so you&apos;ll often see the registrar&apos;s
                  details rather than the owner&apos;s. And some TLDs — many country-code domains
                  in particular — don&apos;t publish RDAP at all, so a structured lookup
                  isn&apos;t available for them.
                </p>
              </div>

              <aside>
                <div className="note-card">
                  <h4>
                    <span className="d" />
                    How this lookup works
                  </h4>
                  <p>
                    We resolve the right RDAP server for the domain&apos;s TLD via the{" "}
                    <strong style={{ color: "var(--text)" }}>IANA bootstrap registry</strong>, then
                    fetch and normalize the record server-side.
                  </p>
                  <p>
                    Coverage tracks whatever the registry publishes — gTLDs like .com, .net and
                    .org are well covered; many ccTLDs aren&apos;t. When a TLD has no RDAP, the
                    tool says so plainly rather than guessing.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
