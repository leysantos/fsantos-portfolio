import {ORC_CONFIG as C,COMPLEXIDADE_EST,ITEM_EST,calcItem,calcTotal,renderProposta,brl,num,esc,nomeDisc,descProjeto,htmlLinhasDisciplina,textoComplexidade,carregarConfig,parsePct} from "./orcamento.js?v=20261020a";
import {enviarPDF} from "./share-pdf.js";
const $=s=>document.querySelector(s),box=$("#o-itens"),msg=$("#o-msg");let n=0;
function addItem(){if(box.children.length>=10)return;const k=n++;const d=document.createElement("fieldset");d.className="oitem";
  d.innerHTML=`<legend>Relação dos projetos<span class="ono"></span></legend><div class="ogrid"><label>Descrição do projeto<input class="i-nome" maxlength="160" placeholder="Ex.: Residência térrea"></label><label>Área construída (m²)<input class="i-area" inputmode="decimal" value="100"></label></div>
  <div class="disc-actions"><button type="button" class="btn ghost small" data-act="all">Marcar todas</button><button type="button" class="btn ghost small" data-act="none">Desmarcar todas</button></div>
  <div class="disc">${C.disciplinas.map((x,i)=>`<label><input type="checkbox" value="${i}" ${x.incluir?"checked":""}> ${x.nome}</label>`).join("")}</div>
  <fieldset class="cx" hidden><legend>Complexidade do projeto estrutural</legend><p class="onote">Informe o percentual de acréscimo de cada item sobre o valor base do estrutural (máximo 100% por item). Deixe em branco o que não se aplica.</p><div class="cxgrid">${COMPLEXIDADE_EST.map(c=>`<label>${c.nome}<span class="cxin"><input class="i-cx" data-cx="${c.id}" inputmode="decimal" placeholder="0" aria-label="Percentual de ${c.nome}">%</span></label>`).join("")}</div></fieldset>
  <button type="button" class="rm">Remover projeto</button>`;
  d.querySelector(".rm").onclick=()=>{d.remove();draw()};
  d.querySelector('[data-act="all"]').onclick=()=>{d.querySelectorAll(".disc input").forEach(c=>c.checked=true);draw()};
  d.querySelector('[data-act="none"]').onclick=()=>{d.querySelectorAll(".disc input").forEach(c=>c.checked=false);draw()};
  box.append(d);draw()}
const f=id=>$("#o-"+id).value.trim();
const estOn=d=>[...d.querySelectorAll(".disc input:checked")].some(x=>C.disciplinas[+x.value]?.item===ITEM_EST);
function readCx(d){const o={};d.querySelectorAll(".i-cx").forEach(i=>{const v=parsePct(i.value);if(v>0)o[i.dataset.cx]=v});return o}
function read(){return[...box.children].map(d=>{const sel=[...d.querySelectorAll(".disc input:checked")].map(x=>+x.value),complexidade=estOn(d)?readCx(d):{};return{...calcItem({nome:d.querySelector(".i-nome").value.trim(),area:parseFloat(d.querySelector(".i-area").value.replace(/\./g,"").replace(",","."))||0,sel,complexidade}),sel}})}
function build(){const itens=read(),t=calcTotal(itens);return{cliente:{nome:f("nome").slice(0,120),telefone:f("tel").slice(0,40),email:f("email").slice(0,120)},projeto:descProjeto({itens}),cidade:f("cid").slice(0,100),itens,subtotal:t.subtotal,artPct:t.artPct,art:t.art,...(t.desc?{descPct:t.descPct,desc:t.desc}:{}),total:t.total,totalPorM2:t.totalPorM2,area:t.area}}
function draw(){[...box.children].forEach((d,i)=>{d.querySelector(".ono").textContent=box.children.length>1?" — item "+(i+1):"";d.querySelector(".rm").hidden=box.children.length<2;d.querySelector(".cx").hidden=!estOn(d);d.querySelectorAll(".i-cx").forEach(i=>{if(parsePct(i.value)>100)i.value="100"})});
  const o=build(),multi=o.itens.length>1;
  $("#o-tab tbody").innerHTML=o.itens.map((it,k)=>(multi?`<tr class="grp"><td colspan="6">${esc(it.nome||"Item "+(k+1))} — ${num(it.area)} m²</td></tr>`:"")+(it.disciplinas.map(htmlLinhasDisciplina).join("")||'<tr><td colspan="6">Selecione ao menos uma disciplina.</td></tr>')+(multi?`<tr class="sub"><td colspan="5">Subtotal</td><td>${brl(it.subtotal)}</td></tr>`:"")).join("");
  $("#o-sub").textContent=brl(o.subtotal);$("#o-artl").textContent=`Emissão das ART (${num(o.artPct)}% do subtotal)`;$("#o-artv").textContent=brl(o.art);{const r=$("#o-descr");if(r){r.hidden=!o.desc;$("#o-descl").textContent=`Desconto (${num(o.descPct||0)}% do subtotal)`;$("#o-descv").textContent="− "+brl(o.desc||0)}}$("#o-tot").textContent=brl(o.total);$("#o-med").textContent=brl(o.totalPorM2)+"/m²";
  const t=`Olá! Gostaria de um orçamento para ELABORAÇÃO DE PROJETOS (honorários técnicos — não inclui execução da obra, materiais ou mão de obra).\nCliente: ${o.cliente.nome||"-"}${o.projeto?`\nProjeto: ${o.projeto}`:""}\nCidade: ${o.cidade||"-"}\n`+o.itens.map((it,k)=>`• ${it.nome||"Item "+(k+1)} (${num(it.area)} m²): ${it.disciplinas.map(nomeDisc).join(", ")}${textoComplexidade(it)?`\n  Complexidade do estrutural: ${textoComplexidade(it)}`:""}`).join("\n")+`\n${o.art?`Subtotal dos projetos: ${brl(o.subtotal)}\nEmissão das ART (${num(o.artPct)}%): ${brl(o.art)}\n${o.desc?`Desconto (${num(o.descPct)}%): − ${brl(o.desc)}\n`:""}`:""}Total estimado (honorários de projeto): ${brl(o.total)}`;
  WA_TXT=t;$("#o-wa").href=`https://wa.me/${C.whatsapp}?text=`+encodeURIComponent(t);return o}
