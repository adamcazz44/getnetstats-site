# Deploying GetNetStats — Tier 1 on GitHub Pages

**Production scope = Tier 1 only:** the landing page (hero IP + speed-test tool,
content hub, Education, FAQ, SEO) and the client-side **`/ping-test`** tool.

Tier 1 is **fully client-side** — no server routes — so it deploys as a **static
export** to **GitHub Pages**. `next build` with `output: "export"` writes the
site to `./out`, and a GitHub Actions workflow publishes it.

> **GitHub Pages is static-only and can't run Tier 2** (`/api/whois` needs a Node
> serverless runtime). Tier 2 lives on the **`tier2-prep`** branch and is **not**
> deployed by this workflow — keep it for a serverless host (e.g. Vercel) later.

---

## What's already configured in the repo

- [next.config.ts](next.config.ts) — `output: "export"`, `images.unoptimized`,
  `trailingSlash: true` (clean URLs resolve on a static host), optional
  `PAGES_BASE_PATH`.
- [public/.nojekyll](public/.nojekyll) — stops GitHub from running Jekyll, which
  would otherwise strip Next's `_next/` asset folder.
- [public/CNAME](public/CNAME) — pins the custom domain `getnetstats.com` (so an
  Actions deploy doesn't wipe it).
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — builds `main`
  and deploys `./out` to Pages on every push.

## 1. Push to GitHub

```bash
# create the repo and push main (Tier 1)
gh repo create getnetstats --public --source=. --remote=origin --push
# preserve the Tier 2 branch too (it just won't deploy to Pages)
git push -u origin tier2-prep
```
> Pages on a **private** repo requires GitHub Pro/Team. For a free account, make
> the repo **public** (above) — there are no secrets in the Tier 1 code.

## 2. Enable Pages → Source = "GitHub Actions"

Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

That's the answer to "which branch": with the Actions source you **build from
`main`** — you do **not** need a `gh-pages` branch (that legacy mode would mean
committing the built `out/` folder, which we avoid). The workflow triggers on
every push to `main`; watch it under the repo's **Actions** tab.

## 3. Custom domain (recommended)

The whole site (canonical URLs, OG tags, sitemap) is built around
`https://getnetstats.com`, so use the custom domain:

1. **Settings → Pages → Custom domain** → enter `getnetstats.com` → Save.
   (`public/CNAME` already sets this; the field just confirms + provisions TLS.)
2. **DNS** at your registrar:
   - Apex `getnetstats.com` → four `A` records to GitHub Pages:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (and the matching `AAAA` records if you want IPv6).
   - `www.getnetstats.com` → `CNAME` → `<your-user>.github.io`.
3. Tick **Enforce HTTPS** once the cert is issued.

### Alternative: no custom domain (project URL)
To serve at `https://<user>.github.io/getnetstats/` instead, set a repo
**Variable** `PAGES_BASE_PATH=/getnetstats`, **delete `public/CNAME`**, and update
the hard-coded `https://getnetstats.com` in [app/layout.tsx](app/layout.tsx),
[app/robots.ts](app/robots.ts) and [app/sitemap.ts](app/sitemap.ts) to that URL —
otherwise the canonical/sitemap links point at the wrong host. The custom domain
avoids all of this.

## 4. Real ad tags (optional)

Ad slots render placeholders until configured. To activate them, add repository
**Variables** (Settings → Secrets and variables → Actions → **Variables**) — the
workflow already passes them into the build:
`NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_HALFPAGE_SLOT`,
`NEXT_PUBLIC_AFFILIATE_URL`, `NEXT_PUBLIC_AFFILIATE_IMG`, `NEXT_PUBLIC_AFFILIATE_ALT`.
These are build-time, so changing them needs a re-run of the workflow.

---

## 5. Post-deploy verification (send me the live URL and I'll run these)

The live measurement endpoints are third-party; this confirms they aren't
CORS-blocked from the production origin.

- **a) Homepage hero** — `/` shows a **real public IP + ISP + location** (not
  "Unavailable"), the radar resolves to a quality, and Ping/Upload/Download/
  Connection fill in. Network tab: `ipwho.is` (or `ipapi.co`),
  `speed.cloudflare.com/__down` and `/__up` return **200** with no CORS error.
- **b) `/ping-test`** — live run completes (median/jitter/best-worst/loss + bars).
- **c) Graceful fallback** — if an endpoint is blocked, the tool degrades to
  "Unavailable"/network-error note rather than crashing (built in).
- **d) SEO surfaces** — `/robots.txt` and `/sitemap.xml` resolve; sitemap lists
  only `/` and `/ping-test`; the homepage `<head>` has title/description/JSON-LD.

---

## Notes / caveats

- **Fonts:** `next/font/google` fetches Geist + Spline Sans Mono at build time —
  the Actions runner has network, so this works in CI.
- **No server routes on `main`** — nothing must succeed server-side; ad scripts
  lazy-load and never block first paint or the scan.
- **SPA routing:** `trailingSlash: true` emits `/<route>/index.html`, so deep
  links like `/ping-test/` resolve directly on Pages.
