/* The Videogrammer universe: one engine, a different world on every page.
   home: the portal and the three timelines · studio: a helix of film frames
   school: a constellation of six films · vai: the film's memory core
   films: a projector beam onto a screen · lab: the measurement grid.
   Scroll flies the camera; scroll speed and page jumps drive the lens. */
(function(){
const cfg=window.WORLD||{world:'timelines'};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let motion=localStorage.getItem('vg-motion')!=='off'&&!reduce;
const small=innerWidth<760;
const canvas=document.getElementById('world');
if(!canvas||!window.THREE){document.body.classList.add('calm');return;}
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const ADD=THREE.AdditiveBlending;
function rgba(hex,a){const n=parseInt(hex.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;}
function wrap(g,t,x,y,w,lh,max){const ws=String(t).split(' ');let l='',n=0;for(const v of ws){const tt=l?l+' '+v:v;if(g.measureText(tt).width>w){g.fillText(l,x,y);y+=lh;l=v;if(++n>=max-1){g.fillText(l+'…',x,y);return y;}}else l=tt;}g.fillText(l,x,y);return y;}
function glowTex(col){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.25,rgba(col,.8));r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
function label(lines,col,w=1024,h=256){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.textAlign='center';
  g.fillStyle=col;g.font='500 34px "IBM Plex Mono",monospace';g.fillText(lines[0],w/2,64);g.fillStyle='#e9edf5';g.font='900 96px "Big Shoulders Display",Impact,sans-serif';g.fillText(lines[1].toUpperCase(),w/2,170);
  if(lines[2]){g.fillStyle='#9aa3b5';g.font='400 30px "IBM Plex Sans",sans-serif';g.fillText(lines[2],w/2,226);}
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));s.scale.set(w/100,h/100,1);return s;}

const renderer=new THREE.WebGLRenderer({canvas,antialias:!small,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,small?1:1.5));renderer.setSize(innerWidth,innerHeight);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x05070c,0.0085);
const cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.1,900);scene.add(cam);

/* ---------------- worlds ---------------- */
const fontsReady=(document.fonts&&document.fonts.ready)||Promise.resolve();
const WORLDS={};