let WA_TXT="",ULT="";
function numero(){const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",r=crypto.getRandomValues(new Uint8Array(4));return`ORC-${new Date().getFullYear()}-`+[...r].map(b=>a[b%a.length]).join("")}
$("#o-form").addEventListener("input",draw);$("#o-add").onclick=addItem;addItem();
// ---- conta (Firebase Auth) + Meus orçamentos ----
let FBM=null,USER=null,PERFIL=null,ADMIN=false,EDIT=null,MEUS=[];const ADM="leyfps@gmail.com";
async function fb(){if(FBM)return FBM;const [cfg,A,F]=await Promise.all([import("./firebase-config.js?v=20261015c"),import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"),import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")]);return FBM={...cfg,A,F}}
const am=(t,ok)=>{const m=$("#oa-msg");m.className="omsg "+(ok?"ok":"err");m.textContent=t},mm=(t,ok)=>{const m=$("#om-msg");m.className="omsg "+(ok?"ok":"err");m.textContent=t};
const errTxt=e=>({"auth/invalid-credential":"E-mail ou senha incorretos.","auth/wrong-password":"E-mail ou senha incorretos.","auth/user-not-found":"Conta não encontrada.","auth/email-already-in-use":"Este e-mail já tem conta; use Entrar.","auth/weak-password":"A senha precisa ter ao menos 6 caracteres.","auth/invalid-email":"E-mail inválido.","auth/popup-closed-by-user":"Login cancelado.","auth/operation-not-allowed":"Login por e-mail ainda não habilitado no Firebase."}[e.code]||("Erro: "+(e.code||e.message)));
let modo="login";document.querySelectorAll(".oa-tabs button").forEach(b=>b.onclick=()=>{modo=b.dataset.m;document.querySelectorAll(".oa-tabs button").forEach(x=>x.classList.toggle("on",x===b));document.querySelectorAll(".oa-cad").forEach(x=>x.hidden=modo!=="cad");$("#oa-go").textContent=modo==="cad"?"Criar conta":"Entrar";$("#oa-pass").autocomplete=modo==="cad"?"new-password":"current-password"});
async function salvarPerfil(u,nome,tel){const {db,F}=await fb();const ref=F.doc(db,"users",u.uid),ex=await F.getDoc(ref);
  const d={nome:String(nome||u.displayName||"").slice(0,120),telefone:String(tel||"").slice(0,40),email:String(u.email||"").slice(0,120),updatedAt:F.serverTimestamp()};
  if(!ex.exists())await F.setDoc(ref,{...d,createdAt:F.serverTimestamp()});else await F.updateDoc(ref,d);PERFIL={...(ex.exists()?ex.data():{}),...d}}
