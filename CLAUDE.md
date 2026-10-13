# blushore.live: notes for Claude

Personal site of Blu Shore (musician, gamer, developer). Static HTML/CSS/JS with **no build step** and no framework. Lenis smooth scroll is the only dependency, loaded from a CDN. Live at https://blushore.live.

## Ship a change
1. Edit the files.
2. Preview: `python3 -m http.server 4173` (or `preview_start` with name `site`), then open http://127.0.0.1:4173/. Click "Enter without sound" to get past the intro.
3. Bump the `?v=N` on the css/js links in index.html (phones cache them for 10 min otherwise). Commit and push to `main`. GitHub Pages deploys in about a minute. The user expects changes to go live, so push when they're done.
   - Author: `Blu Shore <blushore@users.noreply.github.com>`, already set in the repo config. Never use the user's Gmail.
   - On this Mac, `gh` is at `~/.local/bin/gh` (not on PATH) and is logged in as `blushore`.

## Files (read only the section you need)
| File | What it holds |
|---|---|
| `index.html` | All 4 pages as `<section class="page" id="p-home|p-music|p-apps|p-live">`, plus header, menu, footer, release sheet and mini player. |
| `styles.css` | All styles. Sections are marked `/* ───────── name ───────── */`. |
| `app.js` | All behaviour. Sections are marked the same way. `LINKS` (every external URL) sits at the top. |
| `assets/data.js` | `window.RELEASES`, **generated** by `tools/update-releases.py` from Apple Music. Don't hand-edit. |
| `assets/colors.js` | `window.COLORS`: an accent colour per release id (hand-picked). Add one for each new release. |
| `assets/gallery.js` | `window.ARTWORKS`: per-track cover art tied to a release id (hand-made). Used by the home "Browse" floaters. |
| `assets/art/` | Release covers (600px jpg). `more/` holds per-track art. |
| `assets/img/` | `blu.jpg` (hero photo), METRO screenshot and icon. |
| `CNAME`, `.nojekyll` | Required by GitHub Pages. Keep both. |
| `artworks/` | Source PNGs. Git-ignored, not used by the site, stays only on this Mac. |

To find code cheaply, run `grep -n "───" app.js styles.css` and Read just that line range. Don't read whole files.

**app.js sections:** smooth scroll · links · text + reveals · audio · release sheet · menu · routing · cursor · intro ring · home content · music index · apps · live · per-frame scroll choreography (`frame()`, which drives hero, browse, latest and dots) · boot.
**styles.css sections:** tokens/type/pills · intro · header · menu · cursor · pages + reveals · dots · home (hero, about, browse, latest, rooms) · music · apps · live · footer · page wipe · release sheet · mini player · small screens.

## How the site works
- **Intro:** an "Enter" screen with a ring of covers. Passing it sets `sessionStorage.bs_intro`. Clicking the logo clears it and reloads.
- **Routing:** hash-based (`#music`, `#apps`, `#live`). Home uses the clean path with **no `#home`** (`pageUrl()` in app.js). `go(name)` plays a black circle "wipe" between pages. Any element with `data-go="page"` navigates.
- **Home scroll story:** all driven in `frame()` by CSS variables.
  1. **Hero:** the photo circle grows to fill the screen, and the ring text fades.
  2. **About:** fades in over the photo, edge-anchored. "Hey, I'm Blu." sits bottom-left; a short sentence ("Most days I'm making songs, playing games or building apps.") plus a caption sits bottom-right. Lines reveal via `--q`/`--s`.
  3. **Browse:** cover floaters orbit, then gather into a pile.
  4. **Latest release:** a cover kaleidoscope (`.kal` / `.kring`) around a vinyl that slides out of its sleeve.
  5. **Rooms:** links to the other pages.
- **Music:** release index rows (hover tints use `COLORS`). Clicking opens the release sheet with 30s Apple previews. The mini player is a "dynamic" pill in the top-right (it replaces the sound button once a track plays): compact cover + eq, opens on hover/tap/focus and peeks open for ~3s on each track change.
- **Apps:** METRO music player. `LINKS.metro` is empty, so its button says "Coming soon".
- **Live:** Twitch `blushorelive`. Live status comes from decapi.me. The embedded player only works on the real domain (Twitch checks `parent`).

## Design rules (keep new work consistent)
- Near-black `--bg #0f0f0f`, white text, `--mut #aaa`, `--dim #6a6a6a`, hairlines `--line`. The only colour is METRO orange `--orange`, used only on the Apps page; per-release `COLORS` appear only on hover in Music.
- **Inter Tight** for everything: big headings uppercase, weight 400 (light 200 for METRO), tight tracking (class `.up`). **Barlow Condensed** bold only for the brand mark: intro, logo, footer, wipe label.
- Small labels: 11px uppercase, `.lab` / `.meta` / `.note`. Numbers use `.n`.
- Layouts are edge-anchored (bottom-left headline, small label top-left). Avoid centred hero text, icons and decorative blobs. Lists are hairline rows, but the user prefers flowing sentences over table-like rows for personal text.
- Motion: long calm easing (`--ease`, `--ease-io`). Animate only transform and opacity. Large repeated layers need `contain: paint` and no per-tile shadows (that combination caused flicker before). Never animate clip-path or filter per frame (janky on iPhone); the hero circle is a scaled disc with a counter-scaled photo, run as a CSS scroll-driven animation (keyframes sampled from `heroAt()` in app.js, JS fallback where unsupported).
- Respect `prefers-reduced-motion`, and keep the layout working at 375px wide.

## Common tasks
- **New release:** run `python3 tools/update-releases.py`, then add the release id to `assets/colors.js`. Optionally add track art to `assets/gallery.js` plus `assets/art/more/`.
- **Change a link:** edit `LINKS` at the top of app.js. An empty value hides it. "Listen" (streaming) and "Follow" (social) lists sit just below it, and the footer has matching `data-link` anchors in index.html.
- **Text:** edit index.html directly.

## Hosting and accounts
- GitHub repo `blushore/blushore.live` (public). Pages serves `main` from the repo root, with HTTPS enforced.
- The domain is registered at GoDaddy. DNS has `A @` pointing to 185.199.108.153, .109, .110 and .111, and `CNAME www` pointing to blushore.github.io. The GoDaddy Website Builder site is no longer used.
- The user declined domain auto-renew. Don't bring it up.

## Keeping these notes current
When a design decision, workflow or setup changes, update this file in the same commit. Keep it short, because it loads into every conversation.
