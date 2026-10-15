// Modelo paramétrico do Orçamento estimativo de obra (SINAPI-AM).
// Todas as regras de quantitativo estão documentadas em REGRAS (exibidas na página e no PDF).
import {SINAPI} from "./sinapi-am.js";
export {SINAPI};
export const ETAPAS=["Administração da obra","Serviços preliminares","Movimento de terra","Fundações","Estrutura","Alvenaria / vedação","Cobertura","Impermeabilização","Instalações elétricas","Instalações hidrossanitárias","Revestimentos","Pisos","Forro","Esquadrias","Pintura","Louças e metais","Muro e área externa","Limpeza final","Ajuste de padrão (calibração CUB-AM)"];
export const TIPOS={
  baixo:{nome:"Casa — baixo padrão",kp:1.12,pd:2.6,cub:"R1-B",dur:1.0,eng:.05},
  medio:{nome:"Casa — médio padrão",kp:1.15,pd:2.8,cub:"R1-N",dur:1.1,eng:.08},
  alto:{nome:"Casa — alto padrão",kp:1.18,pd:3.0,cub:"R1-A",dur:1.3,eng:.12},
  galpao:{nome:"Galpão",kp:1.03,pd:6.0,cub:null,dur:.75,eng:.10}};
// CUB-AM (Sinduscon-AM), competência ago/2026, R$/m² — referência de comparação apenas
export const CUB={ref:"08/2026",fonte:"Sinduscon-AM (via CBIC)","R1-B":3120.00,"R1-N":3742.05,"R1-A":5095.41};
// tipos de ambiente: s=seco, d=dormitório, b=banheiro, c=cozinha, a=área de serviço, e=externo coberto (varanda/garagem), g=galpão/produção
export const TAMB={s:"Sala / seco",d:"Dormitório",b:"Banheiro",c:"Cozinha",a:"Área de serviço",e:"Varanda / garagem",g:"Área de produção"};
export const PRESETS={
  baixo:[["Sala","s",3.5,4],["Cozinha","c",2.8,3],["Dormitório 1","d",3,3],["Dormitório 2","d",2.8,3],["Banheiro","b",1.5,2.2],["Área de serviço","a",1.5,2]],
  medio:[["Sala de estar/jantar","s",4,5],["Cozinha","c",3,3.5],["Suíte","d",3.3,3.6],["Dormitório","d",3,3.2],["Banheiro social","b",1.6,2.4],["Banho suíte","b",1.6,2.2],["Área de serviço","a",1.6,2.2],["Varanda","e",2,4]],
  alto:[["Living","s",6,6],["Cozinha gourmet","c",4,4.5],["Suíte master","d",4.5,5],["Closet","s",2,3],["Banho master","b",2.2,3],["Suíte 2","d",3.5,4],["Banho suíte 2","b",1.8,2.5],["Suíte 3","d",3.5,4],["Banho suíte 3","b",1.8,2.5],["Lavabo","b",1.4,1.8],["Escritório","s",3,3.5],["Área de serviço","a",2,3],["Varanda gourmet","e",3,6],["Garagem","e",5.5,6]],
  galpao:[["Área de produção / armazenagem","g",20,22.4],["Escritório","s",4,5],["Banheiro masc.","b",2,2.5],["Banheiro fem.","b",2,2.5],["Copa","c",2.5,3]]};
