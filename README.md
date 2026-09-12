# Osborn — site

Static one-page site, no build step. One responsive document plus external media.

## Files
- `index.html` — the whole site, desktop and phone, as one responsive document (~60KB). Markup, styles and scripts are inline; **media is external**.
- `assets/d/` — desktop media: the 4K intro clip, its poster, and the four 16:9 section photos.
- `assets/m/` — phone media: the portrait intro cut, its poster and end frame, and the four 9:16 section photos.
- `assets/shared/` — the soundtrack (AAC, with mp3 as fallback), used by both.
- `mobile.html` — a redirect to `/`, kept only so links from when the phone build was a separate page still work.

Source masters stay out of git (`mobile/`, `*.mov`, loose PNGs are ignored) — only the web-ready files in `assets/` are committed.

## One document, two layouts
The desktop rules are the base; everything the phone does differently lives in a single `@media (max-width:834px)` block. Layout-critical JS asks the same question the same way through one `matchMedia("(max-width:834px)")`, so CSS and script can never disagree about which layout is live.

The line sits at 834px so that every iPad in portrait (768, 810, 820, 834) lands on the phone layout too — otherwise tablets split across the two layouts by model. Landscape iPads at 1024 and up get the desktop. Above phone widths the phone layout caps its measure at 720px and turns the extra width into inset, so a tablet gets comfortable line lengths rather than 90-character lines.

Media is picked per breakpoint and each side downloads only its own. The section photos use `<picture>` with a `media` source. The hero `<video>` names **neither** clip nor poster in its markup: the browser's preload scanner runs ahead of any script, so a phone would start pulling the 21MB 4K file no matter what a later script did. An inline script right after the element appends the correct `<source>` once the breakpoint is known; a no-JS load gets a still frame from the `<noscript>` beside it. Verified from the resource list on both sides: a phone requests nothing under `assets/d/`, a desktop nothing under `assets/m/`.

### Phone specifics
Photo sections put the media and the copy in a single CSS grid cell, so a section is as tall as whichever is taller. The photo hugs the edge opposite the copy, and a `.zone` spacer reserves the part of the frame the subject actually occupies — measured off each source file and written into `--dirty` (a height in the photo's own 1200×2150 px). When the copy needs more room than the clean part of the frame leaves, the section grows instead of letting text ride onto the subject; the slack is painted in `--phbg`, sampled from that photo's own outer edge, so the join is invisible. `.top-copy` flips the arrangement for photos where the subject sits low.

The intro clip is 9:16 while phones are taller, so it plays edge-to-edge during the intro and then settles into its own 9:16 box (`--vh`, set from JS) when the intro releases — the last frame, which becomes the hero, is shown whole rather than cropped at the sides. The letterbox is a `#F3F3F5 → #EEEEEF` gradient matching the clip's own edges.

Two things carry across the breakpoint: the header/meter inversion over dark sections, and the pinned scroll-scrubbed disclosure — the phone pins and scrubs it exactly like the desktop.

## Intro preloader
On first paint the hero video (4K H.264, ~28MB embedded) is paused on its first frame while a real loading percentage (thin glass-look numerals, no background pill; top-right Skip button keeps its glass pill) tracks the page's own images + video actually becoming ready — smoothed so it never jumps. Once ready, the percentage dissolves and the video plays (with a brief ease-in ramp on `playbackRate`); when it ends, the rest of the UI (nav, status bar, hero copy) fades in and scroll unlocks. Scroll is hard-locked for the whole sequence (`overflow:hidden` on `html`/`body`, plus wheel/touch prevention) and scroll position is forced to the top on every load (`history.scrollRestoration='manual'` + `scrollTo(0,0)`) so a browser-restored scroll position can never leave the page looking mid-scrolled behind the preloader. Skip jumps straight to the end at any point. Respects `prefers-reduced-motion` and degrades gracefully with JS disabled (see the `<noscript>` block).

## Start gate
The page opens on nothing but the video's blurred first frame and a `< press enter >` button — no percentage, no Skip, no audio control. Pressing it (click, Enter or Space; the button is focused on load) is what starts everything: the loading percentage, the Skip/audio controls fading in, and the soundtrack, all from the same synchronous handler. That press doubles as the user gesture browsers require before unmuted audio may play. `prefers-reduced-motion` bypasses the gate and the whole intro.

## Soundtrack
The soundtrack (`assets/shared/track.m4a`, AAC 128k, with the 320kbps mp3 as a fallback source; 78s) loops until paused. It starts on the gate press and keeps playing straight through the percentage, the video and the reveal. If `play()` is still rejected for any reason, the button falls back to its "play" state and arms one-shot listeners so playback begins on the next interaction. The round pause/play button rides to the left of the Skip button during the intro, then translates into the nav bar when the preloader releases — landing 12px to the right of "Get in touch" on the desktop, and 12px to the left of the burger on a phone, which has no such button. The target is recomputed on resize and on a breakpoint change, and clamped so it can never leave the viewport.

Both video sources must be H.264 (`avc1`), not HEVC — Chrome/Firefox on Windows and Android generally can't play HEVC in `<video>`. Re-encode with `avconvert -s in.mp4 -p Preset3840x2160 -o out.mp4 --replace` (built into macOS, no ffmpeg needed) if a replacement video comes in as HEVC or another codec.

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
