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
| `index.html` | All 6 pages as `<section class="page" id="p-home|p-music|p-apps|p-lp33|p-yohaku|p-live">`, plus header, menu, footer, release sheet and mini player. |
| `music/ apps/ lp33/ yohaku/ live/` | Each holds a tiny `index.html` that sends the visitor to `/?p=<page>` (clean addresses on GitHub Pages). A new page needs one too. `lp33/privacy`, `yohaku/privacy` are real pages. |
| `styles.css` | All styles. Sections are marked `/* ───────── name ───────── */`. |
| `app.js` | All behaviour. Sections are marked the same way. `LINKS` (every external URL) sits at the top. |
| `assets/data.js` | `window.RELEASES`, **generated** by `tools/update-releases.py` from Apple Music. Don't hand-edit. |
| `assets/colors.js` | `window.COLORS`: an accent colour per release id (hand-picked). Add one for each new release. |
| `assets/gallery.js` | `window.ARTWORKS`: per-track cover art tied to a release id (hand-made). Used by the home "Browse" floaters. |
| `assets/art/` | Release covers (600px jpg). `more/` holds per-track art. |
| `assets/audio/` | `patterns.m4a`: the default track (256 kbps AAC, made with `afconvert` from the WAV). It plays on "Enter" with sound and from the sound button. Set as `DEFAULT` in app.js (audio section); its cover is still a placeholder. |
| `assets/img/yohaku/` | Yohaku page media: `icon.png` (app icon, copied from the Yohaku project) and one clip per feature row, `<slug>.mp4` (slugs in `YOHAKU` in app.js; `hero.mp4` for the top). Slugs in `YK_NOCLIP` (app.js) get a hand-written note (their "why" line on a ruled frame) instead of a clip; a missing clip otherwise hides its slot. |
| `assets/img/` | `blu.jpg` (hero photo, 1500×2000; source copy in `artworks/` as "Blu hero photo (upscaled)"; also the Live poster), `lp33/` (LP33 hero still, white wordmark SVG, web icon; copied from the LP33 brand kit `/Volumes/SSD/Claude/METRO/docs/brand/lp33/`; old `metro-*` files unused). If the photo changes, update `PHOTO` in app.js (size, crop anchor, what the circle starts on (head and shoulders), start zoom) and the matching `object-position` on `.player img` (Live poster) in styles.css. |
| `CNAME`, `.nojekyll` | Required by GitHub Pages. Keep both. |
| `artworks/` | Source PNGs. Git-ignored, not used by the site, stays only on this Mac. |

To find code cheaply, run `grep -n "───" app.js styles.css` and Read just that line range. Don't read whole files.

**app.js sections:** smooth scroll · links · text + reveals · audio · release sheet · menu · routing · cursor · intro ring · home content · music index · apps · yohaku · live · per-frame scroll choreography (`frame()`, which drives hero, browse, latest and dots) · boot.
**styles.css sections:** tokens/type/pills · intro · header · menu · cursor · pages + reveals · dots · home (hero, about, browse, latest, rooms) · music · apps (+ `.mx-also` link to Yohaku) · yohaku · live · footer · page wipe · release sheet · mini player · small screens.

## How the site works
- **Intro:** an "Enter" screen with a ring of covers. Passing it sets `sessionStorage.bs_intro`. Clicking the logo clears it and reloads.
- **Routing:** clean paths (`/music`, `/apps`, `/lp33`, `/yohaku`, `/live`; home is `/`) via `pushState`; `pageFrom()` reads `?p=`, the path or an old `#page`. A new page goes in `PAGES` and `LABEL` in app.js plus its stub folder. Page links use `href="/page"`. Paths never end in `/` (relative asset paths depend on it). `go(name)` plays a black circle "wipe" between pages. Any element with `data-go="page"` navigates.
- **Home scroll story:** all driven in `frame()` by CSS variables.
  1. **Hero:** the photo circle grows to fill the screen, and the ring text fades.
  2. **About:** fades in over the photo, edge-anchored. "Hey, I'm Blu." sits bottom-left; a short sentence ("Most days I'm making songs, playing games or building apps.") plus a caption sits bottom-right. Lines reveal via `--q`/`--s`.
  3. **Browse:** cover floaters orbit, then gather into a pile.
  4. **Latest release:** the cover arrives as vertical strips (`#lvArt i`) that slide in from above/below and lock together, then the vinyl slides out of the sleeve while the giant title (`.lv-big`) runs behind, then shrinks and lands bottom-left (full name readable before the section ends; landing spot from `bigLand` in `measure()`).
  5. **Rooms:** links to the other pages.
