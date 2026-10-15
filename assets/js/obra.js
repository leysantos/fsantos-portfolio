import {orcar,PRESETS,TIPOS,TAMB,REGRAS,CUB,SINAPI,defCob} from "./obra-modelo.js";
import {esc} from "./orcamento.js";
const F2={minimumFractionDigits:2,maximumFractionDigits:2},num=v=>(+v||0).toLocaleString("pt-BR",F2),brl=v=>"R$ "+num(v);
const $=s=>document.querySelector(s),tb=$("#amb"),msg=$("#ob-msg"),pf=v=>parseFloat(String(v).replace(/\s/g,"").replace(/\.(?=\d{3}(\D|$))/g,"").replace(",","."))||0;
(()=>{const b=document.querySelector(".burger"),n=document.getElementById("menu");if(b)b.onclick=()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)}})();
const regTxt=r=>r==="d"?"Desonerado":"Não desonerado";
$("#oref").innerHTML=`Base de preços: <b>SINAPI ${SINAPI.ref}</b> · Manaus/AM · composições com encargos sociais (<span id="oreg">não desonerado</span>)`;
$("#regras").innerHTML=REGRAS.map(r=>`<li>${esc(r)}</li>`).join("");
const PAVOPT=p=>`<select class="a-p" aria-label="Pavimento"><option value="0" ${!p?"selected":""}>Todos</option>${[1,2,3,4].map(k=>`<option value="${k}" ${+p===k?"selected":""}>${k===1?"Térreo":k-1+"º sup."}</option>`).join("")}</select>`;
function row(a={nome:"",t:"s",l:3,c:3,p:1}){const tr=document.createElement("tr");
  tr.innerHTML=`<td><input class="a-n" maxlength="60" value="${esc(a.nome)}"></td><td><select class="a-t">${Object.entries(TAMB).map(([k,v])=>`<option value="${k}" ${k===a.t?"selected":""}>${v}</option>`).join("")}</select></td><td><input class="a-l" inputmode="decimal" value="${num(a.l)}"></td><td><input class="a-c" inputmode="decimal" value="${num(a.c)}"></td><td>${PAVOPT(a.p)}</td><td class="a-a"></td><td><button type="button" class="rm" aria-label="Remover">×</button></td>`;
  tr.querySelector(".rm").onclick=()=>{tr.remove();draw()};tb.append(tr)}
function preset(){tb.innerHTML="";PRESETS[$("#p-tipo").value].forEach(([nome,t,l,c,p])=>row({nome,t,l,c,p:p||1}))}
function input(){const tipo=$("#p-tipo").value;return{tipo,pav:Math.min(4,Math.max(1,parseInt($("#p-pav").value)||1)),pd:pf($("#p-pd").value)||TIPOS[tipo].pd,regime:$("#p-reg").value,bdi:Math.min(60,Math.max(0,pf($("#p-bdi").value))),
  terreno:{l:pf($("#t-l").value),c:pf($("#t-c").value)},muro:{on:$("#m-on").checked,h:pf($("#m-h").value)||2,frente:$("#m-frente").checked,fundos:$("#m-fundos").checked,esq:$("#m-esq").checked,dir:$("#m-dir").checked},
  ambientes:[...tb.children].slice(0,40).map(tr=>({nome:tr.querySelector(".a-n").value.trim().slice(0,60),t:tr.querySelector(".a-t").value,l:pf(tr.querySelector(".a-l").value),c:pf(tr.querySelector(".a-c").value),p:+tr.querySelector(".a-p").value})),
  cliente:{nome:$("#c-nome").value.trim().slice(0,120),telefone:$("#c-tel").value.trim().slice(0,40),email:$("#c-email").value.trim().slice(0,120)},cidade:$("#c-cid").value.trim().slice(0,100),calibrar:$("#p-cal").checked,cobertura:$("#p-cob").value,telha:$("#p-telha").value,mezanino:{on:$("#p-mez").value==="1",area:pf($("#p-meza").value)}}}
