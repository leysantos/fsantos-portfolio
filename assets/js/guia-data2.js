// Guia — procedimentos complementares (FSantos Engenharia)
(()=>{const{N,A,STL,R,L,P,PL,C,T,TB,DH,DV,CO,LD,ARW,WORKER,DROPS,sh}=K;const{sec,SEG,sv}=GUIA.kit;
const iso=(ox,oy,cz=.62,sz=.38)=>{const pt=(x,h,z)=>[+(ox+x+z*cz).toFixed(1),+(oy-h-z*sz).toFixed(1)],Q=a=>a.map(p=>pt(...p));
 const PR=(x0,x1,h0,h1,z0,z1,c,st=N,sw=.8,ex="")=>P(Q([[x0,h1,z0],[x1,h1,z0],[x1,h1,z1],[x0,h1,z1]]),sh(c,1.15),st,sw,ex)+P(Q([[x1,h0,z0],[x1,h1,z0],[x1,h1,z1],[x1,h0,z1]]),sh(c,.78),st,sw,ex)+P(Q([[x0,h0,z0],[x1,h0,z0],[x1,h1,z0],[x0,h1,z0]]),c,st,sw,ex);
 const PZ=(x0,x1,h0,h1,z,c,st="none",sw=0,ex="")=>P(Q([[x0,h0,z],[x1,h0,z],[x1,h1,z],[x0,h1,z]]),c,st,sw,ex);
 const PH=(x0,x1,z0,z1,h,c,st=N,sw=.5,ex="")=>P(Q([[x0,h,z0],[x1,h,z0],[x1,h,z1],[x0,h,z1]]),c,st,sw,ex);
 const LN=(pts,c=N,w=1,ex="")=>PL(Q(pts),c,w,ex);
 const EXT=(pr,z0,z1,c,st=N,sw=.8)=>{let s="";for(let i=0;i<pr.length;i++){const a=pr[i],b=pr[(i+1)%pr.length];s+=P(Q([[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]]),sh(c,b[0]-a[0]>0||b[1]-a[1]<0?1.12:.8),st,sw*.6)}return s+P(Q(pr.map(([x,h])=>[x,h,z0])),c,st,sw)};
 const SHEET=(pl,z0,z1,c="#aab7c4",w=3.5)=>{let s="";for(let i=0;i<pl.length-1;i++){const a=pl[i],b=pl[i+1];s+=P(Q([[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]]),sh(c,1.08),"#5d6d7e",.6)}return s+PL(Q(pl.map(([x,h])=>[x,h,z0])),"#34495e",w)};
 const CL=(p,n,lx,ly,lab,an)=>{const c=pt(...p);an=an||(lx>380?"end":"start");return LD(c[0],c[1],lx,ly,(n?n+" ":"")+lab,an)+(n?CO(c[0],c[1]-15,n):"")};
 const AR=(p1,p2,c="#c0392b",w=2.2)=>{const a=pt(...p1),b=pt(...p2);return ARW(a[0],a[1],b[0],b[1],c,w)};
 const BRICK=(x0,x1,h0,h1,z0,z1,ch=20,c="#c9643b")=>{let s=PR(x0,x1,h0,h1,z0,z1,c);let r=0;for(let h=h0+ch;h<h1;h+=ch,r++)s+=LN([[x0,h,z0],[x1,h,z0],[x1,h,z1]],"#8a3f1f",.7);r=0;for(let h=h0;h<h1-1;h+=ch,r++)for(let x=x0+(r%2?20:40);x<x1;x+=40)s+=LN([[x,h,z0],[x,Math.min(h+ch,h1),z0]],"#8a3f1f",.7);return s};
 return{pt,Q,PR,PZ,PH,LN,EXT,SHEET,CL,AR,BRICK}};
const BG=(c="#eaf2fa")=>R(0,0,760,430,c,"none");
const INS=(x,y,w,h,t,b)=>R(x,y,w,h,"#fffdf7",N,1.2,'rx="8"')+T(x+10,y+18,t,12,"start",N,800)+b;
const GRD=I=>I.PH(-60,640,-40,300,0,"#9fbf7f",N,.4);
const SOILB=(I,x0,x1,h0,h1,z0,z1)=>I.PR(x0,x1,h0,h1,z0,z1,"#a87b4f");
const FLM=(x,y)=>`<path d="M${x} ${y}q22 0 30 12q-18 4-30-4z" fill="#f39c12"/>`;
const S=GUIA.S,add=(...a)=>S.push(sec(...a));
const SG={eq:SEG.esc,alt:SEG.alt,conc:SEG.conc,vib:SEG.vib,esc2:SEG.esc2,corte:"Corte com serra/esmerilhadeira: óculos, protetor auricular, luvas e máscara PFF2.",tel:"Telhado: linha de vida + cinto paraquedas (NR-35); tábuas de apoio sobre as telhas; não trabalhar com chuva/vento."};

// ================= RUFO E CONTRARRUFO =================
function rufo(k){const I=iso(70,380,.55,.32),Z=200;let s=BG("#dfeefa");
 const WX0=430,WX1=490,RH=150,top=360;
 const ttl=["Levantamento e marcação","Corte e dobra da chapa galvanizada","Rasgo (encaixe) na alvenaria","Rufo: peça inferior sobre as telhas","Contrarrufo encaixado com pingadeira","Sobreposição entre peças (≥ 10 cm)","Fixação e selante PU","Rufo de capa (chapéu) na platibanda","Inspeção e teste com água"];
 if(k==1){s+=I.PH(-40,520,-20,Z+40,0,"#c8ccd1");s+=I.PR(40,420,0,60,40,140,"#7f8c8d");const pl=[[80,64],[260,64],[260,74],[330,74],[330,64],[360,64]];s+=I.PH(80,360,60,120,64.5,"#aab7c4","#5d6d7e",.8);[[150,"dobra 90°"],[230,"dobra 90°"],[300,"dobra 135° (pingadeira)"]].forEach(([x,t],i)=>s+=I.LN([[x,65,60],[x,65,120]],"#c0392b",2,'stroke-dasharray="6 4"')+I.CL([x,65,90],i+1,i<2?30:748,90+i*40,t));
  s+=INS(470,240,270,170,"PERFIS (corte)",PL([[500,280],[500,380],[600,380]],"#34495e",4)+T(560,398,"rufo (L)",11)+PL([[640,270],[640,340],[625,355]],"#34495e",4)+PL([[640,270],[660,270],[660,282]],"#34495e",4)+T(680,320,"contrarrufo",11,"start")+T(668,350,"pingadeira",10,"start")+T(600,300,"chapa galv. nº 24/26",10)+T(600,314,"(0,5–0,65 mm)",10));
  s+=I.CL([360,64,90],"",748,60,"desenvolvimento conforme projeto");return sv(2,ttl[1],s)}
 if(k==7){const I2=iso(150,400,.55,.32);s+=I2.BRICK(100,300,0,240,20,Z,20)+I2.PH(100,300,20,Z,240,"#b9bec5");
  const cap=[[80,215],[80,252],[200,262],[320,252],[320,215]];s+=I2.EXT([[100,240],[300,240],[300,246],[200,256],[100,246]],20,Z,"#b9bec5")+I2.SHEET(cap,10,Z+10,"#aab7c4",4);
  s+=I2.CL([200,262,100],1,748,60,"rufo de capa com caimento p/ dentro (cobertura)")+I2.CL([80,215,40],2,30,150,"pingadeira afastada ≥ 2 cm da parede")+I2.CL([320,215,40],3,748,300,"pingadeira nos dois lados")+I2.CL([200,256,150],4,30,60,"base de argamassa com caimento ≥ 2%")+I2.AR([220,262,60],[300,250,60],"#2e86c1");
  s+=DH(I2.pt(80,215,10)[0],I2.pt(100,215,10)[0],I2.pt(80,215,10)[1]+18,"≥ 2 cm",0,10);return sv(8,ttl[7],s)}
 s+=I.PH(-40,560,-20,Z+40,0,"#c8ccd1");
 s+=I.BRICK(WX0,WX1,0,top,-10,Z+10,24);
 const roof=[[0,60],[WX0,RH],[WX0,RH+14],[0,74]];s+=I.EXT([[0,40],[WX0,RH-14],[WX0,RH-2],[0,52]],0,Z,"#8e6b3a");
 for(let z=0;z<Z;z+=40)s+=I.LN([[0,52,z],[WX0,RH-2,z]],"#6b4a2a",3);
 const tile=x=>RH-2+(x-WX0)*(RH-54)/(WX0)*0;
 for(let x=0;x<WX0;x+=36){const h0=52+x*(RH-54)/WX0;s+=I.EXT([[x,h0],[x+40,h0+40*(RH-54)/WX0],[x+40,h0+40*(RH-54)/WX0+10],[x,h0+10]],0,Z,"#c0563b",N,.6)}
 const GH=RH+150;
 if(k==0)s+=I.LN([[WX0,GH,0],[WX0,GH,Z]],"#c0392b",2,'stroke-dasharray="8 4"')+I.CL([WX0,GH,60],1,30,60,"linha do rasgo ≥ 15–20 cm acima da telha")+DV(I.pt(WX0,RH+8,0)[1],I.pt(WX0,GH,0)[1],I.pt(WX0,0,0)[0]-14,"≥ 15 cm",8,10)+I.CL([200,100,40],2,30,380,"telhado concluído e fixado; medir comprimento total")+I.CL([WX1,200,Z],3,748,120,"parede/platibanda: reboco firme e prumo")+WORKER(...I.pt(330,RH+10,120),.9);
 if(k>=2)s+=I.PR(WX0-12,WX0+1,GH-8,GH,0,Z,"#4a4a4a",N,.5);
 if(k==2)s+=I.CL([WX0-6,GH-4,80],1,30,60,"rasgo 2–3 cm de profundidade × 1 cm, com serra")+I.CL([WX0-6,GH-4,170],2,748,60,"limpar o pó; não usar talhadeira/marreta")+WORKER(...I.pt(380,RH+10,120),.9)+`<g transform="translate(${I.pt(WX0-6,GH-4,120)[0]-30} ${I.pt(WX0-6,GH-4,120)[1]-10})"><circle r="14" fill="#bdc3c7" stroke="${N}"/><rect x="-6" y="-30" width="12" height="18" fill="${A}" stroke="${N}"/></g>`;
 const rufoPl=[[WX0-80,RH-12+0],[WX0-80,RH+2],[WX0-1,RH+2+0],[WX0-1,RH+110]];
 if(k>=3)s+=I.SHEET([[WX0-80,RH-6-((80)*(RH-54)/WX0)+8],[WX0-1,RH+2],[WX0-1,RH+110]],0,k==5?Z/2+20:Z,"#aab7c4",4);
 if(k==3)s+=I.CL([WX0-40,RH-4,60],1,30,90,"aba sobre as telhas ≥ 10 cm (acompanhar a onda)")+I.CL([WX0-1,RH+80,40],2,748,120,"subida na parede ≥ 15 cm (sem fixar na telha)")+DV(I.pt(WX0,RH+2,0)[1],I.pt(WX0,RH+110,0)[1],I.pt(WX0,0,0)[0]-16,"≥ 15 cm",10,10)+I.AR([WX0-120,RH+60,30],[WX0-20,RH+20,30],"#2e86c1");
 const cr=[[WX0-12,GH-4],[WX0-12,GH-4],[WX0-4,GH-4],[WX0-4,RH+60],[WX0-16,RH+48]];
 if(k>=4)s+=I.SHEET([[WX0-11,GH-4],[WX0-4,GH-4],[WX0-4,RH+60],[WX0-18,RH+46]],0,k==5?Z/2+20:Z,"#c3ccd5",4);
 if(k==4)s+=I.CL([WX0-8,GH-4,60],1,30,60,"contrarrufo embutido no rasgo")+I.CL([WX0-4,RH+80,150],2,748,100,"cobre o rufo ≥ 5 cm (transpasse vertical)")+I.CL([WX0-18,RH+46,30],3,30,250,"pingadeira 45° — afasta a água da junta")+DV(I.pt(WX0,RH+60,0)[1],I.pt(WX0,RH+110,0)[1],I.pt(WX0,0,0)[0]-40,"≥ 5 cm",6,10)+I.AR([WX0+60,GH+60,40],[WX0-30,RH+40,40],"#2e86c1",2.5);
 if(k==5){s+=I.SHEET([[WX0-80,RH-6-((80)*(RH-54)/WX0)+8],[WX0-1,RH+2],[WX0-1,RH+110]],Z/2,Z,"#9fb0c0",4)+I.SHEET([[WX0-11,GH-4],[WX0-4,GH-4],[WX0-4,RH+60],[WX0-18,RH+46]],Z/2,Z,"#b3bfcb",4);
  s+=I.PZ(WX0-80,WX0,RH-30,RH+112,Z/2,"#e74c3c33","#c0392b",2)+I.CL([WX0-40,RH+20,Z/2+10],1,748,330,"sobreposição ≥ 10 cm no sentido do escoamento")+I.CL([WX0-1,RH+60,Z/2+15],2,748,140,"rebites de alumínio + selante entre as peças")+[0,1,2].map(i=>C(...I.pt(WX0-2,RH+30+i*25,Z/2+12),3,"#7f8c8d",N)).join("")+INS(20,50,250,140,"EMENDA (vista)",R(50,100,120,40,"#aab7c4",N)+R(140,92,110,40,"#c3ccd5",N,1,'opacity=".9"')+DH(140,170,160,"≥ 10 cm",0,10)+C(150,112,3,"#555")+C(160,122,3,"#555")+T(205,150,"selante",10))}
 if(k==6){const g=I.pt(WX0-8,GH-2,100);s+=I.LN([[WX0-10,GH+1,0],[WX0-10,GH+1,Z]],"#ecf0f1",6)+I.LN([[WX0-10,GH+1,0],[WX0-10,GH+1,Z]],"#bdc3c7",1,'stroke-dasharray="3 3"')+[40,100,160].map(z=>C(...I.pt(WX0-4,GH-30,z),3.5,"#2c3e50")).join("");
  s+=I.CL([WX0-10,GH+1,40],1,30,60,"selante PU (não silicone acético) no rasgo")+I.CL([WX0-4,GH-30,160],2,748,80,"fixação: parafuso + bucha + arruela vedante c/ 30–50 cm")+I.CL([WX0-4,RH+100,60],3,748,330,"nunca furar o rufo na zona de água")+INS(20,240,240,150,"DETALHE DO ENCAIXE",R(170,262,50,120,"#c9643b",N)+R(162,290,10,8,"#4a4a4a")+PL([[164,294],[172,294]],"#34495e",4)+PL([[166,294],[166,350],[150,366]],"#34495e",4)+C(168,288,4,"#ecf0f1",N)+T(110,282,"selante PU",10)+T(105,345,"contrarrufo",10)+T(110,378,"pingadeira",10))}
 if(k==8){s+=I.CL([WX0-4,RH+60,60],1,30,60,"teste com mangueira por 10–15 min")+I.CL([WX0-60,RH-2,140],2,748,330,"verificar infiltração no forro/parede interna")+DROPS(...I.pt(WX0-120,RH+120,40),6)+WORKER(...I.pt(300,RH+5,150),.9);s+=I.AR([WX0-40,RH+150,30],[WX0-30,RH+90,30],"#2e86c1",3)}
 return sv(k+1,ttl[k],s)}
add("rufo","Rufo e contrarrufo",[],["NBR 15575-5 (desempenho de coberturas)","NBR 7008 (chapas de aço zincadas)","NBR 8039/NBR 15310 (telhados — telhas)","NR-35","NR-18"],rufo,[
["Levantamento e marcação","Meça o encontro telhado × parede e marque a linha do rasgo a 15–20 cm acima da telha.",["Telhado concluído e fixado","Linha nivelada/paralela à telha","Reboco firme"],[SG.tel],["Rasgo baixo demais (água passa por cima)","Medir sem descontar sobreposições"]],
["Corte e dobra da chapa galvanizada","Corte a chapa (nº 24/26) e dobre em dobradeira: rufo em L e contrarrufo com pingadeira.",["Chapa galvanizada/pré-pintada sem riscos","Dobras retas, sem trincas","Pingadeira ≥ 1,5 cm a 45°"],[SG.corte,"Bordas cortantes: luvas anticorte."],["Dobrar no joelho/martelo (ondula)","Chapa fina demais (amassa)"]],
["Rasgo (encaixe) na alvenaria","Abra o rasgo com serra (2–3 cm de profundidade), contínuo e nivelado; limpe o pó.",["Profundidade 2–3 cm","Rasgo contínuo e reto","Sem quebrar o bloco"],[SG.corte,SG.tel],["Abrir com talhadeira (trinca o reboco)","Colar o contrarrufo sem rasgo (só silicone)"]],
["Rufo: peça inferior","Assente o rufo sobre as telhas (aba ≥ 10 cm) com subida ≥ 15 cm na parede, sem fixar na telha.",["Aba acompanha a telha","Subida ≥ 15 cm","Folga para dilatação"],[SG.tel],["Fixar o rufo na parede e na telha (trava a movimentação)","Aba curta"]],
["Contrarrufo com pingadeira","Encaixe o contrarrufo no rasgo, cobrindo a subida do rufo em ≥ 5 cm, com a pingadeira para fora.",["Transpasse vertical ≥ 5 cm","Pingadeira afastada da parede"],[SG.tel],["Contrarrufo sem pingadeira","Contrarrufo encostado na telha"]],
["Sobreposição entre peças","Emende as peças com sobreposição ≥ 10 cm no sentido do escoamento, rebites e selante.",["Sobreposição ≥ 10 cm","Peça de cima sobre a de baixo","Rebites de alumínio"],[SG.tel],["Emenda de topo","Sobreposição invertida (contra a água)"]],
["Fixação e selante PU","Fixe com parafuso + bucha + arruela vedante (30–50 cm) acima da zona de água e sele o rasgo com PU.",["Selante PU compatível","Fixações fora da lâmina d'água"],[SG.tel,"Selante: luvas; ventilação."],["Silicone acético (corrói o zinco)","Furos na zona de escoamento"]],
["Rufo de capa (platibanda)","Cubra o topo da platibanda com rufo de capa com caimento p/ dentro e pingadeiras dos dois lados.",["Base com caimento ≥ 2%","Pingadeira ≥ 2 cm afastada","Emendas sobrepostas"],[SG.alt,SG.tel],["Topo plano (empoça)","Pingadeira colada à parede (mancha/escorre)"]],
["Inspeção e teste com água","Teste com mangueira e inspecione forro, paredes internas e emendas.",["Sem gotejamento","Selantes contínuos","Pingadeiras livres"],[SG.tel],["Não testar antes do forro","Esquecer a inspeção periódica (selante envelhece)"]]]);

// ================= CALHAS E CONDUTORES =================
function calha(k){const I=iso(60,360,.6,.34),Z=320;let s=BG("#dfeefa");const ttl=["Dimensionamento e caimento","Suportes (escápulas)","Calha: instalação e emendas","Bocal, condutor e abraçadeiras","Proteção e teste"];
 s+=I.BRICK(380,440,0,200,0,Z,22)+I.PR(200,440,200,214,0,Z,"#b9bec5");
 for(let x=150;x<380;x+=34)s+=I.EXT([[x,280-(x-150)*.35],[x+38,280-(x+38-150)*.35],[x+38,290-(x+38-150)*.35],[x,290-(x-150)*.35]],0,Z,"#c0563b",N,.5);
 const eh=280-(380-150)*.35;const gh=z=>eh-30-z*0.02;
 if(k==0)s+=I.LN([[350,gh(0)+10,0],[350,gh(Z)+10,Z]],"#c0392b",2,'stroke-dasharray="8 4"')+I.CL([350,gh(160)+10,160],1,748,60,"caimento ≥ 0,5% p/ o bocal (linha esticada)")+I.CL([250,250,100],2,30,60,"área de contribuição (NBR 10844)")+INS(20,250,250,150,"DIMENSIONAMENTO",T(145,295,"Q = i·A / 60",14)+T(145,320,"i = intensidade (mm/h)",11)+T(145,340,"A = área (m²)",11)+T(145,362,"1 condutor a cada ≈ 20 m",11)+T(145,382,"seção ≥ Ø 75 mm",11));
 if(k>=1)for(let z=20;z<Z;z+=80)s+=I.LN([[360,gh(z)+14,z],[360,gh(z)-8,z],[420,gh(z)-8,z],[420,gh(z)+14,z]],"#34495e",3)+I.LN([[380,gh(z)+14,z],[380,gh(z)+30,z]],"#34495e",3);
 if(k==1)s+=I.CL([360,gh(100)-8,100],1,748,80,"escápulas c/ ≤ 60–90 cm, fixadas no beiral/parede")+I.CL([420,gh(260)-8,260],2,748,330,"alturas seguindo o caimento");
 const prof=[[360,0],[360,-22],[420,-22],[420,0]];
 if(k>=2)s+=I.SHEET(prof.map(([x,h])=>[x,h+gh(0)+14]),0,Z,"#aab7c4",3.5);
 if(k==2)s+=I.CL([390,gh(150)-6,150],1,748,90,"calha encaixada nas escápulas")+I.CL([390,gh(200)-6,200],2,30,60,"emendas sobrepostas ≥ 10 cm + rebite/solda + selante")+I.CL([370,gh(0)+10,0],3,30,330,"testeira com pingadeira/rufo sob a telha");
 if(k>=3){const b=I.pt(390,gh(Z-30)-22,Z-30);s+=R(b[0]-8,b[1],16,190,"#dfe6e9",N)+[60,130].map(y=>R(b[0]-12,b[1]+y,24,6,"#7f8c8d",N)).join("");if(k==3)s+=I.CL([390,gh(Z-30)-22,Z-30],1,748,60,"bocal + funil/ralo hemisférico")+LD(b[0]+12,b[1]+66,700,300,"2 abraçadeiras c/ ≤ 2 m","end")+CO(b[0]+20,b[1]+60,2)+LD(b[0],b[1]+190,560,410,"3 saída para caixa de areia / drenagem","end")}
 if(k==4)s+=I.CL([390,gh(160)-4,160],1,748,60,"grelha/tela contra folhas")+DROPS(...I.pt(300,300,80),5)+I.CL([390,gh(40)-4,40],2,30,330,"teste: encher e verificar escoamento e vazamentos")+WORKER(...I.pt(250,214,250),.9);
 return sv(k+1,ttl[k],s)}
add("calhas","Calhas e condutores",[],["NBR 10844:1989 (águas pluviais)","NBR 15575-5","NR-35"],calha,[
["Dimensionamento e caimento","Defina seção, caimento ≥ 0,5% e número de condutores pela área de contribuição.",["Caimento ≥ 0,5%","Condutor ≥ Ø 75 mm","1 condutor a cada ≈ 20 m de calha"],[SG.tel],["Calha subdimensionada","Calha sem caimento (empoça e corrói)"]],
["Suportes (escápulas)","Fixe escápulas a cada 60–90 cm acompanhando o caimento.",["Espaçamento uniforme","Fixação firme"],[SG.alt],["Suportes espaçados (calha cede)"]],
["Calha: instalação e emendas","Encaixe a calha, emende com sobreposição ≥ 10 cm, rebites/solda e selante.",["Emendas estanques","Testeira/pingadeira sob a telha"],[SG.alt,SG.corte],["Emenda de topo","Telha não avança sobre a calha"]],
["Bocal, condutor e abraçadeiras","Instale bocal com funil, condutor prumado e abraçadeiras a cada ≤ 2 m.",["Condutor no prumo","Saída para caixa de areia"],[SG.alt],["Descarga direta no pé da parede"]],
["Proteção e teste","Coloque grelhas e teste com água.",["Sem vazamentos","Escoamento rápido"],[SG.tel],["Sem grelha (entope)","Não prever manutenção"]]]);

// ================= TELHADO =================
function telhado(k){const I=iso(70,370,.6,.34),Z=300;let s=BG("#dfeefa");const ttl=["Estrutura: tesouras e terças","Caibros","Ripas (galga)","Telhas","Cumeeira e arremates"];
 s+=I.BRICK(0,30,0,140,0,Z,20)+I.BRICK(500,530,0,140,0,Z,20)+I.PR(0,530,140,152,0,12,"#b9bec5")+I.PR(0,530,140,152,Z-12,Z,"#b9bec5");
 const ap=(x)=>152+(x<265?x:530-x)*0.42;
 [10,Z/2,Z-10].forEach(z=>s+=I.LN([[0,152,z],[265,ap(265),z],[530,152,z],[0,152,z]],"#8e6b3a",5)+I.LN([[265,152,z],[265,ap(265),z]],"#8e6b3a",4)+I.LN([[130,152,z],[130,ap(130)-4,z]],"#8e6b3a",3)+I.LN([[400,152,z],[400,ap(400)-4,z]],"#8e6b3a",3));
 [60,160,265,370,470].forEach(x=>s+=I.PR(x-6,x+6,ap(x),ap(x)+12,0,Z,"#a87b4f",N,.5));
 if(k==0)s+=I.CL([265,ap(265),Z/2],1,30,60,"tesouras apoiadas na cinta (respaldo)")+I.CL([160,ap(160)+12,40],2,748,60,"terças c/ conforme projeto, travadas")+I.CL([0,146,Z-12],3,30,330,"cinta de amarração + chumbadores");
 if(k>=1)for(let z=0;z<=Z;z+=50){s+=I.LN([[0,ap(0)+14,z],[265,ap(265)+14,z]],"#c8955a",4)+I.LN([[530,ap(530)+14,z],[265,ap(265)+14,z]],"#c8955a",4)}
 if(k==1)s+=I.CL([120,ap(120)+14,150],1,748,60,"caibros c/ ≈ 50 cm (seção 5×6 cm)")+DH(I.pt(0,0,0)[0]+200,I.pt(0,0,0)[0]+229,350,"",0);
 if(k>=2)for(let x=10;x<520;x+=34){const h=ap(x)+18;s+=I.LN([[x,h,0],[x,h,Z]],"#d9a96a",3)}
 if(k==2)s+=I.CL([180,ap(180)+18,200],1,748,60,"ripas na galga da telha (≈ 32–40 cm)")+INS(20,240,220,150,"GALGA",T(130,290,"medir 10 telhas encaixadas",11)+T(130,310,"galga = comprimento / 10",11)+T(130,340,"1ª ripa dobrada (beiral)",11));
 if(k>=3){const end=k==3?380:530;for(let x=10;x<end;x+=34){const sx=x<265?x:x+0;for(let z=0;z<Z;z+=30){if(x>=255&&x<=275)continue;s+=I.PR(x,Math.min(x+36,530),ap(x)+20,ap(x)+26,z,z+30,"#c0563b",N,.4)}}}
 if(k==3)s+=I.CL([300,ap(300)+26,100],1,748,60,"assentar do beiral p/ a cumeeira")+I.CL([200,ap(200)+26,220],2,30,60,"fiadas contra o vento predominante")+I.CL([60,ap(60)+26,20],3,30,330,"amarrar/fixar telhas do beiral e de áreas de vento");
 if(k==4)s+=I.PR(250,280,ap(265)+18,ap(265)+34,0,Z,"#a84a30",N,.6)+I.CL([265,ap(265)+34,Z/2],1,748,60,"cumeeira emboçada (argamassa 1:3 + aditivo) ou seca")+I.CL([10,ap(10)+26,Z],2,30,60,"beiral: testeira e arremates (rufos)")+WORKER(...I.pt(200,ap(200)+28,150),.85);
 return sv(k+1,ttl[k],s)}
add("telhado","Telhado: estrutura, telhas e cumeeira",[],["NBR 7190:2022 (estruturas de madeira)","NBR 15310:2009 (telhas cerâmicas)","NBR 15575-5","NR-35","NR-18"],telhado,[
["Estrutura: tesouras e terças","Monte as tesouras sobre a cinta, alinhadas e contraventadas; fixe as terças.",["Madeira tratada e seca","Tesouras no prumo e contraventadas","Ancoragem na cinta"],[SG.alt,SG.tel],["Apoiar direto na alvenaria sem cinta","Madeira verde/sem tratamento"]],
["Caibros","Fixe os caibros a cada ≈ 50 cm, alinhados com o caimento.",["Espaçamento uniforme","Planicidade do plano"],[SG.tel],["Caibros desalinhados (telhado ondulado)"]],
["Ripas (galga)","Pregue as ripas na galga da telha medida em obra.",["Galga medida com 10 telhas","1ª ripa dobrada no beiral"],[SG.tel],["Galga errada (telha não encaixa/infiltra)"]],
["Telhas","Assente do beiral para a cumeeira, encaixando e amarrando onde houver vento.",["Inclinação mínima do fabricante","Telhas sem trinca","Amarração nos beirais"],[SG.tel],["Inclinação abaixo da mínima","Pisar direto nas telhas"]],
["Cumeeira e arremates","Assente a cumeeira (emboçada ou seca) e faça os arremates/rufos.",["Cumeeira alinhada","Arremates estanques"],[SG.tel],["Argamassa fraca (solta)","Esquecer rufos nos encontros"]]]);

// ================= LOCAÇÃO =================
function locacao(k){const I=iso(90,360,.62,.36);let s=BG()+GRD(I);const ttl=["Limpeza e marco de referência (RN)","Montagem do gabarito","Marcação dos eixos com pregos e linhas","Transferência ao solo e conferência"];
 const X0=40,X1=500,Z0=30,Z1=270,H=60;
 s+=I.PR(560,572,0,30,20,32,"#7f8c8d")+I.CL([566,30,26],k==0?1:0,748,90,"RN / marco de referência (cota e alinhamento)");
 if(k==0)s+=I.CL([250,0,150],2,30,60,"terreno limpo, nivelado e sem vegetação")+WORKER(...I.pt(300,0,100),1,"pa");
 if(k>=1){[[X0,Z0],[X1,Z0],[X0,Z1],[X1,Z1]].forEach(()=>0);for(let x=X0;x<=X1;x+=46){[Z0-20,Z1+20].forEach(z=>s+=I.PR(x-3,x+3,0,H,z-3,z+3,"#d9a96a",N,.5))}for(let z=Z0;z<=Z1;z+=48){[X0-20,X1+20].forEach(x=>s+=I.PR(x-3,x+3,0,H,z-3,z+3,"#d9a96a",N,.5))}
  s+=I.PR(X0-20,X1+20,H-8,H,Z0-23,Z0-17,"#c8955a",N,.6)+I.PR(X0-20,X1+20,H-8,H,Z1+17,Z1+23,"#c8955a",N,.6)+I.PR(X0-23,X0-17,H-8,H,Z0-20,Z1+20,"#c8955a",N,.6)+I.PR(X1+17,X1+23,H-8,H,Z0-20,Z1+20,"#c8955a",N,.6)}
 if(k==1)s+=I.CL([X0+100,H,Z0-20],1,748,400,"tábuas niveladas (≈ 1 m de altura), afastadas ~1,5 m da obra")+I.CL([X1+20,H,150],2,748,80,"pontaletes a cada ≈ 1,5 m, contraventados")+DV(I.pt(X0-20,0,Z0-20)[1],I.pt(X0-20,H,Z0-20)[1],I.pt(X0-20,0,Z0-20)[0]-12,"≈ 1 m",8,10);
 if(k>=2){[150,330].forEach(x=>s+=I.LN([[x,H+1,Z0-20],[x,H+1,Z1+20]],"#e74c3c",1.5));[100,220].forEach(z=>s+=I.LN([[X0-20,H+1,z],[X1+20,H+1,z]],"#e74c3c",1.5))}
 if(k==2)s+=I.CL([150,H+1,Z0-20],1,30,80,"pregos nos eixos (cotas acumuladas)")+I.CL([330,H+1,160],2,748,80,"linhas de náilon esticadas")+INS(20,240,230,150,"BOAS PRÁTICAS",T(135,288,"cotas acumuladas a partir",11)+T(135,304,"de um mesmo ponto",11)+T(135,330,"pintar/identificar eixos",11)+T(135,356,"conferir com trena aferida",11));
 if(k==3){const p=I.pt(150,H,100);s+=L(p[0],p[1],p[0],p[1]+60,"#555",1)+P([[p[0]-4,p[1]+58],[p[0]+4,p[1]+58],[p[0],p[1]+68]],"#555")+I.PR(147,153,0,14,97,103,"#d9a96a")+I.LN([[150,2,100],[330,2,220]],"#2e86c1",2,'stroke-dasharray="6 4"')+I.LN([[330,2,100],[150,2,220]],"#2e86c1",2,'stroke-dasharray="6 4"')+I.CL([150,30,100],1,30,80,"prumo transfere o cruzamento → piquete")+I.CL([240,2,160],2,748,400,"conferir diagonais (iguais) e esquadro 3-4-5");}
 return sv(k+1,ttl[k],s)}
add("locacao","Locação da obra com gabarito",[],["NBR 13133:2021 (topografia)","NBR 14645 (levantamento cadastral)","NR-18"],locacao,[
["Limpeza e marco de referência","Limpe o terreno e implante um RN (cota/alinhamento) fora da área de obra.",["Alinhamento e recuos conferidos","RN protegido"],[SG.eq],["RN dentro da área de escavação"]],
["Montagem do gabarito","Monte o gabarito de tábuas niveladas em volta da obra, afastado ~1,5 m.",["Tábuas niveladas","Gabarito rígido e contraventado"],[SG.eq,"Pregos: martelo em bom estado; luvas."],["Gabarito torto/desnivelado","Encostado na área de escavação"]],
["Marcação dos eixos","Marque os eixos com pregos nas tábuas usando cotas acumuladas e estique linhas.",["Cotas acumuladas","Eixos identificados"],[SG.eq],["Somar cotas parciais (acumula erro)"]],
["Transferência e conferência","Transfira os cruzamentos ao solo com prumo e confira diagonais e esquadro.",["Diagonais iguais (± 1 cm)","Esquadro 3-4-5"],[SG.eq],["Não conferir diagonais"]]]);

// ================= SEGURANÇA =================
function seguranca(k){const I=iso(90,370,.6,.34);let s=BG()+GRD(I);const ttl=["Tapume, acesso e sinalização","EPI","Guarda-corpo e rodapé (EPC)","Andaime e linha de vida (NR-35)","Ordem, limpeza e eletricidade"];
 s+=I.PR(160,460,0,150,60,240,"#c7cdd3")+I.PR(150,470,150,162,50,250,"#b9bec5");
 if(k==0){for(let x=-40;x<600;x+=60)s+=I.PR(x,x+58,0,110,0,6,"#3d7ab8",N,.5);s+=I.CL([200,100,0],1,30,60,"tapume contínuo (≥ 2,2 m)")+I.CL([520,60,0],2,748,60,"placas: uso de EPI, acesso restrito")+R(...I.pt(500,90,0),60,40,A,N)+T(I.pt(500,90,0)[0]+30,I.pt(500,90,0)[1]+24,"USE EPI",11)}
 if(k==1){const w=I.pt(300,0,30);s+=WORKER(w[0],w[1],1.8)+LD(w[0],w[1]-100,600,80,"1 capacete com jugular","end")+CO(w[0]+14,w[1]-104,1)+LD(w[0],w[1]-74,600,140,"2 óculos / protetor auricular","end")+CO(w[0]+14,w[1]-78,2)+LD(w[0]-20,w[1]-55,120,200,"3 luvas adequadas à tarefa","start")+CO(w[0]-28,w[1]-58,3)+LD(w[0],w[1]-6,600,330,"4 botina com biqueira","end")+CO(w[0]+14,w[1]-10,4)}
 if(k>=2)for(let x=150;x<=470;x+=64){s+=I.PR(x-3,x+3,162,232,50,56,"#f1c40f",N,.6)}if(k>=2)s+=I.LN([[150,230,53],[470,230,53]],"#f1c40f",5)+I.LN([[150,200,53],[470,200,53]],"#f1c40f",4)+I.PR(150,470,162,182,50,54,"#e67e22",N,.6);
 if(k==2)s+=I.CL([300,230,53],1,748,60,"travessão superior 1,20 m")+I.CL([300,200,53],2,748,110,"travessão intermediário 0,70 m")+I.CL([300,182,50],3,748,170,"rodapé ≥ 0,20 m")+I.CL([470,232,53],4,30,60,"montantes c/ ≤ 1,5 m; resistir 150 kgf/m")+WORKER(...I.pt(300,162,180),.9);
 if(k==3){for(let y of[0,60,120])s+=I.PR(480,600,y+50,y+56,60,120,"#c8955a",N,.5);[[480,60],[600,60],[480,120],[600,120]].forEach(([x,z])=>s+=I.LN([[x,0,z],[x,190,z]],"#7f8c8d",4));s+=I.LN([[480,0,60],[600,190,60]],"#7f8c8d",2)+I.LN([[150,260,150],[470,260,150]],"#8e44ad",3)+WORKER(...I.pt(540,176,90),.9)+I.CL([540,180,60],1,748,60,"andaime com guarda-corpo e piso completo")+I.CL([300,260,150],2,30,60,"linha de vida + cinto paraquedas (h > 2 m)")+I.CL([480,0,60],3,748,380,"sapatas/base nivelada; ancorar à estrutura")}
 if(k==4)s+=I.PR(30,90,0,60,120,160,"#7f8c8d")+I.CL([60,60,140],1,30,60,"quadro com DR + aterramento; cabos suspensos")+I.CL([300,0,30],2,748,400,"circulação livre; entulho em baias/caçamba")+I.PR(520,600,0,30,40,100,"#e67e22")+I.CL([560,30,70],3,748,80,"materiais organizados e sinalizados");
 return sv(k+1,ttl[k],s)}
add("seguranca","Segurança do canteiro (EPI/EPC)",[],["NR-18 (condições de trabalho na construção)","NR-35 (trabalho em altura)","NR-6 (EPI)","NR-10 (eletricidade)","NR-12 (máquinas)"],seguranca,[
["Tapume, acesso e sinalização","Feche o canteiro com tapume, controle o acesso e sinalize riscos.",["Tapume contínuo","Placas de EPI/risco","Acesso controlado"],["Proteger o passeio público (galeria/bandeja quando necessário)."],["Canteiro aberto à rua"]],
["EPI","Forneça e exija EPI adequado a cada tarefa, com CA válido.",["Capacete, óculos, luvas, botina","Ficha de entrega de EPI"],["Treinamento de uso e guarda do EPI (NR-6)."],["EPI sem CA","Retirar capacete no canteiro"]],
["Guarda-corpo e rodapé (EPC)","Instale guarda-corpo em bordas de laje, aberturas e escadas.",["Travessões 1,20 m e 0,70 m","Rodapé ≥ 0,20 m","Aberturas no piso fechadas"],[SG.alt],["Fita zebrada como proteção","Retirar o guarda-corpo para passar material"]],
["Andaime e linha de vida","Use andaimes completos e ancorados; em altura > 2 m use cinto paraquedas em linha de vida.",["Andaime inspecionado","Piso completo + guarda-corpo","Linha de vida dimensionada"],[SG.alt],["Andaime sobre tijolos","Cinto preso em ponto não resistente"]],
["Ordem, limpeza e eletricidade","Mantenha circulação livre, entulho em caçambas e instalações elétricas provisórias seguras.",["Quadro com DR e aterramento","Cabos sem emendas expostas"],["NR-10: só pessoa qualificada mexe na instalação."],["Gambiarras e extensões no chão molhado"]]]);

// ================= ALVENARIA DE VEDAÇÃO =================
function alvenaria(k){const I=iso(80,380,.6,.34);let s=BG()+I.PH(-40,620,-30,200,0,"#c8ccd1");const ttl=["Marcação","Primeira fiada","Elevação: prumo, nível e escantilhão","Amarração com pilar e aberturas","Encunhamento (fixação superior)"];
 s+=I.PR(0,40,0,300,40,80,"#b9bec5")+I.PR(520,560,0,300,40,80,"#b9bec5")+I.PR(-10,570,300,330,40,80,"#b9bec5");
 const rows=k==0?0:k==1?1:k==2?7:13;if(rows)s+=I.BRICK(40,520,0,rows*20,50,70,20);
 if(k==0)s+=I.LN([[40,1,50],[520,1,50]],"#e74c3c",2)+I.LN([[40,1,70],[520,1,70]],"#e74c3c",2)+I.CL([280,1,50],1,748,400,"marcar faces a partir dos eixos (gabarito/linha)")+I.CL([40,100,60],2,30,60,"chapisco no pilar e na viga")+[100,200,300,400].map(x=>I.PR(x-3,x+3,0,4,48,52,"#2c3e50")).join("")+I.CL([200,4,50],3,30,380,"vãos de portas marcados");
 if(k==1)s+=I.CL([280,20,50],1,748,380,"1ª fiada nivelada sobre argamassa (corrige desníveis)")+I.CL([45,10,60],2,30,330,"blocos de canto primeiro, linha esticada")+WORKER(...I.pt(320,0,130),.9);
 if(k>=2)s+=I.PR(48,54,0,280,44,48,"#d9a96a",N,.6);
 if(k==2){const p=I.pt(300,140,48);s+=L(p[0],p[1]-60,p[0],p[1]+40,"#555",1)+P([[p[0]-4,p[1]+38],[p[0]+4,p[1]+38],[p[0],p[1]+48]],"#555");s+=I.CL([51,200,46],1,30,60,"escantilhão (régua com fiadas marcadas)")+I.CL([300,140,48],2,748,60,"prumo e nível a cada fiada; junta 1 cm")+I.CL([520,100,50],3,748,380,"linha esticada entre escantilhões")}
 if(k>=3)for(let h=40;h<260;h+=40)s+=I.LN([[30,h,58],[100,h,58]],STL,2.4);
 if(k==3)s+=I.CL([70,120,58],1,748,60,"tela/ferro-cabelo a cada 2 fiadas no pilar")+I.CL([300,100,50],2,748,380,"juntas verticais desencontradas (½ bloco)")+I.CL([300,200,50],3,30,60,"vergas/contravergas nos vãos (ver seção)");
 if(k==4)s+=I.PR(40,520,260,270,50,70,"#7f8c8d",N,.6)+I.CL([300,265,50],1,748,60,"encunhar ≥ 7–15 dias depois (argamassa fraca/expansiva)")+I.CL([300,280,50],2,30,60,"folga 2–3 cm sob a viga","start")+I.CL([520,200,50],3,748,380,"preferir encunhar de cima p/ baixo nos pavimentos");
 return sv(k+1,ttl[k],s)}
add("alvenaria","Alvenaria de vedação",[],["NBR 8545 (execução de alvenaria)","NBR 15270-1:2023 (blocos cerâmicos)","NBR 16868 (alvenaria estrutural — referência)","NR-18"],alvenaria,[
["Marcação","Marque as faces das paredes a partir dos eixos e chapisque pilares/vigas.",["Faces conferidas no projeto","Chapisco curado"],[SG.eq],["Marcar sem eixo de referência"]],
["Primeira fiada","Assente a 1ª fiada nivelada (cantos primeiro) corrigindo desníveis da laje.",["Nível ± 3 mm","Esquadro nos cantos"],[SG.eq,SG.conc],["Pular a 1ª fiada nivelada (toda parede torta)"]],
["Elevação: prumo, nível e escantilhão","Eleve com escantilhão, linha e prumo; juntas de ≈ 1 cm cheias.",["Prumo ≤ 3 mm/m","Juntas 10 ± 3 mm"],[SG.alt],["Juntas verticais secas","Paredes fora de prumo"]],
["Amarração e aberturas","Amarre ao pilar com tela/ferro-cabelo e desencontre as juntas; prepare vãos com verga.",["Tela a cada 2 fiadas","Juntas desencontradas"],[SG.eq],["Junta a prumo","Sem ligação com o pilar (trinca)"]],
["Encunhamento","Fixe o topo após 7–15 dias com argamassa fraca/expansiva ou espuma específica.",["Folga 2–3 cm","Aguardar cargas da estrutura"],[SG.alt],["Encunhar logo após levantar (trinca horizontal)","Tijolo inclinado com argamassa forte"]]]);

// ================= VERGA E CONTRAVERGA =================
function verga(k){const I=iso(80,390,.6,.34);let s=BG()+I.PH(-40,620,-30,200,0,"#c8ccd1");const ttl=["Posição e transpasse","Fôrma ou canaleta","Armação e concretagem","Contraverga sob a janela"];
 const O0=200,O1=360,ob=100,ot=220;s+=I.BRICK(20,560,0,300,40,60,20);s+=I.PZ(O0,O1,ob,ot,40,"#eaf2fa",N,1)+I.PR(O0,O1,ob,ot,40,60,"#eaf2fa",N,.5);
 if(k==0)s+=I.PZ(O0-30,O1+30,ot,ot+20,40,"#e74c3c55","#c0392b",2)+DH(I.pt(O0-30,0,40)[0],I.pt(O0,0,40)[0],I.pt(0,ot+40,40)[1],"≥ 30 cm",0,10)+DH(I.pt(O1,0,40)[0],I.pt(O1+30,0,40)[0],I.pt(0,ot+40,40)[1],"≥ 30 cm",0,10)+I.CL([280,ot+10,40],1,748,60,"verga: transpasse ≥ 30 cm ou L/5 de cada lado")+I.CL([280,ob-10,40],2,748,380,"contraverga também sob a janela");
 if(k>=1)s+=I.PR(O0-30,O1+30,ot,ot+20,38,62,k==1?"#d9a96a":"#b9bec5");if(k==1)s+=I.CL([O0,ot+10,38],1,30,60,"canaleta cerâmica/de concreto ou fôrma")+I.CL([O1+20,ot,50],2,748,60,"escora até a cura");
 if(k>=2)s+=I.LN([[O0-25,ot+5,45],[O1+25,ot+5,45]],STL,3)+I.LN([[O0-25,ot+5,55],[O1+25,ot+5,55]],STL,3);if(k==2)s+=I.CL([280,ot+5,45],1,748,60,"2 Ø 8 mm (ou projeto), cobrimento 2,5 cm")+I.CL([280,ot+20,50],2,30,60,"concreto/graute bem adensado")+INS(20,240,200,150,"SEÇÃO",R(80,290,80,40,"#b9bec5",N)+C(95,318,4,STL)+C(145,318,4,STL)+T(120,350,"altura ≥ 10 cm",11)+T(120,368,"(pré-moldada ou moldada)",10));
 if(k==3)s+=I.PR(O0-30,O1+30,ob-20,ob,38,62,"#b9bec5")+I.LN([[O0-25,ob-14,50],[O1+25,ob-14,50]],STL,3)+I.CL([280,ob-10,40],1,748,380,"contraverga ≥ 30 cm além do vão — evita trinca a 45°")+I.CL([O0-28,ob-10,40],2,30,380,"trinca típica sem contraverga","start")+L(...I.pt(O0,ob,40),...I.pt(O0-50,ob-60,40),"#c0392b",2,'stroke-dasharray="3 3"');
 return sv(k+1,ttl[k],s)}
add("verga","Verga e contraverga",[],["NBR 8545","NBR 6118:2023","NBR 15575-4 (vedações)"],verga,[
["Posição e transpasse","Preveja verga sobre todo vão e contraverga sob janelas, com transpasse ≥ 30 cm.",["Transpasse ≥ 30 cm ou L/5","Todas as aberturas"],[SG.eq],["Verga curta (trinca a 45°)"]],
["Fôrma ou canaleta","Use canaleta ou fôrma escorada no nível da fiada.",["Nível e prumo","Escoramento"],[SG.alt],["Apoiar em tijolo solto"]],
["Armação e concretagem","Arme (2 Ø 8 mm ou projeto) e concrete adensando bem.",["Cobrimento 2,5 cm","Concreto ≥ C20"],[SG.conc],["Sem armadura","Argamassa no lugar de concreto"]],
["Contraverga","Execute a contraverga sob a janela com o mesmo transpasse.",["Transpasse ≥ 30 cm"],[SG.eq],["Omitir contraverga"]]]);

// ================= CHAPISCO, EMBOÇO E REBOCO =================
function reboco(k){const I=iso(80,390,.62,.36);let s=BG()+I.PH(-40,620,-40,140,0,"#c8ccd1");const ttl=["Preparo da base","Chapisco","Taliscas e mestras","Emboço sarrafeado","Reboco / acabamento e cura"];
 s+=I.BRICK(20,560,0,300,40,60,20);
 if(k==0)s+=I.CL([200,200,40],1,30,60,"base limpa: remover pó, óleo, rebarbas")+I.CL([400,150,40],2,748,60,"instalações embutidas e testadas antes")+DROPS(...I.pt(300,260,40),5)+I.CL([300,240,40],3,748,380,"umedecer a base (sem encharcar)");
 if(k>=1){s+=I.PZ(20,k==1?380:560,0,300,39.5,"#9aa0a6cc");for(let i=0;i<220;i++){const x=20+((i*53)%(k==1?360:540)),h=((i*97)%300);s+=C(...I.pt(x,h,39),1.6,"#5d6d7e")}}
 if(k==1)s+=I.CL([200,150,39],1,748,60,"chapisco 1:3 (cimento:areia grossa) lançado")+I.CL([200,50,39],2,748,380,"curar ≥ 3 dias antes do emboço");
 if(k>=2){[[60,40],[60,260],[520,40],[520,260],[290,40],[290,260]].forEach(([x,h])=>s+=I.PR(x-10,x+10,h-6,h+6,36,39,"#e5d3b3",N,.5));[60,290,520].forEach(x=>s+=I.PR(x-8,x+8,40,260,36,39,"#e5d3b3",N,.5))}
 if(k==2)s+=I.CL([60,260,36],1,30,60,"taliscas no prumo/linha (espessura 1,5–2,5 cm)")+I.CL([290,150,36],2,748,60,"mestras verticais entre taliscas");
 if(k>=3)s+=I.PZ(20,k==3?400:560,0,300,35,"#e8dcc7");if(k==3)s+=I.CL([200,150,35],1,748,60,"emboço lançado e sarrafeado pelas mestras")+WORKER(...I.pt(430,0,0),1,"regua")+I.CL([400,150,35],2,748,380,"espessura ≤ 2,5 cm por camada");
 if(k>=4)s+=I.PZ(20,560,0,300,34.5,"#f3ece0");if(k==4)s+=I.CL([300,150,34],1,748,60,"desempeno/feltro — acabamento final")+DROPS(...I.pt(150,280,30),6)+I.CL([150,250,34],2,30,60,"cura úmida 3 dias; pintura após ≥ 28 dias");
 return sv(k+1,ttl[k],s)}
add("reboco","Chapisco, emboço e reboco",[],["NBR 7200:1998 (execução de revestimento de argamassa)","NBR 13749:2013 (revestimento de argamassa — especificação)","NBR 13281 (argamassas)"],reboco,[
["Preparo da base","Limpe, remova rebarbas, embuta e teste instalações; umedeça a base.",["Alvenaria com ≥ 14 dias","Instalações testadas"],[SG.eq],["Revestir sobre base suja/seca"]],
["Chapisco","Lance chapisco 1:3 em toda a base e cure ≥ 3 dias.",["Cobertura uniforme","Cura úmida"],[SG.conc,"Óculos: respingos."],["Chapisco fraco/rarefeito"]],
["Taliscas e mestras","Assente taliscas no prumo e faça mestras para guiar a régua.",["Espessura 1,5–2,5 cm","Prumo/planeza"],[SG.alt],["Sem taliscas (parede ondulada)"]],
["Emboço sarrafeado","Lance o emboço e sarrafeie pelas mestras; camadas ≤ 2,5 cm.",["Planeza ≤ 3 mm/2 m","Sem fissuras"],[SG.alt,SG.conc],["Camada grossa única (fissura/descola)"]],
["Reboco e cura","Desempene/feltre o reboco e faça cura úmida.",["Superfície uniforme","Cura 3 dias"],[SG.conc],["Pintar antes de 28 dias","Sol/vento sem cura"]]]);

// ================= INSTALAÇÕES EMBUTIDAS =================
function instal(k){const I=iso(80,390,.62,.36);let s=BG()+I.PH(-40,620,-40,140,0,"#c8ccd1");const ttl=["Marcação dos rasgos","Corte com serra","Elétrica: eletrodutos e caixas","Hidráulica: tubos e teste de pressão","Fechamento com argamassa e tela"];
 s+=I.BRICK(20,560,0,300,40,60,20);
 const ch=[[120,100,120,280],[100,280,300,280],[380,0,380,180],[380,180,470,180]];
 if(k==0)s+=ch.map(([x0,h0,x1,h1])=>I.LN([[x0,h0,39],[x1,h1,39]],"#c0392b",2,'stroke-dasharray="6 4"')).join("")+I.CL([120,200,39],1,30,60,"rasgos verticais preferencialmente")+I.CL([200,280,39],2,748,60,"horizontais curtos (evitar enfraquecer a parede)")+I.CL([380,90,39],3,748,380,"marcar pelos projetos elétrico e hidráulico");
 if(k>=1)s+=ch.map(([x0,h0,x1,h1])=>I.PZ(Math.min(x0,x1)-6,Math.max(x0,x1)+6,Math.min(h0,h1)-6,Math.max(h0,h1)+6,39.5,"#5d4037")).join("");
 if(k==1)s+=`<g transform="translate(${I.pt(120,150,39)[0]+20} ${I.pt(120,150,39)[1]})"><circle r="14" fill="#bdc3c7" stroke="${N}"/><rect x="-6" y="-30" width="12" height="18" fill="${A}" stroke="${N}"/></g>`+I.CL([120,150,39],1,30,60,"serra de parede (2 cortes) — não usar marreta")+I.CL([380,90,39],2,748,60,"profundidade = tubo + 1,5 cm de cobrimento");
 if(k>=2)s+=I.LN([[120,100,38],[120,280,38]],"#f1c40f",5)+I.LN([[100,280,38],[300,280,38]],"#f1c40f",5)+I.PR(110,130,90,110,36,40,"#f5f5f5")+I.PR(290,310,270,290,36,40,"#f5f5f5");
 if(k==2)s+=I.CL([120,190,38],1,30,60,"eletroduto corrugado fixado")+I.CL([120,100,38],2,748,380,"caixas 4×2 no prumo/altura do projeto");
 if(k>=3)s+=I.LN([[380,0,38],[380,180,38],[470,180,38]],"#27ae60",6)+I.PR(465,480,172,188,36,40,"#27ae60");
 if(k==3)s+=I.CL([380,90,38],1,748,60,"tubos PVC/PPR com conexões soldadas")+I.CL([470,180,38],2,748,380,"teste de pressão (1,5× serviço) antes de fechar")+INS(20,240,200,140,"TESTE",C(120,310,30,"#fff",N,2)+L(120,310,140,295,"#c0392b",2)+T(120,370,"manômetro — sem queda",11));
 if(k==4)s+=ch.map(([x0,h0,x1,h1])=>I.PZ(Math.min(x0,x1)-10,Math.max(x0,x1)+10,Math.min(h0,h1)-10,Math.max(h0,h1)+10,37,"#cfd8dc")).join("")+I.CL([200,280,37],1,748,60,"fechar com argamassa + tela galvanizada (≥ 10 cm além do rasgo)")+I.CL([380,90,37],2,748,380,"fotografar/registrar posições antes de fechar");
 return sv(k+1,ttl[k],s)}
add("instalacoes","Instalações embutidas antes do reboco",[],["NBR 5410:2004 (instalações elétricas BT)","NBR 5626:2020 (água fria e quente)","NBR 8160 (esgoto sanitário)","NR-10"],instal,[
["Marcação dos rasgos","Marque os rasgos pelos projetos, preferindo trechos verticais.",["Conferir projetos compatibilizados","Evitar rasgos horizontais longos"],[SG.eq],["Rasgar sem projeto","Rasgos em parede estrutural sem autorização"]],
["Corte com serra","Corte com serra de parede (dois cortes) e remova o miolo.",["Profundidade adequada","Sem quebrar blocos"],[SG.corte],["Marreta e talhadeira (trinca a parede)"]],
["Elétrica: eletrodutos e caixas","Fixe eletrodutos e caixas no prumo e nas alturas de projeto.",["Caixas niveladas","Eletroduto contínuo, sem amassar"],["NR-10: circuito desenergizado."],["Caixas fora de prumo","Eletroduto amassado"]],
["Hidráulica e teste","Instale tubos e conexões e faça teste de pressão antes de fechar.",["Teste 1,5× a pressão de serviço","Sem vazamentos"],[SG.eq],["Fechar sem testar"]],
["Fechamento","Feche com argamassa e tela galvanizada, registrando as posições.",["Tela ≥ 10 cm além do rasgo","Fotos/registro"],[SG.conc],["Fechar sem tela (fissura no reboco)"]]]);

// ================= CONTRAPISO =================
function contrapiso(k){const I=iso(90,370,.62,.36);let s=BG();const ttl=["Taliscas e níveis (caimentos)","Limpeza e ponte de aderência","Lançamento, compactação e sarrafeamento","Acabamento, cura e juntas"];
 s+=I.PR(0,520,-30,0,0,280,"#b9bec5")+I.BRICK(-16,0,0,120,0,280,20)+I.BRICK(-16,520,0,120,280,296,20);
 if(k==0){for(let x=40;x<520;x+=120)for(let z=30;z<280;z+=110)s+=I.PR(x-8,x+8,0,6,z-8,z+8,"#e5d3b3",N,.5);s+=I.CL([160,6,30],1,748,400,"taliscas a cada ≈ 1,5–2 m pelo nível de referência")+I.LN([[0,40,280],[520,40,280]],"#c0392b",2,'stroke-dasharray="8 4"')+I.CL([300,40,280],2,748,60,"nível de referência (laser/mangueira)")}
 if(k==1)s+=DROPS(...I.pt(200,30,140),5)+I.PH(0,520,0,280,0.5,"#8d6e6366")+I.CL([200,1,100],1,748,400,"base limpa e umedecida")+I.CL([350,1,200],2,748,60,"ponte de aderência (nata/adesivo) antes de lançar");
 if(k>=2)s+=I.PR(0,k==2?320:520,0,6,0,280,"#d8cfc0",N,.5);
 if(k==2)s+=WORKER(...I.pt(360,0,140),1,"regua")+I.CL([200,6,100],1,748,400,"argamassa farofa 1:3 a 1:4 compactada")+I.CL([310,6,200],2,748,60,"sarrafear pelas mestras; espessura 3–5 cm");
 if(k==3){s+=I.LN([[260,6.2,0],[260,6.2,280]],"#2c3e50",2)+I.LN([[0,6.2,140],[520,6.2,140]],"#2c3e50",2)+DROPS(...I.pt(100,40,60),6);s+=I.CL([260,6,60],1,748,400,"juntas a cada ≈ 3 m / encontros com pilares")+I.CL([100,6,200],2,30,60,"cura úmida 3–7 dias; liberar tráfego leve após 3 dias")}
 return sv(k+1,ttl[k],s)}
add("contrapiso","Contrapiso",[],["NBR 15575-3 (pisos)","NBR 13753/13754 (revestimentos — base)","NBR 13281"],contrapiso,[
["Taliscas e níveis","Defina o nível de referência e os caimentos e assente taliscas.",["Nível/caimento conferidos","Espessura prevista"],[SG.eq],["Corrigir caimento depois no revestimento"]],
["Limpeza e ponte de aderência","Limpe, umedeça e aplique ponte de aderência.",["Base sem pó/nata solta"],[SG.conc],["Lançar sobre poeira (som cavo)"]],
["Lançamento e sarrafeamento","Lance argamassa farofa, compacte e sarrafeie.",["Compactação energética","Espessura 3–5 cm"],[SG.conc],["Argamassa mole (retração/fissuras)"]],
["Acabamento, cura e juntas","Desempene, faça juntas e cure.",["Juntas ≈ 3 m","Cura úmida"],[SG.conc],["Sem cura","Sem juntas em grandes áreas"]]]);

// ================= REVESTIMENTO CERÂMICO =================
function ceramica(k){const I=iso(90,370,.62,.36);let s=BG();const ttl=["Base pronta e paginação","Argamassa colante (desempenadeira dentada)","Dupla colagem e assentamento","Juntas e espaçadores","Rejuntamento"];
 s+=I.PR(0,520,-30,6,0,280,"#d8cfc0")+I.BRICK(-16,0,0,120,0,280,20)+I.BRICK(-16,520,0,120,280,296,20);
 const T60=60,tiles=k>=2?(k==2?6:99):0;
 if(k==0)s+=I.LN([[0,6.2,140],[520,6.2,140]],"#2e86c1",2,'stroke-dasharray="8 4"')+I.LN([[260,6.2,0],[260,6.2,280]],"#2e86c1",2,'stroke-dasharray="8 4"')+I.CL([260,6,140],1,748,60,"paginação: eixos e cortes nas bordas")+I.CL([150,6,60],2,748,400,"base plana, curada (contrapiso ≥ 14 dias)");
 if(k>=1){for(let z=4;z<280;z+=8)s+=I.LN([[0,7,z],[k==1?300:520,7,z]],"#9e9e9e",1.2)}
 if(k==1)s+=I.CL([150,7,100],1,748,400,"AC I/II/III conforme local; cordões com dente 8–10 mm")+I.CL([280,7,200],2,748,60,"estender ≤ 2 m² por vez (tempo em aberto)")+WORKER(...I.pt(360,6,140),.9);
 let n=0;if(k>=2)for(let x=4;x<516;x+=T60+4)for(let z=4;z<276;z+=T60+4){if(n++>=tiles)break;s+=I.PR(x,x+T60,7,11,z,z+T60,"#f2efe9",N,.5)}
 if(k==2)s+=I.CL([30,11,30],1,30,60,"dupla colagem em peças > 900 cm² ou áreas externas")+INS(470,250,270,150,"DUPLA COLAGEM",R(500,300,200,16,"#f2efe9",N)+PL([[500,320],[700,320]],"#9e9e9e",6,'stroke-dasharray="6 3"')+PL([[500,336],[700,336]],"#9e9e9e",6,'stroke-dasharray="6 3"')+T(600,360,"argamassa na base + no tardoz",11)+T(600,380,"bater com martelo de borracha",11));
 if(k>=3)for(let x=4+T60;x<516;x+=T60+4)for(let z=4+T60;z<276;z+=T60+4)s+=I.PR(x,x+4,11,13,z,z+4,"#e74c3c",N,.3);
 if(k==3)s+=I.CL([4+T60,12,4+T60],1,748,400,"espaçadores (junta 2–5 mm conforme peça)")+I.LN([[260,11.5,0],[260,11.5,280]],"#2c3e50",3)+I.CL([260,12,200],2,748,60,"juntas de movimentação a cada ≈ 3–6 m e no perímetro");
 if(k==4)s+=I.CL([200,12,100],1,748,400,"rejunte após 72 h; remover excesso com esponja")+I.CL([4,12,200],2,30,60,"perímetro com selante flexível","start");
 return sv(k+1,ttl[k],s)}
add("ceramica","Revestimento cerâmico",[],["NBR 13753:1996 (pisos)","NBR 13754:1996 (paredes internas)","NBR 13755:2017 (fachadas)","NBR 14081 (argamassa colante)","NBR 14992 (rejuntes)"],ceramica,[
["Base pronta e paginação","Confira planeza e cura da base e defina a paginação.",["Base curada ≥ 14 dias","Planeza ≤ 3 mm/2 m"],[SG.eq],["Cortes pequenos em evidência"]],
["Argamassa colante","Aplique a argamassa correta com desempenadeira dentada, em panos pequenos.",["Tipo AC adequado","Tempo em aberto respeitado"],[SG.conc],["Argamassa 'em bolinhas' (vazios)","Pano grande (pele seca)"]],
["Dupla colagem e assentamento","Aplique também no tardoz em peças grandes/externas e bata para eliminar vazios.",["Contato ≥ 90%","Peças niveladas"],[SG.conc,"Corte: óculos e luvas."],["Colagem simples em porcelanato grande (som cavo)"]],
["Juntas e espaçadores","Use espaçadores e juntas de movimentação no perímetro e em panos grandes.",["Junta conforme fabricante","Juntas de movimentação"],[SG.eq],["Junta seca/encostada (estufa)"]],
["Rejuntamento","Rejunte após 72 h, limpe e sele o perímetro.",["Rejunte adequado ao uso","Limpeza imediata"],[SG.conc],["Rejuntar cedo demais","Perímetro rígido"]]]);

// ================= JUNTA DE DILATAÇÃO =================
function junta(k){const I=iso(90,380,.6,.34);let s=BG();const ttl=["Junta aberta e limpa","Material de enchimento","Limitador de profundidade (tarugo)","Selante elástico","Mata-junta / perfil de acabamento"];
 const G0=240,G1=270;s+=I.PR(0,G0,0,200,0,240,"#b9bec5")+I.PR(G1,520,0,200,0,240,"#b9bec5");
 s+=DH(I.pt(G0,200,0)[0],I.pt(G1,200,0)[0],I.pt(G0,200,0)[1]-14,"2–3 cm",0,10);
 if(k==0)s+=I.CL([255,100,0],1,748,60,"junta contínua em toda a altura/espessura")+I.CL([255,190,0],2,30,60,"limpar restos de argamassa/concreto");
 if(k>=1)s+=I.PZ(G0,G1,0,150,10,"#f7dc6f",N,.5);if(k==1)s+=I.CL([255,80,10],1,748,60,"enchimento compressível (EPS/espuma)");
 if(k>=2)s+=I.PZ(G0,G1,150,170,6,"#5dade2",N,.5);if(k==2)s+=I.CL([255,160,6],1,748,60,"tarugo de polietileno (limitador)")+I.CL([255,170,6],2,30,60,"fator de forma do selante ~ 2:1");
 if(k>=3)s+=I.PZ(G0,G1,170,185,3,"#566573",N,.5);if(k==3)s+=I.CL([255,178,3],1,748,60,"selante PU/silicone neutro, aderência só nas laterais")+I.CL([255,178,3],2,30,330,"primer nas bordas; ferramentar a superfície");
 if(k==4)s+=I.PR(G0-20,G1+20,185,190,-2,240,"#95a5a6")+I.CL([255,190,100],1,748,60,"perfil/mata-junta fixado de um só lado")+I.CL([255,190,40],2,30,330,"permite movimentação sem rasgar");
 return sv(k+1,ttl[k],s)}
add("junta","Junta de dilatação",[],["NBR 6118:2023 (juntas de dilatação)","NBR 15575-2/-4","NBR 13755 (juntas em fachadas)"],junta,[
["Junta aberta e limpa","Garanta junta contínua e limpa, sem pontes de argamassa.",["Largura de projeto","Sem obstruções"],[SG.alt],["Preencher com argamassa (trava a junta)"]],
["Material de enchimento","Preencha com material compressível.",["Material contínuo"],[SG.eq],["Enchimento rígido"]],
["Limitador (tarugo)","Insira tarugo para limitar a profundidade do selante.",["Fator de forma 2:1"],[SG.eq],["Selante aderido no fundo (rompe)"]],
["Selante elástico","Aplique primer e selante elástico, ferramentando.",["Selante compatível","Bordas limpas e secas"],["Selante: luvas e ventilação."],["Silicone acético em concreto"]],
["Mata-junta","Instale perfil de acabamento fixado de um lado só.",["Fixação unilateral"],[SG.alt],["Perfil fixado nos dois lados"]]]);

// ================= DRENAGEM =================
function drenagem(k){const I=iso(70,380,.6,.34),Z=240;let s=BG("#dfeefa");const ttl=["Vala com caimento","Manta geotêxtil","Brita e tubo perfurado","Envelopamento e reaterro","Barbacãs no muro e saída"];
 const tx0=180,tx1=320,tb=60;s+=I.PR(-40,tx0,0,200,0,Z,"#a87b4f")+I.PR(tx1,560,0,200,0,Z,"#a87b4f")+I.PR(tx0,tx1,0,tb,0,Z,"#a87b4f");
 if(k==0)s+=I.CL([250,tb,40],1,748,400,"vala 40–60 cm de largura, fundo regular")+I.AR([250,tb+4,200],[250,tb+4,40],"#c0392b",2.5)+I.CL([250,tb+4,140],2,748,60,"caimento ≥ 0,5–1% até a saída");
 if(k>=1)s+=I.PZ(tx0+2,tx1-2,tb,200,2,"#ffffffdd","#7f8c8d",1.5)+I.LN([[tx0+2,tb+1,0],[tx1-2,tb+1,0]],"#ecf0f1",4);if(k==1)s+=I.CL([tx0+4,150,2],1,30,60,"geotêxtil não tecido cobrindo fundo e laterais")+I.CL([tx1-4,190,2],2,748,60,"sobra para envelopar por cima (≥ 30 cm)");
 if(k>=2){s+=I.PZ(tx0+6,tx1-6,tb+2,tb+110,1,"#bdb3a6",N,.5);for(let i=0;i<80;i++)s+=C(...I.pt(tx0+10+(i*37)%(tx1-tx0-20),tb+6+(i*53)%100,0),2.6,"#8f8577");const c=I.pt(250,tb+30,0);s+=`<circle cx="${c[0]}" cy="${c[1]}" r="18" fill="#f5f5f5" stroke="${N}" stroke-width="2"/>`+[0,1,2,3,4,5].map(i=>C(c[0]+12*Math.cos(i),c[1]+12*Math.sin(i),2,"#555")).join("")+I.LN([[250,tb+48,0],[250,tb+48,Z]],"#bbb",1)}
 if(k==2)s+=I.CL([250,tb+30,0],1,748,400,"tubo dreno perfurado Ø 100 mm (furos p/ baixo)")+I.CL([210,tb+90,0],2,30,60,"brita 1 ou 2 lavada");
 if(k>=3)s+=I.PZ(tx0+2,tx1-2,tb+110,tb+118,0,"#ffffffee","#7f8c8d",1.5)+I.PZ(tx0,tx1,tb+118,200,0,"#a87b4f");if(k==3)s+=I.CL([250,tb+114,0],1,748,60,"envelopar a brita com o geotêxtil (sobreposição)")+I.CL([250,180,0],2,30,60,"reaterro com solo/brita conforme projeto");
 if(k==4){s=BG("#dfeefa");const J=iso(90,390,.6,.34);s+=J.PR(-40,560,-20,0,0,Z,"#a87b4f")+J.PR(0,40,0,220,0,Z,"#b9bec5")+J.PR(40,560,0,220,0,Z,"#a87b4f")+J.PZ(40,70,0,220,0,"#bdb3a6");[60,140].forEach(h=>[40,120,200].forEach(z=>{const p=J.pt(0,h,z);s+=`<ellipse cx="${p[0]-2}" cy="${p[1]}" rx="4" ry="6" fill="#2c3e50"/>`}));s+=J.CL([0,60,40],1,30,60,"barbacãs Ø 50–75 mm a cada ≈ 2 m (alternadas)")+J.CL([55,100,0],2,748,60,"brita + geotêxtil atrás dos barbacãs")+J.CL([20,0,200],3,30,380,"saída para canaleta/caixa — nunca no pé sem proteção")+DROPS(...J.pt(-20,40,60),3)}
 return sv(k+1,ttl[k],s)}
add("drenagem","Drenagem de muro e de terreno (dreno francês)",[],["NBR 11682:2009 (estabilidade de encostas)","NBR 12266 (valas)","DNIT 015/2006-ES (drenos subterrâneos)","NR-18"],drenagem,[
["Vala com caimento","Escave a vala com fundo regular e caimento até a saída.",["Caimento ≥ 0,5–1%","Saída definida"],[SG.esc2],["Vala sem caimento (água parada)"]],
["Manta geotêxtil","Forre fundo e laterais com geotêxtil não tecido.",["Sobra para envelopar","Sem rasgos"],[SG.eq],["Sem geotêxtil (colmata com finos)"]],
["Brita e tubo perfurado","Lance brita lavada e o tubo dreno perfurado com caimento.",["Brita lavada","Tubo contínuo, furos p/ baixo"],[SG.eq],["Brita suja","Tubo sem caimento"]],
["Envelopamento e reaterro","Envelope a brita com o geotêxtil e reaterre.",["Sobreposição ≥ 30 cm"],[SG.esc2],["Solo direto sobre a brita"]],
["Barbacãs e saída","Execute barbacãs no muro com filtro e conduza a água a caixas/canaletas.",["Barbacã a cada ≈ 2 m","Filtro atrás"],[SG.eq],["Barbacã sem filtro (carreia solo)"]]]);

// ================= IMPERMEABILIZAÇÃO DAS FUNDAÇÕES =================
function impFund(k){const I=iso(80,380,.6,.34),Z=260;let s=BG()+I.PR(-40,600,-80,0,0,Z,"#a87b4f");const ttl=["Baldrame limpo e regularizado","Emulsão asfáltica (2–3 demãos)","Manta / reforço nos cantos","Subida ≥ 30 cm na alvenaria","Proteção e reaterro"];
 s+=I.PZ(150,450,-80,0,0,"#e6dccb");s+=I.PR(200,400,-60,20,10,Z,"#b9bec5");const wall=k>=3;if(wall)s+=I.BRICK(240,360,20,200,20,Z-10,20);
 if(k==0)s+=I.CL([300,20,60],1,748,60,"topo e laterais do baldrame limpos e secos")+I.CL([200,-20,60],2,30,60,"cantos arredondados; sem ninhos de concretagem");
 if(k>=1)s+=I.PR(198,402,-60,22,8,Z,"#2b2b2bdd",N,.5);if(k==1)s+=I.CL([300,22,60],1,748,60,"emulsão asfáltica 2–3 demãos cruzadas")+I.CL([200,-30,40],2,30,60,"laterais até ≥ 15 cm abaixo do terreno")+WORKER(...I.pt(470,0,120),.9);
 if(k>=2)s+=I.LN([[198,22,8],[402,22,8]],"#ecf0f1",5);if(k==2)s+=I.CL([300,22,8],1,748,60,"manta/tela de reforço nos cantos e emendas");
 if(k>=3)s+=I.PR(238,362,20,50,18,Z-8,"#2b2b2bcc",N,.5);if(k==3)s+=I.CL([300,50,20],1,748,60,"impermeabilizar as primeiras fiadas ≥ 30 cm (2 faces)")+DV(I.pt(240,20,18)[1],I.pt(240,50,18)[1],I.pt(240,20,18)[0]-14,"≥ 30 cm",10,10)+I.CL([300,30,20],2,30,60,"argamassa de assentamento com hidrófugo");
 if(k==4)s+=I.PZ(150,450,-80,0,0,"#a87b4f")+I.CL([300,-40,0],1,748,400,"reaterro compactado sem danificar a camada")+I.CL([360,40,20],2,748,60,"reboco com hidrófugo até 60 cm");
 return sv(k+1,ttl[k],s)}
add("impermeabilizacao-fundacoes","Impermeabilização das fundações (baldrame e vigas)",[],["NBR 9575:2010","NBR 9574:2008","NBR 9685 (emulsões asfálticas)","NR-6"],impFund,[
["Baldrame limpo e regularizado","Limpe e regularize topo e laterais do baldrame.",["Superfície seca e firme","Cantos arredondados"],[SG.eq],["Aplicar sobre superfície úmida/suja"]],
["Emulsão asfáltica","Aplique 2–3 demãos cruzadas de emulsão asfáltica no topo e laterais.",["Consumo do fabricante","Secagem entre demãos"],["Produto asfáltico: luvas e máscara."],["Demão única","Esquecer as laterais"]],
["Manta e reforços","Reforce cantos e emendas com tela/manta.",["Reforço contínuo"],[SG.eq],["Cantos sem reforço"]],
["Subida na alvenaria","Impermeabilize as primeiras fiadas ≥ 30 cm nas duas faces.",["Subida ≥ 30 cm","Argamassa com hidrófugo"],[SG.eq],["Subida baixa (umidade ascendente)"]],
["Proteção e reaterro","Proteja e reaterre com cuidado.",["Sem danos à camada"],[SG.esc2],["Reaterro com entulho/pedras"]]]);
})();
// ================= CONTENÇÃO EM TERRA ARMADA =================
(()=>{const{N,R,C,T,DH,DV,WORKER,LD,CO}=K;const{sec,SEG,sv}=GUIA.kit;const S=GUIA.S;
const iso=(ox,oy,cz=.55,sz=.32)=>{const pt=(x,h,z)=>[+(ox+x+z*cz).toFixed(1),+(oy-h-z*sz).toFixed(1)],Q=a=>a.map(p=>pt(...p));
 const PR=(x0,x1,h0,h1,z0,z1,c,st=N,sw=.8)=>K.P(Q([[x0,h1,z0],[x1,h1,z0],[x1,h1,z1],[x0,h1,z1]]),K.sh(c,1.15),st,sw)+K.P(Q([[x1,h0,z0],[x1,h1,z0],[x1,h1,z1],[x1,h0,z1]]),K.sh(c,.78),st,sw)+K.P(Q([[x0,h0,z0],[x1,h0,z0],[x1,h1,z0],[x0,h1,z0]]),c,st,sw);
 const LN=(p,c=N,w=1,ex="")=>K.PL(Q(p),c,w,ex);
 const CL=(p,n,lx,ly,lab)=>{const c=pt(...p);return LD(c[0],c[1],lx,ly,(n?n+" ":"")+lab,lx>380?"end":"start")+(n?CO(c[0],c[1]-15,n):"")};
 const AR=(a,b,c="#c0392b",w=2.2)=>{a=pt(...a);b=pt(...b);return K.ARW(a[0],a[1],b[0],b[1],c,w)};return{pt,PR,LN,CL,AR}};
const TT=["Locação e escavação","Soleira de nivelamento","1ª fiada de escamas (escoras e prumo)","Fitas metálicas / geogrelhas (L ≈ 0,7H)","Aterro selecionado em camadas","Repetição das fiadas","Drenagem (geotêxtil e dreno de pé)","Coroamento / viga de topo","Controle de prumo e compactação"];
function terra(k){const I=iso(70,395),Z=200,CH=60,H=240,LR=168,X0=100,X1=116;
 const nC=k<2?0:k<5?1:4,top=nC*CH,fillTop=k<4?0:k<5?CH:top;
 let s=R(0,0,760,430,"#eaf2fa","none")+I.PR(-20,520,-30,0,0,Z,"#a87b4f");
 // talude de corte (solo natural)
 s+=I.PR(380,520,0,H+20,0,Z,"#b08458");
 if(k==0){s+=I.LN([[X0,0,0],[X0,0,Z]],"#e74c3c",2,'stroke-dasharray="6 4"')+I.LN([[X0,0,0],[X0,40,0]],"#7f5539",3)+I.LN([[X0,0,Z],[X0,40,Z]],"#7f5539",3);
  s+=I.CL([X0,30,0],1,30,70,"gabarito: alinhamento da face do muro")+I.CL([380,160,0],2,748,60,"corte com talude estável (≥ L + folga)")+I.CL([240,0,100],3,748,400,"fundo regularizado e compactado")+WORKER(...I.pt(250,0,40),.9)+DH(...[I.pt(X1,0,0)[0],I.pt(380,0,0)[0],I.pt(0,0,0)[1]+16],"≥ 0,7H + 0,5 m",10)}
 if(k>=1){s+=I.PR(86,140,-12,0,0,Z,"#b9bec5");if(k==1)s+=I.CL([110,0,60],1,30,70,"soleira de concreto magro ≈ 15×30 cm, nivelada")+I.CL([86,-6,0],2,30,400,"nível rigoroso (± 5 mm): define o prumo do muro")+WORKER(...I.pt(220,0,80),.9)}
 // aterro
 if(fillTop>0){s+=I.PR(X1,380,0,fillTop,0,Z,"#d9c08a");for(let h=25;h<fillTop;h+=25)s+=I.LN([[X1,h,0],[380,h,0],[380,h,Z]],"#a8875a",.6,'stroke-dasharray="4 3"')}
 // fitas
 if(k>=3)for(let c=0;c<Math.max(nC,1);c++){const h=c*CH+(c<nC-1||fillTop>=top?30:30);if(c*CH+30>fillTop&&k>=4&&c>=nC)continue;const vis=h>=fillTop;for(let z=25;z<Z;z+=50)s+=I.LN([[X1,h,z],[X1+LR,h,z]],vis?"#5d6d7e":"#7f8c8d",vis?3.5:2.2);s+=I.LN([[X1,h,0],[X1+LR,h,0]],"#5d6d7e",2.5)}
 if(k>=6)s+=I.PR(X1,X1+40,0,30,0,Z,"#95a5a6")+C(...I.pt(X1+20,15,0),8,"#2c3e50");
 // escamas
 for(let c=0;c<nC;c++)for(let z=-(c%2)*25;z<Z;z+=50){const z0=Math.max(z,0),z1=Math.min(z+50,Z);if(z1-z0<5)continue;s+=I.PR(X0,X1,c*CH,(c+1)*CH,z0,z1,"#cfd6dc","#7b8a97",.8)}
 if(k==2){s+=I.LN([[X0-60,0,40],[X0,50,40]],"#8d5524",4)+I.LN([[X0-60,0,140],[X0,50,140]],"#8d5524",4)+I.LN([[X0+2,90,10],[X0+2,0,10]],"#2c3e50",1)+C(...I.pt(X0+2,0,10),3,"#2c3e50");
  s+=I.CL([X0,30,20],1,30,60,"escamas (painéis de concreto) na soleira")+I.CL([X0-30,25,40],2,30,400,"escoras / grampos provisórios")+I.CL([X0+2,80,10],3,748,60,"prumo com leve inclinação para trás (≈ 1:50)")}
 if(k==3){s+=I.CL([X1+100,30,25],1,748,60,"fitas metálicas galvanizadas / geogrelha")+I.CL([X1,30,0],2,30,60,"ligação ao painel (parafuso / esperas)")+DH(I.pt(X1,30,0)[0],I.pt(X1+LR,30,0)[0],I.pt(0,0,0)[1]+16,"L ≈ 0,7H (mín. 3 m)",10)+I.CL([X1+60,30,150],3,748,400,"espaçamento conforme projeto, sem cruzar")}
 if(k==4){const r=I.pt(300,CH,120);s+=R(r[0]-30,r[1]-30,60,26,"#f1c40f",N,1)+C(r[0]-12,r[1],9,"#555")+C(r[0]+18,r[1],9,"#555")+WORKER(...I.pt(150,CH,60),.85);
  s+=I.CL([300,CH,120],1,748,60,"rolo vibratório longe da face (> 1,5 m)")+I.CL([150,CH,60],2,30,60,"placa vibratória leve junto às escamas")+I.CL([380,25,0],3,748,400,"camadas ≤ 20–25 cm, solo selecionado (granular)")+I.AR([300,CH+10,30],[200,CH+10,30],"#2980b9")}
 if(k==5)s+=I.CL([X0,180,0],1,30,60,"novas fiadas: escamas → fitas → aterro")+I.CL([X1+100,150,25],2,748,60,"fitas a cada nível de ancoragem")+DV(I.pt(X0,0,0)[1],I.pt(X0,top,0)[1],I.pt(X0,0,0)[0]-20,"H",10,10);
 if(k>=6){for(let c=1;c<nC;c++)s+=I.LN([[X0,c*CH,0],[X0,c*CH,Z]],"#ffffff",3,'stroke-dasharray="8 4"');
  if(k==6)s+=I.CL([X0,CH,0],1,30,60,"geotêxtil nas juntas entre escamas")+I.CL([X1+20,15,0],2,30,400,"dreno de pé: tubo perfurado + brita")+I.CL([380,200,100],3,748,60,"dreno de interface no talude, se houver água")+I.AR([380,120,0],[X1+40,40,0],"#2980b9")}
 if(k>=7){s+=I.PR(X0-10,X1+20,top,top+24,0,Z,"#9aa3ab");if(k==7)s+=I.CL([X0,top+24,40],1,30,60,"viga de coroamento moldada in loco")+I.CL([X1+60,top,150],2,748,60,"guarda-corpo / defensa e drenagem superficial")}
 if(k==8){s+=I.LN([[X0-4,top+24,10],[X0-4,0,10]],"#c0392b",1.2,'stroke-dasharray="3 3"')+DV(I.pt(X0,0,0)[1],I.pt(X0,top,0)[1],I.pt(X0,0,0)[0]-20,"H",10,10)+WORKER(...I.pt(260,top,100),.9);
  s+=I.CL([X0-4,top/2,10],1,30,60,"prumo / alinhamento a cada fiada (tol. ± 1–2 cm)")+I.CL([260,top,100],2,748,60,"grau de compactação ≥ 95% PN por camada")+I.CL([380,40,0],3,748,400,"monitorar deslocamentos e recalques")}
 return sv(k+1,TT[k],s)}
const sec2=sec("terra-armada","Contenção em terra armada (solo reforçado)",[],["NBR 19286:2024 (solo reforçado / terra armada)","NBR 11682:2009 (estabilidade de encostas)","NBR 7182 (ensaio de compactação)","NR-18 · NR-6"],terra,[
["Locação e escavação","Loque a face do muro com gabarito e escave até a cota com talude de corte estável, liberando largura para os reforços.",["Alinhamento e cotas conferidos","Largura ≥ 0,7H + folga","Fundo regularizado e compactado"],[SEG.esc2,"Talude de corte com inclinação segura; não estocar material na borda."],["Corte vertical instável","Largura insuficiente para o comprimento dos reforços"]],
["Soleira de nivelamento","Execute a soleira de concreto magro nivelada que receberá a primeira fiada.",["Nível ± 5 mm","Seção ≈ 15×30 cm","Cura antes de montar"],[SEG.conc],["Soleira desnivelada (muro fora de prumo)"]],
["1ª fiada de escamas","Posicione os painéis da 1ª fiada, alinhe, escore e confira o prumo com leve inclinação para trás.",["Juntas com espaçadores","Escoras em todos os painéis","Inclinação ≈ 1:50 p/ trás"],["Içamento: área isolada, ninguém sob a carga; cintas inspecionadas."],["Painéis sem escora","Prumo exato (sem compensar o deslocamento)"]],
["Fitas / geogrelhas","Fixe as fitas metálicas ou geogrelhas nos níveis de projeto, esticadas e perpendiculares à face, com L ≈ 0,7H.",["L ≥ 0,7H e ≥ 3 m","Fitas galvanizadas / geogrelha certificada","Fixação ao painel conferida"],[SEG.esc],["Reforço curto","Fitas dobradas ou sem tensão","Geogrelha em sentido errado"]],
["Aterro em camadas","Lance aterro selecionado em camadas ≤ 20–25 cm e compacte; junto à face use apenas compactação leve.",["Solo granular conforme projeto","Umidade ótima","Rolo pesado > 1,5 m da face"],["Rolo/placa vibratória: protetor auricular, distância de pessoas."],["Camadas espessas","Rolo pesado colado à face (desaprumo)","Argila/entulho no aterro"]],
["Repetição das fiadas","Repita: retire escoras da fiada abaixo após o aterro, monte nova fiada, reforços e aterro.",["Prumo a cada fiada","Sequência escamas → fitas → aterro"],[SEG.alt],["Subir fiadas sem aterrar a anterior"]],
["Drenagem","Cubra as juntas com geotêxtil por trás e execute o dreno de pé; preveja dreno de interface se houver água no talude.",["Geotêxtil em todas as juntas","Dreno de pé com saída","Drenagem superficial no topo"],[SEG.esc],["Juntas sem geotêxtil (perda de finos)","Dreno sem saída"]],
["Coroamento","Concrete a viga de coroamento e instale guarda-corpo/defensa e canaletas.",["Viga contínua com juntas","Guarda-corpo no topo"],[SEG.alt,SEG.conc],["Topo sem drenagem (infiltração no aterro)"]],
["Controle de prumo e compactação","Registre prumo/alinhamento, ensaios de compactação por camada e monitore deslocamentos.",["GC ≥ 95% PN","Tolerância de prumo do projeto","Registros por camada"],[SEG.esc],["Não ensaiar camadas","Ignorar desaprumo progressivo"]]]);
const i=S.findIndex(x=>x.id=="pavimento");S.splice(i<0?S.length:i+1,0,sec2)})();
