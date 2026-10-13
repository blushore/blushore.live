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

## Put it online
Upload the folder to any static host, then point the GoDaddy DNS for blushore.live at it.
Two free options:
- **Cloudflare Pages** or **Netlify**: drag and drop the folder, add the custom domain `blushore.live`, and copy the DNS records they give you into GoDaddy (Domain → DNS).
- **GoDaddy web hosting**, if you have a plan: upload the files to `public_html`.

The Twitch player only loads on a real domain because Twitch checks the `parent` host. Locally, the button opens Twitch instead.
