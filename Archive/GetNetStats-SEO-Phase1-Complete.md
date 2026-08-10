# GetNetStats — Search-Traffic Push: Phase 1 Complete / Phase 2 Queued

> A focused reference for the SEO / organic-search workstream. Phase 1 (foundation) is done.
> Phases 2–4 wait on ~1–2 weeks of Search Console data before they can be done well.
>
> **Created:** 2026-06-26 · **Owner action gap:** check Search Console in ~2 weeks (see "What to check").

---

## TL;DR

Google Search Console is now set up for getnetstats.com and the sitemap is submitted. The
foundation is laid. **Nothing more to do right now** — the next step (keyword targeting) needs
real search data, which Google takes 1–2 weeks to start producing. Come back to this doc when
that data lands.

---

## ✅ Phase 1 — Foundation (DONE, 2026-06-26)

- **Google Search Console (GSC) property created** for `https://getnetstats.com` (URL-prefix property).
- **Ownership verified** via the **HTML-tag method** — a `google-site-verification` meta tag
  (`DDY2dZ3UOrK-f76EZA86fSZzS66RvhaKA2-LSm-Zezw`) was added to the site's `<head>` through the
  Next.js root `metadata` object, then deployed (rebuilt + re-uploaded to GitHub Pages).
  - ⚠️ **Keep this tag in place permanently.** Removing it un-verifies the property. It lives in
    `app/layout.tsx` metadata now, so a normal build always includes it.
  - Note: the **Google Analytics verification method failed** — `@next/third-parties` injects the
    GA tag in a spot GSC's ownership checker doesn't accept. This is a GSC quirk, not a site bug;
    GA4 itself works fine. The HTML-tag method is the reliable one for this stack.
- **Sitemap submitted:** `sitemap.xml`. Confirmed **live and valid** at
  `https://getnetstats.com/sitemap.xml` (homepage priority 1.0; tool pages 0.8; guides 0.7;
  clean lastmod/changefreq).
  - GSC initially showed **"Couldn't fetch"** — this is the normal post-submission timing lag, not
    an error (the file is reachable and well-formed). It should flip to **"Success"** within ~24–48h
    on Google's own retry schedule.

**Net effect:** Google is now aware of the site and all ~22 pages, and will begin crawling/indexing.

---

## ⏳ What to check in ~1–2 weeks (the data trickle)

Open Search Console → getnetstats.com property and look at:

1. **Indexing → Pages** — should show pages moving to **"Indexed."** Some may sit in
   "Discovered – not indexed" or "Crawled – not indexed" for a while; that's normal for a new domain.
2. **Performance** report (currently empty/zero) — will start showing:
   - **Queries** — the actual search terms you appear for (gold for Phase 2).
   - **Average position** — roughly where you rank for each query.
   - **Impressions** vs **Clicks** — how often you show up vs. how often people click.
3. **Sitemaps** — confirm status flipped from "Couldn't fetch" to **"Success."** If it still says
   "Couldn't fetch" after a few days, re-open `https://getnetstats.com/sitemap.xml` to confirm it
   still loads, then re-submit. (It loaded fine on 2026-06-26.)

> Reality check: a brand-new domain typically takes **3–6 months** before it ranks meaningfully on
> competitive terms. Early GSC data will be thin. That's expected — the point of Phase 1 is to start
> the sensor collecting so Phase 2 is data-driven, not guesswork.

---

## 🔜 Phase 2 — Keyword targeting (QUEUED — needs the data above)

**Goal:** find the searches worth ranking for, and map them to pages that exist (or should).

Planned approach once GSC data exists:
- Pull the **Performance → Queries** list and look for terms where the site already shows up at
  **position ~5–20** ("almost ranking") — these are the cheapest wins (small content/title tweaks
  can move them onto page 1).
- Cross-check against the **intent-based searches** the tools/guides target, e.g.:
  - "what is my ip", "what's my ip address", "find my ip"
  - "internet speed test", "wifi speed test", "how fast is my internet"
  - "dns checker", "check dns records", "dns lookup"
  - "what is an asn", "asn lookup", "who is my isp"
  - "ipv4 vs ipv6", "how to hide my ip", "what is a vpn"
- Map each target query → the best existing page; note where there's **no good page** (Phase 3 gap).

**Hard guardrails carried into copy/SEO work (unchanged):**
- Position on **"no tracking / nothing stored," never "no ads"** (AdSense will serve).
- **Never claim accuracy superiority** — compete on honesty/privacy/clean UX.
- Wi-Fi Signal is a **derived** score, not a radio reading — keep that honest in any title/meta copy.

---

## 🔜 Phase 3 — Content gaps & priorities (QUEUED)

Decide what to write/improve next, in priority order, based on Phase 2's query→page map. Likely
candidates already implied by the tool set (e.g. a deeper DNS guide, an ASN explainer, a "why do
speed tests disagree?" piece). Each new/expanded guide is a fresh search-entry point.

---

## 🔜 Phase 4 — Ongoing rhythm (QUEUED)

A sustainable cadence so the workstream compounds instead of stalling — e.g. a recurring check of
GSC queries + one content improvement per interval. To be defined once Phases 2–3 reveal the shape
of the work.

---

## Cross-channel note

Per the master positioning: **Product Hunt = the spike, search/directories/Reddit/Quora/YouTube =
the engine.** This SEO push is the core of the "engine." It pairs with (not replaces) the directory
blitz and the Phase 2 Reddit/Quora work in the outreach plan.
