// Parâmetros extraídos de modelos/precificacao.xlsx (aba Tabela_Precos, C5:D15; flags INCLUIR? em Precificacao!F16:F26)
// Fórmula: área projeto = área construída × coef.; total = SE(INCLUIR="SIM"; área projeto × preço; 0); total geral = SOMA; médio = total / área
export const ORC_CONFIG={
  empresa:"Santos Projetos & Orçamentos",responsavel:"Eng. Civil Francirley Pereira Santos",crea:"31.410-AM",fone:"(92) 99226-2786",email:"leyfps@gmail.com",local:"Manaus/AM",whatsapp:"5592992262786",artPct:7,descPct:0,descMax:15,validade:30,prazo:30,obs:"",pagAdm:{pix:"leyfps@gmail.com",banco:"Banco Inter",titular:"Francirley Pereira Santos"},
  disciplinas:[
    {item:"001.",nome:"Projeto de Arquitetura",coef:1,preco:13.5,incluir:true},
    {item:"002.",nome:"Projeto Estrutural",coef:1,preco:14,incluir:true},
    {item:"003.",nome:"Projeto de Instalações Elétricas",coef:0.8,preco:12.5,incluir:true},
    {item:"004.",nome:"Projeto Hidráulico de Água Fria e Quente",coef:0.7,preco:9.5,incluir:true},
    {item:"005.",nome:"Projeto de Esgoto Sanitário",coef:0.6,preco:10.5,incluir:true},
    {item:"006.",nome:"Projeto de Drenagem de Águas Pluviais",coef:0.6,preco:9.5,incluir:true},
    {item:"007.",nome:"Projeto de SPDA / Para-raios",coef:0.4,preco:8,incluir:false},
    {item:"008.",nome:"Projeto de Combate a Incêndio (PPCI)",coef:0.7,preco:12,incluir:false},
    {item:"009.",nome:"Projeto de Gás",coef:0.3,preco:8.5,incluir:false},
    {item:"010.",nome:"Projeto de Ar-condicionado",coef:0.5,preco:10,incluir:false},
    {item:"011.",nome:"Laudos e Vistorias",coef:0.6,preco:3.5,incluir:false}],
  get condicoes(){return condicoesDe(this)}
};
// Prazo da proposta: o informado no orçamento; senão, o prazo padrão da configuração (1 a 365 dias úteis).
export function prazoDe(v){const raw=v&&typeof v==="object"?(v.prazo??(v.itens||[]).map(i=>i&&i.prazo).find(x=>x!=null)):v;if(raw==null||raw==="")return ORC_CONFIG.prazo;const n=Math.round(+raw);return isFinite(n)&&n>=1?Math.min(365,n):ORC_CONFIG.prazo}
export function condicoesDe(src){const C=ORC_CONFIG,p=prazoDe(src);return["Entregáveis: arquivos digitais DWG e PDF em .ZIP.","Revisões técnicas inclusas até aprovação no órgão competente, sem mudança significativa de escopo.",`Prazo estimado: ${p} dias úteis após recebimento de todas as informações necessárias.`,"Pagamento: 50% no início; saldo conforme cronograma acordado.",`Validade desta proposta: ${C.validade} dias.`,"Para fundações, o contratante deverá fornecer laudo de sondagem.",...String(C.obs||"").split(/\n+/).map(x=>x.trim()).filter(Boolean)]}
const F2={minimumFractionDigits:2,maximumFractionDigits:2};
export const brl=n=>(+n||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL",...F2});
export const num=n=>(+n||0).toLocaleString("pt-BR",{maximumFractionDigits:2});
export const num2=n=>(+n||0).toLocaleString("pt-BR",F2);
export const esc=s=>String(s??"").replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"}[c]));
const r2=n=>Math.round(n*100)/100;
// Acréscimos sobre o valor base do Projeto Estrutural (item 002). O percentual é informado no formulário.
export const ITEM_EST="002.";
// R$/m² do estrutural pela área construída: abaixo de 100 m² o maior valor, de 100 a 1.000 o médio, acima de 1.000 o menor.
export const PRECO_EST={min:10,med:17.5,max:25};
export function precoEstrutural(area){const A=Math.max(0,+area||0);return A<100?PRECO_EST.max:A<=1000?PRECO_EST.med:PRECO_EST.min}
export const COMPLEXIDADE_EST=[
  {id:"fundacao",nome:"Fundação profunda"},
  {id:"vao",nome:"Vão maior que 8 m"},
  {id:"muro",nome:"Muro de contenção"},
  {id:"escada",nome:"Escada autoportante"},
  {id:"piscina",nome:"Piscina"},
  {id:"marquise",nome:"Marquise em balanço"},
  {id:"mezanino",nome:"Mezanino em estrutura metálica"},
  {id:"cisterna",nome:"Caixa de retenção / cisterna"},
  {id:"pduplo",nome:"Pé-direito duplo"},
  {id:"rolante",nome:"Ponte rolante / viga de rolamento"},
  {id:"metalica",nome:"Estrutura metálica"},
  {id:"reforco",nome:"Reforço estrutural ou remoção de elemento"},
  {id:"helicoidal",nome:"Escada helicoidal ou com degraus em balanço"},
  {id:"nervurada",nome:"Laje nervurada ou protendida"},
  {id:"transicao",nome:"Viga de transição"}];
export function parsePct(v){let s=String(v??"").trim().replace("%","").replace(/\s/g,"");if(!s)return 0;if(s.includes(","))s=s.replace(/\./g,"").replace(",",".");const n=+s;return isFinite(n)?n:0}
// objeto {id: percentual} ou lista [{id,pct}] — só itens conhecidos, cada um de 0 a 100
export function lerComplexidade(raw){const map={};if(Array.isArray(raw))raw.forEach(x=>{if(x&&x.id!=null)map[x.id]=x.pct});else if(raw&&typeof raw==="object")Object.assign(map,raw);
  const out={};COMPLEXIDADE_EST.forEach(c=>{const n=r2(parsePct(map[c.id]));if(n>0)out[c.id]=Math.min(100,n)});return out}
// item de entrada: {nome, area, sel:[índices das disciplinas], complexidade?:{id:percentual}}
export function calcItem(it){const A=Math.max(0,+it.area||0),sel=Array.isArray(it.sel)?it.sel:[],iEst=ORC_CONFIG.disciplinas.findIndex(d=>d.item===ITEM_EST),cx=sel.includes(iEst)?lerComplexidade(it.complexidade):{};
  const disciplinas=ORC_CONFIG.disciplinas.map((d,i)=>({d,i})).filter(x=>sel.includes(x.i)).map(({d})=>{const preco=d.item===ITEM_EST?precoEstrutural(A):d.preco,areaProjeto=r2(A*d.coef),base=r2(areaProjeto*preco);
    if(d.item!==ITEM_EST)return{item:d.item,nome:d.nome,coef:d.coef,preco,areaProjeto,total:base};
    const complexidade=COMPLEXIDADE_EST.filter(c=>cx[c.id]).map(c=>{const pct=cx[c.id];return{id:c.id,nome:c.nome,pct,valor:r2(base*pct/100)}}),acrescimo=r2(complexidade.reduce((s,x)=>s+x.valor,0));
    const row={item:d.item,nome:d.nome,coef:d.coef,preco,areaProjeto,base,total:r2(base+acrescimo)};
    if(complexidade.length){row.acrescimo=acrescimo;row.pctComplexidade=r2(complexidade.reduce((s,x)=>s+x.pct,0));row.complexidade=complexidade}
    return row});
  return{nome:String(it.nome||"").slice(0,160),area:A,disciplinas,...(Object.keys(cx).length?{complexidade:cx}:{}),subtotal:r2(disciplinas.reduce((s,x)=>s+x.total,0))}}
export const ART_MIN=108;
export function calcTotal(itens,artPct=ORC_CONFIG.artPct,descPct=ORC_CONFIG.descPct){const subtotal=r2(itens.reduce((s,i)=>s+i.subtotal,0)),area=itens.reduce((s,i)=>s+i.area,0),p=Math.min(20,Math.max(0,+artPct||0)),dp=Math.min(50,Math.max(0,+descPct||0)),artCalc=r2(subtotal*p/100),art=p>0&&subtotal>0&&artCalc<ART_MIN?ART_MIN:artCalc,desc=r2(subtotal*dp/100),total=r2(subtotal+art-desc);return{subtotal,artPct:p,art,descPct:dp,desc,total,area,totalPorM2:area?r2(total/area):0}}
export function artUsaMinimo(o){const p=+o?.artPct||0,sub=+o?.subtotal||0,art=+o?.art||0;if(!(p>0&&sub>0))return false;return r2(sub*p/100)<ART_MIN-0.001&&art>=ART_MIN-0.001}
export function rotuloArt(o,lig="do"){const p=num2(o?.artPct||0);return artUsaMinimo(o)?`Emissão das ART (${p}% ${lig} subtotal; mínimo ${brl(ART_MIN)})`:`Emissão das ART (${p}% ${lig} subtotal)`}
// nome atual da disciplina pelo código (registros antigos guardam o nome antigo, ex.: 011 "ART-RRT", 004 "Projeto Hidráulico de Água Fria")
const codDisc=x=>{const m=String(x?.item??x?.id??"").match(/\d+/);return m?m[0].padStart(3,"0")+".":""};
const NOMES_ANTIGOS={"memorial descritivo / laudos":"011.","memorial descritivo":"011.","laudos":"011.","art-rrt":"011.","projeto hidráulico de água fria":"004.","projeto hidraulico de agua fria":"004."};
const codItem=x=>codDisc(x)||NOMES_ANTIGOS[String(x?.nome||"").trim().toLowerCase()]||"";
export const nomeDisc=x=>{const c=codItem(x);return(ORC_CONFIG.disciplinas.find(d=>d.item===c)||x||{}).nome||""};
// linhas da tabela (simulador e proposta): valor base do estrutural + uma linha por percentual informado
export function htmlLinhasDisciplina(x){const cx=x.complexidade||[],base=cx.length?(x.base??x.total):x.total,nome=cx.length?nomeDisc(x)+" (valor base)":nomeDisc(x);
  return`<tr><td>${esc(codItem(x)||x.item)}</td><td>${esc(nome)}</td><td>${num2(x.coef)}</td><td>${num2(x.areaProjeto)}</td><td>${brl(x.preco)}</td><td>${brl(base)}</td></tr>`+cx.map(c=>`<tr class="cxrow"><td></td><td colspan="4">${esc(c.nome)} (${num2(c.pct)}%) — acréscimo sobre o projeto estrutural</td><td>${brl(c.valor)}</td></tr>`).join("")}
export function textoComplexidade(it){const cx=(it?.disciplinas||[]).flatMap(x=>x.complexidade||[]);return cx.map(c=>`${c.nome} (${num2(c.pct)}%)`).join(", ")}
// descrição do projeto/obra: campo antigo "projeto" ou descrições dos itens
export const descProjeto=o=>String(o.projeto||(o.itens||[]).map(i=>i.nome).filter(Boolean).join("; ")||"").slice(0,160);
// Configuração do site (Firestore config/site, leitura pública). Sem acesso: mantém os padrões acima.
export const CFG_DEF=JSON.parse(JSON.stringify({artPct:7,descPct:0,descMax:15,validade:30,prazo:30,obs:"",whatsapp:"5592992262786",email:"leyfps@gmail.com",fone:"(92) 99226-2786",pagAdm:{pix:"leyfps@gmail.com",banco:"Banco Inter",titular:"Francirley Pereira Santos"},precos:{}}));
export function aplicarConfig(c){if(!c||typeof c!=="object")return false;const C=ORC_CONFIG,n=(v,a,b)=>typeof v==="number"&&isFinite(v)&&v>=a&&v<=b;
  if(n(c.artPct,0,20))C.artPct=c.artPct;if(n(c.descMax,0,50))C.descMax=c.descMax;if(n(c.descPct,0,50))C.descPct=Math.min(c.descPct,C.descMax);if(n(c.validade,1,365))C.validade=Math.round(c.validade);if(n(c.prazo,1,365))C.prazo=Math.round(c.prazo);
  if(typeof c.obs==="string")C.obs=c.obs.slice(0,2000);if(typeof c.whatsapp==="string"&&/^\d{10,15}$/.test(c.whatsapp))C.whatsapp=c.whatsapp;if(typeof c.email==="string"&&c.email.includes("@"))C.email=c.email.slice(0,120);if(typeof c.fone==="string"&&c.fone.trim())C.fone=c.fone.slice(0,40);
  if(c.pagAdm&&typeof c.pagAdm==="object")C.pagAdm={pix:String(c.pagAdm.pix??C.pagAdm.pix).slice(0,120),banco:String(c.pagAdm.banco??C.pagAdm.banco).slice(0,120),titular:String(c.pagAdm.titular??C.pagAdm.titular).slice(0,120)};
  if(c.precos&&typeof c.precos==="object")C.disciplinas.forEach(d=>{if(d.item===ITEM_EST)return;const v=c.precos[d.item];if(n(v,0,10000))d.preco=v});return true}
export async function carregarConfig(db,F,ms=6000){try{const s=await Promise.race([F.getDoc(F.doc(db,"config","site")),new Promise((_,j)=>setTimeout(()=>j(new Error("timeout")),ms))]);return s.exists()?(aplicarConfig(s.data()),s.data()):null}catch(e){console.warn("config/site indisponível — usando padrões",e.code||e.message);return null}}
const tbl=it=>`<table class="pp-t"><thead><tr><th>Item</th><th>Disciplina</th><th>Coef. área</th><th>Área projeto (m²)</th><th>R$/m²</th><th>Total</th></tr></thead><tbody>${it.disciplinas.map(htmlLinhasDisciplina).join("")}<tr><td colspan="5"><b>Subtotal</b></td><td><b>${brl(it.subtotal)}</b></td></tr></tbody></table><p class="pp-amb"><small>Área base: ${num2(it.area)} m² (área construída) × coef. de área da disciplina = área de projeto.${(it.disciplinas||[]).some(x=>(x.complexidade||[]).length)?" Cada percentual de complexidade incide sobre o valor base do projeto estrutural e soma ao total da disciplina.":""}</small></p>`;
// Subtítulo e objeto da proposta conforme as disciplinas selecionadas (011 Laudos e Vistorias entra como complemento)
const lista=a=>a.length<2?(a[0]||""):a.slice(0,-1).join(", ")+" e "+a[a.length-1];
export function escopo(itens){const C=ORC_CONFIG.disciplinas,cods=new Set((itens||[]).flatMap(i=>(i.disciplinas||[]).map(codItem)));
  const sel=C.filter(d=>cods.has(d.item)),mem=sel.find(d=>d.item==="011."),main=sel.filter(d=>d.item!=="011.");
  if(!sel.length)return{sub:"Elaboração de projetos",obj:"a elaboração dos projetos"};
  if(!main.length)return{sub:"Elaboração de "+mem.nome,obj:"a elaboração de "+mem.nome.toLowerCase()};
  const extra=mem?", incluindo "+mem.nome.toLowerCase():"",arq=main.some(d=>d.item==="001.");
  if(arq&&main.length>1)return{sub:"Elaboração de Projeto de Arquitetura e Projetos Complementares"+extra,obj:"a elaboração dos projetos de arquitetura e complementares ("+lista(main.filter(d=>d.item!=="001.").map(d=>d.nome.replace(/^Projeto (de |)/,"")))+")"+extra};
  if(main.length===1)return{sub:"Elaboração de "+main[0].nome+extra,obj:"a elaboração do "+main[0].nome+extra};
  const r=lista(main.map(d=>d.nome.replace(/^Projeto /,"")));return{sub:"Elaboração dos Projetos "+r+extra,obj:"a elaboração dos projetos "+r+extra}}
// Dados para pagamento da proposta: vêm de Configurações (config/site.pagAdm). Campo vazio não aparece; tudo vazio ou config indisponível → padrões fixos
export function pagamentoProposta(p=ORC_CONFIG.pagAdm){const t=v=>String(v??"").trim().slice(0,120),q={pix:t(p?.pix),banco:t(p?.banco),titular:t(p?.titular)};return q.pix||q.banco||q.titular?q:{...CFG_DEF.pagAdm}}
const pagHtml=()=>{const p=pagamentoProposta();return[p.pix&&`Chave Pix: <b>${esc(p.pix)}</b>`,p.banco&&`Banco: ${esc(p.banco)}`,p.titular&&`Titular: ${esc(p.titular)}`].filter(Boolean).join("<br>")};
export const BRIEF={
  quem:{proprietario:"Proprietário",arquiteto:"Arquiteto ou engenheiro",construtora:"Construtora",industria:"Indústria",orgao:"Órgão público"},
  fase:{ideia:"Ideia / estudo",anteprojeto:"Anteprojeto",aprovar:"Projeto para aprovar",existente:"Obra já existente"},
  tipo:{casa:"Casa, clínica ou loja",galpao:"Galpão, ponte rolante ou estrutura metálica",licitacao:"Obra pública ou licitação",especial:"Reforço, contenção ou ponte",contencao:"Contenção / muro de arrimo",retencao:"Caixa de retenção",reservatorio:"Reservatório",fundacao:"Fundações",reforco:"Reforço estrutural"},
  arquitetura:{nao:"Ainda não tenho arquitetura",sim:"Tenho croqui ou projeto de arquitetura"},
  sondagem:{nao:"Não tenho sondagem",sim:"Tenho laudo de sondagem",na:"Não se aplica"}
};
export const rotBrief=(g,k)=>BRIEF[g]?.[k]||"";
const ESP_CONSULTA=["rolante","metalica","reforco"];
export function sobConsultaDe(b,itens){if(b&&(b.quem==="industria"||b.quem==="orgao"))return true;if(b&&b.tipo&&b.tipo!=="casa")return true;return (itens||[]).some(it=>ESP_CONSULTA.some(id=>it?.complexidade&&+it.complexidade[id]>0))}
function htmlConsulta(o){const b=o.itens?.[0]?.briefing||{},linhas=(o.itens||[]).map((it,k)=>`<li>${esc(it.nome||"Item "+(k+1))} — ${num2(it.area)} m²: ${esc((it.disciplinas||[]).map(nomeDisc).filter(Boolean).join(", ")||"disciplinas a confirmar")}</li>`).join("");
  return `<h3>1. Objeto</h3><p>Pedido de elaboração de projetos para o escopo abaixo. O valor não sai da tabela de casa, clínica e loja.</p>
<h3>2. Qualificação</h3><p>Quem contrata: ${esc(rotBrief("quem",b.quem)||"________________")}<br>Tipo de obra: ${esc(rotBrief("tipo",b.tipo)||"________________")}<br>Fase: ${esc(rotBrief("fase",b.fase)||"________________")}<br>Arquitetura: ${esc(rotBrief("arquitetura",b.arquitetura)||"________________")}<br>Sondagem: ${esc(rotBrief("sondagem",b.sondagem)||"________________")}</p>
<h3>3. Escopo informado</h3><ul>${linhas}</ul><p class="pp-tot">Valor sob consulta, depois da análise do vão, da carga e dos documentos.</p>`}
// o: {numero, data(Date|string), cliente{nome,telefone,email}, projeto, cidade, itens, total, totalPorM2}
export function renderProposta(o,el=document.getElementById("proposta"),onClose){const C=ORC_CONFIG,c=o.cliente||{},hoje=o.data instanceof Date?o.data.toLocaleDateString("pt-BR"):(o.data||new Date().toLocaleDateString("pt-BR"));
  const sob=(o.itens||[]).some(i=>i&&i.sobConsulta);
  const E=escopo(o.itens),area=o.itens.reduce((s,i)=>s+(+i.area||0),0),multi=o.itens.length>1,blank="________________";
  el.innerHTML=`<div class="pp-head"><img src="assets/img/logo-fsantos.png" alt=""><div><strong>${C.empresa}</strong><br>${C.responsavel} — CREA ${C.crea}</div>${o.numero?`<div class="pp-num">Nº ${esc(o.numero)}</div>`:""}</div>
<p class="pp-flag">Proposta preliminar — sujeita a confirmação</p><h2>Proposta de honorários — elaboração de projetos</h2><p class="pp-sub">${esc(E.sub)}</p><p class="pp-note"><b>Valores referentes à elaboração dos projetos (honorários técnicos). Não incluem execução da obra, materiais ou mão de obra.</b></p><p>${C.local}, ${esc(hoje)}</p>
<p>A(o): <b>${esc(c.nome||blank)}</b><br>Projeto / obra: ${esc(descProjeto(o)||blank)}<br>Cidade da obra: ${esc(o.cidade||blank)}<br>Telefone: ${esc(c.telefone||blank)}${c.email?`<br>E-mail: ${esc(c.email)}`:""}</p>
${sob?htmlConsulta(o):`<h3>1. Objeto</h3><p>A presente proposta tem por objeto ${esc(E.obj)} para a obra acima indicada, conforme disciplinas e valores descritos abaixo.</p>
<h3>2. Área de referência</h3><p>Área construída estimada: <b>${num2(area)} m²</b>${multi?" ("+o.itens.map((i,k)=>esc(i.nome||"Item "+(k+1))+": "+num2(i.area)+" m²").join("; ")+")":""}.</p>
<h3>3. Escopo e precificação</h3>${o.itens.map((it,k)=>(multi?`<h4>3.${k+1} ${esc(it.nome||"Item "+(k+1))} — ${num2(it.area)} m²</h4>`:"")+tbl(it)).join("")}
${o.art?`<table class="pp-t pp-art"><tbody><tr><td>Subtotal dos projetos</td><td>${brl(o.subtotal)}</td></tr><tr><td>${rotuloArt(o,"sobre o")}</td><td>${brl(o.art)}</td></tr>${o.desc?`<tr><td>Desconto (${num2(o.descPct)}% sobre o subtotal)</td><td>− ${brl(o.desc)}</td></tr>`:""}</tbody></table>`:""}<p class="pp-tot">Valor total da proposta: <b>${brl(o.total)}</b> <small>(média ${brl(o.totalPorM2)}/m²)</small></p>`}
<h3>4. Condições comerciais</h3><ul>${condicoesDe(o).map(x=>`<li>${x}</li>`).join("")}</ul><h4>Dados para pagamento</h4><p class="pp-pag">${pagHtml()}</p>
<h3>5. Aceite</h3><p>Declaro estar de acordo com os termos desta proposta.</p>
<div class="pp-sig"><div class="pp-sb"><div class="pp-sl"></div><div class="pp-line"></div><div class="pp-st">Assinatura do contratante</div></div><div class="pp-sb"><div class="pp-sl"><img src="assets/img/logo-fsantos.png" alt=""></div><div class="pp-line"></div><div class="pp-st"><b>ENG. CIVIL FRANCIRLEY PEREIRA SANTOS</b><br>CREA: ${C.crea}<br>${C.empresa}<br>Fone: ${C.fone} | ${C.email}</div></div></div>
<div class="pp-act noprint"><button class="btn" data-a="print">Imprimir / salvar PDF</button><button class="btn ghost" data-a="close">Fechar</button></div>`;
  el.querySelector('[data-a="print"]').onclick=()=>print();el.querySelector('[data-a="close"]').onclick=()=>{document.body.classList.remove("pp-open");onClose&&onClose()};
  document.body.classList.add("pp-open");scrollTo(0,0)}
