# GetNetStats — Project Context Handoff

> **Purpose:** Non-coding context for the GetNetStats project — what it is, decisions, accounts,
> deployment & monetization status, positioning, the outreach/SEO campaigns, working preferences,
> open items, and hard-won gotchas. Upload this to a **Claude Chat** so that conversation holds the
> project narrative; the **Claude Code** session keeps the actual codebase. **No source code here** —
> code lives in the git repo at `E:\GetNetStats`.
>
> If you're the Claude reading this: treat it as authoritative project state as of the last update.
> **Ask before acting on anything that touches accounts, DNS, money, or live deployments.**

**Last updated:** 2026-06-26 (post-launch session) · **Branch:** `main`

---

## 0. What changed in the latest session (2026-06-26)

Read this first, then trust the sections below.

- **PRODUCT HUNT LAUNCH IS LIVE & DONE.** Launched (as planned) on **Tue 6/23**. Listing is up,
  polished, on-brand. As of this session: **4 upvotes / points, 5 followers**, "Launched this week."
  Maker comment was posted before launch. Gallery assets match the live site (demo-mode IP data,
  privacy-safe). **Honest framing held:** judged by feedback quality + traffic, not rank — a solid,
  legitimate first launch for a maker with no pre-built audience. No further launch-day action needed.
- **GA4 reviewed for launch results.** Last-7-days: **12 active users, 13 new, 64 events**, reach
  across **5 countries** (US 6, China 2, Germany 2, India 1, Ireland 1); US engaged best (~9s).
  Traffic acquisition: **~92% Direct, ~8% Referral**, with a clear spike on **6/22–23** = the launch.
  Most PH traffic is landing as "Direct" (PH app clicks / referrer stripping / typed URLs) rather than
  attributed referral — normal. `google / organic` is still ~zero (domain too new to rank yet).
- **GOOGLE SEARCH CONSOLE NOW SET UP (new).** Property created for `https://getnetstats.com`
  (URL-prefix), **verified via HTML-tag method**, **sitemap submitted** (live + valid). This kicks
  off the organic-search workstream. Full detail + the 2-week follow-up in the companion doc
  **`GetNetStats-SEO-Phase1-Complete.md`**.
  - A `google-site-verification` meta tag was added to `app/layout.tsx` metadata and deployed.
    **Do not remove it** (un-verifies GSC). Value: `DDY2dZ3UOrK-f76EZA86fSZzS66RvhaKA2-LSm-Zezw`.
  - GA verification method failed (`@next/third-parties` tag placement); HTML-tag is the reliable one.
- **Three "supporter" emails to `hello@` were all sales pitches, not supporters** — flagged and
  dismissed: BacklinkLog (paid backlinks), KrispiTech (paid "feature your product"), Sequenzy
  (email-platform pitch — and GetNetStats sends no email by design, so doubly irrelevant). Decision:
  **don't engage, don't pay** — purchased/low-quality backlinks are exactly the pattern that risks
  AdSense standing and is being deliberately avoided. A public `hello@` on a PH launch attracts this
  genre; consider a Gmail filter if volume grows.

---

## 1. What GetNetStats is

A consumer web tool at **getnetstats.com**: instantly shows a visitor's **public IP, ISP, and
location**, then runs a **real in-browser speed test** (download, upload, ping/jitter, connection
type, and a derived "Wi-Fi Signal" connection-quality score). Centerpiece is an animated **radar
"scan-to-reveal."** The homepage doubles as an SEO **content hub** (How It Works, toolkit grid,
Education, FAQ) and carries **display ads + affiliate** as the revenue model.

**Honesty constraints (LOAD-BEARING — never violate):**
- Browsers can't read real Wi-Fi radio signal — the "Wi-Fi Signal" meter is an honest **derived**
  score from latency + throughput, never a hardware reading.
- Nothing is stored; no sign-up.
- These promises are stated on the site and **must stay true.** Honesty is the brand's moat (§8).

---

## 2. Stack & architecture

