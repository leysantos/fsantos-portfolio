(()=>{const m=document.getElementById("gmain"),ix=document.getElementById("gidx");
m.innerHTML=GUIA.S.map(s=>GUIA.html(s)).join("");
ix.innerHTML=`<b>Seções:</b> `+GUIA.S.map((s,i)=>`<a href="#${s.id}">${i+1}. ${s.t.replace(/ \(.*\)/,"")}</a>`).join("");
const pr=id=>{document.body.dataset.only=id||"";setTimeout(()=>{print();document.body.dataset.only=""},50)};
document.getElementById("gpdf").onclick=()=>pr("");
m.querySelectorAll(".gpr").forEach(b=>b.onclick=()=>pr(b.dataset.sec));
const b=document.querySelector(".burger"),n=document.getElementById("menu");if(b)b.onclick=()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)};
if(location.hash){const e=document.querySelector(location.hash);if(e)setTimeout(()=>e.scrollIntoView(),50)}})();
