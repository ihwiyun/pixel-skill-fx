'use strict';
// 홍련검: 주인공이 검은 연기 그림자 모습이 되어 1) 분홍 초승달 베기 두 번 2) 길게 뻗는 분홍 찌르기 3) 몸을 감싸는 분홍 소용돌이 폭발. 맞은 적 위엔 깨진 방패
(function(){
const c=hex,DR=c('#2a0a12'),MAG=c('#a3123e'),PNK=c('#e2285a'),LPK=c('#ff7aa6'),PL=c('#ffc8da'),WH=c('#fff6f9'),S1=c('#140e10'),S2=c('#2a1c1a'),S3=c('#4a302a'),EYE=c('#ff2a3a');
const SHADOW={};for(const k in SC)SHADOW[k]=k==='e'?EYE:k==='o'?S1:k==='s'||k==='S'?S3:S2;
const pink=q=>q<.2?WH:q<.4?PL:q<.65?LPK:q<.85?PNK:MAG; // q: 가운데 0 → 가장자리 1

// 초승달 베기: 타원 궤도를 따라 앞끝이 달리고 뒤로 꼬리가 남는다
function crescent(cx,cy,rx,ry,tilt,a0,a1,head,len,th,P){const ct=Math.cos(tilt),st=Math.sin(tilt),dir=Math.sign(a1-a0);
 for(let k=0;k<len;k+=.012){const a=head-dir*k;if((a-a0)*dir<0)break;const f=1-k/len,w=th*Math.sin(Math.min(1,f*1.3)*Math.PI*.5)*(.4+.6*f);
  const ex=Math.cos(a)*rx,ey=Math.sin(a)*ry,x=cx+ex*ct-ey*st,y=cy+ex*st+ey*ct,nx=Math.cos(a)*ct-Math.sin(a)*st,ny=Math.cos(a)*st+Math.sin(a)*ct;
  const PP=P||(y<cy?pb:pv);for(let o=-w;o<=w;o+=.5){const q=Math.abs(o)/(w+.01);PP(x+nx*o,y+ny*o,pink(q*(1.15-f*.3)),q<.35)}
  if(f>.25){const o2=w+2.5+f*2;PP(x+nx*o2,y+ny*o2,f>.6?PL:LPK,true);PP(x-nx*(w+2),y-ny*(w+2),PNK)}
  if(hash(k*500|0,head*99|0,3)<.08)(P||pv)(x+nx*(w+2+hash(k*9|0,1,1)*4),y+ny*(w+2),LPK,true)}}

function smoke(x,y,r,t,seed,P){for(let yy=y-r|0;yy<=y+r;yy++)for(let xx=x-r*2.2|0;xx<=x+r*2.2;xx++){const d=Math.hypot((xx-x)/2.2,yy-y),e=r*(.55+.55*vn(xx*.12+seed+t*.15,yy*.5));if(d>e)continue;if(d>e*.8&&((yy+(t>>1))&1))continue;(P||pb)(xx,yy,d<e*.65?S1:d<e*.9?S2:S3)}}

CUSTOM.lotus=e=>{const t=e.t,kk=.85+.15*e.tier,hx=hero.x,hy=hero.y,T=e.tier;
 hero.pal=t<e.dur-4?SHADOW:null;
 // 그림자 연기(몸 뒤로 끌림)
 if(t<70){const st=t>28&&t<58?1.6:1;for(let n=0;n<6;n++)smoke(hx-6-n*8*st,hy-13+(n&1)*4-n*.5,(10-n)*1.1*kk,t,n*7)}
 // 1) 초승달 베기 두 번
 const cx=hx+6,cy=hy-14;
 if(t>=4&&t<20){const p=ease((t-4)/10);crescent(cx,cy,30*kk,20*kk,-.35,-2.6,3.2,-2.6+5.8*p,4.6,5.5*kk,null)}
 if(t>=12&&t<30){const p=ease((t-12)/10);crescent(cx+2,cy+2,34*kk,24*kk,.45,1.4,-4.6,1.4-6*p,4.8,6*kk,null);
  if(t<26)for(let k=0;k<1;k+=.04){const a=1.4-4.2*p+k*1.6,x=cx+Math.cos(a)*30*kk,y=cy+Math.sin(a)*18*kk;smoke(x,y,2.5,t,k*40)}}
 if(t===9||t===18){e.id=idc++;const hit=m=>Math.hypot(m.x-cx,(m.y-hy)*1.5)<46*kk;for(const m of mobs)if(hit(m))m.shield=40;hitArea(e.id,hit,60*T,1,cx,cy,{pi:1})}
 // 2) 찌르기 빛줄기
 if(t>=30&&t<58){const v=t-30,len=Math.min(1,v/4)*112*kk,x0=hx+10,y0=hy-13,fd=v<20?1:1-(v-20)/8,th=5*kk*fd;
  for(let s=0;s<len;s+=.5){const r=s/len,w=th*(r<.72?.25+.75*r/.72:(1-r)/.28)*(.85+.15*Math.sin(s*.3+v));const x=x0+s,y=y0+s*.06;
   for(let o=-w;o<=w;o+=.5){const q=Math.abs(o)/(w+.01);pv(x,y+o,pink(q),q<.45)}
   if(hash(s|0,v,4)<.12*fd*r)pv(x+hash(s|0,v,5)*6,y+(hash(s|0,v,6)-.5)*w*5,hash(s|0,v,7)<.5?LPK:PNK,true)}
  for(let n=0;n<4;n++){const yy=y0+(n-1.5)*5;if(hash(n,v>>1,8)<.5)for(let s=0;s<len*.7;s++)if(hash(s>>3,n,v)<.4)pv(x0+20+s,yy+s*.06,n&1?PNK:MAG)}
  if(v%6===2){e.id=idc++;const hit=m=>m.x>x0&&m.x<x0+len&&Math.abs(m.y-14-(y0+(m.x-x0)*.06))<14;for(const m of mobs)if(hit(m))m.shield=40;hitArea(e.id,hit,45*T,.6,x0,y0,{pi:1})}
  if(v===2)shake=T>=3?5:3}
 // 짧은 붉은 칼날 빛(찌르기 끝)
 if(t>=54&&t<66){const p=(t-54)/12;for(let k=0;k<16;k++)pv(hx+6+k*1.1,hy-20-k*.45-p*4,k>12?LPK:k&1?PNK:WH,true)}
 // 3) 분홍 소용돌이 폭발(비치는 세포 무늬, 밝은 테두리)
 if(t>=64){const v=t-64,g=ease(Math.min(1,v/8)),fd=v<22?1:clamp(1-(v-22)/12,0,1),RX=54*kk*g,RY=40*kk*g,ox=hx+4,oy=hy-14;if(fd>0){
  for(let y=oy-RY*1.15|0;y<=oy+RY*1.15;y++)for(let x=ox-RX*1.15|0;x<=ox+RX*1.15;x++){const nx=(x-ox)/RX,ny=(y-oy)/RY,rr=Math.hypot(nx,ny),ang=Math.atan2(ny,nx),rim=1+.06*(vn(ang*8,v*.3)-.5)*2;
   if(rr>rim+.08)continue;
   if(rr>rim-.1){const P=ny>.2?pv:pb;if(rr>rim){if(hash(x,y,v>>1)<.4*fd)P(x,y,LPK,true)}else P(x,y,rr>rim-.04?WH:PL,true);continue}
   const n=vn(x*.22+e.seed,y*.22-v*.08)*.65+vn(x*.5,y*.5+v*.1)*.35,sw=frac(ang/TAU*2+rr*1.2-v*.03);
   if(sw<.07)pa(x,y,MAG,.7*fd);else if(n>.62)pa(x,y,n>.7?PL:LPK,.8*fd);else if(n>.5)pa(x,y,PNK,.65*fd);else pa(x,y,PNK,(.35+.3*rr)*fd)}
  if(v===4){e.id=idc++;const hit=m=>Math.hypot(m.x-ox,(m.y-14-oy)*RX/RY)<RX*1.1;for(const m of mobs)if(hit(m))m.shield=40;hitArea(e.id,hit,110*T,1.8,ox,oy,{pi:1});shake=T>=3?6:4}}}

 if(t===e.dur-1)hero.pal=null};
})();
