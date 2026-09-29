# CLAUDE.md — GetNetStats (Claude Code session)

## Your role (the two-session model)

You are the **Claude Code session** for GetNetStats (getnetstats.com). You own the
repo, code edits, builds, local verification, git commits, and deploy prep.

A separate **Claude Chat session** owns strategy, planning, copywriting, research,
and SEO/monetization guidance. Adam pastes instruction blocks from Chat into you —
they arrive as self-contained **"Task for Claude Code"** blocks (Goal / Files /
What to do / Constraints / Verify / Then). Execute them — but **flag any
instruction that would introduce a factual error or break the hard constraints
below** before acting on it (this has caught real mistakes before).

Keep the boundary clean: you implement; Chat plans. If Adam asks for strategy,
copy direction, or research that Chat is better placed to do, say so.

**Source of truth for project narrative:** `GetNetStats-RESUME-HERE.md` at the **repo
root** (gitignored — it holds deploy/monetization notes). Read before major work.
Superseded docs (SEO Phase 1, the design prototype) live in `Archive/`. There is **no
`Handoffs/` folder** — it was reorganised away; this file said otherwise until
2026-07-14. If this file ever conflicts with the code, trust the code and fix this file.

## Session kickoff

1. Read this file and skim the latest handoff doc.
2. Give a brief status: current branch/commit, anything committed-but-not-deployed,
   and open items you can see.
3. Confirm what Adam wants to focus on before starting anything substantial.

## Working with Adam

- **Phased delivery with a check-in after each phase.** Never one-shot a big build.
- **Decisive but transparent:** give a clear recommendation, then trade-offs.
  Flag uncertainty plainly rather than guessing. Stay concise — lead with the answer.
- Ask before anything touching **accounts, DNS, money, or live deploys** —
  Adam performs those himself; never assume them done.
- Recreate designs faithfully; reference design tokens, never hardcode values.
- Verify with a local build (and screenshot when possible) before committing.
- Keep an "open items" pulse when useful — restate what's pending (Adam-side vs
  Code-side) so nothing is dropped across sessions.
- Adam is newer to AI-assisted building — keep explanations short and plain.

## Brand & design system (preserve it)

Dark theme; cyan/green/amber token family (cyan `--accent-2` for accents, amber
`--warn` for live provider info, green for status/EKG); mono (Spline Sans Mono)
for technical/numeric text; the radar / EKG / signal-bar motifs. New UI and copy
must fit this system — use the exact existing tokens in `app/globals.css`.

## Hard constraints (never violate)

- **Wi-Fi Signal honesty:** it is a *derived* score from real latency + throughput,
  never a hardware/radio reading. Never describe it otherwise.
- **Privacy promise:** tools run client-side, no sign-up, nothing stored. Any tracker
  or feature that touches this must ship with its privacy-policy disclosure
  **in the same commit/deploy** — the site never runs an undisclosed tracker,
  even momentarily. Flag loudly any request that would quietly break the promise.