WORLDS.timelines=function(){
  const LANES=[{k:'pre',name:'Pre-production',col:'#ff4fa3',th:-0.62},{k:'prod',name:'Production',col:'#35e08a',th:0},{k:'post',name:'Post-production',col:'#ff7a2f',th:0.62}];
  const STEPS=window.STEPS||[];const dirOf=th=>V(Math.sin(th),0,-Math.cos(th)),rightOf=th=>V(Math.cos(th),0,Math.sin(th));
  const laneSteps=k=>STEPS.filter(s=>s.lane===k),stPos=(L,i)=>dirOf(L.th).multiplyScalar(46+i*30).setY(0.4);
  const portal=new THREE.Group();scene.add(portal);
  const fGeo=new THREE.PlaneGeometry(0.62,0.36),lc=LANES.map(l=>new THREE.Color(l.col));
  for(let i=0;i<150;i++){const a=i/150*Math.PI*2,r=7.2+(i%3)*0.18;const m=new THREE.MeshBasicMaterial({color:lc[Math.floor(i/50)%3],transparent:true,opacity:0.35+Math.random()*0.5,side:THREE.DoubleSide,blending:ADD,depthWrite:false});
    const f=new THREE.Mesh(fGeo,m);f.position.set(Math.cos(a)*r,Math.sin(a)*r,(Math.random()-.5)*0.6);f.rotation.z=a+Math.PI/2;f.userData={a,base:m.opacity,spd:0.2+Math.random()*0.6};portal.add(f);}
  for(let k=0;k<3;k++)portal.add(new THREE.Mesh(new THREE.TorusGeometry(6.55+k*1.25,0.012+k*0.006,6,220),new THREE.MeshBasicMaterial({color:k===1?0xa9bdff:0x3d6bff,transparent:true,opacity:0.7-k*0.18,blending:ADD})));
  const tk=[];for(let i=0;i<240;i++){const a=i/240*Math.PI*2,l=(i%10===0)?0.55:0.18,r=8.6;tk.push(Math.cos(a)*r,Math.sin(a)*r,0,Math.cos(a)*(r+l),Math.sin(a)*(r+l),0);}
  const tkG=new THREE.BufferGeometry();tkG.setAttribute('position',new THREE.Float32BufferAttribute(tk,3));const ticks=new THREE.LineSegments(tkG,new THREE.LineBasicMaterial({color:0x6f8dff,transparent:true,opacity:0.55}));portal.add(ticks);
  const horizon=new THREE.Mesh(new THREE.CircleGeometry(6.5,96),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:ADD,side:THREE.DoubleSide,uniforms:{t:{value:0},k:{value:0.3}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`varying vec2 vUv;uniform float t;uniform float k;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
      void main(){vec2 p=vUv-.5;float r=length(p)*2.;float a=atan(p.y,p.x);float sw=a/6.2831+t*.05+.35/(r+.15);float f=fbm(vec2(sw*8.,r*3.-t*.6));
        float rings=pow(.5+.5*sin(r*38.-t*5.),8.);float edge=smoothstep(1.,.82,r);float core=smoothstep(.55,0.,r);vec3 c=mix(vec3(.12,.2,.75),vec3(.66,.74,1.),f);
        c+=vec3(1.,.31,.64)*pow(fbm(vec2(sw*5.+3.,r*2.)),5.)*1.6+vec3(.2,.88,.54)*pow(fbm(vec2(sw*6.+9.,r*2.5+t*.2)),5.)*1.4+vec3(1.,.48,.18)*pow(f,6.)*1.4;
        float al=edge*(.18+.55*pow(f,2.2)+rings*.12*r)+core*k*.9;gl_FragColor=vec4(c*(.55+k*.9),al*(.55+k*.6));}`}));
  portal.add(horizon);
  let vMark=null;new THREE.TextureLoader().load('assets/logo/mark.png',tex=>{tex.anisotropy=4;vMark=new THREE.Mesh(new THREE.PlaneGeometry(4.3,4.3*539/585),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,depthTest:false}));vMark.renderOrder=20;vMark.position.set(0,0.15,0.6);scene.add(vMark);});
  const dials=[];
  fontsReady.then(()=>LANES.forEach(L=>{const d=dirOf(L.th),r=rightOf(L.th),col=new THREE.Color(L.col),sts=laneSteps(L.k),end=46+Math.max(0,sts.length-1)*30+14;
    const seg=[];const P=(dist,off,y)=>{const v=d.clone().multiplyScalar(dist).addScaledVector(r,off);seg.push(v.x,y,v.z);};
    [-3.2,0,3.2].forEach(o=>{P(9,o,-3.6);P(end,o,-3.6);});for(let q=12;q<end;q+=3){P(q,-3.2,-3.6);P(q,3.2,-3.6);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(seg,3));scene.add(new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:.42,blending:ADD})));
    for(let q=16;q<end;q+=10){const t=new THREE.Mesh(new THREE.TorusGeometry(9.5,0.02,6,120),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.16,blending:ADD}));t.position.copy(d.clone().multiplyScalar(q));t.rotation.y=-L.th;scene.add(t);}
    const c=document.createElement('canvas');c.width=1024;c.height=160;const x=c.getContext('2d');x.fillStyle=L.col;x.font='900 120px "Big Shoulders Display",Impact,sans-serif';x.textAlign='center';x.fillText(L.name.toUpperCase(),512,122);
    const tm=new THREE.Mesh(new THREE.PlaneGeometry(16,2.5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,side:THREE.DoubleSide}));tm.position.copy(d.clone().multiplyScalar(27)).setY(-1.2);tm.rotation.y=-L.th;scene.add(tm);
    sts.forEach((s,i)=>{const cv=document.createElement('canvas');cv.width=1024;cv.height=576;const q=cv.getContext('2d');q.fillStyle='#070a12';q.fillRect(0,0,1024,576);q.strokeStyle=rgba(L.col,.13);for(let a=0;a<1024;a+=48){q.beginPath();q.moveTo(a,0);q.lineTo(a,576);q.stroke();}for(let a=0;a<576;a+=48){q.beginPath();q.moveTo(0,a);q.lineTo(1024,a);q.stroke();}
      q.fillStyle=L.col;q.fillRect(0,0,1024,10);q.fillRect(48,60,34,34);q.font='500 22px "IBM Plex Mono",monospace';q.fillText(`${L.name.toUpperCase()}  ·  ${String(i+1).padStart(2,'0')} / ${String(sts.length).padStart(2,'0')}`,100,85);
      q.fillStyle='#e9edf5';q.font='900 104px "Big Shoulders Display",Impact,sans-serif';const yy=wrap(q,s.name.toUpperCase(),46,220,930,98,2);q.fillStyle='#c3cad8';q.font='400 27px "IBM Plex Sans",sans-serif';wrap(q,s.problem,50,yy+62,900,38,3);
      const m=new THREE.Mesh(new THREE.PlaneGeometry(7.2,4.05),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),side:THREE.DoubleSide}));m.position.copy(stPos(L,i));m.rotation.y=-L.th;scene.add(m);
      const ed=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(7.34,4.19)),new THREE.LineBasicMaterial({color:col}));ed.position.z=.01;m.add(ed);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(10,0.035,6,180),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.75,blending:ADD}));ring.position.z=-1.5;m.add(ring);
      const sg=[];for(let k=0;k<96;k++){const a=k/96*Math.PI*2;if(k%4===3)continue;const rr=11.3,l=(k%12===0?.9:.3);sg.push(Math.cos(a)*rr,Math.sin(a)*rr,0,Math.cos(a)*(rr+l),Math.sin(a)*(rr+l),0);}
      const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.Float32BufferAttribute(sg,3));const dl=new THREE.LineSegments(dg,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:.4}));dl.position.z=-1.5;dl.userData.spin=(i%2?1:-1)*0.04;m.add(dl);dials.push(dl);});}));
  const wide=innerWidth/innerHeight>1.25&&innerWidth>900,gx=wide?-(innerWidth>1400?7.4:5.6):0;
  const laneCam=(k,i,back)=>{const L=LANES.find(l=>l.k===k),p=stPos(L,i),d=dirOf(L.th);return [p.clone().addScaledVector(d,-(back||13)).add(V(0,-0.4,0)),p.clone().add(V(0,-0.4,0))];};
  return {tint:'#3d6bff',path:[[0,V(gx,0.4,22),V(gx,0,0)],[0.07,V(0,0.4,9),V(0,0,-10)],[0.13,V(0,0.6,-3),V(0,-1,-40)],[0.24,V(0,9,-2),V(0,-4,-70)],[0.4,...laneCam('pre',2)],[0.52,...laneCam('prod',1)],[0.64,...laneCam('post',1)],[0.8,...laneCam('post',7,16)],[1,V(0,22,-30),V(0,-6,-160)]],
    laneTint:p=>p<0.3?'#3d6bff':p<0.46?'#ff4fa3':p<0.58?'#35e08a':'#ff7a2f',
    update(t,dt,warp){portal.rotation.z=t*0.05;ticks.rotation.z=-t*0.11;portal.children.forEach(o=>{if(o.userData&&o.userData.base)o.material.opacity=o.userData.base*(0.6+0.4*Math.sin(t*o.userData.spd*3+o.userData.a*5));});
      horizon.material.uniforms.t.value=t;horizon.material.uniforms.k.value=0.3+warp*1.4;dials.forEach(d=>d.rotation.z+=d.userData.spin*dt*(1+warp*20));
      if(vMark){vMark.position.y=0.15+Math.sin(t*0.8)*0.12;vMark.rotation.y=Math.sin(t*0.4)*0.18;vMark.material.opacity=1-Math.min(1,warp*0.8);vMark.visible=cam.position.z>1.2;}}};
};

