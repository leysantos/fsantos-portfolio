// Ferramentas de pré-dimensionamento — FSantos Engenharia
// Regras práticas (NBR 6118/6122/8800 simplificadas). Resultados orientativos.
const E_ACO=200000; // MPa
// Perfis W (aprox., base catálogo Gerdau — conferir catálogo): A cm², Ix cm4, Zx cm3, rx cm, ry cm, kg/m
const PERFIS_W=[["W150x13,0",13,16.6,635,96.4,6.18,2.22],["W150x18,0",18,23.4,939,139.4,6.34,2.32],["W200x15,0",15,19.4,1305,147.9,8.2,2.12],["W250x17,9",17.9,23.1,2291,211,9.96,1.99],["W200x19,3",19.3,25.1,1686,190.6,8.19,2.18],["W310x21,0",21,27.2,3776,291.9,11.77,1.9],["W150x22,5",22.5,29,1229,179.6,6.51,3.65],["W200x22,5",22.5,29,2029,225.5,8.37,2.22],["W250x25,3",25.3,32.6,3473,317.3,10.31,2.22],["W200x26,6",26.6,34.2,2611,282.3,8.73,3.1],["W150x29,8",29.8,38.5,1739,247.5,6.72,3.8],["W250x32,7",32.7,42.1,4937,428.5,10.83,3.35],["W310x32,7",32.7,42.1,6570,485.3,12.49,1.94],["W360x32,9",32.9,42.1,8358,547.6,14.09,2.63],["W200x35,9",35.9,45.7,3437,379.2,8.67,3.69],["W310x38,7",38.7,49.7,8581,615.4,13.14,3.82],["W410x38,8",38.8,50.3,12777,736.8,15.94,2.83],["W360x44,0",44,57.7,12258,784.3,14.58,3.77],["W250x44,8",44.8,57.6,7158,622.1,11.15,3.86],["W200x46,1",46.1,58.6,4543,495.3,8.81,5.12],["W310x52,0",52,67,11909,842.5,13.33,4.95],["W460x52,0",52,66.6,21370,1095.9,17.91,3.96],["W410x53,0",53,68.4,18734,1052.2,16.55,3.84],["W460x68,0",68,87.6,29851,1495.4,18.46,4.06],["W250x73,0",73,92.7,11257,983,11.02,6.48]].map(([n,kg,A,Ix,Zx,rx,ry])=>({n,kg,A,Ix,Zx,rx,ry})).sort((a,b)=>a.kg-b.kg);
// Tubos quadrados (aprox.): A cm², r cm, kg/m
const TUBOS=[["□50x50x3",4.4,5.61,1.91],["□60x60x3",5.3,6.81,2.31],["□70x70x4",8.2,10.4,2.68],["□80x80x4",9.4,12.0,3.07],["□100x100x4",11.9,15.2,3.88],["□100x100x6,3",18.2,23.2,3.80],["□150x150x6,3",28.1,35.8,5.85]].map(([n,kg,A,r])=>({n,kg,A,r}));
// Perfis U simples formados a frio (NBR 6355): bw × bf × t (mm). Propriedades calculadas (cantos vivos, linha média aproximada).
const fmm=x=>String(x).replace(".",",");
function secU(bw,bf,t){const A=bw*t+2*(bf-t)*t,xc=(bw*t*t/2+2*(bf-t)*t*(t+(bf-t)/2))/A;
 const Iy=bw*t**3/12+bw*t*(t/2-xc)**2+2*(t*(bf-t)**3/12+(bf-t)*t*((t+bf)/2-xc)**2),Ix=t*bw**3/12+2*((bf-t)*t**3/12+(bf-t)*t*((bw-t)/2)**2);
 return{tipo:"U",n:`U ${bw}x${bf}x${t.toFixed(2).replace(".",",")}`,bw,bf,t,w:bw,A:A/100,Ix:Ix/1e4,Iy:Iy/1e4,xc,rx:Math.sqrt(Ix/A)/10,ry:Math.sqrt(Iy/A)/10,r:Math.sqrt(Math.min(Ix,Iy)/A)/10,kg:A*0.00785,open:bw-2*t}}
const PERFIS_U=[[50,25],[68,30],[75,40],[92,30],[100,40],[100,50],[127,50],[150,50],[200,50]].flatMap(([bw,bf])=>[1.2,1.5,2,2.25,2.65,3].map(t=>secU(bw,bf,t))).sort((a,b)=>a.kg-b.kg);
// Tubos quadrados formados a frio p/ diagonais e montantes dentro do U (propriedades calculadas)
function secTQ(b,t){const A=b*b-(b-2*t)**2,I=(b**4-(b-2*t)**4)/12;return{tipo:"T",n:`□${b}x${b}x${t.toFixed(2).replace(".",",")}`,b,t,w:b,A:A/100,I:I/1e4,r:Math.sqrt(I/A)/10,kg:A*0.00785,xc:b/2}}
const TUBOS_W=[[20,1.2],[20,1.5],[25,1.2],[25,1.5],[30,1.5],[30,2],[40,1.5],[40,2],[40,3],[50,2],[50,3],[60,2],[60,3],[70,3],[80,3],[90,3],[100,3]].map(([b,t])=>secTQ(b,t));
const ALMA=[...TUBOS_W,...PERFIS_U].sort((a,b)=>a.kg-b.kg);
// Q (flambagem local, NBR 8800 Anexo F) para U: mesas AL (grupo 4) e alma AA; tubos: alma AA nas 4 faces
function Qsec(p,fy){const e=Math.sqrt(E_ACO/fy),AA=(b,t)=>{const bt=b/t;if(bt<=1.40*e)return b;const bef=1.92*t*e*(1-0.34/bt*e);return Math.min(b,Math.max(0,bef))};
 if(p.tipo=="T"){const b=p.b-2*p.t,be=AA(b,p.t);return(p.A*100-4*(b-be)*p.t)/(p.A*100)}
 const bt=(p.bf-p.t)/p.t,Qs=bt<=0.45*e?1:bt<=0.91*e?1.34-0.76*bt/e:0.53*E_ACO/(fy*bt*bt),b=p.bw-2*p.t,be=AA(b,p.t),Qa=(p.A*100-(b-be)*p.t)/(p.A*100);return Qs*Qa}
