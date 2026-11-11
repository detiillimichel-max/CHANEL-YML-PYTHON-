"""HTTP requests with bounded timeouts and response sizes."""
import requests

HEADERS = {"User-Agent": "CHANEL-YML-PYTHON/1.0", "Accept": "*/*"}

def get_text(url, max_bytes=1500000, timeout=(5, 12)):
    with requests.get(url, headers=HEADERS, timeout=timeout, stream=True, allow_redirects=True) as r:
        r.raise_for_status()
        chunks, total = [], 0
        for chunk in r.iter_content(16384):
            if not chunk:
                continue
            total += len(chunk)
            if total > max_bytes:
                raise ValueError("Resposta excedeu o limite de bytes configurado")
            chunks.append(chunk)
        return r.status_code, b"".join(chunks).decode(r.encoding or "utf-8", "replace"), dict(r.headers)

def head_status(url):
    try:
        r = requests.head(url, headers=HEADERS, timeout=(4, 8), allow_redirects=True)
        if r.status_code not in (405, 501):
            return ("accessible" if r.ok else "unavailable", r.status_code)
    except requests.RequestException:
        pass
    try:
        with requests.get(url, headers={**HEADERS, "Range": "bytes=0-0"}, timeout=(4, 8), stream=True) as r:
            return ("accessible" if r.status_code in (200, 206) else "unavailable", r.status_code)
    except requests.RequestException:
        return "unavailable", None