/* Studios: a helix of film frames you fly down */
WORLDS.reels=function(){
  const g=new THREE.Group();scene.add(g);const titles=(window.FILMS||[]).map(f=>f.title).concat(['TAKE 01','TAKE 04','SCENE 12','REEL 3','MASTER']);
  const texes=[];for(let k=0;k<12;k++){const c=document.createElement('canvas');c.width=512;c.height=300;const x=c.getContext('2d');
    const gr=x.createLinearGradient(0,0,512,300);const hue=[150,140,42,35,160,30][k%6];gr.addColorStop(0,`hsl(${hue},55%,${10+k%3*4}%)`);gr.addColorStop(1,`hsl(${hue+20},60%,${22+k%4*5}%)`);x.fillStyle=gr;x.fillRect(0,0,512,300);
    for(let i=0;i<60;i++){x.fillStyle=`rgba(255,${200+Math.random()*55|0},150,${Math.random()*.06})`;x.fillRect(Math.random()*512,Math.random()*300,Math.random()*120,2);}
    x.fillStyle='#05070c';x.fillRect(0,0,512,26);x.fillRect(0,274,512,26);x.fillStyle='rgba(233,237,245,.85)';for(let i=0;i<14;i++){x.fillRect(10+i*36,7,18,12);x.fillRect(10+i*36,281,18,12);}
    x.fillStyle='rgba(233,237,245,.9)';x.font='900 52px "Big Shoulders Display",Impact,sans-serif';x.fillText(String(titles[k%titles.length]||'').toUpperCase(),26,170);x.font='500 18px "IBM Plex Mono",monospace';x.fillStyle='rgba(255,200,120,.9)';x.fillText('VIDEOGRAMMER STUDIOS  ·  '+String(k+1).padStart(2,'0'),26,250);
    texes.push(new THREE.CanvasTexture(c));}
  const N=small?90:150,frames=[];const geo=new THREE.PlaneGeometry(5.6,3.3);
  for(let i=0;i<N;i++){const a=i*0.42,z=-i*2.3,r=7.6;const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:texes[i%texes.length],side:THREE.DoubleSide,transparent:true,opacity:.92}));
    m.position.set(Math.cos(a)*r,Math.sin(a)*r,z);m.lookAt(0,0,z);g.add(m);frames.push(m);}
  [0,Math.PI].forEach(off=>{const pts=[];for(let i=0;i<N*4;i++){const a=i*0.105+off,z=-i*0.575,r=10.6;pts.push(V(Math.cos(a)*r,Math.sin(a)*r,z));}
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xffc35a,transparent:true,opacity:.45,blending:ADD})));});
  const len=N*2.3;
  return {tint:'#35e08a',path:[[0,V(0,0,16),V(0,0,-20)],[1,V(0,0,-len+30),V(0,0,-len)]],update(t,dt,warp,p){g.rotation.z=t*0.06+p*3;}};
};

