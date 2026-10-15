// Ferramentas de pré-dimensionamento — FSantos Engenharia
// Regras práticas (NBR 6118/6122/8800 simplificadas). Resultados orientativos.
const E_ACO=200000; // MPa
// Perfis W (aprox., base catálogo Gerdau — conferir catálogo): A cm², Ix cm4, Zx cm3, rx cm, ry cm, kg/m
const PERFIS_W=[["W150x13,0",13,16.6,635,96.4,6.18,2.22],["W150x18,0",18,23.4,939,139.4,6.34,2.32],["W200x15,0",15,19.4,1305,147.9,8.2,2.12],["W250x17,9",17.9,23.1,2291,211,9.96,1.99],["W200x19,3",19.3,25.1,1686,190.6,8.19,2.18],["W310x21,0",21,27.2,3776,291.9,11.77,1.9],["W150x22,5",22.5,29,1229,179.6,6.51,3.65],["W200x22,5",22.5,29,2029,225.5,8.37,2.22],["W250x25,3",25.3,32.6,3473,317.3,10.31,2.22],["W200x26,6",26.6,34.2,2611,282.3,8.73,3.1],["W150x29,8",29.8,38.5,1739,247.5,6.72,3.8],["W250x32,7",32.7,42.1,4937,428.5,10.83,3.35],["W310x32,7",32.7,42.1,6570,485.3,12.49,1.94],["W360x32,9",32.9,42.1,8358,547.6,14.09,2.63],["W200x35,9",35.9,45.7,3437,379.2,8.67,3.69],["W310x38,7",38.7,49.7,8581,615.4,13.14,3.82],["W410x38,8",38.8,50.3,12777,736.8,15.94,2.83],["W360x44,0",44,57.7,12258,784.3,14.58,3.77],["W250x44,8",44.8,57.6,7158,622.1,11.15,3.86],["W200x46,1",46.1,58.6,4543,495.3,8.81,5.12],["W310x52,0",52,67,11909,842.5,13.33,4.95],["W460x52,0",52,66.6,21370,1095.9,17.91,3.96],["W410x53,0",53,68.4,18734,1052.2,16.55,3.84],["W460x68,0",68,87.6,29851,1495.4,18.46,4.06],["W250x73,0",73,92.7,11257,983,11.02,6.48]].map(([n,kg,A,Ix,Zx,rx,ry])=>({n,kg,A,Ix,Zx,rx,ry})).sort((a,b)=>a.kg-b.kg);
// Tubos quadrados (aprox.): A cm², r cm, kg/m
const TUBOS=[["□50x50x3",4.4,5.61,1.91],["□60x60x3",5.3,6.81,2.31],["□70x70x4",8.2,10.4,2.68],["□80x80x4",9.4,12.0,3.07],["□100x100x4",11.9,15.2,3.88],["□100x100x6,3",18.2,23.2,3.80],["□150x150x6,3",28.1,35.8,5.85]].map(([n,kg,A,r])=>({n,kg,A,r}));
// Estacas: capacidade admissível típica (kN) — editável
const ESTACAS={"Strauss Ø25 cm":[25,200],"Strauss Ø32 cm":[32,300],"Escavada Ø30 cm":[30,250],"Hélice contínua Ø30 cm":[30,400],"Hélice contínua Ø40 cm":[40,700],"Pré-moldada 20×20 cm":[20,300],"Pré-moldada 25×25 cm":[25,450]};
// Laje treliçada: vão máximo (m) por sobrecarga (kN/m²) — indicativo, confirmar com fabricante
const TRELICADA={cargas:[1.5,3,5],linhas:[["H8 (h=12 cm)",4.0,3.5,3.0],["H12 (h=16 cm)",5.0,4.5,4.0],["H16 (h=20 cm)",6.0,5.5,5.0],["H20 (h=25 cm)",7.0,6.5,6.0],["H25 (h=30 cm)",8.0,7.5,6.5]]};

const f=(n,d=2)=>(+n).toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d});
const up=(x,s)=>Math.ceil(x/s-1e-9)*s;
const chi=l=>l<=1.5?Math.pow(0.658,l*l):0.877/(l*l);

