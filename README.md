# Osborn — site

Static one-page site. Single self-contained file, no build step.

## Files
- `index.html` — the entire site: markup, styles, and scripts inline; images and the intro video embedded as data URIs (~14MB total).

## Intro preloader
On first paint the hero video (1080p H.264, ~13MB embedded) is paused on its first frame while a real loading percentage (glass-pill numerals, top-right Skip button) tracks the page's own images + video actually becoming ready — smoothed so it never jumps. Once ready, the percentage dissolves and the video plays (with a brief ease-in ramp on `playbackRate`); when it ends, the rest of the UI (nav, status bar, hero copy) fades in and scroll unlocks. Scroll is locked for the whole sequence; Skip jumps straight to the end at any point. Respects `prefers-reduced-motion` and degrades gracefully with JS disabled (see the `<noscript>` block).

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server
```
then visit http://localhost:8000

## Deploy (Vercel)
1. Push to a GitHub repo.
2. vercel.com → New Project → import the repo → Deploy.
Static site, no settings needed. Every push to `main` redeploys.
