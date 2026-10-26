'use strict';
// 금륜진: 1) 금빛 기둥·반짝이와 은빛 초승달 베기 2) 반짝이가 앞으로 쏟아짐 3) 적마다 보라·금 고리가 감기고 금빛 표식 4) 주인공을 중심으로 보라·금 줄로 된 큰 천구(지구본 같은 고리 공)
(function(){
const c=hex,G1=c('#7a4a08'),G2=c('#d89a1e'),G3=c('#ffd34d'),G4=c('#fff2a8'),WH=c('#fffdf0'),P1=c('#3a1a7a'),P2=c('#7a4ae0'),P3=c('#b89aff'),P4=c('#ece4ff'),SL=c('#cfd6e2'),SD=c('#6a7284');
const plus=(x,y,col,big,P)=>{P=P||pv;P(x,y,col,true);if(big){P(x+1,y,col,true);P(x-1,y,col,true);P(x,y+1,col,true);P(x,y-1,col,true)}};
// 타원 줄(점선 가능). 위쪽 절반(뒤)은 캐릭터 뒤, 아래쪽 절반(앞)은 앞
function oval(cx,cy,rx,ry,tilt,col,hi,w,dash,ph,fade){const ct=Math.cos(tilt),st=Math.sin(tilt),stp=.7/Math.max(rx,ry,4);
 for(let a=0;a<TAU;a+=stp){if(dash&&frac(a/TAU*dash+ph)>.6)continue;if(fade&&hash(a*99|0,ph*9|0,2)>fade)continue;const ex=Math.cos(a)*rx,ey=Math.sin(a)*ry,x=cx+ex*ct-ey*st,y=cy+ex*st+ey*ct,front=Math.sin(a)>0,P=front?pv:pb;
  P(x,y,front?hi:col,front);if(w>1)P(x,y+1,col,false)}}
function pillar(hx,hy,a){for(let y=hy-34;y<=hy+1;y++){const k=(hy-y)/34,wd=(8+2.5*vn(y*.3,frame*.15))*(k>.75?Math.max(0,1-(k-.75)*3.2):1);for(let x=hx-wd|0;x<=hx+wd;x++){const e=Math.abs(x-hx)/(wd+.1);pa(x,y,e<.3?WH:e<.6?G4:G3,a*(1-e*.6))}}}
function glyph(x,y,s){for(let a=0;a<TAU;a+=.12)pv(x+Math.cos(a)*6,y+Math.sin(a)*6,G3,true);for(let k=-7;k<=7;k++){pv(x+k,y,G4,true);pv(x,y+k,G4,true)}
 for(let a=-1;a<1.2;a+=.08)for(let o=0;o<2;o++)pv(x+2+Math.cos(a)*(8-o)*s,y-2+Math.sin(a)*(8-o)*s,o?WH:G3,true)}

CUSTOM.sphere=e=>{const t=e.t,kk=.85+.15*e.tier,hx=hero.x,hy=hero.y,T=e.tier,cx=hx,cy=hy-16;
 // 금빛 기둥과 몸 주변 반짝이(내내)
 const pa0=t<8?t/8:t>e.dur-14?(e.dur-t)/14:1;pillar(hx,hy,.55*pa0);
 for(let n=0;n<3;n++){const a=hash(n,t,1)*TAU,r=6+hash(n,t,2)*10;plus(hx+Math.cos(a)*r,hy-14+Math.sin(a)*r*1.4,hash(n,t,3)<.5?G4:G3,hash(n,t,4)<.3)}
 // 발밑 금빛 고리
 oval(hx,hy+1,16,4,0,G2,G3,1,8,-t*.02,pa0);
 // 1) 은빛 초승달 베기
 if(t>=4&&t<14){const p=(t-4)/10;for(let a=-1.3;a<1.3;a+=.03){const f=(a+1.3)/2.6;if(f>p+.2||f<p-.7)continue;const r=16,w=1+3*(1-Math.abs(a)/1.3);for(let o=0;o<w;o++)pv(hx+8+Math.cos(a)*(r-o)*.7,hy-14+Math.sin(a)*(r-o),o<1?SD:o<w-1?SL:WH,o>=w-1)}}
 // 2) 앞으로 쏟아지는 금빛 반짝이
 if(t>=10&&t<44){const sp=e.sp||(e.sp=[]);for(let n=0;n<5+T;n++)sp.push({x:hx+8,y:hy-16,vx:1.2+Math.random()*2.4,vy:(Math.random()-.5)*1.4,l:30+Math.random()*20});}
 if(e.sp)for(let i=e.sp.length-1;i>=0;i--){const q=e.sp[i];q.x+=q.vx;q.y+=q.vy;q.vx*=.97;q.vy*=.97;q.l--;plus(q.x,q.y,q.l>20?G4:G3,(q.l>>2&1)&&q.l>12);if(q.l<=0)e.sp.splice(i,1)}
 // 3) 적마다 감기는 보라·금 고리 + 표식
 if(t>=30&&t<74){const v=t-30,g=ease(Math.min(1,v/8)),fd=v<34?1:1-(v-34)/10;
  for(const m of mobs){if(Math.hypot(m.x-hx,(m.y-hy)*1.4)>130*kk)continue;const r=22*g,ph=v*.03+m.seed,tl=.3*Math.sin(m.seed);
   for(let o=0;o<3;o++)oval(m.x,m.y-12,r-o,(r-o)*.5,tl,o===1?P3:P2,o===1?P4:P3,1,0,ph,fd);oval(m.x,m.y-12,r+4,r*.5+2,tl,G2,G3,1,12,ph,fd);
   for(let n=0;n<6;n++){const a=hash(n,v,m.seed*7|0)*TAU;plus(m.x+Math.cos(a)*r,m.y-12+Math.sin(a)*r*.5,n&1?P4:WH,n===0,Math.sin(a)>0?pv:pb)}
   for(let n=0;n<2;n++)plus(m.x+(hash(n,v,m.seed*9|0)-.5)*r*2.4,m.y-12+(hash(n,v+1,m.seed*9|0)-.5)*r,n?P4:G4,false)}
  // 고리 사이를 잇는 큰 보라 곡선
  oval(hx+70*kk,hy-20,90*kk*g,38*kk*g,-.35,P2,P3,2,0,v*.02,fd*.9);
  if(v===6){e.id=idc++;const hit=m=>Math.hypot(m.x-hx,(m.y-hy)*1.4)<130*kk;for(const m of mobs)if(hit(m)){m.glyph=34;m.shield=40}hitArea(e.id,hit,60*T,.4,hx,hy,{pi:3})}}
 // 4) 큰 천구: 세로 경선 4줄(돌아감) + 가로 위선 3줄
 if(t>=72&&t<130){const v=t-72,g=ease(Math.min(1,v/10)),fd=v<44?1:1-(v-44)/14,R=100*kk*g;
  for(let k=0;k<4;k++){const ph=k/4*Math.PI+v*.025,rx=Math.abs(Math.cos(ph))*R+1;oval(cx,cy,rx,R*.82,0,k&1?P2:G2,k&1?P4:G4,k&1?2:1,k===3?14:0,v*.01,fd)}
  for(const [yy,col,hi] of [[0,G2,G4],[-.45,P2,P3],[.45,P2,P3]]){const rx=R*Math.sqrt(1-yy*yy);oval(cx,cy+yy*R*.82,rx,rx*.28,0,col,hi,col===P2?2:1,0,0,fd)}
  oval(cx,cy,R,R*.82,0,G2,G4,1,0,0,fd);
  if(v===8||v===28){e.id=idc++;const hit=m=>Math.hypot(m.x-cx,(m.y-12-cy)/.82)<R;for(const m of mobs)if(hit(m)){m.glyph=30;m.shield=40}hitArea(e.id,hit,90*T,1.2,cx,cy,{pi:3});shake=T>=3?5:3}}
 for(const m of mobs)if(m.glyph){m.glyph--;glyph(m.x,m.y-14,1)}

 if(t===e.dur-1)e.sp=null};
})();
