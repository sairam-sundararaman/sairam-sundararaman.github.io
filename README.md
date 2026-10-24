# 間 · sairam-sundararaman.github.io

A portfolio and blog for an ML researcher, built on three ideas: **ma** (the interval; negative space is the material), **Ando** (framed openings, light and shadow, plain surfaces), and the **golden ratio** as the one proportion that governs layout, type and spacing.

Two parts live in this repo:

| Folder | What | Where it runs |
|---|---|---|
| `/` | The site: Astro, MDX, KaTeX, no client JavaScript framework | GitHub Pages |
| `worker/` | Your own analytics: collector, login, dashboard | Cloudflare Workers + D1 (free tier) |

## Install over your existing repo

```bash
cd path/to/your/repo                       # the folder that contains .git
git checkout -b remake
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +    # removes the old React/Vite site
unzip ~/Downloads/site-remake.zip -d .
npm install
npm run dev                                # http://localhost:4321
```

In the GitHub repo, **Settings → Pages → Source** must be **GitHub Actions** (the included workflow builds and deploys on every push to `main`).

Requires Node 22.22 or newer (`.nvmrc` says 22).

## Writing

Create `src/content/writing/my-post.mdx`:

```mdx
---
title: "Why the bit-collapse spikes the Hessian"
description: "One sentence for the list page, search results and link previews."
date: 2026-11-02
tags: [quantization, sharpness]
draft: false          # drafts show in `npm run dev` only
---

Inline math $\varepsilon$, display math:

$$
\rho = \frac{\Delta^2}{2\sigma^2}
$$

A claim with a margin note.<Sidenote>Sidenotes sit in the margin on wide screens and tap open on phones.</Sidenote>
Cite with `[@dwork2006calibrating]` or `[@a; @b]` (entries live in `src/content/references.bib`).

<Figure src="/images/plot.png" alt="Loss surface" caption="Figure 1. ..." wide />
```

Push to `main` and it is live. `src/content/writing/template.mdx` is a draft that shows every feature; delete it when you no longer need it. Each post gets a link-preview image, an RSS entry and a sitemap entry automatically. Images go in `public/images/`.

Everything that is not a post (bio, projects, news, links) is in `src/data/site.ts`.

## Analytics (private dashboard)

The site sends one tiny beacon per page view (the path, nothing else). A Cloudflare Worker counts it and serves a login-protected dashboard: views and visitors over time, and a map plus ranking of countries and cities.

**What is stored:** daily totals per page, country and city (city coordinates rounded to ~11 km). That is all. No IP addresses, no per-visit rows, no cookies. To count a visitor once per day, the Worker keeps a hash of `daily random salt + IP + user agent`; the salt and the hashes of past days are deleted automatically, so old hashes can never be re-derived. Do Not Track and Global Privacy Control are honoured in the browser and again on the server. Bots are filtered by user agent. The About page states all of this to visitors once analytics is switched on.

### One-time setup

You need a free Cloudflare account. No domain is required.

```bash
cd worker
npm install
npx wrangler login
npx wrangler d1 create ma-stats        # prints a database_id: paste it into worker/wrangler.toml
npx wrangler d1 execute ma-stats --remote --file=schema.sql
npx wrangler deploy                    # prints https://ma-stats.<your-subdomain>.workers.dev
npx wrangler secret put DASH_PASSWORD  # the dashboard password
npx wrangler secret put SESSION_SECRET # any long random string, e.g. output of: openssl rand -hex 32
```

Then in GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**:
`PUBLIC_STATS_ENDPOINT` = `https://ma-stats.<your-subdomain>.workers.dev/collect`, and re-run the **Deploy site** workflow.

Open `https://ma-stats.<your-subdomain>.workers.dev/` to sign in. Visit your site once with **`/?notrack`** on each of your own devices so you do not count yourself (`/?track` undoes it).