const TOOLS=[
{id:"sapata",g:"Concreto armado",t:"Sapata isolada",refs:["ABNT NBR 6122:2019 — Projeto e execução de fundações","ABNT NBR 6118:2023 — item 22.6 (sapatas rígidas)"],
 inp:[["N","Carga do pilar (característica)","kN",600],["s","Tensão admissível do solo σadm","kPa",200],["a","Pilar — dimensão a (maior)","cm",40],["b","Pilar — dimensão b (menor)","cm",20],["k","Acréscimo p/ peso próprio","—",1.05,1,1.3]],
 hip:["Carga centrada, sem momentos.","Abas iguais nas duas direções: L − a = B − b.","Sapata rígida: h ≥ (L − a)/3; altura mínima adotada 25 cm.","Dimensões arredondadas para múltiplos de 5 cm."],
 calc(v){const A=v.k*v.N/v.s,a=v.a/100,b=v.b/100,d=a-b;let B=(-d+Math.sqrt(d*d+4*A))/2;B=up(B*100,5);let L=up(B+v.a-v.b,5);if(L<v.a)L=v.a;const h=Math.max(25,up((L-v.a)/3,5)),sig=v.k*v.N/(B*L/1e4);
  return{steps:[["Área necessária","A = k·N / σadm",`${f(v.k)}×${f(v.N,0)}/${f(v.s,0)} = ${f(A,3)} m²`],["Menor lado (abas iguais)","B = [−(a−b) + √((a−b)² + 4A)]/2",`B = ${f(B,0)} cm (arred.)`],["Maior lado","L = B + (a − b)",`L = ${f(L,0)} cm`],["Altura (rígida)","h ≥ (L − a)/3 ; h ≥ 25 cm",`h = ${f(h,0)} cm`],["Verificação","σ = k·N/(B·L) ≤ σadm",`${f(sig,1)} kPa ${sig<=v.s?"≤":">"} ${f(v.s,0)} kPa`]],
  res:[["Sapata B × L",`${f(B,0)} × ${f(L,0)} cm`],["Altura h",`${f(h,0)} cm`],["Área",`${f(B*L/1e4,2)} m²`],["Tensão aplicada",`${f(sig,1)} kPa`]],warn:v.a<v.b?["Informe a ≥ b."]:[]}}},
{id:"radier",g:"Concreto armado",t:"Radier",refs:["ABNT NBR 6122:2019","ABNT NBR 6118:2023"],
 inp:[["N","Carga total da edificação (característica)","kN",3000],["A","Área do radier","m²",120],["s","Tensão admissível do solo σadm","kPa",100],["l","Maior vão entre pilares/paredes","m",4]],
 hip:["Radier liso, carregamento aproximadamente uniforme.","Espessura por regra prática h ≈ L/25 (faixa usual L/20 a L/30), mínimo 15 cm.","Peso específico do concreto armado: 25 kN/m³."],
 calc(v){const h=Math.max(15,up(v.l*100/25,1)),pp=25*h/100,sm=v.N/v.A+pp;
  return{steps:[["Espessura estimada","h = máx(L/25 ; 15 cm)",`${f(v.l*100/25,1)} cm → h = ${f(h,0)} cm`],["Peso próprio","pp = 25 · h",`${f(pp,2)} kPa`],["Tensão média","σm = N/A + pp",`${f(v.N,0)}/${f(v.A,1)} + ${f(pp,2)} = ${f(sm,1)} kPa`],["Verificação","σm ≤ σadm",`${f(sm,1)} ${sm<=v.s?"≤":">"} ${f(v.s,0)} kPa → ${sm<=v.s?"OK":"NÃO ATENDE"}`]],
  res:[["Espessura h",`${f(h,0)} cm`],["Tensão média",`${f(sm,1)} kPa`],["Aproveitamento",`${f(100*sm/v.s,0)} %`]],warn:sm>v.s?["Tensão média acima da admissível: aumentar área, reduzir cargas ou adotar outra fundação."]:[]}}},
{id:"estacas",g:"Concreto armado",t:"Estacas e bloco",refs:["ABNT NBR 6122:2019","ABNT NBR 6118:2023 — blocos sobre estacas (22.7)","Blévot & Frémy (1967) — método das bielas"],
 inp:[["N","Carga do pilar (característica)","kN",900],["tipo","Tipo de estaca","",Object.keys(ESTACAS)[3],null,null,Object.keys(ESTACAS)],["Q","Capacidade admissível por estaca","kN",ESTACAS["Hélice contínua Ø30 cm"][1]],["phi","Diâmetro/lado da estaca","cm",30],["a","Maior dimensão do pilar","cm",40],["k","Acréscimo p/ peso do bloco","—",1.1,1,1.5]],
 hip:["Capacidades típicas — substituir pelo valor de projeto geotécnico (sondagem SPT).","Espaçamento entre eixos s = 3φ; distância eixo–borda ≈ φ/2 + 15 cm.","Bloco rígido: d ≥ 0,5·(s − a/2) (2 estacas, Blévot); h = d + 10 cm, mínimo 40 cm."],
 calc(v){const n=Math.max(1,Math.ceil(v.k*v.N/v.Q-1e-9)),phi=v.phi,s=3*phi,e=phi/2+15;let dim;
  if(n==1)dim=[phi+30,phi+30];else if(n==2)dim=[s+2*e,2*e];else if(n==3)dim=[s+2*e,s*0.866+2*e];else if(n==4)dim=[s+2*e,s+2*e];else{const c=Math.ceil(Math.sqrt(n)),r=Math.ceil(n/c);dim=[(c-1)*s+2*e,(r-1)*s+2*e]}
  dim=dim.map(x=>up(x,5));const d=Math.max(30,0.5*(s-v.a/2)),h=Math.max(40,up(d+10,5));
  return{steps:[["Nº de estacas","n = k·N / Qadm",`${f(v.k)}×${f(v.N,0)}/${f(v.Q,0)} = ${f(v.k*v.N/v.Q,2)} → n = ${n}`],["Espaçamento","s = 3·φ",`${f(s,0)} cm`],["Bloco em planta","conforme arranjo de ${n} estaca(s)",`${dim[0]} × ${dim[1]} cm`],["Altura do bloco","d ≥ 0,5(s − a/2); h = d + 10",`h = ${h} cm`],["Carga por estaca","Ne = k·N/n",`${f(v.k*v.N/n,0)} kN ≤ ${f(v.Q,0)} kN`]],
  res:[["Estacas",`${n} × ${v.tipo}`],["Bloco (planta)",`${dim[0]} × ${dim[1]} cm`],["Altura do bloco",`${h} cm`]],warn:n==1?["Estaca única: prever vigas de travamento nas duas direções."]:n==2?["Bloco de 2 estacas: travar na direção perpendicular."]:[]}}},
{id:"pilar",g:"Concreto armado",t:"Pilar de concreto",refs:["ABNT NBR 6118:2023 — 13.2.3 (dimensão mínima 19 cm; área ≥ 360 cm²)","Pinheiro, L. M. — Fundamentos do Concreto e Projeto de Edifícios (EESC-USP)"],
 inp:[["Ai","Área de influência","m²",16],["q","Carga média por pavimento","kN/m²",12],["np","Nº de pavimentos acima (incl. cobertura)","",3,1,60],["fck","fck do concreto","MPa",30,20,90],["pos","Posição do pilar","","Intermediário (α=1,3)",null,null,["Intermediário (α=1,3)","Extremidade (α=1,5)","Canto (α=1,8)"]]],
 hip:["Nk = Ai · q · nº pav.; γf = 1,4.","α majora o efeito de flexão conforme a posição (1,3 / 1,5 / 1,8).","σid = 0,85·fcd + ρ·σs, com ρ = 1% e σs = 420 MPa.","Dimensão mínima 19 cm e Ac ≥ 360 cm² (NBR 6118, 13.2.3)."],
 calc(v){const al={"Intermediário (α=1,3)":1.3,"Extremidade (α=1,5)":1.5,"Canto (α=1,8)":1.8}[v.pos],Nk=v.Ai*v.q*v.np,sid=(0.85*v.fck/1.4+0.01*420)/10,Ac=Math.max(360,al*1.4*Nk/sid);
  let b=19,h=Math.max(19,up(Ac/b,5));if(h>4*b){b=up(Math.sqrt(Ac),5);h=b}
  return{steps:[["Carga característica","Nk = Ai · q · n",`${f(v.Ai,1)}×${f(v.q,1)}×${v.np} = ${f(Nk,0)} kN`],["Tensão ideal","σid = 0,85·fck/1,4 + 0,01·420",`${f(sid,3)} kN/cm²`],["Área de concreto","Ac = α·1,4·Nk / σid ; ≥ 360 cm²",`${f(al,1)}×1,4×${f(Nk,0)}/${f(sid,3)} = ${f(al*1.4*Nk/sid,0)} cm² → ${f(Ac,0)} cm²`],["Seção sugerida","b ≥ 19 cm ; h = Ac/b (múlt. 5)",`${b} × ${h} cm = ${b*h} cm²`]],
  res:[["Nk",`${f(Nk,0)} kN`],["Ac necessária",`${f(Ac,0)} cm²`],["Seção sugerida",`${b} × ${h} cm`]],warn:[]}}},
{id:"viga",g:"Concreto armado",t:"Viga de concreto",refs:["ABNT NBR 6118:2023 — 13.2.2 (bw ≥ 12 cm)","Regras práticas de pré-dimensionamento (h/L)"],
 inp:[["L","Vão livre","m",5],["tipo","Tipo de vão","","Biapoiada (L/10)",null,null,["Biapoiada (L/10)","Contínua — tramo interno (L/12)","Contínua — tramo extremo (L/11)","Balanço (L/5)"]],["bw","Largura bw","cm",14,12,60]],
 hip:["Altura por relação vão/altura usual; arredondada para múltiplo de 5 cm, mínimo 25 cm.","bw ≥ 12 cm (NBR 6118, 13.2.2); usual igual à espessura da alvenaria."],
 calc(v){const r={"Biapoiada (L/10)":10,"Contínua — tramo interno (L/12)":12,"Contínua — tramo extremo (L/11)":11,"Balanço (L/5)":5}[v.tipo],h0=v.L*100/r,h=Math.max(25,up(h0,5));
  return{steps:[["Altura estimada",`h ≈ L/${r}`,`${f(v.L*100,0)}/${r} = ${f(h0,1)} cm`],["Arredondamento","múltiplo de 5 cm ; ≥ 25 cm",`h = ${h} cm`],["Largura","bw ≥ 12 cm",`bw = ${f(v.bw,0)} cm`]],
  res:[["Seção sugerida",`${f(v.bw,0)} × ${h} cm`]],warn:v.bw<12?["bw menor que 12 cm não é permitido (NBR 6118)."]:[]}}},
{id:"laje",g:"Concreto armado",t:"Laje maciça",refs:["ABNT NBR 6118:2023 — 13.2.4.1 (espessuras mínimas)","Pinheiro, L. M. — estimativa d = (2,5 − 0,1n)·ℓ*"],
 inp:[["lx","Menor vão lx","m",4],["ly","Maior vão ly","m",5],["n","Nº de bordas engastadas (0 a 4)","",1,0,4],["uso","Uso","","Piso (não balanço) — mín. 8 cm",null,null,["Cobertura (não balanço) — mín. 7 cm","Piso (não balanço) — mín. 8 cm","Laje em balanço — mín. 10 cm","Veículos até 30 kN — mín. 10 cm","Veículos acima de 30 kN — mín. 12 cm"]]],
 hip:["d ≈ (2,5 − 0,1·n)·ℓ*/100, com ℓ* = mín(lx ; 0,7·ly).","h = d + 3 cm (cobrimento + meia barra), arredondado ao cm.","λ = ly/lx > 2 → laje armada em uma direção."],
 calc(v){if(v.ly<v.lx)[v.lx,v.ly]=[v.ly,v.lx];const ls=Math.min(v.lx,0.7*v.ly)*100,d=(2.5-0.1*v.n)*ls/100,mn=+v.uso.match(/(\d+) cm/)[1],h=Math.max(mn,Math.ceil(d+3)),lam=v.ly/v.lx;
  return{steps:[["Vão de referência","ℓ* = mín(lx ; 0,7·ly)",`${f(ls,0)} cm`],["Altura útil","d = (2,5 − 0,1·n)·ℓ*/100",`(2,5 − 0,1×${v.n})×${f(ls,0)}/100 = ${f(d,1)} cm`],["Espessura","h = d + 3 ≥ h mín",`${f(d+3,1)} cm ; mín ${mn} cm → h = ${h} cm`],["Relação de vãos","λ = ly/lx",`${f(lam,2)} → ${lam>2?"armada em uma direção":"armada em cruz"}`]],
  res:[["Espessura h",`${h} cm`],["Tipo",lam>2?"Armada em uma direção":"Armada em cruz"]],warn:[]}}},
{id:"trelicada",g:"Concreto armado",t:"Laje treliçada",refs:["ABNT NBR 14859 — lajes pré-fabricadas","Tabelas de fabricantes (valores indicativos)"],table:true,
 inp:[["L","Vão (na direção das vigotas)","m",4.5],["q","Sobrecarga + revestimento","kN/m²",2]],
 hip:["Tabela de vãos máximos indicativa e editável — confirmar com o fabricante da treliça.","Sobrecarga enquadrada na faixa imediatamente superior da tabela.","Vãos acima de ~4 m: prever nervura de travamento transversal."],
 calc(v){const T=TRELICADA,ci=T.cargas.findIndex(c=>v.q<=c);if(ci<0)return{steps:[],res:[["Resultado","Sobrecarga acima da tabela"]],warn:["Sobrecarga maior que a máxima tabelada: consultar fabricante."]};
  const row=T.linhas.find(r=>r[ci+1]>=v.L);
  return{steps:[["Faixa de carga","q ≤ "+f(T.cargas[ci],1)+" kN/m²",`coluna ${ci+1} da tabela`],["Seleção","menor altura com vão máx ≥ L",row?`${row[0]} (vão máx ${f(row[ci+1],1)} m ≥ ${f(v.L,2)} m)`:"nenhuma"]],
  res:[["Laje recomendada",row?row[0]:"Vão acima da tabela"]],warn:row?(v.L>4?["Prever nervura de travamento."]:[]):["Vão acima dos tabelados: consultar fabricante ou adotar laje maciça/protendida."]}}},
{id:"pilar-aco",g:"Estrutura metálica",t:"Pilar metálico",refs:["ABNT NBR 8800:2008 — 5.3 (compressão), curva χ","Catálogo de perfis W (Gerdau) — propriedades aproximadas"],
 inp:[["N","Carga axial (característica)","kN",400],["L","Comprimento de flambagem (K·L)","m",3.5],["fy","Aço fy","MPa","345 (ASTM A572 Gr.50)",null,null,["250 (ASTM A36)","345 (ASTM A572 Gr.50)"]]],
 hip:["Compressão centrada; Nsd = 1,4·N; γa1 = 1,10.","Mesma K·L nos dois eixos; flambagem pelo eixo de menor raio (ry).","Q = 1 (sem flambagem local) — verificar no projeto.","χ = 0,658^(λ0²) se λ0 ≤ 1,5; χ = 0,877/λ0² caso contrário; esbeltez KL/r ≤ 200."],
 calc(v){const fy=parseInt(v.fy),Nsd=1.4*v.N,KL=v.L*100;const ok=PERFIS_W.map(p=>{const l0=(KL/p.ry)/Math.PI*Math.sqrt(fy/E_ACO),c=chi(l0),Nrd=c*p.A*fy/10/1.1;return{...p,l0,c,Nrd,es:KL/p.ry}}).filter(p=>p.Nrd>=Nsd&&p.es<=200);const p=ok[0];
  const Areq0=Nsd*1.1/(fy/10);
  return{steps:[["Esforço de cálculo","Nsd = 1,4·N",`${f(Nsd,1)} kN`],["Área mínima (χ = 1)","A ≥ Nsd·γa1 / fy",`${f(Areq0,1)} cm²`],...(p?[["Esbeltez","λ = KL/ry",`${f(KL,0)}/${f(p.ry,2)} = ${f(p.es,0)} ≤ 200`],["Índice de esbeltez reduzido","λ0 = (KL/r)/π·√(fy/E)",f(p.l0,3)],["Fator de redução","χ (NBR 8800, 5.3.3)",f(p.c,3)],["Resistência","Nrd = χ·A·fy/γa1",`${f(p.c,3)}×${f(p.A,1)}×${f(fy/10,1)}/1,1 = ${f(p.Nrd,1)} kN ≥ ${f(Nsd,1)}`]]:[])],
  res:[["Perfil sugerido",p?`${p.n} (${f(p.kg,1)} kg/m)`:"Nenhum perfil da tabela atende"],["Área necessária (χ do perfil)",p?`${f(Nsd*1.1/(p.c*fy/10),1)} cm²`:"—"]],warn:p?[]:["Aumentar a tabela de perfis ou reduzir o comprimento de flambagem."]}}},
{id:"viga-aco",g:"Estrutura metálica",t:"Viga metálica",refs:["ABNT NBR 8800:2008 — 5.4 (flexão) e Anexo C (deslocamento L/350)","Catálogo de perfis W (Gerdau) — propriedades aproximadas"],
 inp:[["L","Vão (biapoiada)","m",6],["q","Carga distribuída (característica, total)","kN/m",12],["fy","Aço fy","MPa","345 (ASTM A572 Gr.50)",null,null,["250 (ASTM A36)","345 (ASTM A572 Gr.50)"]]],
 hip:["Viga biapoiada, carga uniforme; Msd = 1,4·q·L²/8; γa1 = 1,10.","Seção compacta e travada lateralmente (Mrd = Zx·fy/γa1) — sem FLT/FLM/FLA.","Flecha com carga característica: δ = 5qL⁴/(384EI) ≤ L/350. Cortante não verificado."],
 calc(v){const fy=parseInt(v.fy),M=1.4*v.q*v.L*v.L/8,Zr=M*100*1.1/(fy/10),dl=v.L*1000/350,Ir=5*v.q*Math.pow(v.L*1000,4)/(384*E_ACO*dl)/1e4,p=PERFIS_W.find(p=>p.Zx>=Zr&&p.Ix>=Ir),de=p?5*v.q*Math.pow(v.L*1000,4)/(384*E_ACO*p.Ix*1e4):0;
  return{steps:[["Momento de cálculo","Msd = 1,4·q·L²/8",`${f(M,2)} kN·m`],["Módulo plástico necessário","Zx ≥ Msd·γa1/fy",`${f(Zr,1)} cm³`],["Flecha limite","δlim = L/350",`${f(dl,1)} mm`],["Inércia necessária","Ix ≥ 5qL⁴/(384·E·δlim)",`${f(Ir,0)} cm⁴`],...(p?[["Perfil adotado",p.n,`Zx = ${f(p.Zx,1)} cm³ ; Ix = ${f(p.Ix,0)} cm⁴`],["Flecha do perfil","δ = 5qL⁴/(384EI)",`${f(de,1)} mm ≤ ${f(dl,1)} mm`]]:[])],
  res:[["Mmax (cálculo)",`${f(M,1)} kN·m`],["Zx necessário",`${f(Zr,0)} cm³`],["Ix necessário",`${f(Ir,0)} cm⁴`],["Perfil sugerido",p?`${p.n} (${f(p.kg,1)} kg/m)`:"Nenhum perfil da tabela atende"]],warn:p?[]:["Vão/carga acima da tabela."]}}},
{id:"trelica",g:"Estrutura metálica",t:"Treliça metálica",refs:["ABNT NBR 8800:2008 — tração (5.2) e compressão (5.3)","Regra prática de altura h ≈ L/10 a L/15"],
 inp:[["L","Vão","m",15],["q","Carga distribuída (característica)","kN/m",6],["r","Relação altura/vão","","L/12",null,null,["L/10","L/12","L/15"]],["p","Comprimento do painel (entre nós)","m",1.5],["fy","Aço fy","MPa","300 (tubos)",null,null,["250 (ASTM A36)","300 (tubos)","345 (ASTM A572 Gr.50)"]]],
 hip:["Treliça biapoiada (banzos paralelos), carga uniforme; esforços de cálculo γf = 1,4.","Força nos banzos ≈ Msd/h; diagonal mais solicitada ≈ Vsd/sen θ.","Banzo superior e diagonal comprimidos com comprimento de flambagem = painel / diagonal; χ NBR 8800, Q = 1.","Seções em tubo quadrado (propriedades aproximadas)."],
 calc(v){const fy=parseInt(v.fy),rr=parseInt(v.r.slice(2)),h=v.L/rr,M=1.4*v.q*v.L*v.L/8,F=M/h,V=1.4*v.q*v.L/2,ld=Math.hypot(h,v.p),D=V*ld/h;
  const pick=(N,Lc)=>TUBOS.find(t=>{if(!Lc)return t.A*fy/10/1.1>=N;const es=Lc*100/t.r;if(es>200)return false;const l0=es/Math.PI*Math.sqrt(fy/E_ACO);return chi(l0)*t.A*fy/10/1.1>=N});
  const bs=pick(F,v.p),bi=pick(F,0),dg=pick(D,ld);
  return{steps:[["Altura da treliça",`h = L/${rr}`,`${f(h,2)} m`],["Momento máximo","Msd = 1,4·q·L²/8",`${f(M,1)} kN·m`],["Força nos banzos","F = Msd/h",`${f(F,1)} kN (sup. compressão / inf. tração)`],["Cortante no apoio","Vsd = 1,4·q·L/2",`${f(V,1)} kN`],["Diagonal","D = Vsd·ℓd/h ; ℓd = √(h² + p²)",`ℓd = ${f(ld,2)} m ; D = ${f(D,1)} kN`]],
  res:[["Altura",`${f(h,2)} m`],["Banzo superior (comp.)",bs?bs.n:"acima da tabela"],["Banzo inferior (tração)",bi?bi.n:"acima da tabela"],["Diagonal de apoio (comp.)",dg?dg.n:"acima da tabela"]],warn:[bs,bi,dg].some(x=>!x)?["Algum elemento excede a tabela de tubos: aumentar a altura ou usar perfis maiores."]:[]}}}
,
{id:"muro",g:"Contenções e pavimentos",t:"Muro de contenção / cortina de concreto",refs:["ABNT NBR 11682:2009 — Estabilidade de encostas (contenções)","ABNT NBR 6122:2019 — fundações profundas (estacas)","ABNT NBR 6118:2023 — concreto armado","Rankine (1857) — empuxo ativo; Marchetti (1980) — estacas sob carga horizontal (referência)"],
 inp:[["H","Altura de terra contida (acima do topo da sapata)","m",3,0.5,8],["gs","Peso específico do solo γ","kN/m³",18,12,23],["phi","Ângulo de atrito do solo φ","°",30,15,45],["q","Sobrecarga no terrapleno","kPa",10,0,100],["tt","Espessura da cortina no topo (≥ 20 cm)","cm",20,20,60],
  ["fil","Filas de estacas","","2 filas",null,null,["1 fila","2 filas"]],["tipo","Tipo de estaca","","Hélice contínua Ø40 cm",null,null,Object.keys(ESTACAS)],["d","Diâmetro/lado da estaca","cm",40,20,80],["s","Espaçamento entre estacas na fila","m",1.5,0.6,5],
  ["Qc","Capacidade admissível à compressão","kN",ESTACAS["Hélice contínua Ø40 cm"][1]],["Qt","Capacidade admissível à tração","kN",150,0,5000],["Qh","Capacidade admissível horizontal","kN",60,1,2000]],
 hip:["Muro cantilever (cortina) engastado em sapata corrida apoiada exclusivamente em estacas — sem verificação de tensão no solo sob a sapata (contato desprezado).","Empuxo ativo de Rankine, terrapleno horizontal, parâmetro liso, sem água (drenagem eficiente obrigatória): Ka = tg²(45° − φ/2).","Empuxo atuando até a base da sapata (Ht = H + h). Cálculo por metro linear de muro.","Cortina com topo ≥ 20 cm e base ≈ H/10 (mín. topo + 5 cm); sapata com ponta = 30% e talão = 70% do balanço; h ≥ 40 cm e ≥ φ + 15 cm.","2 filas: estacas a 3φ entre eixos (transversal), forças por meio de N = V/n ± M/e. 1 fila: a fila recebe a carga vertical; o momento deve ser absorvido pela flexão/engaste das estacas ou por tirantes — verificar no projeto.","Horizontal dividida igualmente entre as estacas (sem empuxo passivo na frente nem atrito sob a sapata).","Capacidades típicas e editáveis — substituir pelos valores do projeto geotécnico (SPT, provas de carga)."],
 calc(v){const r2=v.fil=="2 filas",phi=v.d/100,Ka=Math.pow(Math.tan((45-v.phi/2)*Math.PI/180),2),tt=v.tt/100,tb=Math.max(tt+0.05,up(v.H*100/10,5)/100),h=Math.max(0.40,up((v.d+15),5)/100),
  e=r2?3*phi:0,B=r2?Math.max(up((e+phi+0.40)*100,5)/100,tb+0.6):Math.max(up((phi+0.40)*100,5)/100,tb+0.30),bal=B-tb,toe=+(bal*0.3).toFixed(2),heel=+(B-tb-toe).toFixed(2),Ht=v.H+h;
  const Ea=0.5*Ka*v.gs*Ht*Ht,Eq=Ka*v.q*Ht,Hh=Ea+Eq,Mo=Ea*Ht/3+Eq*Ht/2;
  // x a partir do centro da sapata (positivo para o lado do aterro)
  const xw0=-B/2+toe,W1=25*tt*v.H,x1=xw0+tb-tt/2,W2=25*(tb-tt)/2*v.H,x2=xw0+(tb-tt)*2/3,W3=25*B*h,x3=0,W4=v.gs*v.H*heel,x4=B/2-heel/2,W5=v.q*heel,x5=x4;
  const V=W1+W2+W3+W4+W5,Mv=W1*x1+W2*x2+W3*x3+W4*x4+W5*x5,M=Mo-Mv;
  let Nf,Nb,s=v.s;if(r2){Nf=V/2+M/e;Nb=V/2-M/e}else{Nf=V;Nb=V}
  const np=r2?2:1,Pc=Math.max(Nf,Nb)*s,Pt=Math.min(Nf,Nb)<0?-Math.min(Nf,Nb)*s:0,Ph=Hh*s/np;
  const lim=[v.Qc/Math.max(Nf,Nb),Math.min(Nf,Nb)<0?(v.Qt>0?v.Qt/-Math.min(Nf,Nb):0):Infinity,v.Qh*np/Hh],ss=Math.min(3,Math.floor(Math.min(...lim)*20)/20),okc=Pc<=v.Qc,okt=Pt<=v.Qt,okh=Ph<=v.Qh;
  const r={steps:[["Coeficiente de empuxo ativo","Ka = tg²(45° − φ/2)",`tg²(45 − ${f(v.phi,0)}/2) = ${f(Ka,3)}`],["Dimensões iniciais","topo ≥ 20 cm; base ≈ H/10; h ≥ máx(40 ; φ+15) cm",`cortina ${f(tt*100,0)}→${f(tb*100,0)} cm; sapata B = ${f(B,2)} m × h = ${f(h*100,0)} cm (ponta ${f(toe,2)} m, talão ${f(heel,2)} m)`],
   ["Altura de cálculo","Ht = H + h",`${f(v.H,2)} + ${f(h,2)} = ${f(Ht,2)} m`],["Empuxo do solo","Ea = ½·Ka·γ·Ht²",`0,5×${f(Ka,3)}×${f(v.gs,1)}×${f(Ht,2)}² = ${f(Ea,2)} kN/m`],["Empuxo da sobrecarga","Eq = Ka·q·Ht",`${f(Ka,3)}×${f(v.q,1)}×${f(Ht,2)} = ${f(Eq,2)} kN/m`],
   ["Momento de tombamento (base)","Mo = Ea·Ht/3 + Eq·Ht/2",`${f(Mo,2)} kN·m/m`],["Cargas verticais","cortina + sapata + solo e sobrecarga sobre o talão",`${f(W1+W2,2)} + ${f(W3,2)} + ${f(W4+W5,2)} = ${f(V,2)} kN/m`],["Momento resultante no centro da sapata","M = Mo − Σ Vi·xi",`${f(Mo,2)} − ${f(Mv,2)} = ${f(M,2)} kN·m/m`],
   ...(r2?[["Forças por metro nas filas","Nfrente/trás = V/2 ± M/e ; e = 3φ",`e = ${f(e,2)} m → frente ${f(Nf,2)} ; trás ${f(Nb,2)} kN/m`]]:[["Força por metro na fila","N = V (momento absorvido pelas estacas/tirantes)",`${f(V,2)} kN/m ; M = ${f(M,2)} kN·m/m a absorver`]]),
   ["Compressão por estaca","Pc = Nmáx·s",`${f(Pc,1)} kN ${okc?"≤":">"} ${f(v.Qc,0)} kN`],["Tração por estaca","Pt = |Nmín|·s (se Nmín < 0)",`${f(Pt,1)} kN ${okt?"≤":">"} ${f(v.Qt,0)} kN`],["Horizontal por estaca","Ph = (Ea + Eq)·s / nº filas",`${f(Ph,1)} kN ${okh?"≤":">"} ${f(v.Qh,0)} kN`],["Espaçamento sugerido","s ≤ mín(Qc/Nmáx ; Qt/|Nmín| ; Qh·n/H) ≤ 3 m",`s = ${f(ss,2)} m`]],
  res:[["Ka",f(Ka,3)],["Empuxo total (Ea + Eq)",`${f(Hh,1)} kN/m`],["Momento de tombamento",`${f(Mo,1)} kN·m/m`],["Cortina",`${f(tt*100,0)} cm (topo) → ${f(tb*100,0)} cm (base)`],["Sapata corrida",`B = ${f(B,2)} m × h = ${f(h*100,0)} cm`],["Estacas",`${np} fila(s) × ${v.tipo} c/ ${f(s,2)} m`],["Compressão / tração / horizontal por estaca",`${f(Pc,0)} / ${f(Pt,0)} / ${f(Ph,0)} kN`],["Espaçamento sugerido",`≤ ${f(ss,2)} m`]],
  warn:[...(!okc?["Compressão por estaca acima da capacidade: reduzir o espaçamento ou aumentar a estaca."]:[]),...(!okt?["Tração por estaca acima da capacidade: usar 2 filas mais afastadas, aumentar o talão ou reduzir o espaçamento."]:[]),...(!okh?["Carga horizontal por estaca acima da capacidade: reduzir espaçamento, prever estacas inclinadas ou tirantes."]:[]),...(!r2?["1 fila de estacas: o momento de tombamento precisa ser resistido pelas estacas (flexão) ou por tirantes — confirmar no projeto."]:[]),...(ss<3*phi?["Espaçamento sugerido menor que 3φ: aumentar o diâmetro da estaca ou adotar 2 filas."]:[]),"Drenagem (barbacãs + dreno + brita/geotêxtil) é obrigatória — o cálculo não considera água."]};
  r._={Ka,tt,tb,h,B,toe,heel,e,Ht,Ea,Eq,Hh,Mo,V,M,Nf,Nb,Pc,Pt,Ph,ss,r2,phi};return r}},
{id:"pavimento",g:"Contenções e pavimentos",t:"Pavimento rígido",refs:["PCA (1984) — Thickness Design for Concrete Highway and Street Pavements (método simplificado)","DNIT — Manual de Pavimentos Rígidos (IPR-714, 2005)","DNIT 047/048/049-ES — execução de pavimento rígido","Westergaard (1926/1948) — tensões em placas sobre fundação elástica"],
 inp:[["cls","Tráfego / carga por eixo","","Médio — eixo simples 80 kN",null,null,["Leve — eixo simples 60 kN","Médio — eixo simples 80 kN","Pesado — eixo simples 100 kN","Muito pesado — eixo simples 130 kN","Informar carga por eixo"]],["P","Carga por eixo simples (se informada)","kN",100,10,400],["cbr","CBR do subleito","%",6,1,60],
  ["sb","Sub-base","","Granular 15 cm",null,null,["Sem sub-base","Granular 10 cm","Granular 15 cm","BGTC 10 cm","Concreto rolado (CCR) 10 cm"]],["fct","Resistência à tração na flexão fctM,k","MPa",4.5,3,7],["fs","Fator de segurança (fadiga)","—",2,1,4],["bt","Barras de transferência nas juntas","","Sim",null,null,["Sim","Não"]]],
 hip:["Placas de concreto simples com juntas serradas; eixo simples de rodas duplas; carga por roda = P/2; pressão de contato 0,7 MPa (raio a = √(Pr/π·p)).","k do subleito estimado do CBR: k ≈ 18·CBR^0,53 (MPa/m); sub-base aumenta k no topo (granular 10 cm ×1,15; 15 cm ×1,25; BGTC ×1,6; CCR ×2,0) — limite 200 MPa/m.","Concreto: E = 30 000 MPa, ν = 0,15. Raio de rigidez relativa ℓ = [E·h³/(12(1−ν²)k)]^¼.","Westergaard: interior σi = 0,316·Pr/h²·[4 log(ℓ/b) + 1,069]; borda σb = 0,572·Pr/h²·[4 log(ℓ/b) + 0,359]; b = a se a ≥ 1,724h, senão b = √(1,6a² + h²) − 0,675h.","Tensão de projeto: máx(σi ; 0,80·σb) com barras de transferência/acostamento (redução de 20% na borda) ou σb sem barras. Admissível: σadm = fctM,k / FS (FS = 2 ⇒ relação de tensões 0,5, fadiga ilimitada PCA).","h mínimo 15 cm, arredondado ao cm. Juntas a ≈ 25h, máx. 6 m (relação comprimento/largura ≤ 1,25).","Barras de transferência (lisas, CA-25) e de ligação (CA-50) por tabela prática DNIT; não substitui dimensionamento pelo método PCA completo (fadiga + erosão)."],
 calc(v){const Pax=v.cls.startsWith("Informar")?v.P:+v.cls.match(/(\d+) kN/)[1],Pr=Pax/2/1000,a=Math.sqrt(Pr/(Math.PI*0.7)),k0=18*Math.pow(v.cbr,0.53),mf={"Sem sub-base":1,"Granular 10 cm":1.15,"Granular 15 cm":1.25,"BGTC 10 cm":1.6,"Concreto rolado (CCR) 10 cm":2}[v.sb],k=Math.min(200,k0*mf),sa=v.fct/v.fs,dw=v.bt=="Sim";
  const st=h=>{const l=Math.pow(30000*h*h*h/(12*(1-0.0225)*k),0.25),b=a>=1.724*h?a:Math.sqrt(1.6*a*a+h*h)-0.675*h,lg=Math.log10(l/b),si=0.316*Pr/(h*h)*(4*lg+1.069),sb=0.572*Pr/(h*h)*(4*lg+0.359);return{l,b,si,sb,sd:Math.max(si,dw?0.8*sb:sb)}};
  let h=0.15;while(st(h).sd>sa&&h<0.40)h=+(h+0.01).toFixed(2);const S=st(h),J=Math.min(6,Math.floor(25*h*4)/4),hc=h*100;
  const dwl=hc<=17?["Ø20 mm","c/ 30 cm","46 cm"]:hc<=22?["Ø25 mm","c/ 30 cm","46 cm"]:["Ø32 mm","c/ 30 cm","46 cm"],tie=hc<=20?["Ø10 mm","c/ 75 cm","60 cm"]:["Ø12,5 mm","c/ 75 cm","70 cm"];
  const r={steps:[["Carga por roda","Pr = P/2",`${f(Pax,0)}/2 = ${f(Pr*1000,1)} kN`],["Raio de contato","a = √(Pr/(π·0,7 MPa))",`${f(a*100,1)} cm`],["k do subleito","k0 ≈ 18·CBR^0,53",`18×${f(v.cbr,0)}^0,53 = ${f(k0,1)} MPa/m`],["k no topo da sub-base",`k = k0 × ${f(mf,2)} (${v.sb})`,`${f(k,1)} MPa/m`],["Tensão admissível","σadm = fctM,k / FS",`${f(v.fct,2)}/${f(v.fs,2)} = ${f(sa,2)} MPa`],
   ["Raio de rigidez relativa","ℓ = [E·h³/(12(1−ν²)·k)]^¼",`h = ${f(hc,0)} cm → ℓ = ${f(S.l,3)} m ; b = ${f(S.b*100,1)} cm`],["Westergaard — interior","σi = 0,316·Pr/h²·[4 log(ℓ/b) + 1,069]",`${f(S.si,2)} MPa`],["Westergaard — borda","σb = 0,572·Pr/h²·[4 log(ℓ/b) + 0,359]",`${f(S.sb,2)} MPa${dw?` (×0,80 = ${f(0.8*S.sb,2)})`:""}`],["Verificação","σproj = máx(σi ; "+(dw?"0,8·":"")+"σb) ≤ σadm",`${f(S.sd,2)} ${S.sd<=sa?"≤":">"} ${f(sa,2)} MPa → h = ${f(hc,0)} cm`],["Espaçamento de juntas","J ≈ 25·h ≤ 6 m",`25×${f(h,2)} = ${f(25*h,2)} → ${f(J,2)} m`]],
  res:[["Espessura da placa h",`${f(hc,0)} cm`],["k no topo da sub-base",`${f(k,0)} MPa/m`],["Tensão de projeto / admissível",`${f(S.sd,2)} / ${f(sa,2)} MPa`],["Juntas transversais",`a cada ${f(J,2)} m; longitudinais a cada faixa (≤ 4 m)`],["Barras de transferência (lisas CA-25)",dw?`${dwl[0]} ${dwl[1]}, L = ${dwl[2]}`:"não adotadas"],["Barras de ligação (CA-50)",`${tie[0]} ${tie[1]}, L = ${tie[2]}`]],
  warn:[...(S.sd>sa?["Mesmo com h = 40 cm a tensão excede a admissível: melhorar a sub-base/subleito ou reduzir a carga."]:[]),...(v.cbr<2?["CBR < 2%: substituir/estabilizar o subleito."]:[]),...(!dw&&Pax>=80?["Tráfego médio/pesado sem barras de transferência: recomenda-se usá-las."]:[])]};
  r._={h,J,k,dwl,tie,sb:v.sb,Pax,dw};return r}}

];