/* School: a constellation of the six films */
WORLDS.constellation=function(){
  const F=[['FILM 01','Silent point of view','45–90 seconds'],['FILM 02','Actor-led dialogue','2–4 minutes'],['FILM 03','Essay or hybrid','3–5 minutes'],['FILM 04','Hybrid proof shot','30–90 seconds'],['FILM 05','Specialisation showcase','2–4 minutes'],['FILM 06','Crewed thesis film','5–10 minutes']];
  const C=V(0,0,-40),pos=F.map((f,k)=>{const a=k*1.1+0.4;return V(Math.cos(a)*16,-12+k*5,-40+Math.sin(a)*16);});
  const pink=new THREE.Color('#ff4fa3'),glow=glowTex('#ff4fa3');const nodes=[];
  pos.forEach((p,k)=>{const n=new THREE.Group();n.position.copy(p);scene.add(n);const s=1+k*0.18;
    const ico=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.2*s,1)),new THREE.LineBasicMaterial({color:pink,transparent:true,opacity:.8,blending:ADD}));n.add(ico);
    n.add(new THREE.Mesh(new THREE.SphereGeometry(1.1*s,24,16),new THREE.MeshBasicMaterial({color:0xffb3d6,transparent:true,opacity:.55,blending:ADD})));
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,blending:ADD,transparent:true,depthWrite:false}));sp.scale.set(9*s,9*s,1);n.add(sp);
    fontsReady.then(()=>{const l=label(F[k],'#ff4fa3');l.position.set(0,3.8*s+1,0);l.scale.multiplyScalar(0.8);n.add(l);});
    nodes.push({n,ico});});
  const curve=new THREE.CatmullRomCurve3(pos);scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve,200,0.06,6,false),new THREE.MeshBasicMaterial({color:pink,transparent:true,opacity:.7,blending:ADD})));
  const SN=small?1500:3500,sp=new Float32Array(SN*3);for(let i=0;i<SN;i++){const r=20+Math.random()*90,a=Math.random()*6.28,b=(Math.random()-.5)*2;sp[i*3]=Math.cos(a)*r;sp[i*3+1]=b*40;sp[i*3+2]=-40+Math.sin(a)*r;}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffc6e0,size:0.12,transparent:true,opacity:.6,blending:ADD,depthWrite:false})));
  const path=[[0,V(0,6,34),V(0,0,-40)]];pos.forEach((p,k)=>{const out=V(p.x-C.x,0,p.z-C.z).normalize();path.push([(k+1)/7,p.clone().addScaledVector(out,10).add(V(0,1.5,0)),p.clone()]);});path.push([1,V(0,30,10),V(0,0,-40)]);
  return {tint:'#ff4fa3',path,update(t){nodes.forEach((o,k)=>{o.ico.rotation.y=t*0.3+k;o.ico.rotation.x=t*0.2;o.n.position.y=pos[k].y+Math.sin(t*0.7+k)*0.4;});}};
};

