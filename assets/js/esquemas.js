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
D.traco=(v,r)=>{const sel=v.prep[0],AM="#f2b632",cap=parseInt(v.bet)||400,on=k=>sel===k;
 const card=(x,w,k)=>`<rect x="${x}" y="34" width="${w}" height="214" rx="12" fill="${on(k)?"#fff7e0":"#f7f9fb"}" stroke="${on(k)?AM:"#c3ccd6"}" stroke-width="${on(k)?3:1.2}"/>`+(on(k)&&w<150?`<circle cx="${x+w-14}" cy="49" r="10" fill="${AM}"/><text x="${x+w-14}" y="54" font-size="13" text-anchor="middle" font-weight="900" fill="#1b2633">✓</text>`:on(k)?`<rect x="${x+w-78}" y="40" width="70" height="18" rx="9" fill="${AM}"/><text x="${x+w-43}" y="53" font-size="10" text-anchor="middle" font-weight="800" fill="#1b2633">SELECIONADO</text>`:"");
 const IMG="assets/img/traco/",bg=k=>on(k)?"#fff7e0":"#f7f9fb";
 // Fotos reais (CC0) sobre o desenho vetorial — se a foto não carregar, o desenho SVG fica visível (fallback).
 // Lata: "Zinc Bucket Front Flash", qubodup, CC0 — flickr.com/photos/21051491@N02/6964741805
 // Betoneira: "Orange concrete mixer machine", rawpixel, CC0 — rawpixel.com/image/6015943
 const PH=(x,y,w,h,f,k,cr,ex="")=>`<g class="trph"><clipPath id="trc${k}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/></clipPath><image href="${IMG+f}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#trc${k})" onerror="var g=this.parentNode;g.style.display='none';g.previousElementSibling.style.display=''"><title>${cr}</title></image><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="${on(k)?AM:"#c3ccd6"}" stroke-width="${on(k)?2:1}"/><text x="${x+w-4}" y="${y+h-4}" font-size="7.5" text-anchor="end" fill="#fff" stroke="#000" stroke-width="2" paint-order="stroke" opacity=".9">${cr}</text>${ex}</g>`;
 const WR=(s,s0)=>s.slice(0,s0)+'<g class="trvec" style="display:none">'+s.slice(s0)+"</g>";
 const g=`<defs>
 <linearGradient id="trTin" x1="0" x2="1"><stop offset="0" stop-color="#7d8792"/><stop offset=".18" stop-color="#e9eef2"/><stop offset=".32" stop-color="#ffffff"/><stop offset=".55" stop-color="#b9c2ca"/><stop offset=".82" stop-color="#8a949e"/><stop offset="1" stop-color="#5e6770"/></linearGradient>
 <linearGradient id="trTinIn" x1="0" x2="1"><stop offset="0" stop-color="#4f5861"/><stop offset=".5" stop-color="#9aa4ad"/><stop offset="1" stop-color="#3f474f"/></linearGradient>
 <linearGradient id="trWood" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e2b27a"/><stop offset=".5" stop-color="#c98f52"/><stop offset="1" stop-color="#a86f38"/></linearGradient>
 <linearGradient id="trWoodS" x1="0" x2="1"><stop offset="0" stop-color="#9a6330"/><stop offset="1" stop-color="#c48a4e"/></linearGradient>
 <linearGradient id="trDrum" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffd24a"/><stop offset=".3" stop-color="#ffb21a"/><stop offset=".7" stop-color="#e98a0c"/><stop offset="1" stop-color="#a95e05"/></linearGradient>
 <linearGradient id="trSteel" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6b7580"/><stop offset=".5" stop-color="#3a424b"/><stop offset="1" stop-color="#22282e"/></linearGradient>
 <radialGradient id="trTire"><stop offset=".55" stop-color="#3a3a3a"/><stop offset=".85" stop-color="#1c1c1c"/><stop offset="1" stop-color="#000"/></radialGradient>
 <radialGradient id="trHub"><stop offset="0" stop-color="#f1f3f5"/><stop offset="1" stop-color="#8a939c"/></radialGradient>
 <radialGradient id="trShadow"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
 </defs>`;
 let s=g+`<text x="320" y="22" font-size="12" text-anchor="middle" font-weight="700" fill="#1b2633">Equipamento de medida/mistura — selecionado em destaque</text>`;
 const lab=(x,a,b,c)=>`<text x="${x}" y="214" font-size="12.5" text-anchor="middle" font-weight="800" fill="#1b2633">${a}</text><text x="${x}" y="229" font-size="10" text-anchor="middle" fill="#556">${b}</text>`+(c?`<text x="${x}" y="242" font-size="10" text-anchor="middle" fill="#556">${c}</text>`:"");
 // ===== LATA 18 L (lata metálica tipo tinta) =====
 s+=card(16,138,"L");{const s0=s.length;const cx=85,t=88,b=190,w=74;
  s+=`<ellipse cx="${cx}" cy="${b+4}" rx="46" ry="6" fill="url(#trShadow)"/>
  <path d="M${cx-w/2} ${t} L${cx-w/2} ${b-4} Q${cx} ${b+6} ${cx+w/2} ${b-4} L${cx+w/2} ${t} Z" fill="url(#trTin)" stroke="#3d454d" stroke-width="1.2"/>`;
  [t+26,t+52,t+78].forEach(y=>{s+=`<path d="M${cx-w/2} ${y} Q${cx} ${y+7} ${cx+w/2} ${y}" fill="none" stroke="#5c656e" stroke-width="2.2" opacity=".7"/><path d="M${cx-w/2} ${y+3} Q${cx} ${y+10} ${cx+w/2} ${y+3}" fill="none" stroke="#fff" stroke-width="1.2" opacity=".7"/>`});
  s+=`<rect x="${cx-w/2+8}" y="${t+33}" width="${w-16}" height="13" rx="2" fill="#fff" opacity=".0"/>
  <ellipse cx="${cx}" cy="${t}" rx="${w/2}" ry="8" fill="url(#trTinIn)" stroke="#3d454d" stroke-width="1.2"/>
  <ellipse cx="${cx}" cy="${t}" rx="${w/2+2.5}" ry="9" fill="none" stroke="#c7cfd6" stroke-width="3"/>
  <ellipse cx="${cx}" cy="${t+1}" rx="${w/2-5}" ry="5.2" fill="#d7d2c8" stroke="#8b8478" stroke-width=".8"/>
  <circle cx="${cx-w/2-1}" cy="${t+12}" r="3.2" fill="#9aa4ad" stroke="#3d454d"/><circle cx="${cx+w/2+1}" cy="${t+12}" r="3.2" fill="#9aa4ad" stroke="#3d454d"/>
  <path d="M${cx-w/2-1} ${t+12} C${cx-w/2-6} ${t-46} ${cx+w/2+6} ${t-46} ${cx+w/2+1} ${t+12}" fill="none" stroke="#444c54" stroke-width="2.4"/>
  <rect x="${cx-12}" y="${t-38}" width="24" height="8" rx="4" fill="#2b2f33"/>
  <text x="${cx}" y="${t+48}" font-size="17" text-anchor="middle" font-weight="900" fill="#1b2633">18 L</text>`;
  s=WR(s,s0)+PH(26,64,118,127,"lata-18l.webp","L","Foto: qubodup · CC0",`<rect x="${cx-24}" y="150" width="48" height="20" rx="5" fill="#1b2633"/><text x="${cx}" y="165" font-size="13" text-anchor="middle" font-weight="900" fill="${AM}">18 L</text>`);
  s+=lab(cx,"Lata 18 L","medida rasa","Ø ≈ 24 × 35 cm")}
 // ===== PADIOLA 35×45×23 (caixa de madeira com 4 pegas) =====
 s+=card(164,196,"P");{const x0=200,y0=118,W=110,H=46,dx=22,dy=-16;
  s+=`<ellipse cx="262" cy="${y0+H+18}" rx="92" ry="7" fill="url(#trShadow)"/>`;
  // varas (pegas) — atrás
  s+=`<path d="M${x0-28+dx} ${y0+12+dy} L${x0+W+30+dx} ${y0+12+dy}" stroke="#8d5a2a" stroke-width="7" stroke-linecap="round"/>`;
  // interior
  s+=`<path d="M${x0} ${y0} L${x0+dx} ${y0+dy} L${x0+W+dx} ${y0+dy} L${x0+W} ${y0} Z" fill="#7b4f25"/>`;
  s+=`<path d="M${x0+3} ${y0+2} L${x0+dx+2} ${y0+dy+3} L${x0+W+dx-3} ${y0+dy+3} L${x0+W-2} ${y0+2} Z" fill="#c9c0ae"/>`; // areia rasa
  s+=`<path d="M${x0+8} ${y0-2} q20-5 40 0 t40 -2" stroke="#b0a690" fill="none"/>`;
  // lateral direita
  s+=`<path d="M${x0+W} ${y0} L${x0+W+dx} ${y0+dy} L${x0+W+dx} ${y0+H+dy} L${x0+W} ${y0+H} Z" fill="url(#trWoodS)" stroke="#5a3814"/>`;
  // frente com tábuas
  s+=`<rect x="${x0}" y="${y0}" width="${W}" height="${H}" fill="url(#trWood)" stroke="#5a3814" stroke-width="1.2"/>`;
  [15,31].forEach(o=>{s+=`<line x1="${x0}" y1="${y0+o}" x2="${x0+W}" y2="${y0+o}" stroke="#7d4d1f" stroke-width="1"/>`});
  [[30,7],[72,24],[50,38]].forEach(([a,b])=>{s+=`<path d="M${x0+a} ${y0+b} q8-3 16 0" stroke="#9a6431" fill="none" stroke-width=".8"/>`});
  [[4,4],[W-4,4],[4,H-4],[W-4,H-4]].forEach(([a,b])=>{s+=`<circle cx="${x0+a}" cy="${y0+b}" r="1.6" fill="#333"/>`});
  // varas frente (2 pegas de cada lado)
  s+=`<path d="M${x0-34} ${y0+30} L${x0+W+34} ${y0+30}" stroke="#a46c35" stroke-width="7.5" stroke-linecap="round"/><path d="M${x0-34} ${y0+28.5} L${x0+W+34} ${y0+28.5}" stroke="#d9a56a" stroke-width="2" stroke-linecap="round"/>`;
  s+=`<text x="${x0+W/2}" y="${y0+20}" font-size="14" text-anchor="middle" font-weight="900" fill="#2a1a08">36,23 L</text>`;
  s+=`<text x="${x0+W/2}" y="${y0+H+14}" font-size="9.5" text-anchor="middle" fill="#556">35 × 45 cm int. · h 23 cm</text>`;
  s+=lab(262,"Padiola","medida rasa","4 pegas (2 operários)")}
 // ===== BETONEIRA =====
 s+=card(370,254,"B");{const k=({250:.84,400:.96,600:1.08})[cap]||1,cx=490,cy=186;
  const tr=`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`;
  let b=`<ellipse cx="${cx+8}" cy="190" rx="${100}" ry="7" fill="url(#trShadow)"/>`;
  // barra de reboque
  b+=`<path d="M${cx+40} 168 L${cx+110} 176" stroke="url(#trSteel)" stroke-width="5" stroke-linecap="round"/><circle cx="${cx+112}" cy="176" r="5" fill="none" stroke="#2b3138" stroke-width="3"/>`;
  // chassi / cavalete
  b+=`<path d="M${cx-62} 170 L${cx+44} 170" stroke="#2f363d" stroke-width="6" stroke-linecap="round"/>`;
  b+=`<path d="M${cx-20} 170 L${cx-6} 108 M${cx+22} 170 L${cx+8} 108" stroke="#3a424b" stroke-width="5" stroke-linecap="round"/>`;
  b+=`<path d="M${cx-58} 170 L${cx-58} 186 M${cx-64} 186 L${cx-52} 186" stroke="#3a424b" stroke-width="4"/>`;
  // caixa do motor
  b+=`<rect x="${cx+18}" y="130" width="40" height="32" rx="3" fill="#3f6f9a" stroke="#1d3550"/><g stroke="#264a6b" stroke-width="1.4">${[0,1,2,3].map(i=>`<line x1="${cx+24}" y1="${136+i*6}" x2="${cx+52}" y2="${136+i*6}"/>`).join("")}</g><text x="${cx+38}" y="158" font-size="6.5" text-anchor="middle" fill="#cfe1f2" font-weight="700">MOTOR</text>`;
  // tambor (corpo + boca cônica), inclinado
  b+=`<g transform="rotate(24 ${cx} 104)">
   <path d="M${cx-46} 68 L${cx+28} 68 Q${cx+40} 100 ${cx+28} 132 L${cx-46} 132 Q${cx-58} 100 ${cx-46} 68 Z" fill="url(#trDrum)" stroke="#7a4304" stroke-width="1.4"/>
   <path d="M${cx-46} 68 L${cx-82} 82 L${cx-82} 118 L${cx-46} 132 Z" fill="url(#trDrum)" stroke="#7a4304" stroke-width="1.4"/>
   <ellipse cx="${cx-82}" cy="100" rx="7" ry="18" fill="#3b2a12" stroke="#7a4304" stroke-width="2"/>
   <ellipse cx="${cx-82}" cy="100" rx="8.5" ry="19.5" fill="none" stroke="#ffd860" stroke-width="2"/>
   ${[-30,-12,6].map(o=>`<path d="M${cx+o} 68 Q${cx+o-10} 100 ${cx+o} 132" fill="none" stroke="#b86506" stroke-width="2.4"/><path d="M${cx+o+2.5} 69 Q${cx+o-7.5} 100 ${cx+o+2.5} 131" fill="none" stroke="#ffe08a" stroke-width="1"/>`).join("")}
   <path d="M${cx+18} 68 Q${cx+30} 100 ${cx+18} 132" fill="none" stroke="#555" stroke-width="7"/>
   <path d="M${cx+18} 68 Q${cx+30} 100 ${cx+18} 132" fill="none" stroke="#9aa3ab" stroke-width="7" stroke-dasharray="2 2.2"/>
   <path d="M${cx-40} 74 L${cx+20} 74" stroke="#fff3c4" stroke-width="3" opacity=".55" stroke-linecap="round"/>
  </g>`;
  b+=`<circle cx="${cx}" cy="108" r="5" fill="url(#trHub)" stroke="#222"/>`;
  // volante
  b+=`<g><circle cx="${cx-30}" cy="150" r="13" fill="none" stroke="#c0392b" stroke-width="3"/>${[0,60,120].map(a=>`<line x1="${cx-30-13*Math.cos(a*Math.PI/180)}" y1="${150-13*Math.sin(a*Math.PI/180)}" x2="${cx-30+13*Math.cos(a*Math.PI/180)}" y2="${150+13*Math.sin(a*Math.PI/180)}" stroke="#c0392b" stroke-width="1.8"/>`).join("")}<circle cx="${cx-30}" cy="150" r="3" fill="#333"/><line x1="${cx-30}" y1="150" x2="${cx-12}" y2="158" stroke="#3a424b" stroke-width="3"/></g>`;
  // rodas
  [cx+30,cx+48].forEach((wx,i)=>{b+=`<circle cx="${wx}" cy="176" r="${i?13:13}" fill="url(#trTire)" stroke="#000"/><circle cx="${wx}" cy="176" r="6" fill="url(#trHub)" stroke="#333"/><circle cx="${wx}" cy="176" r="1.8" fill="#333"/>`});
  s+=`<g class="trvec" style="display:none"><g transform="${tr}">${b}</g></g>`;
  {const h=Math.round(132*k),w=Math.round(h*575/600);s+=PH(Math.round(cx-w/2),200-h,w,h,"betoneira.webp","B","Foto: rawpixel · CC0")}
  s+=`<rect x="${cx+70}" y="66" width="62" height="24" rx="5" fill="#1b2633"/><text x="${cx+101}" y="83" font-size="14" text-anchor="middle" font-weight="900" fill="${AM}">${cap} L</text>`;
  s+=lab(497,"Betoneira "+cap+" L","carga seca ≈ 62% do tambor","tamanho proporcional (250/400/600)")}
 return SV(640,256,s,"Lata 18 L, padiola e betoneira")};
return D})();
