// Configurações do site (Firestore config/site) — somente administrador verificado grava; leitura pública
import {auth,db,ADMIN_EMAIL,FB} from "./firebase-config.js?v=20261015c";
import {ORC_CONFIG,CFG_DEF,esc,ITEM_EST,PRECO_EST} from "./orcamento.js?v=20261028a";
const {onAuthStateChanged}=await import(FB+"firebase-auth.js");
const {doc,getDoc,setDoc,serverTimestamp}=await import(FB+"firebase-firestore.js");
const $=s=>document.querySelector(s),box=$("#tab-cfg"),EST0={min:PRECO_EST.min,med:PRECO_EST.med,max:PRECO_EST.max};
const DISC=ORC_CONFIG.disciplinas.map(d=>({item:d.item,nome:d.nome,coef:d.coef,preco:d.preco}));
const n2=v=>String(v??"").replace(".",","),pn=v=>parseFloat(String(v).replace(/\./g,"").replace(",","."));
function seqDe(lista,salvo){let s=Math.max(13,Math.round(+salvo)||13);(lista||[]).forEach(x=>{const n=parseInt(x&&x.item,10);if(n>=s)s=n+1});return Math.min(100,s)}
function linhaExtra(x){const item=String(x.item||"");return `<div class="ex-row" data-item="${esc(item)}"><label>Disciplina<input class="ex-nome" maxlength="80" value="${esc(x.nome||"")}"></label><label>Coef. área<input class="ex-coef" inputmode="decimal" value="${n2(x.coef??1)}"></label><label>Valor base (R$/m²)<input class="ex-preco" inputmode="decimal" value="${n2(x.preco??0)}"></label><label class="ex-inc"><input type="checkbox" class="ex-on" ${x.incluir?"checked":""}> Marcar por padrão</label><button type="button" class="btn ghost small ex-rm">Remover</button></div>`}
function ligarRemover(){const el=$("#cf-extras");if(!el)return;el.querySelectorAll(".ex-rm").forEach(b=>b.onclick=()=>b.closest(".ex-row").remove())}
function addExtra(){const el=$("#cf-extras");if(!el)return;if(el.children.length>=20)return msg("No máximo 20 disciplinas adicionais.");const seq=parseInt(el.dataset.seq,10)||13;if(seq>99)return msg("Não há código livre para outra disciplina.");const item=String(seq).padStart(3,"0")+".";el.dataset.seq=String(seq+1);el.insertAdjacentHTML("beforeend",linhaExtra({item,coef:1,preco:0,incluir:false}));ligarRemover()}
export function formCfg(c={}){const v={...CFG_DEF,...c,pagAdm:{...CFG_DEF.pagAdm,...(c.pagAdm||{})},precos:{...(c.precos||{})}},est={min:v.precos.estMin??EST0.min,med:v.precos.estMed??EST0.med,max:v.precos.estMax??EST0.max};
 const campoEst=(k,lab,faixa)=>`<label>${lab}<small>${faixa}</small><input class="cf-est" data-k="${k}" inputmode="decimal" value="${n2(est[k])}"></label>`;
 const inp=(id,lab,val,extra="")=>`<label>${lab}<input id="cf-${id}" value="${esc(val)}" ${extra}></label>`;
 const extras=Array.isArray(c.extras)?c.extras:[],seq0=seqDe(extras,c.seqExtra);
 box.innerHTML=`<div class="ptop"><h2>Configurações do site</h2></div><p class="pcount">Valores usados pela calculadora “Orçamento de projetos” e pela proposta em PDF. Se a configuração não puder ser lida, o site usa os padrões do código.</p>
 <form id="cf-form" class="cform" onsubmit="return false">
 <fieldset><legend>Honorários</legend><div class="cgrid">${inp("art","Emissão das ART (% sobre o subtotal)",n2(v.artPct),'inputmode="decimal"')}${inp("desc","Desconto padrão (%)",n2(v.descPct),'inputmode="decimal"')}${inp("dmax","Desconto máximo (%)",n2(v.descMax),'inputmode="decimal"')}</div>
 <div class="otab"><table class="ptab"><thead><tr><th>Item</th><th>Disciplina</th><th>Coef. área</th><th>Valor base (R$/m²)</th></tr></thead><tbody>${DISC.map(d=>d.item===ITEM_EST?`<tr><td>${d.item}</td><td>${esc(d.nome)}</td><td>${n2(d.coef)}</td><td><div class="est-faixas">${campoEst("min","Mínimo","acima de 1.000 m²")}${campoEst("med","Médio","de 100 a 1.000 m²")}${campoEst("max","Máximo","até 100 m²")}</div></td></tr>`:`<tr><td>${d.item}</td><td>${esc(d.nome)}</td><td>${n2(d.coef)}</td><td><input class="cf-pr" data-it="${d.item}" inputmode="decimal" value="${n2(v.precos[d.item]??d.preco)}"></td></tr>`).join("")}</tbody></table></div></fieldset>
 <fieldset><legend>Outras disciplinas</legend><p class="pcount">Disciplinas que não estão na tabela. Depois de salvar, elas entram no orçamento de elaboração de projetos. Coeficiente 1 usa a área construída inteira; 0,60 usa 60% dessa área. “Marcar por padrão” já deixa a disciplina selecionada quando o visitante abre o orçamento.</p><div id="cf-extras" data-seq="${seq0}">${extras.map(linhaExtra).join("")}</div><button type="button" class="btn ghost small" id="cf-add-ex">Adicionar disciplina</button></fieldset>
 <fieldset><legend>Proposta</legend><div class="cgrid">${inp("val","Validade da proposta (dias)",v.validade,'inputmode="numeric"')}${inp("prazo","Prazo padrão (dias úteis)",v.prazo,'inputmode="numeric"')}</div>
 <label class="cfull">Observações padrão da proposta (uma por linha; entram nas Condições comerciais)<textarea id="cf-obs" rows="4" maxlength="2000">${esc(v.obs)}</textarea></label></fieldset>
 <fieldset><legend>Contato</legend><div class="cgrid">${inp("wa","WhatsApp (só números, com DDI 55)",v.whatsapp,'inputmode="numeric" maxlength="15"')}${inp("fone","Telefone exibido",v.fone,'maxlength="40"')}${inp("email","E-mail",v.email,'type="email" maxlength="120"')}</div></fieldset>
 <fieldset><legend>Dados para pagamento exibidos na proposta</legend><div class="cgrid">${inp("pix","Chave Pix",v.pagAdm.pix,'maxlength="120"')}${inp("banco","Banco",v.pagAdm.banco,'maxlength="120"')}${inp("tit","Titular",v.pagAdm.titular,'maxlength="120"')}</div><p class="pcount">Aparecem em “Dados para pagamento” na proposta de elaboração de projetos. Campo vazio não aparece; se os três ficarem vazios, a proposta usa os dados padrão. Não coloque CPF nem endereço aqui: este dado é público.</p></fieldset>
 <div class="cact"><button class="btn" id="cf-save" type="button">Salvar configurações</button><button class="btn ghost" id="cf-def" type="button">Restaurar padrões</button></div><p class="omsg" id="cf-msg" role="status"></p>
 ${c.updatedAt?.toDate?`<p class="pcount">Última alteração: ${c.updatedAt.toDate().toLocaleString("pt-BR")}</p>`:""}</form>`;
 $("#cf-save").onclick=salvar;$("#cf-def").onclick=()=>{formCfg({});msg("Padrões carregados no formulário — clique em Salvar para gravar.",1)};$("#cf-add-ex").onclick=()=>addExtra();ligarRemover()}
