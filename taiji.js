'use strict';
// 태극인: 1) 몸에 푸른 불꽃 기운 2) 옆에 선 태극이 커지며 앞으로 날아가 적을 덮음 3) 발밑에 누운 태극 원판과 푸른 물결 고리 4) 큰 푸른 소용돌이 띠가 몸을 감싸 돈다
(function(){
const c=hex,K=c('#0c0c10'),DK=c('#33333d'),WH=c('#f4f6fa'),GY=c('#9ea4b4'),B1=c('#0c2a6e'),B2=c('#1a5ad8'),B3=c('#4aa8ff'),B4=c('#a8e0ff'),B5=c('#ffffff');
// 태극: sy<1이면 땅에 누운 모습
function taiji(cx,cy,r,rot,sy,P,spikes){const cs=Math.cos(rot),sn=Math.sin(rot),R2=r+(spikes?4:1);
 for(let y=cy-R2*sy-1|0;y<=cy+R2*sy+1;y++)for(let x=cx-R2-1|0;x<=cx+R2+1;x++){const dx=x-cx,dy=(y-cy)/sy,d=Math.hypot(dx,dy);
  if(d>r){if(spikes&&d<r+4){const a=Math.atan2(dy,dx);if(frac(a/TAU*16+rot*.5)<.18*(1-(d-r)/4))P(x,y,WH,true)}continue}
  if(d>r-1.2){P(x,y,DK);continue}
  const u=dx*cs+dy*sn,v=-dx*sn+dy*cs,h=r/2,top=Math.hypot(u,v+h),bot=Math.hypot(u,v-h);
  let w=top<r/6?false:bot<r/6?true:top<h?true:bot<h?false:u>0;
  P(x,y,w?(d>r-2.5?GY:WH):K,false)}}
function bflame(x,y,h,seed,t){for(let k=0;k<h;k++){const r=k/h,ww=2.2*(1-r)+.3,sw=(vn(seed+k*.2,t*.15)-.5)*3*r;for(let o=-ww;o<=ww;o++){const e=Math.abs(o)/(ww+.5);pb(x+sw+o,y-k,e<.3&&r<.4?B4:r<.6?B3:B2,e<.15&&r<.3)}}}
function band(cx,cy,rx,ry,th,ph,a){if(rx<2)return;for(let y=cy-ry-th|0;y<=cy+ry+th;y++)for(let x=cx-rx-th|0;x<=cx+rx+th;x++){const dx=(x-cx)/rx,dy=(y-cy)/ry,rr=Math.hypot(dx,dy),q=Math.atan2(dy,dx),bw=th/rx;
  if(Math.abs(rr-1)>bw)continue;const f=frac(q/TAU+ph);if(f>.8)continue;if(a<1&&hash(x,y,frame>>1)>a)continue;const P=dy>0?pv:pb,ed=Math.abs(rr-1)/bw;
  if(ed>.8){P(x,y,ed>.92?B3:B5,true);continue}const n=vn(x*.25+ph*20,y*.35);if(n>.62)P(x,y,B4,true);else if(n>.48)P(x,y,B3,n>.55);else P(x,y,(x+y)&1?B2:B1)}}
function swirl(cx,cy,rx,ry,tilt,ph,th,a){const ct=Math.cos(tilt),st=Math.sin(tilt),stp=.5/rx;
 for(let q=0;q<TAU;q+=stp){const f=frac(q/TAU*2+ph);if(f>.62)continue;const w=th*Math.sin(f/.62*Math.PI);if(a<1&&hash(q*80|0,1,frame>>1)>a)continue;
  for(let o=-w;o<=w;o+=.6){const ex=Math.cos(q)*(rx+o),ey=Math.sin(q)*(ry+o*.4),x=cx+ex*ct-ey*st,y=cy+ex*st+ey*ct,qn=Math.abs(o)/(w+.01),P=Math.sin(q)>0?pv:pb;P(x,y,qn<.25?B5:qn<.55?B4:qn<.8?B3:B2,qn<.55)}
  if(hash(q*40|0,ph*10|0,3)<.05)(Math.sin(q)>0?pv:pb)(cx+Math.cos(q)*(rx+th+3),cy+Math.sin(q)*(ry+th),B3,true)}}

CUSTOM.taiji=e=>{const t=e.t,kk=.85+.15*e.tier,hx=hero.x,hy=hero.y,T=e.tier;
 // 1) 푸른 불꽃 기운
 if(t<e.dur-6)for(let n=0;n<5;n++)bflame(hx-9+n*4.5,hy-4-(n&1)*8,14+hash(n,t>>2,3)*12,n*9,t);
 if(t%3===0)spark(hx+(Math.random()-.5)*14,hy-20,(Math.random()-.5)*.4,-.6,20,7);
 // 2) 옆에 선 태극 → 커지며 날아감
 if(t>=8&&t<58){const v=t-8,grow=v<20?0:ease(Math.min(1,(v-20)/12)),r=(9+35*grow)*kk,x=hx+16+22*grow*kk,y=hy-16-4*grow,fd=v<42?1:1-(v-42)/8;
  if(fd>.05)taiji(x,y,r*(v<4?v/4:1),-v*.12,1,(X,Y,col,g)=>{if(fd<1&&hash(X,Y,v)>fd*1.2)return;(grow>.3?pb:pv)(X,Y,col,g)},grow>.3);
  if(v<20)for(let q=0;q<TAU;q+=.05)pb(hx+Math.cos(q)*16,hy+1+Math.sin(q)*4,frac(q/TAU*6-v*.05)<.6?B3:B2,true);
  if(grow>.3)for(let n=0;n<4;n++){const a=hash(n,v,5)*TAU,rr=r+4+hash(n,v,6)*10;pv(x+Math.cos(a)*rr,y+Math.sin(a)*rr,n&1?B4:B3,true)}
  if(v===30||v===40){e.id=idc++;const hit=m=>Math.hypot(m.x-x,m.y-14-y)<r+8;hitArea(e.id,hit,70*T,1.6,x,y,{pi:7});shake=T>=3?5:3}}
 // 3) 누운 태극 원판 + 옆 물결 고리
 if(t>=56){const v=t-56,g=ease(Math.min(1,v/8)),fd=t<e.dur-14?1:(e.dur-t)/14;
  taiji(hx,hy+2,24*kk*g,v*.06,.32,(X,Y,col,gl)=>{if(fd<1&&hash(X,Y,v)>fd*1.2)return;pb(X,Y,col,gl)},false);
  if(v<40)for(let q=0;q<TAU;q+=.02)for(let o=0;o<3;o++){const rr=1+.08*vn(q*6,v*.2)+o*.06;if(hash(q*90|0,v>>1,o)>.75)continue;pb(hx+30*kk+Math.cos(q)*26*kk*g*rr,hy+6+Math.sin(q)*9*kk*g*rr,o===1?B4:frac(q/TAU*5+v*.04)<.5?B3:B2,o===1)}
  // 4) 큰 소용돌이 띠
  if(v>=14){const w=v-14,g2=ease(Math.min(1,w/10)),a=fd;
   band(hx+4,hy-2,70*kk*g2,22*kk*g2,9*kk,-w*.02,a);swirl(hx,hy-10,56*kk*g2,15*kk*g2,-.08,w*.03,3*kk,a);swirl(hx-2,hy-18,40*kk*g2,30*kk*g2,.5,w*.04+.6,2.5*kk,a);
   if(w===6||w===30){e.id=idc++;const hit=m=>Math.hypot(m.x-hx,(m.y-hy)*3)<80*kk;hitArea(e.id,hit,60*T,1.2,hx,hy,{pi:7})}}}};
})();
