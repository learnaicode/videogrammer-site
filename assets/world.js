/* Videogrammer world: the portal and the three timelines, flown by scroll.
   Scroll speed drives the lens (zoom blur, colour split, flare, streaks). */
(function(){
const cfg=window.WORLD||{path:'home'};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let motion=localStorage.getItem('vg-motion')!=='off'&&!reduce;
const small=innerWidth<760;
const canvas=document.getElementById('world');
if(!canvas||!window.THREE){document.body.classList.add('calm');return;}

const LANES=[{k:'pre',name:'Pre-production',col:'#ff4fa3',th:-0.62},{k:'prod',name:'Production',col:'#35e08a',th:0},{k:'post',name:'Post-production',col:'#ff7a2f',th:0.62}];
const STEPS=window.STEPS||[];
const dirOf=th=>new THREE.Vector3(Math.sin(th),0,-Math.cos(th));
const rightOf=th=>new THREE.Vector3(Math.cos(th),0,Math.sin(th));
const laneSteps=k=>STEPS.filter(s=>s.lane===k);
const stPos=(L,i)=>dirOf(L.th).multiplyScalar(46+i*30).setY(0.4);
const V=(x,y,z)=>new THREE.Vector3(x,y,z);

/* camera paths per page: [scroll 0..1, position, look-at] */
const wide=innerWidth/innerHeight>1.25&&innerWidth>900,gx=wide?-(innerWidth>1400?7.4:5.6):0;
const laneCam=(k,i,back,lift)=>{const L=LANES.find(l=>l.k===k),p=stPos(L,i),d=dirOf(L.th),up=lift||0;return [p.clone().addScaledVector(d,-(back||13)).add(V(0,-0.4+up,0)),p.clone().add(V(0,-0.4+up*0.35,0))];};
const PATHS={
  home:[[0,V(gx,0.4,22),V(gx,0,0)],[0.07,V(0,0.4,9),V(0,0,-10)],[0.13,V(0,0.6,-3),V(0,-1,-40)],[0.24,V(0,9,-2),V(0,-4,-70)],[0.4,...laneCam('pre',2)],[0.52,...laneCam('prod',1)],[0.64,...laneCam('post',1)],[0.8,...laneCam('post',7,16)],[1,V(0,22,-30),V(0,-6,-160)]],
  studio:[[0,...laneCam('prod',1,22,6)],[0.3,...laneCam('prod',2)],[0.6,...laneCam('prod',5)],[1,...laneCam('post',3)]],
  school:[[0,...laneCam('pre',1,22,6)],[0.35,...laneCam('pre',2)],[0.7,...laneCam('pre',6)],[1,...laneCam('prod',2)]],
  workspace:[[0,V(0,9,-2),V(0,-4,-70)],[0.25,...laneCam('pre',3)],[0.5,...laneCam('prod',3)],[0.75,...laneCam('post',1)],[1,V(0,22,-30),V(0,-6,-160)]],
  films:[[0,...laneCam('post',1,22,6)],[0.5,...laneCam('post',3)],[1,...laneCam('post',7)]],
  lab:[[0,V(gx,0.4,16),V(gx,0,0)],[0.5,V(0,0.4,7),V(0,0,-10)],[1,...laneCam('post',1)]]
};
const path=PATHS[cfg.path]||PATHS.home;

const renderer=new THREE.WebGLRenderer({canvas,antialias:!small,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,small?1:1.5));renderer.setSize(innerWidth,innerHeight);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x05070c,0.0085);
const cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.1,900);scene.add(cam);
cam.position.copy(path[0][1]);const look=path[0][2].clone();

/* portal */
const portal=new THREE.Group();scene.add(portal);
const fGeo=new THREE.PlaneGeometry(0.62,0.36),lc=LANES.map(l=>new THREE.Color(l.col));
for(let i=0;i<150;i++){const a=i/150*Math.PI*2,r=7.2+(i%3)*0.18;
  const m=new THREE.MeshBasicMaterial({color:lc[Math.floor(i/50)%3],transparent:true,opacity:0.35+Math.random()*0.5,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false});
  const f=new THREE.Mesh(fGeo,m);f.position.set(Math.cos(a)*r,Math.sin(a)*r,(Math.random()-.5)*0.6);f.rotation.z=a+Math.PI/2;f.userData={a,base:m.opacity,spd:0.2+Math.random()*0.6};portal.add(f);}
