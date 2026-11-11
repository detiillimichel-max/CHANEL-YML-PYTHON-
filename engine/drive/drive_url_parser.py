from urllib.parse import urlparse, parse_qs, urlunparse
import re

def parse_drive_url(value):
    try:
        p=urlparse(value.strip())
        if p.scheme not in ("http","https") or p.netloc.lower() not in ("drive.google.com","docs.google.com"):
            return None
        m=re.search(r"/file/d/([A-Za-z0-9_-]+)",p.path)
        q=parse_qs(p.query)
        file_id=m.group(1) if m else (q.get("id") or [None])[0]
        if not file_id: return None
        resource=(q.get("resourcekey") or q.get("resourceKey") or [None])[0]
        kept={"resourcekey":resource} if resource else {}
        query="&".join(f"{k}={v}" for k,v in kept.items())
        clean=urlunparse((p.scheme,p.netloc,p.path,"",query,""))
        return {"drive_id":file_id,"resourcekey":resource,"url":clean}
    except (ValueError,AttributeError):
        return None