let R=null,IN=null;
const pct=(a,b)=>b?(a/b*100):0;
function cubBox(r){if(!r.cub)return`<p class="onote">${r.Q.gc?`Galpão comercial: orçamento <b>não calibrado</b>. O CUB-AM comercial (CSL-8-N ${brl(CUB["CSL8-N"])}/m², CAL-8-N ${brl(CUB["CAL8-N"])}/m², ${CUB.ref}) é de edifício de 8 pavimentos e não representa galpão térreo; o valor reflete apenas as composições SINAPI.`:"Galpão: orçamento não calibrado; reflete apenas as composições SINAPI."}</p>`;
  const b=r.base0/r.Q.Ac,d=pct(b-r.cub,r.cub);
  return`<p class="onote">Comparação com o <b>CUB-AM ${r.cubCod}</b> (${CUB.fonte}, ${CUB.ref}): ${brl(r.cub)}/m². Base comparável SINAPI (sem fundações, muro/área externa e BDI): <b>${brl(b)}/m²</b> (${d>=0?"+":""}${num(d)}%). ${r.ajuste?`<b>Ajuste de padrão aplicado: ${brl(r.ajuste)}</b> (etapa 19), igualando a base comparável ao CUB-AM. Sem o ajuste, o total seria ${brl(r.semAjuste.total)} (${brl(r.semAjuste.m2)}/m²).`:"Calibração pelo CUB-AM desativada."}</p>`}
function draw(){[...tb.children].forEach(tr=>{tr.querySelector(".a-a").textContent=num(pf(tr.querySelector(".a-l").value)*pf(tr.querySelector(".a-c").value))});
  $("#m-lados").hidden=!$("#m-on").checked;$("#oreg").textContent=regTxt($("#p-reg").value).toLowerCase();
  IN=input();if(!IN.ambientes.some(a=>a.l>0&&a.c>0)){$("#res").innerHTML="<p>Inclua ao menos um ambiente.</p>";$("#tab").innerHTML="";R=null;return}
  {const Q0=orcar(IN).Q,PN=k=>k===1?"térreo":k-1+"º superior";$("#a-sum").innerHTML=`Área dos ambientes por pavimento: ${Q0.Afl.slice(0,IN.pav).map((A,i)=>`${PN(i+1)} ${num(A/Q0.T.kp)} m²`).join(" · ")}. Área construída total (com paredes): <b>${num(Q0.Ac)} m²</b>.${Q0.Amez?` Mezanino: ${num(Q0.Amez)} m² (incluído).`:""}${Q0.mezErr?` <span style="color:#ffb4a6">Mezanino de ${num(Q0.mezReq)} m² maior que a projeção do galpão (${num(Math.max(...Q0.Afl)/Q0.T.kp)} m²); limitado à projeção.</span>`:""}${Q0.nPav<IN.pav?` <span style="color:#ffb4a6">Há pavimento(s) sem ambientes; inclua ambientes neles ou use “Todos”.</span>`:""}`}
  R=orcar(IN);const r=R,Q=r.Q;
  $("#res").innerHTML=`<div class="obcards"><div><span>Área construída</span><b>${num(Q.Ac)} m²</b><small>ambientes ${num(Q.Aamb)} m² · ${Q.n} pav.</small></div><div><span>Custo direto</span><b>${brl(r.direto)}</b><small>${brl(r.m2dir)}/m²</small></div><div><span>BDI ${num(IN.bdi)}%</span><b>${brl(r.bdi)}</b></div><div class="hi"><span>Total estimado</span><b>${brl(r.total)}</b><small>${brl(r.m2)}/m²</small></div><div><span>Prazo estimado</span><b>${num(Math.round(Q.dur*10)/10)} meses</b></div></div>
  ${cubBox(r)}<h3>Participação por etapa</h3><div class="obbars">${r.etapas.map(e=>`<div class="obb"><span>${e.n}. ${esc(e.nome)}</span><i style="--w:${pct(e.sub,r.direto).toFixed(2)}%"></i><b>${num(pct(e.sub,r.direto))}%</b></div>`).join("")}</div>`;
  $("#tab").innerHTML=`<h3>Planilha analítica — SINAPI ${esc(r.ref)} · ${r.regime}</h3>`+tabela(r);
  const t=`Olá! Fiz o orçamento estimativo de obra no site: ${TIPOS[IN.tipo].nome}, ${num(Q.Ac)} m², total estimado ${brl(r.total)} (${brl(r.m2)}/m², SINAPI ${r.ref}). Gostaria de conversar.`;
  $("#b-wa").href="https://wa.me/5592992262786?text="+encodeURIComponent(t)}