// ---------------- MATERIAIS (estimativas) ----------------
const BARRAS={"5,0":0.154,"6,3":0.245,"8,0":0.395,"10,0":0.617,"12,5":0.963,"16,0":1.578,"20,0":2.466,"25,0":3.853,"32,0":6.313}; // NBR 7480 kg/m
const BIT=Object.keys(BARRAS).slice(0,7);
// Laje treliçada: consumo de concreto (m³/m²) indicativo por altura
const TREL_CONSUMO={"H8":0.050,"H12":0.060,"H16":0.070,"H20":0.085,"H25":0.100};
const ENCH={"Lajota cerâmica (intereixo 42 cm; peça 30×20 cm)":{ie:0.42,comp:0.20,nome:"lajotas cerâmicas"},"EPS (intereixo 50 cm; bloco 40×100 cm)":{ie:0.50,comp:1.00,nome:"blocos de EPS"}};
const TELAS={"Q-61 (Ø3,4 c/15 — 0,97 kg/m²)":0.97,"Q-92 (Ø4,2 c/15 — 1,48 kg/m²)":1.48};
const MC=[["nel","Quantidade de elementos iguais","un",1,1,500],["taxa","Taxa de aço estimada","kg/m³",0,1,400],["traco","Traço do concreto (cimento:areia:brita, em massa)","","1:2:3"],["ac","Relação água/cimento","—",0.55,0.3,0.8]];
const fckI=["fck","fck do concreto","MPa",25,20,90];
// bar helpers
function malha(kg,larg,len,cand){for(const b of cand){let q=Math.ceil(kg/(len*BARRAS[b])-1e-9),s=larg/q;if(s>=0.10){if(s>0.20){q=Math.ceil(larg/0.20);s=larg/q}return{b,q,len,s}}}const b=cand[cand.length-1],q=Math.ceil(kg/(len*BARRAS[b]));return{b,q,len,s:larg/q}}
function longit(kg,q,len,cand=BIT.slice(2)){for(const b of cand)if(q*len*BARRAS[b]>=kg)return{b,q,len};const b=cand[cand.length-1];return{b,q:Math.ceil(kg/(len*BARRAS[b])),len}}
function estribo(per,L,sp){return{b:"5,0",q:Math.ceil(L/sp)+1,len:per,s:sp}}
function traco(t){const m=String(t).split(":").map(x=>parseFloat(x.replace(",",".")));return m.length==3&&m[0]==1&&m.every(x=>x>0)?m:null}
function MAT(t,v,r){const g=t.geo&&t.geo(v,r);if(!g)return null;const n=v.nel||1,out={rows:[],bars:[],perfis:[],notas:[]};
 if(g.perfis){let tot=0;g.perfis.forEach(([item,p,len,qty])=>{const kg=p.kg*len*qty*n;tot+=kg;out.perfis.push([item,p.n,qty*n,len,p.kg,kg])});
  out.rows.push(["Aço estrutural (perfis)",f(tot,1),"kg"],["Ligações, chapas e parafusos (+10%)",f(tot*0.1,1),"kg"],["Total estimado de aço",f(tot*1.1,1),"kg"]);out.notas.push("Comprimentos sem cortes/perdas de barra comercial (12 m).");return out}
 const V=g.V*n,F=g.F*n;out.rows.push([`Concreto C${v.fck} (fck ${v.fck} MPa)`,f(V,3),"m³"]);if(F>0)out.rows.push(["Fôrmas",f(F,2),"m²"]);
 if(g.extra)g.extra.forEach(x=>out.rows.push(x));
 let kgTaxa=(g.Vaco??g.V)*n*(v.taxa||0);if(g.taxa2)kgTaxa+=g.taxa2*n;
 if(g.bars){g.bars.forEach(([item,o])=>out.bars.push([item,o.b,o.q*n,o.len,BARRAS[o.b],o.q*n*o.len*BARRAS[o.b],o.s]))}
 const kgList=out.bars.reduce((s,x)=>s+x[5],0);
 if(v.taxa)out.rows.push([`Aço CA-50/60 pela taxa (${f(v.taxa,0)} kg/m³)`,f(kgTaxa,1),"kg"]);
 if(out.bars.length)out.rows.push(["Aço da lista de barras sugerida",f(kgList,1),"kg"]);
 if(g.tela)out.rows.push(...g.tela.map(x=>x));
 const m=traco(v.traco);if(m){const [_,a,b]=m,C=1000/(1/3.1+a/2.65+b/2.7+v.ac),Vp=(g.Vmix??g.V)*n*1.05;
  out.rows.push([`Cimento (${f(C,0)} kg/m³; +5% perdas)`,`${Math.ceil(C*Vp/50)}`,"sacos 50 kg"],["Areia",f(a*C*Vp/1450,2),"m³"],["Brita 1",f(b*C*Vp/1400,2),"m³"])}
 // resumo por bitola em barras de 12 m (+10%)
 const pb={};out.bars.forEach(x=>{pb[x[1]]=(pb[x[1]]||0)+x[2]*x[3]});out.porBitola=Object.entries(pb).map(([b,L])=>[b,L,Math.ceil(L*1.1/12),L*BARRAS[b]]);
 out.notas.push("Consumo de cimento por volumes absolutos (cimento 3,10; areia 2,65; brita 2,70 t/m³); massas unitárias soltas: areia 1,45 t/m³, brita 1,40 t/m³; perdas de 5% no concreto e 10% nas barras.");
 if(g.nota)out.notas.push(g.nota);return out}