for(let k=0;k<3;k++)portal.add(new THREE.Mesh(new THREE.TorusGeometry(6.55+k*1.25,0.012+k*0.006,6,220),new THREE.MeshBasicMaterial({color:k===1?0xa9bdff:0x3d6bff,transparent:true,opacity:0.7-k*0.18,blending:THREE.AdditiveBlending})));
const tk=[];for(let i=0;i<240;i++){const a=i/240*Math.PI*2,l=(i%10===0)?0.55:0.18,r=8.6;tk.push(Math.cos(a)*r,Math.sin(a)*r,0,Math.cos(a)*(r+l),Math.sin(a)*(r+l),0);}
const tkG=new THREE.BufferGeometry();tkG.setAttribute('position',new THREE.Float32BufferAttribute(tk,3));
const ticks=new THREE.LineSegments(tkG,new THREE.LineBasicMaterial({color:0x6f8dff,transparent:true,opacity:0.55}));portal.add(ticks);
const horizon=new THREE.Mesh(new THREE.CircleGeometry(6.5,96),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{t:{value:0},k:{value:0.3}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:`varying vec2 vUv;uniform float t;uniform float k;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
    void main(){vec2 p=vUv-.5;float r=length(p)*2.;float a=atan(p.y,p.x);
      float sw=a/6.2831+t*.05+.35/(r+.15);float f=fbm(vec2(sw*8.,r*3.-t*.6));
      float rings=pow(.5+.5*sin(r*38.-t*5.),8.);float edge=smoothstep(1.,.82,r);float core=smoothstep(.55,0.,r);
      vec3 c=mix(vec3(.12,.2,.75),vec3(.66,.74,1.),f);
      c+=vec3(1.,.31,.64)*pow(fbm(vec2(sw*5.+3.,r*2.)),5.)*1.6+vec3(.2,.88,.54)*pow(fbm(vec2(sw*6.+9.,r*2.5+t*.2)),5.)*1.4+vec3(1.,.48,.18)*pow(f,6.)*1.4;
      float al=edge*(.18+.55*pow(f,2.2)+rings*.12*r)+core*k*.9;gl_FragColor=vec4(c*(.55+k*.9),al*(.55+k*.6));}`}));
portal.add(horizon);
/* the gold V, floating in the portal */
let vMark=null;
new THREE.TextureLoader().load('assets/logo/mark.png',tex=>{tex.anisotropy=4;
  vMark=new THREE.Mesh(new THREE.PlaneGeometry(4.3,4.3*539/585),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,depthTest:false,opacity:1}));
  vMark.renderOrder=20;vMark.position.set(0,0.15,0.6);scene.add(vMark);});

