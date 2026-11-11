def merge_records(existing, incoming, key):
    merged = {}
    for item in list(existing) + list(incoming):
        identity = str(item.get(key) or "").strip()
        if not identity:
            continue
        if identity in merged:
            merged[identity] = {**merged[identity], **{k:v for k,v in item.items() if v not in (None, "")}}
        else:
            merged[identity] = item
    return list(merged.values())
