// Desenhos esquemáticos cotados das ferramentas — FSantos Engenharia
const DRAW=(()=>{const{N,A,STL,SV,R,L,P,PL,C,T,TB,DH,DV,BAR,DOT,CO,LD,ARW,BOX,GROUND}=K;
const fm=(x,d=2)=>(+x).toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d});
const cmT=m=>fm(m*100,0)+" cm";
const ttl=(x,y,s)=>T(x,y,s,13,"start",N,800);
const LOADS=(x1,x2,y,n=6,lab="")=>{let s="";for(let i=0;i<n;i++){const x=x1+(x2-x1)*i/(n-1);s+=ARW(x,y-26,x,y-2,"#c0392b",1.6)}return s+L(x1,y-26,x2,y-26,"#c0392b",1.2)+(lab?T((x1+x2)/2,y-31,lab,11,"middle","#c0392b"):"")};
const SUP=(x,y)=>P([[x,y],[x-9,y+14],[x+9,y+14]],"#cfd6df",N)+L(x-13,y+16,x+13,y+16,N,1.5);
// perfil W (seção)
function WSEC(cx,cy,p,sc){const d=parseInt(p.n.slice(1)),bf=Math.round(p.ry/0.215*10/5)*5,k=sc/Math.max(d,bf),D=d*k,B=bf*k,tf=Math.max(3,D*0.06),tw=Math.max(2.5,B*0.05);
 return P([[cx-B/2,cy-D/2],[cx+B/2,cy-D/2],[cx+B/2,cy-D/2+tf],[cx+tw/2,cy-D/2+tf],[cx+tw/2,cy+D/2-tf],[cx+B/2,cy+D/2-tf],[cx+B/2,cy+D/2],[cx-B/2,cy+D/2],[cx-B/2,cy+D/2-tf],[cx-tw/2,cy+D/2-tf],[cx-tw/2,cy-D/2+tf],[cx-B/2,cy-D/2+tf]],"#7f8c9b",N,1.3)
 +DV(cy-D/2,cy+D/2,cx-B/2-14,`d ≈ ${d} mm`,8)+DH(cx-B/2,cx+B/2,cy+D/2+20,`bf ≈ ${bf} mm`,14)+LD(cx+tw/2,cy+5,cx+B/2+14,cy+12,"alma (tw)")+LD(cx+B/3,cy-D/2+tf/2,cx+B/2+14,cy-D/2-6,"mesa (tf)")+T(cx,cy-D/2-12,p.n,13,"middle",N,800)}
const D={};
D.sapata=(v,r)=>{const[B,Lx,h]=r._,a=v.a/100,b=v.b/100,k=230/Lx,hp=Math.max(22,h*k),G=80,yt=190,x0=60,Lp=Lx*k;
 let s=GROUND(G,640,330,[[x0-15,x0+Lp+15,yt+hp+8]])+R(x0-15,yt+hp,Lp+30,8,"con",N)+R(x0,yt,Lp,hp,"con",N,1.5)+R(x0+Lp/2-a*k/2,58,a*k,yt-58,"con",N,1.5);
 s+=BAR([[x0+6,yt+6],[x0+6,yt+hp-6],[x0+Lp-6,yt+hp-6],[x0+Lp-6,yt+6]]);for(let i=0;i<9;i++)s+=DOT(x0+12+i*(Lp-24)/8,yt+hp-10,2.6);
 [-1,1].forEach(sg=>s+=BAR([[x0+Lp/2+sg*(a*k/2-6),62],[x0+Lp/2+sg*(a*k/2-6),yt+hp-12],[x0+Lp/2+sg*(a*k/2-6)+sg*-0,yt+hp-12]],2.5));
 s+=DH(x0,x0+Lp,yt+hp+30,`L = ${cmT(Lx)}`,22)+DV(yt,yt+hp,x0+Lp+30,`h = ${cmT(h)}`,24)+DH(x0+Lp/2-a*k/2,x0+Lp/2+a*k/2,50,`a = ${fm(v.a,0)} cm`)+LD(x0+Lp*0.3,yt+hp+4,x0-10,yt+hp+54,"lastro 5 cm","start")+LD(x0+Lp*0.75,yt+hp-8,x0+Lp+40,yt+hp+48,"malha inferior (c = 5 cm)")+LD(x0+Lp/2+a*k/2-6,110,x0+Lp/2+60,96,"arranques do pilar")+ARW(x0+Lp/2+a*k/2+30,8,x0+Lp/2+a*k/2+30,40,"#c0392b",2)+T(x0+Lp/2+a*k/2+38,20,`N = ${fm(v.N,0)} kN`,12,"start","#c0392b");
 const kp=150/Math.max(Lx,B),X=430,Y=95,PW=Lx*kp,PH=B*kp;s+=ttl(X,40,"PLANTA")+ttl(x0-40,G-50,"CORTE")+R(X,Y,PW,PH,"con",N,1.5)+R(X+PW/2-a*kp/2,Y+PH/2-b*kp/2,a*kp,b*kp,"#7d8794",N)+L(X-10,Y+PH/2,X+PW+10,Y+PH/2,N,.6,'stroke-dasharray="8 3 2 3"')+L(X+PW/2,Y-10,X+PW/2,Y+PH+10,N,.6,'stroke-dasharray="8 3 2 3"')+DH(X,X+PW,Y+PH+26,`L = ${cmT(Lx)}`,20)+DV(Y,Y+PH,X-14,`B = ${cmT(B)}`,8);
 return SV(640,330,s,"Esquema da sapata isolada")};
