# sairam-sundararaman.github.io

Personal / academic site for Sairam Sundararaman. React + Vite + Tailwind v4,
a Three.js loss-landscape hero, anime.js for motion, deployed to GitHub Pages
automatically on every push via GitHub Actions.

## One-time setup

Your GitHub Pages repo (`sairam-sundararaman/sairam-sundararaman.github.io`)
currently serves a Jekyll site. This project replaces that. To go live:

1. **Add your headshot** (optional, but you said yes): drop a photo in as
   `public/headshot.jpg`. If you skip this, the hero shows a clean "SS"
   monogram instead — nothing breaks either way.

2. **Push this project to the repo**, replacing what's there now:
   ```bash
   cd sairam-portfolio
   git init
   git remote add origin https://github.com/sairam-sundararaman/sairam-sundararaman.github.io.git
   git add -A
   git commit -m "Rebuild site: React + Vite + Three.js"
   git branch -M main
   git push -u origin main --force
   ```
   (`--force` because it's overwriting the old Jekyll history's branch tip —
   safe to do here since the old site's content is fully carried over into
   this project already, and Git tags/history aren't otherwise needed.)

3. **Turn on GitHub Actions as the Pages source** (only needs doing once):
   repo → **Settings → Pages → Build and deployment → Source → GitHub Actions**.

4. Push triggers the workflow automatically. Check the **Actions** tab for
   progress — first run takes about a minute. Once it's green, the site is
   live at `https://sairam-sundararaman.github.io`.

## Editing content after that

Everything text-based on the site — bio, news, publications, projects,
education, achievements — lives in one file:

```
src/data/content.json
```

Edit it directly in GitHub's web UI (open the file → pencil icon → edit →
commit to `main`), or edit locally and `git push`. Either way, the commit
triggers the Actions workflow, which rebuilds and redeploys automatically.
No local build step is required for content changes.

A few fields to fill in when you're ready:
- `projects[].links.code` / `links.writeup` — empty for now since no repo
  URLs were given; add them and the "Code" / "Write-up" links appear
  automatically.
- `news` / `publications` / `achievements` / `talks` — add new entries the
  same shape as the existing ones; the page re-renders from the array.

## Local development

```bash
npm install
npm run dev
```
Opens a live-reloading preview, usually at `http://localhost:5173`.

```bash
npm run build && npm run preview
```
Builds and serves the production bundle locally — the closest local preview
to what Pages will actually serve.

## Structure

```
src/
  data/content.json        ← the file you'll actually edit day-to-day
  components/
    three/                 ← the 3D loss-landscape hero scene
    ui/                    ← Button, Card, Badge, ContourDivider
    Nav.jsx, Footer.jsx, Hero.jsx, Layout.jsx
    PublicationsSection.jsx, ProjectsSection.jsx
  pages/Home.jsx, About.jsx, CV.jsx
  lib/useRevealOnScroll.js ← scroll-reveal hook (IntersectonObserver + anime.js)
public/
  resume.pdf               ← swap this file to update the downloadable CV
  404.html                 ← GitHub Pages SPA-routing redirect, don't remove
.github/workflows/deploy.yml ← the auto build+deploy workflow
```

## Design notes

- **Palette**: cool paper-white body sections, a near-black "void" hero and
  nav/footer, azure→cyan as the one accent. Tokens live in `src/index.css`
  under `@theme` — change `--color-azure` / `--color-cyan` etc. there to
  retune the whole site's palette from one place.
- **Type**: STIX Two Text (serif, scientific/academic typesetting lineage)
  for headings, IBM Plex Sans for body copy, IBM Plex Mono for dates/tags/
  metadata — all loaded via Google Fonts in `index.html`.
- **The hero mesh** (`src/components/three/LossLandscape.jsx`) is a stand-in
  loss landscape, not a generic decorative blob — a nod to the Hessian/
  loss-surface visualizations in your own projects. `WIDTH`, `DEPTH`,
  `SEG_X`, `SEG_Y` at the top of that file control its size/density if you
  want it larger, smaller, or more/less detailed; the `LOW`/`HIGH` constants
  control its color gradient.
- Routing uses `BrowserRouter` (clean URLs like `/cv`, not `/#/cv`) paired
  with the standard GitHub Pages SPA redirect trick (`public/404.html` +
  a small decode script in `index.html`) so direct links and refreshes on
  `/about` or `/cv` work correctly on Pages.
- Respects `prefers-reduced-motion` throughout — anyone with that OS setting
  gets the finished layout instantly, no motion.
