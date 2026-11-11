import json
import os
from pathlib import Path
from datetime import datetime, timezone
from .deduplicator import merge_records

def load_catalog(path):
    target = Path(path)
    if not target.exists():
        return {"schema_version": 1, "updated_at": None, "items": []}
    try:
        data = json.loads(target.read_text(encoding="utf-8"))
        if not isinstance(data, dict) or not isinstance(data.get("items"), list):
            raise ValueError("Formato de catálogo inválido")
        return data
    except Exception as exc:
        raise RuntimeError(f"Catálogo existente ilegível; escrita cancelada: {exc}") from exc

def write_catalog(path, incoming, key):
    current = load_catalog(path)
    items = merge_records(current["items"], incoming, key)
    payload = {"schema_version": 1, "updated_at": datetime.now(timezone.utc).isoformat(),
               "item_count": len(items), "items": items}
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    temp = target.with_suffix(target.suffix + ".tmp")
    temp.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temp, target)
    return len(items)