// resistência de cálculo (kN): tração (N>0 só escoamento bruto) ou compressão com Lc (m)
function NRd(p,fy,Lc){if(!Lc)return p.A*fy/10/1.1;const es=Lc*100/p.r;if(es>200)return 0;const Q=p.tipo?Qsec(p,fy):1,l0=es/Math.PI*Math.sqrt(Q*fy/E_ACO);return chi(l0)*Q*p.A*fy/10/1.1}

// ---- Treliça: geometria por forma, esforços pelo método dos nós (sistema linear), dimensionamento tubo / U simples ----
function solveLin(A,b){const n=b.length;for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;if(Math.abs(A[p][c])<1e-10)return null;[A[c],A[p]]=[A[p],A[c]];[b[c],b[p]]=[b[p],b[c]];
 for(let r=0;r<n;r++){if(r==c)continue;const k=A[r][c]/A[c][c];if(!k)continue;for(let j=c;j<n;j++)A[r][j]-=k*A[c][j];b[r]-=k*b[c]}}return b.map((x,i)=>x/A[i][i])}
// faces externas (m) do banzo inferior (yb) e superior (yt) na abscissa x
function trelForma(v){const fo=v.forma||"Plana horizontal",duas=(v.aguas||"").startsWith("Duas"),s=(v.inc??10)/100,L=v.L,rr=parseInt(v.r.slice(2)),h=L/rr,hm=v.hmin??0.5;
 const a=x=>duas?Math.min(x,L-x):x;
 if(fo.startsWith("Plana inclinada"))return{yb:x=>s*a(x),yt:x=>s*a(x)+h,tag:"plana inclinada",duas,h};
 if(fo.startsWith("Banzo superior"))return{yb:x=>0,yt:x=>hm+s*a(x),tag:"banzo superior inclinado",duas,h:hm};
 return{yb:x=>0,yt:x=>h,tag:"plana horizontal",duas:false,h}}
// monta e resolve: off = {xs,xi,ts,ti} em mm (U) para eixos/cortes
function trelSolve(v,off){const F=trelForma(v),L=v.L;let np=Math.ceil(L/v.p);if(F.duas&&np%2)np++;const dx=L/np,n1=np+1,o=off||{xs:0,xi:0,ts:0,ti:0};
 const sl=(f,x)=>(f(Math.min(L,x+1e-4))-f(Math.max(0,x-1e-4)))/(Math.min(L,x+1e-4)-Math.max(0,x-1e-4)),cs=(f,x)=>1/Math.sqrt(1+sl(f,x)**2);
 const N=[];for(let i=0;i<n1;i++){const x=i*dx;N.push([x,F.yb(x)+o.xi/1000/cs(F.yb,x)])}for(let i=0;i<n1;i++){const x=i*dx;N.push([x,F.yt(x)-o.xs/1000/cs(F.yt,x)])}
 const B=i=>i,T=i=>n1+i,M=[];for(let i=0;i<np;i++)M.push({a:B(i),b:B(i+1),g:"inf"});for(let i=0;i<np;i++)M.push({a:T(i),b:T(i+1),g:"sup"});
 for(let i=0;i<n1;i++)M.push({a:B(i),b:T(i),g:"mon"});for(let i=0;i<np;i++){const mid=(i+0.5)*dx<L/2||(!F.duas&&!F.tag.startsWith("plana h")&&false);M.push(mid?{a:T(i),b:B(i+1),g:"dia"}:{a:B(i),b:T(i+1),g:"dia"})}
 M.forEach(m=>{const[xa,ya]=N[m.a],[xb,yb]=N[m.b];m.l=Math.hypot(xb-xa,yb-ya);m.c=(xb-xa)/m.l;m.s=(yb-ya)/m.l});
 const nu=M.length+3,ne=2*N.length;if(nu!=ne)return null;const A=Array.from({length:ne},()=>new Array(nu).fill(0)),f=new Array(ne).fill(0);
 M.forEach((m,k)=>{A[2*m.a][k]+=m.c;A[2*m.a+1][k]+=m.s;A[2*m.b][k]-=m.c;A[2*m.b+1][k]-=m.s});
 const R0=M.length;A[0][R0]=1;A[1][R0+1]=1;A[2*B(np)+1][R0+2]=1;
 const P=[];let Pt=0;for(let i=0;i<n1;i++){const w=1.4*v.q*(i==0||i==np?dx/2:dx);P.push(w);Pt+=w;f[2*T(i)+1]=w}// A·u = f  (carga para baixo)
 const u=solveLin(A.map(r=>r.slice()),f.slice());if(!u)return null;M.forEach((m,k)=>m.N=u[k]);const Rx=u[R0],Ra=u[R0+1],Rb=u[R0+2];
 let res=0;for(let r=0;r<ne;r++){let s=0;for(let k=0;k<nu;k++)s+=A[r][k]*u[k];res=Math.max(res,Math.abs(s-f[r]))}
 // comprimentos de corte (entre faces internas das almas do U) para montantes e diagonais
 M.forEach(m=>{if(m.g=="mon"||m.g=="dia"){const[xa]=N[m.a],[xb]=N[m.b],cl=x=>(F.yt(x)-o.ts/1000/cs(F.yt,x))-(F.yb(x)+o.ti/1000/cs(F.yb,x)),ax=x=>(F.yt(x)-o.xs/1000/cs(F.yt,x))-(F.yb(x)+o.xi/1000/cs(F.yb,x));
  const k=(cl(xa)+cl(xb))/(ax(xa)+ax(xb));m.lc=m.l*k}else m.lc=m.l});
 const hs=N.slice(0,n1).map((p,i)=>F.yt(p[0])-F.yb(p[0]));
 return{F,N,M,np,dx,n1,Rx,Ra,Rb,Pt,res,hmin:Math.min(...hs),hmax:Math.max(...hs)}}
