// Kit de desenho SVG — FSantos Engenharia (esquemas e guia)
const K=(()=>{let n=0;const N="#0b1a30",A="#f2b632",STL="#d8432b",CON="#b9bec5",SOIL="#9a6a3c",WOOD="#d9a96a",GRAV="#9b9184";
const sh=(c,f)=>{const m=c.match(/\w\w/g).map(x=>parseInt(x,16));return"#"+m.map(x=>Math.max(0,Math.min(255,Math.round(f>1?x+(255-x)*(f-1):x*f))).toString(16).padStart(2,"0")).join("")};
const defs=id=>`<defs><pattern id="${id}-soil" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#b07d4b"/><path d="M0 14L14 0M-3 3L3-3M11 17L17 11" stroke="#7a4e26" stroke-width="1.3"/></pattern>
<pattern id="${id}-con" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="${CON}"/><circle cx="4" cy="5" r="1.1" fill="#8d939b"/><circle cx="12" cy="11" r="1.4" fill="#9aa0a8"/><path d="M10 3l2 2-3 0z" fill="#858b93"/></pattern>
<pattern id="${id}-grav" width="12" height="10" patternUnits="userSpaceOnUse"><rect width="12" height="10" fill="#c9c1b4"/><circle cx="3" cy="3" r="2" fill="#8f8577"/><circle cx="9" cy="7" r="2.2" fill="#a29888"/></pattern>
<pattern id="${id}-wood" width="40" height="8" patternUnits="userSpaceOnUse"><rect width="40" height="8" fill="${WOOD}"/><path d="M0 4q10-3 20 0t20 0" stroke="#b9854a" fill="none"/></pattern>
<pattern id="${id}-sand" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#e7d3a1"/><circle cx="2" cy="2" r=".8" fill="#b69a5c"/><circle cx="6" cy="6" r=".8" fill="#b69a5c"/></pattern>
<pattern id="${id}-eps" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#f4f6f8"/><circle cx="5" cy="5" r="3" fill="none" stroke="#d4d9de"/></pattern>
<marker id="${id}-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${N}"/></marker>
<marker id="${id}-ara" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#c0392b"/></marker></defs>`;
// rótulos com fundo (TB) mantidos dentro do viewBox
const fitTB=(body,W,H)=>body.replace(/<g data-tb="([-\d.]+),([-\d.]+),([-\d.]+),([-\d.]+)">/g,(m,x,y,w,h)=>{x=+x;y=+y;w=+w;h=+h;const m2=3,dx=x<m2?m2-x:x+w>W-m2?Math.max(m2-x,W-m2-x-w):0,dy=y<m2?m2-y:y+h>H-m2?Math.max(m2-y,H-m2-y-h):0;return dx||dy?`<g transform="translate(${+dx.toFixed(1)},${+dy.toFixed(1)})">`:"<g>"});
const SV=(w,h,body,title="",cls="fsvg")=>{const id="sv"+(++n);return`<svg class="${cls}" preserveAspectRatio="xMidYMid meet" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Segoe UI,Roboto,sans-serif">${defs(id)}<rect width="${w}" height="${h}" fill="#f6f2e9"/>${fitTB(body,w,h).replace(/#P-/g,"#"+id+"-")}</svg>`};
const fl=v=>/^(soil|con|grav|wood|sand|eps)$/.test(v)?`url(#P-${v})`:v;
const R=(x,y,w,h,fill="none",st=N,sw=1,ex="")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fl(fill)}" stroke="${st}" stroke-width="${sw}" ${ex}/>`;
const L=(x1,y1,x2,y2,st=N,sw=1,ex="")=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${st}" stroke-width="${sw}" ${ex}/>`;
const P=(pts,fill="none",st=N,sw=1,ex="")=>`<polygon points="${pts.map(p=>p.join(",")).join(" ")}" fill="${fl(fill)}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" ${ex}/>`;
const PL=(pts,st=N,sw=1,ex="")=>`<polyline points="${pts.map(p=>p.join(",")).join(" ")}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${ex}/>`;
const C=(x,y,r,fill=STL,st="none",sw=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fl(fill)}" stroke="${st}" stroke-width="${sw}"/>`;
const T=(x,y,s,sz=12,an="middle",fill=N,w=600,ex="")=>`<text x="${x}" y="${y}" font-size="${sz}" text-anchor="${an}" fill="${fill}" font-weight="${w}" ${ex}>${s}</text>`;
const TB=(x,y,s,sz=12,an="middle")=>{const w=s.replace(/<[^>]+>/g,"").length*sz*0.56+10,x0=an=="middle"?x-w/2:an=="end"?x-w:x;return`<g data-tb="${x0},${y-sz+1},${w},${sz+5}">`+R(x0,y-sz+1,w,sz+5,"#ffffffd9","none",0,'rx="3"')+T(an=="middle"?x:an=="end"?x-5:x+5,y+1,s,sz,an)+"</g>"};
const tick=(x,y)=>L(x-4,y+4,x+4,y-4,N,1.4);
const DH=(x1,x2,y,lab,ext=0,sz=12)=>(ext?L(x1,y-ext,x1,y+4,"#55627a",.7)+L(x2,y-ext,x2,y+4,"#55627a",.7):"")+L(x1,y,x2,y,N,1)+tick(x1,y)+tick(x2,y)+TB((x1+x2)/2,y-4,lab,sz);
const DV=(y1,y2,x,lab,ext=0,sz=12)=>(ext?L(x-ext,y1,x+4,y1,"#55627a",.7)+L(x-ext,y2,x+4,y2,"#55627a",.7):"")+L(x,y1,x,y2,N,1)+tick(x,y1)+tick(x,y2)+`<g transform="rotate(-90 ${x-5} ${(y1+y2)/2})">${TB(x-5,(y1+y2)/2,lab,sz)}</g>`;
const BAR=(pts,sw=3,c=STL)=>PL(pts,c,sw);
const DOT=(x,y,r=3.5)=>C(x,y,r,STL,"#7a1d10",1);
const CO=(x,y,nn)=>C(x,y,11,A,N,1.5)+T(x,y+4.5,nn,12,"middle",N,800);
const LD=(x1,y1,x2,y2,lab,an="start",sz=11)=>L(x1,y1,x2,y2,N,1)+C(x1,y1,2.2,N)+TB(x2+(an=="start"?3:an=="end"?-3:0),y2+4,lab,sz,an);
const ARW=(x1,y1,x2,y2,c=N,sw=1.5)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${sw}" marker-end="url(#P-${c=="#c0392b"?"ara":"ar"})"/>`;
const BOX=(x,y,w,h,d,fill,st=N,sw=1)=>{const dx=d*.7,dy=-d*.45,c=fill.startsWith("#")?fill:null;const top=c?sh(c,1.18):fill,side=c?sh(c,.8):fill;
 return P([[x,y],[x+dx,y+dy],[x+w+dx,y+dy],[x+w,y]],top,st,sw)+P([[x+w,y],[x+w+dx,y+dy],[x+w+dx,y+h+dy],[x+w,y+h]],side,st,sw)+(c?"":P([[x+w,y],[x+w+dx,y+dy],[x+w+dx,y+h+dy],[x+w,y+h]],"#00000022","none",0))+R(x,y,w,h,fill,st,sw)};
const WORKER=(x,y,s=1,tool="")=>`<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-52" r="7" fill="#e8b98f" stroke="${N}"/><path d="M-9-56q9-12 18 0z" fill="${A}" stroke="${N}"/><path d="M-8-44h16l2 24h-20z" fill="#e67e22" stroke="${N}"/><path d="M-6-44l4 24M6-44l-4 24" stroke="#f9e79f" stroke-width="2"/><path d="M-6-20l-3 20M6-20l3 20" stroke="#1f3a64" stroke-width="5" stroke-linecap="round"/><path d="M-8-40l-8 14M8-40l10 12" stroke="#e67e22" stroke-width="4" stroke-linecap="round"/>${tool=="pa"?'<path d="M18-28l14 26" stroke="#6b4a2a" stroke-width="2.5"/><path d="M28-6l8 10 4-8z" fill="#777" stroke="'+N+'"/>':tool=="vib"?'<path d="M18-28q20 10 20 40" stroke="#333" stroke-width="3" fill="none"/><rect x="34" y="10" width="7" height="22" fill="#555"/>':tool=="mart"?'<path d="M18-28l10-14" stroke="#6b4a2a" stroke-width="2.5"/><rect x="22" y="-48" width="12" height="6" fill="#555"/>':tool=="regua"?'<path d="M-40-20h80" stroke="#888" stroke-width="5"/>':""}</g>`;
const DROPS=(x,y,n=5)=>Array.from({length:n},(_,i)=>`<path d="M${x+i*22} ${y+(i%2)*8}q4 8 0 10q-4-2 0-10z" fill="#3498db"/>`).join("");
const GROUND=(G,w,h,holes=[],grass=true)=>{let s=R(0,G,w,h-G,"soil","none");holes.forEach(([x1,x2,yb,sl=0])=>{s+=P([[x1-sl,G],[x2+sl,G],[x2,yb],[x1,yb]],"#e6dccb",SOIL,1.5)});return s+L(0,G,w,G,"#5b3a1c",2)+(grass?Array.from({length:Math.floor(w/18)},(_,i)=>{const x=i*18+5;return holes.some(([a,b,_y,sl=0])=>x>a-sl-4&&x<b+sl+4)?"":`<path d="M${x} ${G}l3-7l2 7l3-5l1 5" stroke="#5a8f3a" fill="none" stroke-width="1.4"/>`}).join(""):"")};
return{N,A,STL,CON,SOIL,WOOD,GRAV,sh,SV,R,L,P,PL,C,T,TB,DH,DV,BAR,DOT,CO,LD,ARW,BOX,WORKER,DROPS,GROUND}})();
