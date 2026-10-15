// Guia prático de execução — conteúdo e ilustrações (FSantos Engenharia)
const GUIA=(()=>{const{N,A,STL,SOIL,SV,R,L,P,PL,C,T,TB,DH,DV,BAR,DOT,CO,LD,ARW,BOX,WORKER,DROPS,GROUND,sh}=K;
const W=760,H=430;
const FOC=(x,y,w,h)=>R(x-6,y-6,w+12,h+12,"none",A,3,'rx="8" stroke-dasharray="9 5"');
const TAG=(n,t)=>R(12,12,Math.min(736,100+t.length*7.8),30,N,"none",0,'rx="6"')+T(26,33,"ETAPA "+n,13,"start",A,800)+T(92,33,t,13,"start","#fff",600);
const sv=(n,t,b)=>SV(760,475,`<g transform="translate(0 22.5)">${b}</g>`+TAG(n,t),"Etapa "+n+" — "+t,"fsvg gsvg");
const STAKES=(x,y,h=40)=>R(x-3,y-h,6,h+14,"wood",N,.8);
const GAB=(x1,x2,y)=>STAKES(x1,y)+STAKES(x1+40,y)+STAKES(x2-40,y)+STAKES(x2,y)+R(x1-4,y-38,48,9,"wood",N)+R(x2-44,y-38,48,9,"wood",N)+L(x1+20,y-36,x2-20,y-36,"#e74c3c",1.2,'stroke-dasharray="1 0"');
const FORMV=(x,y,w,h,side=1)=>R(x,y,w,h,"wood",N,1)+Array.from({length:Math.max(1,Math.floor(h/45))},(_,i)=>R(side>0?x+w:x-10,y+10+i*45,10,8,"#a8763e",N,.6)).join("");
const ESC=(x,y,h)=>R(x-4,y,8,h,"wood",N,.8)+R(x-12,y+h,24,5,"#a8763e",N,.6)+R(x-14,y-4,28,5,"#a8763e",N,.6);
const SPC=(x,y,s=8)=>P([[x-s/2,y],[x+s/2,y],[x+s/3,y-s],[x-s/3,y-s]],"#7f8c8d",N,.6);
const CARANG=(x,y,h)=>PL([[x-9,y],[x-5,y-h],[x+5,y-h],[x+9,y]],STL,2);
const COMPACT=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-14" y="-10" width="28" height="10" fill="#555" stroke="${N}"/><rect x="-8" y="-34" width="16" height="24" fill="${A}" stroke="${N}"/><path d="M0-34l-18-26" stroke="#333" stroke-width="3"/><path d="M-26-60h16" stroke="#333" stroke-width="4"/><path d="M-22 4h44" stroke="#7a4e26" stroke-width="2" stroke-dasharray="3 3"/></g>`;
const TRUCK=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="0" y="-36" width="44" height="30" fill="#e8eef5" stroke="${N}"/><ellipse cx="80" cy="-30" rx="38" ry="22" fill="#d35400" stroke="${N}"/><path d="M48-30l64 0" stroke="#fff" stroke-width="3"/><circle cx="16" cy="-4" r="9" fill="#333"/><circle cx="70" cy="-4" r="9" fill="#333"/><circle cx="100" cy="-4" r="9" fill="#333"/><path d="M116-24l40 30" stroke="#7f8c8d" stroke-width="6"/></g>`;
const RIG=(x,y,h=200)=>`<g transform="translate(${x} ${y})"><rect x="-50" y="-30" width="100" height="30" fill="${A}" stroke="${N}"/><rect x="-56" y="-6" width="112" height="12" rx="6" fill="#333"/><rect x="-6" y="${-30-h}" width="12" height="${h}" fill="#e67e22" stroke="${N}"/><path d="M-6 ${-30-h}l-14 22M6 ${-30-h}l14 22" stroke="${N}"/></g>`;
const DIM=(t)=>TB(W-14,H-12,t,11,"end");
const NOTE=(x,y,t)=>TB(x,y,t,12,"middle");
const sky=R(0,0,W,H,"#eaf2fa","none");
// ---------- SAPATA ----------
function sapata(k){const G=180,x1=230,x2=530,yb=330,fx1=260,fx2=500,fh=50,fy=yb-6-fh;let s=sky;
 if(k==0){s+=GROUND(G,W,H)+GAB(160,600,G)+L(380,G-60,380,G+4,"#e74c3c",1,'stroke-dasharray="4 3"')+L(160,G-36,600,G-36,"#e74c3c",1.4)+L(380,G-36,380,G-10,N,1)+P([[376,G-14],[384,G-14],[380,G-4]],"#555")+STAKES(380,G,18)+WORKER(470,G,1)+LD(178,G-34,120,G-90,"gabarito (tábuas niveladas)","start")+LD(300,G-36,260,G-110,"linha do eixo (náilon)")+LD(380,G-8,430,G-70,"prumo → piquete no eixo")+NOTE(380,400,"Transferir eixos do projeto; conferir diagonais (esquadro 3-4-5).")+CO(178,G-34,1)+CO(380,G-8,2);return sv(1,"Locação e gabarito",s)}
 s+=GROUND(G,W,H,[[x1,x2,yb,30]])+GAB(130,630,G);
 if(k==1)s+=WORKER(320,yb,1,"pa")+DV(G,yb,x2+50,"profundidade de projeto",30)+DH(x1,fx1,yb+24,"folga 15–30 cm",0,10)+LD(x1-15,G+40,90,G+90,"talude estável / escoramento se > 1,25 m","start")+FOC(x1,G,x2-x1,yb-G)+CO(x1+20,yb-20,1);
 if(k>=2)s+=R(x1+4,yb-6,x2-x1-8,6,"con",N);
 if(k==2)s+=COMPACT(330,yb-6)+WORKER(420,yb-6,1)+LD(470,yb-3,560,yb+40,"lastro de concreto magro 5 cm")+LD(300,yb,200,yb+50,"fundo apiloado e limpo")+FOC(x1+4,yb-8,x2-x1-8,8)+CO(500,yb-3,1);
 if(k==3)s+=FORMV(fx1-12,fy,12,fh,-1)+FORMV(fx2,fy,12,fh,1)+FOC(fx1-12,fy,fx2-fx1+24,fh)+LD(fx1-6,fy+10,150,fy-30,"tábuas/compensado travados","start")+DH(fx1,fx2,fy-14,"dimensões B × L do projeto",0,11)+NOTE(380,405,"Fôrma no esquadro, travada contra o terreno; desmoldante aplicado.");
 if(k>=4){s+=(k<6?FORMV(fx1-12,fy,12,fh,-1)+FORMV(fx2,fy,12,fh,1):"")}
 if(k>=5)s+=R(fx1,fy,fx2-fx1,fh,"con",N,1.5);
 if(k>=4){s+=BAR([[fx1+8,fy+8],[fx1+8,fy+fh-8],[fx2-8,fy+fh-8],[fx2-8,fy+8]],3);for(let i=0;i<12;i++)s+=DOT(fx1+16+i*(fx2-fx1-32)/11,fy+fh-12,3);for(let i=0;i<4;i++)s+=SPC(fx1+30+i*60,fy+fh,8);
  [365,395].forEach(x=>s+=BAR([[x,fy+fh-14],[x,G-70]],3));for(let y=G-60;y<fy;y+=22)s+=R(362,y,36,3,"none",STL,1.6)}
 if(k==4)s+=LD(fx1+70,fy+fh,140,yb+60,"espaçadores (cobrimento 5 cm)","start")+LD(fx1+16,fy+fh-12,130,fy,"malha inferior com ganchos","start")+LD(395,G-60,520,G-80,"arranques do pilar + estribos")+DV(fy+fh-8,fy+fh,fx2+40,"c = 5 cm",20,10)+FOC(fx1,fy,fx2-fx1,fh)+CO(fx1+70,fy+fh,1)+CO(395,G-60,2);
 if(k==5)s+=TRUCK(560,G-2)+WORKER(300,fy,1,"vib")+LD(450,fy+20,620,fy+60,"concreto lançado ≤ 2 m de altura")+FOC(fx1,fy,fx2-fx1,fh)+NOTE(380,405,"Vibrar em pontos a cada ~40 cm; não encostar a agulha na armadura.");
 if(k==6)s+=DROPS(300,fy-30,6)+LD(fx2,fy+10,620,fy-10,"desforma ≥ 3 dias; manter úmido 7 dias")+FOC(fx1,fy,fx2-fx1,fh);
 if(k==7){for(let i=0;i<4;i++)s+=R(x1+6,fy-i*30-30,x2-x1-12,30,i%2?"#b9875a":"#a87b4f",N,.6);s+=COMPACT(470,fy-90)+LD(x1+10,fy-15,120,fy-60,"camadas ≤ 20 cm compactadas","start")+DV(fy-30,fy,x2+40,"20 cm",20,10)+FOC(x1+6,fy-120,x2-x1-12,120)}
 const tt=["Locação e gabarito","Escavação da cava","Apiloamento e lastro","Fôrmas da sapata","Armação, espaçadores e arranques","Concretagem e vibração","Cura e desforma","Reaterro compactado"];return sv(k+1,tt[k],s)}
// ---------- RADIER ----------
function radier(k){const G=230,X=90,Wd=580,y=G-40;let s=sky+GROUND(G,W,H,[],k==0);const tt=["Terraplenagem e compactação","Instalações embutidas","Lastro e lona plástica","Fôrmas de borda","Armadura inferior com espaçadores","Armadura superior com caranguejos","Concretagem, vibração e sarrafeamento","Acabamento e cura"];
 if(k==0)s+=COMPACT(300,G)+COMPACT(480,G)+R(X,G-4,Wd,4,"#a87b4f","none")+LD(560,G,620,G+60,"aterro em camadas de 20 cm — GC ≥ 95% PN")+NOTE(380,405,"Remover solo orgânico; regularizar e compactar; conferir nível.")+FOC(X,G-10,Wd,14);
 if(k>=1){s+=[200,420].map(x=>PL([[x,G+30],[x,G-30]],"#27ae60",6)+PL([[x,G+30],[x+120,G+30]],"#27ae60",6)).join("");if(k==1)s+=LD(200,G-28,140,G-90,"esperas de esgoto/água (tampadas)")+LD(320,G+30,360,G+80,"tubos com caimento, envelopados")+FOC(180,G-40,360,80)}
 if(k>=2)s+=R(X,G-8,Wd,8,"grav",N)+L(X,G-9,X+Wd,G-9,"#2c3e50",2);if(k==2)s+=LD(X+60,G-4,X,G+60,"lastro/brita 5 cm","start")+LD(X+300,G-9,X+260,G-70,"lona plástica 150 μm")+FOC(X,G-12,Wd,14);
 if(k>=3&&k<7)s+=FORMV(X-12,y,12,40,-1)+FORMV(X+Wd,y,12,40,1);if(k==3)s+=FOC(X-12,y,24,40)+FOC(X+Wd-12,y,24,40)+DV(y,G-9,X-40,"h do radier",24,11)+NOTE(380,405,"Fôrmas de borda niveladas pelo topo — servem de guia para a régua.");
 if(k>=6)s+=R(X,y,Wd,31,"con",N,1.5);
 if(k>=4){s+=BAR([[X+6,G-16],[X+Wd-6,G-16]],2.5);for(let i=0;i<25;i++)s+=DOT(X+12+i*23,G-20,2.6);for(let i=0;i<8;i++)s+=SPC(X+30+i*75,G-9,7)}
 if(k==4)s+=LD(X+105,G-12,X+80,G+60,"espaçador 3–5 cm","start")+LD(X+300,G-18,X+340,G-90,"malha inferior amarrada")+FOC(X,G-26,Wd,18);
 if(k>=5){s+=BAR([[X+6,y+6],[X+Wd-6,y+6]],2.5);for(let i=0;i<6;i++)s+=CARANG(X+50+i*100,G-20,G-26-y-2)}
 if(k==5)s+=LD(X+150,y+10,X+200,y-60,"caranguejos a cada ~80 cm")+LD(X+400,y+6,X+460,y-60,"malha superior")+FOC(X,y,Wd,32);
 if(k==6)s+=TRUCK(560,y-4)+WORKER(250,y,1,"regua")+WORKER(400,y,1,"vib")+FOC(X,y,Wd,31)+NOTE(380,405,"Concretar contínuo; sarrafear pelo topo das fôrmas.");
 if(k==7)s+=DROPS(200,y-40,8)+LD(X+Wd/2,y,X+Wd/2,y-90,"cura úmida ≥ 7 dias / manta molhada")+FOC(X,y,Wd,31);
 return sv(k+1,tt[k],s)}
// ---------- ESTACAS + BLOCO ----------
function estacas(k){const G=200,px=[300,460],bx1=240,bx2=520,by=G+60,bh=70;let s=sky;const tt=["Locação dos eixos das estacas","Perfuração / cravação","Armação e concretagem da estaca","Escavação e arrasamento","Lastro de concreto magro","Fôrma do bloco","Armação do bloco e arranques","Concretagem do bloco e cura"];
 const hole=k>=3?[[bx1-20,bx2+20,by+bh+6,20]]:[];s+=GROUND(G,W,H,hole);
 px.forEach((x,i)=>{if(k>=2||(k==1&&i==0))s+=R(x-18,k>=3?by+bh-14:G,36,H-(k>=3?by+bh-14:G),"con",N,1.2);if(k==2||(k==3))s+=BAR([[x-12,G+60],[x-12,(k>=3?by+bh-14:G)-30]],2)+BAR([[x+12,G+60],[x+12,(k>=3?by+bh-14:G)-30]],2)});
 if(k==0)s+=GAB(150,620,G)+px.map(x=>STAKES(x,G,14)+CO(x,G-30,"•")).join("")+DH(px[0],px[1],G-60,"s = 3φ (projeto)",0,11)+WORKER(600,G,1)+NOTE(380,405,"Locar cada estaca por coordenadas; tolerância de excentricidade ≤ 10% φ.");
 if(k==1)s+=RIG(460,G,210)+R(442,G,36,H-G,"#e6dccb",N)+LD(460,G+60,580,G+90,"hélice contínua / perfuratriz")+FOC(442,G-30,36,200)+NOTE(380,405,"Registrar profundidade, torque/negas e volume — boletim de estaca.");
 if(k==2)s+=LD(px[1]+12,G+20,600,G-20,"gaiola de armadura de topo")+TRUCK(560,G)+FOC(px[1]-24,G-30,48,200);
 if(k>=3&&k<5)s+=px.map(x=>L(x-25,by+bh-14,x+25,by+bh-14,"#e74c3c",2,'stroke-dasharray="4 3"')).join("");
 if(k==3)s+=LD(px[0]+25,by+bh-14,140,by+bh+40,"cota de arrasamento (embutir 5–10 cm)","start")+WORKER(390,by+bh,1,"mart")+FOC(px[0]-25,by+bh-40,50,40)+NOTE(380,405,"Arrasar com ponteiro leve — sem fissurar a estaca; preservar a armadura.");
 if(k>=4)s+=R(bx1,by+bh,bx2-bx1,6,"con",N);if(k==4)s+=FOC(bx1,by+bh-2,bx2-bx1,10)+LD(500,by+bh+3,600,by+bh+40,"lastro 5 cm");
 if(k>=5&&k<7)s+=FORMV(bx1-12,by,12,bh,-1)+FORMV(bx2,by,12,bh,1);if(k==5)s+=FOC(bx1-12,by,bx2-bx1+24,bh)+DH(bx1,bx2,by-14,"dimensões do bloco",0,11);
 if(k>=7)s+=R(bx1,by,bx2-bx1,bh,"con",N,1.5);
 if(k>=6){s+=BAR([[bx1+8,by+8],[bx1+8,by+bh-8],[bx2-8,by+bh-8],[bx2-8,by+8]],3)+[370,410].map(x=>BAR([[x,by+bh-10],[x,by-90]],3)).join("")+px.map(x=>BAR([[x-12,by+bh+30],[x-12,by+20]],2)+BAR([[x+12,by+bh+30],[x+12,by+20]],2)).join("");for(let i=0;i<4;i++)s+=SPC(bx1+40+i*65,by+bh,7)}
 if(k==6)s+=LD(bx1+8,by+40,130,by,"armadura principal sobre as estacas","start")+LD(410,by-80,520,by-110,"arranques do pilar")+LD(px[0]+12,by+30,140,by+100,"armadura da estaca ancorada no bloco","start")+FOC(bx1,by,bx2-bx1,bh);
 if(k==7)s+=WORKER(330,by,1,"vib")+DROPS(430,by-50,4)+FOC(bx1,by,bx2-bx1,bh)+NOTE(380,405,"Vibrar bem sobre as cabeças das estacas; cura úmida 7 dias.");
 return sv(k+1,tt[k],s)}
// ---------- PILAR ----------
function pilar(k){const G=360,X=330,w=80,top=70;let s=sky+R(0,G,W,H-G,"con",N)+R(X-60,G-6,w+120,6,"#9aa3ad",N);const tt=["Conferência de eixos e arranques","Armação: longitudinais e estribos","Espaçadores (cobrimento)","Fôrma, prumo e escoras","Concretagem em camadas","Desforma e cura"];
 const bars=[X+12,X+w-12];if(k>=0)s+=bars.map(x=>BAR([[x,G],[x,k>=1?top:G-60]],3)).join("");
 if(k==0)s+=L(X+w/2,G-90,X+w/2,G+10,"#e74c3c",1,'stroke-dasharray="6 3"')+LD(X+12,G-40,200,G-80,"arranques limpos (sem nata) — transpasse ≥ projeto","start")+DH(X,X+w,G+30,"seção b × h do projeto",0,11)+FOC(X,G-70,w,70);
 if(k>=1)for(let y=top+10;y<G-6;y+=18)s+=R(X+8,y,w-16,4,"none",STL,1.8);
 if(k==1)s+=LD(X+w-8,top+60,520,top+40,"estribos Ø5 c/ 15 cm (ou projeto)")+LD(X+12,top+100,200,top+80,"barras longitudinais","start")+DV(top+28,top+46,X+w+30,"s",20,10)+FOC(X,top,w,G-top);
 if(k>=2)for(let y=top+60;y<G;y+=90)s+=C(X+6,y,6,"#7f8c8d",N)+C(X+w-6,y,6,"#7f8c8d",N);if(k==2)s+=LD(X+6,top+150,190,top+170,"espaçador circular — cobrimento 2,5–3 cm","start")+FOC(X-6,top,w+12,G-top);
 if(k>=3&&k<5)s+=FORMV(X-14,top,14,G-top,-1)+FORMV(X+w,top,14,G-top,1)+PL([[X-24,top+60],[X-120,G]],"#a8763e",5)+PL([[X+w+24,top+60],[X+w+120,G]],"#a8763e",5);
 if(k==3)s+=L(X+w+40,top-10,X+w+40,G-20,"#555",1)+P([[X+w+36,G-20],[X+w+44,G-20],[X+w+40,G-10]],"#555")+LD(X+w+40,G-30,600,G-60,"prumo nas 2 direções")+LD(X-80,top+180,150,top+150,"escoras/aprumadores","start")+NOTE(380,405,"Janela de inspeção/limpeza na base; desmoldante.");
 if(k>=4)s+=R(X,k==4?top+130:top,w,k==4?G-top-130:G-top,"con",N,1.4);if(k==4)s+=WORKER(560,G,1,"vib")+LD(X+w/2,top+130,520,top+110,"camadas de ~50 cm vibradas")+LD(X+w/2,G-30,200,G-40,"altura de lançamento ≤ 2 m (ou tubo/janela)","start");
 if(k==5)s+=DROPS(X-40,top+40,6)+LD(X+w,top+100,560,top+80,"desforma lateral ≥ 3 dias; molhar 7 dias");
 return sv(k+1,tt[k],s)}
// ---------- VIGA ----------
function viga(k){const Y=150,X=120,Wd=520,hv=70,G=380;let s=sky+R(0,G,W,H-G,"con",N);const tt=["Escoramento e fundo da fôrma","Fôrmas laterais e travamento","Armação e espaçadores","Conferência antes da concretagem","Concretagem e vibração","Cura e retirada do escoramento"];
 [X-40,X+Wd+40].forEach(x=>s+=R(x-20,Y-30,40,G-Y+30,"con",N));
 if(k>=0){for(let x=X+30;x<X+Wd;x+=80)s+=ESC(x,Y+hv+20,G-Y-hv-25);s+=R(X-20,Y+hv,Wd+40,20,"wood",N)}
 if(k==0)s+=LD(X+110,G-80,X+190,G-30,"escoras c/ ≤ 1 m (projeto de escoramento)")+LD(X+300,Y+hv+10,X+340,Y+hv+60,"fundo com contraflecha se indicada")+FOC(X-20,Y+hv,Wd+40,G-Y-hv);
 if(k>=1&&k<5)s+=R(X-20,Y,Wd+40,hv,"#d9a96a55",N,1)+Array.from({length:7},(_,i)=>R(X+i*80,Y-4,10,hv+4,"#a8763e",N,.6)).join("");if(k==1)s+=LD(X+160,Y+10,X+200,Y-50,"gravatas/sarrafos a cada 50–60 cm")+FOC(X-20,Y,Wd+40,hv);
 if(k>=4)s+=R(X-20,Y,Wd+40,hv,"con",N,1.4);
 if(k>=2){s+=BAR([[X-30,Y+hv-10],[X+Wd+30,Y+hv-10]],3)+BAR([[X-30,Y+10],[X+Wd+30,Y+10]],2.4);for(let x=X;x<X+Wd;x+=26)s+=L(x,Y+6,x,Y+hv-6,STL,1.6);for(let x=X+40;x<X+Wd;x+=120)s+=SPC(x,Y+hv,8)}
 if(k==2)s+=LD(X+Wd-40,Y+hv-10,X+Wd-20,Y+hv+60,"armadura positiva")+LD(X+52,Y+30,X-10,Y-60,"estribos","start")+LD(X+160,Y+hv,X+130,Y+hv+90,"espaçador 2,5–3 cm")+FOC(X-20,Y,Wd+40,hv);
 if(k==3)s+=[["bitolas e quantidades",X+40],["cobrimento",X+200],["ancoragens nos pilares",X+360]].map(([t,x],i)=>CO(x,Y-24,i+1)+TB(x+16,Y-20,t,11,"start")).join("")+NOTE(380,405,"Checklist assinado; fôrma limpa e molhada antes do concreto.");
 if(k==4)s+=WORKER(380,Y,1,"vib")+LD(X+80,Y+30,X+40,Y-60,"lançar em camadas, de um apoio ao outro","start")+FOC(X-20,Y,Wd+40,hv);
 if(k==5)s+=DROPS(X+60,Y-30,8)+NOTE(380,405,"Laterais ≥ 3 dias; fundo/escoras ≥ 14–21 dias ou conforme projeto (NBR 14931/15696).");
 return sv(k+1,tt[k],s)}
// ---------- LAJE MACIÇA ----------
function laje(k){const Y=170,X=90,Wd=580,h=34,G=390;let s=sky+R(0,G,W,H-G,"con",N);const tt=["Escoramento e contraflecha","Fôrma de compensado","Armadura positiva com espaçadores","Armadura negativa com caranguejos","Instalações embutidas","Concretagem e sarrafeamento","Cura e desforma"];
 for(let x=X+40;x<X+Wd;x+=90)s+=ESC(x,Y+h+18,G-Y-h-22);s+=R(X,Y+h+8,Wd,10,"#a8763e",N)+R(X,Y+h,Wd,8,k>=1?"wood":"#a8763e55",N);
 if(k==0)s+=LD(X+130,G-60,X+200,G-20,"escoras metálicas/madeira c/ 0,8–1,2 m")+DV(Y+h-6,Y+h+8,X+Wd+30,"contraflecha",20,10)+FOC(X,Y+h+8,Wd,G-Y-h-8);
 if(k==1)s+=LD(X+300,Y+h+4,X+330,Y-30,"compensado plastificado + desmoldante")+FOC(X,Y+h,Wd,8);
 if(k>=5)s+=R(X,Y,Wd,h,"con",N,1.4);if(k>=1&&k<5)s+=R(X-10,Y,10,h,"wood",N)+R(X+Wd,Y,10,h,"wood",N);
 if(k>=2){s+=BAR([[X+6,Y+h-7],[X+Wd-6,Y+h-7]],2.4);for(let i=0;i<28;i++)s+=DOT(X+12+i*20.5,Y+h-10,2.4);for(let i=0;i<7;i++)s+=SPC(X+40+i*85,Y+h,7)}
 if(k==2)s+=LD(X+125,Y+h,X+90,Y+h+70,"espaçador 2,5 cm a cada ~80 cm")+LD(X+300,Y+h-8,X+330,Y-40,"malha positiva (2 direções)")+FOC(X,Y,Wd,h);
 if(k>=3){s+=BAR([[X+4,Y+6],[X+150,Y+6]],2.6)+BAR([[X+Wd-150,Y+6],[X+Wd-4,Y+6]],2.6);[X+70,X+Wd-70].forEach(x=>s+=CARANG(x,Y+h-10,h-18))}
 if(k==3)s+=LD(X+70,Y+12,X+40,Y-50,"negativa sobre apoios — não pisar!","start")+LD(X+Wd-70,Y+20,X+Wd-120,Y-50,"caranguejos/treliça de apoio")+FOC(X,Y,160,h);
 if(k>=4)s+=PL([[X+260,Y+h-4],[X+330,Y+h-4],[X+330,Y-30]],"#f1c40f",4)+R(X+400,Y+h-14,26,14,"#f1c40f",N);if(k==4)s+=LD(X+330,Y-20,X+380,Y-60,"eletrodutos fixados; caixas tampadas")+FOC(X+250,Y-30,190,h+30);
 if(k==5)s+=TRUCK(560,Y-2)+WORKER(250,Y,1,"regua")+WORKER(420,Y,1,"vib")+NOTE(380,405,"Mestras/taliscas na espessura h; passarelas sobre a armadura.");
 if(k==6)s+=DROPS(X+60,Y-30,10)+NOTE(380,405,"Cura úmida 7 dias; retirar escoras na sequência do projeto (do meio para os apoios).");
 return sv(k+1,tt[k],s)}
// ---------- TRELIÇADA ----------
function trelicada(k){const ox=70,oy=250,cz=.62,sz=.38,pt=(x,h,z)=>[+(ox+x+z*cz).toFixed(1),+(oy-h-z*sz).toFixed(1)];
 const PR=(x0,x1,h0,h1,z0,z1,c,st=N,sw=.8,op="")=>P([pt(x0,h1,z0),pt(x1,h1,z0),pt(x1,h1,z1),pt(x0,h1,z1)],sh(c,1.15),st,sw,op)+P([pt(x1,h0,z0),pt(x1,h1,z0),pt(x1,h1,z1),pt(x1,h0,z1)],sh(c,.78),st,sw,op)+P([pt(x0,h0,z0),pt(x1,h0,z0),pt(x1,h1,z0),pt(x0,h1,z0)],c,st,sw,op);
 const SP=480,D=250,ie=62,VZ=[16,16+ie,16+2*ie,16+3*ie],VW=12,ap=14,LH=30,eps=false;let s=R(0,0,760,430,"#eaf2fa","none")+P([pt(-60,-170,-30),pt(SP+60,-170,-30),pt(SP+60,-170,D+20),pt(-60,-170,D+20)],"#c9ced6",N,.6);
 const ttl=["Linhas de escoramento: guias, pontaletes e contraflecha","Vigotas apoiadas nas vigas/paredes (apoio mínimo)","Lajotas cerâmicas / EPS entre as vigotas","Nervura de travamento e armadura negativa","Tela soldada (armadura de distribuição) e instalações","Molhagem e concretagem da capa","Cura e retirada do escoramento"];
 // escoramento (atrás→frente)
 const XS=[160,320];XS.forEach(x=>{s+=PR(x-6,x+6,-14,-2,-10,D+10,"#c8955a");[D-10,D/2,10].forEach(z=>s+=PR(x-4,x+4,-170,-14,z-4,z+4,"#d9a96a"))});
 // apoios (vigas / paredes)
 s+=PR(-40,0,-170,0,-20,D+20,"#b9bec5")+PR(SP,SP+40,-170,0,-20,D+20,"#b9bec5");
 const lift=x=>k==0?0:0;
 const VIG=z=>{let v=PR(-ap,SP+ap,0,8,z,z+VW,"#9aa3ad");const tr=[];for(let i=0,x=-ap+10;x<=SP+ap-10;i++,x+=20)tr.push(pt(x,i%2?34:9,z+VW/2));v+=PL(tr,STL,2)+PL([pt(-ap+10,34,z+VW/2),pt(SP+ap-10,34,z+VW/2)],STL,2.6)+PL([pt(-ap+8,9,z+2),pt(SP+ap-8,9,z+2)],STL,1.6)+PL([pt(-ap+8,9,z+VW-2),pt(SP+ap-8,9,z+VW-2)],STL,1.6);return v};
 const LAJ=(z0,z1)=>{let v="";for(let x=0;x<SP;x+=40){if(k>=3&&x>=200&&x<240)continue;v+=PR(x+1,x+39,0,LH,z0,z1,eps?"#f4f6f8":"#c9643b",N,.6);const a=pt(x+39,LH*.25,z0+4),b=pt(x+39,LH*.75,(z0+z1)/2);v+=`<ellipse cx="${(a[0]+b[0])/2}" cy="${(a[1]+b[1])/2}" rx="3" ry="6" fill="#7a3a1f"/>`}return v};
 if(k>=1)for(let i=VZ.length-1;i>=0;i--){if(k>=2&&i<VZ.length-1)s+=LAJ(VZ[i]+VW,VZ[i+1]);s+=VIG(VZ[i]);if(k>=3&&i<VZ.length-1)s+=PR(200,240,0,LH,VZ[i]+VW,VZ[i+1],"#aeb4bb",N,.6)}
 if(k>=3)s+=PL([pt(220,LH-4,0),pt(220,LH-4,D)],STL,2.4)+PL([pt(-ap,LH+2,VZ[0]+6),pt(80,LH+2,VZ[0]+6)],STL,2.6)+PL([pt(-ap,LH+2,VZ[1]+6),pt(80,LH+2,VZ[1]+6)],STL,2.6);
 if(k>=4){for(let x=0;x<=SP;x+=30)s+=PL([pt(x,LH+5,0),pt(x,LH+5,D)],STL,1,'stroke-dasharray="4 3"');for(let z=0;z<=D;z+=25)s+=PL([pt(0,LH+5,z),pt(SP,LH+5,z)],STL,1,'stroke-dasharray="4 3"');s+=PL([pt(300,LH+6,120),pt(380,LH+6,120),pt(380,LH+6,200)],"#f1c40f",4)}
 if(k>=5){const xe=k==5?300:SP;s+=PR(0,xe,LH,LH+12,0,D,"#b9bec5",N,1,'fill-opacity=".93"')}
 // contraflecha / chão
 if(k==0){s+=PL([pt(-40,-6,0),pt(SP/2,2,0),pt(SP+40,-6,0)],"#c0392b",2,'stroke-dasharray="7 4"');s+=CO(...pt(160,-60,0),1)+CO(...pt(160,-8,D),2)+CO(...pt(SP/2,2,0).map((v,i)=>i?v-14:v),3);
  s+=LD(...pt(160,-90,10),90,300,"1 pontaletes (escoras) c/ ≤ 1,0–1,5 m","start")+LD(...pt(320,-8,D/2),748,70,"2 guias (travessas) ⟂ às vigotas","end")+LD(...pt(SP/2,2,0),470,300,"3 contraflecha ≈ L/300 (fabricante)")+LD(...pt(SP+20,-60,0),748,400,"vigas/paredes de apoio","end")}
 if(k==1){s+=CO(...pt(-ap,8,VZ[0]).map((v,i)=>i?v+14:v-14),1)+CO(...pt(260,40,VZ[0]),2)+CO(...pt(260,4,VZ[0]).map((v,i)=>i?v+16:v),3)+LD(...pt(260,34,VZ[0]+6),748,360,"2 treliça: banzo superior + diagonais (sinusoides)","end")+LD(...pt(300,4,VZ[0]),748,400,"3 sapata de concreto da vigota (base)","end")+DH(...[pt(SP,0,VZ[0]-6)[0],pt(SP+ap,0,VZ[0]-6)[0]],pt(SP,0,VZ[0])[1]+22,"",0)+ARW(pt(SP+ap,0,0)[0]+60,pt(SP+ap,0,0)[1]+60,pt(SP+ap,0,0)[0]+4,pt(SP+ap,0,0)[1]+4,"#c0392b",2)+TB(748,pt(SP,0,0)[1]+76,"1 apoio mínimo ≥ 5 cm (conf. fabricante)",12,"end");
  // detalhe ampliado
  const X=20,Y=60;s+=R(X,Y,250,150,"#fffdf7",N,1.2,'rx="8"')+T(X+10,Y+18,"DETALHE DO APOIO",12,"start",N,800)+R(X+140,Y+80,100,60,"#b9bec5",N)+R(X+20,Y+92,160,14,"#9aa3ad",N)+PL([[X+28,Y+102],[X+50,Y+40],[X+72,Y+102],[X+94,Y+40],[X+116,Y+102],[X+138,Y+40],[X+160,Y+102]],STL,2)+L(X+24,Y+40,X+176,Y+40,STL,3)+DH(X+140,X+180,Y+124,"≥ 5 cm",0,11)+LD(X+50,Y+40,X+60,Y+30,"banzo superior")+T(X+190,Y+140,"viga/parede",10,"middle",N,600)}
 if(k==2){s+=CO(...pt(100,LH+14,VZ[1]+30),1)+LD(...pt(100,LH,VZ[1]+30),748,60,"1 lajotas (ou EPS) encaixadas nas abas","end")+DH(pt(0,0,VZ[0]+6)[0],pt(0,0,VZ[1]+6)[0],pt(0,0,VZ[0])[1]+30,"",0)+TB(...pt(-30,-40,VZ[0]+30),"intereixo 42/50 cm",11)+CO(...pt(-30,-20,VZ[0]+30),2)+WORKER(...pt(380,LH,VZ[2]),0.9)+R(...pt(330,LH+1,VZ[2]+20),110,6,"#a8763e",N)+LD(...pt(350,LH+4,VZ[2]+20),748,150,"tábua de passagem — não pisar na lajota","end")}
 if(k==3){s+=CO(...pt(220,LH+18,D/2),1)+CO(...pt(40,LH+14,VZ[0]+6),2)+LD(...pt(220,LH,D/2+30),748,90,"1 nervura de travamento ⟂ (vãos > 4 m) + barra","end")+LD(...pt(40,LH+2,VZ[0]+6),40,330,"2 armadura negativa sobre o apoio","start")}
 if(k==4){s+=CO(...pt(120,LH+20,180),1)+CO(...pt(380,LH+24,200),2)+LD(...pt(150,LH+5,150),748,60,"1 tela soldada sobre espaçadores (cobr. ≥ 1,5 cm)","end")+LD(...pt(380,LH+6,170),748,250,"2 eletrodutos fixados nas vigotas","end")}
 if(k==5){s+=TRUCK(560,120)+PL([[600,110],[pt(300,LH+40,120)[0],pt(300,LH+40,120)[1]]],"#555",6)+ARW(pt(300,LH+40,120)[0],pt(300,LH+40,120)[1],pt(300,LH+14,120)[0],pt(300,LH+14,120)[1],"#c0392b",2.5)+WORKER(...pt(200,LH+12,150),.9,"vib")+DROPS(...pt(380,LH+60,60),4)+CO(...pt(150,LH+16,40),1)+CO(...pt(420,LH+40,60),2)+LD(...pt(150,LH+12,20),40,330,"1 capa ≥ 4 cm + nervuras concretadas juntas","start")+LD(...pt(420,LH+30,60),748,380,"2 molhar lajotas antes de lançar","end")}
 if(k==6){s+=DROPS(...pt(60,LH+50,120),12)+CO(...pt(250,LH+20,140),1)+CO(...pt(320,-60,10),2)+LD(...pt(250,LH+12,140),748,60,"1 cura úmida/manta ≥ 7 dias","end")+LD(...pt(320,-60,10),748,400,"2 retirar escoras ≥ 21 dias, do meio p/ apoios","end")}
 return sv(k+1,ttl[k],s)}
// ---------- METÁLICA ----------
function metalica(k){const G=370;let s=sky+GROUND(G,W,H,[],true);const tt=["Recebimento e armazenagem","Chumbadores e grauteamento das bases","Montagem e prumo dos pilares","Vigas e ligações parafusadas","Içamento das treliças","Contraventamentos","Proteção anticorrosiva e inspeção"];
 const COL=x=>R(x-8,120,16,G-130,"#7f8c9b",N)+R(x-20,G-12,40,6,"#5d6772",N);
 if(k==0){for(let i=0;i<5;i++)s+=R(140,G-20-i*16,360,12,"#7f8c9b",N)+R(150,G-8-i*16,10,8,"wood",N)+R(470,G-8-i*16,10,8,"wood",N);s+=LD(160,G-80,120,G-140,"perfis sobre calços, sem contato com o solo","start")+LD(500,G-60,580,G-120,"conferir romaneio, marcação e certificados")+FOC(140,G-90,370,90)}
 if(k>=1)s+=R(150,G-6,80,40,"con",N)+R(490,G-6,80,40,"con",N)+[160,180,520,540].map(x=>L(x+20,G-26,x+20,G+30,"#555",3)).join("");if(k==1)s+=LD(190,G-24,90,G-90,"chumbadores com gabarito","start")+LD(530,G-6,620,G-60,"graute 25–50 mm sob a placa")+FOC(150,G-30,80,70);
 if(k>=2)s+=COL(190)+COL(530);if(k==2)s+=L(560,110,560,G-20,"#555",1)+LD(560,250,640,230,"prumo ≤ H/1000 (tolerância NBR 8800)")+FOC(170,110,40,G-120);
 if(k>=3)s+=R(190,120,340,14,"#aeb7c2",N)+C(205,127,3,N)+C(515,127,3,N);if(k==3)s+=LD(205,127,120,80,"parafusos ASTM A325 — torque/marcação","start")+FOC(190,110,340,30);
 if(k>=4){const y=60;s+=L(190,y,530,y,"#c0392b",4)+L(190,y+50,530,y+50,"#e67e22",4);for(let i=0;i<=8;i++){const x=190+i*42.5;s+=L(x,y,x,y+50,"#2e86c1",2)+(i<8?L(x,y,x+42.5,y+50,"#27ae60",2):"")}}
 if(k==4)s+=L(360,10,360,58,"#555",2)+R(300,6,120,6,"#333")+LD(360,30,520,20,"içar pelos pontos indicados — 2 cabos")+NOTE(380,405,"Área isolada; sinaleiro; vento < limite do guindaste (NR-11/NR-18).");
 if(k>=5)s+=L(190,140,530,G-20,"#8e44ad",2)+L(530,140,190,G-20,"#8e44ad",2);if(k==5)s+=LD(360,250,600,280,"contraventamento em X — tensionar")+FOC(190,140,340,G-160);
 if(k==6)s+=DROPS(250,200,3)+LD(530,200,620,170,"retoque de primer nas ligações")+NOTE(380,405,"Espessura de película conforme especificação; inspeção visual das soldas.");
 return sv(k+1,tt[k],s)}
// ---------- MURO ----------
function muro(k){const G=160,yb=320,X=200,B=320,h=50,xt=X+70,tb=60,tt=40,xf=xt+tb,top=60;let s=sky;const ttl=["Locação","Execução das estacas","Arrasamento das estacas","Lastro de concreto magro","Armação da sapata e arranques","Concretagem da sapata","Fôrma e armação da cortina","Concretagem da cortina","Drenagem","Reaterro compactado"];
 const cut=k>=1?[[X-20,X+B+20,yb+6,0]]:[];s+=R(0,G,W,H-G,"soil","none")+(k>=1?R(X-20,G,B+40,yb+6-G,"#e6dccb",SOIL,1.5):"")+R(xf+40,top,W-xf-40,G-top,k>=9?"soil":"#eaf2fa","none")+P([[X+B+20,G],[W,G],[W,top],[X+B+90,top]],"soil",SOIL);
 const px=[X+80,X+B-80];
 if(k==0)s+=GAB(140,640,G)+px.map(x=>STAKES(x,G,14)).join("")+DH(px[0],px[1],G-60,"e = 3φ entre filas",0,11)+LD(140,G-36,80,G-100,"eixo da cortina","start")+WORKER(560,G,1)+NOTE(380,405,"Locar alinhamento do muro e das filas; estacas a cada s (projeto).");
 if(k>=1)px.forEach(x=>s+=R(x-16,k>=2?yb-10:G,32,H-(k>=2?yb-10:G),"con",N,1.2)+BAR([[x-10,yb+60],[x-10,yb-40]],2)+BAR([[x+10,yb+60],[x+10,yb-40]],2));
 if(k==1)s+=RIG(px[1],G,150)+FOC(px[0]-22,G,44,H-G)+NOTE(380,405,"Boletim por estaca: profundidade, volume, armadura e data.");
 if(k==2)s+=px.map(x=>L(x-26,yb-10,x+26,yb-10,"#e74c3c",2,'stroke-dasharray="4 3"')).join("")+WORKER(380,yb+6,1,"mart")+LD(px[0]+20,yb-10,100,yb-40,"arrasar na cota — sobra de 5–10 cm dentro da sapata","start")+FOC(px[0]-26,yb-30,52,30);
 if(k>=3)s+=R(X,yb,B,6,"con",N);if(k==3)s+=FOC(X,yb-2,B,10)+LD(X+B-20,yb+3,X+B+40,yb+50,"lastro 5 cm nivelado");
 if(k>=4&&k<6)s+=FORMV(X-12,yb-h,12,h,-1)+FORMV(X+B,yb-h,12,h,1);
 if(k>=5)s+=R(X,yb-h,B,h,"con",N,1.5);
 if(k>=4)s+=BAR([[X+6,yb-8],[X+B-6,yb-8]],3)+BAR([[X+6,yb-h+8],[X+B-6,yb-h+8]],2.4)+BAR([[xf-8,k>=6?top:yb-h-70],[xf-8,yb-8],[xf-60,yb-8]],3)+BAR([[xt+8,k>=6?top:yb-h-50],[xt+8,yb-8],[xt+50,yb-8]],2.4);
 if(k==4)s+=LD(xf-8,yb-h-60,xf+60,yb-h-100,"arranques da cortina (face do aterro)")+LD(X+60,yb-8,X-10,yb+50,"armadura inferior/superior da sapata","start")+FOC(X,yb-h,B,h);
 if(k==5)s+=WORKER(X+250,yb-h,1,"vib")+TRUCK(560,G)+LD(xt+tb/2,yb-h,X+30,yb-h-60,"junta: superfície rugosa p/ a cortina","start")+FOC(X,yb-h,B,h);
 if(k>=6&&k<8)s+=FORMV(xt-12,top,12,yb-h-top,-1)+FORMV(xf,top,12,yb-h-top,1)+PL([[xt-20,top+50],[xt-110,yb-h]],"#a8763e",5);
 if(k>=6)for(let y=top+10;y<yb-h;y+=24)s+=L(xt+6,y,xf-6,y,STL,1.4);
 if(k>=7)s+=P([[xt,yb-h],[xt+tb-tt,top],[xf,top],[xf,yb-h]],"con",N,1.6);
 if(k==6)s+=LD(xf-8,top+60,xf+80,top+20,"armadura vertical + horizontal; espaçadores 3 cm")+LD(xt-60,top+120,90,top+90,"fôrma travada + escoras","start")+LD(xt+30,top+100,xt+90,top+150,"tubos de barbacã fixados")+FOC(xt-12,top,tb+24,yb-h-top);
 if(k==7)s+=WORKER(xf+70,G,1,"vib")+LD(xt+30,top+40,100,top+20,"camadas ≤ 50 cm; janelas de lançamento","start")+FOC(xt,top,tb,yb-h-top);
 if(k>=8)s+=R(xf,top+20,24,yb-h-top-20,"grav",N,.8)+L(xf+24,top+20,xf+24,yb-h,"#16a085",2,'stroke-dasharray="6 3"')+C(xf+16,yb-h-12,9,"#ecf0f1",N)+L(xt+tb/2-20,yb-h-50,xt-30,yb-h-44,"#3498db",4)+R(xf-2,top+20,3,yb-h-top-20,"#2c3e50");
 if(k==8)s+=LD(xf+16,yb-h-12,xf+110,yb-h+20,"dreno PVC Ø100 perfurado c/ caimento")+LD(xf+24,top+60,xf+110,top+40,"geotêxtil + brita drenante")+LD(xt-30,yb-h-44,90,yb-h-80,"barbacãs Ø75 — saída livre","start")+LD(xf-1,top+120,xf+110,top+120,"impermeabilização da face")+FOC(xf-4,top+20,40,yb-h-top-20);
 if(k==9){for(let i=0;i<5;i++)s+=L(xf+30,top+30+i*36,W,top+30+i*36,"#5b3a1c",1,'stroke-dasharray="6 4"');s+=COMPACT(640,top+30)+LD(xf+80,top+66,xf+110,top-30,"camadas ≤ 20 cm, compactador leve junto ao muro")+NOTE(380,405,"Só reaterrar com o concreto da cortina na resistência de projeto.")}
 return sv(k+1,ttl[k],s)}
// ---------- PAVIMENTO ----------
function pavimento(k){const G=320,X=40,Wd=680,h=70,hs=44;let s=sky;const tt=["Preparo do subleito","Sub-base","Fôrmas / trilhos","Barras de transferência e ligação com berços","Concretagem, vibração e régua","Acabamento e texturização","Cura","Serragem das juntas","Selagem das juntas"];
 s+=R(0,G,W,H-G,"soil","none")+L(0,G,W,G,"#5b3a1c",2);if(k==0)s+=COMPACT(240,G)+`<g transform="translate(420 ${G})"><rect x="-50" y="-40" width="100" height="26" fill="${A}" stroke="${N}"/><circle cx="-34" cy="-10" r="12" fill="#555"/><rect x="10" y="-26" width="50" height="26" rx="13" fill="#888" stroke="${N}"/></g>`+LD(560,G+10,600,G+60,"CBR ≥ projeto; GC ≥ 100% PN; regularizar ± 2 cm")+FOC(X,G-6,Wd,16);
 if(k>=1)s+=R(X,G-hs,Wd,hs,"grav",N);if(k==1)s+=DV(G-hs,G,X+Wd+18,"sub-base",14,10)+COMPACT(400,G-hs)+LD(X+200,G-hs/2,X+170,G+60,"BGS/BGTC/CCR em espessura de projeto")+FOC(X,G-hs,Wd,hs);
 const y=G-hs-h;if(k>=2&&k<6)s+=R(X-10,y,10,h,"#7f8c8d",N)+R(X+Wd,y,10,h,"#7f8c8d",N)+R(X-30,y+h-4,30,4,"#555");if(k==2)s+=LD(X-5,y,X+60,y-60,"fôrma-trilho metálica nivelada (topo = cota final)")+FOC(X-10,y,20,h)+L(X,G-hs-1,X+Wd,G-hs-1,"#2c3e50",2)+LD(X+300,G-hs-1,X+320,G-hs+50,"lona/imprimação")
 if(k>=4)s+=R(X,y,k>=7?Wd/2-2:Wd,h,"con",N,1.4)+(k>=7?R(X+Wd/2+2,y,Wd/2-2,h,"con",N,1.4):"");
 if(k>=3){const jx=X+Wd/2;s+=R(jx-60,y+h/2-3,120,6,STL,"#7a1d10")+PL([[jx-50,G-hs],[jx-50,y+h/2+4],[jx+50,y+h/2+4],[jx+50,G-hs]],"#555",2)+PL([[jx-40,G-hs],[jx-40,y+h/2+4]],"#555",1.5);if(k==3)s+=LD(jx+30,y+h/2,jx+90,y-60,"barra lisa, ½ engraxada, paralela ao eixo")+LD(jx-50,y+h/2+6,jx-160,y-50,"berço (cadeirinha) fixado")+DH(jx-60,jx+60,y-10,"L = 46 cm",0,10)+FOC(jx-70,y,140,h+hs)}
 if(k==4)s+=WORKER(200,y,1,"vib")+WORKER(480,y,1,"regua")+TRUCK(560,y-10)+NOTE(380,405,"Vibrar sem deslocar as barras; régua vibratória apoiada nas fôrmas.");
 if(k==5)s+=Array.from({length:40},(_,i)=>L(X+i*17,y,X+i*17+6,y+3,"#555",1)).join("")+WORKER(380,y,1)+LD(X+200,y+2,X+150,y-60,"desempeno + texturização (vassoura/ranhuras)");
 if(k==6)s+=DROPS(X+60,y-40,10)+LD(X+300,y,X+300,y-60,"agente de cura química (0,3 L/m²) ou manta úmida")+NOTE(380,405,"Iniciar a cura logo após o acabamento; proteger contra sol/vento.");
 if(k>=7){const jx=X+Wd/2;s+=R(jx-3,y,6,h/3,"#222");if(k==7)s+=`<g transform="translate(${jx} ${y})"><circle r="26" fill="#bdc3c7" stroke="${N}" stroke-width="2"/><rect x="-20" y="-60" width="80" height="34" fill="${A}" stroke="${N}"/></g>`+LD(jx+3,y+h/6,jx+140,y+30,"serrar h/3 entre 6 e 18 h (janela de corte)")+DV(y,y+h/3,jx-30,"h/3",20,10)}
 if(k==8){const jx=X+Wd/2;s+=R(jx-3,y,6,8,"#e67e22")+C(jx,y+11,3,"#2980b9")+LD(jx,y+4,jx+140,y-50,"selante sobre limitador (tarugo)")+LD(jx,y+11,jx-140,y-50,"limpar e secar a junta antes")+FOC(jx-30,y-4,60,h/2)}
 return sv(k+1,tt[k],s)}
// ---------- IMPERMEABILIZAÇÃO ----------
function imper(k){const ox=80,oy=345,cz=.62,sz=.38,pt=(x,h,z)=>[+(ox+x+z*cz).toFixed(1),+(oy-h-z*sz).toFixed(1)],Q=a=>a.map(p=>pt(...p));
 const PR=(x0,x1,h0,h1,z0,z1,c,st=N,sw=.8,op="")=>P(Q([[x0,h1,z0],[x1,h1,z0],[x1,h1,z1],[x0,h1,z1]]),sh(c,1.15),st,sw,op)+P(Q([[x1,h0,z0],[x1,h1,z0],[x1,h1,z1],[x1,h0,z1]]),sh(c,.78),st,sw,op)+P(Q([[x0,h0,z0],[x1,h0,z0],[x1,h1,z0],[x0,h1,z0]]),c,st,sw,op);
 const XW=480,ZD=250,HW=230,FB=(x0,x1,h0,h1,c,ex="")=>P(Q([[x0,h0,ZD],[x1,h0,ZD],[x1,h1,ZD],[x0,h1,ZD]]),c,"none",0,ex),FL=(z0,z1,h0,h1,c,ex="")=>P(Q([[0,h0,z0],[0,h0,z1],[0,h1,z1],[0,h1,z0]]),c,"none",0,ex),FF=(x0,x1,z0,z1,h,c,ex="")=>P(Q([[x0,h,z0],[x1,h,z0],[x1,h,z1],[x0,h,z1]]),c,N,.5,ex);
 const ttl=["Preparo do substrato: meia-cana e caimento","Regularização com argamassa","Aplicação do primer","Ralos e tubulações passantes reforçados","Tela de poliéster nos cantos","Membrana em demãos cruzadas (subida ≥ 30 cm; box ≥ 1,80 m)","Teste de estanqueidade (lâmina d'água 72 h)","Camada de proteção mecânica","Contrapiso e assentamento do revestimento"];
 const RX=340,RZ=115,TX=100,TZ=60,H30=26,HBX=160,BX=160,BZ=150;
 let s=R(0,0,760,430,"#eaf2fa","none");
 // laje + paredes (alvenaria)
 s+=PR(-16,XW,-26,0,0,ZD,"#b9bec5")+PR(-16,XW,-26,HW,ZD,ZD+16,"#c9643b")+PR(-16,0,0,HW,0,ZD,"#c9643b");
 for(let h=12;h<HW;h+=18)s+=PL(Q([[0,h,ZD],[XW,h,ZD]]),"#8a3f1f",.6)+PL(Q([[0,h,0],[0,h,ZD]]),"#8a3f1f",.6);
 s+=FB(0,XW,0,HW,"#d8d2c6")+FL(0,ZD,0,HW,"#cfc8bb");
 const f0=k>=1?6:0; // topo do piso atual
 // meia-cana
 s+=PL(Q([[0,5,0],[0,5,ZD-5],[XW,5,ZD-5]]),"#8d939b",7);
 if(k>=1)s+=PR(0,XW,0,6,0,ZD-2,"#d5cfc4",N,.6);
 // ralo e tubo
 const ral=(h)=>{const c=pt(RX,h+0.5,RZ);return`<ellipse cx="${c[0]}" cy="${c[1]}" rx="15" ry="7" fill="#555" stroke="${N}"/><ellipse cx="${c[0]}" cy="${c[1]}" rx="9" ry="4" fill="#222"/>`};
 const tubo=(h)=>{const a=pt(TX,h,TZ);return R(a[0]-7,a[1]-60,14,60,"#e8e8e8",N)+`<ellipse cx="${a[0]}" cy="${a[1]-60}" rx="7" ry="3" fill="#bbb" stroke="${N}"/><ellipse cx="${a[0]}" cy="${a[1]}" rx="7" ry="3" fill="#ddd" stroke="${N}"/>`};
 if(k>=2){s+=FF(0,XW,0,ZD-2,f0+.3,"#8e5b2a77")+FB(0,XW,0,k>=5?HBX:40,"#8e5b2a55")+FL(0,ZD,0,40,"#8e5b2a55")}
 if(k>=3){const c=pt(RX,f0+1,RZ),t=pt(TX,f0+1,TZ);s+=`<ellipse cx="${c[0]}" cy="${c[1]}" rx="34" ry="15" fill="#fdfefe" stroke="#7f8c8d" stroke-dasharray="3 2"/><ellipse cx="${t[0]}" cy="${t[1]}" rx="24" ry="11" fill="#fdfefe" stroke="#7f8c8d" stroke-dasharray="3 2"/>`}
 if(k>=4){s+=PL(Q([[0,f0+1,4],[0,f0+1,ZD-4],[XW,f0+1,ZD-4]]),"#ffffff",12)+PL(Q([[0,f0+1,4],[0,f0+1,ZD-4],[XW,f0+1,ZD-4]]),"#95a5a6",1,'stroke-dasharray="2 3"')+PL(Q([[0,f0,ZD-2],[0,k>=5?HBX:60,ZD-2]]),"#ffffff",10)}
 if(k>=5){s+=FF(0,XW,0,ZD-2,f0+1.5,"#2e86c1aa")+FB(0,XW,0,H30,"#2e86c1aa")+FL(0,ZD,0,H30,"#2e86c1aa")+FB(0,BX,0,HBX,"#2e86c1aa")+FL(BZ,ZD,0,HBX,"#2e86c1aa")}
 if(k<6||k>=7)s+=ral(k>=7?f0+5:f0+2);s+=tubo(k>=7?f0+5:f0+2);
 // box
 s+=PL(Q([[BX,f0+2,BZ],[BX,f0+2,ZD]]),"#34495e",3)+PL(Q([[0,f0+2,BZ],[BX,f0+2,BZ]]),"#34495e",3);if(k>=8)s+=P(Q([[BX,f0+6,BZ],[BX,f0+6,ZD],[BX,HBX+20,ZD],[BX,HBX+20,BZ]]),"#d6eaf855","#5d6d7e",1);
 if(k==6){s+=PR(0,XW,f0+2,f0+12,0,ZD-2,"#5dade2",N,.6,'fill-opacity=".55"');const c=pt(380,60,30);s+=C(c[0],c[1]+40,24,"#fff",N,2)+L(c[0],c[1]+40,c[0],c[1]+24,N,2)+L(c[0],c[1]+40,c[0]+12,c[1]+40,N,2)+T(c[0],c[1]+80,"72 h",14,"middle",N,800)}
 if(k>=7)s+=PR(0,XW,f0+2,f0+5,0,ZD-2,"#a6acaf",N,.6);
 if(k>=8){s+=PR(0,XW,f0+5,f0+12,0,ZD-2,"#ecf0f1",N,.6);for(let x=0;x<=XW;x+=35)s+=PL(Q([[x,f0+12.2,0],[x,f0+12.2,ZD-2]]),"#95a5a6",.8);for(let z=0;z<=ZD;z+=35)s+=PL(Q([[0,f0+12.2,z],[XW,f0+12.2,z]]),"#95a5a6",.8);
  s+=FB(0,XW,f0+12,HW,"#f4f6f6")+FL(0,ZD,f0+12,HW,"#eef1f1");for(let h=f0+12;h<HW;h+=30)s+=PL(Q([[0,h,ZD],[XW,h,ZD]]),"#b3b6b7",.8)+PL(Q([[0,h,0],[0,h,ZD]]),"#b3b6b7",.8);s+=ral(f0+12)}
 const CL=(p,n,lx,ly,lab,an="end")=>{const c=pt(...p);return LD(c[0],c[1],lx,ly,n+" "+lab,an)+CO(c[0],c[1]-16,n)};
 const slope=()=>[[60,40],[400,40],[60,200],[400,200]].map(([x,z])=>{const a=pt(x,f0+1,z),b=pt(x+(RX-x)*.45,f0+1,z+(RZ-z)*.45);return ARW(a[0],a[1],b[0],b[1],"#c0392b",2)}).join("");
 if(k==0)s+=CL([200,1,30],1,748,400,"substrato limpo, firme, sem nata/óleo")+CL([0,5,120],2,40,300,"meia-cana r ≈ 5–8 cm em cantos e arestas","start")+slope()+TB(748,70,"3 caimento ≥ 1% para o ralo",12,"end")+CO(...pt(250,1,170),3);
 if(k==1)s+=slope()+CL([200,6,40],1,748,400,"argamassa de regularização (≥ 2 cm, traço 1:3)")+CL([RX,6,RZ],2,748,60,"caimento ≥ 1% → ralo; sem empoçamento")+WORKER(...pt(250,6,190),.9,"regua");
 if(k==2)s+=CL([200,6,40],1,748,400,"primer em toda a área (rolo/trincha)")+CL([300,30,ZD],2,748,60,"subir nas paredes além da altura da membrana")+WORKER(...pt(260,6,180),.9);
 if(k==3)s+=CL([RX,7,RZ],1,748,400,"ralo: tela/manta de reforço Ø ≥ 30 cm + embutir no flange")+CL([TX,7,TZ],2,40,300,"tubo passante: colarinho de reforço + mastique","start");
 if(k==4)s+=CL([0,7,100],1,40,300,"tela de poliéster ≥ 10 cm p/ cada lado do canto","start")+CL([0,50,ZD],2,748,60,"canto vertical reforçado em toda a altura da membrana");
 if(k==5){s+=CL([300,H30-4,ZD],1,748,60,"subida ≥ 30 cm em todo o perímetro")+CL([0,HBX-10,200],2,40,90,"box: ≥ 1,80 m (ideal altura total)","start")+CL([300,8,40],3,748,400,"3–4 demãos cruzadas (consumo do fabricante)");const a=pt(220,8,40),b=pt(330,8,40),c=pt(270,8,10),d=pt(270,8,90);s+=ARW(a[0],a[1],b[0],b[1],N,2.5)+ARW(c[0],c[1],d[0],d[1],N,2.5)}
 if(k==6)s+=CL([250,16,60],1,748,400,"lâmina d'água ≥ 5 cm, ralo tampado")+CL([RX,16,RZ],2,748,60,"72 h sem queda de nível / manchas no teto de baixo");
 if(k==7)s+=CL([200,11,40],1,748,400,"argamassa de proteção 2–3 cm (1:4) sobre a membrana")+CL([0,30,ZD],2,40,90,"proteger a subida das paredes (chapisco/argamassa)","start");
 if(k==8)s+=CL([200,18,40],1,748,400,"contrapiso c/ caimento + revestimento com AC III")+CL([0,100,200],2,40,90,"rejunte flexível; vedar ralo e cantos com selante","start");
 return sv(k+1,ttl[k],s)}
// ---------- IMPERMEABILIZAÇÃO DE LAJES (manta asfáltica) ----------
function impLaje(k){const ox=70,oy=350,cz=.62,sz=.38,pt=(x,h,z)=>[+(ox+x+z*cz).toFixed(1),+(oy-h-z*sz).toFixed(1)],Q=a=>a.map(p=>pt(...p));
 const PR=(x0,x1,h0,h1,z0,z1,c,st=N,sw=.8,op="")=>P(Q([[x0,h1,z0],[x1,h1,z0],[x1,h1,z1],[x0,h1,z1]]),sh(c,1.15),st,sw,op)+P(Q([[x1,h0,z0],[x1,h1,z0],[x1,h1,z1],[x1,h0,z1]]),sh(c,.78),st,sw,op)+P(Q([[x0,h0,z0],[x1,h0,z0],[x1,h1,z0],[x0,h1,z0]]),c,st,sw,op);
 const XW=500,ZD=250,HP=90,FB=(x0,x1,h0,h1,c,ex="")=>P(Q([[x0,h0,ZD],[x1,h0,ZD],[x1,h1,ZD],[x0,h1,ZD]]),c,"none",0,ex),FL=(z0,z1,h0,h1,c)=>P(Q([[0,h0,z0],[0,h0,z1],[0,h1,z1],[0,h1,z0]]),c,"none",0),FF=(x0,x1,z0,z1,h,c,ex="")=>P(Q([[x0,h,z0],[x1,h,z0],[x1,h,z1],[x0,h,z1]]),c,N,.5,ex);
 const ttl=["Regularização com caimento 1–2% e meia-cana","Primer asfáltico","Manta asfáltica a maçarico (sobreposição 10 cm)","Arremates: ralos, rodapé ≥ 30 cm e encaixe na parede","Teste de estanqueidade (72 h)","Camada separadora","Proteção mecânica","Juntas da proteção mecânica"];
 const RX=360,RZ=90,R30=26;let s=R(0,0,760,430,"#dfeefa","none")+`<circle cx="700" cy="70" r="26" fill="#f9d56e"/>`;
 s+=PR(-16,XW,-30,0,0,ZD,"#b9bec5")+PR(-16,XW,-30,HP,ZD,ZD+16,"#c9643b")+PR(-16,0,0,HP,0,ZD,"#c9643b")+PR(-20,XW+4,HP,HP+6,ZD-2,ZD+20,"#9aa3ad")+PR(-22,2,HP,HP+6,-4,ZD,"#9aa3ad");
 s+=FB(0,XW,0,HP,"#d8d2c6")+FL(0,ZD,0,HP,"#cfc8bb");
 const f=k>=0?6:0;s+=PR(0,XW,0,6,0,ZD-2,"#d5cfc4",N,.6)+PL(Q([[0,9,2],[0,9,ZD-6],[XW,9,ZD-6]]),"#8d939b",7);
 const ral=h=>{const c=pt(RX,h+.5,RZ);return`<ellipse cx="${c[0]}" cy="${c[1]}" rx="16" ry="7" fill="#555" stroke="${N}"/><ellipse cx="${c[0]}" cy="${c[1]}" rx="9" ry="4" fill="#222"/>`};
 if(k>=1)s+=FF(0,XW,0,ZD-2,f+.3,"#3b2a1a88")+FB(0,XW,0,R30+12,"#3b2a1a66")+FL(0,ZD,0,R30+12,"#3b2a1a66");
 if(k>=2){const W=60;for(let z=0;z<ZD-2;z+=W-10){const z1=Math.min(ZD-2,z+W);s+=FF(0,XW,z,z1,f+1.2+(z/(W-10))*.15,"#2b2b2b");if(z>0)s+=PL(Q([[0,f+1.6,z+10],[XW,f+1.6,z+10]]),"#7f8c8d",1,'stroke-dasharray="5 3"')}}
 if(k>=3){s+=FB(0,XW,0,R30,"#2b2b2bee")+FL(0,ZD,0,R30,"#2b2b2bee")+PL(Q([[0,R30+3,ZD],[XW,R30+3,ZD]]),"#111",3)+PL(Q([[0,R30+3,0],[0,R30+3,ZD]]),"#111",3);const c=pt(RX,f+2,RZ);s+=`<ellipse cx="${c[0]}" cy="${c[1]}" rx="38" ry="16" fill="#3d3d3d" stroke="#7f8c8d" stroke-dasharray="3 2"/>`}
 if(k<4||k>=6)s+=ral(k>=6?f+12:f+2);
 if(k==4){s+=PR(0,XW,f+2,f+14,0,ZD-2,"#5dade2",N,.6,'fill-opacity=".55"');const c=[640,330];s+=C(c[0],c[1],24,"#fff",N,2)+L(c[0],c[1],c[0],c[1]-16,N,2)+L(c[0],c[1],c[0]+12,c[1],N,2)+T(c[0],c[1]+40,"72 h",14,"middle",N,800)}
 if(k>=5)s+=FF(0,XW,0,ZD-2,f+3,"#f2f3f4ee");
 if(k>=6){s+=PR(0,XW,f+3,f+12,0,ZD-2,"#a6acaf",N,.6)+FB(0,XW,0,R30,"#b8bcbf")+FL(0,ZD,0,R30,"#b8bcbf")}
 if(k>=7){for(let x=100;x<XW;x+=100)s+=PL(Q([[x,f+12.3,0],[x,f+12.3,ZD-8]]),"#222",2.4);for(let z=80;z<ZD;z+=80)s+=PL(Q([[8,f+12.3,z],[XW,f+12.3,z]]),"#222",2.4);s+=PL(Q([[6,f+12.3,0],[6,f+12.3,ZD-6],[XW,f+12.3,ZD-6]]),"#e67e22",4)}
 const CL=(p,n,lx,ly,lab,an="end")=>{const c=pt(...p);return LD(c[0],c[1],lx,ly,n+" "+lab,an)+CO(c[0],c[1]-16,n)};
 const slope=()=>[[60,40],[480,40],[60,210],[480,210]].map(([x,z])=>{const a=pt(x,f+1,z),b=pt(x+(RX-x)*.45,f+1,z+(RZ-z)*.45);return ARW(a[0],a[1],b[0],b[1],"#c0392b",2)}).join("");
 const FLAME=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M0 0l40 18" stroke="#555" stroke-width="4"/><path d="M40 18q22 0 30 12q-18 4-30-4z" fill="#f39c12"/><path d="M44 20q14 2 20 8q-12 2-20-3z" fill="#e74c3c"/></g>`;
 if(k==0)s+=slope()+CL([200,6,40],1,748,410,"regularização: caimento 1–2% p/ os ralos")+CL([0,9,140],2,30,250,"meia-cana em todo o perímetro","start")+CL([RX,6,RZ],3,748,120,"ralos rebaixados ~1 cm, limpos e fixos");
 if(k==1)s+=CL([200,7,50],1,748,410,"primer asfáltico (≈ 0,3–0,5 L/m²), secar ≥ 6 h")+CL([0,R30+8,200],2,30,200,"primer também no rodapé","start")+WORKER(...pt(280,7,170),.9);
 if(k==2){const r=pt(420,f+8,140);s+=`<g><rect x="${r[0]-10}" y="${r[1]-22}" width="80" height="22" rx="11" fill="#1c1c1c" stroke="${N}"/><ellipse cx="${r[0]-10}" cy="${r[1]-11}" rx="6" ry="11" fill="#444" stroke="${N}"/></g>`+WORKER(r[0]+110,r[1]+10,.9)+FLAME(r[0]+92,r[1]-40)+CL([200,f+2,60],1,748,410,"manta asfáltica 4 mm aderida a maçarico")+CL([200,f+2,60],2,30,240,"sobreposição ≥ 10 cm (sentido do caimento)","start")}
 if(k==3){s+=CL([RX,f+3,RZ],1,748,410,"ralo: reforço de manta + manta entra no ralo")+CL([300,R30-6,ZD],2,748,110,"rodapé ≥ 30 cm acima do piso acabado")+CL([100,R30+3,ZD],3,30,90,"encaixe (rasgo ~3 cm) + mastique/argamassa","start");
  const X=24,Y=250;s+=R(X,Y,200,150,"#fffdf7",N,1.2,'rx="8"')+T(X+10,Y+18,"DETALHE DO RODAPÉ",12,"start",N,800)+R(X+120,Y+28,40,110,"#c9643b",N)+R(X+20,Y+118,140,20,"#b9bec5",N)+PL([[X+20,Y+114],[X+116,Y+114],[X+116,Y+66],[X+124,Y+62]],"#111",4)+R(X+116,Y+56,10,8,"#e67e22",N)+DV(Y+66,Y+114,X+100,"≥ 30 cm",8,10)+T(X+60,Y+108,"manta",10,"middle","#fff")}
 if(k==4)s+=CL([200,f+14,60],1,748,410,"lâmina d'água ≥ 5 cm, ralos tampados")+CL([RX,f+14,RZ],2,748,110,"72 h: sem queda de nível / umidade no teto");
 if(k==5)s+=CL([200,f+3,60],1,748,410,"camada separadora: filme PE/geotêxtil, sobrepor 10 cm")+CL([0,R30,180],2,30,200,"subir no rodapé","start");
 if(k==6)s+=CL([200,f+12,60],1,748,410,"proteção mecânica: argamassa 1:4, ≥ 3 cm")+CL([0,R30-4,180],2,30,200,"rodapé protegido (tela + argamassa)","start")+WORKER(...pt(300,f+12,170),.9,"regua");
 if(k==7)s+=CL([200,f+12.3,80],1,748,410,"juntas a cada 1,5–2,0 m (≈ 4 m²)")+CL([6,f+12.3,160],2,30,220,"junta perimetral junto ao rodapé","start")+CL([300,f+12.3,160],3,748,110,"preencher com mastique/selante");
 return sv(k+1,ttl[k],s)}
// ---------- CONTEÚDO ----------
const IMPMAT=(()=>{const ic=(c,lab)=>`<svg class="gico" viewBox="0 0 60 60"><path d="M12 18h36l-4 36H16z" fill="${c}" stroke="#0b1a30" stroke-width="2"/><ellipse cx="30" cy="18" rx="18" ry="5" fill="${c}" stroke="#0b1a30" stroke-width="2"/><text x="30" y="42" font-size="9" text-anchor="middle" fill="#fff" font-weight="700">${lab}</text></svg>`,rl=`<svg class="gico" viewBox="0 0 60 60"><rect x="6" y="20" width="44" height="24" rx="12" fill="#1c1c1c" stroke="#0b1a30" stroke-width="2"/><ellipse cx="50" cy="32" rx="6" ry="12" fill="#444" stroke="#0b1a30" stroke-width="2"/><path d="M14 44h40" stroke="#555" stroke-width="3"/></svg>`;
 const rows=[[ic("#95a5a6","AP"),"Argamassa polimérica (NBR 16072)","Banheiros, box, cozinhas, áreas de serviço, reservatórios e baldrames; áreas sem movimentação","2,0–4,0 kg/m²","3–4 demãos cruzadas (+ tela de poliéster)","2–6 h entre demãos; ≥ 3–5 dias antes do teste"],
 [ic("#5dade2","ML"),"Manta líquida acrílica","Áreas molhadas internas, lajes pequenas expostas sem trânsito, marquises","1,2–2,0 kg/m² (≈ 1 mm seco)","3–4 demãos cruzadas + tela de poliéster","4–6 h entre demãos; ≥ 72 h antes do teste"],
 [ic("#8e44ad","PU"),"Manta líquida de poliuretano (PU)","Áreas molhadas, lajes e terraços, inclusive com trânsito leve; boa elasticidade","1,0–2,0 kg/m²","2–3 demãos cruzadas","6–24 h entre demãos; ≥ 72 h antes do teste"],
 [rl,"Manta asfáltica (NBR 9952) aderida a maçarico","Lajes, terraços, coberturas, calhas e jardineiras — grandes áreas e movimentação","Manta 3–4 mm (≈ 4–5 kg/m²) + primer 0,3–0,5 L/m²","1 camada (2 em áreas críticas), sobreposição 10 cm","Primer: secagem ≥ 6 h; teste logo após aplicação/resfriamento (≥ 24 h)"]];
 return`<div class="gmat"><h3>Materiais de impermeabilização — escolha e consumo</h3><div class="gmatw"><table><thead><tr><th></th><th>Sistema</th><th>Onde usar</th><th>Consumo típico</th><th>Demãos / camadas</th><th>Cura entre demãos / antes do teste</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td><b>${r[1]}</b></td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td></tr>`).join("")}</tbody></table></div><p class="fnote">Valores típicos/orientativos — siga sempre a ficha técnica do fabricante e o projeto de impermeabilização (NBR 9575).</p></div>`})();
const SEG={esc:"EPI completo (capacete, botina, luvas, óculos) — NR-6.",esc2:"Escavações > 1,25 m: talude ou escoramento; afastar material da borda — NR-18.",alt:"Trabalho em altura > 2 m: guarda-corpo e cinto tipo paraquedas — NR-35.",vib:"Vibrador com aterramento e cabo íntegro; protetor auricular.",conc:"Contato com cimento: luvas e mangas — risco de dermatite/queimadura alcalina."};
const sec=(id,t,tools,normas,draw,steps,post="")=>({id,t,tools,normas,post,steps:steps.map((x,i)=>({t:x[0],txt:x[1],chk:x[2],seg:x[3],err:x[4]||[],d:()=>draw(i)}))});
const S=[
sec("sapata","Sapata isolada",["sapata"],["NBR 6122:2019","NBR 6118:2023","NBR 14931:2023","NBR 12655:2022","NBR 15696:2009","NR-18"],sapata,[
["Locação e gabarito","Monte o gabarito nivelado ao redor da obra e marque os eixos com linha de náilon; transfira para o solo com prumo e piquete.",["Eixos conforme planta de locação","Diagonais conferidas (esquadro)","Tolerância de locação ≤ 2 cm"],[SEG.esc]],
["Escavação da cava","Escave até a cota de projeto com folga lateral para fôrma. Verifique se o solo de apoio confere com a sondagem.",["Cota de fundo conferida","Solo firme, sem água/lama","Fundo e taludes estáveis"],[SEG.esc2]],
["Apiloamento e lastro","Apiloe o fundo e lance lastro de concreto magro (≈ 5 cm) para regularizar e proteger a armadura.",["Lastro nivelado e limpo","Espessura ≥ 5 cm"],[SEG.esc]],
["Fôrmas da sapata","Monte e trave as fôrmas nas dimensões B × L × h, no esquadro e centradas nos eixos.",["Dimensões ± 1 cm","Travamento contra o terreno","Desmoldante aplicado"],[SEG.esc]],
["Armação, espaçadores e arranques","Posicione a malha inferior com ganchos sobre espaçadores (cobrimento ≥ 5 cm, NBR 6118 — CAA) e amarre os arranques do pilar com estribos.",["Bitolas/espaçamentos conforme projeto","Cobrimento 5 cm garantido","Arranques no prumo e no eixo"],[SEG.esc,"Proteger pontas de barras (capacetes plásticos)."]],
["Concretagem e vibração","Lance o concreto com altura ≤ 2 m e vibre em pontos próximos, sem tocar a armadura. Molde corpos de prova.",["Slump conforme traço","CPs moldados (NBR 12655)","Sem segregação/ninhos"],[SEG.vib,SEG.conc]],
["Cura e desforma","Mantenha a superfície úmida por pelo menos 7 dias; desforme após ≥ 3 dias.",["Cura iniciada logo após o acabamento","Registro de datas"],[SEG.esc]],
["Reaterro compactado","Reaterre em camadas de até 20 cm, compactadas, sem danificar o pilar.",["Material sem matéria orgânica","Camadas ≤ 20 cm"],[SEG.esc,"Compactador: protetor auricular e calçado de segurança."]]]),
sec("radier","Radier",["radier"],["NBR 6122:2019","NBR 6118:2023","NBR 14931:2023","NBR 12655:2022"],radier,[
["Terraplenagem e compactação","Remova solo orgânico, execute aterro em camadas e compacte até o grau especificado.",["GC ≥ 95% PN (ou projeto)","Nivelamento ± 2 cm"],[SEG.esc]],
["Instalações embutidas","Posicione e teste tubulações sob o radier; deixe esperas tampadas.",["Teste de estanqueidade","Esperas nas posições do projeto"],[SEG.esc]],
["Lastro e lona plástica","Execute lastro/brita e lona como barreira de umidade, com transpasse ≥ 15 cm.",["Lona íntegra e sobreposta","Lastro nivelado"],[SEG.esc]],
["Fôrmas de borda","Monte fôrmas de borda niveladas pelo topo na espessura h.",["Topo no nível de projeto","Travamento a cada 60 cm"],[SEG.esc]],
["Armadura inferior com espaçadores","Monte a malha inferior sobre espaçadores (cobrimento 3–5 cm).",["Malha amarrada nos cruzamentos","Cobrimento garantido"],[SEG.esc]],
["Armadura superior com caranguejos","Apoie a malha superior em caranguejos, garantindo a altura útil.",["Altura útil conferida","Caranguejos a cada ~80 cm"],[SEG.esc]],
["Concretagem, vibração e sarrafeamento","Concrete de forma contínua, vibre e sarrafeie pelas fôrmas de borda.",["Plano de concretagem","CPs moldados"],[SEG.vib,SEG.conc]],
["Acabamento e cura","Desempene/alise conforme o piso previsto e faça cura úmida por ≥ 7 dias.",["Cura iniciada no mesmo dia","Proteção contra tráfego"],[SEG.conc]]]),
sec("estacas","Estacas e bloco",["estacas"],["NBR 6122:2019 (Anexos de execução por tipo de estaca)","NBR 6118:2023","NBR 14931:2023"],estacas,[
["Locação dos eixos das estacas","Marque o centro de cada estaca a partir do gabarito, com piquete identificado.",["Coordenadas conferidas","Identificação das estacas"],[SEG.esc]],
["Perfuração / cravação","Execute a estaca pelo método de projeto, registrando profundidade e parâmetros em boletim.",["Profundidade ≥ projeto","Boletim preenchido"],["Isolar a área do equipamento; operador habilitado — NR-12/NR-18."]],
["Armação e concretagem da estaca","Concrete de forma contínua e introduza a armadura de topo centralizada.",["Sobreconsumo registrado","Armadura centralizada"],[SEG.conc]],
["Escavação e arrasamento","Escave até o fundo do bloco e arrase as estacas na cota, sem danificá-las.",["Cota de arrasamento","Concreto são no topo"],[SEG.esc2,"Óculos de proteção ao demolir a cabeça."]],
["Lastro de concreto magro","Lance lastro de 5 cm em torno das cabeças.",["Nivelado e limpo"],[SEG.esc]],
["Fôrma do bloco","Monte a fôrma nas dimensões do bloco, centrada no pilar.",["Dimensões ± 1 cm","Travamento"],[SEG.esc]],
["Armação do bloco e arranques","Posicione a armadura principal sobre as estacas, estribos e arranques do pilar.",["Ancoragem da armadura das estacas","Cobrimento 5 cm"],[SEG.esc]],
["Concretagem do bloco e cura","Concrete, vibre e cure por pelo menos 7 dias.",["CPs moldados","Cura úmida"],[SEG.vib,SEG.conc]]]),
sec("pilar","Pilar de concreto",["pilar"],["NBR 6118:2023","NBR 14931:2023","NBR 15696:2009","NR-18","NR-35"],pilar,[
["Conferência de eixos e arranques","Confira posição dos arranques e limpe a base (remover nata).",["Eixo e seção do projeto","Base apicoada e limpa"],[SEG.esc]],
["Armação: longitudinais e estribos","Monte a gaiola com estribos no espaçamento do projeto e ganchos alternados.",["Nº e bitola de barras","Espaçamento dos estribos"],[SEG.esc]],
["Espaçadores (cobrimento)","Fixe espaçadores nas 4 faces a cada ~1 m.",["Cobrimento 2,5–3 cm (CAA)"],[SEG.esc]],
["Fôrma, prumo e escoras","Feche a fôrma, aprume nas duas direções e escore.",["Prumo ≤ 1 cm","Gravatas a cada 50 cm"],[SEG.alt]],
["Concretagem em camadas","Lance em camadas de ~50 cm vibrando cada uma; altura de queda ≤ 2 m.",["Sem ninhos de concretagem"],[SEG.vib,SEG.alt]],
["Desforma e cura","Desforme após ≥ 3 dias e mantenha úmido por 7 dias.",["Inspeção visual da superfície"],[SEG.alt]]]),
sec("viga","Viga de concreto",["viga"],["NBR 6118:2023","NBR 14931:2023","NBR 15696:2009","NR-18","NR-35"],viga,[
["Escoramento e fundo da fôrma","Escore o fundo conforme projeto de escoramento, com contraflecha se indicada.",["Base das escoras firme","Contraventamento das escoras"],[SEG.alt]],
["Fôrmas laterais e travamento","Monte as laterais com gravatas e sarrafos.",["Largura e altura ± 0,5 cm"],[SEG.alt]],
["Armação e espaçadores","Posicione a armadura com espaçadores e ancoragens nos pilares.",["Cobrimento 2,5–3 cm","Ancoragens conferidas"],[SEG.alt]],
["Conferência antes da concretagem","Faça checklist de armação e fôrma; limpe e molhe a fôrma.",["Checklist assinado"],[SEG.alt]],
["Concretagem e vibração","Concrete em camadas, de um apoio ao outro, vibrando.",["CPs moldados"],[SEG.vib,SEG.conc]],
["Cura e retirada do escoramento","Cure por 7 dias; retire escoras só no prazo de projeto.",["Prazos de desforma registrados"],[SEG.alt]]]),
sec("laje","Laje maciça",["laje"],["NBR 6118:2023","NBR 14931:2023","NBR 15696:2009","NR-35"],laje,[
["Escoramento e contraflecha","Monte o escoramento conforme projeto, nivelado e com contraflecha.",["Espaçamento das escoras","Contraflecha conferida"],[SEG.alt]],
["Fôrma de compensado","Monte o assoalho e as bordas; aplique desmoldante.",["Nível ± 0,5 cm","Juntas vedadas"],[SEG.alt]],
["Armadura positiva com espaçadores","Monte as duas camadas positivas sobre espaçadores.",["Espaçamento conforme projeto","Cobrimento 2,5 cm"],[SEG.alt]],
["Armadura negativa com caranguejos","Posicione negativos nos apoios sobre caranguejos.",["Comprimento dos negativos","Altura mantida"],[SEG.alt]],
["Instalações embutidas","Fixe eletrodutos e caixas sem cortar armadura.",["Eletrodutos amarrados"],[SEG.alt]],
["Concretagem e sarrafeamento","Concrete por mestras na espessura h, vibrando e sarrafeando.",["Espessura conferida","CPs moldados"],[SEG.vib,SEG.alt]],
["Cura e desforma","Cure por 7 dias e retire as escoras na sequência do projeto.",["Prazos registrados"],[SEG.alt]]]),
sec("trelicada","Laje treliçada",["trelicada"],["NBR 14859-1/-2 (lajes pré-fabricadas)","NBR 6118:2023","NBR 15696:2009","NR-35"],trelicada,[
["Linhas de escoramento","Monte linhas de escoras perpendiculares às vigotas no espaçamento do fabricante.",["Espaçamento ≤ 1,2 m (ou fabricante)","Contraflecha"],[SEG.alt]],
["Posicionamento das vigotas","Apoie as vigotas nas vigas/paredes (≥ 5 cm) no intereixo de projeto.",["Intereixo conferido","Apoio mínimo"],[SEG.alt]],
["Colocação de lajotas / EPS","Encaixe o enchimento entre vigotas; nunca pise direto nas lajotas.",["Peças íntegras","Use tábuas de passagem"],[SEG.alt,"Lajotas não suportam peso de pessoas."]],
["Nervura de travamento e armadura negativa","Execute nervuras transversais e armaduras negativas indicadas.",["Nervura a cada ~2 m em vãos > 4 m"],[SEG.alt]],
["Tela da capa e instalações","Posicione a tela soldada sobre espaçadores e as instalações.",["Transpasse da tela","Eletrodutos fixos"],[SEG.alt]],
["Molhagem e concretagem","Molhe o enchimento e concrete capa + nervuras.",["Capa ≥ 4 cm","Vibração das nervuras"],[SEG.vib,SEG.alt]],
["Cura e retirada do escoramento","Cure 7 dias; retire escoras conforme o fabricante.",["Prazo ≥ 21 dias (típico)"],[SEG.alt]]]),
sec("metalica","Estrutura metálica (pilar, viga e treliça)",["pilar-aco","viga-aco","trelica"],["NBR 8800:2008","NBR 14762:2010 (perfis formados a frio)","NBR 16239:2013 (tubulares)","NR-11","NR-18","NR-35"],metalica,[
["Recebimento e armazenagem","Confira peças e certificados; armazene sobre calços.",["Romaneio e marcação","Sem empenos/corrosão"],[SEG.esc]],
["Chumbadores e grauteamento das bases","Posicione chumbadores com gabarito; após prumo, grauteie.",["Posição ± 3 mm","Graute sem vazios"],[SEG.esc]],
["Montagem e prumo dos pilares","Ice e aprume os pilares; trave provisoriamente.",["Prumo ≤ H/1000"],[SEG.alt,"Içamento com plano de rigging — NR-11."]],
["Vigas e ligações parafusadas","Monte as vigas e aperte parafusos conforme especificação.",["Torque/marcação","Furos sem alargamento a maçarico"],[SEG.alt]],
["Içamento das treliças","Ice pelas posições indicadas, com cabos-guia.",["Área isolada","Vento dentro do limite"],[SEG.alt,"Ninguém sob carga suspensa."]],
["Contraventamentos","Instale e tensione os contraventamentos antes de liberar cargas.",["Todos os vãos contraventados"],[SEG.alt]],
["Proteção anticorrosiva e inspeção","Retoque pintura nas ligações e inspecione soldas/parafusos.",["Espessura de película","Relatório de inspeção"],["Pintura: máscara com filtro e ventilação."]]]),
sec("muro","Muro de contenção / cortina sobre sapata corrida e estacas",["muro"],["NBR 11682:2009","NBR 6122:2019","NBR 6118:2023","NBR 14931:2023","NBR 15696:2009","NR-18"],muro,[
["Locação","Locar alinhamento da cortina, eixos das filas de estacas e posição de cada estaca.",["Alinhamento e cotas","Espaçamento s conforme projeto"],[SEG.esc]],
["Execução das estacas","Executar as estacas (comprimento, diâmetro e armadura de projeto) com boletim.",["Profundidade ≥ projeto","Boletins"],["Isolar área do equipamento — NR-18."]],
["Arrasamento das estacas","Arrasar na cota, mantendo 5–10 cm embutidos e a armadura íntegra.",["Concreto são no topo"],[SEG.esc2]],
["Lastro de concreto magro","Lançar lastro de 5 cm em toda a faixa da sapata corrida.",["Nivelado"],[SEG.esc]],
["Armação da sapata e arranques","Montar armaduras inferior/superior da sapata e os arranques da cortina (face do aterro).",["Arranques no alinhamento","Cobrimento 5 cm"],[SEG.esc]],
["Concretagem da sapata","Concretar, vibrar e deixar a junta com a cortina rugosa e limpa.",["Superfície de junta apicoada"],[SEG.vib,SEG.conc]],
["Fôrma e armação da cortina","Montar armadura vertical/horizontal, tubos de barbacã e fôrmas escoradas.",["Espessuras topo/base","Barbacãs posicionados"],[SEG.alt]],
["Concretagem da cortina","Concretar em camadas ≤ 50 cm com vibração; cura 7 dias.",["CPs moldados","Sem ninhos"],[SEG.vib,SEG.alt]],
["Drenagem","Impermeabilizar a face, instalar geotêxtil, brita drenante, dreno Ø100 e barbacãs.",["Dreno com caimento e saída","Barbacãs desobstruídas"],[SEG.esc]],
["Reaterro compactado","Reaterrar em camadas ≤ 20 cm com compactador leve junto à cortina, após o concreto atingir a resistência.",["Camadas controladas","Sem equipamento pesado a < 1 m do muro"],[SEG.esc]]]),
sec("pavimento","Pavimento rígido",["pavimento"],["DNIT 047/2004-ES, 048/2004-ES e 049/2013-ES","DNIT — Manual de Pavimentos Rígidos (2005)","NBR 7583:1986 (execução de pavimentos de concreto)","NBR 12655:2022"],pavimento,[
["Preparo do subleito","Regularizar e compactar o subleito; corrigir pontos fracos.",["CBR ≥ projeto","Grau de compactação"],[SEG.esc]],
["Sub-base","Executar a sub-base na espessura de projeto, compactada e nivelada.",["Espessura ± 1 cm","Lisura"],[SEG.esc]],
["Fôrmas / trilhos","Instalar fôrmas-trilho travadas com topo na cota final.",["Alinhamento","Cota do topo"],[SEG.esc]],
["Barras com berços","Posicionar barras de transferência (lisas, engraxadas) e de ligação em berços.",["Paralelas ao eixo e à superfície","Meia-altura da placa"],[SEG.esc]],
["Concretagem, vibração e régua","Lançar, vibrar e sarrafear com régua vibratória.",["Slump/abatimento","CPs de tração na flexão"],[SEG.vib,SEG.conc]],
["Acabamento e texturização","Desempenar e texturizar (vassoura ou ranhuras) para aderência.",["Textura uniforme"],[SEG.conc]],
["Cura","Aplicar cura química ou úmida logo após o acabamento.",["Taxa de aplicação","Proteção contra tráfego"],[SEG.conc]],
["Serragem das juntas","Serrar juntas a h/3 dentro da janela de corte (≈ 6 a 18 h).",["Profundidade h/3","Sem fissuras aleatórias"],["Serra com proteção do disco, água e protetor auricular."]],
["Selagem das juntas","Limpar, secar, colocar tarugo e aplicar selante.",["Junta limpa e seca","Fator de forma do selante"],[SEG.esc]]])];
S.push(sec("impermeabilizacao","Impermeabilização de áreas molhadas (banheiros, box, cozinhas e áreas de serviço)",[],["NBR 9575:2010 (seleção e projeto)","NBR 9574:2008 (execução)","NBR 15575-3 (desempenho — pisos)","NBR 16072 (argamassa polimérica)","NR-6","NR-18"],imper,[
["Preparo do substrato","Limpe e recupere a base; arredonde cantos e arestas (meia-cana) e confirme o caimento para o ralo.",["Base firme, seca e sem nata, óleo ou pó","Meia-cana r ≈ 5–8 cm","Caimento ≥ 1% para o ralo"],[SEG.esc,"Ventilar o ambiente; usar óculos e máscara ao lixar."],["Cantos vivos (a membrana fissura)","Ralo acima do piso — água empoça"]],
["Regularização com argamassa","Execute regularização com argamassa (≥ 2 cm, traço 1:3) já com o caimento definitivo.",["Espessura ≥ 2 cm","Sem empoçamento (teste com água)","Cura ≥ 7 dias antes do primer"],[SEG.conc],["Corrigir caimento só no contrapiso final","Argamassa fraca ou fissurada"]],
["Aplicação do primer","Aplique o primer indicado pelo fabricante em toda a área, inclusive nas subidas das paredes.",["Base umedecida/seca conforme o produto","Tempo de secagem respeitado"],["Produto inflamável/solvente: sem chamas, local ventilado, luvas e máscara."],["Pular o primer","Aplicar sobre poeira"]],
["Ralos e tubulações passantes","Reforce ralos e tubos com tela/manta e mastique antes da membrana geral.",["Reforço Ø ≥ 30 cm em volta do ralo","Membrana entra no flange do ralo","Tubos com colarinho + selante"],[SEG.esc],["Ralo sem flange/reforço — principal causa de vazamento","Tubo solto ou sem colarinho"]],
["Tela de poliéster nos cantos","Aplique faixas de tela de poliéster incorporadas na 1ª demão em cantos, arestas e encontros.",["Faixa ≥ 10 cm para cada lado","Tela totalmente embebida, sem bolhas"],[SEG.esc],["Tela sobreposta seca (sem produto)","Esquecer o canto vertical do box"]],
["Membrana em demãos cruzadas","Aplique argamassa polimérica ou manta líquida em 3–4 demãos cruzadas, subindo ≥ 30 cm nas paredes e ≥ 1,80 m (ideal: altura total) no box.",["Consumo/espessura do fabricante","Demãos perpendiculares, intervalo respeitado","Subida ≥ 30 cm; box ≥ 1,80 m"],["Luvas e óculos; ventilação.",SEG.esc],["Demão única e grossa","Subida baixa no box","Furar a membrana depois (pregos, fixações)"]],
["Teste de estanqueidade","Tampe o ralo e mantenha lâmina d'água por 72 h; verifique o nível e o teto do pavimento inferior.",["Lâmina ≥ 5 cm","72 h sem queda de nível","Sem manchas/umidade abaixo"],["Isolar e sinalizar a área; risco de escorregamento."],["Pular o teste","Testar antes da cura total da membrana"]],
["Camada de proteção mecânica","Proteja a membrana com argamassa (2–3 cm) no piso e chapisco/argamassa nas subidas.",["Membrana íntegra antes da proteção","Espessura 2–3 cm"],[SEG.conc],["Andar/carregar materiais sobre a membrana desprotegida"]],
["Contrapiso e revestimento","Execute contrapiso com caimento e assente o revestimento com argamassa colante adequada; rejunte flexível e selante nos cantos e ralo.",["Caimento final ≥ 1%","AC III / rejunte flexível","Selante em ralo, cantos e box"],[SEG.conc,"Cortes de cerâmica: óculos, luvas e protetor auricular."],["Grelha do ralo acima do piso","Rejunte rígido em áreas de box"]]],IMPMAT));
S.push(sec("impermeabilizacao-laje","Impermeabilização — lajes, terraços e coberturas (manta asfáltica)",[],["NBR 9575:2010","NBR 9574:2008","NBR 9952:2014 (manta asfáltica)","NR-18","NR-35","NR-6"],impLaje,[
["Regularização, caimento e meia-cana","Regularize com argamassa 1:3 (≥ 2 cm) com caimento de 1 a 2% para os ralos; meia-cana em todo o perímetro.",["Caimento 1–2%","Ralos rebaixados e fixos","Base seca, sem pó e sem fissuras"],[SEG.alt,SEG.esc],["Caimento < 1% (empoçamento)","Cantos vivos no encontro com a platibanda"]],
["Primer asfáltico","Aplique primer asfáltico em toda a área e no rodapé; aguarde a secagem.",["0,3–0,5 L/m²","Secagem ≥ 6 h (película seca ao toque)"],["Produto inflamável: sem fumo/chama durante a secagem; máscara e luvas."],["Aplicar sobre base úmida","Maçarico antes da secagem do primer"]],
["Manta a maçarico","Desenrole e alinhe a manta; aqueça com maçarico, aderindo totalmente, com sobreposição de 10 cm no sentido do caimento.",["Sobreposição ≥ 10 cm","Emendas biseladas/seladas","Sem bolhas nem rugas"],["Maçarico/GLP: extintor PQS no local, mangueira e regulador vistoriados, botijão afastado e em pé.","EPI: luvas de raspa, botina, óculos, roupa de algodão; linha de vida se perto da borda (NR-35)."],["Sobreposição contra o caimento","Superaquecer e furar a manta"]],
["Arremates: ralos, rodapé e encaixe","Reforce ralos com manta extra entrando no tubo; suba a manta ≥ 30 cm no rodapé e embuta no rasgo da parede com mastique.",["Rodapé ≥ 30 cm acima do piso acabado","Encaixe ~3 cm + selante","Ralo com reforço"],["Maçarico: atenção a materiais combustíveis próximos (madeira, esquadrias)."],["Rodapé baixo","Manta só colada na parede, sem encaixe"]],
["Teste de estanqueidade","Tampe os ralos e mantenha lâmina d'água por 72 h; inspecione o teto inferior.",["Lâmina ≥ 5 cm","72 h sem queda de nível"],["Verificar a carga da lâmina d'água na laje; sinalizar a área."],["Pular o teste","Sobrecarga de água em laje sem verificação"]],
["Camada separadora","Lance filme de polietileno ou geotêxtil sobre a manta, com sobreposição de 10 cm.",["Cobertura total","Subida no rodapé"],[SEG.esc],["Argamassa direto sobre a manta (aderência/fissuras transmitidas)"]],
["Proteção mecânica","Execute argamassa 1:4 com ≥ 3 cm (ou contrapiso armado em áreas com trânsito) e proteja o rodapé.",["Espessura ≥ 3 cm","Tela no rodapé"],[SEG.conc,SEG.alt],["Carrinhos sobre a manta sem proteção","Perfurar a manta com ferramentas"]],
["Juntas da proteção mecânica","Corte/forme juntas a cada 1,5–2,0 m e junta perimetral; preencha com mastique.",["Painéis ≈ 4 m²","Junta perimetral junto ao rodapé"],["Serra: óculos, protetor auricular e luvas."],["Sem junta perimetral (empurra o rodapé)","Juntas sem selante"]]]));
const MAP={sapata:"sapata",radier:"radier",estacas:"estacas",pilar:"pilar",viga:"viga",laje:"laje",trelicada:"trelicada","pilar-aco":"metalica","viga-aco":"metalica",trelica:"metalica",muro:"muro",pavimento:"pavimento"};
function html(se,print=false){return`<section class="gsec" id="${se.id}"><div class="ghd"><h2>${se.t}</h2>${print?"":`<button class="btn ghost gpr" data-sec="${se.id}" type="button">Imprimir esta seção</button>`}</div><p class="gnor"><b>Normas:</b> ${se.normas.join(" · ")}</p>
 <ol class="gsteps">${se.steps.map((st,i)=>`<li class="gstep"><figure class="gfig">${st.d()}</figure><div class="gtx"><h3><span>${i+1}</span>${st.t}</h3><p>${st.txt}</p><div class="gchk"><b>✔ Checklist / tolerâncias</b><ul>${st.chk.map(c=>`<li>${c}</li>`).join("")}</ul></div>${st.err.length?`<div class="gerr"><b>✖ Erros comuns</b><ul>${st.err.map(c=>`<li>${c}</li>`).join("")}</ul></div>`:""}<div class="gseg"><b>⚠ Segurança</b><ul>${st.seg.map(c=>`<li>${c}</li>`).join("")}</ul></div></div></li>`).join("")}</ol>${se.post||""}</section>`}
return{S,MAP,html,sec:id=>S.find(x=>x.id==(MAP[id]||id))}})();
