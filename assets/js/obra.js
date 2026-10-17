import {orcar,PRESETS,TIPOS,TAMB,REGRAS,REGRAS_CONT,CONT_SIS,CUB,SINAPI,defCob} from "./obra-modelo.js";
import {esc} from "./orcamento.js?v=20261017r";
import {enviarPDF} from "./share-pdf.js";
const F2={minimumFractionDigits:2,maximumFractionDigits:2},num=v=>(+v||0).toLocaleString("pt-BR",F2),brl=v=>"R$ "+num(v);
const $=s=>document.querySelector(s),tb=$("#amb"),msg=$("#ob-msg"),pf=v=>parseFloat(String(v).replace(/\s/g,"").replace(/\.(?=\d{3}(\D|$))/g,"").replace(",","."))||0;
(()=>{const b=document.querySelector(".burger"),n=document.getElementById("menu");if(b)b.onclick=()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)}})();
const regTxt=r=>r==="d"?"Desonerado":"Não desonerado";
$("#oref").innerHTML=`Base de preços: <b>SINAPI ${SINAPI.ref}</b> · Manaus/AM · composições com encargos sociais (<span id="oreg">não desonerado</span>)`;
$("#regras").innerHTML=REGRAS.map(r=>`<li>${esc(r)}</li>`).join("");
const CT=()=>$("#p-tipo").value==="muro_contencao";
const NPAV=()=>$("#p-tipo").value.startsWith("galpao")?1:Math.min(4,Math.max(1,parseInt($("#p-pav").value)||1));
const PNOME=(k,n)=>k===1?"Térreo":n===2?"Pav. superior":(k-1)+"º superior";
const PAVOPT=p=>{const n=NPAV(),v=+p>n?1:(n===1?1:+p);return`<select class="a-p" aria-label="Pavimento" ${n===1?"disabled":""}>${Array.from({length:n},(_,i)=>`<option value="${i+1}" ${v===i+1?"selected":""}>${PNOME(i+1,n)}</option>`).join("")}${n>1?`<option value="0" ${v===0?"selected":""}>Todos</option>`:""}</select>`};
const INTIMO=/quarto|dorm|su[ií]te|closet|master/i;
function autoPav(quiet){if(MODE==="simples")quiet=true;const n=NPAV();if(n<2||$("#p-tipo").value.startsWith("galpao"))return;const sup=2,rows=[...tb.children].map(tr=>({tr,n:tr.querySelector(".a-n").value,t:tr.querySelector(".a-t").value}));
  rows.forEach(r=>{r.f=/ed[ií]cula|lavabo|gourmet|escrit/i.test(r.n)?1:(r.t==="d"||INTIMO.test(r.n)||r.t==="b")?sup:1});
  const lav=rows.some(r=>r.f===1&&r.t==="b");if(!lav){const b=rows.find(r=>r.t==="b"&&!INTIMO.test(r.n))||rows.find(r=>r.t==="b");if(b)b.f=1}
  rows.forEach(r=>r.tr.querySelector(".a-p").value=String(r.f));
  if(quiet)return;const m=$("#a-note");m.textContent="Ambientes distribuídos automaticamente: áreas sociais no térreo e íntimas no "+(n===2?"pavimento superior":"1º superior")+". Você pode alterar o pavimento de cada ambiente."+(n>2?" Os demais pavimentos ficam vazios até você mover ambientes para eles.":"");m.hidden=false;clearTimeout(syncPav.t);syncPav.t=setTimeout(()=>m.hidden=true,7000)}
let MODE="simples";
const DEFAREA=t=>{const T=TIPOS[t];if(!PRESETS[t])return 0;return Math.round(PRESETS[t].reduce((s,r)=>s+r[2]*r[3],0)*T.kp)};
function gerarSimples(){if(CT())return;const t=$("#p-tipo").value,T=TIPOS[t],alvo=pf($("#p-area").value)||DEFAREA(t);const P=PRESETS[t],soma=P.reduce((s,r)=>s+r[2]*r[3],0);
  const k=Math.sqrt(Math.max(10,alvo)/(T.kp*soma)),r2=v=>Math.round(v*100)/100;tb.innerHTML="";
  P.forEach(([nome,tt,l,c,p])=>{const L=r2(l*k),C=r2(l*c*k*k/L);row({nome,t:tt,l:L,c:C,p:p||1})});
  if(NPAV()>1)autoPav(true);
  $("#p-cob").value=defCob(t);$("#p-telha").value="simples";$("#p-pis").value="0";$("#p-mez").value="0";$("#p-pd").value=num(T.pd);
  tb.querySelectorAll("input,select").forEach(e=>e.disabled=true)}
function setModo(m){MODE=m;const s=m==="simples";document.querySelector(".ob").classList.toggle("simples",s);$("#md-s").classList.toggle("on",s);$("#md-a").classList.toggle("on",!s);$("#md-s").setAttribute("aria-checked",s);$("#md-a").setAttribute("aria-checked",!s);
  $("#md-txt").textContent=s?"Informe tipo, terreno, muro e área; os ambientes seguem a distribuição típica do padrão.":"Edite ambientes, pavimentos, cobertura, telha, piscina/mezanino e demais parâmetros.";
  if(!s){tb.querySelectorAll("input,select").forEach(e=>e.disabled=false);PAVN=null;syncPav()}else{if(R)$("#p-area").value=num(R.Q.Ac)}
  draw()}
let PAVN=null;function syncPav(){const n=NPAV(),g=$("#p-tipo").value.startsWith("galpao");document.querySelector(".obamb").classList.toggle("nopav",g);if(n===PAVN)return;let reset=0;
  [...tb.children].forEach(tr=>{const s=tr.querySelector(".a-p");if(!s)return;const v=+s.value;if(v>n||(v===0&&n===1&&PAVN>1))reset++;const w=document.createElement("span");w.innerHTML=PAVOPT(v>n?1:v);s.replaceWith(w.firstChild)});
  if(PAVN&&n<PAVN&&reset){const m=$("#a-note");m.textContent=`${reset} ambiente(s) de pavimentos removidos voltaram para o Térreo.`;m.hidden=false;clearTimeout(syncPav.t);syncPav.t=setTimeout(()=>m.hidden=true,5000)}const ch=PAVN!==null&&n!==PAVN;PAVN=n;if(ch&&n>1)autoPav()}
function row(a={nome:"",t:"s",l:3,c:3,p:1}){const tr=document.createElement("tr");
  tr.innerHTML=`<td><input class="a-n" maxlength="60" value="${esc(a.nome)}"></td><td><select class="a-t">${Object.entries(TAMB).map(([k,v])=>`<option value="${k}" ${k===a.t?"selected":""}>${v}</option>`).join("")}</select></td><td><input class="a-l" inputmode="decimal" value="${num(a.l)}"></td><td><input class="a-c" inputmode="decimal" value="${num(a.c)}"></td><td>${PAVOPT(a.p)}</td><td class="a-a"></td><td><button type="button" class="rm" aria-label="Remover">×</button></td>`;
  tr.querySelector(".rm").onclick=()=>{tr.remove();draw()};tb.append(tr)}
