import {ORC_CONFIG as C,calcItem,calcTotal,renderProposta,brl,num,esc} from "./orcamento.js";
const $=s=>document.querySelector(s),box=$("#o-itens"),msg=$("#o-msg");let n=0;
function addItem(){if(box.children.length>=10)return;const k=n++;const d=document.createElement("fieldset");d.className="oitem";
  d.innerHTML=`<legend>Projeto <span class="ono"></span></legend><div class="ogrid"><label>Descrição do projeto<input class="i-nome" maxlength="160" placeholder="Ex.: Residência térrea"></label><label>Área construída (m²)<input class="i-area" inputmode="decimal" value="100"></label></div>
  <div class="disc">${C.disciplinas.map((x,i)=>`<label><input type="checkbox" value="${i}" ${x.incluir?"checked":""}> ${x.nome}</label>`).join("")}</div><button type="button" class="rm">Remover projeto</button>`;
  d.querySelector(".rm").onclick=()=>{d.remove();draw()};box.append(d);draw()}
const f=id=>$("#o-"+id).value.trim();
function read(){return[...box.children].map(d=>calcItem({nome:d.querySelector(".i-nome").value.trim(),area:parseFloat(d.querySelector(".i-area").value.replace(/\./g,"").replace(",","."))||0,sel:[...d.querySelectorAll(".disc input:checked")].map(x=>+x.value)}))}
function build(){const itens=read(),t=calcTotal(itens);return{cliente:{nome:f("nome").slice(0,120),telefone:f("tel").slice(0,40),email:f("email").slice(0,120)},projeto:f("proj").slice(0,160),cidade:f("cid").slice(0,100),itens,total:t.total,totalPorM2:t.totalPorM2,area:t.area}}
function draw(){[...box.children].forEach((d,i)=>{d.querySelector(".ono").textContent=i+1;d.querySelector(".rm").hidden=box.children.length<2});
  const o=build(),multi=o.itens.length>1;
  $("#o-tab tbody").innerHTML=o.itens.map((it,k)=>(multi?`<tr class="grp"><td colspan="5">${esc(it.nome||"Projeto "+(k+1))} — ${num(it.area)} m²</td></tr>`:"")+(it.disciplinas.map(x=>`<tr><td>${x.item}</td><td>${x.nome}</td><td>${num(x.areaProjeto)}</td><td>${brl(x.preco)}</td><td>${brl(x.total)}</td></tr>`).join("")||'<tr><td colspan="5">Selecione ao menos uma disciplina.</td></tr>')+(multi?`<tr class="sub"><td colspan="4">Subtotal</td><td>${brl(it.subtotal)}</td></tr>`:"")).join("");
  $("#o-tot").textContent=brl(o.total);$("#o-med").textContent=brl(o.totalPorM2)+"/m²";
  const t=`Olá! Gostaria de um orçamento para ELABORAÇÃO DE PROJETOS (honorários técnicos — não inclui execução da obra, materiais ou mão de obra).\nCliente: ${o.cliente.nome||"-"}\nProjeto: ${o.projeto||"-"}\nCidade: ${o.cidade||"-"}\n`+o.itens.map((it,k)=>`• ${it.nome||"Projeto "+(k+1)} (${num(it.area)} m²): ${it.disciplinas.map(x=>x.nome).join(", ")}`).join("\n")+`\nTotal estimado (honorários de projeto): ${brl(o.total)}`;
  $("#o-wa").href=`https://wa.me/${C.whatsapp}?text=`+encodeURIComponent(t);return o}
function numero(){const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",r=crypto.getRandomValues(new Uint8Array(4));return`ORC-${new Date().getFullYear()}-`+[...r].map(b=>a[b%a.length]).join("")}
$("#o-form").addEventListener("input",draw);$("#o-add").onclick=addItem;addItem();
$("#o-gerar").onclick=async()=>{const o=draw();msg.className="omsg";
  if(!o.cliente.nome){msg.textContent="Informe o nome do cliente.";msg.classList.add("err");$("#o-nome").focus();return}
  if(!o.itens.length||o.itens.some(i=>!i.area||!i.disciplinas.length)){msg.textContent="Cada projeto precisa de área e de ao menos uma disciplina.";msg.classList.add("err");return}
  const btn=$("#o-gerar");btn.disabled=true;btn.textContent="Salvando…";o.numero=numero();
  try{const [{db},fs]=await Promise.all([import("./firebase-config.js"),import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")]);
    const {area,...doc}=o;await Promise.race([fs.addDoc(fs.collection(db,"orcamentos"),{...doc,status:"novo",createdAt:fs.serverTimestamp()}),new Promise((_,j)=>setTimeout(()=>j(new Error("timeout")),12000))]);
    msg.textContent=`Orçamento ${o.numero} registrado. Entraremos em contato.`;msg.classList.add("ok")}
  catch(e){console.error(e);o.numero="";msg.textContent="Não foi possível registrar o orçamento agora (sem conexão ou serviço indisponível). A proposta foi gerada mesmo assim; envie pelo WhatsApp para confirmar.";msg.classList.add("err")}
  finally{btn.disabled=false;btn.textContent="Gerar proposta"}
  renderProposta({...o,data:new Date()})};
