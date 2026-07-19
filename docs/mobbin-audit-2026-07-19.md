# GetNetStats — Mobbin Audit — 2026-07-19

**Status:** passes complete: 1,2,3,4,5,6,7,8,9,10 · findings: 6 (5 fixed, 1 deferred) · both flags
resolved · 1 idea logged to the portfolio tracker
**Baseline:** live getnetstats.com checked 2026-07-19; local build (`npm run dev`, commit at working tree)
confirmed to match live exactly — the 2026-07-14 UX pass IS live despite RESUME-HERE saying otherwise
(see FLAG-1). Viewports: 375px, 1440px desktop.

## Pre-audit flag — RESUME-HERE is stale on deploy status

**FLAG-1.** `GetNetStats-RESUME-HERE.md` currently reads "UNDEPLOYED CHANGES SIT IN THE WORKING TREE"
and "Site: live and stable, but now BEHIND the local repo" for the 2026-07-14 UX pass. Live-DOM check
today shows the Download-featured hero, the fixed connection-quality copy, the fixed mobile header
(all 3 nav links visible, no overflow), and the footer tool links are **already live and byte-for-byte
matching local**. Recommend updating RESUME-HERE's "Where things stand" section — Adam likely deployed
this in the days since 7/14 and the doc wasn't updated after.
→ **FIXED** — RESUME-HERE's "Where things stand" and "Next action" sections updated (gitignored file,
no commit hash).

## Pass 1 — UX & structure [COMPLETE 2026-07-19]

### F1. About page undersells the toolkit — MED · Quick
- **Evidence:** `/about` says *"Today: IP lookup & internet speed test and a ping & jitter test. More
  network checks (WHOIS, DNS, and others) are on the way."* DNS Checker and ASN & Routing are already
  live (in the footer, confirmed working tools) — only WHOIS is genuinely still "SOON" (per the
  homepage toolkit grid). The About copy contradicts what a visitor can click on the same site.
- **Where:** `app/about/page.tsx`
- **Fix:** update the "toolkit" paragraph to list DNS Checker and ASN & Routing as live; keep WHOIS as
  the only "coming soon" item.
- **Cross-site:** none
- **Guardrail check:** ok — pure accuracy fix, no constraint touched.
→ **FIXED** — commit `4a1671f`.

Structure otherwise checked clean: all 21 `app/` route folders match the footer's link set 1:1 (no
orphaned routes), every hero stat card's "Test →" routes to its own tool page, "Contact" is a
`mailto:` link (not a broken route), header/footer nav all resolve.

## Pass 2 — Visual design [COMPLETE 2026-07-19]

### F2. 11 of 12 guide pages have zero in-body visuals — MED · Strategic
- **Evidence:** grepped `app/` for `<img>` / `next/image` / video embeds — only `vpn-guide/page.tsx`
  has one (a video thumbnail). The other 11 guides (`what-is-an-ip-address`, `ipv4-vs-ipv6`,
  `find-your-ip-address`, `hide-your-ip-address`, `why-is-my-wifi-slow`, `ping-vs-jitter`,
  `what-is-a-dns-record`, `what-is-an-asn`, `what-is-a-good-internet-speed`, `what-is-an-isp`,
  `wifi-vs-ethernet`) are pure text top to bottom. Same pattern flagged on PetPickHQ (9/11 guides bare).
- **Where:** `app/<guide>/page.tsx` (11 files)
- **Fix:** one lede visual per guide. Given the site's existing radar/EKG/signal-bar SVG motif, simple
  custom line-art diagrams (IPv4 vs IPv6 address format, a DNS lookup flow, Wi-Fi vs Ethernet) would
  fit the brand system better than stock photography.
- **Cross-site:** PetPickHQ has the identical gap (idea backlog).
- **Guardrail check:** ok.
→ **FIXED** — deferred at audit time, scoped in `docs/f2-guide-visuals-scope-2026-07-19.md`,
  then built same day across two sessions: Phase 1 commit `1fa4a5e` (3 pilot guides), Phase 2
  commit `4c54ce4` (remaining 8). All 12 guides now have a diagram. Not deployed yet.

## Pass 3 — Color & accessibility [COMPLETE 2026-07-19] (measured, not eyeballed)

### F3. Parked AdSense placeholder text fails WCAG AA — LOW · Quick
- **Evidence:** computed contrast of the "Advertisement" / "300 × 116" placeholder label:
  `rgb(74,90,112)` on `rgb(7,11,18)` = **2.80:1** (needs 4.5:1 at that font size). Confirmed this
  renders on the **live production homepage**, not just local dev.
- **Where:** the parked ad-slot component (renders the empty 300×116 box referenced in RESUME-HERE).
- **Fix:** switch that label to the site's own `--muted` token (`#8a99ad`, which measures 6.79:1 —
  comfortably passes) instead of the dimmer gray it currently uses.
- **Cross-site:** none checked yet.
- **Guardrail check:** ok.

**Broad scan result (informational, not a finding):** ~70 other text/background pairs across nav, body
copy, footer, and every accent color (cyan `#5fe6f7`, amber `#fbbf24`, green `#34d399`) all measured
between **4.88:1 and 13.28:1** — comfortably over AA. The color system is solid; F3 is the only failure
found via the DOM-visible scan.