- **Next.js 15 (App Router) + React 19 + TypeScript.**
- **Static export** (`output: "export"`) → static files to **GitHub Pages**.
- Single global stylesheet (`app/globals.css`) preserving exact design tokens; fonts self-hosted via
  `next/font` (Geist + Spline Sans Mono).
- **Tier 1 = client-side** (tools, content, SEO, ads) → branch **`main`**, served by GitHub Pages.
- **Tier 2 = serverless** (`/api/*`, e.g. WHOIS proxy) → parked on **`tier2-prep`**. GitHub Pages
  can't run serverless, so Tier 2 is NOT deployed; awaits a serverless host (Vercel/CF Workers).

**Repo location — `E:\GetNetStats`** (external 4 TB Samsung 990 PRO NVMe, labeled FastSSD). Home for
this + all future projects (each future project = its own folder under `E:\`). **The old
`D:\GetNetStats` and `C:\…\Downloads\GetNetStats` copies are stale — delete them.** **No git remote pushed yet** — commits are local-only; pushing to GitHub for
backup is still an open to-do.

> ⚠️ **Open Code sessions in `E:\GetNetStats`** (not the old C: path) so the preview tool serves the
> right copy. Claude Code's auto-memory is folder-path-keyed; this handoff doc is the reliable bridge.

**Pages live in the codebase:** `/` (hero + speed tool + toolkit + How-It-Works + Education + FAQ),
`/ping-test`, `/download-test`, `/upload-test`, `/connection-test`, `/dns-checker`, `/asn-routing`,
`/vpn-guide`, plus guides (`/what-is-an-ip-address`, `/ipv4-vs-ipv6`, and others), `/privacy`,
`/terms`, `/about`. Plus `robots.txt`, `sitemap.xml`, `ads.txt`, `og.png`.

---

## 3. Deployment status — LIVE & CURRENT

- **Host:** GitHub Pages, **manual static upload** model: build locally → upload the **contents of
  `out/`** to the repo root. No GitHub Actions. `out/` is gitignored — never committed, only uploaded.
- **GitHub user:** `adamcazz44` → repo `adamcazz44.github.io` (public, Deploy-from-branch `/root`).
- **Custom domain:** `getnetstats.com` (apex). **HTTPS enforced.**
- **DNS (GoDaddy):** apex `@` → A `185.199.108-111.153`; AAAA `2606:50c0:8000-8003::153`;
  `www` → CNAME → `adamcazz44.github.io`. MX + SPF/TXT for ImprovMX email forwarding. No CAA.
  Not Cloudflare-proxied.
- **Required files in `out/`:** `.nojekyll` + `CNAME` (= getnetstats.com), both from `public/`.

> **Most recent deploy this session** added the GSC `google-site-verification` meta tag (in
> `app/layout.tsx` metadata), rebuilt, and re-uploaded — verified live. **Going forward, new commits
> still aren't live until `out/` is rebuilt + re-uploaded** (manual model unchanged).

---

## 4. SEO status

**On-page SEO: complete.** Per-page metadata (title/description/keywords/canonical-with-trailing-
slash/OG/Twitter), JSON-LD (`@graph` on home: Organization, WebSite, WebApplication, BreadcrumbList,
FAQPage; per-tool: WebApplication + BreadcrumbList), real 1200×630 `og.png`, `robots.ts`,
`sitemap.ts` (lists tool pages at 0.8, guides at 0.7). Social cards validated on FB + LinkedIn.

**Off-page / organic-search workstream (NEW — started 2026-06-26):**
- **Google Search Console is set up, verified, sitemap submitted.** See
  **`GetNetStats-SEO-Phase1-Complete.md`** for the full Phase-1-done writeup + the 2-week follow-up.
- **Phase 1 (foundation) = done.** Phases 2–4 (keyword targeting → content gaps → ongoing rhythm)
  are **queued, pending ~1–2 weeks of GSC data** (queries, positions, indexing status). Don't start
  Phase 2 until that data exists — it's the raw material.
- Expectation set: new domain → **3–6 months** before meaningful ranking. Early data will be thin;
  that's normal.

---

## 5. Monetization & accounts status

### Google AdSense — VERIFIED, REVIEW PENDING
- **Publisher id:** `ca-pub-2462592874316838` (public; via `NEXT_PUBLIC_ADSENSE_CLIENT`).
- Verified (head script + meta + `ads.txt`). **Awaiting Google approval.** Live page shows
  placeholder ad boxes — expected. **Launch traffic monetizes via NordVPN affiliate only** for now.
- **ads.txt:** `google.com, pub-2462592874316838, DIRECT, f08c47fec0942fa0`.
- **Consent CMP:** Google's CMP, 3-choice (EEA/UK/CH).
- **After approval (open to-do):** create a 300×600 display unit, get its **slot id**, set
  `NEXT_PUBLIC_ADSENSE_HALFPAGE_SLOT`, rebuild, re-upload. **Keep Auto ads OFF.**

### NordVPN / NordPass affiliate — APPROVED & LIVE
- **Affiliate id:** `150104`.
  - NordVPN: `https://go.nordvpn.net/aff_c?offer_id=15&aff_id=150104&url_id=902`
  - NordPass: `https://go.nordpass.io/aff_c?offer_id=488&aff_id=150104&url_id=9356`
- **Payout:** PayPal (primary email on the account; entered on Nord's side — assistant won't handle
  payment details). *Open: enter PayPal email on Nord's affiliate side.*
- **300×250 rail:** rotates NordVPN ⇄ NordPass on-brand CTA cards (~12s, random first, pauses on
  hidden tab, static under reduced-motion).
- **Contextual NordVPN CTAs** at high-intent "hide your IP" moments only (hero, Education bullet, FAQ),
  each with inline "Ad" chip + `rel="sponsored"`. NOT in purely-explanatory spots (spam/AdSense risk).

### Contact email — LIVE
- **`hello@getnetstats.com`** → forwards to **`getnetstats@gmail.com`** via **ImprovMX free tier**
  (MX + SPF/TXT at GoDaddy, additive). To reply *as* `hello@`, add a "Send mail as" in that Gmail.
- ⚠️ Now public → attracts sales pitches (see §0). Don't engage; consider a Gmail filter if volume grows.

---

## 6. Current live site state (homepage & tools)

Hero: H1 **"Check your connection, keep your privacy"** ("keep" cyan). Trust strip
(`Your results aren't stored · No app or sign-up · Runs in your browser · We don't sell your data`), "Privacy in
one sentence →" link, radar transparency caption (location is an estimate; Wi-Fi Signal is derived),
"Re-run ALL" scan pill, EKG connection pill, amber ISP line, Copy button in IP card corner, "Test →"
pills on each readout card.

Toolkit: headline "Every network check in one place and always free." + cyan "Wild Right?". Three
live showcase cards (IP / Speed / Ping, non-clickable) + three shipped/soon tools. **DNS Checker
(`/dns-checker`) and ASN & Routing (`/asn-routing`) are Tier-1 client-side tools, shipped.** WHOIS
remains the Tier-2 (serverless) one.

Test pages (`/ping-test`, `/download-test`, `/upload-test`, `/connection-test`) all on one template;
download ≈246 Mbps, upload ≈107 Mbps verified; connection-test is a `navigator.connection` display
(honest "unsupported on Safari/Firefox" note), not a live probe.

---

## 7. Coming-soon / tool feasibility (all stay FREE)

| Tool | Needs | Tier | Cost |
|---|---|---|---|
| ASN & Routing | ASN, AS org, residential/hosting/mobile, reverse DNS | Tier 1 (shipped) | ≈$0 |
| DNS Checker | A/AAAA/MX/TXT | Tier 1 (shipped) | ≈$0 |
| WHOIS Lookup | registration/registrar/owner | **Tier 2 serverless** (drafted on `tier2-prep`) | $0 within free tiers |

Real constraint = rate-limits/abuse, not cost. **Keeping tools free is the moat** — don't bolt on a
paid API (that's the only thing that makes "always free" false).

---

## 8. Product & positioning strategy (the moat)

Two HARD guardrails on all copy/SEO:
1. **Position on "no tracking / nothing stored," NEVER "no ads."** Ads will serve; "ad-free" claims
   self-destruct on AdSense approval. Badges chosen to stay true after ads go live (hence no bare
   "No tracking" badge — cookies; stated honestly in Privacy "one sentence").
2. **Do NOT compete on accuracy.** Browser/IP imprecision is inherent. Compete on honesty, privacy,
   clean UX → radical transparency as the differentiator.

Canonical tagline: **"Check your connection, keep your privacy."** Others on file:
"They track you to tell you your own IP. We don't." / "No app. No sign-up. Nothing stored. Just answers."

**Cross-channel frame:** Product Hunt = the spike (done, modest+legit). The **engine** = search (SEO,
now kicked off via GSC) + directories + Reddit/Quora + YouTube — channels that reach strangers at the
moment they have the problem.

---

## 9. YouTube (Education embeds)

Repurposed channel hosts short explainers embedded on `/vpn-guide` via privacy-friendly lazy embeds
(`youtube-nocookie.com`). **First video live:** "What is a VPN?" (id `QdKTM3l3YF0`). Five more
planned — fill `lib/videos.ts` as IDs arrive, then embed "What is an IP" in homepage Education.
Channel tagline = "Check your connection, keep your privacy." **YouTube `@handle` still to be
confirmed/finalized.** See `GetNetStats-YouTube-Kit.md`.

---

## 10. Working preferences

- **Phased delivery with check-ins** — propose a phase, confirm, proceed; don't dump everything at once.
- Recreate designs faithfully; don't ship the prototype.
- Honor a11y/honesty constraints (reduced-motion, tabular figures, exact tokens, Wi-Fi-signal honesty).
- **Ask before** architecture decisions, new deps, or anything touching accounts/DNS/money/live deploys.
- **Split workflow:** Claude Chat = strategy/planning/copy/research + paste-ready instruction blocks;
  Claude Code = repo/edits/builds/commits. Adam bridges them.
- Adam is **newer to AI-assisted dev / site-building** and finds it overwhelming at times — explain
  unfamiliar tools plainly (e.g. GA4, Search Console were both new this session), walk through
  step-by-step with screenshots, one click at a time. The bigger goal: a **portfolio of monetized
  tool sites to earn a living**; GetNetStats is the canonical first build.

---

## 11. The reusable skill — "Tool Site Builder"

Claude Code skill `tool-site-builder` at `C:\Users\Adam Abshire\.claude\skills\tool-site-builder\`
(SKILL.md + references 01-08 + assets). Repeat the design-handoff → live monetized static site
pipeline for 10+ future sites. GetNetStats is its canonical reference implementation.

---

## 12. Open action items

**User-side:**
- **SEO:** check Search Console (Pages + Performance + Sitemaps status) in **~1–2 weeks** — see
  `GetNetStats-SEO-Phase1-Complete.md`. Nothing to do until data lands.
- Wait for **AdSense approval** → create 300×600 unit → hand over **slot id**.
- **Push the repo to a GitHub remote** for backup (still local-only).
- Enter the **PayPal email** on Nord's affiliate side.
- Delete the stale `C:\…\Downloads\GetNetStats` copy.
- Finalize the **YouTube `@handle`**.
- (Optional) **Gmail filter** for inbound sales pitches to `hello@`.
- ✅ *Done this session:* PH launch reviewed; GA4 results read; GSC set up + verified + sitemap
  submitted; 3 pitch emails triaged.

**Assistant/Code-side (future sessions):**
- **SEO Phase 2** (keyword targeting) once GSC data exists → then Phase 3 (content gaps) → Phase 4 (rhythm).
- Wire AdSense **slot id** on approval.
- WHOIS tool when Tier-2 serverless is greenlit.
- Expand Phase 2 outreach (Reddit warm-up checklist; Quora answers) per the outreach plan.

---

## 13. Gotchas & lessons

- **Never run `next build` while `next dev`/preview is live** — shared `.next`. Use `npx tsc --noEmit`.
- **`.nojekyll` is critical** on GitHub Pages — without it `_next/` is stripped, all CSS/JS 404.
- **Stale cache is a verification trap** — fetching the homepage can return cached content after a
  deploy; verify against fresh guide/tool URLs (or view-source for a specific tag) instead.
- **GSC "Couldn't fetch" on a fresh sitemap is usually just timing** — if the file loads in-browser
  and is valid XML, it'll flip to "Success" on Google's retry within ~24–48h.
- **GSC Google-Analytics verification fails with `@next/third-parties`** — tag placement isn't where
  GSC's checker looks. Use the **HTML-tag method** (meta tag via Next.js `metadata`).
- **Email DNS:** only ADD MX + SPF/TXT for forwarding — never edit A/AAAA/CNAME (those keep the site up).
- **Upload speed can't stream progress from one request** — `xhr.upload` progress forces a CORS
  preflight Cloudflare's `__up` rejects. Use sequential `fetch` POST chunks (`measureUploadLive`).
- **PowerShell 5.1 + git:** embedded double quotes in inline `-m` break arg parsing — use single
  quotes or `git commit -F <file>`.
- **`ipwho.is` 403s under heavy testing** → app falls back to `ipapi.co`. Cloudflare speed endpoint
  can 503 when hammered — re-test cleanly.
- **A public `hello@` attracts sales pitches** post-launch ("I love your launch, now buy my service").
  Don't engage; purchased backlinks risk AdSense standing.
- **Gmail connector** lacks read permission; **no Python / `claude` CLI** in the local shell.

---

## 14. Git state (all local, nothing pushed)

Branches: `main` (Tier 1, live) and `tier2-prep` (Tier 2 serverless prep), both on `E:\GetNetStats`.
Latest session added the GSC verification meta tag (in `app/layout.tsx` metadata) + earlier deployed
work (hero polish, four test pages, trust strip, radar caption, toolkit, privacy-forward H1, DNS
Checker, ASN & Routing, GA4 via `@next/third-parties`, YouTube embeds). **Confirm the exact latest
commit hash in the Code session** — this doc doesn't fabricate one. `.claude/settings.local.json`
is machine-local; gitignore before pushing a public remote.

---

## 15. Companion files & key references

**Companion docs (in the repo, gitignored — keep private, never push to a public remote):**
- `GetNetStats-context-handoff.md` (this file) · `GetNetStats-chat-instructions.md` ·
  `GetNetStats-YouTube-Kit.md` · **`GetNetStats-SEO-Phase1-Complete.md`** (new this session)

| Thing | Value |
|---|---|
| Live site | https://getnetstats.com (current/verified live) |
| Repo (local) | `E:\GetNetStats` (old `D:\GetNetStats` + `C:\…\Downloads\GetNetStats` stale — delete) |
| GitHub user | `adamcazz44` (`adamcazz44.github.io`, public, Deploy-from-branch `/root`) |
| Google Search Console | property `https://getnetstats.com`, verified (HTML-tag), sitemap submitted |
| GSC verification tag | `DDY2dZ3UOrK-f76EZA86fSZzS66RvhaKA2-LSm-Zezw` (in `app/layout.tsx` — keep) |
| GA4 | measurement ID `G-HLL9STZVNF` (via `NEXT_PUBLIC_GA_ID`, `@next/third-parties`) |
| AdSense publisher | `ca-pub-2462592874316838` (verified, review pending) |
| Affiliate id | `150104` (NordVPN + NordPass, approved & live) |
| Contact email | `hello@getnetstats.com` → `getnetstats@gmail.com` (ImprovMX free, LIVE) |
| DNS host | GoDaddy |
| Product Hunt | launched 6/23; ~4 upvotes / 5 followers as of 6/26 (modest + legit) |
| YouTube first video | "What is a VPN?" id `QdKTM3l3YF0` · `@handle` TBD |
| Canonical tagline | "Check your connection, keep your privacy" |
