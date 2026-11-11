"""SearXNG JSON provider; refuses instances that do not return the documented JSON shape."""
import os
from urllib.parse import urljoin
import requests

class SearxngProvider:
    def __init__(self):
        base=os.getenv("SEARXNG_BASE_URL","").strip()
        if not base:
            raise RuntimeError("Configure a variável SEARXNG_BASE_URL com uma instância SearXNG que aceite format=json.")
        self.base=base.rstrip("/")+"/"

    def search(self, query, limit=10):
        r=requests.get(urljoin(self.base,"search"),
            params={"q":query,"format":"json","language":"all"},
            headers={"User-Agent":"CHANEL-YML-PYTHON/1.0","Accept":"application/json"},
            timeout=(6,20))
        r.raise_for_status()
        if "json" not in r.headers.get("Content-Type","").lower():
            raise RuntimeError("A instância SearXNG não respondeu com Content-Type JSON.")
        data=r.json()
        if not isinstance(data,dict) or not isinstance(data.get("results"),list):
            raise RuntimeError("Resposta SearXNG não contém a lista results esperada.")
        return data["results"][:limit]