function preset(){if(!PRESETS[$("#p-tipo").value]){tb.innerHTML="";return}tb.innerHTML="";PRESETS[$("#p-tipo").value].forEach(([nome,t,l,c,p])=>row({nome,t,l,c,p:p||1}));if(NPAV()>1)autoPav(true)}
function input(){const tipo=$("#p-tipo").value;return{tipo,pav:Math.min(4,Math.max(1,parseInt($("#p-pav").value)||1)),pd:pf($("#p-pd").value)||TIPOS[tipo].pd,regime:$("#p-reg").value,bdi:Math.min(60,Math.max(0,pf($("#p-bdi").value))),
  terreno:{l:pf($("#t-l").value),c:pf($("#t-c").value)},muro:{on:$("#m-on").checked,h:pf($("#m-h").value)||2,frente:$("#m-frente").checked,fundos:$("#m-fundos").checked,esq:$("#m-esq").checked,dir:$("#m-dir").checked},
  ambientes:[...tb.children].slice(0,40).map(tr=>({nome:tr.querySelector(".a-n").value.trim().slice(0,60),t:tr.querySelector(".a-t").value,l:pf(tr.querySelector(".a-l").value),c:pf(tr.querySelector(".a-c").value),p:+tr.querySelector(".a-p").value})),
  cliente:{nome:$("#c-nome").value.trim().slice(0,120),telefone:$("#c-tel").value.trim().slice(0,40),email:$("#c-email").value.trim().slice(0,120)},cidade:$("#c-cid").value.trim().slice(0,100),obra:$("#p-obra").value.trim().slice(0,160),clienteObra:$("#p-cli").value.trim().slice(0,120),calibrar:$("#p-cal").checked,modo:MODE,cobertura:$("#p-cob").value,telha:$("#p-telha").value,mezanino:{on:$("#p-mez").value==="1",area:pf($("#p-meza").value)},piscina:{on:$("#p-pis").value==="1",c:pf($("#p-pisc").value),l:pf($("#p-pisl").value),p:pf($("#p-pisp").value)},contencao:{sistema:$("#p-csis").value,comprimento:pf($("#p-cl").value),altura:pf($("#p-ch").value)}}}
let R=null,IN=null,WA_TXT="",ULT="";
const pct=(a,b)=>b?(a/b*100):0;
const idBox=()=>IN&&(IN.obra||IN.clienteObra)?`<p class="oid">${IN.obra?`<b>Obra:</b> ${esc(IN.obra)}`:""}${IN.obra&&IN.clienteObra?" · ":""}${IN.clienteObra?`<b>Cliente:</b> ${esc(IN.clienteObra)}`:""}</p>`:"";
function cubBox(r){if(r.cont)return`<p class="onote">Muro de contenção: orçamento <b>sem calibração pelo CUB-AM</b> (o CUB não possui padrão para contenções); reflete apenas as composições SINAPI. Pré-dimensionamento automático pela altura — confirmar com sondagem e projeto.</p>`;if(!r.cub)return`<p class="onote">${r.Q.gc?`Galpão comercial: orçamento <b>não calibrado</b>. O CUB-AM comercial (CSL-8-N ${brl(CUB["CSL8-N"])}/m², CAL-8-N ${brl(CUB["CAL8-N"])}/m², ${CUB.ref}) é de edifício de 8 pavimentos e não representa galpão térreo; o valor reflete apenas as composições SINAPI.`:"Galpão: orçamento não calibrado; reflete apenas as composições SINAPI."}</p>`;
  const b=r.base0/r.Q.Ac,d=pct(b-r.cub,r.cub);
  return`<p class="onote">Comparação com o <b>CUB-AM ${r.cubCod}</b> (${CUB.fonte}, ${CUB.ref}): ${brl(r.cub)}/m². Base comparável SINAPI (sem fundações, muro/área externa e BDI): <b>${brl(b)}/m²</b> (${d>=0?"+":""}${num(d)}%). ${r.ajuste?`<b>Ajuste de padrão aplicado: ${brl(r.ajuste)}</b> (etapa 19), igualando a base comparável ao CUB-AM. Sem o ajuste, o total seria ${brl(r.semAjuste.total)} (${brl(r.semAjuste.m2)}/m²).`:"Calibração pelo CUB-AM desativada."}</p>`}
function draw(){if(MODE==="simples"){gerarSimples();PAVN=NPAV()}syncPav();[...tb.children].forEach(tr=>{tr.querySelector(".a-a").textContent=num(pf(tr.querySelector(".a-l").value)*pf(tr.querySelector(".a-c").value))});
  $("#m-lados").hidden=!$("#m-on").checked;$("#oreg").textContent=regTxt($("#p-reg").value).toLowerCase();
  IN=input();if(IN.tipo==="muro_contencao"){drawCont();return}if(!IN.ambientes.some(a=>a.l>0&&a.c>0)){$("#res").innerHTML="<p>Inclua ao menos um ambiente.</p>";$("#tab").innerHTML="";R=null;return}
  {const Q0=orcar(IN).Q,PN=k=>PNOME(k,IN.pav).toLowerCase();$("#a-sum").innerHTML=`Área dos ambientes por pavimento: ${Q0.Afl.slice(0,IN.pav).map((A,i)=>`${PN(i+1)} ${num(A/Q0.T.kp)} m²`).join(" · ")}. Área construída total (com paredes): <b>${num(Q0.Ac)} m²</b>.${Q0.Amez?` Mezanino: ${num(Q0.Amez)} m² (incluído).`:""}${Q0.mezErr?` <span style="color:#ffb4a6">Mezanino de ${num(Q0.mezReq)} m² maior que a projeção do galpão (${num(Math.max(...Q0.Afl)/Q0.T.kp)} m²); limitado à projeção.</span>`:""}${Q0.nPav<IN.pav?` <span style="color:#ffb4a6">Há pavimento(s) sem ambientes; inclua ambientes neles ou use “Todos”.</span>`:""}`}
  R=orcar(IN);const r=R,Q=r.Q;
  $("#res").innerHTML=idBox()+`<div class="obcards"><div><span>Área construída</span><b>${num(Q.Ac)} m²</b><small>ambientes ${num(Q.Aamb)} m² · ${Q.n} pav.</small></div><div><span>Custo direto</span><b>${brl(r.direto)}</b><small>${brl(r.m2dir)}/m²</small></div><div><span>BDI ${num(IN.bdi)}%</span><b>${brl(r.bdi)}</b></div><div class="hi"><span>Total estimado</span><b>${brl(r.total)}</b><small>${brl(r.m2)}/m²</small></div><div><span>Prazo estimado</span><b>${num(Math.round(Q.dur*10)/10)} meses</b></div></div>
  ${cubBox(r)}<h3>Participação por etapa</h3><div class="obbars">${r.etapas.map(e=>`<div class="obb"><span>${e.n}. ${esc(e.nome)}</span><i style="--w:${pct(e.sub,r.direto).toFixed(2)}%"></i><b>${num(pct(e.sub,r.direto))}%</b></div>`).join("")}</div>`;
  $("#tab").innerHTML=`<h3>Planilha analítica — SINAPI ${esc(r.ref)} · ${r.regime}</h3>`+tabela(r);
  const t=`Olá! Fiz o orçamento estimativo de obra no site: ${TIPOS[IN.tipo].nome}, ${num(Q.Ac)} m², total estimado ${brl(r.total)} (${brl(r.m2)}/m², SINAPI ${r.ref}). Gostaria de conversar.`;
  WA_TXT=t;$("#b-wa").href="https://wa.me/5592992262786?text="+encodeURIComponent(t)}