D.radier=(v,r)=>{const h=r._[0],G=110,yt=170,hp=Math.max(16,h*260),x0=40,W=560,sp=Math.min(260,v.l*55);
 let s=GROUND(G,640,300,[[0,640,yt+hp+6]],false)+R(0,yt+hp,640,6,"grav","none")+R(x0,yt,W,hp,"con",N,1.5);
 [x0+30,x0+30+sp,x0+30+2*sp].forEach(x=>{if(x<x0+W-10)s+=R(x-8,60,16,yt-60,"#9aa3ad",N)+ARW(x,28,x,56,"#c0392b",2)});
 s+=BAR([[x0+5,yt+hp-6],[x0+W-5,yt+hp-6]],2.5)+BAR([[x0+5,yt+6],[x0+W-5,yt+6]],2.5)+DH(x0+30,x0+30+sp,yt+hp+34,`ℓ = ${fm(v.l,2)} m`,28)+DV(yt,yt+hp,x0+W+18,`h = ${cmT(h)}`,14)+LD(x0+W*0.55,yt+hp-6,x0+W*0.62,yt+hp+56,"malha inferior")+LD(x0+W*0.8,yt+6,x0+W*0.7,yt-30,"malha superior")+LD(560,yt+hp+3,500,yt+hp+70,"lastro / brita compactada","end")+ttl(10,22,"CORTE TÍPICO")+T(470,24,`σm ≈ ${r.res[1][1]}`,12,"start","#c0392b");
 return SV(640,300,s,"Esquema do radier")};
D.estacas=(v,r)=>{const[bx,by,h,n]=r._,phi=v.phi/100,k=200/Math.max(bx,1),G=90,yt=150,hp=h*k,x0=70,W=bx*k,Le=v.Le||8,lp=150;
 const xs=n==1?[0.5]:n==2||n==3?[ (0.5*bx-1.5*phi)/bx,(0.5*bx+1.5*phi)/bx]:n==4?[(0.5*bx-1.5*phi)/bx,(0.5*bx+1.5*phi)/bx]:Array.from({length:Math.ceil(Math.sqrt(n))},(_, i,ar)=>(phi/2+0.15+i*3*phi)/bx);
 let s=GROUND(G,640,400,[[x0-10,x0+W+10,yt+hp+6]]);xs.forEach(f=>{const x=x0+f*W,dp=phi*k;s+=R(x-dp/2,yt+hp,dp,lp,"con",N,1.3)+P([[x-dp/2-4,yt+hp+lp-20],[x+dp/2+4,yt+hp+lp-28],[x+dp/2+4,yt+hp+lp-22],[x-dp/2-4,yt+hp+lp-14]],"#f6f2e9","none")+BAR([[x-dp/2+5,yt+hp+70],[x-dp/2+5,yt+hp-12]],2)+BAR([[x+dp/2-5,yt+hp+70],[x+dp/2-5,yt+hp-12]],2)});
 s+=R(x0,yt,W,hp,"con",N,1.5)+R(x0+W/2-v.a/200*k,40,v.a/100*k,yt-40,"#9aa3ad",N)+BAR([[x0+6,yt+hp-10],[x0+W-6,yt+hp-10]],3)+ARW(x0+W/2,8,x0+W/2,36,"#c0392b",2)+T(x0+W/2+8,18,`N = ${fm(v.N,0)} kN`,12,"start","#c0392b");
 s+=DH(x0,x0+W,yt-14,`${cmT(bx)}`,8)+DV(yt,yt+hp,x0-16,`h = ${cmT(h)}`,10)+(xs.length>1?DH(x0+xs[0]*W,x0+xs[1]*W,yt+hp+lp+22,`s = 3φ = ${fm(3*v.phi,0)} cm`,lp-10):"")+DV(yt+hp,yt+hp+lp,x0+W+22,`Le = ${fm(Le,1)} m (fora de escala)`,16,11)+LD(x0+W*0.5,yt+hp-10,x0+W+40,yt+hp+6,"armadura do bloco (bielas)")+T(x0+W/2,yt+hp+lp+44,`${n} × ${v.tipo}`,12)+ttl(10,24,"CORTE");
 const kp=130/Math.max(bx,by),X=440,Y=110,PW=bx*kp,PH=by*kp;s+=ttl(X,40,"PLANTA")+R(X,Y,PW,PH,"con",N,1.5);
 const pos=n==1?[[.5,.5]]:n==2?[[xs[0],.5],[xs[1],.5]]:n==3?[[xs[0],.75],[xs[1],.75],[.5,.2]]:n==4?[[xs[0],xs[0]*bx/by],[xs[1],xs[0]*bx/by],[xs[0],1-xs[0]*bx/by],[xs[1],1-xs[0]*bx/by]]:Array.from({length:n},(_,i)=>{const c=Math.ceil(Math.sqrt(n)),rr=Math.ceil(n/c);return[(phi/2+.15+(i%c)*3*phi)/bx,(phi/2+.15+Math.floor(i/c)*3*phi)/by]});
 pos.forEach(([a,b])=>s+=C(X+a*PW,Y+b*PH,phi*kp/2,"#8d96a0",N,1.2));s+=R(X+PW/2-v.a/200*kp,Y+PH/2-6,v.a/100*kp,12,"#5d6772",N)+DH(X,X+PW,Y+PH+24,cmT(bx),18)+DV(Y,Y+PH,X-12,cmT(by),6);
 return SV(640,400,s,"Esquema de estacas e bloco")};
