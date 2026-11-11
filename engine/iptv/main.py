import argparse
from engine.common.catalog_writer import write_catalog
from .discovery import discover_playlists
from .catalog_builder import build_catalog

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--max-repositories",type=int,default=2)
    p.add_argument("--max-playlists",type=int,default=5)
    p.add_argument("--max-channels",type=int,default=50)
    a=p.parse_args()
    sources=discover_playlists(max(1,min(a.max_repositories,10)),max(1,min(a.max_playlists,30)))
    records=build_catalog(sources,max(1,min(a.max_channels,500)))
    total=write_catalog("data/iptv/catalog.json",records,"id")
    print(f"IPTV: {len(sources)} playlists encontradas; {len(records)} registros observados; {total} cumulativos.")

if __name__=="__main__": main()
