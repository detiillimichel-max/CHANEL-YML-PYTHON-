import os
from datetime import datetime, timezone
from .searxng_provider import SearxngProvider
from .metadata_extractor import extract_record

DEFAULT_QUERIES=['site:drive.google.com "documentários"','site:drive.google.com "filmes"',
                 'site:drive.google.com "séries"','site:drive.google.com m3u OR m3u8']

def build_catalog(max_results=5):
    raw=os.getenv("DRIVE_QUERIES","").strip()
    queries=[q.strip() for q in raw.replace(";", "\n").splitlines() if q.strip()] if raw else DEFAULT_QUERIES
    provider=SearxngProvider()
    now=datetime.now(timezone.utc).isoformat()
    records,seen=[],set()
    for query in queries:
        for result in provider.search(query,max_results):
            item=extract_record(result,query,now)
            if item and item["drive_id"] not in seen:
                seen.add(item["drive_id"]); records.append(item)
                if len(records)>=max_results: return records
    return records