function drawCont(){R=orcar(IN);const r=R,Q=r.Q,k=Q.cont;
  $("#res").innerHTML=idBox()+`<div class="obcards"><div><span>Muro</span><b>${num(k.L)} m × ${num(k.H)} m</b><small>face ${num(Q.Ac)} m² · ${esc(CONT_SIS[k.sistema])}</small></div><div><span>Custo direto</span><b>${brl(r.direto)}</b><small>${brl(r.m2dir)}/m² de face</small></div><div><span>BDI ${num(IN.bdi)}%</span><b>${brl(r.bdi)}</b></div><div class="hi"><span>Total estimado</span><b>${brl(r.total)}</b><small>${brl(r.mlin)}/m linear · ${brl(r.m2)}/m² de face</small></div><div><span>Prazo estimado</span><b>${num(Q.dur)} meses</b></div></div>
  <p class="onote">Pré-dimensionamento: ${contTxt(k)}</p>${cubBox(r)}<h3>Participação por etapa</h3><div class="obbars">${r.etapas.map(e=>`<div class="obb"><span>${e.n}. ${esc(e.nome)}</span><i style="--w:${pct(e.sub,r.direto).toFixed(2)}%"></i><b>${num(pct(e.sub,r.direto))}%</b></div>`).join("")}</div>`;
  $("#tab").innerHTML=`<h3>Planilha analítica — SINAPI ${esc(r.ref)} · ${r.regime}</h3>`+tabela(r);
  const t=`Olá! Fiz o orçamento estimativo no site: muro de contenção (${CONT_SIS[k.sistema]}), ${num(k.L)} m × ${num(k.H)} m, total estimado ${brl(r.total)} (${brl(r.mlin)}/m, SINAPI ${r.ref}). Gostaria de conversar.`;
  WA_TXT=t;$("#b-wa").href="https://wa.me/5592992262786?text="+encodeURIComponent(t)}