/* V AI: the film's memory, a living graph around a core */
WORLDS.memory=function(){
  const C=V(0,0,-30),g=new THREE.Group();g.position.copy(C);scene.add(g);const N=small?260:440,R=13,pts=[];
  for(let i=0;i<N;i++){const y=1-(i/(N-1))*2,r=Math.sqrt(1-y*y),a=i*2.39996;pts.push(V(Math.cos(a)*r*R,y*R,Math.sin(a)*r*R));}
  const pa=new Float32Array(N*3);pts.forEach((p,i)=>{pa[i*3]=p.x;pa[i*3+1]=p.y;pa[i*3+2]=p.z;});const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pa,3));
  g.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0xa9bdff,size:0.32,transparent:true,opacity:.95,blending:ADD,depthWrite:false})));
  const edges=[],ea=[];for(let i=0;i<N;i++){[1,21,34].forEach(o=>{const j=i+o;if(j<N&&Math.random()<.8){edges.push([i,j]);ea.push(pts[i].x,pts[i].y,pts[i].z,pts[j].x,pts[j].y,pts[j].z);}});}
  const eg=new THREE.BufferGeometry();eg.setAttribute('position',new THREE.Float32BufferAttribute(ea,3));g.add(new THREE.LineSegments(eg,new THREE.LineBasicMaterial({color:0x3d6bff,transparent:true,opacity:.28,blending:ADD})));
  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(3,2),new THREE.MeshBasicMaterial({color:0x6f8dff,wireframe:true,transparent:true,opacity:.7,blending:ADD}));g.add(core);
  const cs=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#3d6bff'),blending:ADD,transparent:true,depthWrite:false}));cs.scale.set(16,16,1);g.add(cs);
  const PN=small?30:70,pulses=[],pt=glowTex('#a9bdff');for(let k=0;k<PN;k++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:pt,blending:ADD,transparent:true,depthWrite:false}));s.scale.set(1.1,1.1,1);g.add(s);pulses.push({s,e:edges[(Math.random()*edges.length)|0],u:Math.random(),v:0.3+Math.random()*0.8});}
  const K=[['WHAT IT SAW','Observed','#a9bdff'],['WHAT IT SUGGESTS','Proposed','#ffb020'],['WHAT YOU DECIDED','Approved','#7fd6a6'],['WHAT NOBODY KNOWS','Unknown','#9aa3b5'],['WHAT THE STORY CHANGED','On purpose','#ff4fa3']];const labels=[];
  fontsReady.then(()=>K.forEach((k,i)=>{const l=label([k[0],k[1]],k[2]);l.scale.multiplyScalar(0.7);g.add(l);labels.push({l,a:i/K.length*6.283});}));
  return {tint:'#3d6bff',path:[[0,V(0,3,12),C.clone()],[0.3,V(-24,8,-16),C.clone()],[0.6,V(0,1,-21),C.clone()],[0.8,V(22,-6,-36),C.clone()],[1,V(0,26,-10),C.clone()]],
    update(t,dt,warp){g.rotation.y=t*0.05;core.rotation.x=t*0.3;core.rotation.y=t*0.4;const b=1+Math.sin(t*2)*0.06;core.scale.set(b,b,b);
      pulses.forEach(o=>{o.u+=dt*o.v*(1+warp*6);if(o.u>1){o.u=0;o.e=edges[(Math.random()*edges.length)|0];}const a=pts[o.e[0]],c=pts[o.e[1]];o.s.position.lerpVectors(a,c,o.u);});
      labels.forEach((o,i)=>{const a=o.a+t*0.08;o.l.position.set(Math.cos(a)*19,Math.sin(t*0.3+i)*4,Math.sin(a)*19);});}};
};

