# Osborn — site

Static one-page site. Single self-contained file, no build step, no intro video.

## Files
- `index.html` — the entire site: markup, styles, and scripts inline; images embedded as data URIs.

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
