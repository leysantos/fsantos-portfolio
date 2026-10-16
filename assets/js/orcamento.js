// Parâmetros extraídos de modelos/precificacao.xlsx (aba Tabela_Precos, C5:D15; flags INCLUIR? em Precificacao!F16:F26)
// Fórmula: área projeto = área construída × coef.; total = SE(INCLUIR="SIM"; área projeto × preço; 0); total geral = SOMA; médio = total / área
export const ORC_CONFIG={
  empresa:"Santos Projetos & Orçamentos",responsavel:"Eng. Civil Francirley Pereira Santos",crea:"31.410-AM",fone:"(92) 99226-2786",email:"leyfps@gmail.com",local:"Manaus/AM",whatsapp:"5592992262786",artPct:7,descPct:0,descMax:15,validade:30,prazo:30,obs:"",pagAdm:{pix:"leyfps@gmail.com",banco:"Banco Inter",titular:"Francirley Pereira Santos"},
  disciplinas:[
    {item:"001.",nome:"Projeto de Arquitetura",coef:1,preco:13.5,incluir:true},
    {item:"002.",nome:"Projeto Estrutural",coef:1,preco:14,incluir:true},
    {item:"003.",nome:"Projeto de Instalações Elétricas",coef:0.8,preco:12.5,incluir:true},
    {item:"004.",nome:"Projeto Hidráulico de Água Fria",coef:0.7,preco:9.5,incluir:true},
    {item:"005.",nome:"Projeto de Esgoto Sanitário",coef:0.6,preco:10.5,incluir:true},
    {item:"006.",nome:"Projeto de Drenagem de Águas Pluviais",coef:0.6,preco:9.5,incluir:true},
    {item:"007.",nome:"Projeto de SPDA / Para-raios",coef:0.4,preco:8,incluir:false},
    {item:"008.",nome:"Projeto de Combate a Incêndio (PPCI)",coef:0.7,preco:12,incluir:false},
    {item:"009.",nome:"Projeto de Gás",coef:0.3,preco:8.5,incluir:false},
    {item:"010.",nome:"Projeto de Ar-condicionado",coef:0.5,preco:10,incluir:false},
    {item:"011.",nome:"Memorial Descritivo / Laudos",coef:0.6,preco:3.5,incluir:false}],
  get condicoes(){return["Entregáveis: arquivos digitais DWG e PDF em .ZIP.","Revisões técnicas inclusas até aprovação no órgão competente, sem mudança significativa de escopo.",`Prazo estimado: ${this.prazo} dias úteis após recebimento de todas as informações necessárias.`,"Pagamento: 50% no início; saldo conforme cronograma acordado.",`Validade desta proposta: ${this.validade} dias.`,"Para fundações, o contratante deverá fornecer laudo de sondagem.",...String(this.obs||"").split(/\n+/).map(x=>x.trim()).filter(Boolean)]}
};
export const brl=n=>(+n||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
export const num=n=>(+n||0).toLocaleString("pt-BR",{maximumFractionDigits:2});
export const esc=s=>String(s??"").replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"}[c]));
const r2=n=>Math.round(n*100)/100;
// item de entrada: {nome, area, sel:[índices das disciplinas]}
export function calcItem(it){const A=Math.max(0,+it.area||0);const disciplinas=ORC_CONFIG.disciplinas.map((d,i)=>({d,i})).filter(x=>it.sel.includes(x.i)).map(({d})=>({item:d.item,nome:d.nome,coef:d.coef,preco:d.preco,areaProjeto:r2(A*d.coef),total:r2(A*d.coef*d.preco)}));
  return{nome:String(it.nome||"").slice(0,160),area:A,disciplinas,subtotal:r2(disciplinas.reduce((s,x)=>s+x.total,0))}}
export function calcTotal(itens,artPct=ORC_CONFIG.artPct,descPct=ORC_CONFIG.descPct){const subtotal=r2(itens.reduce((s,i)=>s+i.subtotal,0)),area=itens.reduce((s,i)=>s+i.area,0),p=Math.min(20,Math.max(0,+artPct||0)),dp=Math.min(50,Math.max(0,+descPct||0)),art=r2(subtotal*p/100),desc=r2(subtotal*dp/100),total=r2(subtotal+art-desc);return{subtotal,artPct:p,art,descPct:dp,desc,total,area,totalPorM2:area?r2(total/area):0}}
// nome atual da disciplina pelo código (registros antigos guardam o nome antigo, ex.: 011 "ART-RRT")
export const nomeDisc=x=>(ORC_CONFIG.disciplinas.find(d=>d.item===x.item)||x).nome;
// descrição do projeto/obra: campo antigo "projeto" ou descrições dos itens
export const descProjeto=o=>String(o.projeto||(o.itens||[]).map(i=>i.nome).filter(Boolean).join("; ")||"").slice(0,160);
// Configuração do site (Firestore config/site, leitura pública). Sem acesso: mantém os padrões acima.
export const CFG_DEF=JSON.parse(JSON.stringify({artPct:7,descPct:0,descMax:15,validade:30,prazo:30,obs:"",whatsapp:"5592992262786",email:"leyfps@gmail.com",fone:"(92) 99226-2786",pagAdm:{pix:"leyfps@gmail.com",banco:"Banco Inter",titular:"Francirley Pereira Santos"},precos:{}}));
export function aplicarConfig(c){if(!c||typeof c!=="object")return false;const C=ORC_CONFIG,n=(v,a,b)=>typeof v==="number"&&isFinite(v)&&v>=a&&v<=b;
  if(n(c.artPct,0,20))C.artPct=c.artPct;if(n(c.descMax,0,50))C.descMax=c.descMax;if(n(c.descPct,0,50))C.descPct=Math.min(c.descPct,C.descMax);if(n(c.validade,1,365))C.validade=Math.round(c.validade);if(n(c.prazo,1,365))C.prazo=Math.round(c.prazo);
  if(typeof c.obs==="string")C.obs=c.obs.slice(0,2000);if(typeof c.whatsapp==="string"&&/^\d{10,15}$/.test(c.whatsapp))C.whatsapp=c.whatsapp;if(typeof c.email==="string"&&c.email.includes("@"))C.email=c.email.slice(0,120);if(typeof c.fone==="string"&&c.fone.trim())C.fone=c.fone.slice(0,40);
  if(c.pagAdm&&typeof c.pagAdm==="object")C.pagAdm={pix:String(c.pagAdm.pix??C.pagAdm.pix).slice(0,120),banco:String(c.pagAdm.banco??C.pagAdm.banco).slice(0,120),titular:String(c.pagAdm.titular??C.pagAdm.titular).slice(0,120)};
  if(c.precos&&typeof c.precos==="object")C.disciplinas.forEach(d=>{const v=c.precos[d.item];if(n(v,0,10000))d.preco=v});return true}
export async function carregarConfig(db,F,ms=6000){try{const s=await Promise.race([F.getDoc(F.doc(db,"config","site")),new Promise((_,j)=>setTimeout(()=>j(new Error("timeout")),ms))]);return s.exists()?(aplicarConfig(s.data()),s.data()):null}catch(e){console.warn("config/site indisponível — usando padrões",e.code||e.message);return null}}
const tbl=it=>`<table class="pp-t"><thead><tr><th>Item</th><th>Disciplina</th><th>Coef. área</th><th>Área projeto (m²)</th><th>R$/m²</th><th>Total</th></tr></thead><tbody>${it.disciplinas.map(x=>`<tr><td>${esc(x.item)}</td><td>${esc(nomeDisc(x))}</td><td>${(+x.coef||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</td><td>${num(x.areaProjeto)}</td><td>${brl(x.preco)}</td><td>${brl(x.total)}</td></tr>`).join("")}<tr><td colspan="5"><b>Subtotal</b></td><td><b>${brl(it.subtotal)}</b></td></tr></tbody></table><p class="pp-amb"><small>Área base: ${num(it.area)} m² (área construída) × coef. de área da disciplina = área de projeto.</small></p>`;
// Subtítulo e objeto da proposta conforme as disciplinas selecionadas (011 Memorial Descritivo / Laudos entra como complemento)
const lista=a=>a.length<2?(a[0]||""):a.slice(0,-1).join(", ")+" e "+a[a.length-1];
export function escopo(itens){const C=ORC_CONFIG.disciplinas,cods=new Set((itens||[]).flatMap(i=>(i.disciplinas||[]).map(x=>x.item)));
  const sel=C.filter(d=>cods.has(d.item)),mem=sel.find(d=>d.item==="011."),main=sel.filter(d=>d.item!=="011.");
  if(!sel.length)return{sub:"Elaboração de projetos",obj:"a elaboração dos projetos"};
  if(!main.length)return{sub:"Elaboração de "+mem.nome,obj:"a elaboração do "+mem.nome};
  const extra=mem?", incluindo "+mem.nome:"",arq=main.some(d=>d.item==="001.");
  if(arq&&main.length>1)return{sub:"Elaboração de Projeto de Arquitetura e Projetos Complementares"+extra,obj:"a elaboração dos projetos de arquitetura e complementares ("+lista(main.filter(d=>d.item!=="001.").map(d=>d.nome.replace(/^Projeto (de |)/,"")))+")"+extra};
  if(main.length===1)return{sub:"Elaboração de "+main[0].nome+extra,obj:"a elaboração do "+main[0].nome+extra};
  const r=lista(main.map(d=>d.nome.replace(/^Projeto /,"")));return{sub:"Elaboração dos Projetos "+r+extra,obj:"a elaboração dos projetos "+r+extra}}
// o: {numero, data(Date|string), cliente{nome,telefone,email}, projeto, cidade, itens, total, totalPorM2}
export function renderProposta(o,el=document.getElementById("proposta"),onClose){const C=ORC_CONFIG,c=o.cliente||{},hoje=o.data instanceof Date?o.data.toLocaleDateString("pt-BR"):(o.data||new Date().toLocaleDateString("pt-BR"));
  const E=escopo(o.itens),area=o.itens.reduce((s,i)=>s+(+i.area||0),0),multi=o.itens.length>1,blank="________________";
  el.innerHTML=`<div class="pp-head"><img src="assets/img/logo-fsantos.png" alt=""><div><strong>${C.empresa}</strong><br>${C.responsavel} — CREA ${C.crea}</div>${o.numero?`<div class="pp-num">Nº ${esc(o.numero)}</div>`:""}</div>
<p class="pp-flag">Proposta preliminar — sujeita a confirmação</p><h2>Proposta de honorários — elaboração de projetos</h2><p class="pp-sub">${esc(E.sub)}</p><p class="pp-note"><b>Valores referentes à elaboração dos projetos (honorários técnicos). Não incluem execução da obra, materiais ou mão de obra.</b></p><p>${C.local}, ${esc(hoje)}</p>
<p>A(o): <b>${esc(c.nome||blank)}</b><br>Projeto / obra: ${esc(descProjeto(o)||blank)}<br>Cidade da obra: ${esc(o.cidade||blank)}<br>Telefone: ${esc(c.telefone||blank)}${c.email?`<br>E-mail: ${esc(c.email)}`:""}</p>
<h3>1. Objeto</h3><p>A presente proposta tem por objeto ${esc(E.obj)} para a obra acima indicada, conforme disciplinas e valores descritos abaixo.</p>
<h3>2. Área de referência</h3><p>Área construída estimada: <b>${num(area)} m²</b>${multi?" ("+o.itens.map(i=>esc(i.nome||"Projeto")+": "+num(i.area)+" m²").join("; ")+")":""}.</p>
<h3>3. Escopo e precificação</h3>${o.itens.map((it,k)=>(multi?`<h4>3.${k+1} ${esc(it.nome||"Projeto "+(k+1))} — ${num(it.area)} m²</h4>`:"")+tbl(it)).join("")}
${o.art?`<table class="pp-t pp-art"><tbody><tr><td>Subtotal dos projetos</td><td>${brl(o.subtotal)}</td></tr><tr><td>Emissão das ART (${num(o.artPct)}% sobre o subtotal)</td><td>${brl(o.art)}</td></tr>${o.desc?`<tr><td>Desconto (${num(o.descPct)}% sobre o subtotal)</td><td>− ${brl(o.desc)}</td></tr>`:""}</tbody></table>`:""}<p class="pp-tot">Valor total da proposta: <b>${brl(o.total)}</b> <small>(média ${brl(o.totalPorM2)}/m²)</small></p>
<h3>4. Condições comerciais</h3><ul>${C.condicoes.map(x=>`<li>${x}</li>`).join("")}</ul><h4>Dados para pagamento</h4><p class="pp-pag">Chave Pix: <b>leyfps@gmail.com</b><br>Banco: Banco Inter<br>Titular: Francirley Pereira Santos</p>
<h3>5. Aceite</h3><p>Declaro estar de acordo com os termos desta proposta.</p>
<div class="pp-sig"><div class="pp-sb"><div class="pp-sl"></div><div class="pp-line"></div><div class="pp-st">Assinatura do contratante</div></div><div class="pp-sb"><div class="pp-sl"><img src="assets/img/logo-fsantos.png" alt=""></div><div class="pp-line"></div><div class="pp-st"><b>ENG. CIVIL FRANCIRLEY PEREIRA SANTOS</b><br>CREA: ${C.crea}<br>${C.empresa}<br>Fone: ${C.fone} | ${C.email}</div></div></div>
<div class="pp-act noprint"><button class="btn" data-a="print">Imprimir / salvar PDF</button><button class="btn ghost" data-a="close">Fechar</button></div>`;
  el.querySelector('[data-a="print"]').onclick=()=>print();el.querySelector('[data-a="close"]').onclick=()=>{document.body.classList.remove("pp-open");onClose&&onClose()};
  document.body.classList.add("pp-open");scrollTo(0,0)}