$("#oa-google").onclick=async()=>{try{const {googleLogin}=await fb();await googleLogin(e=>am(errTxt(e)))}catch(e){am(errTxt(e))}};
$("#oa-go").onclick=async()=>{const em=$("#oa-email").value.trim(),pw=$("#oa-pass").value;try{const {auth,A}=await fb();
  if(modo==="cad"){const nome=$("#oa-nome").value.trim(),tel=$("#oa-tel").value.trim();if(!nome||!tel)return am("Informe nome e telefone.");
    const c=await A.createUserWithEmailAndPassword(auth,em,pw);await A.updateProfile(c.user,{displayName:nome});await salvarPerfil(c.user,nome,tel);fill(c.user)}
  else await A.signInWithEmailAndPassword(auth,em,pw)}catch(e){am(errTxt(e))}};
$("#oa-reset").onclick=async()=>{const em=$("#oa-email").value.trim();if(!em)return am("Digite seu e-mail para receber o link.");try{const {auth,A}=await fb();await A.sendPasswordResetEmail(auth,em);am("Enviamos o link de redefinição para "+em+".",1)}catch(e){am(errTxt(e))}};
$("#oa-sair").onclick=async()=>{const {auth,A}=await fb();fimEdit();await A.signOut(auth)};
function fill(u){if(EDIT)return;if(!$("#o-nome").value)$("#o-nome").value=PERFIL?.nome||u.displayName||"";if(!$("#o-tel").value)$("#o-tel").value=PERFIL?.telefone||"";if(!$("#o-email").value)$("#o-email").value=u.email||"";draw()}
const QS=new URLSearchParams(location.search);
(async()=>{try{const {auth,A,db,F}=await fb();A.onAuthStateChanged(auth,async u=>{USER=u;ADMIN=!!(u&&u.email===ADM&&u.emailVerified);$("#oa-out").hidden=!!u;$("#oa-in").hidden=!u;$("#o-meus").hidden=!u;$("#oa-msg").textContent="";
  if(!u){PERFIL=null;MEUS=[];return}$("#oa-who").textContent=u.email||u.displayName;
  try{const s=await F.getDoc(F.doc(db,"users",u.uid));PERFIL=s.exists()?s.data():null;if(!PERFIL)await salvarPerfil(u,u.displayName,"")}catch(e){console.error(e)}
  fill(u);await meus();
  const id=QS.get("edit")||QS.get("abrir");if(id){try{const s=await F.getDoc(F.doc(db,"orcamentos",id));if(!s.exists())throw new Error("não encontrado");const o={id:s.id,...s.data()};
    if(QS.get("pdf")){renderProposta({...o,data:o.createdAt?.toDate?o.createdAt.toDate():new Date()})}else carregar(o,!!QS.get("edit")&&!!o.uid)}
    catch(e){mm("Não foi possível abrir o orçamento ("+(e.code||e.message)+").")}}})}
  catch(e){console.error(e);am("Serviço de login indisponível no momento.")}})();
const dts=o=>o.createdAt?.toDate?o.createdAt.toDate().toLocaleDateString("pt-BR"):"—";
async function meus(){if(!USER)return;const {db,F}=await fb();try{const s=await F.getDocs(F.query(F.collection(db,"orcamentos"),F.where("uid","==",USER.uid)));
  MEUS=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
  $("#om-rows").innerHTML=MEUS.map((o,i)=>`<tr data-i="${i}"${EDIT&&EDIT.id===o.id?' class="ed"':""}><td>${dts(o)}</td><td>${esc(o.numero)}</td><td>${esc(o.projeto||o.itens?.[0]?.nome||"—")}</td><td>${num((o.itens||[]).reduce((s,x)=>s+(+x.area||0),0))}</td><td>${brl(o.total)}</td><td class="om-act"><button type="button" class="btn ghost small" data-ac="abrir">Abrir</button><button type="button" class="btn ghost small" data-ac="editar">Editar</button><button type="button" class="btn small" data-ac="pdf">Gerar proposta</button><button type="button" class="btn danger small" data-ac="excluir">Excluir</button></td></tr>`).join("")||'<tr><td colspan="6">Nenhum orçamento salvo ainda.</td></tr>';
  $("#om-rows").querySelectorAll("tr[data-i]").forEach(r=>{const o=MEUS[+r.dataset.i];const on=(k,fn)=>r.querySelector(`[data-ac="${k}"]`).onclick=ev=>{ev.stopPropagation();fn()};r.onclick=()=>carregar(o,false);
    on("abrir",()=>carregar(o,false));on("editar",()=>carregar(o,true));
    on("pdf",()=>renderProposta({...o,data:o.createdAt?.toDate?o.createdAt.toDate():new Date()}));
    on("excluir",async()=>{if(!confirm(`Excluir o orçamento ${o.numero}? Esta ação não pode ser desfeita.`))return;
      try{const {db,F}=await fb();await F.deleteDoc(F.doc(db,"orcamentos",o.id));if(EDIT&&EDIT.id===o.id)fimEdit();mm(`Orçamento ${o.numero} excluído.`,1);meus()}catch(e){mm("Não foi possível excluir ("+(e.code||e.message)+").")}})})}
  catch(e){$("#om-rows").innerHTML=`<tr><td colspan="6">Não foi possível carregar (${esc(e.code||e.message)}).</td></tr>`}}
