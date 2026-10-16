/* UI comum: tabelas em cartões no celular (data-label), voltar ao topo, rolagem ao abrir item do menu lateral */
(()=>{const SKIP="table.pb-frame";
function lab(t){if(t.matches(SKIP)||t.closest(".html2pdf__container"))return;let hr=t.tHead&&t.tHead.rows.length?t.tHead.rows[t.tHead.rows.length-1]:null;
 if(!hr){const r0=t.rows[0];if(r0&&r0.cells.length>1&&[...r0.cells].every(c=>c.tagName=="TH"))hr=r0}
 const body=[...t.rows].filter(r=>r!==hr&&!(t.tHead&&t.tHead.contains(r)));const nc=Math.max(0,...body.map(r=>r.cells.length));
 if(nc<2||(nc<3&&!hr&&!t.querySelector("input,select"))){t.classList.remove("mc");return}
 const names=[];if(hr){let k=0;[...hr.cells].forEach(c=>{const s=c.colSpan||1;for(let j=0;j<s;j++)names[k++]=c.textContent.trim()})}
 t.classList.add("mc");if(hr&&!(t.tHead&&t.tHead.contains(hr)))hr.classList.add("mc-h");
 body.forEach(r=>{let k=0;[...r.cells].forEach(c=>{const s=c.colSpan||1;if(!c.hasAttribute("data-label"))c.setAttribute("data-label",s>1&&r.cells.length==1?"":(names[k]||""));k+=s})})}
let q=0;function run(){q=0;document.querySelectorAll("table").forEach(lab)}
function sch(){if(!q){q=1;requestAnimationFrame(run)}}
new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>n.nodeType==1&&!(n.closest&&n.closest(".html2pdf__container")))))sch()}).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener("DOMContentLoaded",run);run();
// voltar ao topo
const b=document.createElement("button");b.className="totop";b.type="button";b.setAttribute("aria-label","Voltar ao topo");b.textContent="↑";b.onclick=()=>scrollTo({top:0,behavior:"smooth"});
const add=()=>{document.body.appendChild(b);const f=()=>b.classList.toggle("on",scrollY>600);addEventListener("scroll",f,{passive:true});f()};document.body?add():document.addEventListener("DOMContentLoaded",add);
// menu lateral: ao clicar, leva o painel ao topo da área visível
document.addEventListener("click",e=>{const t=e.target.closest(".ftabs button,.ftabs a");if(!t)return;setTimeout(()=>{const p=document.querySelector(".fpanel");if(!p)return;const h=(document.querySelector(".nav")||{offsetHeight:0}).offsetHeight,y=p.getBoundingClientRect().top;if(y<h||y>innerHeight*.5)scrollTo({top:scrollY+y-h-12,behavior:"smooth"});const on=document.querySelector(".ftabs .on");if(on&&innerWidth>900)on.scrollIntoView({block:"nearest"})},60)})})();

/* Banner recolhível reutilizável: qualquer .fhero (exceto [data-nocollapse]). Estado por sessão e por página. */
(function(){function initBanner(h){if(h.classList.contains("cb")||h.hasAttribute("data-nocollapse"))return;var body=document.createElement("div");body.className="cb-body";while(h.firstChild)body.appendChild(h.firstChild);
var b=document.createElement("button");b.type="button";b.className="cb-tg";b.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var id="cb-"+Math.random().toString(36).slice(2,8);body.id=id;b.setAttribute("aria-controls",id);h.appendChild(b);h.appendChild(body);h.classList.add("cb");
var K="fsBanner:"+location.pathname.replace(/\/$/,"/index.html").split("/").pop();function g(){try{return sessionStorage.getItem(K)}catch(e){return null}}function p(v){try{sessionStorage.setItem(K,v)}catch(e){}}
function set(c){h.classList.toggle("min",c);var L=c?"Mostrar informações":"Ocultar informações";b.setAttribute("aria-label",L);b.title=L;b.setAttribute("aria-expanded",String(!c))}
var st=g();set(st==="auto"||st==="closed");var t=null,armed=!st;function busy(){return h.matches(":hover")||h.contains(document.activeElement)}function tryClose(){if(!armed||busy())return;armed=false;set(true);p("auto")}
if(armed){t=setTimeout(function(){t=null;tryClose()},8000);h.addEventListener("mouseleave",function(){if(!t)tryClose()});h.addEventListener("focusout",function(){setTimeout(function(){if(!t)tryClose()},0)})}
b.addEventListener("click",function(){armed=false;if(t){clearTimeout(t);t=null}var c=!h.classList.contains("min");set(c);p(c?"closed":"open")})}
window.initBanner=initBanner;function run(){document.querySelectorAll(".fhero").forEach(initBanner)}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);else run()})();
