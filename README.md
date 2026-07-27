# sairam-sundararaman.github.io

Personal / academic site for Sairam Sundararaman. React + Vite + Tailwind v4,
a Three.js loss-landscape hero, anime.js + Motion (motion.dev) for
animation and page transitions, deployed to GitHub Pages automatically on
every push via GitHub Actions.

## One-time setup

Your GitHub Pages repo (`sairam-sundararaman/sairam-sundararaman.github.io`)
currently serves a Jekyll site. This project replaces that. To go live:

1. **Add your headshot**: drop a photo in as `public/headshot.jpg`. It shows
   in full color on the About page (not the homepage). Skip it and the About
   page falls back to a clean "SS" monogram — nothing breaks either way.

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

**To edit it on github.com, no local setup needed:**
1. Go to the repo → open `src/data/content.json`.
2. Click the pencil icon (top right of the file view) to edit.
3. Make your change, scroll down, commit directly to `main`.
4. That commit triggers the Actions workflow automatically — check the
   **Actions** tab, and the live site updates in about a minute.

**Turning any word into a link:** any text field in `content.json` (bio
paragraphs, project bullets, news items, achievements, talks) supports
inline links using `[word or phrase](https://the-url)`, e.g.:
```
"I collaborate with [the WSAI lab](https://wsai.iitm.ac.in/) on this."
```
renders with "the WSAI lab" as a real clickable link, styled to match the
rest of the site. This isn't full markdown — just that one link syntax —
so things like `**bold**` or `*italic*` won't do anything.

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

- **Palette**: one theme throughout — near-black "void" background, off-white
  text, cyan as the only real accent. No cards, no borders-as-boxes, no
  colored pill badges/buttons anywhere — structure comes from type scale,
  spacing, and thin hairline rules instead. Tokens live in `src/index.css`
  under `@theme`.
- **Type**: Roboto Flex at weight 100 / width 151% (its thinnest and widest
  settings, via `font-weight`/`font-stretch` in the `.font-display` rule,
  which map to that variable font's `wght`/`wdth` axes) for all headings;
  DM Sans at weight 300 with `font-optical-sizing: auto` for body copy, so
  its `opsz` axis adjusts automatically between small and large text; IBM
  Plex Mono, unchanged, for dates/tags/metadata. All loaded as variable
  fonts via the Google Fonts `<link>` in `index.html`.
- **The headshot** lives only on the About page, in full color, plain crop.
- **The hero scene** (`src/components/three/OrbitalRings.jsx`) is a quiet
  armillary-sphere-like construct — a few thin rings on different axes,
  turning slowly at their own pace around one still, cyan center point.
  Radius/opacity constants are at the top of that file.
- **Scroll animations**: `src/lib/useRevealOnScroll.js` fades content in as
  it scrolls into view and back out as it leaves — bidirectional, replays
  every time, done with anime.js, kept plain (opacity + a small translateY
  only).
- **Links**: any inline link from `[text](url)` syntax, or the
  Publications/Projects reference links, uses `.link-fill` in
  `src/index.css` — cyan text at rest, and on hover a fill sweeps in behind
  just that word while the text inverts to the background color for
  contrast.
- Routing uses `BrowserRouter` (clean URLs like `/cv`, not `/#/cv`) paired
  with the standard GitHub Pages SPA redirect trick (`public/404.html` +
  a small decode script in `index.html`) so direct links and refreshes on
  `/about` or `/cv` work correctly on Pages.
- Respects `prefers-reduced-motion` throughout — anyone with that OS setting
  gets the finished layout instantly, no motion.