const mat=(id,mi,geo)=>{const t=TOOLS.find(x=>x.id==id);t.mi=mi;t.geo=geo};
const cm=c=>c/100;
mat("sapata",[fckI,...MC.map(x=>x[0]=="taxa"?[...x.slice(0,3),50,1,400]:x)],(v,r)=>{const[B,L,h]=r._;const V=B*L*h,kg=v.taxa*V,al=(x)=>x-0.10+2*(h-0.10);
 return{V,F:2*(B+L)*h,bars:[["Malha inferior — direção L",malha(kg/2,B-0.10,al(L),BIT.slice(3))],["Malha inferior — direção B",malha(kg/2,L-0.10,al(B),BIT.slice(3))]],nota:"Volume como prisma retangular (sapata sem chanfro). Barras com ganchos verticais até o topo."}});
mat("radier",[fckI,...MC.map(x=>x[0]=="taxa"?[...x.slice(0,3),70,1,400]:x)],(v,r)=>{const h=r._[0],A=v.A,lado=Math.sqrt(A),V=A*h,kg=v.taxa*V,q=kg/4;
 return{V,F:4*lado*h,bars:[["Malha inferior — direção X",malha(q,lado,lado,BIT.slice(2))],["Malha inferior — direção Y",malha(q,lado,lado,BIT.slice(2))],["Malha superior — direção X",malha(q,lado,lado,BIT.slice(1))],["Malha superior — direção Y",malha(q,lado,lado,BIT.slice(1))]],nota:"Planta considerada quadrada equivalente (lado = √A) para perímetro e comprimento das barras; emendas não incluídas."}});