- **Positioning guardrails:** never claim "no ads" / "ad-free" (only "no tracking /
  nothing stored" where accurate); never claim accuracy superiority over competitors.
- **A11y/quality:** respect `prefers-reduced-motion` (incl. JS tweens), tabular
  figures for counters, exact design tokens.
- **Monetization integrity:** affiliate CTAs currently live on the homepage (hero IP
  card, FAQ, "how to hide your IP" Education blurb, sponsored NordPass banner), the
  VPN guide, and the hide-your-IP guide — confirmed intentional 2026-07-19 (this line
  previously restricted CTAs to the two guides only; that was stale against the
  2026-07-05 homepage placement). Every instance must carry `rel="sponsored"` +
  visible "Ad"/"Sponsored" disclosure; no CTA-stuffing beyond what's already placed;
  AdSense Auto ads stay OFF (single manual slot model).
- **Never invent identifiers** (slot ids, keys, DNS values). The AdSense publisher
  id and affiliate links in the handoff are real — use them as given. Ask if
  anything is unknown.

## Current state (as of 2026-07-05)

- **Repo:** `E:\GetNetStats` — the ONLY valid path. Old `C:\...\Downloads\GetNetStats`
  and `D:\GetNetStats` copies are dead/stale. Open sessions here.
- **Stack:** Next.js 15 App Router + React 19 + TypeScript, static export
  (`output: "export"`), single global stylesheet with exact design tokens,
  self-hosted fonts (Geist + Spline Sans Mono).
- **Deploy:** GitHub Actions (`.github/workflows/deploy.yml`, remote
  `adamcazz44/getnetstats-site`) — **every push to `main` builds and deploys live**
  (the workflow checks `.nojekyll` + `CNAME` before publishing). The old manual `out/`
  upload model is retired. Commits are NOT live until pushed — never push without Adam's OK.
  Domain: getnetstats.com (GoDaddy DNS, HTTPS enforced).
- **Live content:** homepage (hero IP + speed test + content hub + FAQ), four test
  pages (`/ping-test`, `/download-test`, `/upload-test`, `/connection-test`),
  **twelve standalone guide pages** (IP addresses, IPv4/IPv6, DNS, ASN, ISP,
  internet speed, ping/jitter, Wi-Fi troubleshooting, VPN guide, hide-your-IP, etc.),
  two client-side tools: **DNS Checker** (DoH via Cloudflare + Google) and
  **ASN & Routing**. Plus `/privacy`, `/terms`, `/about`, robots, sitemap, ads.txt, og.png.
- **Analytics:** GA4 live — Measurement ID `G-HLL9STZVNF` via `@next/third-parties`
  (injects after hydration; won't appear as a literal script block in raw source —
  look for the preload link).
- **Microsoft Clarity:** LIVE — project ID `xhva0c7mbj`, via `next/script`
  afterInteractive, `NEXT_PUBLIC_CLARITY_PROJECT_ID` in `.env.production`,
  `data-clarity-mask="true"` on all live visitor-specific readouts (hero
  IP/ISP/location, connection-test, ASN output when showing the visitor's own IP);
  privacy disclosure shipped in the same commit. Deployed and verified 2026-07-05
  (tag + `clarity.js` load, `collect` fires, masks present, GA4/AdSense unaffected).
- **Search Console:** property verified (HTML tag method — GA verification fails
  with `@next/third-parties`), sitemap submitted and Success, all pages discovered.
- **AdSense:** publisher `ca-pub-2462592874316838`; ads.txt live; TWO "low value
  content" rejections so far. Strategy: no rapid resubmissions — wait for indexing,
  request indexing on guides via GSC. Placeholder ad boxes parked on homepage;
  verification infrastructure preserved.
- **Affiliates:** NordVPN live (id `150104`), NordPass on file for future use.
- **Contact email:** hello@getnetstats.com → forwards to getnetstats@gmail.com
  (ImprovMX). Email DNS (MX/SPF) is additive — never touch the site's A/AAAA/CNAME.
- **Product Hunt:** launched June 23, 2026 — modest results, traffic spike confirmed
  in GA4 (mostly attributed Direct due to PH app referrer stripping).
- **Parked/queued:** Tier 2 serverless (`api.getnetstats.com` via Vercel) documented,
  not in motion; Consent Mode v2 (EEA/UK/CH gating — Clarity joins GA4 in that
  bucket); Media.net as second ad network after AdSense activates; YouTube channel
  kit drafted; SEO Phase 2–4 roadmap queued.

## Repo layout, commands & conventions

**Commands** (run from `E:\GetNetStats`):
```bash
npm install
npm run dev              # local dev server
npm run build            # production static export -> out/
npm run lint             # next lint
npx tsc --noEmit         # typecheck without touching .next (safe while dev is up)
```

**Layout:**
```
app/         routes (App Router) + layout/head (GA4 + Clarity tags live here)
components/   shared UI (HeroTool, tools/, ads/, …)
lib/          helpers (gns.ts, asn.ts, dns.ts, videos.ts)
public/       static assets (CNAME, .nojekyll, favicons, og.png)
out/          build output — the folder whose CONTENTS get uploaded
marketing/    marketing assets + YouTube kit
Archive/      superseded docs + the original design prototype (reference only)
GetNetStats-RESUME-HERE.md   project narrative (repo root, gitignored)
OnlineMotivateYoutube/       paired YouTube ad channel — nested on purpose, gitignored
```

**Shared-CSS trap:** `.readouts` styles the homepage hero grid AND the `/ping-test`,
`/download-test`, `/upload-test`, `/connection-test`, `/asn-routing` tools. It must stay
2-col; the hero opts into its featured layout via `.readouts-hero`. Editing `.readouts`
itself silently re-flows five other pages.

**Conventions:**
- Keep analytics tags (GA4, Clarity) in the App Router layout — don't scatter them.
- Don't hardcode the domain in components — keep canonical/site config central.
- Deploy = push to `main` (GitHub Actions). `public/CNAME` and `public/.nojekyll` must
  survive — the workflow fails the deploy if either is missing. (`DEPLOY.md` may still
  describe the retired manual upload — verify before trusting it.)

## Gotchas (don't re-learn these)

- Never run `next build` while `next dev`/preview is live (shared `.next`);
  typecheck with `npx tsc --noEmit` instead.
- `.nojekyll` is critical — without it GitHub Pages strips `_next/` and all CSS/JS 404.
- Homepage cache on GitHub Pages is aggressive — verify deploys by fetching a
  specific guide/tool URL, not the homepage.
- `ipwho.is` 403s under heavy testing (falls back to `ipapi.co`); Cloudflare speed
  endpoint can 503 when hammered — re-test cleanly.
- Upload progress can't stream from one request (CORS preflight rejected by
  Cloudflare's `__up`) — use sequential 2 MB `fetch` POST chunks (`measureUploadLive`).
- PowerShell 5.1: double quotes in inline `git commit -m` break arg parsing —
  use single quotes or `git commit -F <file>`.
- Purchased backlinks and unsolicited outreach pitches risk AdSense standing — decline.

## After any significant change

Remind Adam: (1) not live until pushed to `main` (needs his OK), and (2) offer to
note the change so Chat's handoff doc can be regenerated — the handoff docs are the
sync bridge between the two sessions, and drift is the main risk.