const GN={sup:"Banzo superior",inf:"Banzo inferior",dia:"Diagonais",mon:"Montantes"};
// envoltória de um grupo: maior compressão (com Lc do próprio membro) e maior tração
const passa=(p,fy,ms,useLc)=>ms.every(m=>m.N>=0?NRd(p,fy,0)>=m.N:NRd(p,fy,useLc?m.lc:m.l)>=-m.N);
const uso=(p,fy,ms,useLc)=>Math.max(...ms.map(m=>m.N>=0?m.N/NRd(p,fy,0):(-m.N)/(NRd(p,fy,useLc?m.lc:m.l)||1e-9)));
function trelica(v){const fy=parseInt(v.fy),U=!!(v.sec&&v.sec.startsWith("Perfil U")),fo=v.fo??2,warn=[];
 const manU=U&&v.ub&&v.ub!="Automático"?PERFIS_U.find(x=>x.n==v.ub):null,manW=U&&v.wm&&v.wm!="Automático"?ALMA.find(x=>x.n==v.wm):null;
 let off={xs:0,xi:0,ts:0,ti:0},G,s,i,w,op=1e9,wAuto=null;
 for(let it=0;it<4;it++){G=trelSolve(v,off);if(!G)return{steps:[],res:[["Resultado","Geometria inválida (verifique altura/inclinação)"]],warn:["Geometria inválida."]};
  const grp=g=>G.M.filter(m=>m.g==g),web=[...grp("dia"),...grp("mon")];
  if(!U){const pk=(ms)=>TUBOS.find(t=>passa(t,fy,ms,false));s=pk(grp("sup"));i=pk(grp("inf"));w=pk(web);break}
  const sL=manU?[manU]:PERFIS_U.filter(p=>passa(p,fy,grp("sup"),false)),iL=manU?[manU]:PERFIS_U.filter(p=>passa(p,fy,grp("inf"),false));
  let best=null;const Ltot=g=>grp(g).reduce((a,m)=>a+m.l,0),Lw=web.reduce((a,m)=>a+m.lc,0);
  for(const a of sL.slice(0,40))for(const b of iL.slice(0,40)){const o2=Math.min(a.open,b.open),ww=ALMA.find(x=>x.w<=o2-fo&&passa(x,fy,web,true));const tot=a.kg*Ltot("sup")+b.kg*Ltot("inf")+(ww?ww.kg*Lw:1e9);if(!best||tot<best.tot)best={a,b,ww,o2,tot}}
  if(!best){const strong=(ms)=>PERFIS_U.reduce((x,y)=>uso(y,fy,ms,false)<uso(x,fy,ms,false)?y:x);const a=strong(grp("sup")),b=strong(grp("inf")),o2=Math.min(a.open,b.open);best={a,b,o2,ww:ALMA.find(x=>x.w<=o2-fo&&passa(x,fy,web,true))};best.fail=1}
  const prev=s;s=best.a;i=best.b;op=best.o2;wAuto=best.ww;w=manW||wAuto;const no={xs:s.xc,xi:i.xc,ts:s.t,ti:i.t};const same=prev===s&&off.xs==no.xs&&off.xi==no.xi;off=no;if(best.fail&&it==3)warn.push("Nenhum perfil U simples da tabela atende aos banzos: exibido o mais resistente — reduzir o painel, aumentar a altura ou reduzir vão/carga.");if(same){if(best.fail)warn.push("Nenhum perfil U simples da tabela atende aos banzos: exibido o mais resistente — reduzir o painel, aumentar a altura ou reduzir vão/carga.");break}}
 const grp=g=>G.M.filter(m=>m.g==g),web=[...grp("dia"),...grp("mon")],fit=U&&w?w.w<=op-fo:true;
 if(!U&&[s,i,w].some(x=>!x))warn.push("Algum elemento excede a tabela de tubos: aumentar a altura ou usar perfis maiores.");
 if(U&&manW){if(!fit)warn.push(`${manW.n} (largura ${fmm(manW.w)} mm) não cabe no U: abertura livre ${f(op,1)} mm − folga ${f(fo,1)} mm = ${f(op-fo,1)} mm disponíveis.${wAuto?` Sugestão que cabe e atende: <b>${wAuto.n}</b>.`:" Nenhum perfil da tabela cabe e atende: usar banzo com alma maior."}`);else if(!passa(manW,fy,web,true))warn.push(`${manW.n} cabe no U, mas não atende aos esforços.${wAuto?` Sugestão: <b>${wAuto.n}</b>.`:""}`)}
 if(U&&!w)warn.push("Nenhum perfil de diagonal/montante da tabela cabe na abertura do U e atende aos esforços: usar banzo com alma maior.");
 if(U&&manU){if(!passa(s,fy,grp("sup"),false))warn.push(`Banzo superior ${s.n} não atende aos esforços.`);if(!passa(i,fy,grp("inf"),false))warn.push(`Banzo inferior ${i.n} não atende aos esforços.`)}
 const prof={sup:s,inf:i,dia:w,mon:w},useLc=g=>U&&(g=="dia"||g=="mon");
 const crit=g=>{const ms=grp(g),c=ms.filter(m=>m.N<0).sort((a,b)=>a.N-b.N)[0],t=ms.filter(m=>m.N>0).sort((a,b)=>b.N-a.N)[0];return{c,t}};
 const rows=["sup","inf","dia","mon"].map(g=>{const p=prof[g],{c,t}=crit(g),Lc=c?(useLc(g)?c.lc:c.l):0,Rc=p&&c?NRd(p,fy,Lc):0,Rt=p?NRd(p,fy,0):0,u=p?uso(p,fy,grp(g),useLc(g)):0;
  return`<tr><td>${GN[g]}</td><td>${p?p.n:"—"}</td><td>${p?f(p.A,2):"—"}</td><td>${p?f(p.kg,2):"—"}</td><td>${c?f(-c.N,2):"—"}</td><td>${c?f(Lc,2):"—"}</td><td>${c?f(Rc,2):"—"}</td><td>${t?f(t.N,2):"—"}</td><td>${p?f(Rt,2):"—"}</td><td>${p?f(u*100,0)+"%":"—"}</td>${U?`<td>${g=="dia"||g=="mon"?(p?(fit?"✔ ":"✖ ")+f(p.w,1)+" ≤ "+f(op-fo,1):"—"):"abertura "+(p?f(p.open,1):"—")}</td>`:""}</tr>`}).join("");
 const lab=m=>{const k=G.M.filter(x=>x.g==m.g).indexOf(m)+1;return({sup:"S",inf:"I",dia:"D",mon:"M"})[m.g]+k};
 const html=`<h4 class="ftrh">Verificação por grupo (envoltória — método dos nós)</h4><div class="ftrw"><table class="ftr"><thead><tr><th>Grupo</th><th>Perfil</th><th>A (cm²)</th><th>kg/m</th><th>Nc,Sd (kN)</th><th>Lc (m)</th><th>Nc,Rd (kN)</th><th>Nt,Sd (kN)</th><th>Nt,Rd (kN)</th><th>Uso</th>${U?"<th>Encaixe (mm)</th>":""}</tr></thead><tbody>${rows}</tbody></table></div>
 <details><summary>Esforços em todas as barras (+ tração / − compressão)</summary><div class="ftrw"><table class="ftr"><thead><tr><th>Barra</th><th>Nó i → j</th><th>Compr. eixo (m)</th>${U?"<th>Corte (m)</th>":""}<th>N (kN)</th></tr></thead><tbody>${G.M.map(m=>`<tr><td>${lab(m)}</td><td>${m.a+1} → ${m.b+1}</td><td>${f(m.l,3)}</td>${U?`<td>${f(m.lc,3)}</td>`:""}<td>${f(m.N,2)}</td></tr>`).join("")}</tbody></table></div></details>`;
 const Lg=g=>grp(g).reduce((a,m)=>a+(useLc(g)?m.lc:m.l),0),peso=["sup","inf","dia","mon"].reduce((a,g)=>a+(prof[g]?prof[g].kg*Lg(g):0),0);
 const eq=Math.abs(G.Ra+G.Rb-G.Pt);if(eq>1e-6*G.Pt||G.res>1e-6*G.Pt)warn.push("Verificação de equilíbrio não fechou — revisar geometria.");
 const dmax=grp("dia").reduce((a,m)=>m.lc>a.lc?m:a),mmax=grp("mon").reduce((a,m)=>m.lc>a.lc?m:a);
 const __={U,s,i,w,F:G.F,G,op,fo,fit,np:G.np,p:G.dx,H:G.hmax,hef:Math.max(...grp("mon").map(m=>m.l)),cl:mmax.lc,lc:dmax.lc};
 const st=[["Forma",G.F.tag+(G.F.duas?" — duas águas":G.F.tag.startsWith("plana h")?"":" — uma água"),`${G.np} painéis de ${f(G.dx,3)} m${G.F.tag.startsWith("plana h")?"":` · inclinação ${f(v.inc,2)}% (${f(Math.atan(v.inc/100)*180/Math.PI,2)}°)`}`],
  ["Alturas",U?"face externa a face externa":"entre eixos dos banzos",`mín. ${f(G.hmin,3)} m · máx. ${f(G.hmax,3)} m`],["Cargas nodais (banzo sup.)","P = 1,4·q·p (meio painel nos apoios)",`${f(1.4*v.q*G.dx,2)} kN ; total ΣP = ${f(G.Pt,2)} kN`],
  ["Método dos nós","ΣFx = 0 e ΣFy = 0 em cada nó (2·nós equações = barras + 3 reações)",`${G.N.length} nós, ${G.M.length} barras`],["Reações","apoio fixo esq. + móvel dir.",`RA = ${f(G.Ra,2)} kN ; RB = ${f(G.Rb,2)} kN ; HA = ${f(Math.abs(G.Rx)<1e-9?0:G.Rx,2)} kN`],
  ["Equilíbrio global","RA + RB = ΣP",`${f(G.Ra+G.Rb,2)} = ${f(G.Pt,2)} kN ✔ (resíduo máx. nos nós ${G.res.toExponential(1).replace(".",",")} kN)`],
  ...["sup","inf","dia","mon"].map(g=>{const{c,t}=crit(g);return[`${GN[g]} — envoltória`,"N máx (tração) / N mín (compressão)",`${t?f(t.N,2):"0,00"} kN / ${c?f(c.N,2):"0,00"} kN`]})];
 if(U)st.push(["Abertura livre do U","a = bw − 2t (menor dos banzos)",`${f(op,1)} mm ; largura máx. da alma = ${f(op-fo,1)} mm`],["Cortes","entre as faces internas das almas",`maior montante ${f(mmax.lc,3)} m ; maior diagonal ${f(dmax.lc,3)} m`]);
 return{__,html,steps:st,res:[["Forma",G.F.tag+(G.F.duas?" (duas águas)":G.F.tag.startsWith("plana h")?"":" (uma água)")],["Altura mín. / máx.",`${f(G.hmin,2)} m / ${f(G.hmax,2)} m`],["Banzo superior",s?s.n:"acima da tabela"],["Banzo inferior",i?i.n:"acima da tabela"],["Diagonais e montantes",w?`${w.n}${U?(fit?" — cabe no U":" — NÃO cabe no U"):""}`:"acima da tabela"],["Peso da treliça (perfis)",`${f(peso,2)} kg`]],warn}}
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
{id:"trelica",g:"Estrutura metálica",t:"Treliça metálica",refs:["ABNT NBR 8800:2008 — tração (5.2) e compressão (5.3), Anexo F (flambagem local)","ABNT NBR 6355:2012 — perfis estruturais de aço formados a frio (U simples)","ABNT NBR 14762:2010 — estruturas de aço com perfis formados a frio","Método dos nós (equilíbrio de nós, treliça isostática)","Regra prática de altura h ≈ L/10 a L/15"],
 inp:[["forma","Forma da treliça","","Plana horizontal",null,null,["Plana horizontal","Plana inclinada (banzos paralelos)","Banzo superior inclinado"]],["aguas","Caimento","","Uma água",null,null,["Uma água","Duas águas"]],["inc","Inclinação","%",10,0,100],["hmin","Altura mínima no apoio","m",0.5,0.1,10],
  ["L","Vão","m",15],["q","Carga distribuída (característica, projeção horizontal)","kN/m",6],["r","Relação altura/vão","","L/12",null,null,["L/10","L/12","L/15"]],["p","Comprimento do painel (entre nós)","m",1.5],["fy","Aço fy","MPa","300 (tubos)",null,null,["250 (ASTM A36)","300 (tubos)","345 (ASTM A572 Gr.50)"]],
  ["sec","Seção dos banzos","","Tubo quadrado",null,null,["Tubo quadrado","Perfil U simples (NBR 6355)"]],
  ["ub","Perfil U dos banzos","","Automático",null,null,["Automático",...PERFIS_U.slice().sort((a,b)=>a.bw-b.bw||a.bf-b.bf||a.t-b.t).map(p=>p.n)]],
  ["wm","Diagonais e montantes (encaixados no U)","","Automático",null,null,["Automático",...ALMA.slice().sort((a,b)=>a.w-b.w||a.tipo.localeCompare(b.tipo)||a.kg-b.kg).map(p=>p.n)]],
  ["fo","Folga lateral total no encaixe","mm",2,0,10]],
 hip:["Treliça biapoiada (apoio fixo à esquerda e móvel à direita, ambos no banzo inferior), carga uniforme em projeção horizontal concentrada nos nós do banzo superior; γf = 1,4.","Esforços pelo método dos nós: sistema de equilíbrio ΣFx = ΣFy = 0 em todos os nós (treliça isostática: barras + 3 reações = 2 × nós), com verificação do equilíbrio global (RA + RB = ΣP).","Montantes em todos os nós; diagonais descendo do banzo superior para o centro do vão (padrão Pratt — diagonais tracionadas sob carga gravitacional). Duas águas: número de painéis par (cumeeira em nó).","Plana horizontal e plana inclinada: altura vertical = L/r constante. Banzo superior inclinado: altura mínima no apoio + inclinação (uma água: cresce até o apoio direito; duas águas: máxima no centro).","Cada grupo (banzo sup., banzo inf., diagonais + montantes) usa um único perfil verificado à envoltória: compressão com Lc = comprimento da barra (χ NBR 8800) e tração por escoamento da seção bruta; esbeltez ≤ 200.","Tubos: propriedades aproximadas, Q = 1. Perfil U simples: alma no plano horizontal, mesas voltadas para dentro; diagonais e montantes entram entre as mesas (abertura = bw − 2t − folga); nós nos eixos (centroide x̄); cortes entre as faces internas das almas; flambagem local pelo Anexo F; banzo travado fora do plano em todos os nós; flexo-torção e distorção (NBR 14762) não verificadas.","Não considera sucção de vento (inversão de esforços), cargas concentradas nem excentricidades das ligações."],
 calc:v=>trelica(v)}
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
,
{id:"traco",g:"Execução em obra",t:"Preparo do traço de concreto",refs:["ABNT NBR 12655:2022 — Concreto de cimento Portland: preparo, controle, recebimento (fcj = fck + 1,65·sd; condições de preparo A, B e C)","ABNT NBR 6118:2023 — classes mínimas de concreto estrutural (C20; C25 em CAA II)","ABNT NBR 16889 — abatimento do tronco de cone (slump)","Helene, P.; Terzian, P. — Manual de dosagem e controle do concreto (método IPT/EPUSP: curvas de Abrams, Lyse e Molinari)","ABCP — Guia prático de dosagem / tabelas de traços de referência para obras"],
 inp:[["fck","Resistência característica fck","","25 MPa",null,null,["10 MPa","15 MPa","20 MPa","25 MPa","30 MPa","35 MPa","40 MPa","45 MPa"]],
  ["cond","Condição de preparo (NBR 12655)","","B — cimento em massa, agregados em volume com correção da umidade (sd = 5,5 MPa)",null,null,["A — tudo em massa, umidade medida (sd = 4,0 MPa)","B — cimento em massa, agregados em volume com correção da umidade (sd = 5,5 MPa)","C — cimento em massa, agregados em volume, umidade estimada (sd = 7,0 MPa)"]],
  ["slump","Abatimento (slump)","","80 ± 10 mm — usual (lajes, vigas, pilares)",null,null,["50 ± 10 mm — seco (pisos, pré-moldados)","80 ± 10 mm — usual (lajes, vigas, pilares)","100 ± 20 mm — plástico (peças densamente armadas)"]],
  ["brita","Agregado graúdo","","Brita 1 (9,5–19 mm)",null,null,["Brita 1 (9,5–19 mm)","Brita 0 (4,8–9,5 mm)"]],
  ["prep","Tipo de preparo / medida","","Betoneira",null,null,["Latas de 18 L","Padiola 35 × 45 × 23 cm (36,23 L)","Betoneira"]],
  ["bet","Betoneira (capacidade nominal do tambor)","","400 L",null,null,["250 L","400 L","600 L"]],
  ["Vt","Volume de concreto a produzir","m³",1,0.05,100]],
 hip:["Traço de REFERÊNCIA (não é dosagem experimental): relação a/c pela curva de Abrams fc28 ≈ 154 / 17,4^(a/c), calibrada nas tabelas práticas de referência para CP II-32 / CP IV-32 (a/c 0,65 → 24 MPa; 0,60 → 29; 0,55 → 34; 0,50 → 39; 0,40 → 49 MPa); teor de argamassa α = 51% (50% p/ slump 50 mm, 53% p/ 100 mm); m = a + p pela lei de Lyse típica m ≈ 13·(a/c) − 2,7 (±0,5 conforme o abatimento; brita 0: −0,6).","Resistência de dosagem fcj = fck + 1,65·sd (NBR 12655), sd conforme a condição de preparo escolhida.","Massas específicas: cimento 3,10; areia 2,63; brita 2,70 kg/dm³; ar incorporado 2%. Consumo de cimento C = 980 / (1/3,10 + a/2,63 + p/2,70 + a/c) kg/m³.","Volume ↔ massa: cimento 1,42 kg/dm³ (saco de 50 kg ≈ 35,21 L); areia seca 1,50 kg/dm³, areia úmida com inchamento 1,25 e umidade 4% (água da areia descontada da água de amassamento); brita 1,40 kg/dm³ (brita 0: 1,35).","Latas de 18 L e padiola 35 × 45 × 23 cm = 36,23 L, medidas rasas. Preparo manual/latas/padiola: 1 saco por traço (masseira).","Betoneira: carga seca por betonada ≈ 62% da capacidade nominal do tambor (250 L ≈ 155 L; 400 L ≈ 248 L; 600 L ≈ 372 L de materiais secos), arredondada para ½ saco; rendimento = sacos × 50 / C.","Tempo de mistura na betoneira ≥ 90 s após a colocação de todos os materiais; ordem: parte da água + brita, cimento, areia, restante da água."],
 calc(v){const fck=parseInt(v.fck),sd={A:4,B:5.5,C:7}[v.cond[0]],fcj=fck+1.65*sd,ac0=Math.log(154/fcj)/Math.log(17.4),ac=Math.min(0.80,Math.max(0.35,Math.round(ac0*100)/100));
  const sl=v.slump.startsWith("50")?0:v.slump.startsWith("80")?1:2,al=[0.50,0.51,0.53][sl],b0=v.brita.startsWith("Brita 0");
  let m=13*ac-2.7+[0.5,0,-0.5][sl]-(b0?0.6:0);m=Math.max(2.5,m);const a=Math.round((al*(1+m)-1)*10)/10,pp=Math.round((m-a)*10)/10,x=ac;
  const C=980/(1/3.10+a/2.63+pp/2.70+x),yb=b0?1.35:1.40;
  const Vc=50/1.42,Va=50*a/1.50*1.25,Vb=50*pp/yb,ag=50*x-0.04*50*a; // por saco (L)
  const VsecoSaco=Vc+Va+Vb,rendSaco=50/C; // m³ por saco
  const pr=v.prep[0],cap=parseInt(v.bet),carga=cap*0.62;let sac=1;if(pr==="B"){sac=Math.max(0.5,Math.floor(carga/VsecoSaco*2)/2)}
  const unid=pr==="L"?18:pr==="P"?36.225:null,un=pr==="L"?"latas de 18 L":pr==="P"?"padiolas":"";
  const rend=sac*rendSaco,nb=1/rend,nt=v.Vt/rend;
  const med=L=>unid?`${f(L/unid)} ${un} (${f(L)} L)`:`${f(L)} L`;
  const tb=`<table class="ftr"><thead><tr><th>Material</th><th>Por ${pr==="B"?"betonada":"traço (1 saco)"}</th><th>Por m³</th><th>Total (${f(v.Vt)} m³)</th></tr></thead><tbody>
<tr><td>Cimento (saco 50 kg)</td><td>${f(sac)} saco(s) = ${f(sac*50)} kg</td><td>${f(C/50)} sacos = ${f(C)} kg</td><td>${f(C*v.Vt/50)} sacos</td></tr>
<tr><td>Areia média úmida</td><td>${med(Va*sac)}</td><td>${f(Va/1000/rendSaco)} m³ (${f(C*a)} kg seca)</td><td>${f(Va/1000/rendSaco*v.Vt)} m³</td></tr>
<tr><td>${b0?"Brita 0":"Brita 1"}</td><td>${med(Vb*sac)}</td><td>${f(Vb/1000/rendSaco)} m³ (${f(C*pp)} kg)</td><td>${f(Vb/1000/rendSaco*v.Vt)} m³</td></tr>
<tr><td>Água (já descontada a umidade da areia)</td><td>${f(ag*sac)} L</td><td>${f(ag/rendSaco)} L</td><td>${f(ag/rendSaco*v.Vt)} L</td></tr></tbody></table>`;
  const warn=[];
  if(fck<20)warn.push("fck < 20 MPa não é concreto estrutural (NBR 6118 exige no mínimo C20; C25 em ambiente urbano, CAA II): use apenas para contrapiso, lastro, calçada ou concreto magro.");
  if(fck>=25)warn.push("fck ≥ 25 MPa: recomenda-se dosagem experimental (estudo de traço) com os materiais da obra e controle por corpos de prova; para peças estruturais, o traço deve ser definido/validado por laboratório ou concreteira.");
  if(fck>=40)warn.push("fck 40–45 MPa: exige dosagem em central (concreto usinado), aditivo superplastificante e controle tecnológico — não é viável com segurança em betoneira de obra; o traço mostrado é só referência teórica.");
  if(v.cond[0]==="C"&&fck>15)warn.push("NBR 12655: a condição C só é permitida para C10 e C15. Use condição B (até C25) ou A.");
  if(v.cond[0]==="B"&&fck>25)warn.push("NBR 12655: a condição B é permitida até C25. Para C30 ou mais use condição A (materiais em massa).");
  if(ac0<0.35)warn.push("a/c calculado abaixo de 0,35 — limitado a 0,35; requer aditivo e dosagem experimental.");
  if(pr!=="B"&&v.Vt>3)warn.push("Mais de 3 m³ com mistura manual: prefira betoneira ou concreto usinado.");
  return{steps:[["Resistência de dosagem","fcj = fck + 1,65·sd",`${fck} + 1,65 × ${f(sd)} = ${f(fcj)} MPa`],["Relação água/cimento (Abrams de referência, CP II/IV-32)","a/c = log(154/fcj) / log 17,4",`${f(ac0,3)} → adotado ${f(ac)}`],["Agregado total (Lyse típica)","m = 13·(a/c) − 2,7 ± ajuste",`m = ${f(a+pp)}`],["Teor de argamassa","a = α(1 + m) − 1 ; p = m − a",`α = ${f(al*100)}% → a = ${f(a)} ; p = ${f(pp)}`],["Consumo de cimento","C = 980 / (1/3,10 + a/2,63 + p/2,70 + a/c)",`${f(C)} kg/m³`],["Traço em volume por saco",`Vareia = 50·a/1,50×1,25 ; Vbrita = 50·p/${f(yb)}`,`areia ${f(Va)} L ; brita ${f(Vb)} L ; cimento ${f(Vc)} L`],["Água por saco","50·a/c − 4% × 50·a",`${f(ag)} L`],
   ...(pr==="B"?[["Carga da betoneira",`carga seca ≈ 62% × ${cap} L = ${f(carga)} L`,`materiais secos por saco ${f(VsecoSaco)} L → ${f(sac)} saco(s) por betonada`]]:[]),["Rendimento","V = sacos × 50 / C",`${f(rend*1000)} L por ${pr==="B"?"betonada":"traço"} → ${f(nb)} ${pr==="B"?"betonadas":"traços"}/m³`]],
   res:[["Traço unitário em massa (cimento : areia : brita : a/c)",`<b>1 : ${f(a)} : ${f(pp)} : ${f(x)}</b>`],["Traço em volume por saco de 50 kg",`1 saco : ${f(Va)} L areia úmida : ${f(Vb)} L brita : ${f(ag)} L água`],["Consumo de cimento",`${f(C)} kg/m³ (${f(C/50)} sacos/m³)`],["Relação água/cimento",f(x)],
    ["Rendimento",`${f(rend*1000)} L por ${pr==="B"?`betonada (${v.bet})`:"traço"} · ${f(nb)} por m³ · ${f(nt)} para ${f(v.Vt)} m³`],["Classificação","Traço de referência — conferir com dosagem experimental"]],warn,html:`<h4 class="ftrh">Quantidades de materiais</h4><div class="ftrw">${tb}</div>`}}}
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
mat("trelica",[["nel","Quantidade de treliças iguais","un",1,1,500]],(v,r)=>{const u=r.__;if(!u||!u.s||!u.i||!u.w)return null;const ms=g=>u.G.M.filter(m=>m.g==g),sum=(g,c)=>+ms(g).reduce((a,m)=>a+(c?m.lc:m.l),0).toFixed(3);
 return{perfis:[["Banzo superior (soma dos trechos)",u.s,sum("sup"),1],["Banzo inferior (soma dos trechos)",u.i,sum("inf"),1],[`Diagonais (${ms("dia").length} un${u.U?", corte entre almas":""})`,u.w,sum("dia",u.U),1],[`Montantes (${ms("mon").length} un${u.U?", corte entre almas":""})`,u.w,sum("mon",u.U),1]]}});
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
 W("trelica",(v,r)=>r.__?[r.__.s,r.__.i,r.__.w,r.__.hef]:null)})();

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
 ${M.perfis.length?`<h4>Lista de perfis</h4><table class="${cls}"><thead><tr><th>Elemento</th><th>Perfil</th><th>Qtd</th><th>Compr. (m)</th><th>kg/m</th><th>Peso (kg)</th></tr></thead><tbody>${M.perfis.map(([a,p,q,l,m,kg])=>`<tr><td>${a}</td><td>${p}</td><td class="n">${q}</td><td class="n">${f(l,2)}</td><td class="n">${f(m,2)}</td><td class="n">${f(kg,2)}</td></tr>`).join("")}</tbody></table>`:""}
 <p class="fnote">Estimativa de quantitativos para orçamento preliminar. ${M.notas.join(" ")}</p>`}
function run(){if(cur.id=="trelica"){const u=$("#i-sec").value.startsWith("Perfil U"),fm=$("#i-forma").value,hz=fm.startsWith("Plana h"),bs=fm.startsWith("Banzo");["ub","wm","fo"].forEach(k=>$("#i-"+k).closest("label").hidden=!u);["aguas","inc"].forEach(k=>$("#i-"+k).closest("label").hidden=hz);$("#i-hmin").closest("label").hidden=!bs;$("#i-r").closest("label").hidden=bs}const t=cur,{v,err}=readVals(t),box=$("#fres"),mo=$("#fmatout");if(err.length){last=null;box.innerHTML=`<div class="ferr">${err.map(esc).join("<br>")}</div>`;mo.innerHTML="";return}
  const r=t.calc({...v}),M=MAT(t,{...v},r);last={t,v,r,M};
  box.innerHTML=`<h3>Resultado</h3><dl>${r.res.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl>${r.html||""}${r.warn.length?`<div class="fwarn">${r.warn.join("<br>")}</div>`:""}
  <details open><summary>Passo a passo</summary><ol>${r.steps.map(([a,b,c])=>`<li><b>${a}</b><br><code>${b}</code><br>${c}</li>`).join("")}</ol></details>
  <button class="btn" id="fmem" type="button">Gerar memória de cálculo</button><p class="fdisc">Pré-dimensionamento orientativo — não substitui projeto estrutural com ART.</p>`;
  mo.innerHTML=M?`<div class="fmatbox">${matHTML(M)}</div>`:"";const dr=DRAW[t.id]?DRAW[t.id]({...v},r):"";$("#fdraw").innerHTML=dr?`<h3>Desenho esquemático <small>(cotas atualizadas com o resultado — sem escala)</small></h3>${dr}`:"";$("#fmem").onclick=memorial}
function memorial(){if(!last)return;const {t,v,r,M}=last,el=$("#proposta"),hoje=new Date().toLocaleDateString("pt-BR");
  el.innerHTML=`<div class="pp-head"><img src="assets/img/logo-fsantos.png" alt=""><div><strong>FSantos Engenharia — Santos Projetos & Orçamentos</strong><br>Eng. Civil Francirley Pereira Santos — CREA 31.410-AM</div></div>
  <p class="pp-flag">Pré-dimensionamento orientativo — não substitui projeto estrutural com ART</p><h2>MEMÓRIA DE CÁLCULO</h2><p class="pp-sub">${t.g} — ${t.t}</p><p>Manaus/AM, ${hoje}</p>
  <h3>1. Dados de entrada</h3><table class="pp-t"><tbody>${allInp(t).map(([id,lab,un])=>`<tr><td>${lab}</td><td>${typeof v[id]=="number"?f(v[id],v[id]%1?2:0):esc(v[id])} ${un&&un!="—"?un:""}</td></tr>`).join("")}</tbody></table>
  <h3>2. Hipóteses</h3><ul>${t.hip.map(h=>`<li>${h}</li>`).join("")}</ul>
  <h3>3. Cálculo passo a passo</h3><table class="pp-t"><thead><tr><th>Etapa</th><th>Fórmula</th><th>Resultado</th></tr></thead><tbody>${r.steps.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join("")}</tbody></table>
  <h3>4. Resultados</h3><table class="pp-t"><tbody>${r.res.map(([a,b])=>`<tr><td><b>${a}</b></td><td><b>${b}</b></td></tr>`).join("")}</tbody></table>${r.html?r.html.replace('class="ftr"','class="pp-t ftr"'):""}${r.warn.length?`<p><b>Observações:</b> ${r.warn.join(" ")}</p>`:""}
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
