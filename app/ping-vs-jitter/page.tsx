import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const SITE = "https://getnetstats.com";
const PUBLISHED = "2026-06-22";

export const metadata: Metadata = {
  title: "Ping vs Jitter: What Actually Matters for Gaming & Video Calls | GetNetStats",
  description:
    "Ping vs jitter explained — what each is, why jitter (not just download speed) wrecks games and video calls, what good ping and jitter numbers look like, and how to improve both.",
  keywords: [
    "ping vs jitter",
    "what is jitter",
    "what is ping",
    "latency for gaming",
    "good ping for gaming",
    "fix jitter",
    "video call lag",
  ],
  alternates: { canonical: "/ping-vs-jitter/" },
  openGraph: {
    type: "article",
    siteName: "GetNetStats",
    title: "Ping vs Jitter: What Actually Matters for Gaming & Video Calls",
    description:
      "Two numbers that decide whether your connection feels smooth — and why speed alone doesn't.",
    url: `${SITE}/ping-vs-jitter/`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GetNetStats" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "Ping vs Jitter — GetNetStats",
    description: "Why jitter, not just speed, decides whether games and calls feel smooth.",
  },
};

export default function PingVsJitterPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Ping vs Jitter", item: `${SITE}/ping-vs-jitter/` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Ping vs Jitter: What Actually Matters for Gaming & Video Calls",
    description:
      "What ping and jitter are, why jitter rather than download speed often decides whether games and video calls feel smooth, good target numbers, and how to improve both.",
    image: [`${SITE}/og.png`],
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/ping-vs-jitter/` },
    author: { "@type": "Organization", name: "GetNetStats", "@id": `${SITE}/#org` },
    publisher: { "@type": "Organization", name: "GetNetStats", "@id": `${SITE}/#org` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <SiteHeader />
      <main id="top">
        <section className="page" aria-labelledby="pj-h">
          <div className="wrap">
            <div className="eyebrow">
              <a className="eyebrow-home" href="/">Home</a> // learn
            </div>
            <h1 id="pj-h">Ping vs jitter: what actually matters for gaming &amp; video calls</h1>
            <p className="page-sub">
              Two numbers that decide whether your connection feels smooth — and why speed alone
              doesn&apos;t.
            </p>
            <p className="updated">Last reviewed: June 22, 2026</p>

            <div className="prose">
              <h2>Speed isn&apos;t the whole story</h2>
              <p>
                People obsess over <a href="/what-is-a-good-internet-speed/">download speed</a>, but
                for gaming and video calls, two other numbers
                matter more: <strong>ping</strong> and <strong>jitter</strong>. You can have blazing
                download speeds and still have a laggy game or a choppy call — because responsiveness
                isn&apos;t about how much data you can move, it&apos;s about how quickly and
                consistently it travels.
              </p>

              <h2>What is ping (latency)?</h2>
              <p>
                Ping — also called latency — is the time it takes for a small piece of data to travel
                from your device to a server and back, measured in milliseconds (ms). Lower is better.
                It&apos;s the delay between you doing something and the server registering it.
              </p>
              <ul>
                <li>
                  <b>Under ~20 ms:</b> excellent — feels instant.
                </li>
                <li>
                  <b>20–50 ms:</b> good for almost everything, including competitive gaming.
                </li>
                <li>
                  <b>50–100 ms:</b> fine for browsing, streaming, and casual play; you may notice
                  slight lag in fast games.
                </li>
                <li>
                  <b>Over ~100 ms:</b> noticeable delay in games and calls.
                </li>
              </ul>
              <p>
                High ping is what makes a game feel like your actions happen a beat late, or a video
                call feel like you and the other person keep talking over each other.
              </p>

              <h2>What is jitter?</h2>
              <p>
                Jitter is the variation in your ping over time — how consistent that delay is. If your
                pings come back at 20 ms, then 60 ms, then 25 ms, then 80 ms, your jitter is high even
                if the average looks okay. Lower jitter means a more predictable, stable connection.
              </p>
              <p>
                Here&apos;s the key insight: ping tells you the average delay; jitter tells you how
                reliable that delay is. You can have a low average ping but high jitter — and high
                jitter is often what actually ruins the experience.
              </p>

              <h2>Why jitter wrecks calls and games more than you&apos;d expect</h2>
              <p>
                Real-time applications depend on data arriving in a steady rhythm. When jitter is
                high, packets arrive bunched up or out of order, and the app has to scramble to keep
                up. That&apos;s what causes:
              </p>
              <ul>
                <li>
                  <b>Video calls:</b> audio that cuts out, robotic voices, freezing video, people
                  talking over each other.
                </li>
                <li>
                  <b>Gaming:</b> rubber-banding (your character teleporting or snapping back), delayed
                  hit registration, sudden lag spikes in an otherwise &quot;fast&quot; connection.
                </li>
              </ul>
              <p>
                A connection with low average ping but high jitter can feel worse than one with
                slightly higher but rock-steady ping.
              </p>

              <h2>What&apos;s a good jitter number?</h2>
              <ul>
                <li>
                  <b>Under ~5 ms:</b> excellent — very stable.
                </li>
                <li>
                  <b>5–20 ms:</b> generally fine for most uses.
                </li>
                <li>
                  <b>Over ~30 ms:</b> likely to cause noticeable problems in calls and competitive
                  games.
                </li>
              </ul>

              <h2>How to improve both</h2>
              <ol>
                <li>
                  <b>Use a <a href="/wifi-vs-ethernet/">wired Ethernet connection</a>.</b> This is the
                  single biggest fix — <a href="/why-is-my-wifi-slow/">Wi-Fi</a> adds latency and
                  jitter through interference and distance.
                </li>
                <li>
                  <b>Reduce network congestion.</b> Background downloads, updates, and other heavy
                  users on your network spike both ping and jitter. Pause them while gaming or calling.
                </li>
                <li>
                  <b>Get closer to your router</b> (if you must use Wi-Fi) and use the 5 GHz band when
                  in range.
                </li>
                <li>
                  <b>Restart your router</b> to clear transient issues.
                </li>
                <li>
                  <b>Pick a closer server</b> where the app allows it (many games let you choose a
                  region) — physical distance adds unavoidable ping.
                </li>
              </ol>

              <h2>The honest caveat</h2>
              <p>
                Ping and jitter, like all browser-based measurements, are snapshots that vary moment
                to moment with your network conditions and the server you&apos;re testing against. Run
                a test a few times to see your typical range rather than trusting a single number.
              </p>

              <h2>Check yours</h2>
              <p>
                You can measure your real ping and jitter{" "}
                <a href="/ping-test/">right here</a> — GetNetStats runs a live latency test in your
                browser, nothing stored, no sign-up.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
