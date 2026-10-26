'use strict';
// 금륜진(이펙트 도구로 만든 판): 레퍼런스를 베끼지 않고 층 구성·시간만 도구 설정으로 짰다.
// 1) 발밑 금빛 마법진 + 몸의 금 불꽃 기운  2) 베기 두 번(흰 심 금 궤적) → 섬광·커지며 얇아지는 금 고리·불똥 → 적 피해
// 3) 보라 빛이 몸으로 빨려 들어 모임  4) 앞으로 긴 찌르기 빛줄기 → 맞은 적마다 작은 보라 고리  5) 마지막 큰 금 고리와 떠오르는 금가루
(function(){
CUSTOM.sphere=e=>{const t=e.t,k=.85+.15*e.tier,T=e.tier,hx=hero.x,hy=hero.y,fol=()=>[hero.x,hero.y];
 if(t===0){
  VFX.add({ty:'circle',x:hx,y:hy,dur:e.dur-4,ramp:'gold',p0:[34*k,.36,.012,24],size:[90*k,40*k],follow:fol});
  VFX.add({ty:'flame',x:hx,y:hy,dur:e.dur-10,ramp:'gold',glow:1,al:.8,p0:[17,34,1.6,1.8],p1:[1],size:[36,100],follow:()=>[hero.x,hero.y]})}
 // 베기 두 번: 칼을 치켜들었다가 내려벤다
 hero.sa=t<6?-1.2+2.1*t/6:t<14?.9:t<20?-1.2+2.1*(t-14)/6:t<28?.9:t<44?undefined:t<70?-.2-(t-44)*.02:t<92?0:undefined;
 for(const[s,dir]of[[4,1],[16,-1]])if(t===s){
  VFX.add({ty:'slash',x:hx+6,y:hy-22,dur:16,ramp:'white',glow:1,p0:[24*k,5*k,dir>0?-2.3:1.1,dir>0?1.1:-2.3],p1:[.75,2.6,dir],size:[70*k,60*k]});
  VFX.add({ty:'slash',x:hx+6,y:hy-22,dur:18,ramp:'gold',p0:[28*k,4*k,dir>0?-2.2:1.0,dir>0?1.0:-2.2],p1:[.75,2.4,dir],size:[80*k,70*k]})}
 if(t===8||t===20){const x=hx+18,y=hy-18,R=(t===8?110:150)*k;
  VFX.add({ty:'flash',x,y,dur:8,ramp:'gold',glow:1,p0:[4,14*k,8,.5],size:[40,40]});
  VFX.add({ty:'ring',x:hx,y:hy-10,dur:28,ramp:'gold',glow:1,p0:[10,R,6*k,1],p1:[.6,1.2],size:[2.3*R,1.5*R]});
  VFX.burst({x,y,n:24+8*T,spd:2.6,grav:.05,drag:.95,life:26,ramp:'gold',glow:1});
  e.id=idc++;hitArea(e.id,m=>Math.hypot(m.x-hx,(m.y-hy)/.6)<R,40*T,1,hx,hy,{pi:3});shake=3}
 // 모으기: 보라 빛이 바깥에서 몸으로 빨려 듦
 if(t===40)VFX.burst({x:hx,y:hy-20,n:40+10*T,spd:2,implode:14,life:20,ramp:'purple',glow:1,sq:.7});
 if(t===46)VFX.add({ty:'ring',x:hx,y:hy-20,dur:22,ramp:'purple',glow:1,p0:[60*k,6,3,1],p1:[.7,0],size:[140*k,100*k]});
 // 찌르기
 if(t===70){const x=hx+12,y=hy-22;
  VFX.add({ty:'beam',x,y,dur:20,ramp:'gold',glow:1,p0:[160*k,6*k],size:[340*k,30]});
  VFX.add({ty:'beam',x,y,dur:16,ramp:'white',p0:[150*k,2.5],size:[320*k,12]});
  VFX.add({ty:'flash',x,y,dur:10,ramp:'white',glow:1,p0:[3,18*k,4,.2],size:[50,50]});
  VFX.burst({x,y,n:30,spd:3.4,dir:0,spread:.5,drag:.93,life:22,ramp:'gold',glow:1});
  e.id=idc++;const hit=m=>m.x>hx&&Math.abs(m.y-14-y)<22*k;hitArea(e.id,hit,90*T,2.2,hx,hy,{pi:7});shake=5;
  for(const m of mobs)if(hit(m))VFX.add({ty:'ring',x:m.x,y:m.y-18,dur:20,ramp:'purple',glow:1,delay:4,p0:[3,22,4,1],p1:[.7,0],size:[60,40]})}
 // 마지막 큰 고리와 떠오르는 금가루
 if(t===100){VFX.add({ty:'flash',x:hx,y:hy-20,dur:12,ramp:'gold',glow:1,p0:[6,30*k,10,.6],size:[80,80]});
  VFX.add({ty:'ring',x:hx,y:hy-6,dur:36,ramp:'gold',glow:1,p0:[16,190*k,8*k,1],p1:[.55,1.5],size:[420*k,240*k]});
  VFX.add({ty:'ring',x:hx,y:hy-6,dur:30,ramp:'white',delay:4,p0:[12,150*k,3,1],p1:[.55,1],size:[340*k,200*k]});
  VFX.burst({x:hx,y:hy-20,n:50+10*T,spd:3,grav:.04,drag:.96,life:34,ramp:'gold',glow:1});
  e.id=idc++;hitArea(e.id,m=>Math.hypot(m.x-hx,(m.y-hy)/.55)<190*k,70*T,2,hx,hy,{pi:3});shake=T>=3?7:5}
 if(t>100&&t<140&&t%3===0)VFX.burst({x:hx+(Math.random()-.5)*60*k,y:hy-4,n:2,spd:.5,dir:-Math.PI/2,spread:.6,grav:-.01,drag:.99,life:40,ramp:'gold',glow:1});
 if(t===e.dur-1)hero.sa=undefined};
})();
