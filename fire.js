'use strict';
// 화룡장: 1) 몸을 도는 주황 기운 고리 2) 큰 불꽃 폭발 원판 + 불덩이 둘 3) 불기둥을 감고 오르는 용 + 둘레 불꽃 고리 4) 용이 뻗어 나가 땅에 긴 불길 깔기
(function(){
const c=hex,DK=c('#4a1204'),RED=c('#b8300a'),ORG=c('#ee6a12'),AMB=c('#ffa324'),YEL=c('#ffd75a'),PY=c('#fff1a8'),WH=c('#fffbe8');
const RAMP=[RED,ORG,AMB,YEL,PY,WH];
const ramp=v=>RAMP[clamp(v*6|0,0,5)];

// 불꽃 혀 하나(아래가 넓고 위가 뾰족, 가운데가 하얗게 밝음)
function tongue(P,x,y,h,w,seed,t){for(let k=0;k<h;k++){const r=k/h,ww=w*(1-r)*(1-r*.3)+.3,sw=(vn(seed+k*.15,t*.12)-.5)*3*r;
  for(let o=-ww;o<=ww;o+=1){const e=Math.abs(o)/(ww+.5);P(x+sw+o,y-k,ramp(1-r*.55-e*.55),e<.25&&r<.3)}}}

// 1) 기운 고리: 몸을 감싸는 끊어진 주황 원 + 발밑 고리
function charge(e,t){if(t>16)return;const cx=hero.x,cy=hero.y-14,a0=t*.25,f=t<12?1:1-(t-12)/4;
 for(let a=0;a<TAU;a+=.02){if(frac(a/TAU*9+t*.05)>.62*f+.1)continue;const x=cx+Math.cos(a+a0)*15,y=cy+Math.sin(a+a0)*19,P=Math.sin(a+a0)>0&&Math.cos(a+a0)>-.2?pv:pb;P(x,y,AMB,true);P(x+1,y,ORG)}
 for(let a=0;a<TAU;a+=.02){if(frac(a/TAU*7-t*.04)>.7)continue;pb(cx+Math.cos(a)*20,hero.y+1+Math.sin(a)*4.5,ORG,true)}}

// 2) 폭발 원판(가운데 하얀 → 노랑 → 주황 테두리, 테두리에 불꽃 혀) + 불덩이 둘
function burst(e,t,kk){const v=t-12;if(v<0||v>21)return;const g=ease(Math.min(1,v/6)),fd=v<14?1:1-(v-14)/7;
 const cx=hero.x+12,cy=hero.y-6,RX=66*kk*g,RY=32*kk*g;
 for(let y=cy-RY*1.25|0;y<=cy+RY*1.25;y++)for(let x=cx-RX*1.25|0;x<=cx+RX*1.25;x++){const nx=(x-cx)/RX,ny=(y-cy)/RY,rr=Math.hypot(nx,ny),ang=Math.atan2(ny,nx);
  const rim=1+.12*vn(ang*9+3,v*.4)*(ny<0?1.4:.6);if(rr>rim||rr<1-fd*1.1)continue;
  const sw=frac(ang/TAU*2+rr*1.3-v*.05),q=rr/rim;
  if(q>.84){pb(x,y,q>.97?AMB:q>.9?WH:PY,q>.88&&q<.97);continue}
  if(q>.74){pa(x,y,YEL,.55+(q-.74)*4);continue}
  pa(x,y,q<.35?YEL:sw<.2||sw>.55&&sw<.62?YEL:AMB,.5+.25*q+(sw<.12?.2:0))}
 // 테두리 불꽃 혀
 for(let n=0;n<22;n++){const a=n/22*TAU+.1,x=cx+Math.cos(a)*RX*.95,y=cy+Math.sin(a)*RY*.95;tongue(Math.sin(a)>0?pv:pb,x,y,(4+hash(n,v>>1,2)*6)*g*fd,2.2,n*7,v)}
 // 불덩이 둘(뾰족한 테두리 해)
 for(const [ox,oy] of [[34,-24],[36,-2]])orb(hero.x+ox*kk,hero.y+oy*kk,7*kk*g*fd,v,1)}
function orb(cx,cy,r,v,fd){for(let y=cy-r-3|0;y<=cy+r+3;y++)for(let x=cx-r-3|0;x<=cx+r+3;x++){const d=Math.hypot(x-cx,y-cy),ang=Math.atan2(y-cy,x-cx),sp=frac(ang/TAU*12)<.25?2:0;
  if(d>r+sp)continue;if(fd<1&&hash(x,y,9)>fd*1.2)continue;pv(x,y,d>r?DK:d>r-1.5?RED:d>r-3?ORG:d>r-4?AMB:d<r*.4?WH:PY,false)}}

// 3) 불기둥 + 감고 오르는 용 + 둘레 불꽃 고리
function clump(P,cx,cy,r,seed,t){for(let y=cy-r-1|0;y<=cy+r+1;y++)for(let x=cx-r-1|0;x<=cx+r+1;x++){const d=Math.hypot(x-cx,(y-cy)*1.2),e=r*(.7+.5*vn(x*.4+seed,y*.4-t*.2));if(d>e)continue;P(x,y,ramp(1.05-d/e*.7),d<e*.35)}}
const HEAD=['....rr..r....','...rooorr....','..rooyoorrr..','.roooooooyor.','roowoooooyyyr','.rroooooyyyr.','...rrrryyyr..','.......rrr...'];
function dragonHead(P,x,y,flip){const d=flip?-1:1;for(let r=0;r<HEAD.length;r++)for(let k=0;k<13;k++){const ch=HEAD[r][k];if(ch==='.')continue;P(x+d*(k-6),y+r-4,ch==='r'?RED:ch==='o'?ORG:ch==='y'?YEL:WH,ch!=='r')}}
function coil(e,t,kk){const v=t-26;if(v<0||v>40)return;const fd=v<32?1:1-(v-32)/8,hx=hero.x,hy=hero.y;
 // 불기둥(주인공 뒤)
 const ph=40*kk;for(let y=hy-ph|0;y<=hy+1;y++){const k=(hy-y)/ph,wd=9+2*Math.sin(y*.4+v*.5)*(k>.7?1:.3);for(let x=hx-wd|0;x<=hx+wd;x++){if(hash(x,y,v)>fd*1.1)continue;const ed=wd-Math.abs(x-hx);pa(x,y,ed<1.5?ORG:k>.8?AMB:ORG,ed<1.5?.85:.5+.3*k)}}
 for(let n=0;n<5;n++)tongue(pb,hx-8+n*4,hy-ph,5+hash(n,v>>1,4)*6,2,n*3,v);
 // 용 몸통: 기둥을 감으며 위로. 앞쪽은 주인공 앞, 뒤쪽은 뒤
 const rise=ease(Math.min(1,v/16)),seg=140,tail=v>30?(v-30)/10:0;let hx2=0,hy2=0;
 const path=s=>{const a=s*Math.PI*1.7+.4-v*.08;return [hx+Math.sin(a)*13*kk,hy+3-s*(36*kk)*rise,Math.cos(a)]};
 for(let i=0;i<seg;i++){const s=i/seg;if(s<tail)continue;const [x,y,z]=path(s),[x2,y2]=path(s+.01),tx=x2-x,ty=y2-y,tl=Math.hypot(tx,ty)||1,nx=-ty/tl,ny=tx/tl,th=(1.5+3.2*s)*kk,P=z>0?pv:pb;
  for(let o=-th-1;o<=th+1;o+=.5){const ao=Math.abs(o),col=ao>th?DK:ao>th-1.1?RED:o<-th*.2?YEL:(i%6<2&&o>0)?RED:ORG;P(x+nx*o,y+ny*o,col,false)}
  hx2=x;hy2=y}
 dragonHead(pv,hx2+5,hy2-3,false);dragonHead(pv,hx2+5,hy2-2,false);
 // 둘레 불꽃 고리(뒤 절반은 적 뒤, 앞 절반은 적 앞)
 const g=ease(Math.min(1,v/8)),RX=72*kk*g,RY=26*kk*g,cx=hx+10,cy=hy-8;
 for(let n=0;n<72;n++){const a=n/72*TAU+v*.03,x=cx+Math.cos(a)*RX*(1+.06*hash(n,1,1)),y=cy+Math.sin(a)*RY,P=Math.sin(a)>0?pv:pb;
  if(hash(n,v>>2,7)>fd)continue;clump(P,x,y,(4+hash(n,3,5)*3)*kk,n*5,v);tongue(P,x,y-2,(3+hash(n,v>>1,5)*5)*kk,2,n*5,v)}
 if(v===4){e.id=idc++;hitArea(e.id,m=>Math.hypot(m.x-cx,(m.y-cy)*RX/RY)<RX*1.08,90*e.tier,1.4,cx,cy,{burn:1,pi:3});shake=e.tier>=3?5:3}
 for(let n=0;n<3;n++)spark(cx+(Math.random()-.5)*RX*2,cy+(Math.random()-.5)*RY*2,(Math.random()-.5)*.4,-.5-Math.random()*.6,20+Math.random()*14,0)}

// 4) 용이 손에서 뻗어 나가고, 땅에 긴 땅콩 모양 불길이 깔린다
function carpet(e,t,kk){const v=t-60;if(v<0)return;const hx=hero.x,hy=hero.y;
 hero.lean=v<40?2:0;
 // 용 꼬리 띠(왼쪽 위에서 손으로 내려옴)
 if(v<26){const fd=1-v/26;for(let i=0;i<70;i++){const s=i/70,x=hx-60+s*84+Math.sin(s*5)*6,y=hy-64+s*s*50,th=(1+4*s)*kk;if(hash(i,v,2)>fd*1.1)continue;for(let o=-th;o<=th;o++)pb(x+o*.5,y+o*.8,Math.abs(o)>th-1?RED:o<0?YEL:(i%4===0?RED:ORG),o<0)}}
 const x0=hx+28,L=196*kk,run=ease(Math.min(1,v/18)),xr=x0+L*run,cy=hy-2,HH=15*kk,end=v<62?0:(v-62)/24;
 if(end>=1)return;const xl=x0+L*end;
 for(let y=cy-HH-2|0;y<=cy+HH+2;y++)for(let x=xl|0;x<=xr;x++){const u=(x-x0)/L,lobe=1-.2*Math.pow(Math.sin(u*Math.PI*2),2)*(u>.25&&u<.75?1:0)-.1*Math.sin(u*TAU*1.5+1)*.5;
  let hh=HH*lobe;const capL=Math.min(1,(x-xl)/HH),capR=Math.min(1,(xr-x)/HH);hh*=Math.sqrt(Math.max(0,Math.min(capL*(2-capL),capR*(2-capR))));
  const dy=Math.abs(y-cy);if(dy>hh)continue;const edge=hh-dy;
  const n=vn(x*.13+e.seed,y*.2-v*.12)*.7+vn(x*.3,y*.4+v*.2)*.3;
  pb(x,y,edge<1.3?YEL:n>.58?WH:n>.48?PY:n>.41?YEL:n>.35?AMB:ORG,edge<1.3)}
 // 위쪽 불꽃 뾰족이(뒤)
 for(let n=0;n<14;n++){const x=x0+L*(n+.3+hash(n,4,4)*.4)/14;if(x<xl+4||x>xr-4)continue;const u=(x-x0)/L;tongue(pb,x,cy-HH*.8,(7+hash(n,v>>2,8)*11)*kk*(1-end),3.5,n*11,v)}
 // 남은 불티(왼쪽 바닥)
 for(let n=0;n<40;n++){const x=hx-40+hash(n,1,9)*90,y=hy-30+hash(n,2,9)*60+v*.1;if(hash(n,v>>3,4)<.7)pb(x,y,n%3?AMB:ORG,true)}
 if(v%10===2){e.id=idc++;hitArea(e.id,m=>m.x>xl&&m.x<xr&&Math.abs(m.y-cy)<HH+10,70*e.tier,.5,hx,cy,{burn:1,pi:3})}
 if(v===4)shake=e.tier>=3?6:3;for(let x=xl|0;x<xr;x+=3)heat(x,cy-HH-6,1)}

CUSTOM.dragon=e=>{const t=e.t,kk=.85+.15*e.tier;charge(e,t);burst(e,t,kk);coil(e,t,kk);carpet(e,t,kk);if(t===e.dur-1)hero.lean=0};
})();
