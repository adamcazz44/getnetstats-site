# GetNetStats — MASTER Project Context Handoff

> **What this file is:** the single consolidated "save file" for the GetNetStats project — every non-coding decision, account, deployment/monetization state, the positioning strategy, the full outreach campaign, the Tier 2 plan, working preferences, open items, and hard-won gotchas. It merges every prior handoff iteration into one authoritative document. **No source code is in here** — code lives in the git repo (path below).
>
> **How to use it (two-session model):** This doc rides in the **Claude Chat** session (strategy / copy / planning). The **Claude Code** session owns the repo, builds, and git. When something changes, this file gets regenerated so the two sessions don't drift. Treat it as authoritative project state — but **ask before acting on anything that touches accounts, DNS, money, or live deploys.**

**Last consolidated:** 2026-06-23 (master merge of all prior handoffs + current chat/memory state)
**Branch:** `main` · **Latest known commit:** `fea8912` (confirm exact head in Code — see §14)

---

## ⚠️ Two things Chat can't verify — confirm these first

1. **Today is the Product Hunt launch day (Tue 6/23).** The launch was *scheduled* for 12:01 AM PT / 2:01 AM CT. Chat has no view of the live site, PH dashboard, or analytics, so it does **not** know how the launch is actually going. Paste results (rank, comments, referral traffic) and they'll be folded into the next handoff.
2. **Repo drive letter.** The older handoff docs say the repo is at `D:\GetNetStats`; the most recent context says it was moved again to **`E:\GetNetStats`**. This doc treats **`E:\GetNetStats` as current** but flags it — **confirm the real path in the Code session** before relying on it. (History: `C:\Users\Adam Abshire\Downloads\GetNetStats` → `D:\GetNetStats` → `E:\GetNetStats`.)

---

## 0. Current snapshot (read this first)

- **LIVE & CURRENT.** The big batch (privacy-forward H1, hero polish, four per-card test pages, trust strip, radar caption, toolkit changes) was deployed to GitHub Pages and verified live. The old "BIG UNDEPLOYED BATCH" warning is resolved.
- **One pending UI change:** a new FAQ item — **"Why do speed tests disagree?"** — was drafted, and a Claude Code task was written to add it. **Not yet confirmed deployed.** Verify whether it's live; if not, it's the next upload.
- **Contact email LIVE.** `hello@getnetstats.com` forwards to the dedicated inbox `getnetstats@gmail.com` via **ImprovMX free tier** (MX + SPF/TXT added at GoDaddy, additive — site A/AAAA/CNAME untouched).
- **AdSense:** verified, **review still pending** — ads are NOT serving (placeholder boxes are expected). Launch traffic monetizes via the **NordVPN affiliate only** for now.
- **Tagline locked everywhere:** **"Check your connection, keep your privacy"** ("keep" in cyan on the live site).
- **Outreach campaign built (Phase 1):** directory blitz, Product Hunt kit (launch locked 6/23), 6 gallery assets, launch-day runbook, 6-channel amplify plan, paste-ready templates, Phase 2 (Reddit/Quora) framework.
- **Top next actions:** (1) confirm the FAQ item is live; (2) run the 6/23 launch-day runbook; (3) confirm/activate the YouTube `@handle`; (4) start Quora now + Reddit warm-up (~2 weeks); (5) push the repo to a GitHub remote for backup.

---

## 1. What GetNetStats is

A consumer web tool at **getnetstats.com**: instantly shows a visitor's **public IP, ISP, and location**, then runs a **real in-browser speed test** (download, upload, ping/jitter, connection type, and a derived "Wi-Fi Signal" connection-quality score). Centerpiece is an animated **radar "scan-to-reveal."** The homepage doubles as an SEO **content hub** (How It Works, the toolkit grid, Education, FAQ) and carries **display ads + affiliate** as the revenue model. Built by faithfully recreating a provided design handoff (HTML/CSS + React-via-Babel prototype) — not by shipping the prototype.

**Why it exists:** it's the first site in Adam's intended **portfolio of small, monetized tool sites**. The whole pipeline is captured in a reusable skill (§11) so future sites go faster. GetNetStats is the canonical reference build.

**Honesty constraints (LOAD-BEARING — never violate):**
- Browsers can't read real Wi-Fi radio signal — the "Wi-Fi Signal" meter is an honest **derived** score from latency + throughput, never a hardware reading.
- Nothing is stored; no sign-up.
- These promises are stated on the site and **must stay true.** Honesty is the brand's moat (see §8).

---

## 2. Stack & architecture

- **Next.js 15 (App Router) + React 19 + TypeScript.**
- **Static export** (`output: "export"`) → ships as static files to **GitHub Pages**.
- Single **global stylesheet** (`app/globals.css`) preserving the prototype's exact design tokens; **fonts self-hosted** via `next/font` (Geist + Spline Sans Mono).
- **Tier 1 = client-side** (the tools, content, SEO, ads) → branch **`main`**, which GitHub Pages serves.
- **Tier 2 = serverless** (`/api/*`, e.g. a WHOIS API + reusable `lib/api/*`) → parked on branch **`tier2-prep`**. GitHub Pages **cannot** run serverless, so Tier 2 is NOT deployed; it waits for a serverless host (Vercel / Cloudflare Workers). Full Tier 2 plan in §17.