const msg=(t,ok)=>{const m=$("#cf-msg");m.className="omsg "+(ok?"ok":"err");m.textContent=t};
export function lerCfg(){const g=id=>$("#cf-"+id).value.trim(),err=[],num=(id,lab,a,b)=>{const x=pn(g(id));if(!isFinite(x)||x<a||x>b){err.push(`${lab}: ${a} a ${b}`);return null}return x};
 const c={artPct:num("art","ART",0,20),descPct:num("desc","Desconto padrão",0,50),descMax:num("dmax","Desconto máximo",0,50),validade:num("val","Validade",1,365),prazo:num("prazo","Prazo",1,365),
  obs:g("obs").slice(0,2000),whatsapp:g("wa").replace(/\D/g,""),fone:g("fone").slice(0,40),email:g("email").slice(0,120),pagAdm:{pix:g("pix").slice(0,120),banco:g("banco").slice(0,120),titular:g("tit").slice(0,120)},precos:{}};
 document.querySelectorAll(".cf-pr").forEach(i=>{const x=pn(i.value);if(!isFinite(x)||x<0||x>10000)err.push(`Valor base ${i.dataset.it}: 0 a 10.000`);else c.precos[i.dataset.it]=x});
 const estLab={min:"Mínimo do estrutural",med:"Médio do estrutural",max:"Máximo do estrutural"},estKey={min:"estMin",med:"estMed",max:"estMax"};
 document.querySelectorAll(".cf-est").forEach(i=>{const x=pn(i.value);if(!isFinite(x)||x<0||x>10000)err.push(`${estLab[i.dataset.k]}: 0 a 10.000`);else c.precos[estKey[i.dataset.k]]=x});
 if(c.validade!=null)c.validade=Math.round(c.validade);if(c.prazo!=null)c.prazo=Math.round(c.prazo);
 const extras=[];const usados=new Set();
 document.querySelectorAll("#cf-extras .ex-row").forEach((row,i)=>{const nome=row.querySelector(".ex-nome").value.trim().replace(/\s+/g," ").slice(0,80),coef=pn(row.querySelector(".ex-coef").value),preco=pn(row.querySelector(".ex-preco").value),item=row.dataset.item,n=parseInt(item,10),rot=nome||`Disciplina adicional ${i+1}`;
  if(!nome){err.push(`Disciplina adicional ${i+1}: informe o nome`);return}
  if(!item||n<13||n>99||usados.has(item)){err.push(`${rot}: código inválido`);return}
  if(!isFinite(coef)||coef<0.05||coef>5){err.push(`${rot}: coeficiente de 0,05 a 5`);return}
  if(!isFinite(preco)||preco<0||preco>10000){err.push(`${rot}: valor base de 0 a 10.000`);return}
  usados.add(item);extras.push({item,nome,coef:Math.round(coef*100)/100,preco:Math.round(preco*100)/100,incluir:row.querySelector(".ex-on").checked})});
 if(extras.length){c.extras=extras;c.seqExtra=Math.max(13,parseInt($("#cf-extras").dataset.seq,10)||13,...extras.map(x=>parseInt(x.item,10)+1))}
 if(c.descPct!=null&&c.descMax!=null&&c.descPct>c.descMax)err.push("Desconto padrão maior que o máximo");
 if(!/^\d{10,15}$/.test(c.whatsapp))err.push("WhatsApp: 10 a 15 dígitos");if(c.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email))err.push("E-mail inválido");return{c,err}}
async function salvar(){const {c,err}=lerCfg();if(err.length)return msg("Corrija: "+err.join("; ")+".");const b=$("#cf-save");b.disabled=true;
 try{await setDoc(doc(db,"config","site"),{...c,updatedAt:serverTimestamp()});msg("Configurações salvas. A calculadora usa os novos valores no próximo carregamento da página.",1)}
 catch(e){msg("Não foi possível salvar ("+(e.code||e.message)+"). Confira se as regras do Firestore com config/site já foram publicadas no console.")}finally{b.disabled=false}}
let feito=false;onAuthStateChanged(auth,async u=>{if(!(u&&u.email===ADMIN_EMAIL&&u.emailVerified)||feito)return;feito=true;box.innerHTML='<p class="pcount">Carregando configurações…</p>';
 try{const s=await getDoc(doc(db,"config","site"));formCfg(s.exists()?s.data():{})}catch(e){formCfg({});msg("Não foi possível ler config/site ("+(e.code||e.message)+"); mostrando padrões.")}});