const contTxt=k=>`${k.sistema==="cortina"?`cortina ${num(k.tt*100)} → ${num(k.tb*100)} cm`:`blocos ${k.tt>.2?"parede dupla 29 cm":"14 cm"}`}; sapata corrida B = ${num(k.B)} m × h = ${num(k.h)} m (ponta ${num(k.toe)} m, talão ${num(k.heel)} m); ${k.ne} estacas Ø${num(k.d)} cm × ${num(k.Le)} m em ${k.fil} fila(s) a cada ${num(k.s)} m.`;
function tabela(r,pdf){return`<div class="otab"><table class="obt"><thead><tr><th>Item</th><th>Código SINAPI</th><th>Descrição</th><th>Un.</th><th>Qtd.</th><th>Custo unit.</th><th>Total</th></tr></thead><tbody>${r.etapas.map(e=>`<tr class="grp"><td>${e.n}</td><td colspan="5">${esc(e.nome.toUpperCase())}</td><td>${brl(e.sub)}</td></tr>`+e.itens.map(x=>`<tr><td>${x.item}</td><td>${x.c.startsWith("VERBA")?"Verba":x.c}</td><td>${esc(x.desc)}${x.o&&!x.c.startsWith("VERBA")?`<small>${esc(x.o)}</small>`:""}</td><td>${esc(x.u)}</td><td>${num(x.q)}</td><td>${brl(x.pu)}</td><td>${brl(x.tot)}</td></tr>`).join("")).join("")}
<tr class="sub"><td colspan="6">Custo direto</td><td>${brl(r.direto)}</td></tr><tr class="sub"><td colspan="6">BDI (${num(IN.bdi)}%)</td><td>${brl(r.bdi)}</td></tr><tr class="tot"><td colspan="6">TOTAL ESTIMADO (${r.cont?brl(r.mlin)+"/m linear · "+brl(r.m2)+"/m² de face":brl(r.m2)+"/m²"})</td><td>${brl(r.total)}</td></tr></tbody></table></div>`}
const tipoUI=()=>{const t=$("#p-tipo").value,g=t.startsWith("galpao");document.querySelector(".ob").classList.toggle("cont",t==="muro_contencao");$("#l-pav").hidden=g;if(g)$("#p-pav").value="1";$("#l-cob").hidden=g;$("#l-mez").hidden=!g;$("#l-meza").hidden=!g||$("#p-mez").value!=="1";$("#l-pis").hidden=g;document.querySelectorAll(".l-pisd").forEach(e=>e.hidden=g||$("#p-pis").value!=="1")};
$("#ed-cancel").onclick=()=>{fimEdit();mm("Edição cancelada; um novo PDF criará um novo orçamento.",1)};$("#md-s").onclick=()=>setModo("simples");$("#md-a").onclick=()=>setModo("avancado");$("#a-adv").onclick=()=>{setModo("avancado");$("#amb").scrollIntoView({behavior:"smooth",block:"center"})};
$("#p-tipo").onchange=()=>{const t=$("#p-tipo").value;if(MODE==="simples")$("#p-area").value=num(t.startsWith("galpao")?500:t==="alto"?250:t==="baixo"?60:100);$("#p-pd").value=num(TIPOS[t].pd);$("#p-cob").value=defCob(t);tipoUI();preset();draw()};$("#p-mez").addEventListener("change",tipoUI);$("#p-pis").addEventListener("change",tipoUI);tipoUI();
$("#ob-form").addEventListener("input",draw);$("#a-add").onclick=()=>{const k=$("#a-kind").value;if(tb.children.length>=40)return;if(k==="gourmet")row({nome:"Área gourmet",t:"m",l:3.5,c:5,p:1});else if(k==="escritorio")row({nome:"Escritório",t:"d",l:3,c:3,p:1});else if(k==="edicula"){row({nome:"Edícula",t:"s",l:3.5,c:4,p:1});if(tb.children.length<40)row({nome:"Banheiro edícula",t:"b",l:1.5,c:2,p:1})}else row();draw()};$("#a-pre").onclick=()=>{preset();draw()};
preset();draw();
// exportações
function linhas(){return[["Item","Código SINAPI","Descrição","Observação","Unidade","Quantidade","Custo unitário","Total"],...R.etapas.flatMap(e=>[[String(e.n),"",e.nome.toUpperCase(),"","","","",e.sub],...e.itens.map(x=>[x.item,x.c,x.desc,x.o||"",x.u,x.q,x.pu,x.tot])]),["","","Custo direto","","","","",R.direto],["","","BDI "+IN.bdi+"%","","","","",R.bdi],["","","TOTAL","","","","",R.total]]}
const nomeArq=ext=>`orcamento-obra-${IN.tipo}-${Math.round(R.Q.Ac)}m2-sinapi-${R.ref.replace("/","-")}.${ext}`;
function baixar(blob,n){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
$("#b-csv").onclick=()=>{if(!R)return;const c=v=>typeof v==="number"?String(Math.round(v*100)/100).replace(".",","):'"'+String(v??"").replace(/"/g,'""')+'"';
  baixar(new Blob(["\ufeff"+[[`Orçamento estimativo — ${TIPOS[IN.tipo].nome} — ${num(R.Q.Ac)} m² — SINAPI ${R.ref} AM ${R.regime}`],...linhas()].map(l=>l.map(c).join(";")).join("\r\n")],{type:"text/csv;charset=utf-8"}),nomeArq("csv"))};
function loadScript(u){return new Promise((ok,no)=>{if(window.ExcelJS)return ok();const sc=document.createElement("script");sc.src=u;sc.onload=ok;sc.onerror=no;document.head.append(sc)})}
export async function xlsxBlob(r=R,inp=IN,no="",noCache=false){await loadScript("https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js");const E=window.ExcelJS,wb=new E.Workbook();wb.creator="FSantos Engenharia";
  const ws=wb.addWorksheet("Orçamento",{views:[{state:"frozen",ySplit:7}],pageSetup:{paperSize:9,orientation:"landscape",fitToPage:true,fitToWidth:1,fitToHeight:0,margins:{left:.4,right:.4,top:.6,bottom:.6,header:.25,footer:.25}}});
  const NAVY="FF0B1A30",AMB="FFF2B632",LT="FFF6E7C1",hoje=new Date().toLocaleDateString("pt-BR");
  ws.columns=[{width:7},{width:13},{width:70},{width:38},{width:9},{width:12},{width:15},{width:17},{width:11}];
  for(let i=1;i<=4;i++){ws.getRow(i).height=i===1?30:18;for(let c=1;c<=9;c++)ws.getCell(i,c).fill={type:"pattern",pattern:"solid",fgColor:{argb:NAVY}}}
  try{const b64=await fetch("assets/img/logo-fsantos@2x.png").then(x=>x.arrayBuffer()).then(a=>btoa(String.fromCharCode(...new Uint8Array(a))));ws.addImage(wb.addImage({base64:b64,extension:"png"}),{tl:{col:0.15,row:0.1},ext:{width:72,height:80}})}catch(e){}
  const put=(rw,c,v,f)=>{const x=ws.getCell(rw,c);x.value=v;Object.assign(x,f||{});return x};
  put(1,3,"FSantos Engenharia — Projetos e Orçamentos",{font:{bold:true,size:15,color:{argb:AMB}}});
  put(2,3,"Orçamento estimativo de obra — "+TIPOS[inp.tipo].nome+" — "+num(r.Q.Ac)+" m²",{font:{size:11,color:{argb:"FFFFFFFF"}}});
  put(3,3,"Eng. Civil Francirley Pereira Santos — CREA 31.410-AM · "+SITE+" · WhatsApp "+WHATS,{font:{size:9,color:{argb:"FFC9D3E3"}}});
  put(1,8,no?"Nº "+no:"",{font:{bold:true,color:{argb:AMB}},alignment:{horizontal:"right"}});put(2,8,hoje,{font:{color:{argb:"FFFFFFFF"}},alignment:{horizontal:"right"}});put(3,8,"SINAPI "+r.ref+" · AM · "+r.regime,{font:{size:9,color:{argb:"FFFFFFFF"}},alignment:{horizontal:"right"}});
  for(let c=1;c<=9;c++)ws.getCell(5,c).fill={type:"pattern",pattern:"solid",fgColor:{argb:AMB}};ws.getRow(5).height=4;
  put(6,1,"Obra: "+(inp.obra||"—")+" · Cliente: "+(inp.clienteObra||"—")+" · Cidade da obra: "+(inp.cidade||"—"),{font:{bold:true,size:10,color:{argb:NAVY}}});put(7,1,"Solicitante (conta): "+(inp.cliente.nome||"—")+" · Modo "+(inp.modo==="simples"?"simples":"avançado"),{font:{italic:true,size:9}});
  const FILL=c=>({type:"pattern",pattern:"solid",fgColor:{argb:c}}),BR='"R$" #,##0.00',N2="#,##0.00",PC="0.00%",NC=noCache;
  const F=(f,v)=>NC?{formula:f}:{formula:f,result:v};
  // Parâmetros
  put(8,3,"PARÂMETROS",{font:{bold:true,color:{argb:"FFFFFFFF"}},fill:FILL(NAVY)});for(let c=4;c<=9;c++)ws.getCell(8,c).fill=FILL(NAVY);
  const refQ=r.refInfo||{area:r.Q.Ac,base:r.base0},cal=!!r.cub&&inp.calibrar!==false,bdi=(+inp.bdi||0)/100;
  const P=[[r.cont?"Área de face do muro (comprimento × altura, m²)":"Área construída (m²)",r.Q.Ac,N2],["BDI (%)",bdi,PC],["CUB-AM "+(r.cubCod||"—")+" (R$/m²)",r.cub||0,BR],["Calibrar pelo CUB (1 = sim, 0 = não)",cal?1:0,"0"],["Área de referência da calibração (m²)",refQ.area,N2],["Base comparável SINAPI na referência (R$)",refQ.base,BR],["Regime SINAPI",r.regime,"@"],["Referência SINAPI",r.ref+" · "+SINAPI.uf,"@"]];
  P.forEach(([l,v,f],i)=>{put(9+i,3,l,{font:{color:{argb:NAVY}}});const x=put(9+i,8,v,{numFmt:f,font:{bold:true},fill:FILL("FFFFF8E1"),border:{bottom:{style:"thin",color:{argb:AMB}}}})});
  const A="$H$9",BD="$H$10",CU="$H$11",CA="$H$12",AR="$H$13",BS="$H$14";
  // tabela
  const H0=19,hd=ws.getRow(H0);["Item","Código SINAPI","Descrição","Observação","Unidade","Quantidade","Custo unitário","Total","% do direto"].forEach((v,i)=>{const x=hd.getCell(i+1);x.value=v;x.font={bold:true,color:{argb:"FFFFFFFF"}};x.fill=FILL(NAVY);x.alignment={vertical:"middle",wrapText:true};x.border={bottom:{style:"medium",color:{argb:AMB}}}});hd.height=22;
  let rr=H0+1;const stRows=[],et=r.etapas.filter(e=>e.n!==19),dir=et.reduce((s,e)=>s+e.sub,0);
  const DIRC=()=>"$H$"+(rr0);let rr0=0;
  const stageCells=[];
  et.forEach(e=>{const sr=rr++,row=ws.getRow(sr);row.getCell(1).value=String(e.n);row.getCell(3).value=e.nome.toUpperCase();stageCells.push({sr,e});
    const i0=rr;e.itens.forEach(x=>{const w=ws.getRow(rr);w.getCell(1).value=x.item;w.getCell(2).value=x.c;w.getCell(3).value=x.desc;w.getCell(4).value=x.o||null;w.getCell(5).value=x.u;
      const q=w.getCell(6);q.value=x.q;q.numFmt=N2;const u=w.getCell(7);u.value=x.pu;u.numFmt=BR;const t=w.getCell(8);t.value=F(`ROUND(F${rr}*G${rr},2)`,x.tot);t.numFmt=BR;
      for(let c=1;c<=9;c++)w.getCell(c).alignment={vertical:"top",wrapText:c===3||c===4};rr++});
    const sc=row.getCell(8);sc.value=F(`SUM(H${i0}:H${rr-1})`,e.sub);sc.numFmt=BR;row.font={bold:true,color:{argb:NAVY}};for(let c=1;c<=9;c++)row.getCell(c).fill=FILL(LT)});
  rr++;const R0=rr,lab=(t,f,v,fmt,hl)=>{const w=ws.getRow(rr);w.getCell(3).value=t;const x=w.getCell(8);x.value=F(f,v);x.numFmt=fmt||BR;w.font={bold:true,color:{argb:NAVY}};for(let c=1;c<=9;c++)w.getCell(c).fill=FILL(hl?AMB:LT);return rr++};
  const dR=lab("Custo direto (soma das etapas)",stageCells.map(s=>"H"+s.sr).join("+"),dir);
  const aR=lab("Ajuste de padrão (calibração CUB-AM) = CUB × área de referência − base comparável",`IF(${CA}=1,ROUND(${CU}*${AR}-${BS},2),0)`,r.ajuste||0);
  const sR=lab("Custo direto ajustado",`H${dR}+H${aR}`,dir+(r.ajuste||0));
  const bR=lab("BDI",`H${sR}*${BD}`,r.bdi);
  const tR=lab("TOTAL ESTIMADO",`H${sR}*(1+${BD})`,r.total,BR,1);
  lab(r.cont?"R$/m² de face (total ÷ área de face)":"R$/m² (total ÷ área construída)",`H${tR}/${A}`,r.m2);
  if(r.cont){put(18,3,"Comprimento do muro (m)",{font:{color:{argb:NAVY}}});put(18,8,r.Q.cont.L,{numFmt:N2,font:{bold:true},fill:FILL("FFFFF8E1")});lab("R$/m linear (total ÷ comprimento)",`H${tR}/$H$18`,r.mlin)}
  stageCells.forEach(({sr,e})=>{const x=ws.getCell(sr,9);x.value=F(`H${sr}/$H$${dR}`,e.sub/dir);x.numFmt=PC});
  // resumo no topo (linhas 17)
  put(17,3,"Total estimado (fórmula)",{font:{bold:true,color:{argb:NAVY}}});const tt=put(17,8,F(`H${tR}`,r.total),{numFmt:BR,font:{bold:true,size:12,color:{argb:NAVY}},fill:FILL(AMB)});
  const end=rr;put(end+1,1,"Estimativa para elaboração de projetos — não substitui orçamento executivo. Preços SINAPI/Caixa "+r.ref+", Manaus/AM. Altere quantidades, preços ou o BDI (célula H10): os totais são recalculados.",{font:{italic:true,size:9,color:{argb:"FF555555"}}});
  put(end+2,1,SITE+" · WhatsApp "+WHATS+" · "+MAIL+" · Manaus-AM",{font:{size:9,color:{argb:NAVY}}});
  ws.views=[{state:"frozen",ySplit:H0}];
  ws.pageSetup.printTitlesRow=H0+":"+H0;
  ws.headerFooter={oddHeader:'&L&"Arial,Bold"&10FSantos Engenharia — Projetos e Orçamentos&R&9'+(no?"Nº "+no+" · ":"")+hoje+" · SINAPI "+r.ref,oddFooter:"&L&8"+SITE+" · WhatsApp "+WHATS+" · "+MAIL+"&C&8Estimativa para elaboração de projetos&R&8Página &P de &N"};
  return new Blob([await wb.xlsx.writeBuffer()],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})}
$("#b-xlsx").onclick=async()=>{if(!R)return;try{baixar(await xlsxBlob(),nomeArq("xlsx"))}catch(e){console.error(e);msg.className="omsg err";msg.textContent="Não foi possível gerar o Excel agora; use o CSV."}};
// PDF + Firestore
function numero(){const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",r=crypto.getRandomValues(new Uint8Array(4));return`OBR-${new Date().getFullYear()}-`+[...r].map(b=>a[b%a.length]).join("")}
// ---- conta (Firebase Auth) ----
let FBM=null,USER=null,PERFIL=null;
async function fb(){if(FBM)return FBM;const [cfg,A,F]=await Promise.all([import("./firebase-config.js?v=20261015c"),import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"),import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")]);return FBM={...cfg,A,F}}
const am=(t,ok)=>{const m=$("#au-msg");m.className="omsg "+(ok?"ok":"err");m.textContent=t};
const errTxt=e=>({"auth/invalid-credential":"E-mail ou senha incorretos.","auth/wrong-password":"E-mail ou senha incorretos.","auth/user-not-found":"Conta não encontrada.","auth/email-already-in-use":"Este e-mail já tem conta; use Entrar.","auth/weak-password":"A senha precisa ter ao menos 6 caracteres.","auth/invalid-email":"E-mail inválido.","auth/popup-closed-by-user":"Login cancelado.","auth/operation-not-allowed":"Login por e-mail ainda não habilitado no Firebase."}[e.code]||("Erro: "+(e.code||e.message)));
let modo="login";document.querySelectorAll(".autabs button").forEach(b=>b.onclick=()=>{modo=b.dataset.m;document.querySelectorAll(".autabs button").forEach(x=>x.classList.toggle("on",x===b));document.querySelectorAll(".au-cad").forEach(x=>x.hidden=modo!=="cad");$("#au-go").textContent=modo==="cad"?"Criar conta":"Entrar";$("#au-pass").autocomplete=modo==="cad"?"new-password":"current-password"});
async function salvarPerfil(u,nome,tel){const {db,F}=await fb();const ref=F.doc(db,"users",u.uid),ex=await F.getDoc(ref);
  const d={nome:String(nome||u.displayName||"").slice(0,120),telefone:String(tel||"").slice(0,40),email:String(u.email||"").slice(0,120),updatedAt:F.serverTimestamp()};
  if(!ex.exists())await F.setDoc(ref,{...d,createdAt:F.serverTimestamp()});else await F.updateDoc(ref,d);PERFIL={...(ex.exists()?ex.data():{}),...d}}
$("#au-google").onclick=async()=>{try{const {googleLogin}=await fb();await googleLogin(e=>am(errTxt(e)))}catch(e){am(errTxt(e))}};
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
  fill(u);meus();
  const qs=new URLSearchParams(location.search),id=qs.get("edit")||qs.get("abrir");if(id){try{const s=await F.getDoc(F.doc(db,"orcamentos_obra",id));if(!s.exists())throw new Error("não encontrado");const o={id:s.id,...s.data()};
    carregar(o,!!qs.get("edit"));if(qs.get("pdf")&&R)renderPDF(R,{...IN,cliente:o.cliente||IN.cliente},o.numero)}catch(e){mm("Não foi possível abrir o orçamento ("+(e.code||e.message)+").")}}})}catch(e){console.error(e);am("Serviço de login indisponível no momento.")}})();
