import re
from urllib.parse import urljoin
from engine.common.url_normalizer import normalize_url, stable_id

def parse_playlist(text, playlist_url, source, discovered_at):
    lines = [line.strip() for line in text.replace("\r", "").split("\n")]
    if not any(line.startswith("#EXTM3U") for line in lines[:3]):
        return []
    records, metadata = [], None
    for line in lines:
        if line.startswith("#EXTINF:"):
            attrs = dict(re.findall(r'([\w-]+)="([^"]*)"', line))
            name = line.split(",", 1)[1].strip() if "," in line else ""
            metadata = {"name": name or "Canal sem título", "group": attrs.get("group-title"),
                        "logo": attrs.get("tvg-logo"), "tvg_id": attrs.get("tvg-id")}
        elif line and not line.startswith("#") and metadata:
            stream = normalize_url(urljoin(playlist_url, line))
            if stream:
                records.append({"id":stable_id(stream), **metadata, "source":source,
                    "playlist_url":playlist_url, "stream_url":stream,
                    "format":"m3u8" if ".m3u8" in stream.lower() else "stream_url",
                    "discovered_at":discovered_at, "checked_at":None,
                    "availability":"playlist_accessible", "playback_status":"not_confirmed",
                    "source_type":"playlist_entry"})
            metadata = None
    return records