**Repo location — `E:\GetNetStats`** (external 5 TB "Elements" drive; *confirm letter in Code — see top flag*). This drive is the **home for this and all future projects** (each future project = its own folder). Repo includes `.git` history + both branches; `npm ci` + `npm run build` verified working. Old `C:\…\Downloads\GetNetStats` and `D:\GetNetStats` copies are stale. **No git remote pushed yet** — all commits are local-only; pushing for backup is an open to-do.

> ⚠️ **Memory caveat:** Claude Code's auto-memory is keyed by folder path, so opening a session in a new path starts a **fresh memory namespace**. **This handoff doc is the reliable bridge.** Always open Code sessions in the current repo folder so the preview tool serves the right copy.

**Pages in the codebase:** `/` (hero IP + speed tool + toolkit + How-It-Works + Education + FAQ), `/ping-test`, `/download-test`, `/upload-test`, `/connection-test`, `/vpn-guide`, `/privacy`, `/terms`, `/about`. Plus `robots.txt`, `sitemap.xml`, `ads.txt`, `og.png`.

---

## 3. Deployment status — LIVE & CURRENT

- **Host:** GitHub Pages, **manual static upload** model: build locally → upload the **contents of `out/`** to the repo root. **No GitHub Actions** (deliberately removed). `out/` is gitignored — never committed, only uploaded.
- **GitHub user:** `adamcazz44` → repo `adamcazz44.github.io` (must be **public** for free-tier Pages).
- **Pages setting:** Source = *Deploy from a branch* → `/ (root)`.
- **Custom domain:** `getnetstats.com` (apex). **HTTPS enforced.**
- **DNS (GoDaddy):** apex `@` → A `185.199.108-111.153`; apex `@` → AAAA `2606:50c0:8000-8003::153`; `www` → CNAME → `adamcazz44.github.io`. Plus MX + SPF/TXT for ImprovMX email forwarding (§5). No CAA. Not Cloudflare-proxied.
- **Required files in `out/`:** `.nojekyll` (stops Jekyll stripping `_next/` — the #1 deploy gotcha) and `CNAME` (= getnetstats.com). Both come from `public/` automatically on build.

> **The manual model never changes:** any new commit is NOT live until `out/` is rebuilt (`npm run build`) and its **contents** are re-uploaded to the repo root. Multiple work batches can stack as committed-but-not-deployed until one clean rebuild + upload.
>
> 🔎 **Still worth a manual eyeball:** the `/upload-test` and `/connection-test` layouts haven't been visually screenshotted on a real browser — confirm they look right now that they're live.

---

## 4. SEO status — complete

Per-page metadata (title/description/keywords/canonical-with-trailing-slash/OG/Twitter), JSON-LD (home `@graph`: Organization, WebSite, WebApplication, BreadcrumbList, FAQPage; each tool page: WebApplication + BreadcrumbList), a branded **1200×630 `public/og.png`** (a real PNG, NOT a generated route — generated routes break on static hosts), `robots.ts`, `sitemap.ts` (lists all four test pages at priority 0.8).

**Social cards validated on Facebook + LinkedIn.** Notes: FB initially showed a stale "2014" cache (recycled domain) — fixed via `?v=N` cache-bust then re-scrape. FB "Response Code 206" / "missing fb:app_id" warnings are **benign**. X Card Validator was retired (~2022); validate via the post composer.

---

## 5. Monetization & accounts status

### Google AdSense — VERIFIED, REVIEW PENDING
- **Publisher id:** `ca-pub-2462592874316838` (public; baked in via `NEXT_PUBLIC_ADSENSE_CLIENT` in `.env.production`).
- Site **verified** (AdSense head script + `google-adsense-account` meta + `ads.txt` all live).
- **ads.txt:** `google.com, pub-2462592874316838, DIRECT, f08c47fec0942fa0`.
- **Review requested → awaiting Google approval.** Ads won't serve until approved; the live page shows placeholder ad boxes (300×600 right rail, 300×250) — expected.
- **Consent CMP:** Google's CMP, 3-choice (Consent / Do not consent / Manage options) — required for EEA/UK/CH.
- **After approval (open to-do):** create a **300×600 display ad unit**, get its **slot id**, set `NEXT_PUBLIC_ADSENSE_HALFPAGE_SLOT`, rebuild, re-upload → ads serve in the right-rail slot. **Keep Auto ads OFF** so Google fills only that slot. (Ad-creep is what tanked competitors — §8.)

### NordVPN / NordPass affiliate — APPROVED & LIVE (in build)
- **Affiliate id:** `150104`.
- **Tracking links:**
  - NordVPN: `https://go.nordvpn.net/aff_c?offer_id=15&aff_id=150104&url_id=902`
  - NordPass: `https://go.nordpass.io/aff_c?offer_id=488&aff_id=150104&url_id=9356`
- **Payout:** PayPal — the "address" is simply the **primary email** on the PayPal account (Adam enters it on Nord's side; the assistant won't handle payment details). *Open: enter PayPal email on Nord's affiliate side.*
- **300×250 rail slot:** rotates **NordVPN ⇄ NordPass** as **on-brand CTA cards** (Adam disliked Nord's official banner art). ~12s rotation, random first pick, pauses on hidden tab, static under reduced-motion. Card fills the full box (Sponsored label, headline, full-width gradient CTA).
- **Contextual NordVPN CTAs** at high-intent "hide your IP" moments: hero (below readouts), Education "how to hide your IP" bullet, FAQ answer. Each has an inline "Ad" chip + `rel="sponsored"`. **Deliberately NOT** added to purely-explanatory VPN mentions (avoids spam / protects AdSense standing).
- **NordPass** has no contextual home (site is network-focused) — lives only in the rotating banner. A future passwords/security guide is where a NordPass contextual CTA would go.
- Since AdSense isn't serving yet, **launch/referral traffic monetizes via the NordVPN affiliate only** — which suits the privacy-first positioning anyway.

### Contact email — LIVE
- **Canonical address:** `hello@getnetstats.com` (matches footer + Privacy/Terms/About — no copy change needed).
- **Setup:** forwards to the dedicated inbox **`getnetstats@gmail.com`** via **ImprovMX free tier**. Alias `hello` configured; MX + SPF/TXT added at GoDaddy (additive — site records untouched). ImprovMX shows green/active.
- **ImprovMX login:** `getnetstats@gmail.com`. Free tier = receive/forward only; $9/mo Premium (SMTP send) **not needed yet**.
- **To reply *as* `hello@` later:** add it as a "Send mail as" address in the project Gmail's settings (free) — no migration needed.
- **Recommended:** send a test email to `hello@getnetstats.com` and confirm it lands.

---

## 6. Current live site state — homepage & tools

### Homepage hero (LIVE)
- **H1:** "Check your connection, **keep** your privacy" — only "keep" in cyan (`<em>`, `color: var(--accent-2)`). **This is the campaign spine — keep it consistent everywhere.** (Replaced the old "How fast is your *internet*, really?")
- No `// SCAN COMPLETE` eyebrow (removed); hero top padding trimmed (40px→24px); **headline top-aligns with the Connected pill** (left text column `.hero-col`, `align-self: start`, headline `margin-top` zeroed in the hero only; radar stays vertically centered; test pages keep the global headline margin); no subhead.
- **Trust strip** under the headline: `Nothing stored · No app or sign-up · Runs in your browser · We don't sell your data` (green-dotted). Deliberately **no "No tracking" badge** — would be false once AdSense cookies serve (§8).
- **"Privacy in one sentence →"** link → `/privacy/#privacy-tldr`.
- **Radar transparency caption:** "Honest by design: your IP location is an estimate, and the Wi-Fi Signal above is derived from real latency & throughput — not your router's radio signal."
- **Scan pill** reads **"Re-run ALL"**; per-tool pages keep "Re-run Test".
- Connection pill has a live green **EKG trace**; **Copy** button is in the IP card's top-right; **ISP/location line is amber** (`--warn`).
- Each readout card (Ping/Upload/Connection/Download) has a small **"Test →" pill** linking to its own test page.

### Toolkit section ("Every network check…") (LIVE)
- **Headline (2 lines):** "Every network check in one place and always free." + (cyan, `.sec-accent` = `var(--accent-2)`) "**Wild Right?**". *This headline carries the "always free" anti-freemium message.* A separate "always free" promise line above the grid and green `FREE` badges on the Soon cards were **considered and intentionally dropped as redundant** — see §12 "dead tasks."
- Three **live-tool cards** (IP Lookup, Speed Test, Ping & Jitter) are **non-clickable showcase cards** (links off — IP/Speed pointed at `/` anyway; `/ping-test` still reachable via the hero Ping pill).
- Three **"Soon"** cards: WHOIS Lookup, DNS Checker, **ASN & Routing** (re-scoped from a redundant "What's My ISP" — ASN/operator/residential-vs-hosting-vs-mobile, the one thing the hero & connection-test don't already show).

### FAQ (one item pending)
- New item drafted: **"Why do speed tests disagree?"** — written to reinforce the honesty/positioning angle (browser speed tests vary by server, time, device, network load). A Claude Code task to add it was written. **Confirm whether it's live;** if not, it's the next deploy.

### The four per-card test pages (LIVE)
`/ping-test`, `/download-test`, `/upload-test`, `/connection-test` — all on the **same template** (`HOME // … PROBE` eyebrow link, headline, live readout + grade + status pill + Run/Stop/Re-run, 4 sub-stats, an "Understand the numbers" explainer + note card, per-page SEO + WebApplication/BreadcrumbList JSON-LD). Shared CSS classes reused (`.stage.solo`, `.ping-hero`, `.big`, `.tool-grade`, `.ping-bars`, `.readouts .ro`; added `.conn-big`).
- **`/download-test`** — live download (`measureDownloadLive()`: streams bytes, per-window instantaneous throughput + running avg + peak; existing `measureDownload` untouched). Verified ≈246 Mbps.
- **`/upload-test`** — live upload (`measureUploadLive()`: **sequential 2 MB `fetch` POST chunks**, times each → per-chunk throughput, avg/peak). **Why chunks:** attaching an `xhr.upload` progress listener forces a CORS preflight that Cloudflare's `__up` sink rejects (plain `fetch` POST works but gives no progress). Verified ≈107 Mbps.
- **`/connection-test`** — **not** a live probe (browsers can't re-measure connection type); displays `navigator.connection` (type, effective class, est. downlink, RTT, data-saver) with "Re-detect" + honest "unsupported on Safari/Firefox" note. No time-series bars.

---

## 7. Coming-soon tools — feasibility & cost (all can stay FREE)

The three "Soon" cards are all feasible **free, no sign-up** — and 2 of 3 may not even need Tier 2. Per-query cost ≈ $0; the real constraint is third-party rate-limits/abuse, not money.

| Tool | What it needs | Tier | Cost |
|---|---|---|---|
| **ASN & Routing** | ASN, AS org, residential/hosting/mobile flag, reverse DNS | **Mostly Tier 1** — IP APIs already called (`ipwho.is`/`ipapi.co`) return ASN/org/connection-type free; reverse DNS via free DoH | ≈ $0 |
| **DNS Checker** | A / AAAA / MX / TXT lookups | **Tier 1** — Cloudflare `1.1.1.1` + Google `8.8.8.8` DNS-over-HTTPS are free, public, CORS-enabled → query from the browser | ≈ $0 |
| **WHOIS Lookup** | domain registration / registrar / owner | **Tier 2 (serverless)** — the only one needing a backend (no port-43 WHOIS in browsers; most RDAP omit CORS). `/api/whois` drafted on `tier2-prep` | $0 within serverless free tiers |

- **Insight:** ASN & DNS are client-side Tier 1 (no server). Only WHOIS needs serverless; a WHOIS/RDAP proxy fits free tiers (Cloudflare Workers ~100k req/day; Vercel Hobby) — no cost until the site is genuinely popular, by which point ad revenue dwarfs it.
- **Real constraint = rate-limits/abuse.** Mitigate with caching (WHOIS/DNS answers rarely change), the existing multi-provider fallback, and Cloudflare in front. All free.
- **Keeping them free IS the moat** — the anti-freemium position. The only thing that would break "always free": bolting on a genuinely *paid* API (paid geolocation, threat-intel) — avoid unless it's a clearly separate premium feature.

---

## 8. Product & positioning strategy (the moat)

Competitor-complaint research (Speedtest/Ookla, WhatIsMyIP) anchors the whole campaign. Consistent complaints:

- **Ookla / Speedtest:** ad overload & trick-clicks (reviews call it riddled with adverts; the app slid from 5★ toward 2★ over aggressive monetization); privacy & data-selling (its own disclosure lists location/identifiers/usage data used to track across other apps; a privacy audit ranked it among the *least* privacy-friendly, with a ~40-minute privacy policy); accuracy & suspected ISP-bias; premium paywalls and nags.
- **WhatIsMyIP(Address):** clutter & bloat (a Hacker News thread titled "A less cluttered whatismyip"; newer rivals sell "without the bloat or tracking"); freemium gating.
- **SpeedPings.com:** a pure SEO play with no privacy angle — that lane is open.

**Two HARD guardrails (every copy decision must obey both):**
1. **Position on "no tracking / nothing stored," NEVER "no ads."** AdSense is in review; ads WILL appear. Any "ad-free" claim self-destructs on approval and risks AdSense standing. All trust badges are chosen to **stay true after ads go live** (hence no bare "No tracking" badge — ads use cookies; that nuance is stated honestly in the Privacy "one sentence").
2. **Do NOT compete on accuracy.** Speed-test and IP-geolocation imprecision are inherent to ALL browser/IP tools, GetNetStats included (the same geolocation APIs that produce competitors' "UK shows as India" gripes). "More accurate than Ookla" is unkeepable. **Compete on honesty, privacy, and clean UX** — turn the limitation into the differentiator via **radical transparency** (the radar caption literally tells users the location is an estimate and the signal is derived — which competitors don't).

**On-page expressions:** the hero trust strip, the radar transparency caption, the Privacy "in one sentence" TL;DR (`/privacy/#privacy-tldr` — answers the 40-min-policy gripe and states the cookie/ads nuance honestly), the "every tool free, always" framing in the toolkit headline, and keeping the coming-soon tools free (anti-freemium).

**Campaign taglines on file:** "Check your connection, keep your privacy." (canonical) · "They track you to tell you your own IP. We don't." · "No app. No sign-up. Nothing stored. Just answers."

**Pain → honest hook map:**
| Their pain | Our honest hook |
|---|---|
| Ookla tracks & sells data | Nothing stored. No tracking. Runs in your browser and disappears. |
| 40-min privacy policy | Privacy you can understand in one sentence. |
| Forced signups / app nags | No app, no sign-up, no nagging — just open the page. |
| WhatIsMyIP clutter/bloat | IP, ISP, location *and* a real speed test in one clean scan. |
| Premium feature gates | Every tool is free. No "upgrade to see your results." |

**Growth-engine framing:** Adam's personal network is non-tech — it's a first-hour engagement spark, NOT the primary audience. Real growth comes from **search-intent channels** (SEO, directories, Reddit/Quora, YouTube) that reach strangers *at the moment they have the problem*. Don't over-weight Product Hunt emotionally — it's the spike, not the engine.

---

## 9. YouTube (Education embeds) — see `GetNetStats-YouTube-Kit.md`

A repurposed YouTube channel hosts short explainers embedded on `/vpn-guide` via privacy-friendly lazy embeds (`youtube-nocookie.com`, click-to-load facade) with VideoObject JSON-LD. **First video live:** "What is a VPN?" (id `QdKTM3l3YF0`). Five more planned (What is an IP, Unsecured connection, Secure your data, How to set up a VPN, Restrictive regions) — fill `lib/videos.ts` as IDs arrive, then also embed "What is an IP" in the homepage Education section.

- **Channel tagline** is now **"Check your connection, keep your privacy"** (replaced "Decode your connection"). YouTube has no dedicated tagline field — it lives in the description opener, video intros/outros, and banner copy. The About description was finalized (tagline-led) and is canonical in the kit.
- **Full asset kit** (`GetNetStats-YouTube-Kit.md`): channel description, taglines, keywords, per-video tag sets, and a VPN-video description with the NordVPN affiliate disclosure. Channel avatar/banner (EKG-blip avatar) generated via `next/og`.
- **OPEN ITEM:** confirm the exact YouTube **`@handle`** and replace the placeholder (`@getnetstats` is the assumed handle) across the kit and any on-site links.

---

## 10. Working preferences (how Adam likes to work)

- **Phased delivery with a check-in after each phase** — do NOT generate everything in one shot; Adam reviews between phases and stays in control. (He stopped an early one-shot build and re-issued this.)
- Recreate designs **faithfully**; don't ship the prototype.
- Honor a11y/honesty constraints (reduced-motion incl. JS tweens, tabular figures, exact tokens, the Wi-Fi-signal honesty).
- **Ask before** architecture decisions, new dependencies, or anything touching accounts/DNS/money/live deploys (stop-and-confirm checkpoints).
- **Prefers detailed written plans saved to file** to revisit, rather than immediate action.
- **Values honest assessments** — including when timing isn't right.
- Adam often relays precise, well-scoped task specs (sometimes authored in his Claude Chat) — execute them, but **flag when an instruction would introduce a factual error or break the honesty guardrails** (e.g. the "no-tracking" badge and the "this score" caption mixup were both caught and corrected this way).
- **Split workflow:** Claude Chat = strategy/planning/copy/research + drafting paste-ready instruction blocks; Claude Code = the actual repo/edits/builds/commits. Adam pastes instruction blocks between the two.
- **Context:** Adam is newer to AI / vibe-coding / site-building and finds the whole thing a bit overwhelming; the goal is a **portfolio of sites earning a living**. Keep explanations clear, avoid jargon dumps, and keep this doc usable as a single reliable reference.

---

## 11. The reusable skill — "Tool Site Builder"

The end-to-end pipeline (design handoff → live, monetized static site) is a Claude Code skill **`tool-site-builder`** at `C:\Users\Adam Abshire\.claude\skills\tool-site-builder\` — `SKILL.md` + `references/01-08` (port, static-export, SEO, monetization, legal pages, deploy, AdSense, gotchas) + `assets/` (copy-paste templates). Purpose: repeat this for 10+ future sites efficiently. GetNetStats is its canonical reference implementation. The trigger description was hand-optimized (the auto-optimizer needs Python + the `claude` CLI, not installed locally).

---

## 12. Open action items

**User-side (launch runway → 6/23 and beyond):**
- **Run the 6/23 Product Hunt launch-day runbook** (§16). Golden rule: never ask for upvotes — only "check it out, try it, leave honest feedback."
- **Confirm the new FAQ item ("Why do speed tests disagree?") is live;** deploy it if not (rebuild + re-upload `out/`).
- **Confirm + activate the YouTube `@handle`** and replace placeholders.
- **Start Quora now** (no warm-up); **begin the ~2-week Reddit warm-up** (neutral username, zero links/tool mentions) before any Phase 2 contextual mention.
- **Submit to directories** (AlternativeTo, SaaSHub, etc. — §16 Part A) — no warm-up needed.
- **Set a Google Alert** for `getnetstats` / `getnetstats.com` + weekly manual `getnetstats site:reddit.com` search (Alerts miss Reddit).
- **Push the repo to a GitHub remote** for backup (still local-only): `git remote add origin … && git push -u origin main` (+ `git push origin tier2-prep`).
- **Delete stale repo copies** (`C:\…\Downloads\GetNetStats`, and the old `D:\` copy if the move to `E:\` is confirmed) + old doc copies in Downloads.
- **Enter the PayPal email** on Nord's affiliate side for payouts.
- **Wait for AdSense approval**, then create the 300×600 ad unit and hand over the **slot id**.
- (Optional) send a **test email** to `hello@getnetstats.com`.
- ✅ *Done in prior sessions:* deploy the big batch; stand up `hello@` email; PH gallery assets captured & finalized; PH date set (6/23).

**Assistant / Code-side (future sessions):**
- Wire the AdSense **slot id** when approval lands.
- Deploy the pending FAQ addition.
- Build coming-soon tools when greenlit (ASN & DNS are Tier-1 client-side; WHOIS needs Tier-2 serverless — §7).
- Expand the **Phase 2 talking-point bank** into fully-written example comments + draft **Quora answers** for high-traffic questions (the search-intent engine), and a tighter **Reddit warm-up checklist**.
- Stand up **Tier 2** (`api.getnetstats.com` on Vercel) when the time comes — deferred until current polish is deployed and AdSense is approved (§17).
- More Tier-1 tools later (DNS-leak, WebRTC-leak, etc.).
- ✅ *Done in prior sessions:* PH gallery screenshots; launch-day runbook; amplify plan; message/post templates; Phase 2 framework.

**Dead tasks — do NOT act on (intentionally dropped as redundant):**
- Green `FREE` badges on the "Soon" cards.
- A separate "Every tool's free, and always will be. Wild, right?" line above the tools grid.
- *(The toolkit headline "…always free. **Wild Right?**" already carries this message.)* Any older Code task referencing these is dead.

---

## 13. Gotchas & lessons (so they aren't re-learned)

- **Never run `next build` while `next dev`/preview is live** — they share `.next` and the build clobbers it. Use `npx tsc --noEmit` to typecheck alongside dev.
- **`.nojekyll` is critical** on GitHub Pages — without it `_next/` is stripped and all CSS/JS 404. The web uploader hides dotfiles ("this file is hidden" is normal — let it upload).
- **HTTPS cert "unavailable"** is usually a timing lag — verify DNS, then remove/re-add the custom domain in Pages settings to retrigger; up to ~24h.
- **Facebook OG cache** is sticky for recycled domains — cache-bust with `?v=N` in the Sharing Debugger, then re-scrape the clean URL.
- **`ipwho.is` rate-limits (403)** under heavy testing → app falls back to `ipapi.co`. **Cloudflare's speed endpoint can 503** when hammered — not a site bug; re-test cleanly.
- **Upload speed can't stream progress from one request** — an `xhr.upload` progress listener forces a CORS preflight Cloudflare's `__up` rejects. Use sequential `fetch` POST chunks (`measureUploadLive`).
- **Open Code sessions in the CURRENT repo folder** — a session rooted at an old path served the stale copy and broke the preview/screenshot tool.
- **Windows PowerShell 5.1 + git commit:** embedded double quotes in an inline `-m` message break native-arg parsing (message words get treated as pathspecs). Use single quotes, or `git commit -F <file>`.
- **Email DNS discipline:** only ADD MX + SPF/TXT for forwarding — never edit the A/AAAA/CNAME records (those keep the Pages site up). Email and site DNS are independent. **All GoDaddy changes are additive-only.**
- **Gmail connector** lacks read permission — couldn't read the NordVPN acceptance email; reconnect with read access if reading `getnetstats@gmail.com` programmatically is ever needed.
- **No Python / `claude` CLI** in the local shell — blocks the skill's auto description-optimizer (done manually).

---

## 14. Git state (all local, nothing pushed)

Branches: `main` (Tier 1, live build) and `tier2-prep` (Tier 2 serverless prep). The deployed batch ran through commit **`fea8912`** (`align hero headline top with Connected pill`) and earlier work: split toolkit headline + cyan "Wild Right?", remove SCAN COMPLETE eyebrow, privacy-forward H1 ("keep" accented), remove hero subhead, turn off live-tool toolkit links, "Re-run ALL" pill, re-scope ISP card → ASN & Routing, radar caption, Privacy "in one sentence" TL;DR, hero trust cluster, four test pages + sitemap, readout "Test" pills, `/vpn-guide` + YouTube embeds, amber ISP line, Copy→card corner, EKG/connection pill, rotating affiliate slot, legal pages, AdSense scaffolding+activation, SEO, GitHub Pages static export, Tier 1/Tier 2 split.

> **Confirm the exact current head in Code** — if the FAQ item or any other change was committed after `fea8912`, this doc doesn't fabricate the hash. (`.claude/settings.local.json` permission-allowlist updates are machine-local — consider gitignoring before pushing a public remote.)

---

## 15. Companion files & key references

**Companion docs (in the repo, gitignored — keep private, never push to a public remote):**
- This master handoff · `GetNetStats-chat-instructions.md` (Chat's operating instructions / role definition) · `GetNetStats-YouTube-Kit.md` · `GetNetStats-Tier2-split-path.md` (§17).

| Thing | Value |
|---|---|
| Live site | https://getnetstats.com (current/verified live as of last session) |
| Repo (local) | `E:\GetNetStats` — *confirm drive letter in Code* (was `D:\`, originally `C:\…\Downloads\`) |
| Future projects | each gets its own folder on the same drive |
| Skill | `C:\Users\Adam Abshire\.claude\skills\tool-site-builder\` |
| GitHub user | `adamcazz44` (`adamcazz44.github.io`, public, Deploy-from-branch `/root`) |
| AdSense publisher | `ca-pub-2462592874316838` (verified, review pending) |
| Affiliate id | `150104` (NordVPN + NordPass, approved & live) |
| Contact email | `hello@getnetstats.com` → forwards to `getnetstats@gmail.com` (ImprovMX free, LIVE) |
| DNS host | GoDaddy |
| YouTube first video | "What is a VPN?" id `QdKTM3l3YF0` (live on `/vpn-guide`) |
| YouTube handle | `@getnetstats` (placeholder — confirm/activate) |
| Canonical tagline | "Check your connection, keep your privacy" |
| Latest known commit | `fea8912` (confirm head; FAQ item may be newer) |

---

## 16. Outreach campaign — Phase 1 (built) + Phase 2 (framework)

**Goal:** maximum *legitimate* surface area coordinated into a spike — NOT mass link-dropping (which would torch AdSense standing and earn bans). The asset sells itself: free, no signup, nothing stored.

**Campaign architecture (launch arc):**
| Layer | Channel | Role | Risk |
|---|---|---|---|
| Foundation | Tool-directory blitz | Evergreen backlinks + steady referral | Safe |
| Spike | Product Hunt launch | One coordinated attention burst | Safe |
| Burn | Reddit / Quora / forums (Phase 2) | Sustained referral + SEO, as a *helpful participant* | High if done wrong |
| Amplify | YouTube Shorts + X/Threads | Owned-channel push | Safe–Med |
| Earn | "Best free speed test" roundups + journalist (HARO/Connectively) outreach | High-authority backlinks | Safe |

**Gate (cleared):** deploy live ✅, contact email live ✅. Ads aren't serving yet — spike monetizes via **NordVPN affiliate only**.

### Part A — Directory blitz
**Fit-filtered list (best-first):** AlternativeTo ⭐ (intent-based: lists you as an alt to Speedtest/WhatIsMyIP), SaaSHub ⭐, Product Hunt ⭐, StackShare, Slant, Indie Hackers, plus general free-tool aggregators.
**Deliberately EXCLUDED:** Capterra / G2 / GetApp / Crunchbase (enterprise-buyer fit — will reject a free no-signup consumer tool) and paid "submit to 300 directories" bots (spammy backlink patterns risk AdSense standing). *Verify the live form when submitting — URLs/fields change.*

**Reusable submission copy (honors privacy + honesty guardrails):**
- **Name:** GetNetStats
- **One-liner (≤60):** Check your connection, keep your privacy.
- **Short (≤160):** Your public IP, ISP, location & a real in-browser speed test — instantly. No sign-up, no tracking, nothing stored. The whole connection, none of the surveillance.
- **Long (~490):** GetNetStats shows you exactly what the internet sees about your connection — your public IP, ISP, and location — then runs a real speed test (download, upload, ping, jitter) right in your browser. Most "what's my IP / speed test" sites track you, sell your data, and bury it in a 40-minute privacy policy to tell you things your own browser already knows. GetNetStats doesn't: no app, no sign-up, nothing stored, and we don't sell your data. Check your connection, keep your privacy.
- **Alternative-to targets:** Speedtest by Ookla · Fast.com · WhatIsMyIPAddress · ipinfo.io · nPerf
- **Categories:** Speed Test · Network Tools · IP Lookup · Internet Utilities · Privacy Tools
- **Pricing:** Free · **Platform:** Web · **No account required:** Yes

### Part B — Product Hunt kit
**Framing:** no existing audience yet → **narrative-led launch** (maker comment + privacy hook do the work). Realistic win = permanent high-authority backlink + traffic spike + social proof, NOT necessarily #1. Judge the day by comments/feedback/referral traffic, not rank.
**LAUNCH DATE — LOCKED: Tuesday 6/23, 12:01 AM Pacific** (= 2:01 AM Central; schedule it, engage when awake). Open the "Upcoming" page early to bank followers.
**Hard rule:** never ask for upvotes — ask people to visit, try it, comment.

- **Tagline:** Check your connection, keep your privacy.
- **Description:** GetNetStats shows you what the internet sees about your connection — your public IP, ISP, and location — then runs a real in-browser speed test: download, upload, ping, jitter. The catch with the usual speed-test and "what's my IP" sites: they track you across the web and sell the data to tell you things your browser already knows. GetNetStats is the opposite — no app, no sign-up, nothing stored, no data selling. Just a clean radar-style scan and honest answers. Check your connection, keep your privacy.
- **Topics:** Privacy · Tech · Web App · Developer Tools · Network
- **Maker's first comment:** *(leads with the needle; the honesty paragraph doubles as a credibility signal)*
  > Hey hunters 👋
  > Every "what's my IP / how fast is my connection" tool I tried wanted to install something, make me sign up, or quietly track me across the web — just to tell me things my own browser already knows. One of the biggest ones has a privacy policy that takes 40 minutes to read.
  > So I built the opposite. Open GetNetStats and in a couple seconds you see your public IP, ISP, and location, then a real speed test runs right in your browser. Nothing is stored, no sign-up, and we don't sell your data. The whole idea is in the tagline: check your connection, keep your privacy.
  > One thing I'll be straight about — the "connection quality" score is *derived* from real latency and throughput. Browsers can't read your actual Wi-Fi radio signal, and I won't pretend otherwise. Same with IP location: it's an estimate, and the site says so.
  > Would love your feedback on the speed-test feel and whether the privacy promise reads clearly. What network tool do you wish existed?
- **Gallery assets — FINAL & LOCKED (6, captured from build `fea8912`).** Stored under gitignored `marketing/producthunt/`. Privacy-safe: IP shots use the site's **demo mode** (98.142.6.71 / Comcast / Denver — NOT Adam's real data). Upload order:
  1. `01-hero-scan-complete` (full-width hero, ad rail cropped out — feed thumbnail; strongest shot)
  2. `02-speed-test-midscan` (radar sweeping, "TESTING DOWNLOAD…")
  3. `03-readout-cards` (also shows the real NordVPN affiliate card + "Ad" chip — honesty proof, keep it)
  4. `04-toolkit-grid` ("…always free. Wild Right?" + 6 cards)
  5. `05-ping-test-page` (real "Fair" grade — honest non-perfect score)
  - **Logo:** `logo-240.png` = the radar motif (cyan rings + sweep + crosshairs, no center text). Legible at PH feed size.

### Launch-day runbook (6/23, Central time)
**Golden rule:** never ask for upvotes — only "check it out, try it, leave honest feedback." **Goal:** clean credible launch (permanent backlink + traffic spike + social proof), not #1.
- **T-minus (night of 6/22):** listing built; 6 assets uploaded (01 first); maker comment ready; launch scheduled for 12:01 AM PT; Upcoming page collecting followers; ~10–20 people to personally message drafted; PH app installed/logged in.
- **2:01 AM CT** — auto-launch while asleep; Upcoming followers notified.
- **~6:30 AM CT (wake):** confirm post + first maker comment live; reply to every waiting comment; send personal 1:1 messages (no "upvote").
- **9 AM–1 PM CT (= 7–11 AM PT peak):** check every ~30 min; reply fast and human; welcome critical feedback (engage, don't defend).
- **1–6 PM CT:** sustain; post to owned channels (amplify); don't manufacture activity.
- **6–9 PM CT (= 4–7 PM PT):** final US stretch; thank late commenters; don't stress rank.
- **Before bed:** screenshot final rank/comments (reusable social proof).

### Post-launch (6/24+)
- Reply to stragglers (PH threads continue past 24h); add "Featured on Product Hunt" where it fits.
- **Watch for organic mentions:** Google Alert for `getnetstats` + `getnetstats.com`; weekly manual `getnetstats site:reddit.com`. **If someone else posts it,** engage *as the maker* (safe — no self-promo rules apply, often boosts the thread). Don't brigade, don't add affiliate links.
- Roll momentum into directories + Quora now; Reddit once the account ages.

### Amplify — launch-day owned channels (Adam's personal accounts)
Instagram · X · LinkedIn · Facebook · Telegram · YouTube. **Post to share, not to beg; match each platform's voice; privacy framing, not "ad-free."** Order: X + LinkedIn + Facebook first (most launch weight), then Instagram/Telegram/YouTube, spaced over the morning.
- **X:** punchy needle; put the link in the *first reply* (X throttles link-posts).
- **LinkedIn:** "why I built this" maker story; link in first comment.
- **Facebook:** warm/personal. **Instagram:** Story with the scan visual; "link in bio."
- **Telegram:** only in groups Adam genuinely belongs to. **YouTube:** community-tab post + pin a launch comment on the VPN video.
> **Reality check:** Adam's personal network is non-tech and won't be the audience — these posts are the *first-hour engagement spark* that helps PH's algorithm surface the listing. Ready-to-paste post + DM templates were drafted in chat (swap `[link]` on the day).

### Phase 2 — Reddit / Quora (the real growth engine; NOT tied to 6/23)
Reaches strangers *at the moment they have the problem* — needs no personal network. **Cardinal rule: community member first, marketer a distant second (90/10).** 2026 Reddit detection is ~96% automated.
- **Reddit needs a ~2-week warm-up** (normal commenting, no links, neutral username — NOT "getnetstats") before any tool mention, or it auto-shadow-bans. **Quora needs no warm-up** — start immediately; answers rank in Google for years.
- **Three hard constraints on Reddit:** (1) always disclose "I built this"; (2) **never** drop the NordVPN affiliate link (instant ban) — Reddit = the free tool only; (3) honesty guardrails travel (no "ad-free," no accuracy claims, Wi-Fi score is derived).
- **Target subs:** r/HomeNetworking, r/techsupport, r/24hoursupport, r/HomeServer, r/selfhosted, r/InternetIsBeautiful, r/SideProject, r/webdev. *Read each sub's rules + 20–30 posts first; some allow tool shares only in weekly megathreads.*
- **Talking-point pattern:** answer the question fully first, then a disclosed "this is what I use / I built" aside; recommend the *category*, not just yourself. Four starter scenarios drafted (speed-test accuracy, what-your-IP-reveals, ad/clutter complaints, VPN questions) — to be expanded into full example comments + Quora answers.

### Earn (later)
Outreach to "best free speed test / IP tool" roundup authors + journalist request platforms (HARO/Connectively) for high-authority backlinks — once there's a live, polished site to pitch (there is).

---

## 17. Tier 2 (API layer) — planned, deferred — see `GetNetStats-Tier2-split-path.md`

- **Deliberately NOT in motion.** Deferred until current Tier 1 polish is deployed and AdSense is approved.
- **Architecture:** `api.getnetstats.com` subdomain on **Vercel**, fully independent from the GitHub Pages Tier 1 site (the static site keeps running untouched; Tier 2 is a separate serverless deployment).
- **What it unlocks:** the WHOIS Lookup tool (the one Soon-card that truly needs a backend — no port-43 WHOIS in browsers; most RDAP servers omit CORS). `/api/whois` is already drafted on the `tier2-prep` branch, alongside a reusable `lib/api/*` toolkit. Future serverless endpoints (`/api/dns`, `/api/ssl`) can follow, though DNS can also be done client-side via DoH (§7).
- **Cost:** $0 within Vercel Hobby / Cloudflare Workers free tiers; the constraint is rate-limits/abuse, mitigated by caching + multi-provider fallback + Cloudflare in front.
- **DNS note:** adding `api.` will be **another additive GoDaddy record** (a CNAME/A to Vercel) — never touch the existing apex/`www` records that keep Tier 1 live.

---

*End of master handoff. When project state moves (launch results, FAQ deploy, AdSense approval, a new tool, the YouTube handle), ask Chat to regenerate this file so Code and Chat stay in sync.*