mat("estacas",[fckI,["Le","Comprimento de cada estaca","m",8,1,40],["te","Taxa de aço das estacas","kg/m³",25,0,150],...MC.map(x=>x[0]=="taxa"?["taxa","Taxa de aço do bloco","kg/m³",80,1,400]:x)],(v,r)=>{const[bx,by,h,ne]=r._,Vb=bx*by*h,ve=ne*Math.PI/4*Math.pow(cm(v.phi),2)*v.Le,kg=v.taxa*Vb;
 return{V:Vb+ve,Vaco:Vb,taxa2:v.te*ve,F:2*(bx+by)*h,extra:[["  · concreto do bloco",f(Vb*(v.nel||1),3),"m³"],["  · concreto das estacas",f(ve*(v.nel||1),3),"m³"]],
 bars:[["Bloco — armadura principal (dir. maior)",malha(kg*0.4,by-0.10,bx-0.10+2*(h-0.10),BIT.slice(3))],["Bloco — armadura (dir. menor)",malha(kg*0.4,bx-0.10,by-0.10+2*(h-0.10),BIT.slice(3))],["Bloco — estribos/pele",malha(kg*0.2,h*2,2*(bx+by),BIT.slice(1))],["Estacas — longitudinais (arranque)",longit(v.te*ve/ne*0.8,4*ne,Math.min(v.Le,4))]],
 nota:"Aço do bloco pela taxa do bloco; aço das estacas pela taxa das estacas (armadura de topo/arranque). Fôrma só do bloco."}});
