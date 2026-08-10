# Handoff: GetNetStats — IP & Internet Speed Test Landing Page

## Overview
GetNetStats (getnetstats.com) is a consumer-facing web tool that lets anyone instantly see their **public IP address, ISP and location**, then run a **real in-browser internet test** measuring download, upload, latency/jitter, connection type, and a derived connection-quality ("Wi-Fi Signal") score. The landing page doubles as the anchor of an SEO **content hub** (related tools, educational sections, FAQ) and carries **display-ad slots** as the primary revenue model.

The centerpiece is an animated **radar "scan-to-reveal"**: on load (and on demand) the tool runs through detect → ping → download → upload phases, animating a radar sweep and counting numbers up as each measurement lands.

## About the Design Files
The files in this bundle are **design references created in HTML/CSS + React-via-Babel** — working prototypes that show the intended look, motion, and behavior. They are **not meant to ship as-is**. The task is to **recreate these designs in the target codebase's environment**, using its established framework, patterns, and libraries.

Recommended target stack (if none exists yet): **Next.js (React) + TypeScript**, with the measurement logic moved into a typed module/hook and the UI into components. The current prototype already separates concerns cleanly (see Files), so the port maps almost 1:1.

> Important: the prototype loads React + Babel from a CDN and transpiles JSX in the browser. That is a prototyping convenience only — in production, compile JSX ahead of time and drop the Babel runtime.

## Fidelity
**High-fidelity.** Colors, typography, spacing, motion timings, and interaction states are final and intended to be reproduced faithfully. Exact tokens are listed in **Design Tokens** below; they currently live as CSS custom properties in `gns-styles.css`.

---

## Architecture (current prototype)
- `GetNetStats.html` — document shell: `<head>` SEO/meta/JSON-LD, font links, CSS link, and the three script includes. Mounts `<div id="root">`.
- `gns-styles.css` — the entire design system + layout (CSS custom properties, component styles, responsive media queries).
- `gns-net.js` — **the measurement engine** (no UI). Exposes `window.GNS` with pure async functions. Port this first; it's framework-agnostic.
- `gns-content.jsx` — static content-hub sections (How It Works, Related Tools, Education, FAQ, Footer). Exports components to `window`.
- `gns-app.jsx` — the interactive hero tool + page composition (orchestrates `window.GNS`, drives the radar/reveal state machine).

A `?demo` URL param (or `window.__GNS_DEMO = true`) runs a scripted walkthrough with representative numbers and **no network calls** — useful for screenshots, offline demos, and visual regression.

---

## The Measurement Engine (`window.GNS`) — port this verbatim (typed)
All functions are client-side, use public no-key CORS endpoints, and have timeouts + graceful fallback. **Be honest about limits: browsers cannot read true Wi-Fi radio signal strength.** The "Wi-Fi Signal" meter is a *derived* score, not a hardware reading — keep that framing.

| Function | Returns | Notes |
|---|---|---|
| `getIPInfo()` | `{ ip, version, city, region, country, isp, source }` | Primary `https://ipwho.is/`, fallback `https://ipapi.co/json/`. Throws `'ip-unavailable'` if both fail. 7s timeout each. |
| `getIPv6()` | `string \| null` | `https://api64.ipify.org?format=json`; returns the IP only if it contains `:`. 5s timeout. |
| `measurePing(n=6)` | `{ ping, jitter } \| null` (ms) | Times `n` round-trips to `https://speed.cloudflare.com/__down?bytes=0`. Drops the first (cold) sample, takes the **median**; jitter = mean abs successive difference. |
| `measureDownload(onProgress, budgetMs=9000)` | `Mbps \| null` | Streams `https://speed.cloudflare.com/__down?bytes=100000000` via `ReadableStream`; calls `onProgress(mbps, fraction)` ~every 90ms; aborts at budget. Needs ≥80KB received to count. |
| `measureUpload(bytes=10_000_000)` | `Mbps \| null` | POSTs a `Blob` to `https://speed.cloudflare.com/__up`. |
| `getConnection()` | `{ type, effectiveType, downlink, rtt, saveData, supported }` | `navigator.connection` (Network Information API), best-effort; `supported:false` when unavailable. |
| `connectionLabel(conn)` | `string` | Maps `wifi→'Wi-Fi'`, `cellular→'Cellular'`, `ethernet→'Ethernet'`, etc.; falls back to effectiveType "+-class" or `'Broadband'`. |
| `qualityScore(download, ping)` | `0–100` | `dl = log10(download+1)/log10(301)` clamped; `pg = (140−ping)/130` clamped; score = `(dl*0.66 + pg*0.34)*100`. |
| `qualityLabel(score)` | `{ label, cls, bars }` | ≥78 Excellent/5, ≥58 Good/4, ≥38 Fair/3, ≥18 Weak/2, else Poor/1. `cls` ∈ `q-good`/`q-fair`/`q-bad`. |

