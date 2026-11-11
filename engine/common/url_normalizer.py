from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
import hashlib

def normalize_url(value):
    parts = urlsplit((value or "").strip())
    if parts.scheme.lower() not in ("http", "https") or not parts.netloc:
        return ""
    query = urlencode(parse_qsl(parts.query, keep_blank_values=True), doseq=True)
    return urlunsplit((parts.scheme.lower(), parts.netloc.lower(), parts.path or "/", query, ""))

def stable_id(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:20]
