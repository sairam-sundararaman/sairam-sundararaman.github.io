# sairam-sundararaman.github.io

React + TypeScript + Vite + Framer Motion + React Router. **All text and links live in `src/content.ts`.**

```
npm install
npm run dev      # local preview
npm run build    # type-check + production build (also writes dist/404.html for client-side routing)
```

The hero is a canvas simulation (`src/Landscape.tsx`): a toy 2D loss landscape with a sharp and a flat minimum. SGD, Momentum and SAM descend from wherever you click.

## Deploy
1. Back up the old site: `git checkout -b old-jekyll && git push origin old-jekyll`
2. On `main`, remove the Jekyll files and copy this project in (including `.github/` and `.gitignore`), then commit and push.
3. GitHub → Settings → Pages → Source: **GitHub Actions**.

Replace `public/resume.pdf` to update the résumé.