function fimEdit(){EDIT=null;$("#om-ed").hidden=true;$("#o-gerar").textContent="Gerar proposta";document.querySelectorAll("#om-rows tr.ed").forEach(r=>r.classList.remove("ed"))}
$("#om-cancel").onclick=()=>{fimEdit();mm("Edição cancelada; o próximo orçamento será salvo como novo.",1)};
// restaura o formulário a partir do documento salvo (área, disciplinas marcadas, % ART, cliente/projeto/cidade)
function carregar(o,editar){box.innerHTML="";const its=o.itens?.length?o.itens:[{}];
  its.forEach((it,k)=>{addItem();const d=box.lastElementChild;d.querySelector(".i-nome").value=it.nome||(k===0&&o.projeto&&its.length===1?o.projeto:"");d.querySelector(".i-area").value=it.area!=null?String(it.area).replace(".",","):"";
    const sel=Array.isArray(it.sel)?it.sel:(it.disciplinas||[]).map(x=>C.disciplinas.findIndex(c=>c.item===x.item)).filter(i=>i>=0);
    d.querySelectorAll(".disc input").forEach(c=>c.checked=sel.includes(+c.value));
    const cx=it.complexidade&&!Array.isArray(it.complexidade)?it.complexidade:Object.fromEntries((it.disciplinas||[]).flatMap(x=>x.complexidade||[]).map(x=>[x.id,x.pct]));
    d.querySelectorAll(".i-cx").forEach(i=>{const v=cx[i.dataset.cx];i.value=v?String(v).replace(".",","):""})});
  $("#o-nome").value=o.cliente?.nome||"";$("#o-tel").value=o.cliente?.telefone||"";$("#o-email").value=o.cliente?.email||"";$("#o-cid").value=o.cidade||"";
  const r=draw();let av="";if(Math.abs((r.total||0)-(o.total||0))>0.05)av=` Atenção: com a tabela de preços atual o total é ${brl(r.total)} (salvo: ${brl(o.total)}). "Gerar proposta" na lista usa os valores salvos.`;
  if(editar){EDIT={id:o.id,numero:o.numero,uid:o.uid};$("#om-edt").textContent=`Editando ${o.numero}${USER&&o.uid!==USER.uid?" (orçamento de outro usuário — modo administrador)":""} — ao gerar a proposta as alterações serão salvas neste mesmo orçamento.`;$("#om-ed").hidden=false;$("#o-gerar").textContent="Salvar alterações e gerar proposta"}else fimEdit();
  mm(`Orçamento ${o.numero} carregado${editar?" para edição":""}.`+av,!av);$("#o-form").scrollIntoView({behavior:"smooth"})}
