# Deploying GetNetStats

GetNetStats is a **Next.js (App Router)** app with one server route (`/api/whois`),
so it needs a **Node-capable host**. The recommended path is **GitHub → Vercel**
(auto-deploy on push). Netlify works too with its Next adapter.

> ⚠️ **GitHub Pages won't work alone.** Pages is static-only — it can't run
> `/api/whois` (a serverless Node function; its SSRF guard uses `node:dns`).
> Keep the source on GitHub and deploy from it to Vercel/Netlify.
>
> ⚠️ **Cloudflare Workers/Pages Functions** can't open the `node:dns` lookups
> the SSRF guard uses (and can't open TCP sockets for the future port/traceroute
> tools), so avoid Workers for the API. Vercel/Netlify Node functions are fine.

---

## 1. Push to GitHub

The local repo is already initialized and committed. Create a remote and push:

```bash
# with the GitHub CLI
gh repo create getnetstats --private --source=. --remote=origin --push

# …or manually
git remote add origin https://github.com/<you>/getnetstats.git
git branch -M main
git push -u origin main
```

## 2. Import into Vercel

1. Vercel → **Add New → Project** → import the GitHub repo.
2. Framework preset is auto-detected as **Next.js**. Leave build/output defaults
   (`next build`). No `vercel.json` is required.
3. Add the environment variables below **before** the first deploy.

## 3. Environment variables

Set these in the host's project settings (see [.env.example](.env.example)). All
are optional except `API_ALLOWED_ORIGINS`, which you should set to your real
origin so the API origin-lock is correct in production.

| Variable | Scope | Purpose |
|---|---|---|
| `API_ALLOWED_ORIGINS` | Server | Comma-separated origins allowed to call `/api/*`. Set to `https://getnetstats.com,https://www.getnetstats.com`. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Public | AdSense publisher id (`ca-pub-…`). Unset → placeholder. |
| `NEXT_PUBLIC_ADSENSE_HALFPAGE_SLOT` | Public | AdSense 300×600 slot id. |
| `NEXT_PUBLIC_AFFILIATE_URL` | Public | VPN affiliate destination URL (300×250). |
| `NEXT_PUBLIC_AFFILIATE_IMG` | Public | Affiliate creative image URL. |
| `NEXT_PUBLIC_AFFILIATE_ALT` | Public | Affiliate alt/aria-label text. |

> `NEXT_PUBLIC_*` are inlined into the client bundle at build time — changing
> them requires a redeploy. `API_ALLOWED_ORIGINS` is read at request time.

## 4. Domain

Point `getnetstats.com` (and `www`) at the deployment. If your canonical host
changes, update the hard-coded `https://getnetstats.com` in
[app/layout.tsx](app/layout.tsx), [app/robots.ts](app/robots.ts),
[app/sitemap.ts](app/sitemap.ts), and the per-tool `openGraph.url` values.

---

## 5. Post-deploy verification (the part we can't confirm locally)

These checks confirm the third-party endpoints aren't CORS-blocked from the live
origin and that the API origin-lock behaves. Run after the first deploy.

### a) Third-party CORS (client-side measurement endpoints)
On the **live site**, open the homepage and the ping tool — the hero scan and
`/ping-test` make browser `fetch` calls to:
- `https://ipwho.is/` and `https://ipapi.co/json/` (IP lookup)
- `https://speed.cloudflare.com/__down` / `__up` (ping/download/upload)

Confirm in DevTools → Network that these return **200** with no CORS error, and
that the hero shows a real IP and the radar resolves. If any are blocked on the
production origin, the graceful fallback shows "Unavailable" rather than crashing.

### b) `/api/whois` same-origin success
From the live origin (DevTools console on the deployed site):
```js
await (await fetch('/api/whois?target=example.com')).json()
// → { ok: true, tool: 'whois', target: 'example.com', data: {…}, cached: false, tookMs: … }
```

### c) `/api/whois` cross-origin lock (should be refused)
From a **different** origin (e.g. console on `https://example.com`):
```js
await fetch('https://getnetstats.com/api/whois?target=example.com')
// Browser blocks the cross-origin read (no Access-Control-Allow-Origin),
// and a forged Origin header returns 403 FORBIDDEN.
```

### d) Error shapes
```js
await (await fetch('/api/whois?target=not-a-domain!!')).json() // 400 INVALID_TARGET
await (await fetch('/api/whois?target=example.bd')).json()      // 422 UNSUPPORTED_TLD
```

**Hand me the live URL and I'll run a–d against it.**

---

## Notes / caveats

- **Fonts:** `next/font/google` fetches Geist + Spline Sans Mono at build time —
  the build host needs outbound network (Vercel/Netlify do). Fully air-gapped
  builds would need the font files vendored.
- **Cache & rate-limit are in-memory** (`lib/api/cache.ts`, `lib/api/ratelimit.ts`)
  — per-instance and reset on cold starts. Fine to launch; swap for Upstash/KV
  when traffic warrants (signatures are stable, so callers don't change).
- `/api/whois` is pinned to the **Node runtime** (`export const runtime = "nodejs"`).