D.pilar=(v,r)=>{const[b,h]=r._,k=170/Math.max(b,h),W=b*k,H=h*k,X=90,Y=60,c=3/100*k,ql=h>0.40?6:4;
 let s=ttl(20,30,"SEÇÃO TRANSVERSAL")+R(X,Y,W,H,"con",N,1.6)+R(X+c,Y+c,W-2*c,H-2*c,"none",STL,2.4,'rx="4"');
 const pts=[[X+c+5,Y+c+5],[X+W-c-5,Y+c+5],[X+c+5,Y+H-c-5],[X+W-c-5,Y+H-c-5]];if(ql==6)pts.push([X+c+5,Y+H/2],[X+W-c-5,Y+H/2]);pts.forEach(p=>s+=DOT(...p,5));
 s+=DH(X,X+W,Y+H+26,`b = ${cmT(b)}`,22)+DV(Y,Y+H,X-18,`h = ${cmT(h)}`,14)+LD(X+W-c,Y+H*0.3,X+W+30,Y+H*0.2,"estribo Ø5 c/15")+LD(X+W-c-5,Y+c+5,X+W+30,Y+10,`${ql} barras longitudinais`)+LD(X+W,Y+H-6,X+W+30,Y+H+10,"cobrimento 3 cm");
 const np=Math.min(v.np,6),ph=230/np,EX=480,sc=Math.min(28,W*0.3);s+=ttl(400,30,"ELEVAÇÃO (esquemática)");
 for(let i=0;i<np;i++){const y=290-(i+1)*ph;s+=R(EX-40,y,110,7,"#9aa3ad",N)+R(EX,y+7,sc,ph-7,"con",N)}
 s+=R(EX-30,290,90,18,"con",N)+DV(290-ph+7,290,EX+sc+30,`pd = ${fm(v.pd||3,2)} m`,26)+T(EX+sc/2,316,`${v.np} pavimento(s) — Nk = ${r.res[0][1]}`,11)+ARW(EX+sc/2,32,EX+sc/2,290-np*ph-2,"#c0392b",2);
 return SV(640,330,s,"Esquema do pilar")};
D.viga=(v,r)=>{const h=r._[0],bw=v.bw/100,X=40,W=380,Y=110,hp=Math.max(20,h*120);
 let s=ttl(20,26,"ELEVAÇÃO")+LOADS(X,X+W,Y,9,"carga distribuída")+R(X,Y,W,hp,"con",N,1.5)+SUP(X+8,Y+hp)+SUP(X+W-8,Y+hp)+BAR([[X+8,Y+hp-6],[X+W-8,Y+hp-6]],2.5)+BAR([[X+8,Y+6],[X+W-8,Y+6]],2);
 for(let x=X+16;x<X+W-10;x+=16)s+=L(x,Y+4,x,Y+hp-4,STL,1);
 s+=DH(X+8,X+W-8,Y+hp+44,`L = ${fm(v.L,2)} m`,26)+DV(Y,Y+hp,X-14,`h = ${cmT(h)}`,10);
 const k=150/Math.max(h,bw*2),SX=500,SY=80,SW=bw*k,SH=h*k;s+=ttl(470,26,"SEÇÃO")+R(SX,SY,SW,SH,"con",N,1.5)+R(SX+5,SY+5,SW-10,SH-10,"none",STL,2,'rx="3"');
 [0,.5,1].forEach(f=>s+=DOT(SX+10+f*(SW-20),SY+SH-10,4.5));[0,1].forEach(f=>s+=DOT(SX+10+f*(SW-20),SY+10,3.5));
 s+=DH(SX,SX+SW,SY+SH+22,`bw = ${fm(v.bw,0)} cm`,18)+DV(SY,SY+SH,SX+SW+20,`h = ${cmT(h)}`,16)+LD(SX+SW/2,SY+SH-10,SX-60,SY+SH+50,"armadura positiva","start");
 return SV(640,320,s,"Esquema da viga")};