const UP=(x)=>Math.ceil(x-1e-9);
// pontos por tipo de ambiente: [tomadas, interruptores, pontos de luz, pontos de água]
const PTS={s:[4,1,1,0],d:[4,1,1,0],b:[2,1,1,3],c:[6,1,1,2],a:[3,1,1,2],e:[2,1,2,1],g:[0,0,0,0]};
export const REGRAS=[
 "Área dos ambientes (Aamb) = Σ largura × comprimento de todos os ambientes informados (de todos os pavimentos).",
 "Área construída (Ac) = Aamb × fator de paredes (baixo 1,12; médio 1,15; alto 1,18; galpão 1,03). Projeção (Ap) = Ac ÷ nº de pavimentos.",
 "Perímetro externo por pavimento = 4,5 × √Ap (planta retangular ~1:1,5 com recortes). Paredes internas = (Σ perímetros dos ambientes − perímetro externo total) ÷ 2.",
 "Vãos: 1 porta interna 0,80×2,10 por ambiente fechado + 1 porta externa (2 se Ac > 120 m²); janela = 1/6 da área do ambiente (dormitório/sala/cozinha; alto padrão 1/5), 1/8 (serviço) e 0,60×0,80 maxim-ar nos banheiros. Alvenaria = (perímetro externo + paredes internas) × pé-direito − vãos.",
 "Chapisco/reboco interno = (2 × paredes internas + perímetro externo) × pé-direito − 2 × vãos; externo = perímetro externo × (pé-direito + 0,5 m de platibanda/oitão) − vãos.",
 "Cerâmica de parede: banheiros até o teto (baixo padrão até 1,80 m), cozinha e serviço até o teto (baixo padrão 1,50 m). Pintura interna = reboco interno − cerâmica.",
 "Piso e contrapiso = Aamb; rodapé = perímetro dos ambientes secos; lastro de concreto magro 5 cm sob o piso do térreo. Galpão: piso industrial armado 15 cm.",
 "Forro na área dos ambientes cobertos (baixo: PVC; médio: placas de gesso; alto: drywall). Galpão: forro só no escritório/banheiros/copa.",
 "Cobertura = (√Ap + 1,0 m de beiral)² × fator de inclinação (telha cerâmica 30% → 1,044; fibrocimento/metálica 10–15% → 1,011). Cumeeira = 1,22 × √Ap. Rufos = 50% do perímetro externo (médio/alto).",
 "Fundação rasa: viga baldrame 15×30 cm sob todas as paredes do térreo; sapatas 80×80×30 cm (área ampliada 20% por pavimento extra), 1 pilar a cada 12 m² de projeção + 4. Aço: baldrame 80 kg/m³, sapata 50 kg/m³. Galpão: sapatas 1,5×1,5×0,5 m por pilar.",
 "Estrutura: pilares 14×30 cm × pé-direito × pavimentos (100 kg/m³), vigas 14×40 cm sobre todas as paredes de cada pavimento (90 kg/m³), fôrmas pelas faces laterais. Laje pré-moldada treliçada LT 12 quando há mais de 1 pavimento (área = Ap × (pavimentos − 1)); no alto padrão também a laje de cobertura (Ap × pavimentos). Galpão: pilares de concreto 30×40 cm a cada 6 m no perímetro, tesouras de aço 12 kg/m² e terças 6 kg/m² de cobertura, pintura esmalte 2 demãos (0,03 m²/kg).",
 "Elétrica por ambiente [tomadas/interruptores/luz]: sala e dormitório 4/1/1, cozinha 6/1/1, banheiro 2/1/1, serviço 3/1/1, varanda 2/1/2; alto padrão × 1,5. Eletroduto 6 m por ponto, cabo 3 × eletroduto. Galpão: 1 ponto de luz a cada 20 m² e 1 tomada a cada 25 m² na área de produção.",
 "Hidrossanitário: pontos de água banheiro 3, cozinha 2, serviço 2, varanda 1; tubo PVC 25 mm 6 m por ponto; esgoto DN40 3 m por ponto, DN100 6 m por banheiro + 50% do perímetro externo; 1 caixa sifonada e 1 registro por área molhada; caixa d'água 1000 L a cada 100 m² (mín. 1).",
 "Padrão: médio inclui ar-condicionado split nos dormitórios; alto inclui split nos dormitórios e salas, aquecimento solar, revestimento cerâmico em 30% da fachada, portas de correr de alumínio e vidro nas salas/varandas e bancadas de granito. Escada de concreto (1,5 m³) por pavimento extra.",
 "Impermeabilização: vigas baldrame com emulsão asfáltica (0,75 m²/m); áreas molhadas com argamassa polimérica no piso + 30 cm de rodapé (box até 1,80 m não detalhado).",
 "Muro: comprimento = lados marcados (frente/fundos = largura, laterais = comprimento do terreno) × altura; alvenaria 14 cm, pilaretes 14×14 a cada 3 m, baldrame 15×30 cm, chapisco, reboco e pintura nas duas faces. Calçada de 0,80 m no perímetro externo (galpão 1,00 m).",
 "Administração: duração (meses) = máx(3; 2,5 + Ac^0,6 ÷ 4) × fator do padrão (baixo 1,0; médio 1,1; alto 1,3; galpão 0,75). Engenheiro civil (dedicação parcial: baixo 5%, médio 8%, alto 12%, galpão 10%), mestre de obras (Ac ÷ 400, máx. 0,6 em casas e 1,0 no galpão), vigia (Ac ÷ 800, máx. 1), encarregado (só Ac > 400 m²) e almoxarife (só Ac > 300 m²), composições mensalistas SINAPI × duração × dedicação.",
 "Canteiro: barracão de obra 3×4 m (galpão 4×6 m) composto com itens SINAPI (paredes em compensado, cobertura em fibrocimento, piso em concreto); ligações provisórias com entrada de energia e kit cavalete SINAPI; placa de obra 3,0×2,0 m (casas 2,0×1,5 m); ART como verba (taxa CREA-AM, conferir tabela vigente).",
 "Calibração CUB-AM (casas, opcional e ativada por padrão): base comparável = custo direto − fundações (etapa 4) − muro/área externa (etapa 17), sem BDI. Ajuste = CUB-AM do padrão (R1-B, R1-N, R1-A) × Ac − base, lançado como linha própria (etapa 19). Galpão não é calibrado (sem CUB-GI publicado na referência usada).",
 "Preços: SINAPI Caixa, Manaus/AM, custo de composições com encargos (desonerado ou não desonerado). BDI aplicado sobre o custo direto total."];
