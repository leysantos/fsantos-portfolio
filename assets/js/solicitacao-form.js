import {ORC_CONFIG as C,BRIEF,rotBrief,carregarConfig,esc} from "./orcamento.js?v=20261124b";
const $=s=>document.querySelector(s),msg=$("#s-msg"),WA=$("#s-wa");
function discHtml(){return C.disciplinas.map(x=>`<label><input type="checkbox" value="${esc(x.item)}" data-nome="${esc(x.nome)}" ${x.incluir?"checked":""}> ${esc(x.nome)}</label>`).join("")}
function fillSelects(){
  const fill=(id,g)=>{const el=$("#"+id);if(!el||!BRIEF[g])return;el.innerHTML=Object.entries(BRIEF[g]).map(([k,v])=>`<option value="${esc(k)}">${esc(v)}</option>`).join("")};
  fill("s-quem","quem");fill("s-tipo","tipo");fill("s-fase","fase");fill("s-arq","arquitetura");fill("s-sond","sondagem");
  const disc=$("#s-disc");if(disc)disc.innerHTML=discHtml();
}
function setDisc(on){document.querySelectorAll("#s-disc input[type=checkbox]").forEach(c=>c.checked=on);syncWa()}
$("#s-disc-all")?.addEventListener("click",()=>setDisc(true));
$("#s-disc-none")?.addEventListener("click",()=>setDisc(false));
function numero(){const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",r=crypto.getRandomValues(new Uint8Array(4));return`SOL-${new Date().getFullYear()}-`+[...r].map(b=>a[b%a.length]).join("")}
function read(){
  const disciplinas=[...document.querySelectorAll("#s-disc input:checked")].map(c=>({item:c.value,nome:c.dataset.nome||c.value}));
  const area=parseFloat($("#s-area").value.replace(/\./g,"").replace(",","."))||0;
  return{
    cliente:{nome:$("#s-nome").value.trim().slice(0,120),telefone:$("#s-tel").value.trim().slice(0,40),email:$("#s-email").value.trim().slice(0,120)},
    cidade:$("#s-cid").value.trim().slice(0,100),
    projeto:$("#s-proj").value.trim().slice(0,160),
    area,
    quem:$("#s-quem").value,
    tipo:$("#s-tipo").value,
    fase:$("#s-fase").value,
    arquitetura:$("#s-arq").value,
    sondagem:$("#s-sond").value,
    disciplinas,
    mensagem:$("#s-msg-txt").value.trim().slice(0,2000)
  };
}
function waText(o,num){
  const discs=o.disciplinas.map(d=>d.nome).join(", ")||"—";
  return `Olá! Gostaria de solicitar um orçamento de ELABORAÇÃO DE PROJETOS (honorários técnicos — não inclui execução da obra).
${num?`Pedido: ${num}\n`:""}Cliente: ${o.cliente.nome||"—"}
Telefone: ${o.cliente.telefone||"—"}
E-mail: ${o.cliente.email||"—"}
Cidade: ${o.cidade||"—"}
Projeto: ${o.projeto||"—"}
Área aproximada: ${o.area||"—"} m²
Quem contrata: ${rotBrief("quem",o.quem)||"—"}
Tipo de obra: ${rotBrief("tipo",o.tipo)||"—"}
Fase: ${rotBrief("fase",o.fase)||"—"}
Arquitetura: ${rotBrief("arquitetura",o.arquitetura)||"—"}
Sondagem: ${rotBrief("sondagem",o.sondagem)||"—"}
Disciplinas: ${discs}
${o.mensagem?`Observações: ${o.mensagem}`:""}`.trim();
}
function syncWa(){const o=read();WA.href=`https://wa.me/${C.whatsapp}?text=`+encodeURIComponent(waText(o))}
$("#s-form")?.addEventListener("input",syncWa);
$("#s-form")?.addEventListener("change",syncWa);

$("#s-enviar").onclick=async()=>{
  const o=read();msg.className="omsg";
  if(!o.cliente.nome){msg.textContent="Informe o nome.";msg.classList.add("err");$("#s-nome").focus();return}
  if(!o.cliente.telefone){msg.textContent="Informe o WhatsApp.";msg.classList.add("err");$("#s-tel").focus();return}
  if(!o.cidade){msg.textContent="Informe a cidade da obra.";msg.classList.add("err");$("#s-cid").focus();return}
  if(!o.area||o.area<=0){msg.textContent="Informe a área aproximada em m².";msg.classList.add("err");$("#s-area").focus();return}
  if(!o.disciplinas.length){msg.textContent="Marque ao menos uma disciplina.";msg.classList.add("err");return}
  const btn=$("#s-enviar");btn.disabled=true;const lbl=btn.textContent;btn.textContent="Enviando…";
  const num=numero();
  try{
    const [{db},F]=await Promise.all([
      import("./firebase-config.js?v=20261015c"),
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")
    ]);
    await Promise.race([
      F.addDoc(F.collection(db,"solicitacoes"),{
        numero:num,
        cliente:o.cliente,
        cidade:o.cidade,
        projeto:o.projeto,
        area:o.area,
        quem:o.quem,
        tipo:o.tipo,
        fase:o.fase,
        arquitetura:o.arquitetura,
        sondagem:o.sondagem,
        disciplinas:o.disciplinas,
        mensagem:o.mensagem,
        status:"novo",
        createdAt:F.serverTimestamp()
      }),
      new Promise((_,j)=>setTimeout(()=>j(new Error("timeout")),12000))
    ]);
    msg.innerHTML=`Pedido <b>${esc(num)}</b> registrado. Retornamos em até 1 dia útil com o escopo e os honorários. Você também pode <a href="${esc(`https://wa.me/${C.whatsapp}?text=`+encodeURIComponent(waText(o,num)))}" target="_blank" rel="noopener">abrir o WhatsApp com o resumo</a>.`;
    msg.classList.add("ok");
    $("#s-form").reset();
    $("#s-cid").value="Manaus/AM";
    fillSelects();
    syncWa();
  }catch(e){
    console.error(e);
    msg.innerHTML=`Não foi possível registrar agora. <a href="${esc(`https://wa.me/${C.whatsapp}?text=`+encodeURIComponent(waText(o)))}" target="_blank" rel="noopener">Envie pelo WhatsApp</a> com o resumo do pedido.`;
    msg.classList.add("err");
  }finally{btn.disabled=false;btn.textContent=lbl}
};

(async()=>{
  fillSelects();
  try{
    const [{db},F]=await Promise.all([
      import("./firebase-config.js?v=20261015c"),
      import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")
    ]);
    await carregarConfig(db,F);
    fillSelects();
  }catch(e){console.warn(e)}
  syncWa();
})();