D.laje=(v,r)=>{const h=r._[0],lx=Math.min(v.lx,v.ly),ly=Math.max(v.lx,v.ly),k=Math.min(300/ly,200/lx),X=50,Y=50,W=ly*k,H=lx*k;
 let s=ttl(20,28,"PLANTA")+R(X,Y,W,H,"con",N,2);const ed=[[X,Y,X+W,Y],[X+W,Y,X+W,Y+H],[X,Y+H,X+W,Y+H],[X,Y,X,Y+H]];
 ed.forEach((e,i)=>{s+=L(...e,N,i<v.n?5:2);if(i<v.n){const[x1,y1,x2,y2]=e;for(let t=0;t<1;t+=.06){const x=x1+(x2-x1)*t,y=y1+(y2-y1)*t;s+=L(x,y,x+(i==1?8:i==3?-8:5),y+(i==0?-8:i==2?8:5),N,1)}}});
 s+=ARW(X+W/2,Y+H/2-30,X+W/2,Y+H/2+30)+ARW(X+W/2,Y+H/2+30,X+W/2,Y+H/2-30)+(ly/lx<=2?ARW(X+W/2-50,Y+H/2,X+W/2+50,Y+H/2)+ARW(X+W/2+50,Y+H/2,X+W/2-50,Y+H/2):"")+TB(X+W/2,Y+H/2-36,ly/lx>2?"armada em 1 direção":"armada em cruz",11);
 s+=DH(X,X+W,Y+H+28,`ly = ${fm(ly,2)} m`,24)+DV(Y,Y+H,X-16,`lx = ${fm(lx,2)} m`,12)+T(X,Y+H+56,`Bordas engastadas (traço grosso): ${v.n}`,11,"start");
 const SX=420,SY=150,SW=190,SH=Math.max(18,h*300);s+=ttl(420,110,"CORTE")+R(SX,SY,SW,SH,"con",N,1.5)+BAR([[SX+4,SY+SH-5],[SX+SW-4,SY+SH-5]],2);for(let i=0;i<10;i++)s+=DOT(SX+10+i*19,SY+SH-9,2.4);
 s+=BAR([[SX+4,SY+5],[SX+60,SY+5]],2)+DV(SY,SY+SH,SX+SW+18,`h = ${cmT(h)}`,14)+LD(SX+100,SY+SH-5,SX+60,SY+SH+40,"armadura positiva (c = 2,5 cm)")+LD(SX+30,SY+5,SX+20,SY-24,"negativa sobre apoio");
 return SV(640,330,s,"Esquema da laje maciça")};
D.trelicada=(v,r)=>{const tipo=r._&&r._[0];if(!tipo)return"";const ht=+tipo.match(/h=(\d+)/)[1],cap=4,eps=/EPS/.test(v.ench||""),ie=eps?50:42,k=3.2,X=40,Y=90,H=ht*k,n=3;
 let s=ttl(20,28,`CORTE — ${tipo}`);const W=n*ie*k;s+=R(X,Y,W+12*k,cap*k,"con",N,1.5);
 for(let i=0;i<=n;i++){const x=X+i*ie*k;s+=R(x,Y+cap*k,12*k,H-cap*k,"con",N,1.2)+R(x,Y+H-3*k,12*k,3*k,"#8f99a4",N)+PL([[x+2*k,Y+H-2*k],[x+6*k,Y+cap*k+6],[x+10*k,Y+H-2*k]],STL,2.4)+DOT(x+6*k,Y+cap*k+6,3)+DOT(x+2*k,Y+H-2*k,2.6)+DOT(x+10*k,Y+H-2*k,2.6);
  if(i<n){const ex=x+12*k,ew=(ie-12)*k;s+=eps?R(ex,Y+cap*k,ew,H-cap*k-3*k+3*k,"eps",N):R(ex,Y+cap*k,ew,H-cap*k,"#c9643b",N)+[0.25,0.5,0.75].map(f=>R(ex+ew*f-ew*0.1,Y+cap*k+(H-cap*k)*0.2,ew*0.2,(H-cap*k)*0.6,"#f6f2e9","#7a3a1f",.8)).join("")}}
 s+=L(X+4,Y+cap*k/2,X+W+12*k-4,Y+cap*k/2,STL,1.5,'stroke-dasharray="2 5"')+DV(Y,Y+H,X-16,`h = ${ht} cm`,12)+DV(Y,Y+cap*k,X+W+12*k+20,`capa ${cap} cm`,16,11)+DH(X+6*k,X+(ie+6)*k,Y+H+26,`intereixo ${ie} cm`,20)+DH(X,X+12*k,Y+H+50,"vigota 12 cm",44,11)
 +LD(X+W*0.4,Y+cap*k/2,X+W*0.45,Y-26,"tela soldada da capa")+LD(X+(ie+6)*k,Y+cap*k+8,X+W+70,Y+H*0.45,"treliça (banzo sup.)")+LD(X+ie*k+30,Y+H-14,X+W+70,Y+H*0.8,eps?"EPS":"lajota cerâmica")+T(320,Y+H+86,`Vão L = ${fm(v.L,2)} m · sobrecarga ${fm(v.q,1)} kN/m²`,12);
 return SV(640,Y+H+100,s,"Esquema da laje treliçada")};
