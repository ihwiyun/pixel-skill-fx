'use strict';
// 이펙트 도구(VFX): 이펙트를 층(섬광·고리·베기·불꽃 기운·마법진·빛줄기·입자)으로 쌓아 Three.js로 그린다.
// 게임 화면 1칸 = 1픽셀인 작은 화면(480x270)에 그리고, 세기를 색 램프 4단계로 끊어 도트로 만든 뒤 가까운 칸 색으로 키운다.
// 빛 번짐은 glow 표시한 층만 따로 모아 흐리게 더한다. 방법과 출처: 옵시디언 04_지식 「도트 스킬 이펙트(VFX) 만드는 방법」
// 화면 좌표는 아래로 갈수록 y가 커지게(카메라 위=0) 맞춰서, 판이 뒤집혀 보이므로 양면으로 그린다
const VFX=(function(){
const W=480,H=270;
let R,cam,scene,gscene,rtA,rtG,rtB1,rtB2,post,blurM,quad,qscene,qcam,cvs,on=false;
const layers=[],parts=[];
const RAMP={ // 어둠 → 본색 → 밝음 → 흰 심
 gold:['#6a3a10','#d08a1c','#ffd24a','#fff6d0'],white:['#5a6a8a','#b8c8e8','#eef4ff','#ffffff'],
 purple:['#3a1468','#7a3ad8','#c08cff','#f4e4ff'],blue:['#0c2a6e','#1a6ad8','#5ab8ff','#e8f8ff'],
 fire:['#6a1408','#d8401a','#ffa030','#fff0b0'],crimson:['#4a0818','#b0182e','#ff4a5a','#ffe0e4'],
 jade:['#0a3a2a','#1a8a5a','#5ae0a0','#e4fff0'],ice:['#123a6a','#3a8ad0','#9ad8ff','#ffffff']};
const col=h=>new THREE.Color(h);
const VS='varying vec2 vP;uniform vec2 sz;void main(){vP=(uv-.5)*sz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const FS=`varying vec2 vP;uniform int ty;uniform float u,age,seed,al;uniform vec4 p0,p1;uniform vec3 c0,c1,c2,c3;
float h1(float n){return fract(sin(n)*43758.5453);}
float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}
float fb(vec2 p){return ns(p)*.55+ns(p*2.1+3.)*.3+ns(p*4.3+7.)*.15;}
float eo(float x){x=clamp(x,0.,1.);return 1.-pow(1.-x,3.);}
vec3 ramp(float i){return i<.3?c0:i<.55?c1:i<.8?c2:c3;}
void main(){float I=0.;vec2 q=vP;float d,a;
 if(ty==0){ // 고리: 커지며 얇아짐(p0 r0 r1 th0 th1, p1 납작함·끊김)
  q.y/=p1.x;d=length(q);a=atan(q.y,q.x);float r=mix(p0.x,p0.y,eo(u)),th=mix(p0.z,p0.w,u);
  I=1.-abs(d-r)/th;I-=p1.y*u*ns(vec2(a*5.+seed,d*.15));I*=1.1-u*.3;}
 else if(ty==1){ // 섬광: 가시 별(p0 R0 R1 가시수 흔들림)
  d=length(q);a=atan(q.y,q.x);float R=mix(p0.x,p0.y,eo(u*1.5)),k=floor((a+3.1416)/6.2832*p0.z);
  float pr=.45+.55*pow(abs(cos(a*p0.z*.5)),4.)+p0.w*(h1(k+seed)-.5);I=(1.-d/(R*pr))*1.5*(1.-u*u);}
 else if(ty==2){ // 베기 궤적(p0 반지름 두께 시작각 끝각, p1 납작함 꼬리길이 방향)
  q.y/=p1.x;d=length(q);a=atan(q.y,q.x);float sw=eo(min(1.,u*1.7)),hd=mix(p0.z,p0.w,sw),dir=p1.z;
  float rel=(hd-a)*dir;rel=mod(rel+6.2832,6.2832);float s=1.-rel/p1.y;
  if(rel<p1.y&&s>0.){float w=p0.y*(.2+.8*s)*(1.-max(0.,u-.55)*1.6);float o=(d-p0.x)/max(w,.01);
   I=(1.-abs(o))*(.35+.75*s);if(o>0.)I+=.12;I-=u*.55*ns(vec2(a*9.,d*.4+seed));}}
 else if(ty==3){ // 불꽃 기운(p0 폭 높이 속도 세기, p1.x 가운데 비우기 0~1)
  float up=-q.y;float m=1.-pow(abs(q.x)/p0.x,2.)-(up<0.?pow(-up/4.,2.):0.);
  float n=fb(vec2(q.x*.22,q.y*.16+age*p0.z*.06)+seed);I=(n*1.5-up/p0.y-.15)*m*p0.w*min(1.,u*8.)*min(1.,(1.-u)*5.);
  I*=mix(1.,smoothstep(.25,.75,abs(q.x)/p0.x)+step(p0.y*.62,up),p1.x);} // p1.x: 가운데를 비워 몸을 덮지 않는 기운
 else if(ty==4){ // 땅의 마법진(p0 반지름 납작함 회전 눈금수)
  q.y/=p0.y;d=length(q);a=atan(q.y,q.x)+age*p0.z;float g=eo(u*5.),R=p0.x*g,f=min(1.,(1.-u)*4.);
  I=max(1.-abs(d-R)*1.2,.85-abs(d-R*.78)*1.4);
  float tk=step(.6,fract(a/6.2832*p0.w));if(d<R&&d>R*.8)I=max(I,tk*.62);
  float rn=step(.75,fract(a/6.2832*p0.w*.5-age*.01));if(abs(d-R*.6)<1.2)I=max(I,rn*.7);I*=f;}
 else if(ty==5){ // 찌르기 빛줄기(+x쪽, p0 길이 두께)
  float x=q.x/p0.x;if(x>0.&&x<1.){float w=p0.y*pow(1.-x,.6)*(1.-u*.6);I=(1.-abs(q.y)/max(w,.01))*(.5+.6*(1.-x))*(1.-u);I+=step(abs(q.y),.6)*(1.-u)*.4;}}
 if(I<.12)discard;gl_FragColor=vec4(ramp(min(I,1.))*al,1.);}`;
const PVS=`attribute float sz;attribute vec3 cc;varying vec3 vc;void main(){vc=cc;gl_PointSize=sz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const PFS=`varying vec3 vc;void main(){gl_FragColor=vec4(vc,1.);}`;
let pgeo,pmat,ppts,gpgeo,gppts;const PMAX=1500;
function rt(w,h){return new THREE.WebGLRenderTarget(w,h,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter})}
function init(canvasUnder){if(!window.THREE)return;cvs=document.createElement('canvas');cvs.style.cssText='position:absolute;pointer-events:none;mix-blend-mode:screen;image-rendering:pixelated';
 canvasUnder.parentNode.insertBefore(cvs,canvasUnder.nextSibling);
 R=new THREE.WebGLRenderer({canvas:cvs,alpha:false,antialias:false});R.setClearColor(0x000000,1);
 cam=new THREE.OrthographicCamera(0,W,0,H,-10,10);scene=new THREE.Scene();gscene=new THREE.Scene();
 rtA=rt(W,H);rtG=rt(W,H);rtB1=new THREE.WebGLRenderTarget(W,H);rtB2=new THREE.WebGLRenderTarget(W,H);
 const mk=()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(PMAX*3),3));g.setAttribute('sz',new THREE.BufferAttribute(new Float32Array(PMAX),1));g.setAttribute('cc',new THREE.BufferAttribute(new Float32Array(PMAX*3),3));return g};
 pmat=new THREE.ShaderMaterial({vertexShader:PVS,fragmentShader:PFS,blending:THREE.AdditiveBlending,depthTest:false,transparent:true});
 pgeo=mk();gpgeo=mk();ppts=new THREE.Points(pgeo,pmat);gppts=new THREE.Points(gpgeo,pmat);ppts.frustumCulled=gppts.frustumCulled=false;scene.add(ppts);gscene.add(gppts);
 qcam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);qscene=new THREE.Scene();
 blurM=new THREE.ShaderMaterial({uniforms:{t:{value:null},dir:{value:new THREE.Vector2()}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=vec4(position,1.);}',
  fragmentShader:'varying vec2 v;uniform sampler2D t;uniform vec2 dir;void main(){vec3 s=vec3(0.);float w[5];w[0]=.227;w[1]=.195;w[2]=.122;w[3]=.054;w[4]=.016;s+=texture2D(t,v).rgb*w[0];for(int i=1;i<5;i++){s+=texture2D(t,v+dir*float(i)).rgb*w[i];s+=texture2D(t,v-dir*float(i)).rgb*w[i];}gl_FragColor=vec4(s,1.);}'});
 post=new THREE.ShaderMaterial({uniforms:{a:{value:rtA.texture},g:{value:rtB1.texture},gk:{value:1}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=vec4(position,1.);}',
  // 번짐도 단계로 끊어 도트 느낌을 지킴
  fragmentShader:'varying vec2 v;uniform sampler2D a,g;uniform float gk;void main(){vec3 c=texture2D(a,v).rgb;vec3 b=texture2D(g,v).rgb*1.6*gk;b=floor(b*5.)/5.;gl_FragColor=vec4(c+b,1.);}'});
 quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),post);qscene.add(quad);on=true}