/* station panels */
function wrap(g,t,x,y,w,lh,max){const ws=String(t).split(' ');let l='',n=0;for(const v of ws){const tt=l?l+' '+v:v;if(g.measureText(tt).width>w){g.fillText(l,x,y);y+=lh;l=v;if(++n>=max-1){g.fillText(l+'…',x,y);return y;}}else l=tt;}g.fillText(l,x,y);return y;}
function rgba(hex,a){const n=parseInt(hex.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;}
function card(L,s,i,n){const c=document.createElement('canvas');c.width=1024;c.height=576;const g=c.getContext('2d');
  g.fillStyle='#070a12';g.fillRect(0,0,1024,576);g.strokeStyle=rgba(L.col,.13);for(let x=0;x<1024;x+=48){g.beginPath();g.moveTo(x,0);g.lineTo(x,576);g.stroke();}for(let y=0;y<576;y+=48){g.beginPath();g.moveTo(0,y);g.lineTo(1024,y);g.stroke();}
  g.fillStyle=L.col;g.fillRect(0,0,1024,10);g.fillRect(48,60,34,34);g.font='500 22px "IBM Plex Mono",monospace';g.fillText(`${L.name.toUpperCase()}  ·  ${String(i+1).padStart(2,'0')} / ${String(n).padStart(2,'0')}`,100,85);
  g.fillStyle='#e9edf5';g.font='900 104px "Big Shoulders Display",Impact,sans-serif';const y=wrap(g,s.name.toUpperCase(),46,220,930,98,2);
  g.fillStyle='#c3cad8';g.font='400 27px "IBM Plex Sans",sans-serif';wrap(g,s.problem,50,y+62,900,38,3);return c;}
const panels=[];const FW=7.2,FH=4.05;
function buildLanes(){LANES.forEach(L=>{
  const d=dirOf(L.th),r=rightOf(L.th),col=new THREE.Color(L.col),sts=laneSteps(L.k),end=46+Math.max(0,sts.length-1)*30+14;
  const seg=[];const P=(dist,off,y)=>{const v=d.clone().multiplyScalar(dist).addScaledVector(r,off);seg.push(v.x,y,v.z);};
  [-3.2,0,3.2].forEach(o=>{P(9,o,-3.6);P(end,o,-3.6);});for(let q=12;q<end;q+=3){P(q,-3.2,-3.6);P(q,3.2,-3.6);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(seg,3));
  scene.add(new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:.42,blending:THREE.AdditiveBlending})));
  for(let q=16;q<end;q+=10){const t=new THREE.Mesh(new THREE.TorusGeometry(9.5,0.02,6,120),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.16,blending:THREE.AdditiveBlending}));t.position.copy(d.clone().multiplyScalar(q));t.rotation.y=-L.th;scene.add(t);}
  const c=document.createElement('canvas');c.width=1024;c.height=160;const x=c.getContext('2d');x.fillStyle=L.col;x.font='900 120px "Big Shoulders Display",Impact,sans-serif';x.textAlign='center';x.fillText(L.name.toUpperCase(),512,122);
  const tm=new THREE.Mesh(new THREE.PlaneGeometry(16,2.5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,side:THREE.DoubleSide}));tm.position.copy(d.clone().multiplyScalar(27)).setY(-1.2);tm.rotation.y=-L.th;scene.add(tm);
  sts.forEach((s,i)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(FW,FH),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(card(L,s,i,sts.length)),side:THREE.DoubleSide}));
    m.position.copy(stPos(L,i));m.rotation.y=-L.th;scene.add(m);
    const ed=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(FW+.14,FH+.14)),new THREE.LineBasicMaterial({color:col}));ed.position.z=.01;m.add(ed);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(10,0.035,6,180),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.75,blending:THREE.AdditiveBlending}));ring.position.z=-1.5;m.add(ring);
    const sg=[];for(let k=0;k<96;k++){const a=k/96*Math.PI*2;if(k%4===3)continue;const rr=11.3,l=(k%12===0?.9:.3);sg.push(Math.cos(a)*rr,Math.sin(a)*rr,0,Math.cos(a)*(rr+l),Math.sin(a)*(rr+l),0);}
    const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.Float32BufferAttribute(sg,3));const dl=new THREE.LineSegments(dg,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:.4}));dl.position.z=-1.5;dl.userData.spin=(i%2?1:-1)*0.04;m.add(dl);m.userData.dial=dl;panels.push(m);});});}
(document.fonts&&document.fonts.ready||Promise.resolve()).then(buildLanes);

/* streaks and flying frames ride with the camera */
const SN=small?600:1400,sp=new Float32Array(SN*6),sc=new Float32Array(SN*6),streaks=[];
for(let i=0;i<SN;i++){const a=Math.random()*Math.PI*2,r=2.2+Math.pow(Math.random(),.6)*17;streaks.push({x:Math.cos(a)*r,y:Math.sin(a)*r,z:-Math.random()*420,w:Math.random()<.22,g:0,l:.6+Math.random()*.9});}
const sgeo=new THREE.BufferGeometry();sgeo.setAttribute('position',new THREE.BufferAttribute(sp,3));sgeo.setAttribute('color',new THREE.BufferAttribute(sc,3));
const smesh=new THREE.LineSegments(sgeo,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));smesh.frustumCulled=false;cam.add(smesh);
const DN=small?2500:5000,dp=new Float32Array(DN*3);for(let i=0;i<DN;i++){dp[i*3]=(Math.random()-.5)*420;dp[i*3+1]=(Math.random()-.5)*60;dp[i*3+2]=40-Math.random()*260;}
const dgeo=new THREE.BufferGeometry();dgeo.setAttribute('position',new THREE.BufferAttribute(dp,3));
scene.add(new THREE.Points(dgeo,new THREE.PointsMaterial({color:0x8fa6ff,size:0.07,transparent:true,opacity:0.55,blending:THREE.AdditiveBlending,depthWrite:false})));