D["pilar-aco"]=(v,r)=>{const p=r._&&r._[0];if(!p)return"";let s=ttl(20,28,"SEÇÃO")+WSEC(170,170,p,170)+ttl(400,28,"ELEVAÇÃO");
 const X=500;s+=R(X-6,50,12,230,"#7f8c9b",N)+R(X-30,280,60,8,"#5d6772",N)+R(X-40,288,80,22,"con",N)+[-1,1].map(g=>L(X+g*22,276,X+g*22,300,N,2)).join("")+ARW(X,14,X,46,"#c0392b",2)+T(X+8,24,`N = ${fm(v.N,0)} kN`,12,"start","#c0392b")+DV(50,280,X-50,`KL = ${fm(v.L,2)} m`,40)+LD(X+30,284,X+60,262,"placa de base + chumbadores")+T(170,320,`${p.n} — ${fm(p.kg,1)} kg/m · A = ${fm(p.A,1)} cm² · ry = ${fm(p.ry,2)} cm`,12);
 return SV(640,330,s,"Esquema do pilar metálico")};
D["viga-aco"]=(v,r)=>{const p=r._&&r._[0];if(!p)return"";const X=40,W=380,Y=120;
 let s=ttl(20,26,"ELEVAÇÃO")+LOADS(X,X+W,Y,9,`q = ${fm(v.q,1)} kN/m`)+R(X,Y,W,8,"#7f8c9b",N)+R(X,Y+8,W,20,"#aeb7c2",N)+R(X,Y+28,W,8,"#7f8c9b",N)+SUP(X+6,Y+36)+SUP(X+W-6,Y+36)+DH(X+6,X+W-6,Y+80,`L = ${fm(v.L,2)} m`,40)+PL([[X+6,Y+40],[X+W/2,Y+62],[X+W-6,Y+40]],"#2e86c1",1.5,'stroke-dasharray="5 3"')+T(X+W/2,Y+76,`δ ≤ L/350 = ${fm(v.L*1000/350,1)} mm`,11,"middle","#2e86c1");
 s+=ttl(450,26,"SEÇÃO")+WSEC(530,170,p,150);return SV(640,320,s,"Esquema da viga metálica")};
D.trelica=(v,r)=>{const g=r._;if(!g||!g[3])return"";const hm=g[3],np=Math.ceil(v.L/v.p),X=40,W=560,k=W/v.L,H=Math.max(40,hm*k),Y=90;
 let s=ttl(20,26,"ELEVAÇÃO — banzos paralelos")+LOADS(X,X+W,Y,np+1,`q = ${fm(v.q,1)} kN/m`);const dx=W/np;
 for(let i=0;i<np;i++){const x=X+i*dx;s+=L(x,Y,x,Y+H,"#2e86c1",2)+(i<np/2?L(x,Y,x+dx,Y+H,"#27ae60",2):L(x,Y+H,x+dx,Y,"#27ae60",2))}
 s+=L(X+W,Y,X+W,Y+H,"#2e86c1",2)+L(X,Y,X+W,Y,"#c0392b",4)+L(X,Y+H,X+W,Y+H,"#e67e22",4);for(let i=0;i<=np;i++){s+=C(X+i*dx,Y,2.8,N)+C(X+i*dx,Y+H,2.8,N)}
 s+=SUP(X,Y+H)+SUP(X+W,Y+H)+DH(X,X+W,Y+H+50,`L = ${fm(v.L,2)} m`,36)+DV(Y,Y+H,X-16,`h = ${fm(hm,2)} m`,10)+DH(X+dx,X+2*dx,Y-40,`p = ${fm(v.L/np,2)} m`,4,11)
 +LD(X+W*0.62,Y,X+W*0.66,Y+H+86,`banzo superior (comp.): ${g[0]?g[0].n:"—"}`)+LD(X+W*0.3,Y+H,X+W*0.06,Y+H+86,`banzo inferior (tração): ${g[1]?g[1].n:"—"}`)+LD(X+dx*0.5,Y+H*0.5,X+30,Y+H+110,`diagonais (verde): ${g[2]?g[2].n:"—"}`)+LD(X+dx*2,Y+H*0.6,X+W*0.55,Y+H+110,"montantes (azul)");
 return SV(640,Y+H+125,s,"Esquema da treliça")};