**Endpoint dependency:** all live measurements rely on Cloudflare's public speed endpoints (`speed.cloudflare.com/__down`, `/__up`) and the IP services above. Consider proxying or self-hosting equivalents for production reliability/ToS, and add a server fallback for IP lookup.

---

## Screens / Views

There is **one page**, top to bottom: Header → Hero Tool → How It Works → Related Tools → Education → FAQ → Footer. Max content width **1240px**, centered, 28px side padding (`.wrap`).

### 1. Header (`header.site`)
- **Sticky** top, `backdrop-filter: blur(14px)`, bg `rgba(7,11,18,0.72)`, 1px bottom border `--border`. Height 64px.
- Left: **brand** — an **11×11px white rounded-square** (`border-radius:3px`, `box-shadow:0 0 14px rgba(255,255,255,0.5)`) + wordmark "GetNet**Stats**" (the "Stats" span in `--accent-2`), 17px/600.
- Right: nav links **How It Works** (`#how`), **FAQ** (`#faq`) — 14.5px, `--muted`, hover `--text`. (Nav hidden ≤720px.)

### 2. Hero Tool (`.hero` → `.hero-grid`)
Two columns: **stage** (flex) + **300px ad rail**. 28px gap.

**Background — "aurora fade"** (pure CSS, no images/blur/animation): layered radial gradients over the base:
```
radial-gradient(46% 60% at 16% -4%, rgba(124,92,255,0.20) 0%, transparent 60%),
radial-gradient(44% 56% at 78% 4%, rgba(34,211,238,0.18) 0%, transparent 62%),
radial-gradient(38% 48% at 50% -8%, rgba(236,72,153,0.12) 0%, transparent 58%),
radial-gradient(120% 80% at 50% -10%, #0d1a2c 0%, #080d16 48%, #05070c 100%)
```

**Stage** (`.stage`): rounded 20px, subtle top-down white gradient, 1px `--border`, 30px padding, `position:relative`. Internally a 2-col grid (`1.04fr 0.96fr`): **left = text + data**, **right = radar**.

**Stage controls** (`.stage-controls`) — absolutely positioned top:30/right:30, vertical stack, right-aligned, 10px gap:
- **Connection status pill** (`.conn-pill`): mono 12.5px, pill, 7×7px LED dot + glow. States: **good** (cyan, `Connected · {ping}ms`), **wait** (amber, `Connecting…`, blinking LED), **bad** (red, `Offline`).
- **Re-run pill** (`.rerun-pill`): cyan outline pill, rotate-icon SVG + label. Label: idle `Run Test`, running `Scanning…` (disabled, icon spins), done `Re-run Test`.

**Left column:**
- Eyebrow (`.lede`): mono 12.5px, 0.2em tracking, uppercase, `--accent-dim`. Text by phase: `// network scanner ready` / `// scanning network interface` / `// scan complete`.
- H1 (`.headline`): `clamp(30px,3.4vw,44px)`, 600, line-height 1.04, letter-spacing −0.03em, `text-wrap:balance`. Copy: **"How fast is your _internet_, really?"** ("internet" in `--accent-2`).
- Subhead (`.subhead`): 15.5px, `--muted`, max 42ch. "One tap reveals your IP address, connection quality, latency and real-world speed — no app, no sign-up, nothing stored."
- **IP row** (`.ip-row`): card (`.ip-box`) showing label "YOUR IP ADDRESS", the IP at `clamp(20px,2.4vw,27px)`/600 mono, meta line `IPv4 · {ISP} · {city, region, country}`, plus an `IPv6 {addr}` line when present. Beside it, a **Copy** button (`.copy-btn`) — mono, copies the IP, flips to green "Copied" with a check for 1.6s.
- **Readouts grid** (`.readouts`, 2×2, `.ro` cards, min-height 78px): **Ping** (`{n} ms`, sub `{jitter} ms jitter`), **Upload** (`{n} Mbps`, sub "↑ to server"), **Connection** (label e.g. "Wi-Fi"/"4G-class", sub est. downlink), **Download** (`{n} Mbps` in `--accent-2`, sub "↓ from server"). Each value is mono; cards fade/slide in as data reveals.

