// Troca das imagens de destaque e do portfólio. Grava em Firestore (midia/*) e os arquivos no Storage.
import {auth,db,ADMIN_EMAIL,FB,app} from "./firebase-config.js?v=20261015c";
const {onAuthStateChanged}=await import(FB+"firebase-auth.js");
const {doc,getDoc,setDoc,serverTimestamp}=await import(FB+"firebase-firestore.js");
const {getStorage,ref,uploadBytes,getDownloadURL}=await import(FB+"firebase-storage.js");
const storage=getStorage(app);
const $=s=>document.querySelector(s),box=$("#tab-midia");
const SEED=[{t:"Projeto de Caixa de Retenção",s:"12×12×2,63 m — 180 m³",img:["assets/img/destaques/caixa-retencao.jpg"]},{t:"Projeto de escada metálica",s:"Revestimento do piso em madeira e guarda-corpo em vidro",img:["assets/img/destaques/escada-metalica.png"]}];
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const urlOk=u=>typeof u==="string"&&u.length>8&&u.length<=500&&(/^(https:\/\/|assets\/img\/)/.test(u))&&!/[\s"'<>]/.test(u);
let dest=[],port=[],origem=new Map(),obra="";
const msg=(id,t,ok)=>{const m=$(id);if(!m)return;m.className="omsg "+(ok?"ok":"err");m.textContent=t};
function comprimir(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const max=2000,sc=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement("canvas");c.width=Math.max(1,Math.round(im.width*sc));c.height=Math.max(1,Math.round(im.height*sc));c.getContext("2d").drawImage(im,0,0,c.width,c.height);c.toBlob(b=>b?res(b):rej(new Error("não foi possível preparar a imagem")),"image/jpeg",.85)};im.onerror=()=>rej(new Error("imagem inválida"));im.src=fr.result};fr.onerror=()=>rej(new Error("não foi possível ler o arquivo"));fr.readAsDataURL(file)})}
async function subir(file,pasta){if(!file||!String(file.type||"").startsWith("image/"))throw new Error("escolha um arquivo de imagem");const blob=await comprimir(file);const path=`${pasta}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.jpg`;const r=ref(storage,path);await uploadBytes(r,blob,{contentType:"image/jpeg"});return getDownloadURL(r)}
function thumbs(imgs,tirar){return `<div class="md-thumbs">${imgs.map((u,i)=>`<figure><img src="${esc(u)}" alt=""><button type="button" class="btn ghost small" data-i="${i}">${tirar}</button></figure>`).join("")||"<p class=\"pcount\">Nenhuma imagem.</p>"}</div>`}
function itemPort(t){return port.find(x=>x.t===t)}
function imgsDe(t){const o=itemPort(t);if(o&&Array.isArray(o.img)&&o.img.length)return o.img.slice();return (origem.get(t)||[]).slice()}
function capaDe(t){const o=itemPort(t),imgs=imgsDe(t);return o&&urlOk(o.capa)&&imgs.includes(o.capa)?o.capa:""}
function upsertPort(t,lista,capa){
  port=port.filter(x=>x.t!==t);
  const imgs=(lista||[]).filter(urlOk).slice(0,24);
  const orig=origem.get(t)||[];
  const same=imgs.length===orig.length&&imgs.every((u,i)=>u===orig[i]);
  const c=urlOk(capa)&&imgs.includes(capa)?capa:"";
  if(same&&!c)return;
  const row={t};
  if(!same)row.img=imgs;
  if(c)row.capa=c;
  port.push(row);
}
function desenhaDest(){const el=$("#md-dest");el.innerHTML=dest.map((p,i)=>`<article class="md-item"><div class="ogrid"><label>Título<input data-k="t" data-i="${i}" maxlength="120" value="${esc(p.t)}"></label><label>Legenda<input data-k="s" data-i="${i}" maxlength="200" value="${esc(p.s)}"></label></div>${thumbs(p.img,"Tirar")}<div class="cact"><label class="btn ghost small">Adicionar imagens<input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden data-up="${i}"></label><button type="button" class="btn ghost small" data-mv="-1" data-i="${i}">Subir</button><button type="button" class="btn ghost small" data-mv="1" data-i="${i}">Descer</button><button type="button" class="btn ghost small" data-rm="${i}">Remover destaque</button></div></article>`).join("")||"<p class=\"pcount\">Nenhum destaque. Adicione um projeto para a faixa da página principal.</p>";
 el.querySelectorAll("[data-k]").forEach(inp=>inp.oninput=()=>{dest[+inp.dataset.i][inp.dataset.k]=inp.value});
 el.querySelectorAll("[data-up]").forEach(inp=>inp.onchange=()=>enviarDest(+inp.dataset.up,inp));
 el.querySelectorAll("[data-i].btn").forEach(b=>{if(b.dataset.mv)b.onclick=()=>mover(+b.dataset.i,+b.dataset.mv);else b.onclick=()=>tirarImg(+b.closest(".md-item").querySelector("[data-up]").dataset.up,+b.dataset.i)});
 el.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{dest.splice(+b.dataset.rm,1);desenhaDest()})}
