const ROOT = new URL("../../", import.meta.url);
async function loadOne(path) {
  const response = await fetch(new URL(path, ROOT), {cache:"no-store"});
  if (!response.ok) throw new Error(`HTTP ${response.status} ao carregar ${path}`);
  const payload = await response.json();
  if (!payload || !Array.isArray(payload.items)) throw new Error(`JSON inválido: ${path}`);
  return payload;
}
export async function loadCatalogs() {
  const [iptv,drive]=await Promise.allSettled([
    loadOne("data/iptv/catalog.json"),loadOne("data/drive/catalog.json")
  ]);
  return {iptv:iptv.status==="fulfilled"?iptv.value:null,
    drive:drive.status==="fulfilled"?drive.value:null,
    errors:{iptv:iptv.status==="rejected"?iptv.reason.message:null,
            drive:drive.status==="rejected"?drive.reason.message:null}};
}
