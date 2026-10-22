# TODO

Feedback rounds for blushore.live. Each sub-chat ticks its item with what changed and what's still unverified.

## Round 1 (2026-10-22)

- [x] **METRO page: story + features** (`#apps`)
  - Remove the "Apps · 01" label.
  - Add why METRO exists: Spotify / Apple Music feel cluttered, and with unlimited music people stopped connecting with albums. Albums are the best way to listen. METRO gives you a beautiful, interactive interface with different ways to get hooked on your favourite artists' albums.
  - List all of METRO's good features in detail, each with why it matters.
  - Backstory of the name: nostalgia for Zune and the Windows Metro UI, which was way ahead of its time. Many younger people never saw it, and METRO lets them experience it.
  - Done: label removed; new "Why I built it" (after the screenshot), 13-row "What it does" list (title, what, why, Free/Licence tag; data `FEATURES` in app.js apps section) with a one-line licence note, and "Why METRO" (right-anchored column, names Zune + Windows Phone/8 Metro). Styles `.mx-story`, `.mx-say`, `.mx-name`, `.mx-feat-head`, `.feat p.why` in styles.css apps section. Checked headless at desktop and 375px (no sideways scroll). `?v` not bumped.
  - Unverified: feature list only covers METRO 1.0 for Mac (release 2026-10-13); HALO, light mode and the newer welcome/privacy screens were left out as not shipped yet. Apple Music is listed (as asked) but METRO's own STATUS says it's untested with a real account and packaged playback still needs Widevine. "Play on" kept from the old list; whether it was in 1.0 couldn't be confirmed from file dates. Wording and reveal timing still need the owner's eye.
- [x] **METRO features: regroup + HALO** — "Your library, synced", "Spotify desktop" and "Apple Music" are all one thing (syncing / sources): merge them into one feature. Sort the whole list into a better order or groups. Add the HALO interface (missing).
  - Done: `FEATURES` in app.js is now groups; each group gets a small label row (`li.feat-g`, styles.css apps section; the first row under a label has a brighter hairline; hover dim skips labels). Order: Three looks (01 Noir, 02 METRO 8, 03 HALO "Coming soon") · Finding albums (04 Album wall, 05 Pinned/recent/new, 06 Artist pages, 07 Explore) · Listening (08 Synced lyrics, 09 Visualizer, 10 Snap Control, 11 Play on) · Your music (12 Your library, synced = old Library + Spotify desktop + Apple Music, keeps "full songs, no web login, no 30-second clips"). Checked headless at desktop and 375px, no sideways scroll.
  - Unverified: HALO isn't in the 1.0 Mac build (built 2026-10-21/22, licence-gated in METRO), so it's tagged "Coming soon"; its line comes from METRO's CLAUDE.md/STATUS (glass sidebar, floating capsule, cover carousel, cover morph into the album, ring scrubber). Wording needs the owner's eye.
- [x] **Cursor: no invert on hover** — the round cursor uses a difference/invert blend, so over the orange "Download for Mac" button the covered part turns blue. Remove that hover invert (cursor section in `styles.css` / `app.js`).
  - Done: removed `mix-blend-mode: difference` from `.cursor` (styles.css). Dot is plain white with a faint dark edge; hover (`.big`) is a 28% white disc with a white ring. Size, motion and transitions unchanged; app.js untouched. Checked on the Apps download button (orange stays orange, no blue). Unverified: Music index hover, light areas, feel on a real mouse.
