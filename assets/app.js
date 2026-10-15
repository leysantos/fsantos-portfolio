const C={all:"Todos",met:"Estruturas metálicas",est:"Estrutural (concreto)",res:"Residencial e arquitetura",com:"Comercial e saúde",ins:"Instalações",inf:"Infraestrutura",pub:"Projetos públicos SEMINF"};
const $=s=>document.querySelector(s),grid=$("#grid"),lb=$("#lb"),li=lb.querySelector("img"),lc=lb.querySelector("figcaption");let G=[],i=0,T="";
Object.entries(C).forEach(([k,v])=>{const b=document.createElement("button");b.textContent=v;b.dataset.k=k;if(k=="all")b.className="on";b.onclick=()=>{document.querySelectorAll(".filters button").forEach(x=>x.classList.toggle("on",x==b));render(k)};$("#filters").append(b)});
function card(p,extra){const d=document.createElement("article");d.className="card";d.innerHTML=`<img loading="lazy" decoding="async" src="${p.img[0]}" alt="${p.t}"><div class="b"><h3>${p.t}</h3>${extra}</div>`;d.querySelector("img").onclick=()=>open(p.img,p.t);return d}
const LIM=15;let mais=null;
function render(k,all){grid.innerHTML="";mais&&mais.remove();const F=PROJ.filter(p=>k=="all"||p.c==k);F.forEach((p,n)=>{const d=card(p,`<p>${p.s}</p><div class="row"><span class="badge">${C[p.c]}</span><span class="badge">${p.img.length} imagem${p.img.length>1?"s":""}</span></div>`);d.onclick=()=>open(p.img,p.t);if(!all&&n>=LIM)d.hidden=true;grid.append(d)});
if(!all&&F.length>LIM){mais=document.createElement("button");mais.type="button";mais.className="btn ghost vermais";mais.textContent=`Ver mais obras (${F.length-LIM})`;mais.onclick=()=>{grid.querySelectorAll(".card[hidden]").forEach(c=>c.hidden=false);mais.remove();mais=null};grid.after(mais)}}
SW.forEach(s=>{const d=card(s,`<p>${s.d}</p><a class="btn" href="${s.u}" target="_blank" rel="noopener">Acessar ${s.t}</a>`);d.classList.add("sw");$("#sw").append(d)});
function open(g,t){G=g;T=t;i=0;show();lb.hidden=false}function show(){li.src=G[i];lc.textContent=`${T} — ${i+1}/${G.length}`}
lb.querySelector(".x").onclick=()=>lb.hidden=true;lb.querySelector(".pv").onclick=e=>{i=(i-1+G.length)%G.length;show()};lb.querySelector(".nx").onclick=()=>{i=(i+1)%G.length;show()};
lb.onclick=e=>{if(e.target==lb)lb.hidden=true};document.onkeydown=e=>{if(lb.hidden)return;if(e.key=="Escape")lb.hidden=true;if(e.key=="ArrowRight")lb.querySelector(".nx").click();if(e.key=="ArrowLeft")lb.querySelector(".pv").click()};
$("#y").textContent=new Date().getFullYear();render("all");
