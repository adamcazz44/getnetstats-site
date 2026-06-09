import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — GetNetStats",
  description:
    "How GetNetStats handles your data: the tools run in your browser, we store nothing, and we use Google AdSense. Read about cookies, third-party services and your choices.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="page" aria-labelledby="privacy-h">
          <div className="wrap">
            <div className="eyebrow">// legal</div>
            <h1 id="privacy-h">Privacy Policy</h1>
            <div className="updated">Last updated: June 8, 2026</div>

            <div className="prose">
              <p>
                GetNetStats (&quot;GetNetStats,&quot; &quot;we,&quot; &quot;us&quot;) operates the
                website <strong>getnetstats.com</strong> and its free network tools. This policy
                explains what happens to information when you use the site. The short version:{" "}
                <strong>
                  the tools run in your browser, we don&apos;t require an account, and we don&apos;t
                  operate a server that stores your results or personal data.
                </strong>
              </p>

              <h2>Information processed when you use the tools</h2>
              <ul>
                <li>
                  <b>Your IP address &amp; approximate location.</b> To show &quot;your IP,&quot;
                  your browser contacts third-party lookup services (
                  <a href="https://ipwho.is" rel="noopener noreferrer nofollow" target="_blank">
                    ipwho.is
                  </a>{" "}
                  and{" "}
                  <a href="https://ipapi.co" rel="noopener noreferrer nofollow" target="_blank">
                    ipapi.co
                  </a>
                  ), which receive your IP and return your ISP and approximate location. We do not
                  store this.
                </li>
                <li>
                  <b>Speed test traffic.</b> The speed test exchanges data with Cloudflare&apos;s
                  public measurement endpoints (<span className="mono">speed.cloudflare.com</span>),
                  which process those requests. We do not store the results.
                </li>
                <li>
                  <b>Standard server logs.</b> Our host (GitHub Pages) may record routine request
                  logs, which can include IP addresses, as is typical for web hosting.
                </li>
                <li>
                  <b>No accounts.</b> We don&apos;t ask for your name, email, or any sign-up, and we
                  don&apos;t sell personal data.
                </li>
              </ul>

              <h2>Cookies and advertising</h2>
              <p>
                We use <strong>Google AdSense</strong> to display ads, which keeps the tools free.
                Google and its partners use cookies to serve ads based on your visits to this and
                other websites. Google&apos;s use of advertising cookies enables it and its partners
                to serve ads to you based on your visit to our site and/or other sites on the
                internet.
              </p>
              <ul>
                <li>
                  You can opt out of personalized advertising by visiting{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Google Ads Settings
                  </a>
                  .
                </li>
                <li>
                  You can opt out of a third party vendor&apos;s use of cookies for personalized
                  advertising by visiting{" "}
                  <a
                    href="https://www.aboutads.info/choices/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    aboutads.info/choices
                  </a>
                  .
                </li>
                <li>
                  More detail is in{" "}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Google&apos;s advertising policies
                  </a>
                  .
                </li>
              </ul>

              <h2>Embedded videos</h2>
              <p>
                Some pages (such as our VPN &amp; privacy guide) embed YouTube videos. We use
                YouTube&apos;s privacy-enhanced mode (<span className="mono">youtube-nocookie.com</span>),
                and the player only loads when you <strong>click play</strong> — at which point
                YouTube/Google may set cookies and process data under{" "}
                <a
                  href="https://policies.google.com/privacy"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Google&apos;s privacy policy
                </a>
                . Until you click play, no YouTube content or cookies load.
              </p>

              <h2>Analytics</h2>
              <p>
                We do not currently run first-party analytics. Our web fonts are self-hosted, so the
                site does not call a third-party font CDN. If this changes, we will update this page.
              </p>

              <h2>Affiliate links</h2>
              <p>
                Some links (for example, VPN recommendations) may be affiliate links, meaning we may
                earn a commission if you sign up through them. This costs you nothing and never
                changes how the tools measure your connection.
              </p>

              <h2>Your choices and rights</h2>
              <p>
                Depending on where you live (for example, under the EU/UK GDPR or California&apos;s
                CCPA/CPRA), you may have rights over personal data about you. Because we don&apos;t
                store personal data, there is little for us to hold or delete — but you can always
                manage ad personalization through the opt-out links above, and clear cookies in your
                browser.
              </p>

              <h2>Children</h2>
              <p>
                GetNetStats is a general-audience utility and is not directed to children under 13.
                We do not knowingly collect personal information from children.
              </p>

              <h2>Changes to this policy</h2>
              <p>
                We may update this policy from time to time; the &quot;last updated&quot; date above
                reflects the latest version.
              </p>

              <h2>Contact</h2>
              <p>
                Questions about this policy? Email{" "}
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
