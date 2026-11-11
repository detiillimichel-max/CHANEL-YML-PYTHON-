"""Find public M3U/M3U8 files in repositories returned by GitHub repository search."""
import os
import requests

API = "https://api.github.com"

def discover_playlists(max_repositories=2, max_playlists=5):
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "CHANEL-YML-PYTHON"}
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    query = os.getenv("IPTV_GITHUB_QUERY", "iptv playlist m3u")
    response = requests.get(f"{API}/search/repositories",
        params={"q": query, "sort": "updated", "per_page": min(max(max_repositories, 1), 10)},
        headers=headers, timeout=(5, 15))
    response.raise_for_status()
    found, seen = [], set()
    for repo in response.json().get("items", [])[:max_repositories]:
        full, branch = repo.get("full_name"), repo.get("default_branch")
        if not full or not branch:
            continue
        r = requests.get(f"{API}/repos/{full}/git/trees/{branch}", params={"recursive":"1"},
                         headers=headers, timeout=(5, 20))
        r.raise_for_status()
        for entry in r.json().get("tree", []):
            path = entry.get("path", "")
            if entry.get("type") != "blob" or not path.lower().endswith((".m3u", ".m3u8")):
                continue
            raw = f"https://raw.githubusercontent.com/{full}/{branch}/{path}"
            if raw in seen:
                continue
            seen.add(raw)
            found.append({"playlist_url":raw, "source":f"https://github.com/{full}",
                          "source_type":"github_repository", "repository":full,
                          "path":path, "format":path.rsplit(".",1)[-1].lower()})
            if len(found) >= max_playlists:
                return found
    return found