D.muro=(v,r)=>{const g=r._;if(!g)return"";const tot=v.H+g.h+2.2,k=Math.min(300/tot,230/(g.B+1.6)),X=200,Gf=40+v.H*k,yb=Gf+g.h*k,Bp=g.B*k,xt=X+g.toe*k,tbp=g.tb*k,ttp=g.tt*k,xf=xt+tbp,lp=Math.min(140,(v.Le||10)*12),phip=Math.max(10,g.phi*k);
 let s=R(0,Gf-0,X+g.toe*k+tbp-ttp,0)+R(0,Gf,640,yb-Gf+lp+40,"soil","none")+R(xf,40,640-xf,Gf-40,"soil","none")+L(xf,40,640,40,"#5b3a1c",2)+L(0,Gf,xt,Gf,"#5b3a1c",2);
 s+=R(xf,40,16,Gf-40,"grav",N,.6)+LD(xf+8,80,xf+60,64,"brita + geotêxtil")+C(xf+10,Gf-8,5,"#f6f2e9",N)+LD(xf+10,Gf-8,xf+70,Gf-30,"dreno Ø100");
 const xsP=g.r2?[X+Bp/2-g.e*k/2,X+Bp/2+g.e*k/2]:[X+Bp/2];xsP.forEach(x=>s+=R(x-phip/2,yb,phip,lp,"con",N,1.2)+BAR([[x-phip/2+3,yb+60],[x-phip/2+3,yb-10]],1.8)+BAR([[x+phip/2-3,yb+60],[x+phip/2-3,yb-10]],1.8));
 s+=R(X,Gf,Bp,yb-Gf,"con",N,1.6)+P([[xt,Gf],[xt+tbp-ttp,40],[xf,40],[xf,Gf]],"con",N,1.6);
 s+=BAR([[xf-6,44],[xf-6,yb-8],[xf-40,yb-8]],2.6)+BAR([[X+6,yb-7],[X+Bp-6,yb-7]],2.2)+BAR([[X+6,Gf+6],[X+Bp-6,Gf+6]],2);for(let i=0;i<4;i++)s+=PL([[xt+10+i*12,Gf+10+i*0],[xt+10+i*12,Gf+10]],STL,1)+L(xt+tbp/2-1,60+i*((Gf-60)/4),xt+tbp/2+1,62+i*((Gf-60)/4),"#3498db",3);
 s+=L(xt+tbp/2-ttp/2+2,Gf-30,xt-20,Gf-24,"#3498db",3);
 const qp=g.Hh/Math.max(1,v.H),pw=Math.min(110,(g.Ka*v.gs*g.Ht+g.Ka*v.q)*2.2),px=xf+30;s+=P([[px,40],[px+g.Ka*v.q*2.2,40],[px+pw,yb],[px,yb]],"#e74c3c33","#c0392b",1.3);for(let i=1;i<6;i++){const y=40+(yb-40)*i/6,w=g.Ka*v.q*2.2+(pw-g.Ka*v.q*2.2)*i/6;s+=ARW(px+w,y,px+2,y,"#c0392b",1)}
 s+=T(px+pw+6,yb-4,`Ka·γ·Ht + Ka·q = ${fm(g.Ka*v.gs*g.Ht+g.Ka*v.q,1)} kPa`,11,"start","#c0392b")+T(xf+40,30,`q = ${fm(v.q,0)} kPa`,11,"start","#c0392b");
 s+=DV(40,Gf,xt-34,`H = ${fm(v.H,2)} m`,30)+DV(Gf,yb,X-14,`h = ${cmT(g.h)}`,10)+DH(X,X+Bp,yb+lp+22,`B = ${fm(g.B,2)} m`,lp+18)+DH(xt+tbp-ttp,xf,30,`${cmT(g.tt)}`,4,11)+DH(xt,xf,Gf+(yb-Gf)/2+4,`${cmT(g.tb)}`,0,10)+(g.r2?DH(xsP[0],xsP[1],yb+lp-10,`e = 3φ = ${cmT(g.e)}`,0,11):"")+DV(yb,yb+lp,X+Bp+24,`Le = ${fm(v.Le||10,1)} m (fora de escala)`,20,10)
 +LD(xt+tbp/2,Gf-30,xt-110,Gf-80,"barbacã Ø75")+T(70,yb+lp+30,`Estacas: ${g.r2?2:1} fila(s) c/ ${fm(v.s,2)} m`,11,"start");
 s=`<g transform="translate(0 34)">${s}</g>`+R(0,0,640,30,"#f6f2e9","none")+ttl(10,22,"CORTE TRANSVERSAL — por metro de muro");const DX=470,DY=yb+lp+94;let d=ttl(20,DY,"DETALHE — ligação cortina × sapata × cabeça de estaca")+R(150,DY+60,330,70,"con",N,1.5)+P([[260,DY+60],[260,DY+10],[340,DY+10],[340,DY+60]],"con",N,1.5)+R(285,DY+130,50,60,"con",N,1.2);
 d+=BAR([[330,DY+12],[330,DY+120],[280,DY+120]],2.6)+BAR([[270,DY+12],[270,DY+120],[320,DY+120]],2)+BAR([[156,DY+122],[474,DY+122],[474,DY+66],[156,DY+66],[156,DY+122]],2)+BAR([[294,DY+170],[294,DY+80],[280,DY+70]],1.8)+BAR([[326,DY+170],[326,DY+80],[340,DY+70]],1.8)+L(285,DY+140,335,DY+140,"#7a1d10",1,'stroke-dasharray="3 2"');
 d+=LD(330,DY+40,380,DY+28,"arranques da cortina (face do aterro)")+LD(156,DY+100,60,DY+46,"armadura inferior e superior da sapata")+LD(326,DY+160,360,DY+200,"armadura da estaca ancorada no bloco (≥ 40φ)")+LD(285,DY+140,180,DY+176,"cabeça arrasada — embutir 5–10 cm")+LD(300,DY+60,170,DY+40,"junta de concretagem (apicoar + limpar)")+DV(DY+60,DY+130,140,`h = ${cmT(g.h)}`,0,11);
 return SV(640,DY+215,s+d,"Esquema do muro de contenção sobre estacas")};