/* Films: a projector beam onto a screen, dust in the light */
WORLDS.theatre=function(){
  const screen=new THREE.Mesh(new THREE.CylinderGeometry(70,70,26,64,1,true,Math.PI-0.45,0.9),new THREE.ShaderMaterial({side:THREE.BackSide,uniforms:{t:{value:0}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`varying vec2 vUv;uniform float t;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
      void main(){vec2 u=vUv;float fl=.85+.15*h(vec2(floor(t*18.),1.));vec3 c=mix(vec3(.55,.22,.06),vec3(1.,.72,.38),smoothstep(0.,1.,u.y*.8+.2*sin(u.x*3.+t*.3)));
        c*=fl;float g=h(u*vec2(900.,500.)+floor(t*24.));c+=(g-.5)*.12;float sc=step(.997,h(vec2(floor(u.x*240.),floor(t*12.))));c-=sc*.3;
        float vig=smoothstep(.0,.18,u.x)*smoothstep(1.,.82,u.x)*smoothstep(0.,.15,u.y)*smoothstep(1.,.85,u.y);gl_FragColor=vec4(c*vig*.36,1.);}`}));
  screen.position.set(0,4,-20);scene.add(screen);
  const beam=new THREE.Mesh(new THREE.ConeGeometry(16,110,48,1,true),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:ADD,side:THREE.DoubleSide,uniforms:{t:{value:0}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`varying vec2 vUv;uniform float t;void main(){float a=pow(vUv.y,1.4)*.075*(.8+.2*sin(vUv.x*40.+t*3.));gl_FragColor=vec4(vec3(1.,.66,.32)*a,a);}`}));
  beam.rotation.x=Math.PI/2;beam.position.set(0,5,-35);scene.add(beam);
  const DN=small?1200:2600,dp=new Float32Array(DN*3),dv=[];for(let i=0;i<DN;i++){const z=-Math.random()*100+18,r=Math.random()*(16*(18-z)/110+0.5);const a=Math.random()*6.28;dp[i*3]=Math.cos(a)*r;dp[i*3+1]=5+Math.sin(a)*r;dp[i*3+2]=z;dv.push(Math.random());}
  const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(dp,3));const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0xffd09a,size:0.09,transparent:true,opacity:.8,blending:ADD,depthWrite:false}));scene.add(dust);
  const proj=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('#ff9a3a'),blending:ADD,transparent:true,depthWrite:false}));proj.scale.set(5,5,1);proj.position.set(0,5,46);scene.add(proj);
  const rows=new THREE.Group();for(let r=0;r<7;r++)for(let s=-9;s<=9;s++){const m=new THREE.Mesh(new THREE.BoxGeometry(1.5,1.6,0.3),new THREE.MeshBasicMaterial({color:0x0b0d13}));m.position.set(s*1.9,-7+r*0.9,6-r*3.2);rows.add(m);}scene.add(rows);
  return {tint:'#ff7a2f',path:[[0,V(0,2,28),V(0,3,-90)],[0.5,V(0,0.5,0),V(0,4,-90)],[1,V(0,3,-40),V(0,4,-90)]],
    update(t){screen.material.uniforms.t.value=t;beam.material.uniforms.t.value=t;const P=dg.attributes.position.array;for(let i=0;i<DN;i++){P[i*3+1]+=Math.sin(t*0.5+dv[i]*20)*0.004;P[i*3]+=Math.cos(t*0.4+dv[i]*9)*0.003;}dg.attributes.position.needsUpdate=true;}};
};

/* Lab: the measurement grid, the exam's 37 cases standing on it */
WORLDS.grid=function(){
  const pg=new THREE.PlaneGeometry(420,420,70,70);const pa=pg.attributes.position;for(let i=0;i<pa.count;i++){const x=pa.getX(i),y=pa.getY(i);pa.setZ(i,Math.sin(x*0.05)*2.2+Math.cos(y*0.04)*2.6+Math.sin((x+y)*0.02)*3);}
  const terrain=new THREE.LineSegments(new THREE.WireframeGeometry(pg),new THREE.LineBasicMaterial({color:0xffb020,transparent:true,opacity:.16,blending:ADD}));terrain.rotation.x=-Math.PI/2;terrain.position.y=-8;scene.add(terrain);
  const pillars=[];for(let i=0;i<37;i++){const c=i%7,r=(i/7)|0,lit=i<16,h=lit?3+Math.random()*7:1.2+Math.random()*2;
    const m=new THREE.Mesh(new THREE.BoxGeometry(1.4,h,1.4),new THREE.MeshBasicMaterial({color:lit?0xffb020:0x2a3346,transparent:true,opacity:lit?.85:.7,blending:lit?ADD:THREE.NormalBlending}));m.position.set((c-3)*4,-8+h/2,-40-(r-2.5)*4);scene.add(m);
    const e=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:lit?0xffd27a:0x5b6273}));m.add(e);pillars.push({m,h,lit,ph:Math.random()*6});}
  const scan=new THREE.Mesh(new THREE.PlaneGeometry(70,0.35),new THREE.MeshBasicMaterial({color:0xffc35a,transparent:true,opacity:.9,blending:ADD,side:THREE.DoubleSide,depthWrite:false}));scan.rotation.x=-Math.PI/2;scan.position.set(0,-7.6,-40);scene.add(scan);
  const lock=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(6,6,6)),new THREE.LineBasicMaterial({color:0xffd27a,transparent:true,opacity:.9}));lock.position.set(0,12,-40);scene.add(lock);
  fontsReady.then(()=>{const l=label(['LOCKED EXAM · 37 CASES','16 of 37','Untrained local models, the same as believing every flag'],'#ffb020');l.position.set(0,19,-40);l.scale.multiplyScalar(0.9);scene.add(l);});
  return {tint:'#ffb020',path:[[0,V(0,8,26),V(0,2,-40)],[0.5,V(-26,6,-14),V(0,0,-42)],[1,V(18,22,-20),V(0,-4,-44)]],
    update(t){scan.position.z=-40+Math.sin(t*0.6)*18;lock.rotation.y=t*0.5;lock.rotation.x=t*0.3;pillars.forEach(p=>{if(p.lit)p.m.material.opacity=.6+.3*Math.sin(t*2+p.ph);});}};
};

