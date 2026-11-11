import {loadCatalogs} from "./js/catalog-loader.js";
import {getIptvRecords} from "./js/iptv.js";
import {getDriveRecords} from "./js/drive.js";
import {renderCards,showDetails} from "./js/ui.js";
import {playInBrowser,openInVlc,stopWebPlayer} from "./js/player.js";
const $=id=>document.getElementById(id);
const state={active:"iptv",catalogs:{iptv:null,drive:null},errors:{}};
const grid=$("content-grid"),notice=$("notice"),video=$("media-player");
function records(){return state.active==="iptv"?getIptvRecords(state.catalogs.iptv,$("search-input").value):getDriveRecords(state.catalogs.drive,$("search-input").value);}
function render(){
  const drive=state.active==="drive";
  $("section-title").textContent=drive?"Arquivos Google Drive":"Canais IPTV";
  $("section-description").textContent=drive?"Links indexados; acesso não presumido.":"Playlists e canais descobertos em fontes públicas.";
  const catalog=state.catalogs[state.active];
  if(!catalog){notice.className="notice error";notice.textContent=state.errors[state.active]||"Catálogo indisponível.";grid.replaceChildren();return;}
  notice.className="notice";notice.textContent=`${catalog.items.length} registros carregados. Descoberta não confirma reprodução.`;
  renderCards(grid,records(),state.active,{
    details:(item,type)=>showDetails($("details-dialog"),$("details-content"),item,type),
    play:async item=>{$("player-panel").hidden=false;$("player-title").textContent=item.name||"Canal IPTV";await playInBrowser(item,video,$("player-message"));$("player-panel").scrollIntoView({behavior:"smooth"});},
    openVlc:item=>openInVlc(item.stream_url,$("player-message")),
    open:item=>{if(item.url)window.open(item.url,"_blank","noopener,noreferrer");}
  });
}
async function refresh(){
  $("connection-status").textContent="Atualizando…";
  const result=await loadCatalogs();state.catalogs={iptv:result.iptv,drive:result.drive};state.errors=result.errors;
  $("iptv-count").textContent=result.iptv?.items.length??"!";$("drive-count").textContent=result.drive?.items.length??"!";
  $("connection-status").textContent=result.iptv&&result.drive?"Dois catálogos conectados":"Falha parcial de catálogo";render();
}
document.querySelectorAll("[data-library]").forEach(button=>button.addEventListener("click",()=>{
  state.active=button.dataset.library;document.querySelectorAll("[data-library]").forEach(node=>node.classList.toggle("active",node===button));render();
}));
$("search-input").addEventListener("input",render);
$("clear-search").addEventListener("click",()=>{$("search-input").value="";render();});
$("refresh-button").addEventListener("click",refresh);
$("dialog-close").addEventListener("click",()=>$("details-dialog").close());
$("close-player").addEventListener("click",()=>{stopWebPlayer(video);$("player-panel").hidden=true;});
refresh();