$("#o-gerar").onclick=async()=>{const o=draw();msg.className="omsg";
  if(!o.cliente.nome){msg.textContent="Informe o nome do cliente.";msg.classList.add("err");$("#o-nome").focus();return}
  if(!o.itens.length||o.itens.some(i=>!i.area||!i.disciplinas.length)){msg.textContent="Cada projeto precisa de área e de ao menos uma disciplina.";msg.classList.add("err");return}
  if(!USER){const btn=$("#o-gerar");btn.disabled=true;btn.textContent="Enviando…";o.numero=numero();
    try{const {db,F}=await fb();const {area,...doc}=o;await Promise.race([F.addDoc(F.collection(db,"orcamentos"),{...doc,semLogin:true,status:"novo",createdAt:F.serverTimestamp()}),new Promise((_,j)=>setTimeout(()=>j(new Error("timeout")),12000))]);
      msg.textContent=`Orçamento ${o.numero} registrado; entraremos em contato. Entre na sua conta (acima) para salvar seus orçamentos em Meus orçamentos e gerar a proposta novamente depois.`;msg.classList.add("ok")}
    catch(e){console.error(e);o.numero="";msg.textContent="Não foi possível registrar o orçamento agora. A proposta foi gerada mesmo assim; envie pelo WhatsApp para confirmar.";msg.classList.add("err")}
    finally{btn.disabled=false;btn.textContent="Gerar proposta"}
    ULT=o.numero||"";renderProposta({...o,data:new Date()});return}
  const btn=$("#o-gerar"),ed=!!EDIT;btn.disabled=true;btn.textContent="Salvando…";o.numero=ed?EDIT.numero:numero();
  try{const {db,F}=await fb();const {area,...doc}=o;let op;
    if(ed){op=F.updateDoc(F.doc(db,"orcamentos",EDIT.id),{...doc,...(doc.pagamento?{}:{pagamento:F.deleteField()}),uid:EDIT.uid,updatedAt:F.serverTimestamp()})}
    else op=F.addDoc(F.collection(db,"orcamentos"),{...doc,uid:USER.uid,status:"novo",createdAt:F.serverTimestamp()});
    await Promise.race([op,new Promise((_,j)=>setTimeout(()=>j(new Error("timeout")),12000))]);
    msg.textContent=ed?`Orçamento ${o.numero} atualizado.`:`Orçamento ${o.numero} salvo em Meus orçamentos. Entraremos em contato.`;msg.classList.add("ok");if(ed)fimEdit();meus()}
  catch(e){console.error(e);if(!ed)o.numero="";msg.textContent="Não foi possível salvar o orçamento agora ("+(e.code||e.message)+"). A proposta foi gerada mesmo assim; envie pelo WhatsApp para confirmar.";msg.classList.add("err")}
  finally{btn.disabled=false;btn.textContent=EDIT?"Salvar alterações e gerar proposta":"Gerar proposta"}
  ULT=o.numero||"";renderProposta({...o,data:new Date()})};
// "Enviar pelo WhatsApp": gera o PDF da proposta e abre o menu de compartilhar com o arquivo anexado
$("#o-wa").onclick=async ev=>{ev.preventDefault();const o=draw(),b=$("#o-wa");msg.className="omsg";
  if(!o.itens.some(i=>i.disciplinas.length)){msg.textContent="Selecione ao menos uma disciplina.";msg.classList.add("err");return}
  if(b.dataset.busy)return;b.dataset.busy=1;const lbl=b.textContent;b.textContent="Gerando PDF…";
  const no=ULT||"",nome=`Proposta-${no||"FSantos"}.pdf`;renderProposta({...o,numero:no,data:new Date()});
  const tx=`Proposta de honorários${no?" Nº "+no:""} — ${o.cliente.nome||"cliente"}. Total: ${brl(o.total)}.`;
  try{const r=await enviarPDF({el:$("#proposta"),nome,titulo:"Proposta "+(no||"FSantos Engenharia"),texto:no?tx:WA_TXT,fone:C.whatsapp});
    if(r.r==="fallback-link"){msg.innerHTML=`PDF baixado (${esc(nome)}). <a href="${esc(r.url)}" target="_blank" rel="noopener">Abrir o WhatsApp</a> e anexe o arquivo.`;msg.classList.add("ok")}
    else if(r.r==="fallback"){msg.textContent=`PDF baixado (${nome}). Anexe-o na conversa do WhatsApp que foi aberta.`;msg.classList.add("ok")}}
  catch(e){console.error(e);msg.textContent="Não foi possível gerar o PDF agora; use “Imprimir / salvar PDF” na proposta.";msg.classList.add("err")}
  finally{delete b.dataset.busy;b.textContent=lbl}};

// configuração do site (ART, preços, prazos, contato) — usa os padrões se indisponível
(async()=>{try{const {db,F}=await fb();if(await carregarConfig(db,F)){draw()}}catch(e){console.warn(e)}})();