- **Music:** release index rows (hover tints use `COLORS`). On touch the row at mid-screen gets `.lit` (same look as hover). Note `.on` is taken by the reveal system. Clicking opens the release sheet with 30s Apple previews. Playback fades in/out (start, pause, track change, clip end; `ramp()` in app.js, volume-based so iOS gets no fade) and plays through the rest of that release, never into the next one; Patterns just stops. Lenis is stopped while the sheet is open, so the sheet needs `data-lenis-prevent` to scroll (same for any future scrollable overlay). The mini player is a "dynamic" pill in the top-right (it replaces the sound button once a track plays): compact cover + eq, opens on hover/tap/focus and peeks open for ~3s on each track change.
- **Apps** (`/apps`): the app wall. Two big tiles (`aw-*`), each a window into its app's own look: LP33 (night, aurora, its library wall drifting, wordmark with the pink bar) and Yohaku (its hero clip dimmed to night paper, rounded wordmark, 余白 seal). A tile opens the app's page. The menu, rooms and footer link only Apps; on an app page the menu marks Apps (`APP_PAGES`).
- **LP33** (`/lp33`, section `#p-lp33`): LP33 (renamed from METRO 2026-11-02; brand rules in the LP33 project's `docs/brand/lp33/BRAND.md`: always "LP33", tagline "For album people.", first person, never "Zune" in public text, Spotify/Apple as text only). Out on Mac (LP33 1.0 from the site, notarised) and iPhone + iPad (App Store, live 2026-11-12, `LINKS.lp33AppStore`). Windows, Google Play and the Mac App Store not out yet (page says "on the way"); check the LP33 project's `docs/DISTRIBUTION.md` before changing platform or price copy. Pro = "LP33 Pro", $9.99 one-time in-app on iPhone/iPad; desktop licence not on sale yet. Design C "Monument" (2026-11-09; board https://claude.ai/artifact/N2o9sSm2vESsAVgxLjBZFi; the other concepts sit untracked in `docs/lp33-concepts/`, B "liner notes" kept for later). Its own look, scoped to `#p-lp33` like Yohaku's: night `#06111a`, Hanken Grotesk (the wordmark face), hot pink for the action, the soft aurora glow; classes `lp-*`. Page order: hero (copy + download row, then the real LP33 wordmark SVG across the full width, white with its pink bar; stacked LP / 33 under 700px) · the record (`#lpDisc`: turns at 33⅓ = 200°/s while on screen, drag to spin and scrub the time readout, flick carries, arrow keys seek) · "Judge an album by its cover." wall shot · story with a small round photo · "Where albums live." five scenes (second headline line pink) + "And the rest." · three looks tabs (Noir / METRO 8 / HALO, crossfade + section tint, auto-turn until clicked) · "Long-player. 33⅓ rpm." · four steps · privacy on plum · price (free vs lifetime licence, "On sale soon", no price until the Lemon Squeezy product exists) · FAQ (one open at a time) · "Put a record on." on the aurora · cream close with the wordmark and the Yohaku link. A floating "Download LP33" pill (`#mxFloat`) shows between the hero and the CTA. All copy lives in index.html; screenshots in `assets/img/lp33/` come from the LP33 project's `docs/brand/lp33/store/mac/` (1800px jpg). Download buttons (`[data-dl]`, filled by app.js): the visitor's platform first (pink), then an "Also on" line for the rest; links `LINKS.lp33Windows` / `lp33AppStore` / `lp33Play` (empty = hidden) and `LINKS.metroMac` / `LINKS.metroMacIntel` → GitHub Releases in the **separate** public repo `blushore/metro`: `releases/latest/download/LP33-Apple-Silicon.dmg` / `LP33-Intel.dmg` (release `lp33-1.0`; the old METRO 1.0 release stays as history). Keep app files out of the site repo. For a new version: `gh release create <tag> LP33-Apple-Silicon.dmg LP33-Intel.dmg --repo blushore/metro --latest` with the same file names, and the site links keep working. Customer DMGs are built into `/Volumes/SSD/Claude/METRO/builds/mac-release/`.
- **Yohaku** (`/yohaku`): Blu's second app, a Mac month planner + whiteboard on one ink sheet (source project `/Volumes/SSD/Claude/Yohaku`, read-only from here; reached from the Apps wall). Not public yet: the page says "Coming to the Mac App Store" with no download links. Hero (rounded wordmark + vermilion 余白, "Month & Board" in Outfit poster type), what it is, why I made it, grouped feature cards from `YOHAKU` in app.js (a 3/2/1-column grid per group; each card has a lazy clip that plays only while visible, or a hand note), the name, and a link back to LP33. Linked from the Apps wall and the end of the LP33 page. Its signature motion (keep it to these): the wordmark rises letter by letter and the 余白 seal stamps on (`.yk-word`, `.yk-stamp`; the hero waits 0.8s when arriving through the wipe, `ykEnter()`), a lime ink circle draws round "Friday" once (`.yk-circ`, SVG dashoffset), and the red margin rule draws down.
- **Live:** Twitch `blushorelive`. Live status comes from decapi.me. The embedded player only works on the real domain (Twitch checks `parent`).

## Design rules (keep new work consistent)
- Near-black `--bg #0f0f0f`, white text, `--mut #aaa`, `--dim #6a6a6a`, hairlines `--line`. The only colour is LP33 hot pink `--pink` (#e0629f, from its brand kit), used only on the LP33 page and its Apps wall tile (the LP33 page has its own look, see Apps above); per-release `COLORS` appear only on hover in Music. Yohaku's own palette (its night paper: `--yk-*` tokens, lime `#c8f53c`, vermilion seal `#ff6a4d`) and fonts (SF Pro / Outfit / Zen Maru Gothic / Reenie Beanie) appear only inside `#p-yohaku` (and its Apps wall tile, `.aw-yk`); keep every rule scoped there.
- **Inter Tight** for everything: big headings uppercase, weight 400 (the LP33 title is its wordmark SVG, not type), tight tracking (class `.up`). **Barlow Condensed** bold only for the brand mark: intro, logo, footer, wipe label.
- Small labels: 11px uppercase, `.lab` / `.meta` / `.note`. Numbers use `.n`.
- Layouts are edge-anchored (bottom-left headline, small label top-left). Avoid centred hero text, icons and decorative blobs. Lists are hairline rows, but the user prefers flowing sentences over table-like rows for personal text.
- Header: a dark frosted bar behind it (`.top::before`, hidden while the menu is open).
- Cursor: a 10px white dot, 18px solid over links and buttons (no big see-through circle; owner, 2026-11-12).
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
