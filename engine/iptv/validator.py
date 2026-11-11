from engine.common.http_client import get_text

def inspect_playlist(url):
    try:
        _, body, headers = get_text(url, max_bytes=1500000)
        valid = any(line.strip().startswith("#EXTM3U") for line in body.splitlines()[:3])
        if valid:
            return "accessible", "valid_m3u", body
        if "mpegurl" in headers.get("Content-Type", "").lower():
            return "accessible", "format_unconfirmed", body
        return "accessible", "invalid_m3u", ""
    except Exception:
        return "unavailable", "not_checked", ""
