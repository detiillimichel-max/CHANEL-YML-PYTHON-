from datetime import datetime, timezone
from engine.common.url_normalizer import stable_id
from engine.common.http_client import head_status
from .validator import inspect_playlist
from .playlist_parser import parse_playlist

def build_catalog(sources,max_channels=50):
    now=datetime.now(timezone.utc).isoformat()
    records,seen=[],set()
    for source in sources:
        url=source["playlist_url"]
        if url in seen: continue
        seen.add(url)
        playlist_availability,validation,body=inspect_playlist(url)
        parsed=parse_playlist(body,url,source.get("source",url),now) if body else []
        if not parsed:
            records.append({"id":stable_id(url),"name":source.get("path","Playlist sem título"),
                "source":source.get("source"),"playlist_url":url,"format":source.get("format"),
                "discovered_at":now,"checked_at":now,"availability":playlist_availability,
                "playback_status":"not_confirmed","source_type":source.get("source_type"),
                "validation":validation})
        else:
            remaining=max(0,max_channels-len(records))
            for item in parsed[:remaining]:
                item["playlist_availability"]=playlist_availability
                stream_state,http_status=head_status(item["stream_url"])
                item["availability"]=stream_state
                item["http_status"]=http_status
                item["checked_at"]=datetime.now(timezone.utc).isoformat()
                records.append(item)
        if len(records)>=max_channels: break
    return records[:max_channels]
