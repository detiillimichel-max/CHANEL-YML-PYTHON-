let activeHls = null;
let hlsLoader = null;

export function isHttpMediaUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isHls(item) {
  return /\.m3u8(?:$|[?#])/i.test(item.stream_url || "") ||
    item.format === "m3u8" ||
    /mpegurl/i.test(item.mime_type || "");
}

function loadHlsJs() {
  if (window.Hls) return Promise.resolve(window.Hls);
  if (hlsLoader) return hlsLoader;

  hlsLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.6.13/dist/hls.min.js";
    script.async = true;
    script.onload = () => window.Hls ? resolve(window.Hls) : reject(new Error("HLS.js não ficou disponível."));
    script.onerror = () => reject(new Error("Não foi possível carregar HLS.js da CDN."));
    document.head.append(script);
  });
  return hlsLoader;
}

export function stopWebPlayer(video) {
  if (activeHls) {
    activeHls.destroy();
    activeHls = null;
  }
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
}

export async function playInBrowser(item, video, message) {
  stopWebPlayer(video);
  if (!item?.stream_url || !isHttpMediaUrl(item.stream_url)) {
    message.textContent = "Este registro não contém uma URL HTTP/HTTPS válida.";
    return false;
  }

  const hls = isHls(item);
  try {
    if (hls && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = item.stream_url;
    } else if (hls) {
      const Hls = await loadHlsJs();
      if (!Hls.isSupported()) {
        message.textContent = "Este navegador não oferece suporte MSE para HLS. Use Abrir no VLC.";
        return false;
      }
      activeHls = new Hls({ enableWorker: true, lowLatencyMode: false });
      activeHls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          message.textContent = "Falha fatal no HLS: " + (data.details || data.type) +
            ". A origem pode bloquear CORS ou exigir cabeçalhos. Tente Abrir no VLC.";
          stopWebPlayer(video);
        }
      });
      activeHls.loadSource(item.stream_url);
      activeHls.attachMedia(video);
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Tempo esgotado ao preparar o HLS.")), 15000);
        activeHls.once(Hls.Events.MANIFEST_PARSED, () => { clearTimeout(timeout); resolve(); });
        activeHls.once(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) { clearTimeout(timeout); reject(new Error(data.details || "Falha ao carregar manifesto HLS.")); }
        });
      });
    } else {
      video.src = item.stream_url;
    }

    await video.play();
    message.textContent = hls
      ? "Player web iniciado. Se a origem bloquear CORS ou exigir cabeçalhos, use Abrir no VLC."
      : "Tentativa de reprodução web iniciada.";
    return true;
  } catch (error) {
    message.textContent = "A reprodução web falhou: " + error.message +
      ". CORS, conteúdo HTTP em página HTTPS, codec ou política da origem podem bloquear. Tente Abrir no VLC.";
    return false;
  }
}

export function openInVlc(streamUrl, message) {
  if (!isHttpMediaUrl(streamUrl)) {
    message.textContent = "O VLC só pode receber uma URL HTTP/HTTPS válida.";
    return false;
  }

  const url = new URL(streamUrl);
  const scheme = url.protocol.slice(0, -1);
  const intent = "intent://" + url.host + url.pathname + url.search +
    "#Intent;scheme=" + scheme + ";package=org.videolan.vlc;type=video/*;end";

  message.textContent = "Solicitando abertura no VLC. Se o Android não abrir o aplicativo, confirme se o VLC está instalado.";
  window.location.href = intent;
  return true;
}
