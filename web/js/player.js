export function canPlayInBrowser(item) {
  return Boolean(item?.stream_url && /^https?:\/\//i.test(item.stream_url) &&
    ["accessible","playlist_accessible"].includes(item.availability));
}
export async function playInBrowser(item, video, message) {
  if(!canPlayInBrowser(item)){message.textContent="Fonte não validada como acessível. Reprodução não iniciada.";return false;}
  const hls=/\.m3u8(?:$|\?)/i.test(item.stream_url)||item.format==="m3u8";
  if(hls&&!video.canPlayType("application/vnd.apple.mpegurl")){
    message.textContent="Este navegador não declara suporte nativo a HLS. Não foi iniciada reprodução. LibVLC requer host Android nativo.";
    return false;
  }
  video.src=item.stream_url;
  try{await video.play();message.textContent="Reprodução iniciada pelo navegador. Isto não é LibVLC.";return true;}
  catch(e){message.textContent=`O navegador recusou a reprodução: ${e.message}. CORS, codec ou política do navegador podem impedir o acesso.`;return false;}
}
