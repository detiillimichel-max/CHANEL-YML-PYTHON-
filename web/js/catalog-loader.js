const BUILD_ID = "2026-11-11.2";
const ROOT = new URL("../../", import.meta.url);

function catalogUrl(path) {
  const url = new URL(path, ROOT);
  url.searchParams.set("v", BUILD_ID);
  return url;
}

async function loadOne(path) {
  const url = catalogUrl(path);
  const response = await fetch(url, { cache: "reload" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ao carregar ${url.pathname}`);
  }

  const payload = await response.json();
  if (!payload || !Array.isArray(payload.items)) {
    throw new Error(`JSON inválido: ${url.pathname}`);
  }
  if (Number.isInteger(payload.item_count) && payload.item_count !== payload.items.length) {
    throw new Error(`Catálogo inconsistente: ${url.pathname} declara ${payload.item_count}, mas contém ${payload.items.length} itens`);
  }
  return payload;
}

export async function loadCatalogs() {
  const [iptv, drive] = await Promise.allSettled([
    loadOne("data/iptv/catalog.json"),
    loadOne("data/drive/catalog.json")
  ]);

  return {
    iptv: iptv.status === "fulfilled" ? iptv.value : null,
    drive: drive.status === "fulfilled" ? drive.value : null,
    errors: {
      iptv: iptv.status === "rejected" ? iptv.reason.message : null,
      drive: drive.status === "rejected" ? drive.reason.message : null
    }
  };
}