function fit(cv,S){if(!on)return;R.setSize(W*S,H*S,false);cvs.style.width=W*S+'px';cvs.style.height=H*S+'px';cvs.style.left=cv.offsetLeft+'px';cvs.style.top=cv.offsetTop+'px'}
// 층 하나: o = {ty:'ring'|'flash'|'slash'|'flame'|'circle'|'beam', x,y, delay, dur, ramp, glow, p0:[..], p1:[..], size:[w,h], follow:()=>[x,y]}
const TY={ring:0,flash:1,slash:2,flame:3,circle:4,beam:5};
function add(o){if(!on)return;const r=(RAMP[o.ramp]||o.ramp||RAMP.gold).map(col);const sz=o.size||[200,200];
 const m=new THREE.ShaderMaterial({vertexShader:VS,fragmentShader:FS,blending:THREE.AdditiveBlending,depthTest:false,transparent:true,side:THREE.DoubleSide,
  uniforms:{ty:{value:TY[o.ty]},u:{value:0},age:{value:0},seed:{value:o.seed||Math.random()*50},al:{value:o.al||1},sz:{value:new THREE.Vector2(...sz)},
   p0:{value:new THREE.Vector4(...(o.p0||[0,0,0,0]))},p1:{value:new THREE.Vector4(...(o.p1||[1,0,0,0]))},c0:{value:r[0]},c1:{value:r[1]},c2:{value:r[2]},c3:{value:r[3]}}});
 const me=new THREE.Mesh(new THREE.PlaneGeometry(sz[0],sz[1]),m);me.position.set(o.x,o.y,0);me.rotation.z=o.rot||0;me.visible=false;
 const L={o,m,me,t:-(o.delay||0)};(o.glow?gscene:scene).add(me);layers.push(L);return L}
