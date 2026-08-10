# GetNetStats — Project Context Handoff

> **Purpose:** Non-coding context for the GetNetStats project — what it is, decisions, accounts, deployment & monetization status, product/positioning strategy, the outreach campaign, the AdSense remediation, working preferences, open items, and hard-won gotchas. Upload this to a **Claude Chat** so that conversation holds the project narrative, while the **Claude Code** session keeps the actual codebase. **No source code is in here** — code lives in the git repo at `E:\GetNetStats`.
>
> If you're the Claude reading this: treat it as authoritative project state as of the last update. **Ask before acting on anything that touches accounts, DNS, money, or live deployments.**

**Last updated:** 2026-06-23 (launch-day window — full content library shipped) · **Branch:** `main`

---

## 0. What changed most recently (read first)

- **Content library is now deep: 12 guides live.** Since the last refresh, five more guides shipped — **What Is a DNS Record?** (`/what-is-a-dns-record`), **What Is an ASN?** (`/what-is-an-asn`), **What Is a Good Internet Speed?** (`/what-is-a-good-internet-speed`), **What Is an ISP?** (`/what-is-an-isp`), and **Wi-Fi vs Ethernet** (`/wifi-vs-ethernet`). The first two were fetch-verified live; the last three are confirmed-deployed by Adam (not yet independently fetch-verified — a homepage fetch returned a stale cache, and the new URLs weren't yet fetchable). Total content guides: **12.**
- **Site is now substantial: ~22 pages.** Homepage + 4 test-tool pages + 2 new tools (DNS Checker, ASN & Routing) + 12 guides + 3 legal. Four clean **guide↔tool loops** (IP, DNS, ASN, speed/ping) for engagement + SEO.
- **AdSense: remediation COMPLETE; re-request status UNCONFIRMED.** The "low value content" fix is thoroughly done (§17). Adam was advised he's good to resubmit; **confirm whether he actually clicked "Request review" in the dashboard** — if not, that's still the pending action. Expect days–2 weeks; approval not guaranteed but the fix is genuine. NordVPN affiliate carries monetization meanwhile.
- **Product Hunt launch — 6/23.** Scheduled for **12:01 AM PT (= 2:01 AM CDT) Tue 6/23**, global/US; likely auto-launched / live around now. Maker profile, listing, 5 gallery + radar logo, 3 shoutouts (Next.js/Cloudflare/GitHub), maker first comment, teaser page all done. Follow the launch-day runbook (§16): engage, reply to every comment, never ask for upvotes.
- **WHOIS is the only remaining "Soon" tool** — deferred to the Tier-2 serverless buildout (needs a backend; deliberate infra decision, explicit go-ahead required).
- **Repo: `E:\GetNetStats`** (old C: path dead; D: stale). Reddit account in ~2-week warm-up (neutral username, no links). Quora not yet created.
- **Dead tasks — do NOT act on:** FREE badges on Soon cards; separate "always free" line above the tools grid.
- **Suggested next move = PAUSE new content.** The site is well past the AdSense bar; with the PH launch live and the review running, more guides have diminishing returns until those play out. Let launch traffic + the review verdict inform the next step.

---

## 1. What GetNetStats is

A consumer web tool at **getnetstats.com**: instantly shows a visitor's **public IP, ISP, and location**, then runs a **real in-browser speed test** (download, upload, ping/jitter, connection type, and a derived "Wi-Fi Signal" score). Centerpiece is an animated **radar "scan-to-reveal."** Now a genuine **multi-tool + content hub**: standalone tool pages, a 12-guide plain-English library, and an SEO content layer. Revenue = **display ads (AdSense, in re-review) + affiliate (NordVPN/NordPass, live)**.

**Honesty constraints (LOAD-BEARING — never violate):**
- Browsers can't read real Wi-Fi radio signal — the "Wi-Fi Signal" meter is a derived score from latency + throughput, never a hardware reading.
- Nothing is stored; no sign-up.
- IP geolocation is an **estimate**; the ASN connection-type label is a **best-effort classification**, not a certainty. The site says so.
- These promises are stated on the site and **must stay true.** Honesty is the brand's moat (§8).

---

## 2. Stack & architecture

- **Next.js 15 (App Router) + React 19 + TypeScript.** Static export (`output: "export"`) → GitHub Pages. Single global stylesheet (`app/globals.css`); fonts self-hosted via `next/font` (Geist + Spline Sans Mono).
- **Tier 1 = client-side** (tools, content, SEO, ads) → branch **`main`** (what Pages serves). All shipped tools are Tier 1.
- **Tier 2 = serverless** (`/api/*`) → parked on branch **`tier2-prep`**, NOT deployed. **WHOIS needs this** (no port-43 in browsers; RDAP omits CORS). Tier-2 buildout (`api.getnetstats.com` on Vercel/Workers) is a deliberate later project requiring explicit go-ahead.

**Repo — `E:\GetNetStats`** (current). History: `C:\…\Downloads\GetNetStats` (dead) → `D:\GetNetStats` (stale) → **`E:\GetNetStats`**. **No git remote pushed yet** — local-only; backup push is open.

> ⚠️ **Memory caveat:** Claude Code's auto-memory is path-keyed — a session in `E:\GetNetStats` starts fresh. **This handoff is the bridge.** Open Code in `E:\GetNetStats`; have it read this file first.

**Pages in the codebase (all live unless noted):**
- Tools: `/` (IP + speed), `/ping-test`, `/download-test`, `/upload-test`, `/connection-test`, `/dns-checker`, `/asn-routing`
- Guides (12): `/vpn-guide`, `/what-is-an-ip-address`, `/ipv4-vs-ipv6`, `/find-your-ip-address`, `/hide-your-ip-address`, `/why-is-my-wifi-slow`, `/ping-vs-jitter`, `/what-is-a-dns-record`, `/what-is-an-asn`, `/what-is-a-good-internet-speed`, `/what-is-an-isp`, `/wifi-vs-ethernet`
- Legal: `/privacy`, `/terms`, `/about` · plus `robots.txt`, `sitemap.xml`, `ads.txt`, `og.png`

---

## 3. Deployment status — LIVE & CURRENT

- **Host:** GitHub Pages, **manual static upload**: build locally → upload the **contents of `out/`** (files incl. hidden `.nojekyll`, not the folder) to repo root of `adamcazz44.github.io`. No GitHub Actions. `out/` gitignored.
- **GitHub:** `adamcazz44` / `adamcazz44.github.io` (public). Source = Deploy from a branch → `/ (root)`. Custom domain `getnetstats.com` (apex), HTTPS enforced.
- **DNS (GoDaddy):** apex A `185.199.108-111.153`; AAAA `2606:50c0:8000-8003::153`; `www` CNAME → `adamcazz44.github.io`; **plus** MX + SPF/TXT for ImprovMX email. No CAA. Not Cloudflare-proxied.
- **Required in `out/`:** `.nojekyll` + `CNAME` (from `public/`).

> ✅ Live site is current through the 3-guide batch. New commits aren't live until `out/` is rebuilt + re-uploaded. **Verification note:** web-fetch caches the homepage aggressively — a stale homepage can show old "Soon" cards/anchor footers for a while after a deploy; confirm via a fresh tool/guide URL or a click, not the cached homepage.

---

## 4. SEO status — strong & growing

Per-page metadata (title/description/keywords/canonical-with-trailing-slash/OG/Twitter), JSON-LD (home `@graph`; tool pages = WebApplication + BreadcrumbList; guides = Article + BreadcrumbList), real `public/og.png`, `robots.ts`, `sitemap.ts` (includes all tools + all 12 guides). Heavy internal cross-linking (guide↔tool loops). Social cards validated on FB + LinkedIn.

---

## 5. Monetization & accounts status

### Google AdSense — VERIFIED; was REJECTED "low value content"; **remediation DONE → re-request (confirm if submitted)**
- **Publisher id:** `ca-pub-2462592874316838` (`.env.production` → `NEXT_PUBLIC_ADSENSE_CLIENT`). **ads.txt:** `google.com, pub-2462592874316838, DIRECT, f08c47fec0942fa0`.
- Fix complete and live (§17). **Action: confirm Adam clicked "Request review"; if not, do it.** Re-reviews take days–2 weeks; if re-flagged, add a guide or two — don't panic.
- **After approval:** create a 300×600 display ad unit → slot id → set `NEXT_PUBLIC_ADSENSE_HALFPAGE_SLOT` → rebuild → re-upload. **Keep Auto ads OFF.** Consent CMP: Google's, 3-choice.

### NordVPN / NordPass affiliate — APPROVED & LIVE
- **Affiliate id `150104`.** NordVPN: `https://go.nordvpn.net/aff_c?offer_id=15&aff_id=150104&url_id=902` · NordPass: `https://go.nordpass.io/aff_c?offer_id=488&aff_id=150104&url_id=9356`. Payout via PayPal email (Adam enters on Nord's side — *still open*).
- 300×250 rail rotates NordVPN ⇄ NordPass.
- **Inline NordVPN CTAs (intentional, disclosed, `rel="sponsored"`):** hero, homepage hide-IP summary, one FAQ answer, `/vpn-guide`, `/hide-your-ip-address`. **Decision: keep these; NO CTAs on any other guide/tool pages** (the 2 tools + the 7 non-hide-IP guides intentionally have none). The ISP guide mentions VPNs *explanatorily* (links to the hide-IP guide), not as a CTA. Keep affiliate density flat during AdSense review.

### Contact email — LIVE
- **`hello@getnetstats.com`** → forwards to **`getnetstats@gmail.com`** via **ImprovMX free tier** (MX + SPF/TXT at GoDaddy, additive). Free tier = receive only; to reply *as* `hello@`, add "Send mail as" in Gmail (free).

---

## 6. Live tools & guides

### Tools (Tier 1, client-side, nothing stored)
- **Home `/`** — IP/ISP/location lookup + speed test (download/upload/ping/jitter) + derived Wi-Fi Signal + radar.
- **`/ping-test`, `/download-test`, `/upload-test`, `/connection-test`** — per-metric tools.
- **`/dns-checker`** — A/AAAA/MX/TXT/NS/CNAME via DNS-over-HTTPS (Cloudflare→Google fallback); "enter any domain" affordance (label, microcopy, clear ✕, `google.com`/`github.com` chips); explainer + honest public-resolver/propagation note.
- **`/asn-routing`** — ASN, AS org, connection-type estimate, ISP/operator, location, reverse-DNS PTR for any IP (own IP prefilled; `8.8.8.8`/`1.1.1.1` chips); routing data from `ipwho.is`→`ipapi.co`, PTR via DoH; honest "classification not proof / location is an estimate" framing.

### Guides (12, each unique SEO + Article/BreadcrumbList JSON-LD, cross-linked)
VPN & Privacy · What is an IP Address? · IPv4 vs IPv6 · Find Your IP on Any Device · How to Hide Your IP · Why Is My Wi-Fi Slow? · Ping vs Jitter · What Is a DNS Record? (→ DNS Checker) · What Is an ASN? (→ ASN & Routing) · What Is a Good Internet Speed? (→ speed test) · What Is an ISP? (→ IP/ASN tools) · Wi-Fi vs Ethernet (→ speed test, ping/Wi-Fi guides).

---

## 7. Roadmap tools

- **WHOIS Lookup** — last "Soon" card. **Needs Tier 2 serverless** (`/api/whois` drafted on `tier2-prep`). Deferred to a deliberate Tier-2 buildout (Vercel/Workers free tiers, ~$0 until popular) — money/accounts decision, explicit go-ahead required.
- Later Tier-1 ideas: DNS-leak, WebRTC-leak.

---

## 8. Product & positioning strategy (the moat)

Competitor complaints (Ookla/Speedtest: ad overload, data-selling, 40-min privacy policy, accuracy/ISP-bias, premium gates; WhatIsMyIP: clutter/freemium; SpeedPings: pure keyword-stuffed SEO, no privacy angle) → GetNetStats = honest, privacy-first, no-freemium antidote.

**Two HARD copy guardrails:** (1) Position on "no tracking / nothing stored," **NEVER "no ads"** (ads coming; "ad-free" self-destructs + risks standing). (2) **Do NOT compete on accuracy** — browser/IP imprecision is inherent; win on honesty, privacy, clean UX; radical transparency is the differentiator.

**Canonical tagline (every surface):** "Check your connection, keep your privacy." Others: "They track you to tell you your own IP. We don't." · "No app. No sign-up. Nothing stored. Just answers."

---

## 9. YouTube — see `GetNetStats-YouTube-Kit.md`

Explainers embedded on `/vpn-guide` (privacy-friendly `youtube-nocookie.com` lazy embeds + VideoObject JSON-LD). **First video live:** "What is a VPN?" (`QdKTM3l3YF0`). Canonical tagline + About finalized in the Kit. Open: confirm exact `@handle` (placeholder `@getnetstats`); embed "What is an IP" on the homepage Education section when that video is up.

---

## 10. Working preferences

- **Phased delivery with check-ins** — propose, confirm, proceed; one thing at a time.
- Recreate designs faithfully; honor a11y/honesty (reduced-motion, tabular figures, tokens, derived signal).
- **Ask before** accounts/DNS/money/live-deploy actions.
- **Split workflow:** Claude Chat = strategy/planning/copy/research + paste-ready instruction blocks; Claude Code = repo/edits/builds/commits. Adam pastes blocks between them.
- Adam is newer to web building and can find the breadth overwhelming — keep it calm, decisive, reassuring on normal speed bumps. Flag guardrail/factual issues proactively (e.g., the WHOIS-vs-ASN difficulty mix-up — caught and corrected).
- Watch out for **stale-cache false alarms** on verification (see §3) — don't tell Adam a deploy failed off a cached homepage.

---

## 11. The reusable skill — "Tool Site Builder"

Claude Code skill `tool-site-builder` at `C:\Users\Adam Abshire\.claude\skills\tool-site-builder\` (path on C:, unaffected by the project on E:). `SKILL.md` + `references/01-08` + `assets/`. Purpose: repeat the pipeline for 10+ future sites; GetNetStats is the reference implementation.

---

## 12. Open action items

**User-side:**
- **Confirm / complete the AdSense re-request** in the dashboard (remediation done — §17). Then wait.
- **PH launch 6/23** — engage per runbook (§16): reply to all comments, send 1:1 messages (no "upvote"), post to owned social, screenshot final rank.
- **Reddit warm-up** continues (~2 wks, no links/mentions). **Create Quora** (usable immediately).
- **Google Alert** for `getnetstats` / `getnetstats.com`; weekly `getnetstats site:reddit.com`.
- **Push repo to a GitHub remote** for backup (still local-only).
- Enter **PayPal email** on Nord's side. Confirm YouTube `@handle`. (Optional) test-email `hello@`.
- ✅ *Done:* shipped DNS Checker + ASN & Routing tools; shipped 5 more guides (DNS record, ASN, good speed, ISP, Wi-Fi vs Ethernet) → 12-guide library.

**Assistant/Code-side:**
- **Suggested: pause new content** — past the AdSense bar; let launch + review play out before the next push.
- If more content later: tool-paired or broad-search guides remain options (e.g., "Is a VPN worth it?", "What is a router vs modem?").
- WHOIS via Tier-2 — when greenlit.
- Expand Phase 2 Reddit/Quora talking points into ready-to-post answers.
- Wire AdSense slot id when approval lands.
- *Dead tasks:* FREE badges; separate always-free line.

---

## 13. Gotchas & lessons

- **Open Code sessions in `E:\GetNetStats`** — old C: dead; D: stale.
- **Nothing is live until `out/` is rebuilt + re-uploaded.** Don't judge state off a green Code session.
- **Web-fetch caches the homepage** — a freshly-deployed change may show stale (old Soon cards / anchor footer) for minutes; verify via a fresh tool/guide URL or a click. (Pasting a specific new URL unlocks fetch-verification of it.)
- **Never `next build` while `next dev`/preview is live** (shared `.next`); use `npx tsc --noEmit` alongside dev.
- **`.nojekyll` is critical** (hidden dotfile — let it upload); upload the **contents** of `out/`, not the folder.
- **New tools lean on public resolvers/APIs** (Cloudflare/Google DoH, `ipwho.is`/`ipapi.co`) — occasional 403/503 under test load; fallback paths handle it; re-test clean.
- **PH gallery uses demo mode** (`?demo` → 98.142.6.71 / Comcast / Denver) — never Adam's real Keller TX data.
- **HTTPS cert "unavailable"** = timing; re-add domain to retrigger. **FB OG cache** sticky for recycled domains; `?v=N` then re-scrape.
- **Windows PowerShell + git:** double quotes in inline `-m` break parsing — single quotes or `git commit -F <file>`.
- **Email DNS:** only ADD MX + SPF/TXT — never edit A/AAAA/CNAME.
- **Gmail connector** lacks read permission. **No Python/`claude` CLI** locally.

---

## 14. Git state (all local, nothing pushed)

Branches `main` (live) + `tier2-prep` (serverless prep), on `E:\GetNetStats`. Recent work (this and prior sessions): two tool pages (`/dns-checker`, `/asn-routing`), five guides (DNS record, ASN, good internet speed, ISP, Wi-Fi vs Ethernet), the two Phase B guides (Wi-Fi slow, ping vs jitter), the cross-link fix, the earlier 4 guides + FAQ + expanded vpn-guide. Earlier guide hashes Code noted: `78480bd` (what-is-an-ip), `7ebaaca` (ipv4-vs-ipv6), `eb382ed` (hide-your-ip). **Confirm exact latest hashes in Code** — this doc doesn't fabricate them. (`.claude/settings.local.json` is machine-local — gitignore before any public push.)

---

## 15. Key references

| Thing | Value |
|---|---|
| Live site | https://getnetstats.com (current) |
| Repo (local) | **`E:\GetNetStats`** (old C: dead; D: stale) |
| GitHub | `adamcazz44` / `adamcazz44.github.io` (public, Deploy-from-branch `/root`) |
| AdSense | `ca-pub-2462592874316838` — remediation done; **confirm re-request submitted** |
| Affiliate | `150104` (NordVPN + NordPass, live) |
| Contact email | `hello@getnetstats.com` → `getnetstats@gmail.com` (ImprovMX free, live) |
| DNS host | GoDaddy |
| Product Hunt | Launch **Tue 6/23, 12:01 AM PT**; maker `adam_abshire`; teaser live |
| Reddit | Account created, ~2-week warm-up (neutral username, no links) |
| Live tools (7 pages) | Home (IP+speed), Ping, Download, Upload, Connection, DNS Checker, ASN & Routing |
| Live guides (12) | VPN, What-is-an-IP, IPv4-vs-IPv6, Find-Your-IP, Hide-Your-IP, Why-Wi-Fi-Slow, Ping-vs-Jitter, What-is-a-DNS-record, What-is-an-ASN, Good-internet-speed, What-is-an-ISP, Wi-Fi-vs-Ethernet |
| YouTube | First video "What is a VPN?" `QdKTM3l3YF0`; `@handle` TBD |
| Canonical tagline | "Check your connection, keep your privacy" |
| Companion docs | `GetNetStats-chat-instructions.md`, `GetNetStats-YouTube-Kit.md` (gitignored) |

---

## 16. Outreach campaign (condensed)

**Architecture:** Foundation (directory blitz) → Spike (Product Hunt) → Burn (Reddit/Quora, Phase 2) → Amplify (owned social) → Earn (roundup/journalist outreach). Audience = strangers-with-a-problem; Adam's non-tech network is only a first-hour spark.

**Directories (no warm-up):** AlternativeTo ⭐, SaaSHub, PH, StackShare, Slant, Indie Hackers. Excluded: Capterra/G2/GetApp/Crunchbase + paid bulk-submit bots. Copy in chat history; one-liner = canonical tagline.

**Product Hunt (6/23):** narrative-led; win = backlink + traffic spike + social proof, not #1. **Never ask for upvotes.** **Runbook (CT):** 2:01 AM auto-launch → ~6:30 AM confirm + reply to all comments + 1:1 messages → 9 AM–1 PM peak (reply fast, welcome critical feedback) → afternoon owned-social posts → evening thank late commenters → screenshot final rank. **Amplify:** X (link in first reply), LinkedIn (maker story, link in comment), Facebook, Instagram (Story), Telegram (genuine groups), YouTube (community post).

**Post-launch / organic:** Google Alert + weekly Reddit search. If someone else posts it → engage as maker (safe; no brigading, no affiliate links).

**Phase 2 — Reddit/Quora (real growth engine; NOT tied to 6/23):** community-first (90/10). Reddit warming (~2 wks, no links). **Hard rules:** always disclose "I built this"; **never** drop the NordVPN affiliate link on Reddit (instant ban) — Reddit = free tool only; honesty guardrails travel. Target subs: r/HomeNetworking, r/techsupport, r/24hoursupport, r/HomeServer, r/selfhosted, r/InternetIsBeautiful, r/SideProject, r/webdev (read rules first). Quora needs no warm-up. Ready-to-post answers = next to expand.

---

## 17. AdSense remediation — "Low value content" fix (COMPLETE)

**Diagnosis:** tool-first site, too few unique substantive pages; fake footer "Guides" (homepage anchors); thin `/vpn-guide` stub with an affiliate link; templated test pages → read as thin.

**The fix (all LIVE):**
- Expanded `/vpn-guide`; built **12 standalone content guides** (unique SEO + Article/BreadcrumbList JSON-LD, original ~500–720-word content, cross-linked).
- Repointed footer "Guides" to real pages; added "Why do speed tests disagree?" FAQ; trimmed homepage topic sections to summaries + read-more; fixed in-body cross-links.
- **Shipped 2 functional tools** (DNS Checker, ASN & Routing) — removed 2 of 3 "Soon" cards.

**Result:** ~22 real pages — a genuine, content-rich, functional site. **Next: confirm the review re-request is submitted.** Guardrails honored throughout (original content only — no keyword-stuffing; no "ad-free"/accuracy claims; affiliate CTAs only in hide-IP/VPN contexts with disclosure + `rel="sponsored"`). If re-flagged, add more guides — re-reviews can be slow; don't panic.