function desenhaPort(){
  const sel=$("#md-obra");
  if(!sel.options.length){sel.innerHTML=[...origem.keys()].map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join("");obra=sel.value}
  if(obra)sel.value=obra;
  const t=sel.value||obra,imgs=imgsDe(t),capa=capaDe(t);
  const hint=$("#md-capa-hint");
  if(hint)hint.textContent=capa?"Capa do card definida (borda dourada). Clique em Salvar para publicar.":"Sem capa manual — o site escolhe automaticamente (preferência por 3D/apresentação).";
  $("#md-port").innerHTML=imgs.length?`<div class="md-thumbs">${imgs.map((u,i)=>`<figure class="${u===capa?"md-capa":""}"><img src="${esc(u)}" alt=""><span class="md-capa-tag"${u===capa?"":" hidden"}>Capa do card</span><div class="md-thumb-acts"><button type="button" class="btn ${u===capa?"":"ghost "}small" data-capa="${i}">${u===capa?"Capa atual":"Usar como capa"}</button><button type="button" class="btn ghost small" data-i="${i}">Tirar</button></div></figure>`).join("")}</div>`:`<p class="pcount">Nenhuma imagem.</p>`;
  $("#md-port").querySelectorAll("[data-capa]").forEach(b=>b.onclick=()=>{
    const lista=imgsDe(t),url=lista[+b.dataset.capa];
    if(!url)return;
    upsertPort(t,lista,url===capa?"":url);
    desenhaPort();
    msg("#md-msg-p",url===capa?"Capa removida. Clique em Salvar para publicar a escolha automática.":"Capa do card atualizada. Clique em Salvar imagens desta obra para publicar.",1);
  });
  $("#md-port").querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{
    const lista=imgsDe(t);lista.splice(+b.dataset.i,1);
    const c=capaDe(t);upsertPort(t,lista,lista.includes(c)?c:"");
    desenhaPort();
  });
}
function mover(i,d){const j=i+d;if(j<0||j>=dest.length)return;const [x]=dest.splice(i,1);dest.splice(j,0,x);desenhaDest()}
function tirarImg(i,n){dest[i].img.splice(n,1);desenhaDest()}
async function enviarDest(i,inp){const files=[...inp.files].slice(0,12);inp.value="";if(!files.length)return;msg("#md-msg-d","Enviando imagens…",1);try{for(const f of files){if(dest[i].img.length>=12)break;dest[i].img.push(await subir(f,"destaques"))}desenhaDest();msg("#md-msg-d","Imagens enviadas. Clique em Salvar destaques para publicar.",1)}catch(e){msg("#md-msg-d","Não foi possível enviar a imagem ("+(e.code||e.message)+"). Publique as regras do Storage no Firebase.")}}
async function enviarPort(inp){const t=$("#md-obra").value,files=[...inp.files].slice(0,12);inp.value="";if(!t||!files.length)return;msg("#md-msg-p","Enviando imagens…",1);try{const lista=imgsDe(t);for(const f of files){if(lista.length>=24)break;lista.push(await subir(f,"portfolio"))}upsertPort(t,lista,capaDe(t));desenhaPort();msg("#md-msg-p","Imagens enviadas. Clique em Salvar imagens desta obra para publicar.",1)}catch(e){msg("#md-msg-p","Não foi possível enviar a imagem ("+(e.code||e.message)+"). Publique as regras do Storage no Firebase.")}}
function lerDest(){return dest.map(p=>({t:String(p.t||"").trim().slice(0,120),s:String(p.s||"").trim().slice(0,200),img:(p.img||[]).filter(urlOk).slice(0,12)})).filter(p=>p.t&&p.img.length)}
async function salvarDest(){if(dest.some(p=>!String(p.t||"").trim()||!(p.img||[]).filter(urlOk).length))return msg("#md-msg-d","Cada destaque precisa de título e de pelo menos uma imagem.");const itens=lerDest();const b=$("#md-save-d");b.disabled=true;try{await setDoc(doc(db,"midia","destaques"),{itens,updatedAt:serverTimestamp()});dest=itens;desenhaDest();msg("#md-msg-d","Destaques publicados na página principal.",1)}catch(e){msg("#md-msg-d","Não foi possível salvar ("+(e.code||e.message)+"). Publique as regras do Firestore da coleção midia.")}finally{b.disabled=false}}
async function salvarPort(){
  const t=$("#md-obra").value;if(!t)return;
  const lista=imgsDe(t).filter(urlOk);
  if(!lista.length)return msg("#md-msg-p","Deixe ao menos uma imagem, ou use Restaurar originais.");
  upsertPort(t,lista,capaDe(t));
  const b=$("#md-save-p");b.disabled=true;
  try{
    const itens=port.map(x=>{
      const row={t:x.t};
      if(Array.isArray(x.img)&&x.img.length)row.img=x.img.filter(urlOk).slice(0,24);
      if(urlOk(x.capa))row.capa=x.capa;
      return row;
    }).filter(x=>x.t&&(x.img||x.capa));
    await setDoc(doc(db,"midia","portfolio"),{itens,updatedAt:serverTimestamp()});
    port=itens;
    msg("#md-msg-p","Imagens e capa desta obra publicadas no portfólio.",1);
  }catch(e){msg("#md-msg-p","Não foi possível salvar ("+(e.code||e.message)+"). Publique as regras do Firestore da coleção midia.")}
  finally{b.disabled=false}
}
function restaurar(){const t=$("#md-obra").value;port=port.filter(x=>x.t!==t);desenhaPort();msg("#md-msg-p","Originais desta obra voltaram ao formulário (capa automática). Clique em Salvar para publicar.",1)}
function montar(){box.innerHTML=`<div class="ptop"><h2>Imagens do site</h2></div><p class="pcount">A faixa Projetos em destaque e as fotos de cada obra do portfólio. Salvar publica na página principal, sem novo deploy.</p><h3>Projetos em destaque</h3><div id="md-dest"></div><div class="cact"><button type="button" class="btn ghost" id="md-add">Adicionar destaque</button><button type="button" class="btn" id="md-save-d">Salvar destaques</button></div><p class="omsg" id="md-msg-d" role="status"></p><h3>Imagens do portfólio</h3><label>Obra<select id="md-obra"></select></label><p class="pcount" id="md-capa-hint"></p><div id="md-port"></div><div class="cact"><label class="btn ghost small">Adicionar imagens<input id="md-files" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden></label><button type="button" class="btn" id="md-save-p">Salvar imagens desta obra</button><button type="button" class="btn ghost" id="md-restore">Restaurar originais</button></div><p class="omsg" id="md-msg-p" role="status"></p><p class="pcount">Em cada miniatura, use <b>Usar como capa</b> para fixar a imagem do card no portfólio. Clique de novo em “Capa atual” para voltar à escolha automática. Depois clique em Salvar.</p>`;
 $("#md-add").onclick=()=>{dest.push({t:"",s:"",img:[]});desenhaDest()};
 $("#md-save-d").onclick=salvarDest;$("#md-save-p").onclick=salvarPort;$("#md-restore").onclick=restaurar;
 $("#md-obra").onchange=()=>{obra=$("#md-obra").value;desenhaPort()};
 $("#md-files").onchange=()=>enviarPort($("#md-files"));
 desenhaDest();desenhaPort()}
