# blushore.live

A static site with no build step: `index.html`, `styles.css`, `app.js` and `assets/` (about 1.3 MB). Smooth scrolling comes from Lenis, loaded from a CDN.

## Edit
- **Links** (Instagram, email, METRO download): the `LINKS` object at the top of `app.js`. An empty link is hidden.
- **New music:** run `python3 tools/update-releases.py`. It pulls your releases, covers and previews from Apple Music.
- **Text:** in `index.html`.

## Preview locally
```bash
python3 -m http.server 4173
```
Then open http://127.0.0.1:4173.

## Hosting
GitHub Pages serves the `main` branch of [blushore/blushore.live](https://github.com/blushore/blushore.live) at https://blushore.live. Every push to `main` goes live in about a minute.
- **Edit from any device:** open the repo in [claude.ai/code](https://claude.ai/code), or edit files on github.com.
- **DNS (GoDaddy):** four `A @` records to `185.199.108.153`, `.109`, `.110`, `.111`, and `CNAME www` to `blushore.github.io`.
- `CNAME` holds the custom domain and `.nojekyll` turns off GitHub's Jekyll build. Keep both.
- `artworks/` (source PNGs) is git-ignored and stays only on this Mac.

The Twitch player only loads on a real domain because Twitch checks the `parent` host. Locally, the button opens Twitch instead.