D.pavimento=(v,r)=>{const g=r._;if(!g)return"";const h=g.h,hp=h*260,hs=(v.hs??15)/100*260,X=30,Y=90,W=360;
 let s=ttl(20,26,"CORTE NA JUNTA TRANSVERSAL")+R(X,Y+hp+hs,W,70,"soil","none")+R(X,Y+hp,W,hs,"grav",N)+R(X,Y,W/2-2,hp,"con",N,1.5)+R(X+W/2+2,Y,W/2-2,hp,"con",N,1.5)+L(X,Y+hp+1,X+W,Y+hp+1,"#2c3e50",1.5,'stroke-dasharray="6 3"');
 s+=P([[X+W/2-3,Y],[X+W/2+3,Y],[X+W/2+1,Y+hp/3],[X+W/2-1,Y+hp/3]],"#222","none")+(g.dw?R(X+W/2-60,Y+hp/2-3,120,6,STL,"#7a1d10")+R(X+W/2,Y+hp/2-4,60,8,"none","#555",1,'stroke-dasharray="2 2"'):"")+ARW(X+W*0.25,Y-30,X+W*0.25,Y-2,"#c0392b",2)+T(X+W*0.25,Y-36,`eixo ${fm(g.Pax,0)} kN`,11,"middle","#c0392b");
 s+=DV(Y,Y+hp,X-12,`h = ${cmT(h)}`,8)+DV(Y+hp,Y+hp+hs,X+W+16,`sub-base ${fm(v.hs??15,0)} cm`,12,10)+DH(X+W/2-60,X+W/2+60,Y+hp+hs+30,g.dw?`transferência ${g.dwl[0]} L=${g.dwl[2]} (½ engraxada)`:"sem barras",0,10)+LD(X+W/2,Y+hp/6,X+W/2-60,Y-50,"corte h/3 + selante","end")+LD(X+40,Y+hp+hs+30,X+20,Y+hp+hs+60,`subleito — k = ${fm(g.k,0)} MPa/m (topo)`);
 const PX=430,PY=60,J=g.J,wf=v.Wf||3.5,k=Math.min(180/(3*J),150/(wf*1.6)),cw=J*k,lw=Math.min(wf/Math.max(1,Math.ceil(wf/4)),4)*k;s+=ttl(PX-10,26,"PLANTA — malha de juntas");
 for(let i=0;i<3;i++)for(let j=0;j<2;j++)s+=R(PX+i*cw*0+j*lw,PY+i*cw,lw,cw,"#cfd3d8",N,1.4);
 for(let i=1;i<3;i++)for(let x=PX+6;x<PX+2*lw;x+=10)s+=L(x,PY+i*cw-4,x,PY+i*cw+4,STL,1.6);for(let y=PY+10;y<PY+3*cw;y+=16)s+=L(PX+lw-5,y,PX+lw+5,y,"#2e86c1",2);
 s+=DV(PY,PY+cw,PX-10,`J = ${fm(J,2)} m`,4,11)+DH(PX,PX+lw,PY+3*cw+18,`${fm(lw/k,2)} m`,12,11)+LD(PX+lw+3,PY+cw*2.5,PX+2*lw+10,PY+cw*2.6,"ligação")+LD(PX+lw*0.5,PY+cw,PX+2*lw+10,PY+cw*0.8,g.dw?"transferência":"junta serrada")+T(PX+lw,PY+3*cw+44,"tráfego ↕",11);
 return SV(640,Math.max(PY+3*cw+60,Y+hp+hs+110),s,"Esquema do pavimento rígido")};
