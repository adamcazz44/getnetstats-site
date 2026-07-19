# F2 — Guide-page visuals — session scope

**Source:** Mobbin audit finding F2, `docs/mobbin-audit-2026-07-19.md`. 11 of 12 guides
have zero in-body visuals (only `vpn-guide` has one, a video thumbnail). Deferred at audit
time as its own session — this is that session's plan, written before building anything.

**Status (2026-07-19):** Phase 1 BUILT — commit `1fa4a5e`. 3 pilot guides done
(`ping-vs-jitter`, `what-is-a-good-internet-speed`, `what-is-an-ip-address`), verified at
375px/1280px, typecheck clean. **Adjustment from the original plan below:** none of the 3
pilots actually needed `IconRow` or `FlowDiagram` (they needed a waveform comparison, a bar
chart, and a branching network map instead), so only `JitterWaveform`, `LabeledBars`, and
`HomeNetworkMap` got built — building the other two primitives speculatively, before a real
guide needed them, would've been premature. **This is the check-in point** — confirm the
style lands before Phase 2 (the remaining 8 guides, which do need `IconRow` for device/
connection-type rows and `FlowDiagram` for the DNS lookup flow).

## Goal

Give each of the 11 text-only guides one lede visual that illustrates its own content —
not decoration, not stock photography. "Done" = every guide has a diagram a reader
actually uses to understand the page faster, in the site's existing visual language.

## Recommended approach: custom inline SVG, not photos/stock art

GetNetStats already has a "simple shapes only" icon system (`components/RelatedTools.tsx`'s
`Ic()` helper: `viewBox 0 0 24 24`, `stroke="currentColor"`, `strokeWidth 1.7`, round caps/joins)
plus two bespoke SVG components already built to this pattern — `Radar.tsx` (uses the brand
tokens `#34d399`/`#fbbf24`/`#f87171` directly as stroke colors) and `EkgLine.tsx` (a tiling
waveform trace). The diagrams below extend that exact language — bigger compositions of the
same simple stroke shapes, not a new illustration style.

**Why not stock/AI-generated images:** the brand voice is "honest, sourced, never hype-y";
generic stock photography (person at laptop, abstract network globe) would look like every
other network-tools site and add nothing a reader can actually parse. Custom SVG line-art also
costs nothing per-guide (no image sourcing, no licensing, tiny file size, crisp at any zoom) and
matches the technical/dashboard aesthetic the rest of the site already commits to. Flag if you'd
rather go a different direction — this is a recommendation, not a lock-in.

**Accessibility:** every diagram gets a real caption, not just an SVG floating with no text
equivalent. Reuse the existing `.guide-video` / `.guide-figcap` pattern (already on `vpn-guide`)
as `<figure className="guide-diagram"><svg aria-hidden="true">...</svg><figcaption className="guide-figcap">...</figcaption></figure>` —
the figcaption carries the meaning, the SVG is decorative from a screen-reader's perspective.

## Technical shape: a few shared primitives, not 11 bespoke one-offs

Rather than hand-building 11 unrelated SVGs, three of the concepts below are genuinely novel
shapes and eight of them reduce to 2-3 reusable primitive components:

- **`IconRow`** — a horizontal row of labeled line-icons (reused by 4 guides: device types,
  connection types, record-type legend, three-privacy-paths comparison).
- **`FlowDiagram`** — nodes connected by arrows, 2-4 steps (reused by 2 guides: DNS lookup,
  network-of-networks).