→ **FIXED, scope expanded** — commit `b14c5ee`. While implementing, grepped every other use of the
`--faint` token (`#4a5a70`, same 2.80:1 failure) and found 4 more instances the DOM scan missed because
they're lazy-mounted or weren't in viewport when the scan ran: `.aff-spon` ("Sponsored" disclosure
label), `.ip-cta::before` and `.guide-cta-ad` (both render the "Ad" disclosure badge), `.ro .v .na`
("Not exposed" connection-quality text), and `.dns-none` (DNS tool empty state). The `.aff-spon`/
`::before` "Ad" instances matter most — they're the disclosure labels the site's own monetization
guardrail requires to be "visible," so 2.80:1 contrast undermined that requirement. Swapped disclosure
labels to `--muted` (6.79:1) and informational text to `--dim` (4.88:1); left `.dns-input::placeholder`
alone since form placeholders are commonly exempt from strict AA and it's a hint, not content.

## Pass 4 — Typography [COMPLETE 2026-07-19]

### F4. Guide-body line length runs ~99 characters at real desktop widths — LOW/MED · Quick
- **Evidence:** measured `.prose p` at a real 1440px viewport: 804px column width, 497 characters
  across 5 rendered line-boxes ≈ **99 chars/line** (target is 60–80). `globals.css:488` sets no
  `max-width` on `.prose` — unlike `.subhead` (`max-width: 42ch`) and `.sec-intro` (`max-width: 64ch`)
  elsewhere in the same file.
- **Where:** `app/globals.css`, `.page .prose` rule
- **Fix:** add `max-width: 68ch` (or similar) to `.prose`, consistent with the pattern already used two
  rules away.
- **Cross-site:** none noted.
- **Guardrail check:** ok.
→ **FIXED, adjusted during verify** — commit `b14c5ee`. 68ch measured wider than expected in Geist
(721px, still 99 chars/line) — `ch` is based on the "0" glyph width, which is proportionally wide in
this font, so it undershot the target. Recalibrated to `50ch` (≈71 chars/line at 1280px, confirmed by
measuring rendered line-boxes) and scoped it to `.prose > p, .prose > ul, .prose > ol` instead of the
whole `.prose` container — a blanket max-width would have also shrunk the VPN guide's video embed,
which lives inside `.prose` too.

## Pass 5 — Mobile experience [COMPLETE 2026-07-19] (measured at real 375px viewport)

### F5. Multiple tap targets well under the ~44px guideline — MED (HIGH for the two affiliate CTAs) · Quick
- **Evidence** (`getBoundingClientRect()` at 375px):
  | Element | Height | Width |
  |---|---|---|
  | Header nav links (VPN Guide / How It Works / FAQ) | 19px | — |
  | "Test →" chip ×4 (on each stat card) | 16px | 41px |
  | "Hide it with NordVPN" CTA (homepage IP card) | 24px | 213px |
  | "Get NordVPN" CTA (guide/FAQ pages) | 26px | 148px |
  | "Copy" button | 35px | 79px |
  | Footer links | 31px | 158px |
- **Where:** `components/SiteHeader.tsx`, the stat-card "Test" chip markup, `components/HeroTool.tsx`
  CTA, `components/FAQSection.tsx` / `Education.tsx` CTAs.
- **Fix:** increase vertical padding so the tappable box clears ~44px, prioritizing the "Test" chips
  (the primary in-tool action) and the two affiliate CTAs (revenue-critical — also a Pass 6 issue, see
  below).
- **Cross-site:** worth checking if other portfolio sites share this button-padding pattern.
- **Guardrail check:** ok. No horizontal overflow anywhere (`document.documentElement.scrollWidth`
  equals `window.innerWidth` on every page checked) — the 7/14 mobile-header fix is holding.
→ **FIXED** — commit `b14c5ee`. Nav links → 43px (real padding), Copy → 41px, footer links → 39px,
`.ip-cta` (both affiliate CTAs) → ~40px (all real padding increases, re-measured after). The "Test"
chips kept their exact 16×41px visual size — used an invisible `::after` hit-slop (`inset: -14px`)
instead of growing the pill, since a visually bigger chip would have clashed with the compact `.ro`
card design. Re-verified: no horizontal overflow introduced at 375px on any page checked.

## Pass 6 — Conversion & CTAs [COMPLETE 2026-07-19]

**F5 cross-reference:** the "Hide it with NordVPN" and "Get NordVPN" tap targets (24–26px tall) are a
conversion problem, not just an accessibility one — undersized mobile CTAs on the site's only two
revenue paths.

### FLAG-2. CLAUDE.md's affiliate-placement guardrail is stale vs. the live site — flag, not a fix
- **Evidence:** `CLAUDE.md`'s hard constraints say *"affiliate CTAs only in the VPN guide and
  hide-your-IP guide."* The live site (confirmed 2026-07-19) also runs NordVPN/NordPass CTAs on the
  **homepage** — the IP-address card, the FAQ, the "how to hide your IP" Education blurb, and a
  sponsored NordPass banner — per RESUME-HERE, shipped deliberately in the 2026-07-05 pass.