D.traco=(v,r)=>{const sel=v.prep[0],AM="#f2b632",hl=k=>sel===k?AM:"#9aa6b2",sw=k=>sel===k?3:1.4;let s="";
 // lata 18 L
 const lx=40,ly=70;s+=R(lx-8,ly-14,96,170,sel==="L"?"#fff7e0":"none",hl("L"),sw("L"),'rx="10"');
 s+=P([[lx+6,ly+10],[lx+74,ly+10],[lx+70,ly+120],[lx+10,ly+120]],"#c9d1da",N,1.4)+R(lx+2,ly+4,76,8,"#aeb8c4",N,1.2,'rx="3"')+PL([[lx+14,ly+4],[lx+40,ly-10],[lx+66,ly+4]],N,1.6)+L(lx+12,ly+40,lx+68,ly+40,"#8a96a3",1)+L(lx+12,ly+75,lx+68,ly+75,"#8a96a3",1);
 s+=T(lx+40,ly+70,"18 L",15,"middle",N,800)+T(lx+40,ly+142,"Lata 18 L",12,"middle",N,700)+T(lx+40,ly+156,"medida rasa",10,"middle","#556",500);
 // padiola
 const px=170,py=70;s+=R(px-8,py-14,200,170,sel==="P"?"#fff7e0":"none",hl("P"),sw("P"),'rx="10"');
 s+=L(px,py+60,px+184,py+60,"#7a5a30",5)+L(px,py+72,px+184,py+72,"#7a5a30",5);
 s+=P([[px+42,py+30],[px+142,py+30],[px+150,py+20],[px+50,py+20]],"#e2c48f",N,1.2)+R(px+42,py+30,100,48,"#d4b07a",N,1.4)+P([[px+142,py+30],[px+150,py+20],[px+150,py+68],[px+142,py+78]],"#c29a60",N,1.2);
 s+=T(px+92,py+58,"36,23 L",14,"middle",N,800)+T(px+92,py+100,"35 × 45 cm (interno)",11,"middle",N,600)+T(px+92,py+114,"altura 23 cm",11,"middle",N,600)+T(px+92,py+142,"Padiola",12,"middle",N,700)+T(px+92,py+156,"medida rasa",10,"middle","#556",500);
 // betoneira
 const bx=400,by=70,cap=v.bet;s+=R(bx-8,by-14,220,170,sel==="B"?"#fff7e0":"none",hl("B"),sw("B"),'rx="10"');
 s+=P([[bx+40,by+20],[bx+120,by+5],[bx+150,by+60],[bx+70,by+95]],"#e67e22",N,1.5)+P([[bx+120,by+5],[bx+140,by-5],[bx+165,by+45],[bx+150,by+60]],"#c0601a",N,1.3)+C(bx+95,by+50,6,N);
 s+=L(bx+95,by+50,bx+95,by+118,N,3)+L(bx+60,by+118,bx+170,by+118,N,3)+L(bx+70,by+118,bx+55,by+132,N,2)+L(bx+160,by+118,bx+175,by+132,N,2)+C(bx+55,by+134,7,"#555")+C(bx+175,by+134,7,"#555")+R(bx+150,by+80,30,24,"#566573",N,1.2)+T(bx+165,by+96,"M",10,"middle","#fff",700);
 s+=T(bx+102,by+142,"Betoneira "+cap,12,"middle",N,700)+T(bx+102,by+156,"carga seca ≈ 62% do tambor",10,"middle","#556",500);
 s+=T(320,22,"Equipamento de medida/mistura selecionado em destaque",12,"middle",N,700);
 return SV(640,250,s,"Lata, padiola e betoneira")};
return D})();