// 입자: n개를 한꺼번에(파편·불똥·연기). o = {x,y,n,spd,dir,spread,grav,drag,life,size,ramp,glow,implode,delay}
function burst(o){if(!on)return;const r=(RAMP[o.ramp]||RAMP.gold).map(col);for(let i=0;i<o.n;i++){const a=(o.dir||0)+(Math.random()-.5)*(o.spread===undefined?Math.PI*2:o.spread),v=(o.spd||1)*(.4+Math.random()*.8),lf=(o.life||30)*(.6+Math.random()*.6);
  const p={x:o.x,y:o.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v*(o.sq||1),g:o.grav||0,dr:o.drag||.96,t:-(o.delay||0),lf,sz:o.size||1,r,glow:o.glow,grow:o.grow||0};
  if(o.implode){p.x+=p.vx*o.implode;p.y+=p.vy*o.implode;p.vx*=-.07*o.spd;p.vy*=-.07*o.spd;p.dr=1}
  if(o.ring){p.x=o.x+Math.cos(a)*o.ring;p.y=o.y+Math.sin(a)*o.ring*(o.sq||1)}parts.push(p)}}
function clear(){for(const L of layers){L.me.parent.remove(L.me);L.m.dispose();L.me.geometry.dispose()}layers.length=0;parts.length=0}
function tick(){if(!on)return;for(let i=layers.length-1;i>=0;i--){const L=layers[i];L.t++;const d=L.o.dur;
  if(L.t>=d){L.me.parent.remove(L.me);L.m.dispose();L.me.geometry.dispose();layers.splice(i,1);continue}
  L.me.visible=L.t>=0;if(L.t>=0){L.m.uniforms.u.value=L.t/d;L.m.uniforms.age.value=L.t;if(L.o.follow){const[x,y]=L.o.follow();L.me.position.set(x,y,0)}}}
 for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.t++;if(p.t<0)continue;if(p.t>p.lf){parts.splice(i,1);continue}p.vx*=p.dr;p.vy=p.vy*p.dr+p.g;p.x+=p.vx;p.y+=p.vy}}