- **`LabeledBars`** — horizontal bar rows with a value label, using the brand's cyan/green/amber
  scale (reused by 1 guide directly, and is the same shape as extending `Radar.tsx`'s color map).

Building these as small configurable components (not copy-pasted per guide) means guide #4 in a
category is nearly free once the primitive exists — this is what keeps 11 diagrams to roughly the
effort of 4-5 truly custom builds.

## Per-guide diagram concepts (content-matched, no invented facts)

Every concept below is drawn directly from that guide's existing copy — nothing here states a
number or claim the guide doesn't already make.

| Guide | Diagram concept | Primitive | Placement |
|---|---|---|---|
| `ping-vs-jitter` | Two waveform traces: one steady/regular pulse (low jitter), one irregular/spiky pulse (high jitter), labeled | extends `EkgLine.tsx` | after "What is jitter?" |
| `what-is-a-good-internet-speed` | Horizontal bar chart of the guide's own stated Mbps ranges per activity (browsing 5-10, HD stream 5-10, 4K 25, calls 3-5, gaming 3-6, WFH 50-100+) | `LabeledBars` | after "A good speed depends entirely on what you do" |
| `why-is-my-wifi-slow` | Router radiating signal-bar rings, weakening through 2-3 wall barriers to a device — reuses the site's own signal-bar/radar motif | new (small, radar-adjacent) | after "First, find out where the problem actually is" |
| `what-is-an-ip-address` | Home network diagram: 2-3 device icons with private IPs (192.168.x.x) behind a router icon, router labeled with the public IP going out to "the internet" | `FlowDiagram`-adjacent | after "Public vs. private — two different addresses" |
| `what-is-a-dns-record` | 3-node flow: domain name → DNS resolver → IP address | `FlowDiagram` | after "The problem DNS solves" |
| `wifi-vs-ethernet` | Two-column icon comparison: cable→device (Ethernet) vs radio-waves→device (Wi-Fi), matching the "Where Ethernet wins / Where Wi-Fi wins" sections already there | `IconRow` (2-wide) | after "What each one is" |
| `hide-your-ip-address` | Three paths from "you" to "the internet" — VPN / Proxy / Tor — each a distinct line style, matching the "three main ways" section | `IconRow`/`FlowDiagram` hybrid | after "The three main ways" heading |
| `ipv4-vs-ipv6` | Two address strings in mono type (short dotted vs long colon-hex) side by side, plus a small illustrative (clearly-labeled-as-illustrative) size-contrast bar for "4.3 billion vs 340 undecillion" | new, simple | after "What they look like" |
| `what-is-an-isp` | Row of 6 connection-type icons: fiber, cable, DSL, fixed wireless, satellite, mobile — matching the existing bullet list | `IconRow` (6-wide) | after "The main types of ISP connection" |
| `what-is-an-asn` | Several network-cloud icons (generic, unlabeled with real company names) interconnected by lines, each tagged "AS####" — visualizes "thousands of independent networks interconnected" | `FlowDiagram`-adjacent (mesh, not linear) | after "The internet is a network of networks" |
| `find-your-ip-address` | Row of 4 device icons (Windows/macOS/iPhone/Android) each with a small arrow into a settings icon | `IconRow` (4-wide) | after "First: which IP do you want?" |

## Suggested phasing (matches your "phased delivery, check in after each phase" preference)

1. **Phase 1 — primitives + 3-guide pilot.** Build `IconRow`, `FlowDiagram`, `LabeledBars` as
   real components, then wire the 3 cheapest/highest-value guides that prove each primitive:
   `ping-vs-jitter` (extends existing `EkgLine`), `what-is-a-good-internet-speed` (real bar chart
   of already-stated numbers — probably the single best reader value), `what-is-an-ip-address`
   (the site's highest-traffic-adjacent guide topic). Check in before continuing — confirms the
   visual style lands before committing to all 11.
2. **Phase 2 — remaining 8 guides**, reusing the now-proven primitives. Should move faster than
   Phase 1 since the shapes already exist.
3. **Validate** — build, typecheck, screenshot each new guide at desktop + mobile widths, confirm
   `prefers-reduced-motion` is respected if any diagram animates (none are planned to, keeping
   these static keeps the effort down and avoids a11y edge cases).

## What "done" looks like

- All 11 guides have one diagram + figcaption, matching this table.
- No new brand tokens invented — every color pulled from `app/globals.css`'s existing `:root` vars.
- No stated numbers/claims beyond what each guide's own text already says.
- Screenshots at 375px and 1440px per guide, confirming no overflow (this codebase's shared-CSS
  trap history makes that check non-optional) and that `.prose`'s scoped 50ch cap (added in the
  2026-07-19 audit fix pass) doesn't awkwardly squeeze a wide diagram — diagrams should sit as
  direct children of `.prose` alongside `.guide-video`, which is exempt from that cap.
- Cross-site flag from the audit stays open: PetPickHQ has the identical "guides with zero
  visuals" gap — not in scope for this GetNetStats session, but worth remembering when that
  site's own visuals pass comes up.

## Effort estimate

Roughly one focused session: Phase 1 (3 primitives + 3 pilot guides) is the bulk of the design
thinking; Phase 2 (8 more guides) is largely mechanical composition once the primitives exist —
similar shape to today's "Last reviewed" pass across 12 files, just with more per-file content.
