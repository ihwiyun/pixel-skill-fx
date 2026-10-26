'use strict';
// 금륜진 — 레퍼런스(11.7~16.4초)를 1초 20장으로 뽑고 4칸=1픽셀로 줄여 프레임마다 위치·크기·색을 잰 값. 크기는 레퍼런스 픽셀 × kk
// (레퍼런스 인물 키 50픽셀, 여기 인물 키 28픽셀이라 Z=0.56으로 줄여 인물과의 비율을 맞춤). 틱 t = (레퍼런스 n번째 장-11)×3
// 1마디(0~45): 은빛 세로 베기 → 금빛 원판 → 여러 겹 금줄 고리가 화면 끝까지 퍼짐(적 하얗게→반투명, 큰 금 초승달·과녁) → 아래 흰 베기 → 두 번째 고리
// 2마디(60~126): 몸에 금빛 불꽃 → 보라 초승달 칼날(키 63)이 오른쪽 적으로 날아감 → 보라 과녁·깨진 방패 → 금가루가 흐름
// 3마디(118~190): 칼 치켜듦·별빛 → 맞은 적 둘레에 보라 띠·금 테 고리 → 하얗게 번쩍 → 찌르기 → 큰 보라 타원·금빛 사선
// 4마디(190~288): 활 같은 빛줄기가 하나씩 그어져 공이 됨 → 찌르기 별빛 → 하얀 빛 → 큰 금빛 땅 고리가 화면 밖으로 퍼짐
(function(){
const Z=.56;
const c=hex,G1=c('#5a3206'),G2=c('#c07a12'),G3=c('#ffc531'),G4=c('#fff1a8'),WH=c('#fffdf2'),OR=c('#c8682a'),
 P1=c('#3a2482'),P2=c('#7048d8'),P3=c('#b49cf6'),P4=c('#e9e0ff'),SL=c('#c9d2e0'),SD=c('#6c7488'),B3=c('#7ab8ff'),B4=c('#d6ecff'),OU=c('#3a1e06'),DB=c('#4a2a10');
// 손으로 찍은 표시: 큰 금 초승달(o 테두리, Y 금, W 밝은 가운데)
const CRES=['...oo.','..oYYo','.oYWo.','.oYWo.','oYWo..','oYWo..','oYWo..','oYWo..','oYWo..','oYWo..','oYWo..','.oYWo.','.oYWo.','..oYYo','...oo.'];
const CRC={o:OU,Y:G3,W:G4};
function cres(x,y,flip,a){for(let r=0;r<15;r++)for(let k=0;k<6;k++){const ch=CRES[r][flip?5-k:k];if(ch==='.')continue;if(a<1&&hash(x+k,y+r,frame>>1)>a)continue;pv(x-3+k,y-7+r,CRC[ch],ch==='W')}}
// 과녁: 연노랑 테 동그라미(반지름 6), 안은 어두운 갈색·금 바둑판, 금 십자가 테 밖으로 3칸, 가운데 흰 점
const XH=(()=>{const a=[];for(let y=-9;y<=9;y++){let row='';for(let x=-9;x<=9;x++){const d=Math.hypot(x,y);row+=(x===0||y===0)&&Math.abs(x+y)<=9?(Math.abs(x+y)<=1?'w':'g'):d>5.4&&d<6.5?'r':d<=5.4?((x+y)&1?'D':(x&y&1?'d':'.')):'.'}a.push(row)}return a})();
const XC={w:WH,g:G3,r:G4,D:c('#2a1608'),d:G1};
function xhair(x,y,a){for(let r=0;r<19;r++)for(let k=0;k<19;k++){const ch=XH[r][k];if(ch==='.')continue;if(a<1&&hash(x+k,y+r,frame>>1)>a)continue;pv(x-9+k,y-9+r,XC[ch],ch==='w')}}
function star4(x,y,lx,ly,a){for(let k=-lx;k<=lx;k++){const f=1-Math.abs(k)/lx;if(f*a<.08)continue;pv(x+k,y,f>.6?WH:f>.3?G4:G3,f>.2)}
 for(let k=-ly;k<=ly;k++){const f=1-Math.abs(k)/ly;if(f*a<.08)continue;pv(x,y+k,f>.6?WH:f>.3?G4:G3,f>.2)}pv(x+1,y,WH,true);pv(x-1,y,WH,true);pv(x,y+1,WH,true);pv(x,y-1,WH,true)}
// 초승달 띠: 원호를 따라 가운데 두껍고 끝이 가늘다. cols는 바깥(볼록한 쪽)→안쪽
function arcBand(cx,cy,rx,ry,a0,a1,th,cols,P,a){for(let q=a0;q<=a1;q+=.5/Math.max(rx,ry)){const f=(q-a0)/(a1-a0),w=th*Math.sin(f*Math.PI)**.8;if(w<.5)continue;if(a<1&&hash(q*300|0,cx|0,frame>>1)>a)continue;
  for(let o=0;o<=w;o+=.5){const k=o/w,col=cols[Math.min(cols.length-1,(k*cols.length)|0)];(P||pv)(cx+Math.cos(q)*(rx-o),cy+Math.sin(q)*(ry-o*ry/rx),col,k>.45)}}}
// 땅 고리: 금·주황 줄 여러 겹(사이는 비움), 맨 안쪽 흰 테. 위 반은 뒤, 아래 반은 앞. br<1이면 끊김
function gring(cx,cy,rx,ry,lines,br){for(let q=0;q<TAU;q+=.5/rx){if(br<1&&hash(q*rx|0,rx|0,3)>br)continue;const P=Math.sin(q)>0?pv:pb,sq=Math.sin(q);
  for(let l=0;l<lines;l++){const o=l*2.2*Math.max(.4,Math.abs(sq)*.4+.6),x=cx+Math.cos(q)*(rx-o),y=cy+sq*(ry-o*.62);if(l>0&&hash(q*rx*3|0,l,rx|0)<.12)continue;P(x,y,l===lines-1?WH:l===0?G2:l&1?G3:OR,l>=lines-2)}
  if(lines>3&&hash(q*90|0,rx|0,5)<.06)for(let s=1;s<4+hash(q*7|0,1,1)*7;s++)P(cx+Math.cos(q)*rx+s*Math.sign(Math.cos(q)),cy+sq*ry,G3,true)}}
// 처음 터지는 금빛 원판: 가운데 흰빛, 소용돌이 금줄, 흰 테
function burst(cx,cy,rx,ry){for(let y=cy-ry|0;y<=cy+ry;y++)for(let x=cx-rx|0;x<=cx+rx;x++){const nx=(x-cx)/rx,ny=(y-cy)/ry,d=Math.hypot(nx,ny);if(d>1)continue;const sw=frac(Math.atan2(ny,nx)/TAU*4+d*2);
  const P=ny>0?pv:pb;if(d>.84)P(x,y,d>.92?G4:WH,true);else if(sw<.22&&d>.25)P(x,y,sw<.08?G4:G3,sw<.08);else pa(x,y,G3,.28+.3*d)}}
// 적 둘레 고리: 보라 띠(안쪽 진보라·바깥 연보라)에 금 테, 안쪽에 금 실선 하나, 끝이 가늘어지는 나선. br<1이면 보라 가루로 흩어짐
function mring(x,y,rx,ry,tl,ph,br,bw){const ct=Math.cos(tl),st=Math.sin(tl);
 for(let q=0;q<TAU*1.1;q+=.5/rx){const f=q/(TAU*1.1),w=bw*Math.min(1,f*5,(1-f)*5),qq=q+ph;if(w<.5)continue;
  if(br<1&&hash(q*90|0,x|0,frame>>1)>br){if(hash(q*90|0,7,x|0)<.3*br)pv(x+Math.cos(qq)*rx*1.08,y+Math.sin(qq)*ry*1.08,P3,true);continue}
  const sp=1+f*.12,P=Math.sin(qq)>0?pv:pb;
  for(let o=-1;o<=w+1;o++){const r=sp-o/rx,ex=Math.cos(qq)*rx*r,ey=Math.sin(qq)*ry*r,X=x+ex*ct-ey*st,Y=y+ex*st+ey*ct;P(X,Y,o<0||o>w?(o<0?G3:G2):o<w*.45?P3:o<w*.8?P2:P1,o<0&&hash(q*60|0,1,3)<.3)}
  const r2=sp*.72,ex=Math.cos(qq)*rx*r2,ey=Math.sin(qq)*ry*r2;if(f>.15)P(x+ex*ct-ey*st,y+ex*st+ey*ct,G3,true)}
 for(let y2=-ry|0;y2<=ry;y2++)for(let x2=-rx|0;x2<=rx;x2++){if((x2/rx)**2+(y2/ry)**2>.8)continue;if(br<1&&hash(x2,y2,frame>>1)>br)continue;pa(x+x2,y+y2,P2,.22)}}
// 큰 공의 빛줄기: 기울어진 큰 원을 돌려 그린다. rev는 그어진 비율. 가운데 흰 줄, 둘레 금빛 번짐
function gcircle(cx,cy,R,ax,ay,rev,ph,core,edge,th,a,rz){const cz=Math.cos(rz||0),sz=Math.sin(rz||0);const ca=Math.cos(ay),sa=Math.sin(ay),cb=Math.cos(ax),sb=Math.sin(ax);
 for(let q=0;q<TAU*rev;q+=.4/R){if(a<1&&hash(q*R|0,ax*9|0,frame>>1)>a)continue;const X=Math.cos(q+ph),Y=Math.sin(q+ph),Y2=Y*cb,Z2=Y*sb,X3=X*ca+Z2*sa,Z3=-X*sa+Z2*ca,
  P=Z3>0?pv:pb,px=cx+(X3*cz-Y2*sz)*R,py=cy+(X3*sz+Y2*cz)*R*.9;P(px,py,core,core===WH);if(th>1)P(px+(Math.abs(Y2)>.7?1:0),py+(Math.abs(Y2)>.7?0:1),edge,false)}}
// 활 줄기: [기울기x, 기울기y, 시작틱, 가운데색, 둘레색, 굵기]
// 레퍼런스 #75~#90: 세로로 긴 활(경선)이 대부분이고, 가로로 누운 보라 원(위선)이 둘
const ARCS=[[.15,.35,190,G3,G2,1],[.25,1.05,194,G4,G3,1],[-.2,1.4,198,WH,G4,2],[.35,-.75,202,G3,G2,1],[1.0,0,205,P3,P2,2,-.22],[.9,.3,209,WH,G4,2],[-.55,.55,213,G4,G3,1],[0,-1.2,217,WH,G3,2],[1.15,0,221,P3,P2,1,.18]];

CUSTOM.sphere=e=>{const t=e.t,kk=Z*(.8+.05*e.tier),q=v=>v*kk,hx=hero.x,hy=hero.y,cy=hy-q(25),M=mobs;
 if(t===0)for(const m of M){m.gm=m.xh=m.pr=m.st=m.wv=m.ghost=0;m.rg=hash(m.seed*13|0,2,2)<.42}
 const hit=(m,f,g)=>{m.flash=f;m.ghost=g||0};
 // 칼 자세(프레임마다): 내려베기·아래베기·치켜듦·찌르기
 hero.sa=t<6?-1.2+2.1*t/6:t<13?.9:t<17?-1.2+2.1*(t-13)/4:t<23?.9-1.2*(t-17)/6:t<78?undefined:t<84?-1.1+1.6*(t-78)/6:t<118?undefined:t<147?-1.25:t<160?0:t<180?.5:t<188?-1.3:t<196?.15:t<214?(t>>3&1?-1.2:.8):t<240?-1.25:t<258?0:undefined;
 hero.ox=(t>=147&&t<160)||(t>=240&&t<258)?2:0;
 // 몸을 감싸는 금빛 불꽃(2마디부터): 뒤는 진한 금, 몸 위는 밝은 노랑이 군데군데
 if(t>=60&&t<e.dur-4){const a=Math.min(1,(t-60)/6)*(t>e.dur-12?(e.dur-t)/8:1),Hh=q(56);for(let k=q(4);k<Hh;k++){const r=k/Hh,w=q(14)*Math.sin(Math.min(1,r/.4)*Math.PI*.5)*(1.1-r*.75)*(.8+.4*vn(k*.3,t*.2)),sw=(vn(k*.2+5,t*.12)-.5)*q(5)*r;
   for(let o=-w;o<=w;o++){const u=Math.abs(o)/w,al=a*(1-u*.8)*(1-r*.5)*1.3;if(al>.75)pb(hx+sw+o,hy-k,u<.4?G4:G3,false);else pa(hx+sw+o,hy-k,u<.5?G4:G3,al)}}
  for(let n=0;n<3;n++){const x=hx+(hash(n,t>>1,3)-.5)*q(26),y=hy-q(8)-hash(n,t>>1,4)*q(46);if(hash(n,t>>1,5)<a)pv(x,y,n?G4:WH,true)}
  if(t>=118)for(let a2=0;a2<TAU;a2+=.06)if(frac(a2/TAU*12+t*.01)<.6)(Math.sin(a2)>0?pv:pb)(hx+Math.cos(a2)*q(26),hy+1+Math.sin(a2)*q(7),G4,true)}

 // ── 1마디 ── 은빛 세로 베기(#12): 주인공 오른쪽 +18~+32, 키 48
 for(const s0 of [0,13])if(t>=s0&&t<s0+6){const v=t-s0;arcBand(hx+q(4),hy-q(26),q(28),q(26),-1.25,-1.25+2.5*Math.min(1,(v+1)/3),q(8),[SD,SL,WH],pv,v<4?1:(6-v)/2)}
 // 아래 흰 베기(#16~17): 주인공 아래 왼쪽→오른쪽
 if(t>=17&&t<23)arcBand(hx-q(8),hy-q(18),q(28),q(16),.3,.3+2.6*Math.min(1,(t-16)/3),q(7),[SD,SL,WH],pv,t<21?1:(23-t)/2);
 for(const [s0,wv] of [[6,1],[21,2]]){const v=t-s0;if(v<0||v>=36)continue;
  // 잰 값: 원판 49×24 → 117×73(줄 6겹) → 145×88(3겹) → 150×90(2겹) 뒤 끊기며 사라짐. 가운데는 발보다 16 위
  const rx=q(v<2?49:v<3?49+68*(v-2):v<6?117+28*(v-3)/3:v<9?145+5*(v-6)/3:150),ry=rx*(v<2?.49:.62),c2=hy-q(v<2?13:16);
  if(v<2)burst(hx,c2,rx,ry);else gring(hx,c2,rx,ry,v<4?6:v<7?3:2,v<9?1:clamp(1-(v-9)/26,0,1)*.75);
  for(const m of M){if(m.wv>=wv)continue;if(Math.hypot((m.x-hx)/Math.max(rx,q(130)),(m.y-q(14)-c2)/Math.max(ry,q(95)))<1){m.wv=wv;hit(m,v<4?6:3,14);m.gm=36;if((M.indexOf(m)+wv)%4===0)m.xh=24}}}
 // ── 2마디: 보라 초승달 칼날(#37~45): 키 63, 굵기 10, 한 틱에 3픽셀 ──
 const T=e.tg||(e.tg=M.filter(m=>m.x>hx+8).sort((a,b)=>Math.abs(a.y-hy)*2+a.x-(Math.abs(b.y-hy)*2+b.x))[0]);
 if(t>=78&&t<114){const v=t-78,x=hx+q(v<9?12+4.6*v:53+(v-9)*2.9)-q(4),a=v<28?1:(114-t)/8;
  arcBand(x-q(30),hy-q(18),q(34),q(32),-1.1,1.1,q(10),[P2,P3,P4,WH],pv,a);
  if(v>3)for(let y=-q(20);y<q(20);y++)for(let o=0;o<q(6);o++)if(hash(o,y|0,t>>1)<.5*a)pv(x-q(14)-o+Math.abs(y)*.25,hy-q(18)+y,(o+y)&1?OR:DB,false);
  if(v>2)arcBand(x-q(46),hy-q(20),q(26),q(22),-1,1,q(3),[SD,SL],pv,a*.6);
  if(T&&!e.th&&v>=9){e.th=1;hit(T,8,12);T.st=8;T.shield=40}if(T&&v===12)T.pr=28}
 if(t>=87&&t<130&&T){for(let n=0;n<4&&t<118;n++)(e.gs||(e.gs=[])).push({x:hx+q(14),y:cy+(Math.random()-.5)*q(10),vx:1.4+Math.random()*2.2,vy:(T.y-q(25)-cy)/30+(Math.random()-.5)*1.6,l:26+Math.random()*14})}
 if(e.gs)for(let i=e.gs.length-1;i>=0;i--){const g=e.gs[i];g.x+=g.vx;g.y+=g.vy;g.vx*=.985;g.l--;const big=g.l>12&&(i&3)===0;pv(g.x,g.y,g.l>10?G4:G3,true);if(big){pv(g.x+1,g.y,G3,true);pv(g.x-1,g.y,G3,true);pv(g.x,g.y+1,G3,true);pv(g.x,g.y-1,G3,true)}if(g.l<=0)e.gs.splice(i,1)}
 // ── 3마디 ── #52: 칼끝 별빛, 금빛 세로 점선 활
 if(t>=123&&t<133){const a=1-(t-123)/10,sx=hx+4+Math.cos(-1.25)*13,sy=hy-15+Math.sin(-1.25)*13;star4(sx,sy,q(26)*a+3,q(20)*a+3,a);
  for(const [rx,dir] of [[70,1],[120,1],[80,-1],[150,-1]])for(let a2=-1.1;a2<1.1;a2+=.025)if(frac(a2*7+t*.05)<.4)pb(hx+dir*Math.cos(a2)*q(rx),cy-q(15)+Math.sin(a2)*q(120),G2,true);
  if(t===123)for(const m of M){if(m.x<hx-q(30))hit(m,8,0);if(hash(m.seed*5|0,3,1)<.5)m.st=12}}
 // #54~57, #60~64: 맞은 적 둘레 고리(가로 48, 세로 26, 띠 굵기 7)
 for(const [s0,s1] of [[127,141],[147,168]])if(t>=s0&&t<s1){const v=t-s0,g=ease(Math.min(1,v/3)),br=t<s1-6?1:(s1-t)/6;for(const m of M)if(m.rg){if(v===0){m.gm=Math.max(m.gm,s1-s0);m.ghost=s1-s0}}for(const m of M)if(m.rg)mring(m.x,m.y-q(25),q(48)*g,q(26)*g,-.2+.15*Math.sin(m.seed),v*.04+m.seed,br,q(11))}
 if(t===141)for(const m of M){hit(m,8,12);m.gm=30}
 if(t>=141&&t<148)for(const m of M)for(let n=0;n<5;n++){const a2=hash(n,m.seed*7|0,2)*TAU,r=q(8)+(t-141)*1.2;for(let o=0;o<3;o++)pa(m.x+Math.cos(a2)*r+o,m.y-q(25)+Math.sin(a2)*r*.6,WH,.7*(1-(t-141)/7))}
 // #62 찌르기 빛줄기
 if(t>=152&&t<160)arcBand(hx+q(60),cy+q(60),q(80),q(56),-2.25,-1.1,q(4),[P2,P3,WH],pv,(160-t)/8);
 // #64~#90 큰 보라 타원(가로 120, 세로 64, 발 높이)
 if(t>=158&&t<250){const g=ease(Math.min(1,(t-158)/8)),a=t<240?1:(250-t)/10,rx=q(100+18*g),ry=rx*.6;
  for(let a2=0;a2<TAU;a2+=.5/rx){if(a<1&&hash(a2*99|0,1,frame>>1)>a)continue;const P=Math.sin(a2)>0?pv:pb,x=hx+Math.cos(a2)*rx,y=hy+q(5)+Math.sin(a2)*ry;P(x,y,P2,false);P(x,y-1,frac(a2*14)<.3?P4:P3,true)}
  if(t===160)for(const m of M)if(hash(m.seed*11|0,5,5)<.5)m.shield=40}
 if(t>=160&&t<185){const v=t-160;for(let k=0;k<44;k++){const a2=k/44*TAU*1.4+v*.04,rr=q(80+k*2);if(hash(k,v>>2,4)>(1-v/25))pv(hx+Math.cos(a2)*rr,hy-q(10)+Math.sin(a2)*rr*.5,k&1?WH:P4,true)}}
 for(const [s0,x0,y0,x1,y1] of [[164,-110,104,92,-214],[176,-210,60,150,-224],[184,54,110,-64,-228]])if(t>=s0&&t<s0+7){const a=1-(t-s0)/7,x0k=q(x0),y0k=q(y0),dx=q(x1-x0),dy=q(y1-y0),n=Math.hypot(dx,dy);
  for(let s=0;s<n;s++){const f=s/n;if(hash(s,s0,t>>1)>a*1.2)continue;const x=hx+x0k+dx*f,y=hy+y0k+dy*f;pv(x,y,f>.3&&f<.7?WH:G3,true);pv(x+1,y,G2,false)}}
 if(t>=166&&t<172)arcBand(hx+q(10),hy-q(6),q(30),q(16),-.4,1.6,q(6),[P3,P4,WH],pv,(172-t)/6);
 // ── 4마디 ── #72 푸른 위로 베기, #75 찌르기 빛줄기
 if(t>=180&&t<188)arcBand(hx+q(4),cy,q(28),q(40),-1.4,1.3,q(8),[B3,B4,WH],pv,(188-t)/8);
 if(t>=192&&t<198){const a=(198-t)/6;for(let s=0;s<q(110);s++){const f=s/q(110),w=f<.15?f/.15:1-(f-.15)/.85;if(hash(s,t,9)>a+.3)continue;pv(hx+q(14)+s,hy-q(2)-s*.06,w>.6?WH:P4,true);if(w>.4)pv(hx+q(14)+s,hy-q(1)-s*.06,P3,false)}}
 if(t===192)for(const m of M){hit(m,m.x<hx?24:10,12);m.gm=34;if(hash(m.seed*3|0,4,1)<.18)m.xh=24}
 for(const s0 of [199,207])if(t>=s0&&t<s0+6)arcBand(hx+q(4),cy,q(30),q(42),-1.4,1.3,q(8),[B3,B4,WH],pv,(s0+6-t)/6);
 // #75~#90 공: 반지름 125, 가운데는 발보다 40 위
 if(t>=190&&t<247){const a=t<243?1:(247-t)/4,R=q(125),ph=(t-190)*.006;
  for(const [ax,ay,s0,core,edge,th,rz] of ARCS){if(t<s0)continue;gcircle(hx,hy-q(40),R,ax,ay,Math.min(1,(t-s0)/8),ph,core,edge,th,a,rz)}
  if(t>=224){const g=Math.min(1,(t-224)/6);for(let a2=0;a2<TAU;a2+=.5/R){if(hash(a2*999|0,2,frame>>1)>a*g)continue;const P=Math.sin(a2)>0?pv:pb;P(hx+Math.cos(a2)*R,hy+q(30)+Math.sin(a2)*q(70),G4,true);P(hx+Math.cos(a2)*R,hy+q(30)+Math.sin(a2)*q(70)+1,G3,true)}}}
 // #92 찌르기 별빛(가로 빛 120, 세로 90), #94 하얀 빛
 if(t>=242&&t<254){const a=1-(t-242)/12;star4(hx+q(30),hy-q(2),q(70)*a+5,q(70)*a+4,1)}
 if(t>=248&&t<258){const a=1-(t-248)/10,rx=q(32),ry=q(22);for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++){const d=Math.hypot(x/rx,y/ry);if(d<1)pa(hx+x,hy-q(16)+y,WH,(1-d*d)*a)}star4(hx+q(34),hy-q(6),q(30)*a+3,q(40)*a+3,1)}
 if(t===249)for(const m of M){hit(m,4,0);m.gm=8}
 // #96~#104 큰 금빛 땅 고리: 가로 150→220, 세로 95→ 화면 밖
 if(t>=252&&t<282){const v=t-252,rx=q(150+25*ease(Math.min(1,v/14))),ry=rx*.62,br=v<10?1:clamp(1-(v-10)/20,0,1);gring(hx,hy-q(20),rx,ry,v<6?6:v<12?3:2,br*(v<10?1:.75));
  if(v<14)for(let k=0;k<10;k++){const a2=k/10*TAU+.3;cres(hx+Math.cos(a2)*rx,hy-q(20)+Math.sin(a2)*ry,Math.cos(a2)<0,1-v/14)}}
 // 적 위 표시: 큰 금 초승달은 몸 왼쪽, 과녁은 몸 가운데
 for(const m of M){const x=m.x,y=m.y-q(25);
  if(m.gm>0){m.gm--;const fl=hash(m.seed*7|0,1,1)<.5;cres(x+(fl?q(10):-q(10)),y,fl,Math.min(1,m.gm/8))}
  if(m.xh>0){m.xh--;xhair(x,y,Math.min(1,m.xh/6))}
  if(m.pr>0){m.pr--;const a=Math.min(1,m.pr/8);for(let k=-q(12);k<=q(12);k++)if(Math.abs(k)>1){pv(x+k,y,G3,false);pv(x,y+k,G3,false)}pv(x,y,WH,true);for(const [r,col] of [[q(10),P3],[q(17),P2],[q(24),P3]])for(let a2=0;a2<TAU;a2+=.5/r){if(frac(a2/TAU+r*.07+t*.02)>.82||hash(a2*40|0,r|0,frame>>1)>a)continue;pv(x+Math.cos(a2)*r,y+Math.sin(a2)*r,col,true)}}
  if(m.st>0){m.st--;star4(x,y,4+m.st*.5|0,3+m.st*.4|0,1)}
  if(m.shield>0&&m.shield<36&&t<e.dur-8)m.shield=36}
 if(t===e.dur-1){hero.sa=undefined;hero.ox=0;e.gs=null}};
})();