Optional: `.github/workflows/worker.yml` deploys the Worker from GitHub. Run it manually from the Actions tab; it needs two repository secrets, `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Deploying from your laptop with `npx wrangler deploy` works just as well.

### Things to know

- **Undercounting.** The beacon goes to a different origin (`workers.dev`), so visitors using ad blockers will not be counted. A custom domain later (about $10 a year) lets the collector be first-party, which blockers hit less. Treat the numbers as a floor.
- **"Visitors" are per day.** A returning visitor counts once per day, so a 30-day total is visitor-days, and the dashboard labels it that way.
- **Free tier.** Cloudflare enforces daily row-read and row-write limits on D1's free plan. Each page view costs a couple of row writes and the dashboard reads daily aggregates, so personal-site traffic is far below the limits. If a limit is ever hit, counting pauses until midnight UTC; the site itself is never affected, because the beacon is fire-and-forget.
- **Location accuracy.** Country and city come from Cloudflare's IP geolocation. Treat the city as approximate.
- **Local testing.** `cp .dev.vars.example .dev.vars`, then `npx wrangler d1 execute ma-stats --local --file=schema.sql` and `npm run dev`. Locally every request is placed in Austin, US, because there is no real geolocation.

## Design system

Everything is in `src/styles/global.css` (the dashboard reuses the same tokens in `worker/public/dash.css`).

- **Layout.** The page is a golden rectangle (1262 × 780 at full width) that splits into a square and a 1 : φ column; the same split repeats down the page (label and lead on the major side, content in the minor column). The spiral is never drawn: it only decides where things sit. Portraits and figures are 1 : φ openings on a tonal plane.
- **Spacing.** Fibonacci: 8, 13, 21, 34, 55, 89, 144 px.
- **Type.** Source Serif 4 (variable, optical sizes) for display and text; Geist Mono for labels, code and figures. A 17 px base with φ every two steps (17, 21.6, 27.5, 35, 44.5, 56.6, 72, 91.6, 116 px). Body line-height is φ. Weight eases slightly in dark mode. Fonts are self-hosted: the site makes no third-party requests.
- **Palette.** Concrete tones plus one indigo accent (OKLCH hue 265°, chroma 0.15; lightness 0.47 on light, 0.70 on dark). Contrast against the ground:

  | | Light | Dark |
  |---|---|---|
  | Ground | `#E8E6E1` | `#121211` |
  | Tone (apertures) | `#C9C5BC` | `#1F1F1D` |
  | Ink | `#1C1C1B` · 13.7:1 | `#E8E6E1` · 15.0:1 |
  | Mute | `#5F5E5A` · 5.2:1 | `#A3A19B` · 7.3:1 |
  | Accent | `#3054AE` · 5.6:1 | `#719CFD` · 7.0:1 |

  The accent stays at or above 5.05:1 on light and 6.6:1 on dark under simulated protan, deutan and tritan vision. It covers under about 3% of any screen and never carries meaning alone (links are also underlined).
- **Themes.** Light and dark follow the system setting; the toggle in the header stores an override.
- **Motion.** Stillness: a fade on page load and a cross-fade between pages. Both are disabled for `prefers-reduced-motion`.
- **Mark.** 間 (a gate with light in it), outlined to an SVG path, so no CJK font is ever loaded.

## Decision log

You chose: Astro; the Japanese tradition (ma, Ando) as the anchor; φ over √2/tatami after seeing both; an invisible spiral; light and dark following the system; a portrait-only, non-animated hero; stillness (fades only) for motion; the site map Home / Writing / About with research on Home; KaTeX with sidenotes and BibTeX citations; 間 as the mark; a private dashboard with views and visitors over time plus a country and city map, storing country and city.

Delegated to me, and worth a second look: frames as apertures with tone instead of lines; the indigo accent; the type pairing; GitHub Pages plus a Cloudflare Worker for analytics (free, URL unchanged).

## Not verified

- The Worker was tested locally (wrangler dev, local D1, a real browser sending beacons) but has not been deployed to Cloudflare. Real geolocation only exists there.
- The site was checked in Chromium at 1440 and 390 px, light and dark. Not in Safari or Firefox.
- The GitHub Actions workflows have not been run.
