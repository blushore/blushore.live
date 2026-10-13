#!/usr/bin/env python3
"""Refresh assets/data.js and cover art from Apple Music after a new release.
Run from the site folder:  python3 tools/update-releases.py"""
import json, os, re, urllib.request

ARTIST = 1459654092
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get(entity):
    url = f"https://itunes.apple.com/lookup?id={ARTIST}&entity={entity}&limit=200"
    return json.load(urllib.request.urlopen(url))["results"][1:]

def slug(n):
    return re.sub(r"[^a-z0-9]+", "-", n.lower().replace(" - single", "").replace(" - ep", "")).strip("-")

albums, songs = get("album"), get("song")
out = []
for a in albums:
    n = a["collectionName"]
    kind = "Single" if n.endswith(" - Single") else "EP" if n.endswith(" - EP") else "Album"
    art = f"assets/art/{slug(n)}.jpg"
    if not os.path.exists(os.path.join(ROOT, art)):
        urllib.request.urlretrieve(a["artworkUrl100"].replace("100x100bb", "600x600bb"), os.path.join(ROOT, art))
    tracks = sorted((s for s in songs if s["collectionId"] == a["collectionId"]), key=lambda s: (s.get("discNumber", 1), s["trackNumber"]))
    out.append(dict(id=slug(n), title=re.sub(r" - (Single|EP)$", "", n), kind=kind, date=a["releaseDate"][:10],
                    genre=a["primaryGenreName"], apple=a["collectionViewUrl"].split("?")[0], art=art,
                    tracks=[dict(t=s["trackName"], ms=s.get("trackTimeMillis", 0), p=s.get("previewUrl", "")) for s in tracks]))
out.sort(key=lambda x: x["date"], reverse=True)
with open(os.path.join(ROOT, "assets/data.js"), "w") as f:
    f.write(f"/* Generated from the Apple Music catalogue (iTunes lookup, artist {ARTIST}). */\nwindow.RELEASES = "
            + json.dumps(out, indent=1, ensure_ascii=False) + ";\n")
print(f"{len(out)} releases, {sum(len(r['tracks']) for r in out)} tracks")