**Right column — Radar** (`.radar`): square, ≤320px, circular. Layers: 4 concentric rings, crosshair lines, a conic-gradient **sweep** (always spinning slowly `spin 6s`, faster `spin 2.2s` while scanning), an SVG **progress ring** (stroke-dashoffset driven by scan progress 0→1), and a centered readout:
- **Signal bars** (`.sig`): 5 bars, 9px wide, increasing height (16,24,32,40,48px). Active bars colored by quality (`#34d399` good / `#fbbf24` fair / `#f87171` bad), inactive bars `#6f8096` @ 0.22 opacity.
- **Label** (`.big-sig`): sans, `clamp(24px,3.2vw,33px)`/**500**, the quality word (Excellent/Good/Fair/Weak/Poor) in the quality color.
- Caption (`.lbl`): mono 11px uppercase "Wi-Fi Signal".
- Phase line (`.phase`): mono 11px `--accent-dim`, live status ("Pinging…", "Testing download…", etc.).

**Ad rail** (`.rail`, 300px): a **300×600** half-page (`.ad.halfpage`) + a **300×250** rectangle (`.ad.mrec`). Dashed placeholder styling in the prototype — replace with real ad tags. (Placement rationale: right rail on desktop earns well without crowding the tool.)

### 3. How It Works (`#how`)
Eyebrow `// how it works`, H2 "Three steps, about ten seconds", intro, then a 3-col grid (`.how-grid`) of numbered step cards: **01 Detect your IP**, **02 Measure latency**, **03 Test real speed**. (See `gns-content.jsx` for exact copy.)

### 4. Related Tools (`#tools`)
H2 "Every network check in one place", 3-col grid (`.tools-grid`) of 6 link cards (`.tool-card`) each with an icon tile, title + ↗ arrow, and description: IP Address Lookup, Internet Speed Test, Ping & Jitter Test, WHOIS Lookup, DNS Checker, What's My ISP. Internal links (`#…`) — wire to real routes when those tools exist.

### 5. Education (`#learn`)
Two-column (`1.5fr 1fr`): a **prose** column ("What is an IP address?", "IPv4 vs IPv6" with a comparison `<table class="cmp">`, "How to find your IP", "How to hide your IP") + a sticky **note card** (`.note-card`) honestly explaining the Wi-Fi-signal caveat. Anchor ids `#ipv4-ipv6`, `#find-ip`, `#hide-ip` are referenced by the footer.

### 6. FAQ (`#faq`)
H2 "Frequently asked questions" + `<details class="faq-item">` accordion (first item open). 8 Q&As (mirrored in the JSON-LD FAQPage). Custom +/× marker, cyan border when open.

### 7. Footer (`footer.site`)
4-col: brand blurb + Tools / Guides / Company link columns. Bottom row: "© 2026 GetNetStats…" + `getnetstats.com`.

---

## Interactions & Behavior

**Scan state machine** (`phase`: `idle → running → done`), kicked off automatically once on mount and re-triggered by the Re-run pill:
1. Read `getConnection()` (instant) → set Connection readout.
2. Start `getIPInfo()` (+ `getIPv6()`) in parallel → reveal IP card when it resolves; `getIPInfo` failure shows "Unavailable" without aborting the rest.
3. `measurePing()` → reveal Ping; reveal Connection.
4. `measureDownload(onProgress)` → live-updates the radar center number and progress ring (`0.22 → 0.78` of the bar); reveal Download.
5. `measureUpload()` → reveal Upload.
6. Compute `qualityScore`/`qualityLabel` → set the radar signal bars + label; progress → 1; `phase = done`.
7. If no network measurement succeeded, set an error note ("Couldn't reach the measurement servers…"); IP lookup may still work.

**Guards & details:**
- A `running` ref prevents overlapping runs; the Re-run pill is disabled while running.
- Numbers **tween** to their final value (`AnimatedNumber`, cubic ease-out, ~700ms; ~300ms for the live download counter). Use tabular figures so widths don't jitter.
- Reveal animation: cards start `opacity:0; translateY(8px)` → `.in` transitions to visible.
- **Signal bars must remount on quality-category change** — in the prototype the bar group is keyed on the quality class (`key={qcls}`) to force fresh DOM nodes. This works around a real GPU **repaint bug**: because the radar sweep animates continuously (compositor layer), reused sibling nodes kept stale colors. In a production renderer, keying (or otherwise forcing a repaint) on the quality value is the fix.
- **Copy IP**: `navigator.clipboard.writeText` with a graceful fallback; 1.6s "Copied" confirmation.
- **Connection pill** reflects `navigator.onLine` + measured ping + error state (good/wait/bad).
- Respect `prefers-reduced-motion`: gate the radar sweep / entrance animations so reduced-motion users see the resolved state.

**Responsive:**
- **≤1080px:** hero grid → 1 col; ad rail becomes a centered wrapping row (ads `max-width:360px`); content grid → 1 col; note card un-sticks. Ads now sit **below** the tool.
- **≤820px:** stage → 1 col; radar moves above the text (`order:-1`); **stage-controls become static** (a right-aligned row at the top — prevents overlapping the headline); how-grid → 1 col.
- **≤720px:** top nav hidden; stage padding 22px; readouts stay 2-col; **ad rail → centered vertical stack, ads capped ~336px** (skyscraper reflows to a 250px rectangle); footer → 2 col.
- **≤480px:** tools grid → 1 col; IP row stacks; copy button full-width.

---

## State Management
Local component state (prototype uses React `useState`/`useRef`):
- `phase` (`idle|running|done`), `phaseText` (string), `prog` (0–1).
- `ipInfo` (object|null), `ipv6` (string|null), `ipErr` (bool).
- `ping` (`{ping,jitter}`|null), `dlLive` (number, live download), `dl` (number|null), `ul` (number|null), `conn` (`{label,detail}`|null), `quality` (`{score,label,cls,bars}`|null), `netErr` (bool).
- `shown` (per-card reveal booleans: ip/ping/ul/conn/dl).
- `running` ref (re-entrancy guard).

No global store needed. No persistence required (the tool is stateless per visit, no sign-up; nothing is stored — keep that promise). Optional: persist a single most-recent result to `localStorage` if you add history.

---

## Design Tokens
Defined as CSS custom properties (`:root` in `gns-styles.css`):

**Colors**
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#070b12` | page background |
| `--panel` | `rgba(255,255,255,0.028)` | card fill |
| `--panel-2` | `rgba(255,255,255,0.05)` | raised fill |
| `--border` | `rgba(255,255,255,0.07)` | hairline border |
| `--border-2` | `rgba(255,255,255,0.12)` | stronger border |
| `--text` | `#e6edf5` | primary text |
| `--muted` | `#8a99ad` | secondary text |
| `--dim` | `#6f8096` | tertiary / inactive bars |
| `--faint` | `#4a5a70` | ad placeholder text |
| `--accent` | `#22d3ee` | primary cyan |
| `--accent-2` | `#5fe6f7` | bright cyan (highlights) |
| `--accent-dim` | `#46b8cc` | muted cyan (eyebrows) |
| `--good` | `#34d399` | quality good |
| `--warn` | `#fbbf24` | quality fair / connecting |
| `--bad` | `#f87171` | quality poor / offline |
| Aurora | `#7c5cff` violet, `#22d3ee` cyan, `#ec4899` magenta (low alpha) | hero glow |
| Base gradient stops | `#0d1a2c`, `#080d16`, `#05070c` | dark canvas |

**Radius:** `--r-lg:20px`, `--r-md:14px`, `--r-sm:10px`; pills `999px`; logo dot `3px`.
**Layout:** `--maxw:1240px`; ad rail `300px`; section vertical padding `56px`; `.wrap` side padding `28px` (18px ≤720px).
**Type:** `--sans:"Geist"`; `--mono:"Spline Sans Mono"` (tabular figures, for all numeric/technical text). Weights used: 300–700. Notable sizes: H1 `clamp(30px,3.4vw,44px)`, H2 `clamp(24px,2.6vw,32px)`, eyebrow 12–12.5px/0.2em, body 15.5–16px, mono labels 10.5–11px uppercase.
**Motion:** number tween ~700ms cubic ease-out; reveal 0.5s; radar sweep `spin 6s` (idle) / `2.2s` (scanning); progress ring 0.2s linear; bar transitions 0.35s.

**Fonts:** loaded from Google Fonts — `Geist` (300;400;500;600;700) and `Spline Sans Mono` (400;500;600;700). Self-host in production.

---

## SEO (already implemented in `GetNetStats.html`)
Reproduce these in the target framework's head/metadata:
- `<title>`: "What Is My IP Address? Free IP Lookup & Internet Speed Test — GetNetStats"
- Compelling meta description with keywords + CTA; keywords; canonical; robots index,follow; theme-color `#070b12`.
- Open Graph + Twitter card tags.
- **JSON-LD `@graph`**: Organization, WebSite, **WebApplication** (free utility), BreadcrumbList, and **FAQPage** (the 8 FAQs). Keep the FAQPage in sync with the rendered FAQ.
- Semantic headings (one H1, section H2s), `aria-labelledby` on sections, real anchor ids for internal linking.

## Assets
- **No raster/vector image files.** All visuals are CSS (gradients, radar) or inline SVG icons (tool-card icons, copy/rerun/arrow glyphs, the gauge in Option B). The aurora and radar are pure CSS.
- **Fonts:** Geist + Spline Sans Mono (Google Fonts) — self-host for production.
- **Ad slots** are placeholders — integrate the real ad provider (e.g., AdSense/GAM) tags into `.ad.halfpage` (300×600) and `.ad.mrec` (300×250); the mobile stack caps width ~336px.
- The brand mark is a **white rounded square** + wordmark (no logo file needed).

---

## Tools Roadmap & Ad-Slot Mapping

### Ad slots (decided)
- **300×600 half-page (`.ad.halfpage`)** → **Google Ads** (display/AdSense or GAM).
- **300×250 rectangle (`.ad.mrec`)** → **VPN affiliate** creative/link.
- On mobile both stack centered, capped ~336px (skyscraper reflows to a rectangle). Keep the Google slot first in source order so it stays the priority unit on mobile.
- Wire each slot to its own network; don't share a single ad component. Lazy-load below-the-fold ad scripts so they never block the tool's first paint or the measurement run.

### Tier 1 — client-side tools (ship first, NO backend)
Run entirely in the browser like the current tool; reuse `window.GNS` where possible. These are the SEO/ads beachhead and the bridge into VPN search traffic.
- **Ping & Jitter test** (already in the engine — surface as its own page)
- **DNS Leak Test**, **WebRTC Leak Test**, **IPv6 Leak Test** (high-intent, VPN-adjacent)
- **"Am I behind a VPN/proxy?"** heuristic (datacenter ASN + locale/timezone mismatch)
- **Browser/Device Fingerprint viewer**, **My Location (IP vs GPS)**, **What's My Browser / User-Agent**

### Tier 2 — require the serverless backend (see plan below)
WHOIS, DNS checker/propagation, Port checker, Traceroute/MTR, Reverse IP, ASN lookup, Blacklist (RBL) check, SSL/TLS checker, HTTP header inspector, Email auth (SPF/DKIM/DMARC). (Subnet/CIDR calculator is actually client-side but lives in this cluster.)

### VPN layer
Primarily **content + affiliate** (comparison tables, "best VPN", VPN speed-impact test that re-runs the speed test with/without VPN), not a tool. The 300×250 affiliate slot is the monetization hook; leak tests are the traffic driver.

---

## Serverless Backend Plan (Tier 2)

Scope: small, independent functions — one per tool — that wake on request, perform one network task server-side (the reason these can't run in the browser), and return normalized JSON. Scale-to-zero; cost tracks usage.

### Recommended host & runtime
- **Vercel Functions** (or Netlify Functions) alongside the Next.js app — same repo, deploy on push, generous free tier. Routes live under `/api/*`.
- **Caveat that drives a host choice:** Cloudflare Workers **cannot open arbitrary TCP sockets**, so **port-check / traceroute** need a Node runtime that can (Vercel/Netlify Node functions, AWS Lambda, or a small container). Everything else (WHOIS, DNS, SSL, headers, ASN) is fetch-and-parse and runs anywhere.

### Per-function contract (uniform across all tools)
- **Route:** `/api/<tool>` (e.g. `/api/whois`, `/api/dns`, `/api/port-check`).
- **Input:** `GET ?target=<host|ip|domain>&...` (or POST JSON for multi-field tools). Validate before anything else.
- **Success response:**
  ```json
  { "ok": true, "tool": "whois", "target": "example.com",
    "data": { /* normalized, tool-specific */ },
    "cached": false, "tookMs": 142 }
  ```
- **Error response:**
  ```json
  { "ok": false, "error": { "code": "INVALID_TARGET", "message": "…" } }
  ```
- Stable error codes: `INVALID_TARGET`, `BLOCKED_TARGET` (SSRF guard), `RATE_LIMITED`, `UPSTREAM_TIMEOUT`, `UPSTREAM_ERROR`. Front-end renders every tool the same way off this shape.

### Shared helpers to scaffold (build once, reuse everywhere)
1. **`validateTarget(input, { allow: 'domain'|'ip'|'host' })`** — strict parse/normalize; reject malformed input.
2. **SSRF guard `assertPublicTarget(target)`** — resolve and **reject private/reserved/loopback/link-local ranges** (10/8, 172.16/12, 192.168/16, 127/8, 169.254/16, `::1`, fc00::/7, metadata IPs like 169.254.169.254) so a function can't be coerced into hitting internal infra. **This is the single most important task** for port/traceroute/DNS tools.
3. **`withRateLimit(handler, { perIpPerMin })`** — per-IP limiter backed by managed KV/Redis (e.g. **Upstash**) or the host's built-in limiter; return `RATE_LIMITED` with `Retry-After`.
4. **`cached(key, ttl, fn)`** — short TTL cache (WHOIS/DNS ~minutes) to cut cost and upstream load.
5. **`json(res, body, status)`** + **CORS** locked to the site's own origin (functions are not a public API).
6. **`withTimeout(promise, ms)`** — every upstream call bounded; map to `UPSTREAM_TIMEOUT`.

### Third-party intelligence (budget item)
Richer data — VPN/proxy/datacenter detection, accurate geo, ASN, blacklist feeds — typically comes from a paid API (IPinfo / ipdata / MaxMind). **Proxy these through the functions** so keys live in server env vars and never reach the browser. (Current free IP lookups in `gns-net.js` can also be moved server-side for reliability + a server fallback.)

### Ops glue
Env-secret management for API keys; per-function logging + error mapping; the uniform JSON shape; lazy front-end fetch with loading/error states matching the design's reveal pattern.

### Build order (lowest risk → highest)
1. **WHOIS** (`/api/whois`) — easiest, highest intent; sets the pattern (validation + cache + response shape).
2. DNS checker, SSL checker, HTTP headers, ASN lookup (all fetch-and-parse).
3. **Port check / traceroute last** — raw sockets + strict SSRF guard; confirm the chosen host allows TCP sockets.

> Ship **Tier 1 with zero backend first** to validate the SEO/ads model, then add `/api/whois` to prove the serverless pattern before scaling out the rest.

---

## Files in this bundle
- `GetNetStats.html` — document shell + SEO/JSON-LD + script wiring (entry point).
- `gns-styles.css` — full design system + responsive layout.
- `gns-net.js` — measurement engine (`window.GNS`). **Port first, framework-agnostic.**
- `gns-app.jsx` — interactive hero tool + scan state machine + page composition.
- `gns-content.jsx` — How It Works / Related Tools / Education / FAQ / Footer.
- `screenshots/` — high-res reference renders of the final design (desktop):
  - `01-hero-complete.png` — hero in the "scan complete" state (Excellent / green bars)
  - `section-how.png` — How It Works
  - `section-tools.png` — Related Tools grid
  - `section-education.png` — Education (What is an IP / IPv4 vs IPv6 table)
  - `section-faq.png` — FAQ accordion
  - `section-footer.png` — Footer

> Behavior described above should be understood as **recreating these HTML design references** in the target app's environment (or the best-fit framework if starting fresh) — not shipping the HTML directly. Move `gns-net.js` into a typed module/hook, the JSX into real components, and the CSS into the project's styling system (CSS Modules / Tailwind / styled-components), preserving the tokens and motion.