function tabela(r,pdf){return`<div class="otab"><table class="obt"><thead><tr><th>Item</th><th>Código SINAPI</th><th>Descrição</th><th>Un.</th><th>Qtd.</th><th>Custo unit.</th><th>Total</th></tr></thead><tbody>${r.etapas.map(e=>`<tr class="grp"><td>${e.n}</td><td colspan="5">${esc(e.nome.toUpperCase())}</td><td>${brl(e.sub)}</td></tr>`+e.itens.map(x=>`<tr><td>${x.item}</td><td>${x.c.startsWith("VERBA")?"Verba":x.c}</td><td>${esc(x.desc)}${x.o&&!x.c.startsWith("VERBA")?`<small>${esc(x.o)}</small>`:""}</td><td>${esc(x.u)}</td><td>${num(x.q)}</td><td>${brl(x.pu)}</td><td>${brl(x.tot)}</td></tr>`).join("")).join("")}
<tr class="sub"><td colspan="6">Custo direto</td><td>${brl(r.direto)}</td></tr><tr class="sub"><td colspan="6">BDI (${num(IN.bdi)}%)</td><td>${brl(r.bdi)}</td></tr><tr class="tot"><td colspan="6">TOTAL ESTIMADO (${brl(r.m2)}/m²)</td><td>${brl(r.total)}</td></tr></tbody></table></div>`}
const tipoUI=()=>{const t=$("#p-tipo").value,g=t.startsWith("galpao");$("#l-pav").hidden=g;if(g)$("#p-pav").value="1";$("#l-cob").hidden=g;$("#l-mez").hidden=!g;$("#l-meza").hidden=!g||$("#p-mez").value!=="1"};
$("#p-tipo").onchange=()=>{const t=$("#p-tipo").value;$("#p-pd").value=num(TIPOS[t].pd);$("#p-cob").value=defCob(t);tipoUI();preset();draw()};$("#p-mez").addEventListener("change",tipoUI);tipoUI();
$("#ob-form").addEventListener("input",draw);$("#a-add").onclick=()=>{if(tb.children.length<40){row();draw()}};$("#a-pre").onclick=()=>{preset();draw()};
preset();draw();
// exportações
function linhas(){return[["Item","Código SINAPI","Descrição","Observação","Unidade","Quantidade","Custo unitário","Total"],...R.etapas.flatMap(e=>[[String(e.n),"",e.nome.toUpperCase(),"","","","",e.sub],...e.itens.map(x=>[x.item,x.c,x.desc,x.o||"",x.u,x.q,x.pu,x.tot])]),["","","Custo direto","","","","",R.direto],["","","BDI "+IN.bdi+"%","","","","",R.bdi],["","","TOTAL","","","","",R.total]]}
const nomeArq=ext=>`orcamento-obra-${IN.tipo}-${Math.round(R.Q.Ac)}m2-sinapi-${R.ref.replace("/","-")}.${ext}`;
function baixar(blob,n){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
$("#b-csv").onclick=()=>{if(!R)return;const c=v=>typeof v==="number"?String(Math.round(v*100)/100).replace(".",","):'"'+String(v??"").replace(/"/g,'""')+'"';
  baixar(new Blob(["\ufeff"+[[`Orçamento estimativo — ${TIPOS[IN.tipo].nome} — ${num(R.Q.Ac)} m² — SINAPI ${R.ref} AM ${R.regime}`],...linhas()].map(l=>l.map(c).join(";")).join("\r\n")],{type:"text/csv;charset=utf-8"}),nomeArq("csv"))};
$("#b-xlsx").onclick=async()=>{if(!R)return;try{const X=await import("https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs");
  const ws=X.utils.aoa_to_sheet([[`Orçamento estimativo de obra — FSantos Engenharia`],[`${TIPOS[IN.tipo].nome} — ${num(R.Q.Ac)} m² — SINAPI ${R.ref} Manaus/AM — ${R.regime}`],[],...linhas()]);ws["!cols"]=[{wch:7},{wch:12},{wch:70},{wch:40},{wch:6},{wch:11},{wch:13},{wch:14}];
  const wb=X.utils.book_new();X.utils.book_append_sheet(wb,ws,"Orçamento");X.writeFile(wb,nomeArq("xlsx"))}catch(e){console.error(e);msg.className="omsg err";msg.textContent="Não foi possível gerar o XLSX agora; use o CSV."}};
// PDF + Firestore
function numero(){const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",r=crypto.getRandomValues(new Uint8Array(4));return`OBR-${new Date().getFullYear()}-`+[...r].map(b=>a[b%a.length]).join("")}
// ---- conta (Firebase Auth) ----
let FBM=null,USER=null,PERFIL=null;
async function fb(){if(FBM)return FBM;const [cfg,A,F]=await Promise.all([import("./firebase-config.js"),import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"),import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")]);return FBM={...cfg,A,F}}
const am=(t,ok)=>{const m=$("#au-msg");m.className="omsg "+(ok?"ok":"err");m.textContent=t};
const errTxt=e=>({"auth/invalid-credential":"E-mail ou senha incorretos.","auth/wrong-password":"E-mail ou senha incorretos.","auth/user-not-found":"Conta não encontrada.","auth/email-already-in-use":"Este e-mail já tem conta; use Entrar.","auth/weak-password":"A senha precisa ter ao menos 6 caracteres.","auth/invalid-email":"E-mail inválido.","auth/popup-closed-by-user":"Login cancelado.","auth/operation-not-allowed":"Login por e-mail ainda não habilitado no Firebase."}[e.code]||("Erro: "+(e.code||e.message)));
let modo="login";document.querySelectorAll(".autabs button").forEach(b=>b.onclick=()=>{modo=b.dataset.m;document.querySelectorAll(".autabs button").forEach(x=>x.classList.toggle("on",x===b));document.querySelectorAll(".au-cad").forEach(x=>x.hidden=modo!=="cad");$("#au-go").textContent=modo==="cad"?"Criar conta":"Entrar";$("#au-pass").autocomplete=modo==="cad"?"new-password":"current-password"});
async function salvarPerfil(u,nome,tel){const {db,F}=await fb();const ref=F.doc(db,"users",u.uid),ex=await F.getDoc(ref);
  const d={nome:String(nome||u.displayName||"").slice(0,120),telefone:String(tel||"").slice(0,40),email:String(u.email||"").slice(0,120),updatedAt:F.serverTimestamp()};
  if(!ex.exists())await F.setDoc(ref,{...d,createdAt:F.serverTimestamp()});else await F.updateDoc(ref,d);PERFIL={...(ex.exists()?ex.data():{}),...d}}
$("#au-google").onclick=async()=>{try{const {auth,A}=await fb();await A.signInWithPopup(auth,new A.GoogleAuthProvider())}catch(e){am(errTxt(e))}};
$("#au-go").onclick=async()=>{const em=$("#au-email").value.trim(),pw=$("#au-pass").value;try{const {auth,A}=await fb();
  if(modo==="cad"){const nome=$("#au-nome").value.trim(),tel=$("#au-tel").value.trim();if(!nome||!tel)return am("Informe nome e telefone.");
    const c=await A.createUserWithEmailAndPassword(auth,em,pw);await A.updateProfile(c.user,{displayName:nome});await salvarPerfil(c.user,nome,tel);fill(c.user)}
  else await A.signInWithEmailAndPassword(auth,em,pw)}catch(e){am(errTxt(e))}};
$("#au-reset").onclick=async()=>{const em=$("#au-email").value.trim();if(!em)return am("Digite seu e-mail para receber o link.");try{const {auth,A}=await fb();await A.sendPasswordResetEmail(auth,em);am("Enviamos o link de redefinição para "+em+".",1)}catch(e){am(errTxt(e))}};
$("#au-sair").onclick=async()=>{const {auth,A}=await fb();await A.signOut(auth)};
function fill(u){$("#c-nome").value=PERFIL?.nome||u.displayName||"";$("#c-tel").value=PERFIL?.telefone||"";$("#c-email").value=u.email||"";draw()}
(async()=>{try{const {auth,A,db,F}=await fb();A.onAuthStateChanged(auth,async u=>{USER=u;$("#au-out").hidden=!!u;$("#au-in").hidden=!u;$("#meus").hidden=!u;$("#au-msg").textContent="";
  if(!u){PERFIL=null;return}$("#au-who").textContent=u.email||u.displayName;
  try{const s=await F.getDoc(F.doc(db,"users",u.uid));PERFIL=s.exists()?s.data():null;if(!PERFIL)await salvarPerfil(u,u.displayName,"")}catch(e){console.error(e)}
  fill(u);meus()})}catch(e){console.error(e);am("Serviço de login indisponível no momento.")}})();
let MEUS=[];
async function meus(){if(!USER)return;const {db,F}=await fb();try{const s=await F.getDocs(F.query(F.collection(db,"orcamentos_obra"),F.where("uid","==",USER.uid)));
  MEUS=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
  $("#meus-rows").innerHTML=MEUS.map((o,i)=>`<tr data-i="${i}"><td>${o.createdAt?.toDate?o.createdAt.toDate().toLocaleDateString("pt-BR"):"—"}</td><td>${esc(o.numero)}</td><td>${esc(TIPOS[o.tipo]?.nome||o.tipo)}</td><td>${num(o.areaConstruida)}</td><td>${brl(o.total)}</td><td>${brl(o.totalPorM2)}</td></tr>`).join("")||'<tr><td colspan="6">Nenhum orçamento salvo ainda.</td></tr>';
  $("#meus-rows").querySelectorAll("tr[data-i]").forEach(r=>r.onclick=()=>carregar(MEUS[+r.dataset.i]))}catch(e){$("#meus-rows").innerHTML=`<tr><td colspan="6">Não foi possível carregar (${esc(e.code||e.message)}).</td></tr>`}}
function carregar(o){const x=o.entradas||{};$("#p-tipo").value=o.tipo;$("#p-pav").value=o.pavimentos;$("#p-pd").value=num(o.peDireito);$("#p-reg").value=o.regime;$("#p-bdi").value=num(o.bdi);$("#p-cal").checked=x.calibrar!==false;
  $("#t-l").value=num(o.terreno?.largura);$("#t-c").value=num(o.terreno?.comprimento);$("#m-on").checked=!!o.muro?.ativo;$("#m-h").value=num(o.muro?.altura||2);["frente","fundos","esq","dir"].forEach(k=>$("#m-"+k).checked=!!x["muro_"+k]);
  tb.innerHTML="";(o.ambientes||[]).forEach(a=>row({nome:a.nome,t:a.tipo,l:a.largura,c:a.comprimento}));if(o.cidade)$("#c-cid").value=o.cidade;draw();scrollTo({top:$("#res").offsetTop-80,behavior:"smooth"})}
async function salvar(no){const {db,F}=await fb();const r2=v=>Math.round(v*100)/100;
  const d={numero:no,uid:USER.uid,cliente:IN.cliente,cidade:IN.cidade,tipo:IN.tipo,pavimentos:IN.tipo.startsWith("galpao")?1:IN.pav,cobertura:R.Q.OP.cob,telha:R.Q.OP.telha,mezanino:r2(R.Q.Amez),peDireito:r2(IN.pd),regime:IN.regime,bdi:r2(IN.bdi),sinapiRef:String(R.ref),
    terreno:{largura:r2(IN.terreno.l),comprimento:r2(IN.terreno.c)},muro:{ativo:IN.muro.on,altura:r2(IN.muro.h),comprimento:r2(R.Q.Lmuro)},
    entradas:{calibrar:IN.calibrar!==false,muro_frente:IN.muro.frente,muro_fundos:IN.muro.fundos,muro_esq:IN.muro.esq,muro_dir:IN.muro.dir},
    ambientes:IN.ambientes.filter(a=>a.l>0&&a.c>0).map(a=>({nome:a.nome,tipo:a.t,largura:r2(a.l),comprimento:r2(a.c),pavimento:a.p??1})),
    etapas:R.etapas.map(e=>({n:e.n,nome:e.nome,subtotal:r2(e.sub)})),areaConstruida:r2(R.Q.Ac),custoDireto:r2(R.direto),ajusteCub:r2(R.ajuste||0),total:r2(R.total),totalPorM2:r2(R.m2),status:"novo",createdAt:F.serverTimestamp()};
  await Promise.race([F.addDoc(F.collection(db,"orcamentos_obra"),d),new Promise((_,j)=>setTimeout(()=>j(new Error("timeout")),12000))]);
  try{await salvarPerfil(USER,IN.cliente.nome,IN.cliente.telefone)}catch(e){}}
export function renderPDF(r,inp,no,el=document.getElementById("proposta")){const c=inp.cliente,Q=r.Q,hoje=new Date().toLocaleDateString("pt-BR"),bl="________________";
  el.innerHTML=`<div class="pp-head"><img src="assets/img/logo-fsantos.png" alt=""><div><strong>FSantos Engenharia</strong><br>Eng. Civil Francirley Pereira Santos — CREA 31.410-AM<br>(92) 99226-2786 · leyfps@gmail.com</div>${no?`<div class="pp-num">Nº ${esc(no)}</div>`:""}</div>
<p class="pp-flag">ORÇAMENTO ESTIMATIVO — não substitui orçamento executivo</p><h2>Orçamento estimativo de obra</h2><p class="pp-sub">${esc(TIPOS[inp.tipo].nome)} · SINAPI ${esc(r.ref)} · Manaus/AM · ${r.regime}</p>
<p>Manaus/AM, ${hoje}<br>Cliente: <b>${esc(c.nome||bl)}</b> · Telefone: ${esc(c.telefone||bl)}${c.email?` · E-mail: ${esc(c.email)}`:""}<br>Cidade da obra: ${esc(inp.cidade||bl)}</p>
<h3>1. Dados da obra</h3><table class="pp-t"><tbody><tr><td>Terreno</td><td>${num(inp.terreno.l)} × ${num(inp.terreno.c)} m (${num(inp.terreno.l*inp.terreno.c)} m²)</td><td>Área dos ambientes</td><td>${num(Q.Aamb)} m²</td></tr><tr><td>Área construída estimada</td><td><b>${num(Q.Ac)} m²</b></td><td>Pavimentos / pé-direito</td><td>${Q.n} / ${num(Q.h)} m</td></tr><tr><td>Muro</td><td>${Q.Lmuro?num(Q.Lmuro)+" m × "+num(Q.hm)+" m":"não"}</td><td>Prazo estimado</td><td>${num(Math.round(Q.dur*10)/10)} meses</td></tr></tbody></table>
<p class="pp-amb"><b>Cobertura:</b> ${Q.g?"telhado metálico":Q.OP.cob==="completa"?"completa (laje + estrutura metálica + telhado)":"simples (telhado + forro)"} · <b>Telha:</b> ${Q.OP.telha==="termo"?"termoacústica (sanduíche)":"simples"}${Q.g?` · <b>Mezanino:</b> ${Q.Amez?num(Q.Amez)+" m²":"não"}`:""}</p><p class="pp-amb"><b>Ambientes:</b> ${inp.ambientes.filter(a=>a.l>0&&a.c>0).map(a=>`${esc(a.nome||TAMB[a.t])} ${num(a.l)}×${num(a.c)}${inp.pav>1?` (${+a.p?(+a.p===1?"térreo":(+a.p-1)+"º sup."):"todos"})`:""}`).join(" · ")}</p>
<h3>2. Resumo por etapa</h3><table class="pp-t"><thead><tr><th>Etapa</th><th>Total</th><th>%</th></tr></thead><tbody>${r.etapas.map(e=>`<tr><td>${e.n}. ${esc(e.nome)}</td><td>${brl(e.sub)}</td><td>${num(pct(e.sub,r.direto))}%</td></tr>`).join("")}<tr><td><b>Custo direto</b></td><td><b>${brl(r.direto)}</b></td><td>100%</td></tr><tr><td>BDI (${num(inp.bdi)}%)</td><td>${brl(r.bdi)}</td><td></td></tr></tbody></table>
<p class="pp-tot">Valor total estimado: <b>${brl(r.total)}</b> <small>(${brl(r.m2)}/m²)</small></p>${cubBox(r)}
<h3>3. Planilha analítica</h3>${tabela(r,1)}
<h3>4. Premissas e observações</h3><ul class="pp-reg"><li>Estimativa paramétrica a partir de quantitativos derivados das áreas informadas; não substitui orçamento executivo baseado em projetos.</li><li>Preços: SINAPI/Caixa, ref. ${esc(r.ref)}, Manaus/AM, ${r.regime.toLowerCase()}. Não inclui terreno, projetos, licenças, mobiliário, paisagismo, ligações definitivas pelas concessionárias nem itens não listados.</li>${REGRAS.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
<div class="pp-sig"><div class="pp-sb"><div class="pp-sl"><img src="assets/img/logo-fsantos.png" alt=""></div><div class="pp-line"></div><div class="pp-st"><b>ENG. CIVIL FRANCIRLEY PEREIRA SANTOS</b><br>CREA 31.410-AM</div></div></div>
<div class="pp-act noprint"><button class="btn" data-a="print">Imprimir / salvar PDF</button><button class="btn ghost" data-a="close">Fechar</button></div>`;
  el.querySelector('[data-a="print"]').onclick=()=>print();el.querySelector('[data-a="close"]').onclick=()=>document.body.classList.remove("pp-open");
  document.body.classList.add("pp-open");scrollTo(0,0)}
$("#b-pdf").onclick=async()=>{draw();if(!R)return;msg.className="omsg";
  if(!USER){msg.textContent="Entre ou crie sua conta (passo 1) para gerar o orçamento.";msg.classList.add("err");$("#auth").scrollIntoView({behavior:"smooth"});return}
  if(!IN.cliente.nome||!IN.cliente.telefone){msg.textContent="Informe nome e telefone para gerar o orçamento.";msg.classList.add("err");$("#c-nome").focus();return}
  const b=$("#b-pdf");b.disabled=true;b.textContent="Gerando…";let no=numero();
  try{await salvar(no);msg.textContent=`Orçamento ${no} salvo em Meus orçamentos.`;msg.classList.add("ok");meus()}
  catch(e){console.error(e);no="";msg.textContent="Não foi possível registrar agora; o PDF foi gerado mesmo assim.";msg.classList.add("err")}
  finally{b.disabled=false;b.textContent="Gerar orçamento em PDF"}
  renderPDF(R,IN,no)};
window.__obra={orcar,input,draw,get R(){return R}};
