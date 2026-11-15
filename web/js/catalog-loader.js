const BUILD_ID = "2026-11-15.1";
const ROOT = new URL("../../", import.meta.url);

function catalogUrl(path) {
  const url = new URL(path, ROOT);
  url.searchParams.set("v", BUILD_ID);
  return url;
}

async function loadOne(path) {
  const url = catalogUrl(path);
  const response = await fetch(url, { cache: "reload" });
  if (!response.ok) throw new Error(`HTTP ${response.status} ao carregar ${url.pathname}`);
  const payload = await response.json();
  if (!payload || !Array.isArray(payload.items)) throw new Error(`JSON inválido: ${url.pathname}`);
  if (Number.isInteger(payload.item_count) && payload.item_count !== payload.items.length) {
    throw new Error(`Catálogo inconsistente: ${url.pathname}`);
  }
  return payload;
}

async function loadUserStreams() {
  const response = await fetch(catalogUrl("data/iptv/user-supplied-streams.txt"), { cache: "reload" });
  if (!response.ok) throw new Error(`HTTP ${response.status} ao carregar a lista pessoal`);
  const raw = await response.text();
  const seen = new Set();
  return raw.split(/\\r?\\n/).map(line => line.trim()).filter(Boolean)
    .map((original, index) => {
      // Remove somente o ponto final de pontuação que veio após a URL do Canal 324.
      const stream_url = original.endsWith(".m3u8.") ? original.slice(0, -1) : original;
      if (!/^https?:\\/\\//i.test(stream_url) || /\\.(png|jpe?g|webp)(?:[?#]|$)/i.test(stream_url)) return null;
      if (seen.has(stream_url)) return null;
      seen.add(stream_url);
      const parsed = new URL(stream_url);
      const leaf = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() || parsed.hostname);
      const name = leaf.replace(/\\.(m3u8|m3u|ts)$/i, "").replace(/[_-]+/g, " ") || parsed.hostname;
      const playlistIndex = /\\.m3u(?:$|[?#])/i.test(stream_url) && !/\\.m3u8(?:$|[?#])/i.test(stream_url);
      return {
        id: "user-" + String(index + 1).padStart(3, "0"),
        name,
        group: "Links fornecidos pelo usuário",
        source: "Lista pessoal fornecida no projeto",
        playlist_url: null,
        stream_url,
        format: playlistIndex ? "m3u" : /\\.m3u8(?:$|[?#])/i.test(stream_url) ? "m3u8" : /\\.ts(?:$|[?#])/i.test(stream_url) ? "mpegts" : "stream_url",
        source_type: "user_supplied",
        availability: "not_checked",
        playback_status: "not_confirmed"
      };
    }).filter(Boolean);
}

export async function loadCatalogs() {
  const [iptv, drive, personal] = await Promise.allSettled([
    loadOne("data/iptv/catalog.json"),
    loadOne("data/drive/catalog.json"),
    loadUserStreams()
  ]);
  const base = iptv.status === "fulfilled" ? iptv.value : null;
  const personalItems = personal.status === "fulfilled" ? personal.value : [];
  const combined = base ? {
    ...base,
    items: [...base.items, ...personalItems.filter(item => !base.items.some(existing => existing.stream_url === item.stream_url))],
    item_count: base.items.length + personalItems.filter(item => !base.items.some(existing => existing.stream_url === item.stream_url)).length
  } : null;
  return {
    iptv: combined,
    drive: drive.status === "fulfilled" ? drive.value : null,
    errors: {
      iptv: iptv.status === "rejected" ? iptv.reason.message : personal.status === "rejected" ? personal.reason.message : null,
      drive: drive.status === "rejected" ? drive.reason.message : null
    }
  };
}
