'use strict';
// 인물 그림(키 48픽셀, 레퍼런스 인물 크기). 부위(머리·몸통·팔·다리·무기)를 자리 잡아 칠한 뒤
// 위·왼쪽 가장자리는 밝게, 아래·오른쪽은 어둡게 칠하고 바깥 테두리를 둘러 문자 그림으로 만든다. 오른쪽을 보는 모습
// 글자: o 테두리 · h/H/j 머리카락 · s/t/S 피부 · e 눈 · r/L/R 옷 · p/q/P 바지 · k 신발 · a/A/z 띠·목도리 · c/C/d 흰 천 · b 허리띠 · w 나무 · W 쇠
const CH=(function(){
const GW=28,GH=48;
const SHADE={r:['L','R'],s:['t','S'],h:['H','j'],p:['q','P'],a:['A','z'],c:['C','d']};
function rig(){const g=new Array(GW*GH).fill('.');const R={g,ox:0,
 set(x,y,c){x=Math.floor(x+R.ox);y=Math.floor(y);if(x>=0&&y>=0&&x<GW&&y<GH)g[y*GW+x]=c},
 ell(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++)if(((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1)R.set(x,y,c)},
 cap(x0,y0,x1,y1,r,c){const n=Math.ceil(Math.hypot(x1-x0,y1-y0)*2)+1;for(let i=0;i<=n;i++){const t=i/n;R.ell(x0+(x1-x0)*t,y0+(y1-y0)*t,r,r,c)}},
 poly(p,c){for(let y=0;y<GH;y++){const xs=[];for(let i=0;i<p.length;i++){const [x0,y0]=p[i],[x1,y1]=p[(i+1)%p.length];if((y+.5>=y0)!==(y+.5>=y1))xs.push(x0+(y+.5-y0)/(y1-y0)*(x1-x0))}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.ceil(xs[k]-.5);x<=xs[k+1]-.5;x++)R.set(x,y,c)}},
 rect(x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)R.set(x+i,y+j,c)}};return R}
function finish(R){const g=R.g,at=(x,y)=>x<0||y<0||x>=GW||y>=GH?'.':g[y*GW+x],out=g.slice();
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){const c=g[y*GW+x],sh=SHADE[c];if(!sh)continue;
  if(at(x,y-1)!==c||at(x-1,y)!==c)out[y*GW+x]=sh[0];else if(at(x,y+1)!==c&&at(x,y+1)!=='.'||at(x+1,y)!==c||at(x,y+1)==='.')out[y*GW+x]=sh[1]}
 const fin=out.slice();for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){if(out[y*GW+x]!=='.')continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const v=x+dx<0||y+dy<0||x+dx>=GW||y+dy>=GH?'.':out[(y+dy)*GW+x+dx];return v!=='.'&&v!=='o'}))fin[y*GW+x]='o'}
 const rows=[];for(let y=0;y<GH;y++)rows.push(fin.slice(y*GW,y*GW+GW).join(''));return rows}
// 달리는 다리: f=0/1 두 장이 번갈아
function runLegs(R,f){const a=f?[[16,31,20,38,23,45],[12,31,9,38,5,43]]:[[16,31,18,38,18,46],[12,31,11,38,9,46]];
 for(const [x0,y0,x1,y1,x2,y2] of a){R.cap(x0,y0,x1,y1,2.4,'p');R.cap(x1,y1,x2,y2,2,'p');R.ell(x2+1,y2,2.6,1.6,'k')}}
function head(R,hair,bald){R.rect(13,14,4,3,'s');R.ell(15,9,5.8,6.2,'s');if(!bald){R.ell(13.5,7.2,6.6,5.8,'h');R.ell(17.6,10.6,4,4.1,'s');R.set(17,6,'h');R.set(18,6,'h');R.set(16,7,'h');R.set(19,6,'h');R.set(20,7,'h');R.set(18,7,'h');R.cap(14.5,8,14.5,12,.8,'h');R.set(10,2,'h');R.set(13,1,'h');R.set(16,2,'h')}
 R.set(19,10,'e');R.set(19,11,'e');R.set(16,10,'e');R.set(16,11,'e');R.set(12,10,'S');R.set(12,11,'S')}