mat("pilar",[["pd","Pé-direito por pavimento","m",3,2,8],...MC.map(x=>x[0]=="taxa"?[...x.slice(0,3),130,1,400]:x)],(v,r)=>{const[b,h]=r._,H=v.pd*v.np,V=b*h*H,kg=v.taxa*V,ql=h>0.40?6:4;
 return{V,F:2*(b+h)*H,bars:[["Longitudinais (com 15% p/ emendas)",longit(kg*0.75,ql,H*1.15)],["Estribos",estribo(2*(b+h)-0.16+0.10,H,0.15)]],nota:"Pilar contínuo com a mesma seção em todos os pavimentos (estimativa a favor do consumo)."}});
mat("viga",[fckI,...MC.map(x=>x[0]=="taxa"?[...x.slice(0,3),110,1,400]:x)],(v,r)=>{const bw=cm(v.bw),h=r._[0],L=v.L,V=bw*h*L,kg=v.taxa*V,Lb=L+0.30;
 const es=estribo(2*(bw+h)-0.16+0.10,L,0.15),kges=es.q*es.len*BARRAS["5,0"];
 return{V,F:(2*h+bw)*L,bars:[["Armadura positiva (inferior)",longit(Math.max(0,(kg-kges))*0.7,3,Lb)],["Armadura negativa/porta-estribos",longit(Math.max(0,(kg-kges))*0.3,2,Lb,BIT.slice(1))],["Estribos",es]],nota:"Barras longitudinais com ancoragem de 15 cm em cada apoio."}});
mat("laje",[fckI,...MC.map(x=>x[0]=="taxa"?[...x.slice(0,3),80,1,400]:x)],(v,r)=>{const h=r._[0],lx=Math.min(v.lx,v.ly),ly=Math.max(v.lx,v.ly),V=lx*ly*h,kg=v.taxa*V;
 return{V,F:lx*ly+2*(lx+ly)*h,bars:[["Positiva — direção lx",malha(kg*0.35,ly,lx+0.20,BIT.slice(1))],["Positiva — direção ly",malha(kg*0.25,lx,ly+0.20,BIT.slice(1))],["Negativa sobre apoios (estim.)",malha(kg*0.40,2*(lx+ly),0.25*lx*2+0.20,BIT.slice(1))]]}});
mat("trelicada",[fckI,["B","Largura da laje (perpendicular às vigotas)","m",4,0.5,30],["ench","Enchimento","",Object.keys(ENCH)[0],null,null,Object.keys(ENCH)],["tela","Tela soldada da capa","",Object.keys(TELAS)[0],null,null,Object.keys(TELAS)],["nel","Quantidade de lajes iguais","un",1,1,500],["traco","Traço do concreto (cimento:areia:brita, em massa)","","1:2:3"],["ac","Relação água/cimento","—",0.55,0.3,0.8]],(v,r)=>{
 const tipo=r._&&r._[0];if(!tipo)return null;const A=v.L*v.B,cons=TREL_CONSUMO[tipo.split(" ")[0]],V=cons*A,e=ENCH[v.ench],nv=Math.ceil(v.B/e.ie)+1,lv=v.L+0.10,nen=(nv-1)*Math.ceil(v.L/e.comp),tk=TELAS[v.tela],paineis=Math.ceil(A*1.1/14.7),n=v.nel||1;
 return{V,F:0,extra:[["Área de laje",f(A*n,2),"m²"],[`Consumo de concreto (${tipo.split(" ")[0]})`,f(cons,3),"m³/m²"],[`Vigotas treliçadas (${f(lv,2)} m)`,`${nv*n}`,"un"],[e.nome[0].toUpperCase()+e.nome.slice(1),`${nen*n}`,"un"],["Escoramento (área)",f(A*n,2),"m²"]],
 tela:[[`Tela soldada ${v.tela.split(" ")[0]} (painel 2,45×6,00 m, +10% transpasse)`,`${paineis*n}`,"painéis"],["Peso da tela",f(A*1.1*tk*n,1),"kg"]],nota:"Consumo de concreto (capa + nervuras) indicativo por altura — confirmar com o fabricante. Fôrma substituída por escoramento + enchimento."}});
