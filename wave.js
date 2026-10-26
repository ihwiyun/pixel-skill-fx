'use strict';
// 단해: 1) 주인공을 감싸는 물기둥 고리 2) 뒤에서 솟아 앞으로 말려 덮치는 큰 파도 + 앞 바닥 빛 원판 3) 무너져 물웅덩이
(function(){
const c=hex,NAVY0=c('#06123a'),NAVY=c('#0b2a72'),BLUE=c('#1650b4'),MID=c('#2a78d8'),LITE=c('#69b8f4'),PALE=c('#bfe9ff'),FOAM=c('#f4fcff'),OUT=c('#040b26');

// 1) 물 사발: 주인공이 허리까지 잠긴 물기둥. 위는 소용돌이 물면 + 두꺼운 흰 거품 테, 바닥엔 넓은 파란 소용돌이 고리
function ringPhase(e,t,kk){
 const cx=hero.x,cy=hero.y,grow=ease(Math.min(1,t/9)),fade=t<20?1:clamp(1-(t-20)/8,0,1);if(fade<=0)return;
 const R=68*kk*grow,sy=.4,R2=R*1.1,lit=clamp((t-12)/14,0,1);
 // 바닥 고리
 for(let y=cy-R2*sy|0;y<=cy+R2*sy;y++)for(let x=cx-R2|0;x<=cx+R2;x++){
  const nx=(x-cx)/R,ny=(y-cy)/(R*sy),rr=Math.hypot(nx,ny),ang=Math.atan2(ny,nx);
  const rim=1+.06*(vn(ang*8+3,t*.25)-.5)*2;
  if(rr>rim){if(rr<rim+.07&&hash(x,y,t>>2)<.35)pb(x,y,lit>.5?LITE:BLUE,lit>.5);continue}
  if(hash(x,y,t>>1)>fade*1.15)continue;
  const sw=frac(ang/TAU*4+rr*2.2-t*.05),pos=rr/rim;
  let col;
  if(lit<.5)col=pos>.93?(hash(x,y,t>>2)<.5?LITE:MID):sw<.14?MID:pos>.75?BLUE:sw<.45?NAVY:BLUE;
  else col=pos>.9?(hash(x,y,t>>2)<.6?FOAM:PALE):pos>.74?(sw<.3?PALE:LITE):pos>.5?(sw<.2?LITE:MID):sw<.2?MID:BLUE;
  pb(x,y,col,lit>.5&&pos>.9)}
 // 물기둥(높이 Hw): 뒤 벽 → 윗물면 → (주인공) → 앞 벽
 const Rw=R*.62,Hw=10*kk*grow*fade;
 for(let x=cx-Rw|0;x<=cx+Rw;x++){const dx=(x-cx)/Rw;if(Math.abs(dx)>1)continue;const half=Math.sqrt(1-dx*dx)*Rw*sy;
  // 윗물면(위에서 본 물, 소용돌이 줄)
  for(let y=cy-half-Hw|0;y<=cy+half-Hw;y++){const ny=(y-(cy-Hw))/(Rw*sy),rr=Math.hypot(dx,ny),ang=Math.atan2(ny,dx);if(rr>1)continue;
   const sw=frac(ang/TAU*3-rr*1.5+t*.04),P=ny<0?pb:pv;P(x,y,rr>.9?(hash(x,y,t>>2)<.8?FOAM:PALE):rr>.84?PALE:sw<.18?LITE:sw<.5?MID:BLUE,false)}
  // 앞 벽(바깥 면): 거품 테 아래로 줄무늬 물
  const by=cy+half,top=by-Hw;
  for(let y=top|0;y<=by;y++){const k=by-y,s=frac(dx*1.6+k*.11-t*.06);pv(x,y,k>Hw-2?FOAM:k>Hw-4?PALE:Math.abs(dx)>.9?NAVY:s<.22?MID:k<3?NAVY:BLUE,false)}
  if(hash(x,t>>2,7)<.3)pv(x,top-2-hash(x,t,1)*5,FOAM,true)}
 // 앞쪽 물보라 자국(벽 앞 흩날림)
 for(let n=0;n<14;n++){const a=hash(n,t>>3,2)*Math.PI,r=Rw*(1+hash(n,1,2)*.2);pv(cx+Math.cos(a)*r,cy+Math.sin(a)*r*sy-hash(n,t>>2,3)*8,FOAM,true)}
 if(t===6)hitArea(e.id,m=>Math.hypot(m.x-cx,(m.y-cy)/sy)<R*1.1,40*e.tier,1.2,cx,cy,{pi:2});
}

// 2) 말리는 큰 파도(옆모습): 꼬리는 왼쪽, 말린 속(빈 곳)이 주인공 자리. 줄무늬는 말린 속을 둘러싼 동심원
function wavePhase(e,t,kk){
 const v=t-26;if(v<0)return;
 const rise=ease(clamp(v/14,0,1)),col=clamp((v-74)/20,0,1);
 const L=156*kk,Hh=80*kk,hcx=hero.x+4,bx=hcx-.8*L,by=hero.y+5;
 const Hx=.8*L,Hy=.34*Hh,rH=.25*Hh,crestX=.6*L,tipX=.92*L;
 const top=lx=>lx<0?-1:lx<=crestX?Hh*Math.pow(Math.sin(Math.PI/2*lx/crestX),1.5):lx<=tipX?Hh*(1-Math.pow((lx-crestX)/(tipX-crestX),2)*.5):-1;
 // 앞 바닥 빛 원판(적이 서 있는 곳). 가운데는 하늘색, 가장 밝은 건 고리
 const dg=ease(clamp((v-6)/20,0,1))*(1-col),dcx=hcx+86*kk,dcy=by-4,DR=96*kk*dg,dsy=.4;
 if(DR>2)for(let y=dcy-DR*dsy*1.2|0;y<=dcy+DR*dsy*1.2;y++)for(let x=dcx-DR*1.2|0;x<=dcx+DR*1.2;x++){
  const nx=(x-dcx)/DR,ny=(y-dcy)/(DR*dsy),rr=Math.hypot(nx,ny),ang=Math.atan2(ny,nx),rim=1+.07*(vn(ang*9,v*.2)-.5)*2;
  if(rr>rim){if(rr<rim+.14&&hash(x,y,v>>2)<.22)pb(x,y,rr<rim+.06?LITE:MID,false);continue}
  const sw=frac(ang/TAU*2-rr*1.2+v*.02),pos=rr/rim;
  const cc=pos<.3?(sw<.3?LITE:MID):pos<.55?(sw<.3?PALE:LITE):pos<.8?(sw<.4?FOAM:PALE):pos<.92?(sw<.3?PALE:LITE):(hash(x,y,v>>1)<.5?LITE:MID);
  pb(x,y,cc,pos>.6&&pos<.75&&sw<.4)}
 if(rise<=0)return;
 const hs=rise*(1-col);if(hs<=.03)return;
 for(let y=by-Hh*hs-3|0;y<=by;y++)for(let x=bx-2|0;x<=bx+tipX+2;x++){
  const lx=x-bx,ly=(by-y)/hs,tp=top(lx);if(ly<0||ly>=tp)continue;
  const d=Math.hypot(lx-Hx,ly-Hy);
  if(d<rH||lx>Hx&&ly<Hy)continue; // 말린 속(비어 있음)과 열린 앞
  const ed=tp-ly,lipF=lx>crestX?(lx-crestX)/(tipX-crestX):0,foamW=(5.5+5*Math.pow(Math.abs(Math.sin(lx*.21+v*.08)),.6))*kk*(1+lipF*1.2);
  let cc,g=false;
  if(ed<foamW){cc=ed>foamW-1.5&&hash(x,y,3)<.5?PALE:FOAM}else if(ed<foamW+2.5){cc=hash(x,y,v>>2)<.5?PALE:LITE}
  else if(d<rH+1.6)cc=MID; // 말린 속 테두리
  else{const wob=2.5*vn(lx*.09+3,ly*.09),st=frac((d-rH+wob)/8.5-v*.02),deep=clamp((d-rH)/(Hh*.9),0,1),brk=vn(lx*.3,ly*.3)>.72;
   cc=st<.17&&!brk?(deep<.45?LITE:MID):st<.26?MID:deep<.22?NAVY0:deep<.55?NAVY:BLUE;if(hash(x,y,v>>3)<.012)cc=PALE;
   if(ly<1.5)cc=OUT}
  pb(x,y,cc,g)}
 // 꼬리 윗선 거품 갈퀴(뒤로, 위로 뻗음)
 const cw=e.cw||(e.cw=Array.from({length:10},(_,i)=>({lx:crestX*(.14+i*.085),len:8+hash(i,4,4)*6,ph:hash(i,5,4)*TAU})));
 for(const q of cw){const tp=top(q.lx),px=bx+q.lx,py=by-tp*hs,ln=q.len*kk*(1-col)*(.8+.2*Math.sin(v*.25+q.ph));
  for(let u=-3;u<ln;u++){const r=Math.max(0,u)/ln,qx=px-u*.9,qy=py+3-u*.55+u*u*.1,w=Math.max(1,4.5*(1-r));for(let o=0;o<w;o++)pb(qx+o*.5,qy+o,o>=w-1.2&&w>2?PALE:FOAM)}}
 // 입술(말린 끝) 갈퀴: 앞으로 뻗다가 아래로 꺾여 늘어짐
 for(let j=0;j<7;j++){const lx=crestX+(tipX-crestX)*(.35+j*.1),tp=top(lx),px=bx+lx,py=by-tp*hs,ln=(5+j*1.2+hash(j,6,4)*3)*kk*(1-col);
  for(let u=0;u<ln;u++){const qx=px+u*.55*(1-u/ln),qy=py+u*.9,w=Math.max(1,3*(1-u/ln));for(let o=0;o<w;o++)pb(qx-o,qy,u>ln-2||o>=w-1&&w>1.5?PALE:FOAM)}}
 // 밑동 물거품(앞쪽 바닥)
 for(let x=bx+Hx-rH-6|0;x<bx+tipX+18;x++){for(let k=0;k<7;k++)if(hash(x,k,v>>2)<.6*(1-k/7)*(1-col*.8))pb(x,by-k,k<2?PALE:FOAM)}
 // 물보라 알갱이(꼭대기·입술에서 튐)
 const sp=e.sp||(e.sp=[]);
 if(v<70&&v%2===0||col>0&&col<.8)for(let n=0;n<(col>0?4:1+(e.tier>>1));n++){const lx=crestX*(.7+Math.random()*.55),tp=top(Math.min(lx,tipX));
  sp.push({x:bx+lx,y:by-tp*hs-2,vx:(Math.random()-.4)*1.2,vy:-.6-Math.random()*1,l:14+Math.random()*12,z:Math.random()<.2?2:1})}
 for(let i=sp.length-1;i>=0;i--){const q=sp[i];q.x+=q.vx;q.y+=q.vy;q.vy+=.05;q.l--;for(let a=0;a<q.z;a++)for(let b=0;b<q.z;b++)pv(q.x+a,q.y+b,q.l<8?PALE:FOAM,true);if(q.l<=0)sp.splice(i,1)}
 // 주인공: 말린 속에서 뛰어올라 벤다
 if(v>=10&&v<=50){const p=(v-10)/40;hero.jy=-Math.sin(p*Math.PI)*26;hero.lean=2}else hero.jy=0;
 if(v>=22&&v<32){const hx=hero.x+6,hy=hero.y+hero.jy-18,p=(v-22)/10;for(let a=-1.4;a<1.3;a+=.025){const r=20+Math.sin(a)*2,f=(a+1.4)/2.7;if(f>p+.15||f<p-.55)continue;const w=1+(1-Math.abs(a)/1.4)*3;for(let o=0;o<w;o++)pv(hx+Math.cos(a)*(r-o),hy+Math.sin(a)*(r-o),o<1?PALE:FOAM,true)}}
 if(v===16||v===40){e.id=idc++;const hit=m=>Math.hypot(m.x-dcx,(m.y-dcy)/dsy)<DR*1.05;for(const m of mobs)if(hit(m)){m.stun=70;m.splash=20}hitArea(e.id,hit,120*e.tier,1.6,hcx,dcy,{pi:2});shake=e.tier>=3?5:3}
 if(v===76){e.puX=hero.x+10;e.puY=hero.y+1;e.puR=L*.95}
}

// 3) 남는 물웅덩이(점점 마른다)
// 레퍼런스 마지막 장면: 주인공 발밑에 길고 납작한 물웅덩이(밝은 하늘색, 짙은 파란 테)
function puddle(e,t){if(!e.puX)return;const a=clamp(1-(t-110)/50,0,1),g=ease(clamp((t-96)/12,0,1));if(a<=0||g<=0)return;const R=e.puR*g,sy=.07;
 for(let y=e.puY-R*sy-1|0;y<=e.puY+R*sy+1;y++)for(let x=e.puX-R|0;x<=e.puX+R;x++){const nx=(x-e.puX)/R,ny=(y-e.puY)/(R*sy),rr=Math.hypot(nx,ny);
  if(rr>1||hash(x,y,5)>a*1.3)continue;pb(x,y,rr>.88?BLUE:ny<-.3&&hash(x,y,t>>3)<.3?PALE:rr>.7?MID:LITE,rr<.7)}}

CUSTOM.wave=e=>{const t=e.t,kk=.85+.15*e.tier;ringPhase(e,t,kk);wavePhase(e,t,kk);puddle(e,t);if(t===e.dur-1)hero.jy=0};
})();
