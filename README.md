# Osborn — site

Static one-page site. No build step.

## Files
- `index.html` — markup
- `style.css` — styles
- `script.js` — smooth scroll, wave indicator, disclosure panel, preloader
- `assets/` — images (+ your `intro.mp4`)

## Add the intro video
Put your intro clip at `assets/intro.mp4` (H.264 .mp4, muted-friendly).
If the file is missing the site still works — the intro is just skipped.
Recommended web export: 1080p or 1440p, ~2–5 MB, H.264, faststart.

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server
```
then visit http://localhost:8000

## Deploy (Vercel)
1. Push this folder to a GitHub repo.
2. vercel.com → New Project → import the repo → Deploy.
Static site, no settings needed.