// tabela de seleção por padrão: código SINAPI
const SEL={
  piso:{baixo:"87251",medio:"87251",alto:"104598",galpao:"103915"},
  rodape:{baixo:"88649",medio:"88649",alto:"88650",galpao:"88649"},
  parede:{baixo:"87265",medio:"87273",alto:"87273",galpao:"87265"},
  forro:{baixo:"96111",medio:"96109",alto:"96110",galpao:"96109"},
  latex:{baixo:"104641",medio:"88489",alto:"88489",galpao:"104641"},
  latexTeto:{baixo:null,medio:"88488",alto:"88488",galpao:"104639"},
  telha:{baixo:"94207",medio:"94201",alto:"94201",galpao:"94213"},
  trama:{baixo:"92543",medio:"92539",alto:"92539",galpao:null},
  cumeeira:{baixo:"94451",medio:"94221",alto:"94221",galpao:null},
  bacia:{baixo:"86931",medio:"86932",alto:"86932",galpao:"86931"},
  portaInt:{baixo:"90843",medio:"90843",alto:"90790",galpao:"90843"},
  tanque:{baixo:"86929",medio:"86925",alto:"86919",galpao:"86929"}};
export function quantitativos(inp){
  const T=TIPOS[inp.tipo],g=inp.tipo==="galpao",n=Math.max(1,inp.pav|0),h=+inp.pd||T.pd;
  const amb=inp.ambientes.filter(a=>a.l>0&&a.c>0);
  const Aamb=amb.reduce((s,a)=>s+a.l*a.c,0),Ac=Aamb*T.kp,Ap=Ac/n;
  const Pext1=4.5*Math.sqrt(Ap),Pext=Pext1*n;
  const sumPer=amb.reduce((s,a)=>s+2*(a.l+a.c),0);
  const Lint=Math.max(0,(sumPer-Pext)/2);
  const fech=amb.filter(a=>a.t!=="e"&&a.t!=="g"),wet=amb.filter(a=>"bca".includes(a.t)),ban=amb.filter(a=>a.t==="b"),coz=amb.filter(a=>a.t==="c"),serv=amb.filter(a=>a.t==="a");
  const nPortInt=fech.length,nPortExt=Ac>120?2:1,nPort=nPortInt+nPortExt;
  let Ajan=0,Amax=0,Ljan=0;
  amb.forEach(a=>{const A=a.l*a.c;if(a.t==="b"){Amax+=.48;Ljan+=.6}else if("sdc".includes(a.t)){const w=A/(inp.tipo==="alto"?5:6);Ajan+=w;Ljan+=w/1.2}else if(a.t==="a"){Ajan+=A/8;Ljan+=A/8/1.2}});
  if(g){const prod=amb.filter(a=>a.t==="g").reduce((s,a)=>s+a.l*a.c,0);Ajan+=prod*0.05;Ljan+=prod*.05/1.0}
  const Avaos=nPort*1.68+Ajan+Amax;
  const hAlv=g?Math.min(3,h):h;
  const Alv=Math.max(0,(Pext+Lint)*hAlv-Avaos);
  const RebInt=Math.max(0,(2*Lint+Pext)*hAlv-2*Avaos),RebExt=Math.max(0,Pext*(hAlv+.5)-Avaos);
  const hb=inp.tipo==="baixo"?1.8:h,hc=inp.tipo==="baixo"?1.5:h;
  const Ceram=ban.reduce((s,a)=>s+2*(a.l+a.c)*hb,0)+[...coz,...serv].reduce((s,a)=>s+2*(a.l+a.c)*hc,0);
  const Awet=wet.reduce((s,a)=>s+a.l*a.c,0),Pwet=wet.reduce((s,a)=>s+2*(a.l+a.c),0);
  const Pseco=amb.filter(a=>!"bcag".includes(a.t)).reduce((s,a)=>s+2*(a.l+a.c),0);
  const Aforro=g?amb.filter(a=>a.t!=="g").reduce((s,a)=>s+a.l*a.c,0):Aamb;
  const incl=T&&inp.tipo==="baixo"||g?1.011:1.044;
  const Acob=Math.pow(Math.sqrt(Ap)+1,2)*incl,Lcum=1.22*Math.sqrt(Ap);
  // fundações
  const Lb=Pext1+Lint/n,Vb=Lb*.15*.30;
  const Np=g?UP(Pext1/6)+2:UP(Ap/12)+4;
  const fs=g?{b:1.5,hh:.5}:{b:.8*Math.sqrt(1+.2*(n-1)),hh:.3};
  const Vs=Np*fs.b*fs.b*fs.hh,Escs=Np*(fs.b+.2)*(fs.b+.2)*(fs.hh+.9),Lastro=Np*fs.b*fs.b;
  const Escb=Lb*.4*.5;
  // estrutura
  const sp=g?[.3,.4]:[.14,.3];
  const Vp=Np*n*h*sp[0]*sp[1],Fp=Np*n*h*2*(sp[0]+sp[1]);
  const Lv=g?Pext1:(Pext1+Lint/n)*n,Vv=Lv*.14*.40,Fv=Lv*(2*.40+.14);
  const Alaje=inp.tipo==="alto"?Ap*n:(n>1?Ap*(n-1):0);
  const aco=g?Acob*12:0,terca=g?Acob*6:0;
  // muro
  const L=+inp.terreno.l||0,C=+inp.terreno.c||0,ms=inp.muro||{};
  const Lmuro=ms.on?((ms.frente?L:0)+(ms.fundos?L:0)+(ms.esq?C:0)+(ms.dir?C:0)):0,hm=+ms.h||2,Amuro=Lmuro*hm;
  // elétrica / hidro
  const mult=inp.tipo==="alto"?1.5:1;let Tm=0,Im=0,Lu=0,Pa=0;
  amb.forEach(a=>{const p=PTS[a.t]||[0,0,0,0];Tm+=p[0];Im+=p[1];Lu+=p[2];Pa+=p[3];if(a.t==="g"){const A=a.l*a.c;Lu+=UP(A/20);Tm+=UP(A/25);Im+=2}});
  Tm=UP(Tm*mult);Im=UP(Im*mult);Lu=UP(Lu*mult);
  const dur=Math.max(3,2.5+Math.pow(Ac,.6)/4)*T.dur;
  return {T,g,n,h,Aamb,Ac,Ap,Pext1,Pext,Lint,nPortInt,nPortExt,nPort,Ajan,Amax,Ljan,Avaos,Alv,RebInt,RebExt,Ceram,Awet,Pwet,Pseco,Aforro,Acob,Lcum,Lb,Vb,Np,Vs,Escs,Lastro,Escb,Vp,Fp,Lv,Vv,Fv,Alaje,aco,terca,Lmuro,hm,Amuro,Tm,Im,Lu,Pa,nBan:ban.length,nDorm:amb.filter(a=>a.t==="d").length,nSala:amb.filter(a=>a.t==="s"&&!/closet/i.test(a.nome||"")).length,nSalaE:amb.filter(a=>a.t==="e"||(a.t==="s"&&/sala|living|estar/i.test(a.nome||""))).length,nCoz:coz.length,nServ:serv.length,nWet:wet.length,dur,terrA:L*C,frente:L};
}
// cada item: [etapa(1-18), código SINAPI ou null para verba, quantidade, obs?, custoVerba?]
export function itens(inp,Q){
  const t=inp.tipo,g=Q.g,S=k=>SEL[k][t],I=[],add=(e,c,q,o,v)=>{if(c&&q>0.0001)I.push({e,c,q,o,v})};
  // 1 Administração
  add(1,"93565",Q.dur*Q.T.eng,"Engenheiro civil júnior — "+Math.round(Q.T.eng*100)+"% de dedicação × "+Q.dur.toFixed(1)+" meses");
  add(1,"94295",Q.dur*Math.min(g?1:.6,Q.Ac/400),"Mestre de obras");
  if(Q.Ac>400)add(1,"93572",Q.dur*Math.min(1,(Q.Ac-400)/600),"Encarregado geral");
  if(Q.Ac>300)add(1,"93563",Q.dur*Math.min(1,(Q.Ac-300)/700),"Almoxarife");
  add(1,"101460",Q.dur*Math.min(1,Q.Ac/800),"Vigia");
  // 2 Preliminares
  add(2,"98524",Q.terrA||Q.Ap*2,"Limpeza do terreno");
  const bar=g?[4,6]:t==="baixo"?[2,3]:[3,4];
  add(2,"98458",2*(bar[0]+bar[1])*2.4,"Barracão de obra "+bar.join("×")+" m — paredes");
  add(2,"92543",bar[0]*bar[1]*1.1,"Barracão — trama da cobertura");
  add(2,"94207",bar[0]*bar[1]*1.1,"Barracão — telha fibrocimento");
  add(2,"94992",bar[0]*bar[1],"Barracão — piso");
  add(2,"98458",(Q.frente||8)*2.2,"Tapume na frente do lote");
  add(2,"101501",1,"Ligação provisória de energia");
  add(2,"95648",1,"Ligação provisória de água (cavalete)");
  add(2,"103689",g?6:3,"Placa de obra");
  add(2,"99059",Q.Pext1+8,"Locação da obra (gabarito)");
  I.push({e:2,c:"VERBA-ART",q:1,o:"Taxa de ART de execução (CREA-AM) — valor de referência, conferir tabela vigente",v:270});
  // 3 Movimento de terra
  add(3,"97083",Q.Ap,"Compactação do terreno sob o piso");
  add(3,"94319",Q.Ap*.15,"Aterro interno 15 cm");
  // 4 Fundações
  add(4,"96527",Q.Escb,"Escavação de vala do baldrame");
  add(4,"96523",Q.Escs,"Escavação das sapatas ("+Q.Np+" un)");
  add(4,"96617",Q.Lastro,"Lastro de concreto magro 3 cm sob sapatas");
  add(4,"96542",Q.Lb*2*.3,"Fôrma do baldrame");
  add(4,"104918",Q.Vb*80,"Aço do baldrame (80 kg/m³)");
  add(4,"104919",Q.Vs*50,"Aço das sapatas (50 kg/m³)");
  add(4,"96555",Q.Vb,"Concreto do baldrame");
  add(4,"96556",Q.Vs,"Concreto das sapatas");
  add(4,"93382",Math.max(0,Q.Escb+Q.Escs-Q.Vb-Q.Vs),"Reaterro compactado");
  // 5 Estrutura
  add(5,"92419",Q.Fp,"Fôrma dos pilares");
  add(5,"92761",Q.Vp*100,"Aço dos pilares (100 kg/m³)");
  add(5,"103669",Q.Vp,"Concreto dos pilares");
  add(5,"92455",Q.Fv,"Fôrma das vigas");
  add(5,"92762",Q.Vv*90,"Aço das vigas (90 kg/m³)");
  add(5,"103674",Q.Vv,"Concreto das vigas");
  if(Q.n>1){add(5,"92419",12*(Q.n-1),"Escada — fôrma");add(5,"95946",150*(Q.n-1),"Escada — aço");add(5,"103686",1.5*(Q.n-1),"Escada — concreto")}
  add(5,"106056",Q.Alaje,inp.tipo==="alto"?"Laje pré-moldada treliçada (pisos superiores e laje de cobertura)":"Laje pré-moldada treliçada (pavimentos superiores)");
  if(g){add(5,"100378",Q.aco,"Tesouras de aço (12 kg/m²)");add(5,"104314",Q.terca,"Terças de aço (6 kg/m²)");add(5,"100744",(Q.aco+Q.terca)*.03*2,"Pintura esmalte da estrutura metálica (2 demãos)")}
  // 6 Alvenaria
  add(6,g?"103368":"103328",Q.Alv,g?"Alvenaria 14 cm até 3,0 m":"Alvenaria de vedação 9 cm");
  add(6,"105022",(Q.nPort*.8+Q.Ljan)+Q.nPort*.6+(Q.Ljan?(Q.nBan+Q.Ajan/1.5)*.6:0),"Vergas");
  add(6,"105028",Q.Ljan+(Q.Ajan/1.5+Q.nBan)*.6,"Contravergas");
  if(g)add(6,"94213",Math.max(0,Q.Pext1*(Q.h-3)),"Fechamento lateral em telha metálica acima de 3 m");
  // 7 Cobertura
  add(7,S("trama"),Q.Acob,"Estrutura de madeira do telhado");
  add(7,S("telha"),Q.Acob,"Telhamento");
  add(7,S("cumeeira"),Q.Lcum,"Cumeeira");
  if(t!=="baixo")add(7,"94231",Q.Pext1*.5,"Rufos em chapa galvanizada");
  // 8 Impermeabilização
  add(8,"98557",Q.Lb*.75,"Baldrame — emulsão asfáltica");
  add(8,"98555",Q.Awet+Q.Pwet*.3,"Áreas molhadas — argamassa polimérica");
  // 9 Elétrica
  add(9,"101501",1,"Entrada de energia");
  add(9,Q.Ac>150?"101883":"101875",1,"Quadro de distribuição");
  add(9,"91996",Q.Tm,"Tomadas");
  add(9,"91953",Q.Im,"Interruptores");
  add(9,"91854",(Q.Tm+Q.Im+Q.Lu)*6,"Eletrodutos");
  add(9,"91926",(Q.Tm+Q.Im+Q.Lu)*18,"Cabos 2,5 mm²");
  add(9,"96985",3,"Hastes de aterramento");add(9,"98111",1,"Caixa de inspeção do aterramento");
  add(9,"100860",Q.nBan,"Chuveiros elétricos");
  if(t==="medio")add(9,"103247",Q.nDorm,"Ar-condicionado split 12.000 BTU/h (dormitórios)");
  if(t==="alto"){add(9,"103247",Q.nDorm+Q.nSala,"Ar-condicionado split 12.000 BTU/h (dormitórios e salas)");add(10,"103520",1,"Aquecimento solar 400 L")}
  // 10 Hidrossanitário
  add(10,"95648",1,"Cavalete de entrada de água");
  add(10,"89356",Q.Pa*6,"Água fria — tubo PVC 25 mm");
  add(10,"89711",Q.Pa*3,"Esgoto — tubo DN 40");
  add(10,"89714",Q.nBan*6+Q.Pext1*.5,"Esgoto — tubo DN 100");
  add(10,"104328",Q.nWet,"Caixas sifonadas");
  add(10,"94495",Q.nWet,"Registros de gaveta");
  add(10,"102623",Math.max(1,Math.round(Q.Ac/100)),"Caixa d'água 1000 L");
  add(10,"98102",1,"Caixa de gordura");
  // 11 Revestimentos
  add(11,"87879",Q.RebInt,"Chapisco interno");
  add(11,"87905",Q.RebExt,"Chapisco externo");
  add(11,"87529",Q.RebInt,"Massa única interna");
  add(11,"87775",Q.RebExt,"Emboço/massa única externa");
  if(t==="alto")add(11,"104588",Q.RebExt*.3,"Revestimento cerâmico de fachada (30% da fachada)");
  add(11,S("parede"),Q.Ceram,"Cerâmica de parede nas áreas molhadas");
  // 12 Pisos
  if(g){const Aprod=Q.Aamb-Q.Aforro;add(12,"103915",Aprod,"Piso industrial de concreto armado 15 cm");add(12,"97097",Aprod,"Acabamento polido");add(12,"95241",Q.Aforro,"Lastro 5 cm (áreas de apoio)");add(12,"87620",Q.Aforro,"Contrapiso (áreas de apoio)");add(12,"87251",Q.Aforro,"Piso cerâmico (áreas de apoio)")}
  else{add(12,"95241",Q.Ap,"Lastro de concreto magro 5 cm (térreo)");add(12,"87620",Q.Aamb,"Contrapiso");add(12,S("piso"),Q.Aamb,"Piso");add(12,S("rodape"),Q.Pseco,"Rodapé")}
  if(t!=="baixo"&&!g)add(12,"98689",Q.nPort*.85,"Soleiras em granito");
  // 13 Forro
  add(13,S("forro"),Q.Aforro,"Forro");
  // 14 Esquadrias
  add(14,S("portaInt"),Q.nPortInt-Q.nBan,"Portas internas 80×210");
  add(14,t==="baixo"?"91328":"90788",Q.nBan,"Portas de banheiro");
  add(14,g?"106146":"90844",Q.nPortExt,"Portas externas");
  add(14,g?"100702":"94570",Q.Ajan,g?"Esquadrias de alumínio (área de produção/escritório)":"Janelas de alumínio de correr");
  if(t==="alto")add(14,"100702",Q.nSalaE*5,"Portas de correr de alumínio e vidro (salas/varandas)");
  add(14,"94569",Q.Amax,"Basculantes/maxim-ar dos banheiros");
  // 15 Pintura
  const Ain=Math.max(0,Q.RebInt-Q.Ceram);
  add(15,"88485",Ain+Q.RebExt,"Selador acrílico (paredes)");
  if(t!=="baixo")add(15,"88497",Ain,"Massa látex nas paredes internas");
  add(15,S("latex"),Ain,"Pintura látex paredes internas");
  add(15,"88417",Q.RebExt,"Textura acrílica nas fachadas");
  if(S("latexTeto"))add(15,S("latexTeto"),t==="galpao"?Q.Aforro:Q.Aforro,"Pintura de teto/forro");
  // 16 Louças e metais
  add(16,S("bacia"),Q.nBan,"Bacias sanitárias");
  add(16,t==="alto"?"86895":"86942",Q.nBan,t==="alto"?"Bancadas de granito de lavatório":"Lavatórios");
  add(16,"86906",Q.nBan,"Torneiras de lavatório");
  if(t==="alto"){add(16,"86936",Q.nBan,"Cubas de embutir");add(16,"106780",1,"Bancada de granito 2,00 m (banho master)");add(6,"101164",Q.nBan*1.0,"Bloco de vidro canelado nos banheiros (1 m² por banho)")}
  add(16,"93441",Q.nCoz,"Bancada de cozinha com cuba e torneira");
  add(16,S("tanque"),Q.nServ,"Tanque");
  // 17 Muro e área externa
  if(Q.Amuro>0){const Lm=Q.Lmuro,np=UP(Lm/3)+1;
    add(17,"96527",Lm*.4*.4,"Muro — escavação");
    add(17,"104918",Lm*.15*.3*80+np*Q.hm*4*.4,"Muro — aço baldrame e pilaretes");
    add(17,"96542",Lm*.6,"Muro — fôrma do baldrame");
    add(17,"96555",Lm*.15*.3,"Muro — concreto do baldrame");
    add(17,"92419",np*Q.hm*.56,"Muro — fôrma dos pilaretes");
    add(17,"103669",np*Q.hm*.14*.14,"Muro — concreto dos pilaretes");
    add(17,"103368",Q.Amuro,"Muro — alvenaria 14 cm");
    add(17,"87905",Q.Amuro*2,"Muro — chapisco 2 faces");
    add(17,"87775",Q.Amuro*2,"Muro — reboco 2 faces");
    add(17,"104641",Q.Amuro*2,"Muro — pintura 2 faces")}
  add(17,"94992",Q.Pext1*(g?1:.8),"Calçada de proteção");
  // 18 Limpeza final
  add(18,"99803",Q.Aamb+Q.Pext1*(g?1:.8),"Limpeza de pisos");
  add(18,"99806",Q.Ceram,"Limpeza de revestimentos");
  return I;
}
export function orcar(inp){
  const Q=quantitativos(inp),reg=inp.regime==="d"?3:2,bdi=(+inp.bdi||0)/100;
  const L=itens(inp,Q).map(x=>{const s=SINAPI.c[x.c];
    const desc=s?s[0]:x.o,u=s?s[1]:"VB",pu=s?(s[reg]??s[2]):x.v;
    const q=Math.round(x.q*100)/100;return {...x,q,desc,u,pu,tot:Math.round(q*pu*100)/100}}).filter(x=>x.pu>0);
  const etapas=ETAPAS.map((nome,i)=>{const it=L.filter(x=>x.e===i+1);return{n:i+1,nome,itens:it,sub:it.reduce((s,x)=>s+x.tot,0)}}).filter(e=>e.itens.length);
  etapas.forEach(e=>e.itens.forEach((x,k)=>x.item=e.n+"."+(k+1)));
  const direto=etapas.reduce((s,e)=>s+e.sub,0),vbdi=direto*bdi,total=direto+vbdi;
  const cub=Q.T.cub?CUB[Q.T.cub]:null;
  const base0=etapas.filter(e=>e.n!==4&&e.n!==17).reduce((s,e)=>s+e.sub,0);let ajuste=0;
  if(cub&&inp.calibrar!==false){ajuste=Math.round((cub*Q.Ac-base0)*100)/100;const it={e:19,c:"VERBA-CUB",q:1,desc:`Ajuste de padrão (calibração CUB-AM ${Q.T.cub} ${CUB.ref}: ${cub.toLocaleString("pt-BR",{minimumFractionDigits:2})}/m² × ${Q.Ac.toFixed(2)} m² − base comparável)`,u:"VB",pu:ajuste,tot:ajuste,item:"19.1",o:"Cobre acabamentos e itens não representados nas composições SINAPI"};etapas.push({n:19,nome:ETAPAS[18],itens:[it],sub:ajuste})}
  const direto2=etapas.reduce((s,e)=>s+e.sub,0),vbdi2=direto2*bdi,total2=direto2+vbdi2;
  return{Q,etapas,base0,ajuste,semAjuste:{direto,total,m2:total/Q.Ac},direto:direto2,bdi:vbdi2,total:total2,m2:total2/Q.Ac,m2dir:direto2/Q.Ac,cub,cubCod:Q.T.cub,ref:SINAPI.ref,regime:inp.regime==="d"?"Desonerado":"Não desonerado"};
}
