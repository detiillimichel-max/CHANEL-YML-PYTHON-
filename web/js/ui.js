import {getFavorites,toggleFavorite} from "./storage.js";
export function renderCards(container,records,type,handlers){
  container.replaceChildren();
  if(!records.length){const p=document.createElement("p");p.className="notice";p.textContent="Nenhum registro para os filtros atuais.";container.append(p);return;}
  const favorites=getFavorites();
  for(const item of records){
    const card=document.createElement("article");card.className="item-card";
    const top=document.createElement("div");top.className="card-top";
    const pill=document.createElement("span");pill.className="type-pill";pill.textContent=type==="iptv"?"IPTV":"GOOGLE DRIVE";
    const status=document.createElement("span");status.className="status-pill";status.textContent=item.availability||"não verificado";top.append(pill,status);
    const title=document.createElement("h3");title.textContent=item.name||item.title||"Sem título";
    const source=document.createElement("p");source.textContent=item.group||item.source||item.source_query||"Origem não informada";
    const playback=document.createElement("p");playback.textContent="Reprodução: "+(item.playback_status||"não testada");
    const actions=document.createElement("div");actions.className="card-actions";
    const detail=document.createElement("button");detail.textContent="Detalhes";detail.addEventListener("click",()=>handlers.details(item,type));
    const fav=document.createElement("button");fav.textContent=favorites.has(item.id)?"★ Salvo":"☆ Salvar";
    fav.addEventListener("click",()=>{fav.textContent=toggleFavorite(item.id)?"★ Salvo":"☆ Salvar";});
    actions.append(detail,fav);
    if(type==="iptv"){
      const play=document.createElement("button");play.className="primary";play.textContent="Reproduzir";
      play.disabled=!item.stream_url||!["accessible","playlist_accessible"].includes(item.availability);
      play.addEventListener("click",()=>handlers.play(item));actions.append(play);
    }else{
      const open=document.createElement("button");open.className="primary";open.textContent="Abrir Drive";
      open.addEventListener("click",()=>handlers.open(item));actions.append(open);
    }
    card.append(top,title,source,playback,actions);container.append(card);
  }
}
export function showDetails(dialog,target,item,type){
  target.replaceChildren();
  const keys=type==="iptv"?["name","group","source","playlist_url","stream_url","format","discovered_at","checked_at","availability","playback_status","validation"]:
    ["title","title_source","drive_id","url","resourcekey","mime_type","file_extension","source_query","discovered_at","availability","playback_status"];
  for(const key of keys){if(item[key]===undefined||item[key]===null||item[key]==="")continue;
    const row=document.createElement("div");row.className="detail-row";const label=document.createElement("small");label.textContent=key;
    const value=document.createElement("div");value.textContent=String(item[key]);row.append(label,value);target.append(row);}
  dialog.showModal();
}
