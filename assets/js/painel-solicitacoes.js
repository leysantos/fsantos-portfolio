import {auth,db,ADMIN_EMAIL,FB} from "./firebase-config.js?v=20261015c";
import {esc,rotBrief,num2} from "./orcamento.js?v=20261124b";
const {onAuthStateChanged}=await import(FB+"firebase-auth.js");
const {collection,getDocs,query,orderBy,doc,updateDoc,deleteDoc,serverTimestamp}=await import(FB+"firebase-firestore.js");
const $=s=>document.querySelector(s),STATUS=["novo","em análise","respondido","arquivado"];
let all=[],loaded=false;
STATUS.forEach(s=>{const el=$("#sol-fst");if(el)el.insertAdjacentHTML("beforeend",`<option>${s}</option>`)});
const isAdmin=u=>u&&u.email===ADMIN_EMAIL&&u.emailVerified;
const cls=s=>"st st-"+String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-");
const dt=o=>o.createdAt?.toDate?o.createdAt.toDate():null,fd=o=>dt(o)?.toLocaleDateString("pt-BR")??"—";
const wa=t=>{let d=String(t||"").replace(/\D/g,"");if(!d)return"";if(d.length<=11)d="55"+d;return"https://wa.me/"+d};

function badge(){
  const n=all.filter(x=>x.status==="novo").length;
  const b=$("#sol-badge");
  if(!b)return;
  b.hidden=!n;b.textContent=String(n);
  const tab=$(".ptabs button[data-tab=sol]");
  if(tab)tab.title=n?`${n} pedido(s) novo(s)`:"Solicitações";
}

async function load(){
  const cnt=$("#sol-cnt");if(!cnt)return;
  cnt.textContent="Carregando…";
  try{
    const s=await getDocs(query(collection(db,"solicitacoes"),orderBy("createdAt","desc")));
    all=s.docs.map(d=>({id:d.id,...d.data()}));
    loaded=true;list();badge();
  }catch(e){cnt.textContent="Erro ao carregar: "+(e.code||e.message)}
}

function filtered(){
  const q=($("#sol-q")?.value||"").toLowerCase().trim(),st=$("#sol-fst")?.value||"";
  return all.filter(o=>(!st||o.status===st)&&(!q||[o.numero,o.cliente?.nome,o.cliente?.telefone,o.cliente?.email,o.projeto,o.cidade,o.mensagem,o.notas].join(" ").toLowerCase().includes(q)));
}

function list(){
  const f=filtered(),cnt=$("#sol-cnt"),rows=$("#sol-rows");
  if(!cnt||!rows)return;
  cnt.textContent=`${f.length} de ${all.length} solicitação(ões)`;
  rows.innerHTML=f.map(o=>`<tr data-id="${o.id}" class="${o.status==="novo"?"row-novo":""}"><td>${fd(o)}</td><td>${esc(o.numero)}</td><td>${esc(o.cliente?.nome)}</td><td>${esc(rotBrief("tipo",o.tipo)||o.tipo||"—")}</td><td>${num2(o.area)}</td><td><span class="${cls(o.status)}">${esc(o.status)}</span></td></tr>`).join("")||'<tr><td colspan="6">Nenhuma solicitação.</td></tr>';
  rows.querySelectorAll("tr[data-id]").forEach(r=>r.onclick=()=>open(r.dataset.id));
}

function open(id){
  const o=all.find(x=>x.id===id);if(!o)return;
  const w=wa(o.cliente?.telefone);
  const discs=(o.disciplinas||[]).map(d=>esc(d.nome||d.item)).join(", ")||"—";
  const qs=new URLSearchParams({nome:o.cliente?.nome||"",tel:o.cliente?.telefone||"",email:o.cliente?.email||"",cid:o.cidade||"",proj:o.projeto||"",area:o.area!=null?String(o.area):"",quem:o.quem||"",tipo:o.tipo||"",fase:o.fase||"",arq:o.arquitetura||"",sond:o.sondagem||""});
  $("#dbody").innerHTML=`<h2>${esc(o.numero)} <span class="${cls(o.status)}">${esc(o.status)}</span></h2>
  <dl>
    <dt>Data</dt><dd>${dt(o)?.toLocaleString("pt-BR")??"—"}</dd>
    <dt>Cliente</dt><dd>${esc(o.cliente?.nome)}</dd>
    <dt>Telefone</dt><dd>${esc(o.cliente?.telefone||"—")}</dd>
    <dt>E-mail</dt><dd>${esc(o.cliente?.email||"—")}</dd>
    <dt>Projeto</dt><dd>${esc(o.projeto||"—")}</dd>
    <dt>Cidade</dt><dd>${esc(o.cidade||"—")}</dd>
    <dt>Área</dt><dd>${num2(o.area)} m²</dd>
    <dt>Qualificação</dt><dd>${esc(rotBrief("quem",o.quem))} · ${esc(rotBrief("tipo",o.tipo))} · ${esc(rotBrief("fase",o.fase))}<br><small>${esc(rotBrief("arquitetura",o.arquitetura))} · ${esc(rotBrief("sondagem",o.sondagem))}</small></dd>
    <dt>Disciplinas</dt><dd>${discs}</dd>
    <dt>Observações</dt><dd>${esc(o.mensagem||"—")}</dd>
  </dl>
  <p><label>Status <select id="d-st">${STATUS.map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}</select></label></p>
  <p><label>Notas internas<textarea id="d-notas" maxlength="5000">${esc(o.notas||"")}</textarea></label></p>
  <p class="omsg" id="d-msg"></p>
  <div class="pdbtn">
    <button class="btn" id="d-save">Salvar</button>
    <a class="btn ghost" href="honorarios.html?sol=${encodeURIComponent(o.id)}&${qs.toString()}" target="_blank" rel="noopener">Abrir em honorários</a>
    ${w?`<a class="btn ghost" href="${w}" target="_blank" rel="noopener">WhatsApp do cliente</a>`:""}
    <button class="btn danger" id="d-del">Excluir</button>
  </div>`;
  $("#dlg").hidden=false;
  $("#d-save").onclick=async()=>{
    const m=$("#d-msg");
    try{
      const ch={status:$("#d-st").value,notas:$("#d-notas").value,updatedAt:serverTimestamp()};
      await updateDoc(doc(db,"solicitacoes",id),ch);
      Object.assign(o,ch);m.className="omsg ok";m.textContent="Salvo.";list();badge();
    }catch(e){m.className="omsg err";m.textContent="Erro: "+(e.code||e.message)}
  };
  $("#d-del").onclick=async()=>{
    if(!confirm(`Excluir a solicitação ${o.numero}?`))return;
    try{await deleteDoc(doc(db,"solicitacoes",id));all=all.filter(x=>x.id!==id);$("#dlg").hidden=true;list();badge()}
    catch(e){$("#d-msg").className="omsg err";$("#d-msg").textContent="Erro: "+(e.code||e.message)}
  };
}

$("#sol-q")&&($("#sol-q").oninput=list);
$("#sol-fst")&&($("#sol-fst").onchange=list);
$("#sol-reload")&&($("#sol-reload").onclick=load);

document.querySelectorAll(".ptabs button").forEach(b=>b.addEventListener("click",()=>{
  if(b.dataset.tab==="sol"&&!loaded)load();
}));

if(location.hash==="sol"||location.hash==="#sol"){
  const btn=document.querySelector('.ptabs button[data-tab="sol"]');
  if(btn)btn.click();
}

onAuthStateChanged(auth,u=>{if(u&&isAdmin(u))load()});
