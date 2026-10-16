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
