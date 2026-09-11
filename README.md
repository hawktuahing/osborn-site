# Osborn — site

Static one-page site. Single self-contained file, no build step.

## Files
- `index.html` — the entire site: markup, styles, and scripts inline; images and the intro video embedded as data URIs (~34MB total).

## Intro preloader
On first paint the hero video (4K H.264, ~28MB embedded) is paused on its first frame while a real loading percentage (thin glass-look numerals, no background pill; top-right Skip button keeps its glass pill) tracks the page's own images + video actually becoming ready — smoothed so it never jumps. Once ready, the percentage dissolves and the video plays (with a brief ease-in ramp on `playbackRate`); when it ends, the rest of the UI (nav, status bar, hero copy) fades in and scroll unlocks. Scroll is hard-locked for the whole sequence (`overflow:hidden` on `html`/`body`, plus wheel/touch prevention) and scroll position is forced to the top on every load (`history.scrollRestoration='manual'` + `scrollTo(0,0)`) so a browser-restored scroll position can never leave the page looking mid-scrolled behind the preloader. Skip jumps straight to the end at any point. Respects `prefers-reduced-motion` and degrades gracefully with JS disabled (see the `<noscript>` block).

## Soundtrack
`timeless.mp3` (320kbps, 78s) is embedded as a data URI and loops. It tries to start the moment the page does, alongside the preloader. Browsers block unmuted autoplay without a prior user gesture, so if `play()` is rejected the button flips to its "play" state and playback starts on the visitor's first interaction (pointer/touch/key/wheel/click) instead. The round pause/play button rides to the left of the Skip button during the intro, then translates into the nav bar — landing 12px to the right of "Get in touch" — when the preloader releases; the target is recomputed on resize and clamped so it can never leave the viewport.

Video source must be H.264 (`avc1`), not HEVC — Chrome/Firefox on Windows and Android generally can't play HEVC in `<video>`. Re-encode with `avconvert -s in.mp4 -p Preset3840x2160 -o out.mp4 --replace` (built into macOS, no ffmpeg needed) if a replacement video comes in as HEVC or another codec.

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