const SP={};
// 주인공: 검은 머리 묶음, 어두운 도포에 금 허리띠, 흰 깃. 칼은 따로 그린다(손: 23,23)
SP.hero=(()=>{const R=rig();R.cap(12,31,8,45,2.3,'p');R.cap(16,31,21,45,2.3,'p');R.ell(8,46,2.8,1.6,'k');R.ell(22,46,2.8,1.6,'k');
 R.poly([[9,24],[19,24],[22,37],[7,37]],'r');R.poly([[9,16],[19,16],[20,26],[8,26]],'r');R.rect(8,25,13,2,'b');
 R.cap(12,16,14,20,.8,'c');R.cap(16,16,14,20,.8,'c');R.cap(10,18,7,26,1.9,'r');R.ell(7,27,1.6,1.6,'s');R.cap(18,18,22,23,1.9,'r');R.ell(23,23,1.7,1.7,'s');
 head(R);R.cap(8,5,4,12,1.5,'h');R.set(8,5,'b');R.set(8,6,'b');return finish(R)})();
// 적 4종(두 장씩): 승려(곤봉), 머리띠 권법가, 녹색 목도리 검객, 회색 단봉
const MOB=[f=>{const R=rig();runLegs(R,f);R.ox=2;R.poly([[9,16],[19,16],[21,30],[8,30]],'r');R.poly([[8,27],[21,27],[23,35],[7,35]],'r');R.rect(8,27,14,2,'b');
  R.cap(11,19,17,24,1.8,'r');R.cap(18,19,22,22,1.8,'r');R.cap(1,31,27,13,.7,'w');R.ell(17,24,1.6,1.6,'s');R.ell(22,22,1.6,1.6,'s');head(R,0,1);R.set(9,9,'S');return finish(R)},
 f=>{const R=rig();runLegs(R,f);R.ox=2;R.poly([[9,16],[19,16],[20,30],[8,30]],'r');R.rect(8,28,13,2,'b');R.cap(10,18,7,25,1.9,'s');R.cap(18,18,23,21,1.9,'s');R.rect(6,24,3,2,'c');R.rect(22,20,2,3,'c');R.ell(7,26,2,2,'s');R.ell(24,21,2.1,2.1,'s');
  head(R);R.rect(8,5,13,2,'a');R.cap(8,6,4,10,1,'a');return finish(R)},
 f=>{const R=rig();runLegs(R,f);R.ox=2;R.poly([[9,16],[19,16],[21,32],[7,32]],'c');R.rect(8,27,13,2,'b');R.cap(10,18,8,26,1.9,'c');R.cap(18,18,20,26,1.9,'c');R.ell(20,27,1.6,1.6,'s');R.ell(8,27,1.6,1.6,'s');
  R.cap(19,27,27,33,.6,'W');head(R);R.ell(12,2,2,1.8,'h');R.cap(10,15,19,16,1.6,'a');R.cap(10,16,4,22,1.3,'a');return finish(R)},
 f=>{const R=rig();runLegs(R,f);R.ox=2;R.poly([[9,16],[19,16],[20,31],[8,31]],'r');R.rect(8,26,13,2,'b');R.cap(10,18,8,25,1.9,'r');R.cap(18,18,19,24,1.9,'r');R.ell(19,25,1.6,1.6,'s');R.ell(8,26,1.6,1.6,'s');
  R.cap(15,30,24,14,.8,'w');head(R);R.ell(10,4,2,2,'h');return finish(R)}].map(fn=>[fn(0),fn(1)]);
const base={o:'#140c10',h:'#2a1c22',H:'#4c3640',j:'#160e12',s:'#e8b58c',t:'#f8d2ac',S:'#b07a58',e:'#140c10',r:'#3a2c2a',L:'#5a4640',R:'#221818',p:'#2a2430',q:'#3c3644',P:'#18141c',k:'#141016',a:'#8a2a2a',A:'#b8463e',z:'#5a1818',c:'#e0d8c8',C:'#fffaf0',d:'#a8a090',b:'#d8b04a',w:'#8a5a2c',W:'#dfe6f0'};
const PAL=[{r:'#c8862e',L:'#eaae52',R:'#8a5a1c',p:'#6a5a4a',q:'#8a7a66',P:'#463a2e',k:'#2a2018',b:'#5a3418'},
 {h:'#1c1416',a:'#c0302a',A:'#e0544a',z:'#7a1a18',r:'#6a4a32',L:'#8a6648',R:'#44301e',p:'#3a2e2a',q:'#544640',P:'#241c1a',c:'#d8cbb0',b:'#3a2418'},
 {r:'#d8d4c8',c:'#d8d4c8',C:'#f4f0e6',d:'#a8a296',a:'#3a7a4a',A:'#5aa26a',z:'#22502e',p:'#5a5a60',q:'#74747a',P:'#3a3a40',b:'#4a4a50'},
 {r:'#6a5848',L:'#86725e',R:'#46382c',p:'#4a3e36',q:'#5e5048',P:'#2e2620',b:'#2e2420',w:'#7a5230'}].map(o=>Object.assign({},base,o));
return {hero:SP.hero,mobs:MOB,heroPal:base,mobPal:PAL}})();