mat("pilar-aco",[["nel","Quantidade de pilares iguais","un",1,1,500]],(v,r)=>r._?{perfis:[["Pilar",r._[0],v.L,1]]}:null);
mat("viga-aco",[["nel","Quantidade de vigas iguais","un",1,1,500]],(v,r)=>r._?{perfis:[["Viga",r._[0],v.L,1]]}:null);
mat("trelica",[["nel","Quantidade de treliças iguais","un",1,1,500]],(v,r)=>{const g=r._;if(!g||!g[0]||!g[1]||!g[2])return null;const np=Math.ceil(v.L/v.p);
 return{perfis:[["Banzo superior",g[0],v.L,1],["Banzo inferior",g[1],v.L,1],["Diagonais",g[2],+Math.hypot(g[3],v.L/np).toFixed(2),np],["Montantes",g[2],+g[3].toFixed(2),np+1]]}});
mat("muro",[fckI,["Lm","Comprimento do muro","m",20,1,1000],["Le","Comprimento de cada estaca","m",10,2,40],["te","Taxa de aço das estacas","kg/m³",25,0,150],["taxa","Taxa de aço (cortina + sapata)","kg/m³",90,1,400],["traco","Traço do concreto (cimento:areia:brita, em massa)","","1:2:3"],["ac","Relação água/cimento","—",0.55,0.3,0.8]],(v,r)=>{const g=r._;if(!g)return null;const Lm=v.Lm,Vc=(g.tt+g.tb)/2*v.H*Lm,Vs=g.B*g.h*Lm,ne=(g.r2?2:1)*(Math.floor(Lm/v.s)+1),ve=ne*Math.PI/4*Math.pow(v.d/100,2)*v.Le,kg=v.taxa*(Vc+Vs);
 return{V:Vc+Vs+ve,Vaco:Vc+Vs,taxa2:v.te*ve,F:2*v.H*Lm+2*g.h*Lm,extra:[["  · concreto da cortina",f(Vc,3),"m³"],["  · concreto da sapata corrida",f(Vs,3),"m³"],[`  · concreto das estacas (${ne} un × ${f(v.Le,1)} m)`,f(ve,3),"m³"],["Lastro de concreto magro (5 cm)",f(g.B*Lm*0.05,3),"m³"],["Brita drenante (faixa 30 cm)",f(0.30*v.H*Lm,2),"m³"],["Manta geotêxtil",f((v.H+0.6)*Lm*1.1,1),"m²"],["Tubo dreno PVC perfurado Ø100",f(Lm*1.05,1),"m"],["Barbacãs PVC Ø75 (1 a cada 2 m², alt. alternada)",`${Math.ceil(v.H*Lm/2)}`,"un"],["Impermeabilização da face em contato com o solo",f(v.H*Lm,1),"m²"]],
 bars:[["Cortina — vertical face do aterro (tracionada)",malha(kg*0.40,Lm,v.H+g.h+0.6,BIT.slice(3))],["Cortina — vertical face externa",malha(kg*0.12,Lm,v.H+0.3,BIT.slice(2))],["Cortina — horizontal (2 faces)",malha(kg*0.12,v.H*2,Lm,BIT.slice(2))],["Sapata — transversal (inferior + superior)",malha(kg*0.24,Lm*2,g.B-0.10+0.6,BIT.slice(3))],["Sapata — longitudinal",malha(kg*0.12,g.B*2,Lm,BIT.slice(2))],["Estacas — longitudinais (arranque)",longit(v.te*ve/ne*0.8,6*ne,Math.min(v.Le,4))]],
 nota:"Fôrma: duas faces da cortina + bordas da sapata. Arranques da cortina ancorados na sapata (comprimento incluído na barra vertical). Juntas de dilatação a cada 15–20 m."}});
mat("pavimento",[["fck","fck do concreto (≈ fctM,k × 7)","MPa",35,20,90],["Wf","Largura da pista/faixa","m",3.5,1,30],["Lp","Comprimento do trecho","m",50,1,5000],["hs","Espessura da sub-base","cm",15,0,40],["traco","Traço do concreto (cimento:areia:brita, em massa)","","1:1,8:2,6"],["ac","Relação água/cimento","—",0.45,0.3,0.8]],(v,r)=>{const g=r._;if(!g)return null;const A=v.Wf*v.Lp,V=A*g.h,nt=Math.floor(v.Lp/g.J)-1,nl=Math.max(0,Math.ceil(v.Wf/4)-1),pd=g.dwl[0].match(/\d+/)[0],dl=Math.max(0,nt)*Math.floor(v.Wf/0.30),tl=nl*Math.floor(v.Lp/0.75),juntas=Math.max(0,nt)*v.Wf+nl*v.Lp;
 return{V,F:2*v.Lp*g.h+2*v.Wf*g.h,extra:[["Área de pavimento",f(A,1),"m²"],[`Sub-base (${g.sb})`,f(A*v.hs/100,2),"m³"],["Lona plástica / imprimação sob a placa",f(A,1),"m²"],[`Barras de transferência ${g.dwl[0]} L=${g.dwl[2]}`,g.dw?`${dl}`:"0","un"],[`Barras de ligação ${g.tie[0]} L=${g.tie[2]}`,`${tl}`,"un"],["Corte e selagem de juntas",f(juntas,1),"m"],["Selante de juntas (≈ 0,08 L/m — conferir fabricante)",f(juntas*0.08,1),"L"],["Agente de cura química (0,3 L/m²)",f(A*0.3,1),"L"]],
 bars:[...(g.dw&&dl?[["Barras de transferência (lisas, CA-25)",{b:pd+",0",q:dl,len:+g.dwl[2].match(/\d+/)[0]/100,s:0.30}]]:[]),...(tl?[["Barras de ligação (CA-50)",{b:g.tie[0].includes("12")?"12,5":"10,0",q:tl,len:+g.tie[2].match(/\d+/)[0]/100,s:0.75}]]:[])],
 nota:"Concreto simples (sem armadura distribuída). Selante: consumo indicativo — conferir ficha técnica."}});
// expose geometry from calcs: wrap calc to attach r._
(()=>{const W=(id,fn)=>{const t=TOOLS.find(x=>x.id==id),c=t.calc;t.calc=v=>{const r=c(v);r._=fn(v,r);return r}};
 const num=s=>parseFloat(String(s).replace(/\./g,"").replace(",","."));
 W("sapata",(v,r)=>{const [B,L]=r.res[0][1].match(/[\d.,]+/g).map(num),h=num(r.res[1][1]);return[B/100,L/100,h/100]});
 W("radier",(v,r)=>[num(r.res[0][1])/100]);
 W("estacas",(v,r)=>{const [bx,by]=r.res[1][1].match(/[\d.,]+/g).map(num),h=num(r.res[2][1]),ne=parseInt(r.res[0][1]);return[bx/100,by/100,h/100,ne]});
 W("pilar",(v,r)=>r.res[2][1].match(/[\d.,]+/g).map(num).map(x=>x/100));
 W("viga",(v,r)=>[num(r.res[0][1].split("×")[1])/100]);
 W("laje",(v,r)=>[num(r.res[0][1])/100]);
 W("trelicada",(v,r)=>/^H\d/.test(r.res[0][1])?[r.res[0][1]]:null);
 const pf=n=>PERFIS_W.find(p=>p.n==n),tb=n=>TUBOS.find(p=>p.n==n);
 W("pilar-aco",(v,r)=>{const m=r.res[0][1].match(/^(W\S+)/);return m?[pf(m[1])]:null});
 W("viga-aco",(v,r)=>{const m=r.res[3][1].match(/^(W\S+)/);return m?[pf(m[1])]:null});
 W("trelica",(v,r)=>[tb(r.res[1][1]),tb(r.res[2][1]),tb(r.res[3][1]),v.L/parseInt(v.r.slice(2))])})();

// ---------------- UI ----------------
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[c]));
const tabs=$("#ftabs"),panel=$("#fpanel");let cur=null,last=null;
[...new Set(TOOLS.map(t=>t.g))].forEach(g=>{tabs.insertAdjacentHTML("beforeend",`<div class="fgrp"><span>${g}</span>${TOOLS.filter(t=>t.g==g).map(t=>`<button data-id="${t.id}">${t.t}</button>`).join("")}</div>`)});
tabs.querySelectorAll("button").forEach(b=>b.onclick=()=>{open(b.dataset.id);history.replaceState(null,"","#"+b.dataset.id)});
const allInp=t=>[...t.inp,...(t.mi||[])];
const field=([id,lab,un,def,mn,mx,opts])=>`<label>${lab}${un&&un!="—"?` (${un})`:""}${opts?`<select id="i-${id}">${opts.map(o=>`<option ${o==def?"selected":""}>${o}</option>`).join("")}</select>`:`<input id="i-${id}" ${id=="traco"?"":'inputmode="decimal"'} value="${String(def).replace(".",",")}">`}</label>`;
function readVals(t){const v={},err=[];allInp(t).forEach(([id,lab,un,def,mn,mx,opts])=>{const el=$("#i-"+id);if(opts){v[id]=el.value;return}
  if(id=="traco"){if(!traco(el.value)){err.push("Traço inválido (use 1:a:b, ex.: 1:2:3)");el.classList.add("bad")}else{el.classList.remove("bad");v[id]=el.value}return}
  const x=parseFloat(String(el.value).replace(",","."));const lo=mn??1e-9,hi=mx??1e7;
  if(!isFinite(x)||x<lo||x>hi){err.push(`${lab}: valor inválido${mn!=null||mx!=null?` (${mn??"…"} a ${mx??"…"})`:" (deve ser > 0)"}`);el.classList.add("bad")}else{el.classList.remove("bad");v[id]=x}});return{v,err}}
