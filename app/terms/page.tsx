import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service — GetNetStats",
  description:
    "The terms for using GetNetStats' free network tools, provided as-is. Measurements are estimates; use at your own discretion.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="page" aria-labelledby="terms-h">
          <div className="wrap">
            <div className="eyebrow">// legal</div>
            <h1 id="terms-h">Terms of Service</h1>
            <div className="updated">Last updated: June 8, 2026</div>

            <div className="prose">
              <p>
                By using getnetstats.com (the &quot;Service&quot;), you agree to these terms. If you
                don&apos;t agree, please don&apos;t use the Service.
              </p>

              <h2>The service</h2>
              <p>
                GetNetStats provides free, browser-based network tools — IP lookup, internet speed
                test, ping &amp; jitter, and related utilities — along with educational content. No
                account is required.
              </p>

              <h2>Measurements are estimates</h2>
              <p>
                All results are <strong>estimates provided &quot;as is.&quot;</strong> Speed,
                latency and related figures vary with your network, Wi-Fi interference, other
                devices, time of day, and third-party server load, and may be inaccurate. The
                &quot;connection quality / Wi-Fi signal&quot; reading is a{" "}
                <strong>derived score from measured latency and throughput</strong>, not a reading
                of your device&apos;s radio signal. Don&apos;t rely on these figures for any
                contractual, legal, professional, or safety-critical purpose.
              </p>

              <h2>Acceptable use</h2>
              <p>
                Don&apos;t misuse the Service: no automated scraping or abuse, no attempts to
                overload or disrupt it or the third-party endpoints it relies on, and nothing
                unlawful.
              </p>

              <h2>Third-party services and links</h2>
              <p>
                The tools rely on third-party endpoints (such as Cloudflare and public IP lookup
                services), and the site may contain links to other websites, including affiliate
                links. We don&apos;t control and aren&apos;t responsible for third-party services,
                content, or practices.
              </p>

              <h2>Intellectual property</h2>
              <p>
                The site&apos;s design, text, and code are the property of GetNetStats unless
                otherwise noted, and may not be copied or redistributed without permission.
              </p>

              <h2>Disclaimer &amp; limitation of liability</h2>
              <p>
                The Service is provided without warranties of any kind, express or implied. To the
                fullest extent permitted by law, GetNetStats is not liable for any damages arising
                from your use of, or inability to use, the Service or its results.
              </p>

              <h2>Changes</h2>
              <p>
                We may update or discontinue the Service or these terms at any time; the &quot;last
                updated&quot; date above reflects the latest version.
              </p>

              <h2>Contact</h2>
              <p>
                Questions? Email <a href="mailto:hello@getnetstats.com">hello@getnetstats.com</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
