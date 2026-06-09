import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About GetNetStats — Free, Private Network Tools",
  description:
    "GetNetStats is a growing hub of fast, no-signup network tools — IP lookup, speed test, ping & jitter — plus honest guides. Everything runs in your browser, nothing stored.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="page" aria-labelledby="about-h">
          <div className="wrap">
            <div className="eyebrow">// about</div>
            <h1 id="about-h">About GetNetStats</h1>

            <div className="prose">
              <p>
                <strong>GetNetStats</strong> is a growing hub of fast, no-signup network utilities —
                see your public IP, ISP and location, then run a real internet speed test for
                download, upload, ping and connection quality, all in one tap. Each tool runs
                entirely in your browser.
              </p>

              <h2>Why we built it</h2>
              <p>
                Most &quot;what&apos;s my IP&quot; and speed-test sites are slow, cluttered, or push
                you toward a sign-up. We wanted the opposite: clear, honest network information with
                no account, no app, and nothing stored — just the numbers, fast.
              </p>

              <h2>We&apos;re honest about what a browser can measure</h2>
              <p>
                Browsers <strong>can&apos;t read your Wi-Fi radio signal strength</strong> — there
                is no API for it, by design. So our &quot;connection quality&quot; meter isn&apos;t a
                fake bars-of-signal readout; it&apos;s an estimate derived from your{" "}
                <em>real</em> measured latency and download throughput. For true radio signal, check
                your device&apos;s Wi-Fi menu or your router.
              </p>

              <h2>Privacy first</h2>
              <p>
                The tools are client-side, there&apos;s no sign-up, and we don&apos;t store or sell
                personal data. Ads on the page are how the free tools stay free. See our{" "}
                <a href="/privacy/">Privacy Policy</a> for the details.
              </p>

              <h2>The toolkit</h2>
              <p>
                Today: <a href="/">IP lookup &amp; internet speed test</a> and a{" "}
                <a href="/ping-test/">ping &amp; jitter test</a>. More network checks (WHOIS, DNS,
                and others) are on the way.
              </p>

              <h2>Contact</h2>
              <p>
                Feedback or questions? Email{" "}
                <a href="mailto:hello@getnetstats.com">hello@getnetstats.com</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