const W=(WORLDS[cfg.world]||WORLDS.timelines)();
const path=W.path;cam.position.copy(path[0][1]);const look=path[0][2].clone();

/* shared: stars, streaks, lens */
const DN=small?2500:5000,dp=new Float32Array(DN*3);for(let i=0;i<DN;i++){dp[i*3]=(Math.random()-.5)*420;dp[i*3+1]=(Math.random()-.5)*80;dp[i*3+2]=60-Math.random()*400;}
const dgeo=new THREE.BufferGeometry();dgeo.setAttribute('position',new THREE.BufferAttribute(dp,3));
scene.add(new THREE.Points(dgeo,new THREE.PointsMaterial({color:0x8fa6ff,size:0.07,transparent:true,opacity:0.5,blending:ADD,depthWrite:false})));
const SN=small?600:1400,sp=new Float32Array(SN*6),sc=new Float32Array(SN*6),streaks=[];
for(let i=0;i<SN;i++){const a=Math.random()*Math.PI*2,r=2.2+Math.pow(Math.random(),.6)*17;streaks.push({x:Math.cos(a)*r,y:Math.sin(a)*r,z:-Math.random()*420,w:Math.random()<.22,g:0,l:.6+Math.random()*.9});}
const sgeo=new THREE.BufferGeometry();sgeo.setAttribute('position',new THREE.BufferAttribute(sp,3));sgeo.setAttribute('color',new THREE.BufferAttribute(sc,3));
const smesh=new THREE.LineSegments(sgeo,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0,blending:ADD,depthWrite:false,fog:false}));smesh.frustumCulled=false;cam.add(smesh);
let composer=null,fx=null,bloom=null;
if(!small&&THREE.EffectComposer&&THREE.RenderPass&&THREE.UnrealBloomPass&&THREE.ShaderPass){
  composer=new THREE.EffectComposer(renderer);composer.addPass(new THREE.RenderPass(scene,cam));
  bloom=new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth/2,innerHeight/2),0.8,0.55,0.14);composer.addPass(bloom);
  fx=new THREE.ShaderPass({uniforms:{tDiffuse:{value:null},amt:{value:0.004},vig:{value:0.55},blur:{value:0},flare:{value:0.3},asp:{value:innerWidth/innerHeight},tint:{value:new THREE.Vector3(.32,.48,1)}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform sampler2D tDiffuse;uniform float amt,vig,blur,flare,asp;uniform vec3 tint;varying vec2 vUv;float lum(vec3 c){return max(c.r,max(c.g,c.b));}
      void main(){vec2 c=vUv-.5;float d=length(c);vec3 acc=vec3(0.);float tot=0.;
        for(int i=0;i<16;i++){float f=float(i)/15.;float s=1.-blur*f*(.25+d*1.5);vec2 uv=.5+c*s;vec2 o=c*amt*(.4+d*2.)*(1.+f);float w=1.-f*.6;acc+=vec3(texture2D(tDiffuse,uv+o).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-o).b)*w;tot+=w;}
        vec3 col=acc/tot;vec3 st=vec3(0.);for(int i=-10;i<=10;i++){float fi=float(i);vec3 s=texture2D(tDiffuse,vUv+vec2(fi*.022,0.)).rgb;st+=max(0.,lum(s)-.62)*(1.-abs(fi)/11.);}col+=st*tint*flare*.22;
        for(int k=1;k<4;k++){float fk=float(k);vec2 uv=.5-c*(fk*.42);vec3 s=texture2D(tDiffuse,uv).rgb;float b=max(0.,lum(s)-.7);col+=b*mix(tint,vec3(1.),fk/4.)*blur*1.6*smoothstep(.7,0.,length((uv-.5)*vec2(asp,1.)));}
        float ring=smoothstep(.03,0.,abs(length((vUv-.5)*vec2(asp,1.))-.38-blur*.25));col+=ring*tint*blur*.6;col*=1.-vig*d*d*1.7;gl_FragColor=vec4(col,1.);}`});composer.addPass(fx);}

function prog(){const h=document.documentElement.scrollHeight-innerHeight;return h>0?Math.min(1,Math.max(0,scrollY/h)):0;}
function at(p){let i=0;while(i<path.length-2&&p>path[i+1][0])i++;const a=path[i],b=path[i+1];const t=Math.min(1,Math.max(0,(p-a[0])/((b[0]-a[0])||1)));const e=t*t*(3-2*t);return [a[1].clone().lerp(b[1],e),a[2].clone().lerp(b[2],e)];}
let lastY=scrollY,vel=0,warp=0,kick=motion&&!sessionStorage.getItem('vg-first')?0:(motion?1.1:0);sessionStorage.setItem('vg-first','1');
const curTint=new THREE.Color(W.tint);
window.WORLD_KICK=v=>{kick=Math.max(kick,v||0.8);};
let crossed=false;const hud=document.getElementById('hud');const clock=new THREE.Clock();
function frame(){requestAnimationFrame(frame);
  const dt=Math.min(clock.getDelta(),0.05),t=clock.elapsedTime,p=prog();
  const dy=scrollY-lastY;lastY=scrollY;vel=vel*0.85+Math.abs(dy)*0.15;
  const target=motion?Math.min(1,vel/55)+kick:0;warp+=(target-warp)*0.12;kick*=Math.pow(0.12,dt);
  const [pos,lk]=at(p);const sway=motion?V(Math.sin(t*.3)*.25,Math.cos(t*.23)*.15,0):V(0,0,0);
  cam.position.lerp(pos.add(sway),motion?0.09:1);look.lerp(lk,motion?0.09:1);cam.lookAt(look);cam.fov=60+warp*30;cam.updateProjectionMatrix();
  if(cfg.world==='timelines'&&hud){if(!crossed&&p>0.09&&p<0.16){crossed=true;hud.classList.add('on');kick=0.9;setTimeout(()=>hud.classList.remove('on'),1300);}if(p<0.05)crossed=false;}
  curTint.lerp(new THREE.Color(W.laneTint?W.laneTint(p):W.tint),0.05);
  W.update(t,dt,warp,p);
  const P=sgeo.attributes.position.array,C=sgeo.attributes.color.array,spd=(0.6+warp*95)*dt*10;const sparks=Math.random()<0.25+warp?(1+warp*30)|0:0;for(let k=0;k<sparks;k++)streaks[(Math.random()*SN)|0].g=1;const decay=Math.pow(0.04,dt);
  for(let i=0;i<SN;i++){const s=streaks[i];s.z+=spd;if(s.z>4)s.z-=420;s.g*=decay;const len=(0.05+warp*10)*s.l*(1+s.g*1.5),I=(0.3+s.g*3.2)*(0.5+warp),j=i*6;
    P[j]=s.x;P[j+1]=s.y;P[j+2]=s.z;P[j+3]=s.x*(1-warp*.02);P[j+4]=s.y*(1-warp*.02);P[j+5]=s.z-len;C[j]=(s.w?1:curTint.r)*I;C[j+1]=(s.w?1:curTint.g)*I;C[j+2]=(s.w?1:curTint.b)*I;C[j+3]=0;C[j+4]=0;C[j+5]=0;}
  sgeo.attributes.position.needsUpdate=true;sgeo.attributes.color.needsUpdate=true;smesh.material.opacity=Math.min(1,0.1+warp*1.3);
  if(fx){fx.uniforms.amt.value=0.004+warp*0.06;fx.uniforms.blur.value=warp*0.42;fx.uniforms.flare.value=0.3+warp*1.4;fx.uniforms.tint.value.set(curTint.r,curTint.g,curTint.b);}
  if(bloom)bloom.strength=0.8+warp*1.4;
  composer?composer.render():renderer.render(scene,cam);}
frame();
addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer&&composer.setSize(innerWidth,innerHeight);fx&&(fx.uniforms.asp.value=innerWidth/innerHeight);});
window.setMotion=on=>{motion=on&&!reduce;localStorage.setItem('vg-motion',on?'on':'off');document.body.classList.toggle('calm',!motion);};
document.body.classList.toggle('calm',!motion);
})();
