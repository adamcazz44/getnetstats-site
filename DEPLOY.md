# Deploying GetNetStats — Tier 1 launch

**Production scope = Tier 1 only:** the landing page (hero IP + speed-test tool,
content hub, Education, FAQ, SEO) and the client-side **`/ping-test`** tool.

Tier 1 is **fully client-side** — there are **no server routes** on `main`. Every
measurement is a browser `fetch` to a third-party endpoint, so the site is static
+ client JS and can deploy to any static-capable host.

> **Tier 2 lives on the `tier2-prep` branch**, not `main`. `/api/whois`,
> `lib/api/*`, `lib/whois/*` and the `/whois` page are preserved there and get
> their own preview deploys. They never ship from `main`. Don't set `main`'s
> production branch to anything else.

---

## 1. Push to GitHub

The local repo has two branches: `main` (Tier 1 launch) and `tier2-prep`
(Tier 2 work). Create the remote and push **both** so nothing is lost:

```bash
# with the GitHub CLI (pushes the current branch, main)
gh repo create getnetstats --private --source=. --remote=origin --push
git push -u origin tier2-prep        # preserve the Tier 2 branch too

# …or manually
git remote add origin https://github.com/<you>/getnetstats.git
git push -u origin main
git push -u origin tier2-prep
```

## 2. Import into Vercel

1. Vercel → **Add New → Project** → import the repo.
2. Framework preset auto-detects as **Next.js**; leave build defaults (`next build`).
3. **Production branch = `main`.** `tier2-prep` will get preview deployments
   automatically — that's where Tier 2 can be exercised without touching prod.

## 3. Environment variables (all optional)

Tier 1 needs **no backend env vars**. The only env is for real ad tags — unset
them and the slots render the dashed placeholder. See [.env.example](.env.example).

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher id (`ca-pub-…`) |
| `NEXT_PUBLIC_ADSENSE_HALFPAGE_SLOT` | AdSense 300×600 slot id |
| `NEXT_PUBLIC_AFFILIATE_URL` | VPN affiliate destination (300×250) |
| `NEXT_PUBLIC_AFFILIATE_IMG` | Affiliate creative image URL |
| `NEXT_PUBLIC_AFFILIATE_ALT` | Affiliate alt/aria-label |

> `NEXT_PUBLIC_*` are inlined at build time — changing them requires a redeploy.

## 4. Domain

Point `getnetstats.com` (+ `www`) at the deployment. If the canonical host
changes, update the hard-coded `https://getnetstats.com` in
[app/layout.tsx](app/layout.tsx), [app/robots.ts](app/robots.ts) and
[app/sitemap.ts](app/sitemap.ts).

---

## 5. Post-deploy verification (the part we can't confirm locally)

The live measurement endpoints are third-party; this confirms they aren't
CORS-blocked from the production origin. Run after the first deploy — **send me
the live URL and I'll run these against it.**

### a) Homepage hero (IP + speed test)
Open `/` on the live site. Confirm:
- The hero shows a **real public IP + ISP + location** (not "Unavailable").
- The radar resolves to a quality (Excellent/Good/…) and the readouts fill in
  (Ping, Upload, Download, Connection).
- DevTools → Network: these return **200** with no CORS error —
  `https://ipwho.is/` (or fallback `https://ipapi.co/json/`),
  `https://speed.cloudflare.com/__down`, `https://speed.cloudflare.com/__up`.

### b) `/ping-test`
Open `/ping-test`. Confirm the live run completes — median latency, jitter,
best/worst and packet-loss populate, and the sample-history bars fill in.

### c) Graceful fallback (resilience)
If any measurement endpoint is unreachable from the host, the tool must degrade
to **"Unavailable"** (IP) / show the network-error note rather than crash. This
fallback is built in — verify it still reads cleanly if you can simulate a block.

### d) SEO surfaces
`/robots.txt` and `/sitemap.xml` resolve; `sitemap.xml` lists only `/` and
`/ping-test`; the homepage `<head>` has the title, description and JSON-LD.

---

## Notes / caveats

- **Fonts:** `next/font/google` fetches Geist + Spline Sans Mono at build time —
  the build host needs outbound network (Vercel does).
- **No server routes on `main`** — nothing must "succeed" server-side for the
  site to work. Ad scripts lazy-load and never block first paint or the scan.
