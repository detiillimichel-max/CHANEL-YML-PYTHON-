import argparse
from engine.common.catalog_writer import write_catalog
from .catalog_builder import build_catalog

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--max-results",type=int,default=5)
    a=p.parse_args()
    records=build_catalog(max(1,min(a.max_results,100)))
    total=write_catalog("data/drive/catalog.json",records,"drive_id")
    print(f"Drive: {len(records)} resultados encontrados; {total} registros cumulativos.")

if __name__=="__main__": main()
