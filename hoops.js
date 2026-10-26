'use strict';
// 취엽비: 1) 몸 둘레에 연두빛 회오리 고리 2) 고리 원반 두 개가 적에게 날아감 3) 초록 가루를 끌며 적 사이를 돌진, 큰 연두 초승달 베기와 과녁 표식 4) 제자리로 돌아오며 흰 베기
(function(){
const c=hex,G1=c('#1f7a2a'),G2=c('#41d659'),G3=c('#9cff6a'),G4=c('#e6ffcc'),WH=c('#ffffff'),SL=c('#cfd8e6'),GR=c('#7a8496');
function rings(cx,cy,r,tilt,ph,a){const ct=Math.cos(tilt),st=Math.sin(tilt);
 for(let k=0;k<6;k++){const rr=r*(1-k*.09),stp=.5/Math.max(rr,4);for(let q=0;q<TAU;q+=stp){if(frac(q/TAU*(1+k)+ph*(k&1?-1:1))>(k<2?.94:.8))continue;if(a<1&&hash(q*90|0,k,frame>>1)>a)continue;
  const ex=Math.cos(q)*rr,ey=Math.sin(q)*rr*.55,x=cx+ex*ct-ey*st,y=cy+ex*st+ey*ct,P=Math.sin(q)>0?pv:pb;P(x,y,k===0?G3:k===1?G4:k===2?G3:G2,k<3);if(k===0)P(x,y+1,G2,false)}}
 // 안쪽 잎사귀 조각
 for(let n=0;n<6;n++){const q=n/6*TAU+ph*3,rr=r*(.3+.35*hash(n,2,7)),x=cx+Math.cos(q)*rr,y=cy+Math.sin(q)*rr*.5;if(a<1&&hash(n,frame,3)>a)continue;pv(x,y,G4,true);pv(x+1,y,G3,true);pv(x,y-1,G3,true);pv(x+1,y-1,G2);pv(x-1,y+1,G2)}}
function sigil(x,y,ph){for(const [r,col] of [[4,G4],[7,G3],[10,G2]])for(let q=0;q<TAU;q+=.6/r){if(r>4&&frac(q/TAU*4+ph*(r>7?1:-1))>.7)continue;pv(x+Math.cos(q)*r,y+Math.sin(q)*r*.9,col,true)}}

CUSTOM.hoops=e=>{const t=e.t,kk=.85+.15*e.tier,hx=hero.x,hy=hero.y,T=e.tier;
 // 1) 몸 둘레 회오리 고리
 if(t<26)rings(hx,hy-12,24*kk*ease(Math.min(1,t/6)),-.3,t*.05,t<20?1:1-(t-20)/6);
 // 2) 원반 두 개가 날아감
 const D=e.D||(e.D=[{tx:hx+72*kk,ty:hy-30},{tx:hx+60*kk,ty:hy+6}]);
 if(t>=16&&t<54){const p=ease(Math.min(1,(t-16)/20)),a=t<46?1:1-(t-46)/8;D.forEach((d,i)=>{const x=hx+(d.tx-hx)*p,y=hy-12+(d.ty-hy+12)*p-Math.sin(p*Math.PI)*10;rings(x,y,(18+4*p)*kk,-.2+i*.15,t*.06+i,a)});
  if(t===36){e.id=idc++;const hit=m=>D.some(d=>Math.hypot(m.x-d.tx,(m.y-12-d.ty)*1.6)<34*kk);for(const m of mobs)if(hit(m))m.sig=40;hitArea(e.id,hit,50*T,.8,hx,hy,{pi:5})}}
 // 3) 돌진: 초록 가루 꼬리, 큰 초승달
 const dashL=120*kk;
 if(t>=40&&t<80){const v=t-40,p=v<10?ease(v/10):v<26?1:1-ease((v-26)/14);hero.ox=dashL*p;hero.lean=2;
  const x1=hx+hero.ox,fd=v<30?1:1-(v-30)/10;for(let x=hx|0;x<x1;x++)for(let y=hy-22;y<=hy-6;y++){const f=(x-hx)/(x1-hx+1);if(hash(x,y,v>>1)<.32*f*fd)pv(x,y,f>.8?G3:hash(x,y,9)<.5?G2:G1,f>.85)}
  if(v>=8&&v<22){const q=Math.min(1,(v-8)/5),fd=v<16?1:1-(v-16)/6,cx=hx+dashL*.72,cy=hy-16;for(let a=-1.5;a<1.5;a+=.02){const f=(a+1.5)/3;if(f>q+.1||hash(a*50|0,v,1)>fd*1.15)continue;const r=30*kk,w=1+9*(1-Math.abs(a)/1.5);
    for(let o=0;o<w;o++){const x=cx+Math.cos(a)*(r-o)*.55,y=cy+Math.sin(a)*(r-o);pv(x,y,o<1.5?G2:o<w*.55?G3:o<w*.8?G4:WH,o>=w*.55)}}
   for(let n=0;n<6;n++){const y=hy-30+hash(n,v,4)*36,x0=hx+dashL*(.4+hash(n,1,4)*.5);for(let k=0;k<10;k++)pv(x0+k*2+v*2,y-k*.3,k<3?G4:G3,k<3)}}
  if(v===12){e.id=idc++;const hit=m=>m.x>hx+20&&m.x<hx+dashL+30&&Math.abs(m.y-hy)<40;for(const m of mobs)if(hit(m))m.sig=40;hitArea(e.id,hit,90*T,1.4,hx+dashL*.7,hy,{pi:5});shake=T>=3?5:3}}
 else hero.ox=0;
 // 4) 돌아와서 흰 베기
 if(t>=78&&t<90){const q=(t-78)/12;for(let a=-1.3;a<1.3;a+=.03){const f=(a+1.3)/2.6;if(f>q+.2||f<q-.6)continue;const w=1+6*(1-Math.abs(a)/1.3);for(let o=0;o<w;o++)pv(hx+6+Math.cos(a)*(18-o)*.85,hy-14+Math.sin(a)*(18-o),o<1.5?GR:o<w*.6?SL:WH,o>=w*.6)}}
 // 표식과 떨어지는 잎
 for(const m of mobs)if(m.sig){m.sig--;sigil(m.x,m.y-14,t*.05);pb(m.x,m.y+1,G2);for(let q=0;q<TAU;q+=.08)pb(m.x+Math.cos(q)*12,m.y+Math.sin(q)*4,m.sig>20?G3:G2,m.sig>20);if(m.sig%8===0)spark(m.x+(Math.random()-.5)*16,m.y-30,0,.35,30,5)}
 if(t===e.dur-1)hero.ox=0};
})();
