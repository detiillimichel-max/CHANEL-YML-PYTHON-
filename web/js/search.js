export function filterRecords(records, query) {
  const term=(query||"").trim().toLocaleLowerCase("pt-BR");
  if(!term)return records;
  return records.filter(item=>[item.name,item.title,item.group,item.source,item.repository,
    item.description,item.file_extension,item.format].some(v=>String(v||"").toLocaleLowerCase("pt-BR").includes(term)));
}