let MEUS=[];
async function meus(){if(!USER)return;const {db,F}=await fb();try{const s=await F.getDocs(F.query(F.collection(db,"orcamentos_obra"),F.where("uid","==",USER.uid)));
  MEUS=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
  $("#meus-rows").innerHTML=MEUS.map((o,i)=>`<tr data-i="${i}"><td>${o.createdAt?.toDate?o.createdAt.toDate().toLocaleDateString("pt-BR"):"—"}</td><td>${esc(o.numero)}</td><td>${esc(TIPOS[o.tipo]?.nome||o.tipo)}</td><td>${num(o.areaConstruida)}</td><td>${brl(o.total)}</td><td>${brl(o.totalPorM2)}</td><td class="m-act"><button type="button" class="btn ghost small" data-ac="abrir">Abrir</button><button type="button" class="btn ghost small" data-ac="editar">Editar</button><button type="button" class="btn danger small" data-ac="excluir">Excluir</button></td></tr>`).join("")||'<tr><td colspan="7">Nenhum orçamento salvo ainda.</td></tr>';
  $("#meus-rows").querySelectorAll("tr[data-i]").forEach(r=>{const o=MEUS[+r.dataset.i];r.onclick=()=>carregar(o,false);
    r.querySelector('[data-ac="editar"]').onclick=ev=>{ev.stopPropagation();carregar(o,true)};
    r.querySelector('[data-ac="abrir"]').onclick=ev=>{ev.stopPropagation();carregar(o,false)};
    r.querySelector('[data-ac="excluir"]').onclick=async ev=>{ev.stopPropagation();if(!confirm(`Excluir o orçamento ${o.numero}? Esta ação não pode ser desfeita.`))return;
      try{const {db,F}=await fb();await F.deleteDoc(F.doc(db,"orcamentos_obra",o.id));if(EDIT&&EDIT.id===o.id)fimEdit();mm(`Orçamento ${o.numero} excluído.`,1);meus()}catch(e){mm("Não foi possível excluir ("+(e.code||e.message)+").")}}})}catch(e){$("#meus-rows").innerHTML=`<tr><td colspan="7">Não foi possível carregar (${esc(e.code||e.message)}).</td></tr>`}}
