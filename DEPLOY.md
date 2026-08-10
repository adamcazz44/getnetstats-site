# Deploying GetNetStats — Tier 1 on GitHub Pages (GitHub Actions, since 2026-08-10)

**Production scope = Tier 1 only:** the landing page (hero IP + speed-test tool,
content hub, Education, FAQ, SEO) and the client-side **`/ping-test`** tool.

Tier 1 is **fully client-side** — no server routes — so it's a **static export**
published to GitHub Pages. Since 2026-08-10 that export is built and deployed by a
**GitHub Actions workflow on every push to `main`** (see the box below); it is no
longer uploaded by hand.

> GitHub Pages is static-only and can't run Tier 2 (`/api/whois` needs a Node
> serverless runtime). Tier 2 stays on the **`tier2-prep`** branch, unaffected.

---

> ## ⚠️ THIS PROCESS CHANGED ON 2026-08-10 — read this box first
>
> **Deploy is now `git push`. Do NOT upload files by hand any more.**
> `.github/workflows/deploy.yml` builds the site on GitHub and publishes it, with
> guard rails that fail the build rather than republish a mistake.
>
> **Why it changed.** The manual upload below was done wrong at least once: instead of
> the *contents* of `out/`, a whole-project upload published 25 stray
> `index (N).html` browser downloads, the `out/` folder itself (serving a **stale old
> homepage** at `/out/`), the entire source tree, and
> **`GetNetStats-YouTube-Kit.md` — a file `.gitignore` says must never reach a public
> remote.**
>
> **The lesson worth remembering: `.gitignore` protects nothing when you deploy by
> dragging files into a web uploader.** It is a git mechanism; the uploader never reads
> it. Deploying by `git push` is what makes it actually protect you.
>
> **The new process, in full:**
> 1. `npm run build` locally if you want to check it (optional — CI builds it too).
> 2. `git add -A && git commit -m "..." && git push`
> 3. Watch the **Actions** tab. Green = live in ~2 minutes. Red = nothing was published,
>    and the log says which check failed.
>
> **Pages must be set to Settings → Pages → Source: _GitHub Actions_** (not "Deploy from
> a branch"). If it is ever switched back to branch/root, this workflow stops taking
> effect and the site freezes at whatever files are in the repo.
>
> Sections 1–4 below describe the **old, retired** manual process. They are kept only
> because the build details and the `.nojekyll` / `CNAME` notes are still accurate and
> still worth understanding. **Do not follow step 3.**

---

## 1. Build the static export

```bash
npm run build          # next build with output: "export"
```
This writes the site to **`./out`**. It already contains the two files Pages
needs — both generated from `public/`, so every rebuild keeps them:
- **`.nojekyll`** — without it, Pages runs Jekyll and ignores the `_next/`
  folder, so all CSS/JS 404.
- **`CNAME`** → `getnetstats.com` — pins the custom domain.

## 2. Verify locally (optional but recommended)

```bash
npx serve out -l 3001          # serve the export as static files
# open http://localhost:3001 — the hero scan + /ping-test should work,
# with no missing-asset/console errors.
```

## 3. Upload to the Pages repo

Upload the **contents of `out/`** to the **root** of your Pages repo/branch — not
the `out/` folder itself. After upload, the repo root should look like:

```
.nojekyll
CNAME
404.html
404/
index.html
ping-test/
robots.txt
sitemap.xml
_next/
index.txt
ping-test/index.txt
```

Either drag these into the GitHub web uploader (Add file → Upload files), or copy
them into a local clone and `git add . && git commit && git push`.

> Make sure **`.nojekyll`** uploads — the web UI sometimes hides dotfiles. If
> CSS/JS 404 after deploy, a missing `.nojekyll` is almost always why.

## 4. Pages setting

Repo **Settings → Pages → Build and deployment**:
- **Source: Deploy from a branch**
- **Branch:** the branch you uploaded to (e.g. `main`) · **folder: `/ (root)`**

(We're serving prebuilt files, so this is the branch/root mode — not "GitHub
Actions".)

## 5. Custom domain (apex root)

Serving at the apex `getnetstats.com` is what the build assumes — `basePath` and
`assetPrefix` are **empty (root)**, so assets are referenced as `/_next/...`.

1. **Settings → Pages → Custom domain** → `getnetstats.com` (the uploaded `CNAME`
   already sets this).
2. **DNS** at your registrar:
   - apex `getnetstats.com` → A records `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153` (+ matching `AAAA` for IPv6 if wanted).
   - `www` → CNAME → `<your-user>.github.io`.
3. Tick **Enforce HTTPS** once the cert issues.

### ⚠️ What breaks if you serve at `username.github.io/getnetstats` instead
A project subpath is **not** root, so this build would break there:
- **All assets 404.** Asset URLs are root-relative (`/_next/...`); under a subpath
  the browser requests `username.github.io/_next/...` (wrong) instead of
  `.../getnetstats/_next/...`. CSS/JS won't load → unstyled, non-functional page.
- **Canonical/OG/sitemap/robots point at the wrong host** (they're hard-coded to
  `https://getnetstats.com`).
- **The `CNAME` file conflicts** with a non-custom-domain setup.

To use a subpath you'd rebuild with `PAGES_BASE_PATH=/getnetstats`, **delete
`out/CNAME`**, and change `https://getnetstats.com` in `app/layout.tsx`,
`app/robots.ts`, `app/sitemap.ts` to the github.io URL. The apex custom domain
avoids all of this — recommended.

---

## Post-deploy checks (send me the live URL and I'll run them)

- **a)** `/` shows a real IP + ISP + location; radar resolves; Cloudflare/ipwho
  endpoints return 200 with no CORS error (the graceful "Unavailable" fallback
  covers a blocked endpoint).
- **b)** `/ping-test` completes a live run.
- **c)** `/robots.txt` + `/sitemap.xml` resolve; sitemap lists only `/` and
  `/ping-test`; homepage `<head>` has title/description/JSON-LD.