function fill(geo,glow){const P=geo.attributes.position.array,Z=geo.attributes.sz.array,C=geo.attributes.cc.array;let n=0;
 for(const p of parts){if(p.t<0||!!p.glow!==glow||n>=PMAX)continue;const k=p.t/p.lf,c=p.r[k<.25?3:k<.55?2:k<.8?1:0];
  P[n*3]=Math.round(p.x)+.5;P[n*3+1]=Math.round(p.y)+.5;P[n*3+2]=0;Z[n]=Math.max(1,Math.round(p.sz*(1+p.grow*k)*(k>.8&&!p.grow?.5:1)));C[n*3]=c.r;C[n*3+1]=c.g;C[n*3+2]=c.b;n++}
 geo.setDrawRange(0,n);geo.attributes.position.needsUpdate=geo.attributes.sz.needsUpdate=geo.attributes.cc.needsUpdate=true}
function render(glowOn,ox,oy){if(!on)return;cvs.style.transform='translate('+ox+'px,'+oy+'px)';fill(pgeo,false);fill(gpgeo,true);
 R.setRenderTarget(rtA);R.clear();R.render(scene,cam);R.setRenderTarget(rtG);R.clear();R.render(gscene,cam);
 // 번짐 층: 원래 색도 그대로 더하고(rtA에), 흐린 복사를 따로 만듦
 post.uniforms.gk.value=glowOn?1:0;
 quad.material=blurM;blurM.uniforms.t.value=rtG.texture;blurM.uniforms.dir.value.set(1.5/W,0);R.setRenderTarget(rtB2);R.render(qscene,qcam);
 blurM.uniforms.t.value=rtB2.texture;blurM.uniforms.dir.value.set(0,1.5/H);R.setRenderTarget(rtB1);R.render(qscene,qcam);
 R.autoClear=false;R.setRenderTarget(rtA);R.render(gscene,cam);R.autoClear=true;
 quad.material=post;R.setRenderTarget(null);R.render(qscene,qcam)}
return{init,fit,add,burst,clear,tick,render,RAMP,get on(){return on},count:()=>layers.length+parts.length}})();