let EDIT=null;const mm=(t,ok)=>{const m=$("#meus-msg");m.className="omsg "+(ok?"ok":"err");m.textContent=t};
function fimEdit(){EDIT=null;$("#ed-bar").hidden=true;$("#b-pdf").textContent="Gerar orçamento em PDF"}
function carregar(o,editar){const x=o.entradas||{},g=String(o.tipo).startsWith("galpao");
  $("#p-tipo").value=TIPOS[o.tipo]?o.tipo:"galpao_ind";$("#p-pav").value=g?1:(o.pavimentos||1);$("#p-pd").value=num(o.peDireito||TIPOS[o.tipo]?.pd||3);$("#p-reg").value=o.regime||"nd";$("#p-bdi").value=num(o.bdi??25);$("#p-cal").checked=x.calibrar!==false;
  $("#t-l").value=num(o.terreno?.largura);$("#t-c").value=num(o.terreno?.comprimento);$("#m-on").checked=!!o.muro?.ativo;$("#m-h").value=num(o.muro?.altura||2);["frente","fundos","esq","dir"].forEach(k=>$("#m-"+k).checked=!!x["muro_"+k]);
  $("#p-cob").value=o.cobertura||defCob(o.tipo);$("#p-telha").value=o.telha||"simples";
  $("#p-mez").value=o.mezanino>0?"1":"0";if(o.mezanino>0)$("#p-meza").value=num(o.mezanino);
  $("#p-pis").value=o.piscina?"1":"0";if(o.piscina){$("#p-pisc").value=num(o.piscina.comprimento);$("#p-pisl").value=num(o.piscina.largura);$("#p-pisp").value=num(o.piscina.profundidade)}
  if(o.cidade)$("#c-cid").value=o.cidade;if(editar&&USER&&o.uid&&o.uid!==USER.uid&&o.cliente){$("#c-nome").value=o.cliente.nome||"";$("#c-tel").value=o.cliente.telefone||"";$("#c-email").value=o.cliente.email||""}
  $("#p-obra").value=o.obra||"";$("#p-cli").value=o.clienteObra||"";
  if(o.contencao){$("#p-csis").value=o.contencao.sistema==="bloco"?"bloco":"cortina";$("#p-cl").value=num(o.contencao.comprimento);$("#p-ch").value=num(o.contencao.altura)}
  const simples=o.modo==="simples"&&(o.areaAlvo>0||!!o.contencao);MODE=simples?"simples":"avancado";
  document.querySelector(".ob").classList.toggle("simples",simples);$("#md-s").classList.toggle("on",simples);$("#md-a").classList.toggle("on",!simples);
  if(simples&&o.areaAlvo)$("#p-area").value=num(o.areaAlvo);
  PAVN=null;tb.innerHTML="";(o.ambientes||[]).forEach(a=>row({nome:a.nome,t:a.tipo,l:a.largura,c:a.comprimento,p:a.pavimento??1}));PAVN=NPAV();
  tipoUI();draw();
  let av=o.modo==="simples"&&!simples&&!o.contencao?" Orçamento antigo do modo simples sem área-alvo salva: aberto no modo avançado com os ambientes salvos.":"";
  const d=Math.abs((R?.total||0)-(o.total||0));if(d>0.05)av+=` Atenção: o total recalculado (${brl(R.total)}) difere do salvo (${brl(o.total)})${o.sinapiRef&&o.sinapiRef!==R.ref?` porque a base SINAPI mudou (${o.sinapiRef} → ${R.ref})`:" (composições ou regras do modelo atualizadas)"}.`;
  if(editar){EDIT={id:o.id,numero:o.numero,uid:o.uid,cliente:o.cliente};$("#ed-txt").textContent=`Editando ${o.numero}${USER&&o.uid&&o.uid!==USER.uid?" (orçamento de outro usuário — modo administrador)":""} — ao gerar o PDF as alterações serão salvas neste mesmo orçamento.`;$("#ed-bar").hidden=false;$("#b-pdf").textContent="Salvar alterações e gerar PDF"}else fimEdit();
  mm(`Orçamento ${o.numero} carregado.`+av,!av);scrollTo({top:$("#res").offsetTop-80,behavior:"smooth"})}