let feito=false;
onAuthStateChanged(auth,async u=>{if(!(u&&u.email===ADMIN_EMAIL&&u.emailVerified)||feito)return;feito=true;box.innerHTML='<p class="pcount">Carregando imagens…</p>';
 origem=new Map((window.PROJ||[]).map(p=>[p.t,(p.img||[]).slice()]));
 try{const [d,p]=await Promise.all([getDoc(doc(db,"midia","destaques")),getDoc(doc(db,"midia","portfolio"))]);
  dest=d.exists()?(d.data().itens||[]).map(x=>({t:String(x.t||""),s:String(x.s||""),img:(x.img||[]).filter(urlOk).slice(0,12)})):SEED.map(x=>({t:x.t,s:x.s,img:x.img.slice()}));
  port=p.exists()?(p.data().itens||[]).filter(x=>origem.has(x.t)).map(x=>{
    const row={t:x.t};
    const img=(x.img||[]).filter(urlOk).slice(0,24);
    if(img.length)row.img=img;
    if(urlOk(x.capa))row.capa=x.capa;
    return row;
  }).filter(x=>x.img||x.capa):[];
 }catch(e){dest=SEED.map(x=>({t:x.t,s:x.s,img:x.img.slice()}));port=[]}
 montar();
 if(!origem.size)msg("#md-msg-p","A lista de obras não carregou. Atualize a página.");
});