/* lens */
let composer=null,fx=null,bloom=null;
if(!small&&THREE.EffectComposer&&THREE.RenderPass&&THREE.UnrealBloomPass&&THREE.ShaderPass){
  composer=new THREE.EffectComposer(renderer);composer.addPass(new THREE.RenderPass(scene,cam));
  bloom=new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth/2,innerHeight/2),0.8,0.55,0.14);composer.addPass(bloom);
  fx=new THREE.ShaderPass({uniforms:{tDiffuse:{value:null},amt:{value:0.004},vig:{value:0.55},blur:{value:0},flare:{value:0.3},asp:{value:innerWidth/innerHeight},tint:{value:new THREE.Vector3(.32,.48,1)}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform sampler2D tDiffuse;uniform float amt,vig,blur,flare,asp;uniform vec3 tint;varying vec2 vUv;
      float lum(vec3 c){return max(c.r,max(c.g,c.b));}
      void main(){vec2 c=vUv-.5;float d=length(c);vec3 acc=vec3(0.);float tot=0.;
        for(int i=0;i<16;i++){float f=float(i)/15.;float s=1.-blur*f*(.25+d*1.5);vec2 uv=.5+c*s;vec2 o=c*amt*(.4+d*2.)*(1.+f);float w=1.-f*.6;
          acc+=vec3(texture2D(tDiffuse,uv+o).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-o).b)*w;tot+=w;}
        vec3 col=acc/tot;vec3 st=vec3(0.);for(int i=-10;i<=10;i++){float fi=float(i);vec3 s=texture2D(tDiffuse,vUv+vec2(fi*.022,0.)).rgb;st+=max(0.,lum(s)-.62)*(1.-abs(fi)/11.);}
        col+=st*tint*flare*.22;
        for(int k=1;k<4;k++){float fk=float(k);vec2 uv=.5-c*(fk*.42);vec3 s=texture2D(tDiffuse,uv).rgb;float b=max(0.,lum(s)-.7);col+=b*mix(tint,vec3(1.),fk/4.)*blur*1.6*smoothstep(.7,0.,length((uv-.5)*vec2(asp,1.)));}
        float ring=smoothstep(.03,0.,abs(length((vUv-.5)*vec2(asp,1.))-.38-blur*.25));col+=ring*tint*blur*.6;
        col*=1.-vig*d*d*1.7;gl_FragColor=vec4(col,1.);}`});composer.addPass(fx);}

/* scroll → camera */
function prog(){const h=document.documentElement.scrollHeight-innerHeight;return h>0?Math.min(1,Math.max(0,scrollY/h)):0;}
function sample(p){let i=0;while(i<path.length-2&&p>path[i+1][0])i++;const a=path[i],b=path[i+1];const t=Math.min(1,Math.max(0,(p-a[0])/((b[0]-a[0])||1)));const e=t*t*(3-2*t);
  return [a[1].clone().lerp(b[1],e),a[2].clone().lerp(b[2],e)];}
let lastY=scrollY,vel=0,warp=0,kick=0;const tint=new THREE.Color(cfg.tint||'#3d6bff'),curTint=tint.clone();
const laneTint=()=>{const p=prog();if(cfg.path!=='home')return tint;if(p<0.3)return tint;if(p<0.46)return new THREE.Color('#ff4fa3');if(p<0.58)return new THREE.Color('#35e08a');return new THREE.Color('#ff7a2f');};
window.WORLD_KICK=(v)=>{kick=Math.max(kick,v||0.8);};
let crossed=false;const hud=document.getElementById('hud');
const clock=new THREE.Clock();
function frame(){requestAnimationFrame(frame);
  const dt=Math.min(clock.getDelta(),0.05),t=clock.elapsedTime;
  const dy=scrollY-lastY;lastY=scrollY;vel=vel*0.85+Math.abs(dy)*0.15;
  const target=motion?Math.min(1,vel/55)+kick:0;warp+=(target-warp)*0.12;kick*=Math.pow(0.08,dt);
  const [pos,lk]=sample(prog());const sway=motion?V(Math.sin(t*.3)*.25,Math.cos(t*.23)*.15,0):V(0,0,0);
  cam.position.lerp(pos.add(sway),motion?0.09:1);look.lerp(lk,motion?0.09:1);cam.lookAt(look);
  cam.fov=60+warp*30;cam.updateProjectionMatrix();
  if(cfg.path==='home'&&hud){const p=prog();if(!crossed&&p>0.09&&p<0.16){crossed=true;hud.classList.add('on');kick=0.9;setTimeout(()=>hud.classList.remove('on'),1300);}if(p<0.05)crossed=false;}
  curTint.lerp(laneTint(),0.05);
  portal.rotation.z=t*0.05;ticks.rotation.z=-t*0.11;portal.children.forEach(o=>{if(o.userData&&o.userData.base)o.material.opacity=o.userData.base*(0.6+0.4*Math.sin(t*o.userData.spd*3+o.userData.a*5));});
  if(vMark){vMark.position.y=0.15+Math.sin(t*0.8)*0.12;vMark.rotation.y=Math.sin(t*0.4)*0.18;vMark.material.opacity=1-Math.min(1,warp*0.8);vMark.visible=cam.position.z>1.2;}
  horizon.material.uniforms.t.value=t;horizon.material.uniforms.k.value=0.3+warp*1.4;
  panels.forEach(m=>{m.userData.dial.rotation.z+=m.userData.dial.userData.spin*dt*(1+warp*20);});
  const P=sgeo.attributes.position.array,C=sgeo.attributes.color.array,spd=(0.6+warp*95)*dt*10;
  const sparks=Math.random()<0.25+warp?(1+warp*30)|0:0;for(let k=0;k<sparks;k++)streaks[(Math.random()*SN)|0].g=1;const decay=Math.pow(0.04,dt);
  for(let i=0;i<SN;i++){const s=streaks[i];s.z+=spd;if(s.z>4)s.z-=420;s.g*=decay;const len=(0.05+warp*10)*s.l*(1+s.g*1.5),I=(0.3+s.g*3.2)*(0.5+warp),j=i*6;
    P[j]=s.x;P[j+1]=s.y;P[j+2]=s.z;P[j+3]=s.x*(1-warp*.02);P[j+4]=s.y*(1-warp*.02);P[j+5]=s.z-len;
    C[j]=(s.w?1:curTint.r)*I;C[j+1]=(s.w?1:curTint.g)*I;C[j+2]=(s.w?1:curTint.b)*I;C[j+3]=0;C[j+4]=0;C[j+5]=0;}
  sgeo.attributes.position.needsUpdate=true;sgeo.attributes.color.needsUpdate=true;smesh.material.opacity=Math.min(1,0.1+warp*1.3);
  if(fx){fx.uniforms.amt.value=0.004+warp*0.06;fx.uniforms.blur.value=warp*0.42;fx.uniforms.flare.value=0.3+warp*1.4;fx.uniforms.tint.value.set(curTint.r,curTint.g,curTint.b);}
  if(bloom)bloom.strength=0.8+warp*1.4;
  composer?composer.render():renderer.render(scene,cam);}
frame();
addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer&&composer.setSize(innerWidth,innerHeight);fx&&(fx.uniforms.asp.value=innerWidth/innerHeight);});
window.setMotion=(on)=>{motion=on&&!reduce;localStorage.setItem('vg-motion',on?'on':'off');document.body.classList.toggle('calm',!motion);};
document.body.classList.toggle('calm',!motion);
})();