function montarDoc(no,ts){const r2=v=>Math.round(v*100)/100;
  const ct=IN.tipo==="muro_contencao";if(ct){const k=R.Q.cont;return {numero:no,uid:USER?.uid||"test",cliente:IN.cliente,cidade:IN.cidade,obra:IN.obra,clienteObra:IN.clienteObra,tipo:IN.tipo,modo:MODE==="simples"?"simples":"avancado",pavimentos:1,contencao:{sistema:k.sistema,comprimento:r2(k.L),altura:r2(k.H)},regime:IN.regime,bdi:r2(IN.bdi),sinapiRef:String(R.ref),entradas:{calibrar:false},ambientes:[],etapas:R.etapas.map(e=>({n:e.n,nome:e.nome,subtotal:r2(e.sub)})),areaConstruida:r2(R.Q.Ac),custoDireto:r2(R.direto),ajusteCub:0,total:r2(R.total),totalPorM2:r2(R.m2),status:"novo",createdAt:ts}}
  return {numero:no,uid:USER?.uid||"test",cliente:IN.cliente,cidade:IN.cidade,obra:IN.obra,clienteObra:IN.clienteObra,tipo:IN.tipo,modo:MODE==="simples"?"simples":"avancado",...(MODE==="simples"?{areaAlvo:r2(pf($("#p-area").value))}:{}),pavimentos:IN.tipo.startsWith("galpao")?1:IN.pav,cobertura:R.Q.OP.cob,telha:R.Q.OP.telha,mezanino:r2(R.Q.Amez),...(R.Q.OP.pisc?{piscina:{comprimento:r2(R.Q.OP.pisc.c),largura:r2(R.Q.OP.pisc.l),profundidade:r2(R.Q.OP.pisc.p)}}:{}),peDireito:r2(IN.pd),regime:IN.regime,bdi:r2(IN.bdi),sinapiRef:String(R.ref),
    terreno:{largura:r2(IN.terreno.l),comprimento:r2(IN.terreno.c)},muro:{ativo:IN.muro.on,altura:r2(IN.muro.h),comprimento:r2(R.Q.Lmuro)},
    entradas:{calibrar:IN.calibrar!==false,muro_frente:IN.muro.frente,muro_fundos:IN.muro.fundos,muro_esq:IN.muro.esq,muro_dir:IN.muro.dir},
    ambientes:IN.ambientes.filter(a=>a.l>0&&a.c>0).map(a=>({nome:a.nome,tipo:a.t,largura:r2(a.l),comprimento:r2(a.c),pavimento:a.p??1})),
    etapas:R.etapas.map(e=>({n:e.n,nome:e.nome,subtotal:r2(e.sub)})),areaConstruida:r2(R.Q.Ac),custoDireto:r2(R.direto),ajusteCub:r2(R.ajuste||0),total:r2(R.total),totalPorM2:r2(R.m2),status:"novo",createdAt:ts}}
async function salvar(no){const {db,F}=await fb();const d=montarDoc(no,F.serverTimestamp());
  const outro=EDIT&&EDIT.uid&&USER&&EDIT.uid!==USER.uid;let op;if(EDIT){delete d.createdAt;delete d.status;d.numero=EDIT.numero;if(outro){d.uid=EDIT.uid;if(EDIT.cliente)d.cliente=EDIT.cliente}d.updatedAt=F.serverTimestamp();op=F.updateDoc(F.doc(db,"orcamentos_obra",EDIT.id),{...d,...(MODE==="simples"?{}:{areaAlvo:F.deleteField()}),...(d.piscina?{}:{piscina:F.deleteField()}),...(d.contencao?{cobertura:F.deleteField(),telha:F.deleteField(),mezanino:F.deleteField(),terreno:F.deleteField(),muro:F.deleteField(),peDireito:F.deleteField(),areaAlvo:F.deleteField()}:{contencao:F.deleteField()})})}else op=F.addDoc(F.collection(db,"orcamentos_obra"),d);
  await Promise.race([op,new Promise((_,j)=>setTimeout(()=>j(new Error("timeout")),12000))]);if(EDIT)fimEdit();
  if(!outro)try{await salvarPerfil(USER,IN.cliente.nome,IN.cliente.telefone)}catch(e){}}
const SITE="leysantos.github.io/fsantos-portfolio",WHATS="(92) 99226-2786",MAIL="leyfps@gmail.com";
export function renderPDF(r,inp,no,el=document.getElementById("proposta")){const c=inp.cliente,Q=r.Q,hoje=new Date().toLocaleDateString("pt-BR"),bl="________________";
  const HDR=`<div class="pb-h"><img src="assets/img/logo-fsantos@2x.png" alt=""><div class="pb-ht"><strong>FSantos Engenharia — Projetos e Orçamentos</strong><span>Eng. Civil Francirley Pereira Santos — CREA 31.410-AM</span></div><div class="pb-hm">${no?`<b>Nº ${esc(no)}</b><br>`:""}${inp.obra?esc(inp.obra.slice(0,60))+"<br>":""}${hoje}<br>SINAPI ${esc(r.ref)} · AM</div></div>`,
    FTR=`<div class="pb-f"><span>${SITE} · WhatsApp ${WHATS} · ${MAIL} · Manaus-AM</span><span class="pb-fn">Estimativa para elaboração de projetos</span></div>`;
  el.innerHTML=`<table class="pb-frame"><thead><tr><td>${HDR}</td></tr></thead><tfoot><tr><td>${FTR}</td></tr></tfoot><tbody><tr><td>
<p class="pp-flag">ORÇAMENTO ESTIMATIVO — não substitui orçamento executivo</p><h2>Orçamento estimativo de obra</h2><p class="pp-sub">${esc(TIPOS[inp.tipo].nome)} · SINAPI ${esc(r.ref)} · Manaus/AM · ${r.regime}</p>
<p>Manaus/AM, ${hoje}<br>Obra: <b>${esc(inp.obra||bl)}</b><br>Cliente: <b>${esc(inp.clienteObra||bl)}</b><br>Cidade da obra: ${esc(inp.cidade||bl)}<br><small>Solicitante (conta): ${esc(c.nome||bl)} · Telefone: ${esc(c.telefone||bl)}${c.email?` · E-mail: ${esc(c.email)}`:""}</small></p>
${Q.cont?`<h3>1. Dados da obra</h3><table class="pp-t"><tbody><tr><td>Sistema</td><td><b>${esc(CONT_SIS[Q.cont.sistema])}</b></td><td>Fundação</td><td>sapata corrida sobre estacas escavadas</td></tr><tr><td>Comprimento × altura</td><td><b>${num(Q.cont.L)} m × ${num(Q.cont.H)} m</b></td><td>Área de face</td><td>${num(Q.Ac)} m²</td></tr><tr><td>Prazo estimado</td><td>${num(Q.dur)} meses</td><td>Modo</td><td>${inp.modo==="simples"?"simples":"avançado"}</td></tr></tbody></table><p class="pp-amb"><b>Pré-dimensionamento:</b> ${contTxt(Q.cont)}</p>
`:`<h3>1. Dados da obra</h3><table class="pp-t"><tbody><tr><td>Terreno</td><td>${num(inp.terreno.l)} × ${num(inp.terreno.c)} m (${num(inp.terreno.l*inp.terreno.c)} m²)</td><td>Área dos ambientes</td><td>${num(Q.Aamb)} m²</td></tr><tr><td>Área construída estimada</td><td><b>${num(Q.Ac)} m²</b></td><td>Pavimentos / pé-direito</td><td>${Q.n} / ${num(Q.h)} m</td></tr><tr><td>Muro</td><td>${Q.Lmuro?num(Q.Lmuro)+" m × "+num(Q.hm)+" m":"não"}</td><td>Prazo estimado</td><td>${num(Math.round(Q.dur*10)/10)} meses</td></tr></tbody></table>
<p class="pp-amb"><b>Modo:</b> ${inp.modo==="simples"?"simples — ambientes com a distribuição típica do padrão, dimensionados proporcionalmente à área informada":"avançado — ambientes informados pelo usuário"}</p><p class="pp-amb"><b>Cobertura:</b> ${Q.g?"telhado metálico":Q.OP.cob==="completa"?"completa (laje + estrutura metálica + telhado)":"simples (telhado + forro)"} · <b>Telha:</b> ${Q.OP.telha==="termo"?"termoacústica (sanduíche)":"simples"}${Q.OP.pisc?` · <b>Piscina:</b> ${num(Q.OP.pisc.c)} × ${num(Q.OP.pisc.l)} × ${num(Q.OP.pisc.p)} m`:""}${Q.g?` · <b>Mezanino:</b> ${Q.Amez?num(Q.Amez)+" m²":"não"}`:""}</p><p class="pp-amb"><b>Ambientes:</b> ${inp.ambientes.filter(a=>a.l>0&&a.c>0).map(a=>`${esc(a.nome||TAMB[a.t])} ${num(a.l)}×${num(a.c)}${inp.pav>1?` (${+a.p?(+a.p===1?"térreo":(+a.p-1)+"º sup."):"todos"})`:""}`).join(" · ")}</p>
`}<h3>2. Resumo por etapa</h3><table class="pp-t"><thead><tr><th>Etapa</th><th>Total</th><th>%</th></tr></thead><tbody>${r.etapas.map(e=>`<tr><td>${e.n}. ${esc(e.nome)}</td><td>${brl(e.sub)}</td><td>${num(pct(e.sub,r.direto))}%</td></tr>`).join("")}<tr><td><b>Custo direto</b></td><td><b>${brl(r.direto)}</b></td><td>100%</td></tr><tr><td>BDI (${num(inp.bdi)}%)</td><td>${brl(r.bdi)}</td><td></td></tr></tbody></table>
<p class="pp-tot">Valor total estimado: <b>${brl(r.total)}</b> <small>(${r.cont?brl(r.mlin)+"/m linear · "+brl(r.m2)+"/m² de face":brl(r.m2)+"/m²"})</small></p>${cubBox(r)}
<h3>3. Planilha analítica</h3>${tabela(r,1)}
<h3>4. Premissas e observações</h3><ul class="pp-reg"><li>Estimativa paramétrica a partir de quantitativos derivados das áreas informadas; não substitui orçamento executivo baseado em projetos.</li><li>Preços: SINAPI/Caixa, ref. ${esc(r.ref)}, Manaus/AM, ${r.regime.toLowerCase()}. Não inclui terreno, projetos, licenças, mobiliário, paisagismo, ligações definitivas pelas concessionárias nem itens não listados.</li>${(r.cont?REGRAS_CONT:REGRAS).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
<div class="pp-sig"><div class="pp-sb"><div class="pp-sl"><img src="assets/img/logo-fsantos.png" alt=""></div><div class="pp-line"></div><div class="pp-st"><b>ENG. CIVIL FRANCIRLEY PEREIRA SANTOS</b><br>CREA 31.410-AM</div></div></div>
</td></tr></tbody></table><div class="pp-act noprint"><button class="btn" data-a="print">Imprimir / salvar PDF</button><button class="btn ghost" data-a="close">Fechar</button></div>`;
  el.querySelector('[data-a="print"]').onclick=()=>print();el.querySelector('[data-a="close"]').onclick=()=>document.body.classList.remove("pp-open");
  document.body.classList.add("pp-open");scrollTo(0,0)}