function open(id){cur=TOOLS.find(t=>t.id==id)||TOOLS[0];tabs.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.id==cur.id));const t=cur;
  panel.innerHTML=`<h2>${t.t}</h2><p class="fg">${t.g}</p><div class="fcols"><form class="oform" id="fform" onsubmit="return false"><div class="ogrid">${t.inp.map(field).join("")}</div>
  ${t.mi?`<fieldset class="fmat"><legend>Materiais (estimativa)</legend><div class="ogrid">${t.mi.map(field).join("")}</div></fieldset>`:""}
  ${t.table?`<details class="ftab"><summary>Tabela de vãos máximos (editável)</summary><table><thead><tr><th>Laje</th>${TRELICADA.cargas.map(c=>`<th>q ≤ ${f(c,1)}</th>`).join("")}</tr></thead><tbody>${TRELICADA.linhas.map((r,i)=>`<tr><td>${r[0]}</td>${r.slice(1).map((x,j)=>`<td><input data-r="${i}" data-c="${j+1}" value="${f(x,1)}"></td>`).join("")}</tr>`).join("")}</tbody></table></details>`:""}
  <details><summary>Hipóteses adotadas</summary><ul>${t.hip.map(h=>`<li>${h}</li>`).join("")}</ul></details></form>
  <div class="fres" id="fres"></div></div><div class="fdraw" id="fdraw"></div><div id="fmatout"></div>`;
  if(t.id=="estacas")$("#i-tipo").onchange=()=>{const[d,q]=ESTACAS[$("#i-tipo").value];$("#i-Q").value=q;$("#i-phi").value=d;run()};
  panel.querySelectorAll(".ftab input").forEach(i=>i.oninput=()=>{const x=parseFloat(i.value.replace(",","."));if(x>0)TRELICADA.linhas[i.dataset.r][i.dataset.c]=x;run()});
  $("#fform").addEventListener("input",run);$("#fform").addEventListener("change",run);run()}
function matHTML(M,cls=""){if(!M)return"";return `<h3>Tabela resumo de aço e materiais <small>(estimativa)</small></h3>
 <table class="${cls}"><thead><tr><th>Item</th><th>Quantidade</th><th>Unid.</th></tr></thead><tbody>${M.rows.map(([a,b,c])=>`<tr><td>${a}</td><td class="n">${b}</td><td>${c}</td></tr>`).join("")}</tbody></table>
 ${M.bars.length?`<h4>Lista de barras sugerida (NBR 7480)</h4><table class="${cls}"><thead><tr><th>Posição</th><th>Ø (mm)</th><th>Qtd</th><th>Compr. (m)</th><th>kg/m</th><th>Peso (kg)</th><th>Espaç.</th></tr></thead><tbody>${M.bars.map(([a,b,q,l,m,kg,s])=>`<tr><td>${a}</td><td>${b}</td><td class="n">${q}</td><td class="n">${f(l,2)}</td><td class="n">${f(m,3)}</td><td class="n">${f(kg,1)}</td><td>${s?"c/ "+f(s*100,0)+" cm":"—"}</td></tr>`).join("")}<tr><td colspan="5"><b>Total</b></td><td class="n"><b>${f(M.bars.reduce((s,x)=>s+x[5],0),1)}</b></td><td></td></tr></tbody></table>
 <h4>Resumo por bitola</h4><table class="${cls}"><thead><tr><th>Ø (mm)</th><th>Comprimento total (m)</th><th>Barras de 12 m (+10%)</th><th>Peso (kg)</th></tr></thead><tbody>${M.porBitola.map(([b,L,n12,kg])=>`<tr><td>${b}</td><td class="n">${f(L,1)}</td><td class="n">${n12}</td><td class="n">${f(kg,1)}</td></tr>`).join("")}</tbody></table>`:""}
 ${M.perfis.length?`<h4>Lista de perfis</h4><table class="${cls}"><thead><tr><th>Elemento</th><th>Perfil</th><th>Qtd</th><th>Compr. (m)</th><th>kg/m</th><th>Peso (kg)</th></tr></thead><tbody>${M.perfis.map(([a,p,q,l,m,kg])=>`<tr><td>${a}</td><td>${p}</td><td class="n">${q}</td><td class="n">${f(l,2)}</td><td class="n">${f(m,1)}</td><td class="n">${f(kg,1)}</td></tr>`).join("")}</tbody></table>`:""}
 <p class="fnote">Estimativa de quantitativos para orçamento preliminar. ${M.notas.join(" ")}</p>`}
function run(){const t=cur,{v,err}=readVals(t),box=$("#fres"),mo=$("#fmatout");if(err.length){last=null;box.innerHTML=`<div class="ferr">${err.map(esc).join("<br>")}</div>`;mo.innerHTML="";return}
  const r=t.calc({...v}),M=MAT(t,{...v},r);last={t,v,r,M};
  box.innerHTML=`<h3>Resultado</h3><dl>${r.res.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl>${r.warn.length?`<div class="fwarn">${r.warn.join("<br>")}</div>`:""}
  <details open><summary>Passo a passo</summary><ol>${r.steps.map(([a,b,c])=>`<li><b>${a}</b><br><code>${b}</code><br>${c}</li>`).join("")}</ol></details>
  <button class="btn" id="fmem" type="button">Gerar memória de cálculo</button><p class="fdisc">Pré-dimensionamento orientativo — não substitui projeto estrutural com ART.</p>`;
  mo.innerHTML=M?`<div class="fmatbox">${matHTML(M)}</div>`:"";const dr=DRAW[t.id]?DRAW[t.id]({...v},r):"";$("#fdraw").innerHTML=dr?`<h3>Desenho esquemático <small>(cotas atualizadas com o resultado — sem escala)</small></h3>${dr}`:"";$("#fmem").onclick=memorial}
function memorial(){if(!last)return;const {t,v,r,M}=last,el=$("#proposta"),hoje=new Date().toLocaleDateString("pt-BR");
  el.innerHTML=`<div class="pp-head"><img src="assets/img/logo-fsantos.png" alt=""><div><strong>FSantos Engenharia — Santos Projetos & Orçamentos</strong><br>Eng. Civil Francirley Pereira Santos — CREA 31.410-AM</div></div>
  <p class="pp-flag">Pré-dimensionamento orientativo — não substitui projeto estrutural com ART</p><h2>MEMÓRIA DE CÁLCULO</h2><p class="pp-sub">${t.g} — ${t.t}</p><p>Manaus/AM, ${hoje}</p>
  <h3>1. Dados de entrada</h3><table class="pp-t"><tbody>${allInp(t).map(([id,lab,un])=>`<tr><td>${lab}</td><td>${typeof v[id]=="number"?f(v[id],v[id]%1?2:0):esc(v[id])} ${un&&un!="—"?un:""}</td></tr>`).join("")}</tbody></table>
  <h3>2. Hipóteses</h3><ul>${t.hip.map(h=>`<li>${h}</li>`).join("")}</ul>
  <h3>3. Cálculo passo a passo</h3><table class="pp-t"><thead><tr><th>Etapa</th><th>Fórmula</th><th>Resultado</th></tr></thead><tbody>${r.steps.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join("")}</tbody></table>
  <h3>4. Resultados</h3><table class="pp-t"><tbody>${r.res.map(([a,b])=>`<tr><td><b>${a}</b></td><td><b>${b}</b></td></tr>`).join("")}</tbody></table>${r.warn.length?`<p><b>Observações:</b> ${r.warn.join(" ")}</p>`:""}
  <h3>5. Desenho esquemático</h3><div class="pp-draw">${DRAW[t.id]?DRAW[t.id]({...v},r):""}</div><p class="fnote">Esquema orientativo, sem escala; cotas conforme o pré-dimensionamento acima.</p>
  ${M?`<div class="pp-mat">${matHTML(M,"pp-t").replace("<h3>","<h3>6. ")}</div>`:""}
  <h3>${M?7:6}. Referências</h3><ul>${t.refs.map(x=>`<li>${x}</li>`).join("")}${M&&M.bars.length?"<li>ABNT NBR 7480:2022 — aço para armaduras (massas lineares nominais)</li>":""}</ul>
    <p class="pp-flag">Pré-dimensionamento orientativo — não substitui projeto estrutural com ART. Quantitativos são estimativas e devem ser confirmados pelo projeto executivo, sondagem e normas vigentes.</p>
  <div class="pp-sig"><div class="pp-sb"><div class="pp-sl"><img src="assets/img/logo-fsantos.png" alt=""></div><div class="pp-line"></div><div class="pp-st"><b>ENG. CIVIL FRANCIRLEY PEREIRA SANTOS</b><br>CREA: 31.410-AM<br>Santos Projetos & Orçamentos<br>Fone: (92) 99226-2786</div></div></div>
  <div class="pp-act noprint"><button class="btn" data-a="p">Imprimir / salvar PDF</button><button class="btn ghost" data-a="c">Fechar</button></div>`;
  el.querySelector('[data-a="p"]').onclick=()=>print();el.querySelector('[data-a="c"]').onclick=()=>document.body.classList.remove("pp-open");document.body.classList.add("pp-open");scrollTo(0,0)}
open(location.hash.slice(1));
(()=>{const b=document.querySelector(".burger"),n=document.getElementById("menu");if(b)b.onclick=()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)}})();
window.__TOOLS=TOOLS;window.__MAT=MAT;
