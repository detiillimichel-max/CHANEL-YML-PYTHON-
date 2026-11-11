from pathlib import PurePosixPath
from urllib.parse import urlparse
import re
from engine.common.url_normalizer import stable_id
from .drive_url_parser import parse_drive_url

def extract_record(result, query, discovered_at):
    link=result.get("url") or result.get("link") or ""
    parsed=parse_drive_url(link)
    if not parsed: return None
    title=(result.get("title") or "").strip()
    title_source="search_result" if title else "default"
    if not title: title=f"Arquivo Google Drive {parsed['drive_id'][:8]}"
    ext=PurePosixPath(urlparse(link).path).suffix.lower().lstrip(".") or None
    snippet=re.sub(r"\s+"," ",str(result.get("content") or result.get("snippet") or "")).strip()
    return {"id":stable_id(parsed["drive_id"]),"title":title,"title_source":title_source,
        "drive_id":parsed["drive_id"],"url":parsed["url"],"resourcekey":parsed["resourcekey"],
        "mime_type":None,"file_extension":ext,"source_query":query,"discovered_at":discovered_at,
        "availability":"not_checked","playback_status":"not_tested","source_type":"searxng_index",
        "description":snippet or None}