$("#b-pdf").onclick=async()=>{draw();if(!R)return;msg.className="omsg";
  if(!USER){msg.textContent="Entre ou crie sua conta (passo 1) para gerar o orçamento.";msg.classList.add("err");$("#auth").scrollIntoView({behavior:"smooth"});return}
  if(!IN.cliente.nome||!IN.cliente.telefone){msg.textContent="Informe nome e telefone para gerar o orçamento.";msg.classList.add("err");$("#c-nome").focus();return}
  const b=$("#b-pdf"),ed=!!EDIT;b.disabled=true;b.textContent="Gerando…";let no=ed?EDIT.numero:numero();
  try{await salvar(no);msg.textContent=ed?`Orçamento ${no} atualizado.`:`Orçamento ${no} salvo em Meus orçamentos.`;msg.classList.add("ok");meus()}
  catch(e){console.error(e);no="";msg.textContent="Não foi possível registrar agora; o PDF foi gerado mesmo assim.";msg.classList.add("err")}
  finally{b.disabled=false;b.textContent=EDIT?"Salvar alterações e gerar PDF":"Gerar orçamento em PDF"}
  ULT=no||"";renderPDF(R,IN,no)};
const smsg=(t,ok)=>{const m=$("#sinapi-msg");m.className="omsg "+(ok?"ok":"err");m.textContent=t};
{const k=sessionStorage.getItem("sinapiAtualizada");if(k){sessionStorage.removeItem("sinapiAtualizada");smsg(k===SINAPI.ref?`Base atualizada para ${SINAPI.ref} – ${SINAPI.uf}.`:`A atualização não foi carregada ainda (o servidor ainda entrega ${SINAPI.ref}); tente novamente em alguns minutos.`,k===SINAPI.ref)}}
const refN=r=>{const [m,a]=String(r).split("/");return(+a||0)*12+(+m||0)};
$("#b-sinapi").onclick=async()=>{const b=$("#b-sinapi");b.disabled=true;smsg("Verificando…",1);try{const j=await fetch("assets/data/sinapi-latest.json?t="+Date.now(),{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()});
  if(refN(j.ref)<=refN(SINAPI.ref))smsg(`Você já está usando a base SINAPI mais recente (${SINAPI.ref} – ${SINAPI.uf}).`,1);
  else{smsg(`Nova base ${j.ref} disponível; atualizando…`,1);await Promise.all(["assets/js/sinapi-am.js","assets/js/obra-modelo.js","assets/js/obra.js"].map(u=>fetch(u,{cache:"reload"})));sessionStorage.setItem("sinapiAtualizada",j.ref);location.reload()}}
  catch(e){smsg("Não foi possível verificar agora ("+(e.message||e)+").")}finally{b.disabled=false}};
// "Enviar PDF pelo WhatsApp": gera o PDF do orçamento e compartilha com o arquivo anexado
$("#b-wa").onclick=async ev=>{ev.preventDefault();draw();if(!R)return;const b=$("#b-wa");msg.className="omsg";if(b.dataset.busy)return;b.dataset.busy=1;const lbl=b.textContent;b.textContent="Gerando PDF…";
  const no=ULT||"",nome=`Orcamento-${no||"obra-FSantos"}.pdf`;renderPDF(R,IN,no);
  try{const r=await enviarPDF({el:$("#proposta"),nome,titulo:"Orçamento de obra "+(no||"FSantos Engenharia"),texto:WA_TXT,fone:"5592992262786"});
    if(r.r==="fallback-link"){msg.innerHTML=`PDF baixado (${esc(nome)}). <a href="${esc(r.url)}" target="_blank" rel="noopener">Abrir o WhatsApp</a> e anexe o arquivo.`;msg.classList.add("ok")}
    else if(r.r==="fallback"){msg.textContent=`PDF baixado (${nome}). Anexe-o na conversa do WhatsApp que foi aberta.`;msg.classList.add("ok")}}
  catch(e){console.error(e);msg.textContent="Não foi possível gerar o PDF agora; use “Imprimir / salvar PDF”.";msg.classList.add("err")}
  finally{delete b.dataset.busy;b.textContent=lbl}};
window.__obra={montarDoc,carregar,xlsxBlob,renderPDF,orcar,input,draw,get R(){return R}};
