// Gera o PDF da proposta (Blob) e compartilha pelo menu nativo (Web Share API, com o arquivo anexado).
// Sem suporte a arquivos: baixa o PDF e abre o WhatsApp com texto pedindo para anexá-lo.
const LIB="https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.2/dist/html2pdf.bundle.min.js";let L=null;
const lib=()=>L||(L=new Promise((ok,ko)=>{if(window.html2pdf)return ok(window.html2pdf);const s=document.createElement("script");s.src=LIB;s.onload=()=>ok(window.html2pdf);s.onerror=()=>{L=null;ko(new Error("Falha ao carregar o gerador de PDF"))};document.head.append(s)}));
export const podeArquivo=()=>{try{return!!(navigator.canShare&&navigator.canShare({files:[new File(["%PDF"],"t.pdf",{type:"application/pdf"})]}))}catch(e){return false}};
export async function pdfBlob(el){const h=await lib();
  await Promise.all([...el.querySelectorAll("img")].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));
  const w=Math.max(el.scrollWidth,el.offsetWidth,700);
  return h().set({margin:[10,10,12,10],image:{type:"jpeg",quality:.95},html2canvas:{scale:2,useCORS:true,backgroundColor:"#ffffff",windowWidth:w,scrollY:0,scrollX:0,ignoreElements:e=>!!e.classList?.contains("noprint")},
    jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},pagebreak:{mode:["css","legacy"],avoid:["tr",".pp-sig",".pp-sb","h3","h4"]}}).from(el).outputPdf("blob")}
const waUrl=(fone,t)=>`https://wa.me/${fone}?text=`+encodeURIComponent(t);
function baixar(blob,nome){const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=nome;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000)}
// Deve ser chamada a partir de um clique do usuário. Retorna {r:"share"|"abort"|"fallback"|"fallback-link",url?}.
export async function enviarPDF({el,nome,titulo,texto,fone}){const share=podeArquivo();
  const blob=await pdfBlob(el);if(!blob||blob.size<800)throw new Error("PDF vazio");
  const file=new File([blob],nome,{type:"application/pdf"});
  if(share){try{await navigator.share({files:[file],title:titulo,text:texto});return{r:"share"}}catch(e){if(e&&e.name==="AbortError")return{r:"abort"};console.warn(e)}}
  baixar(blob,nome);const url=waUrl(fone,texto+`\n\n📎 Anexe a esta conversa o PDF que acabou de ser baixado: ${nome}`);
  const w=window.open(url,"_blank");if(w){try{w.opener=null}catch(e){}return{r:"fallback"}}
  return{r:"fallback-link",url}}