- Disclosure is correctly applied everywhere I checked (`rel="sponsored noopener noreferrer"` +
  visible "Ad"/"Sponsored" tag on every instance, confirmed by grep) — this is not a monetization-
  integrity violation. It's a **docs/guardrail mismatch**: the hard-constraint text hasn't caught up
  to a placement decision Adam already approved.
- **Not fixing this myself** — it's marked "never violate" in CLAUDE.md, so I'm surfacing it rather
  than silently rewriting a hard constraint. Recommend: confirm the current (broader) placement is
  what you want, then I'll update the CLAUDE.md line to match.
→ **RESOLVED** — Adam confirmed 2026-07-19 the homepage placement is intentional. CLAUDE.md's
  guardrail line updated to match, commit `7597d3d`.

Otherwise clean: no placeholder CTAs rendering as fake buttons, no CTA-stuffing in the guide bodies —
the VPN guide has exactly one CTA at the bottom, positioned after the "which VPN we recommend" section
where intent peaks.

## Pass 7 — Trust & credibility [COMPLETE 2026-07-19]

### F6. No "last updated" date on any of the 12 guide pages — MED · Quick
- **Evidence:** grepped `app/` for "last updated" / "updatedAt" — only `privacy/page.tsx` and
  `terms/page.tsx` have one. None of the 12 content guides (DNS, ASN, IP, speed-threshold, Wi-Fi
  topics) carry a freshness signal, despite making claims that age (e.g. "what's a good internet
  speed" thresholds, IPv6 adoption framing).
- **Fix:** add a small "Last reviewed: `<date>`" line to the guide template — consistent with the
  honest/sourced brand voice the privacy page already uses.
- **Guardrail check:** ok — strengthens the honesty positioning, doesn't touch the Wi-Fi Signal or
  privacy hard constraints.
→ **FIXED** — commit `a9b979f`.

No fake trust badges or invented stats found. The "Honest by design" callouts and the FAQ's plain
explanation of why browsers can't read Wi-Fi radio signal are genuine trust demonstrations — nothing
to remove here, unlike sites where this pass finds fabricated claims.

## Pass 8 — Forms & email capture [COMPLETE 2026-07-19]

**No finding — by design.** Privacy Policy and About page both state "no sign-up"; there is no
newsletter/contact-form component in the codebase (Contact is a plain `mailto:` link). This matches
the brand promise rather than being an unwired gap — unlike EarnFacts/PetPickHQ, which have half-built
newsletter components with no ESP behind them. Nothing added to the idea backlog for this site.

## Pass 9 — Footer & wayfinding [COMPLETE 2026-07-19]

**Clean, no finding.** Footer's Tools column lists all 6 live tools, Guides column lists all 12 guides,
Company column links About/Privacy/Terms/Contact. The 21 `app/` route folders match the footer's link
set exactly — no stale/orphaned routes, no missing live pages.

## Pass 10 — Fresh ideas [COMPLETE 2026-07-19]

### IDEA-1. Client-side "vs. your last test" comparison — IDEA · Medium
- **Reference:** Mobbin's Vercel Speed Insights (performance charted against past runs) and Postman's
  "restore a history" pattern — both let a user see a result against their own history.
- **What it'd do:** cache the last N speed-test results in `localStorage` (never sent to a server) and
  show a small delta or sparkline next to the current result ("+12 Mbps vs. last test").
- **Guardrail check:** must stay `localStorage`-only to keep the "nothing stored" privacy promise; if
  built, the privacy copy would need one line clarifying "your last few results are cached in this
  browser only, never sent anywhere."
- **Fits other sites:** none directly — this is specific to GetNetStats' tool-result format.

---

## Summary — findings by severity

| # | Finding | Severity | Effort | Pass | Outcome |
|---|---|---|---|---|---|
| F5 | Tap targets under ~44px (2 are revenue CTAs) | MED/HIGH | Quick | 5, 6 | FIXED `b14c5ee` |
| F2 | 11 of 12 guides have zero visuals | MED | Strategic | 2 | FIXED `1fa4a5e` + `4c54ce4` |
| F6 | No "last updated" on any guide | MED | Quick | 7 | FIXED `a9b979f` |
| F1 | About page undersells toolkit (says DNS/ASN "coming" — already live) | MED | Quick | 1 | FIXED `4a1671f` |
| F4 | Guide body text ~99 chars/line at desktop | LOW/MED | Quick | 4 | FIXED `b14c5ee` |
| F3 | Ad/disclosure-label text fails WCAG AA (2.80:1, 5 instances) | LOW/MED | Quick | 3 | FIXED `b14c5ee` |
| FLAG-1 | RESUME-HERE wrongly says UX pass is undeployed — it's live | — | doc fix | pre-audit | RESOLVED |
| FLAG-2 | CLAUDE.md guardrail text stale vs. live affiliate placement | — | needs Adam's confirm | 6 | RESOLVED `7597d3d` |
| IDEA-1 | Client-side "vs. last test" comparison | IDEA | Medium | 10 | logged to tracker |
