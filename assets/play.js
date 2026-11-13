/* Interactive pieces on the homepage: spot the break, the script that points back, the jacket across three timelines. */
(function(){
const calm=()=>document.body.classList.contains('calm');

/* ---------- 1. Spot the break: two drawn shots of Salt Road ---------- */
function drawShot(cv,v){
  const W=1200,H=675;cv.width=W;cv.height=H;const g=cv.getContext('2d');
  const sky=g.createLinearGradient(0,0,0,H*.64);sky.addColorStop(0,'#1d1830');sky.addColorStop(.55,'#7a3f4e');sky.addColorStop(1,'#f0935a');g.fillStyle=sky;g.fillRect(0,0,W,H);
  const sx=W*.86,sy=H*.6;const sun=g.createRadialGradient(sx,sy,0,sx,sy,W*.45);sun.addColorStop(0,'rgba(255,214,150,.95)');sun.addColorStop(.08,'rgba(255,170,90,.75)');sun.addColorStop(.35,'rgba(240,120,70,.18)');sun.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=sun;g.fillRect(0,0,W,H);
  g.fillStyle='#ffe2b0';g.beginPath();g.arc(sx,sy,26,0,7);g.fill();
  g.fillStyle='#3a2a3d';g.beginPath();g.moveTo(0,H*.6);for(let x=0;x<=W;x+=40)g.lineTo(x,H*.6-12-Math.abs(Math.sin(x*.011))*34-Math.sin(x*.037)*8);g.lineTo(W,H*.64);g.lineTo(0,H*.64);g.fill();
  const gr=g.createLinearGradient(0,H*.62,0,H);gr.addColorStop(0,'#d9b9b4');gr.addColorStop(.4,'#b6939a');gr.addColorStop(1,'#5a4250');g.fillStyle=gr;g.fillRect(0,H*.62,W,H);
  g.strokeStyle='rgba(255,240,230,.18)';g.lineWidth=1;for(let i=0;i<26;i++){const y=H*.64+i*i*.55;g.beginPath();g.moveTo(0,y);g.lineTo(W,y+((i%2)?6:-6));g.stroke();}
  g.fillStyle='rgba(255,200,150,.25)';g.beginPath();g.moveTo(sx-40,H*.64);g.lineTo(sx+40,H*.64);g.lineTo(W*.95,H);g.lineTo(W*.7,H);g.fill();
  /* jeep */
  g.fillStyle='#16121a';g.beginPath();g.moveTo(W*.64,H*.72);g.lineTo(W*.66,H*.6);g.lineTo(W*.76,H*.58);g.lineTo(W*.8,H*.5);g.lineTo(W*.9,H*.5);g.lineTo(W*.92,H*.6);g.lineTo(W*.97,H*.62);g.lineTo(W*.97,H*.72);g.fill();
  g.fillStyle='rgba(255,190,130,.35)';g.fillRect(W*.81,H*.515,W*.07,H*.06);
  [[W*.7,H*.73],[W*.92,H*.73]].forEach(([x,y])=>{g.fillStyle='#0b0a0d';g.beginPath();g.arc(x,y,32,0,7);g.fill();g.fillStyle='#2a2430';g.beginPath();g.arc(x,y,13,0,7);g.fill();});
  /* Ravi, leaning on the bonnet, facing camera */
  const rx=W*.6,ry=H*.36;g.fillStyle='#7d6a45';g.beginPath();g.moveTo(rx-58,ry+70);g.quadraticCurveTo(rx-66,ry+150,rx-62,ry+250);g.lineTo(rx+62,ry+250);g.quadraticCurveTo(rx+66,ry+150,rx+58,ry+70);g.quadraticCurveTo(rx,ry+48,rx-58,ry+70);g.fill();
  g.strokeStyle='rgba(255,200,140,.55)';g.lineWidth=4;g.beginPath();g.moveTo(rx+58,ry+72);g.quadraticCurveTo(rx+66,ry+150,rx+62,ry+250);g.stroke();
  g.fillStyle='#2b2230';g.fillRect(rx-40,ry+250,32,90);g.fillRect(rx+8,ry+250,32,90);
  g.fillStyle='#8a5a44';g.beginPath();g.ellipse(rx,ry+18,30,38,0,0,7);g.fill();g.fillStyle='rgba(255,190,140,.5)';g.beginPath();g.ellipse(rx+10,ry+18,16,34,0,0,7);g.fill();
  g.fillStyle='#1c1418';g.beginPath();g.ellipse(rx,ry-8,31,18,0,Math.PI,0);g.fill();
  const cx=v.cig==='R'?rx-32:rx+32;g.save();g.translate(cx,ry+4);g.rotate(v.cig==='R'?-.5:.5);g.fillStyle='#f4efe6';g.fillRect(-3,-15,6,30);g.fillStyle='#c98a4a';g.fillRect(-3,11,6,5);g.restore();
  /* Asha with the broken bicycle */
  const ax=W*.3,ay=H*.4;g.strokeStyle='#120f14';g.lineWidth=5;[[ax+70,ay+250],[ax+190,ay+246]].forEach(([x,y],i)=>{g.beginPath();g.ellipse(x,y,46,i?30:46,i?.4:0,0,7);g.stroke();});
  g.beginPath();g.moveTo(ax+70,ay+250);g.lineTo(ax+120,ay+190);g.lineTo(ax+180,ay+200);g.lineTo(ax+190,ay+246);g.moveTo(ax+120,ay+190);g.lineTo(ax+110,ay+170);g.stroke();
  g.fillStyle='#2a1f2a';g.beginPath();g.moveTo(ax-52,ay+64);g.quadraticCurveTo(ax-70,ay+160,ax-60,ay+300);g.lineTo(ax+56,ay+300);g.quadraticCurveTo(ax+66,ay+160,ax+48,ay+64);g.quadraticCurveTo(ax,ay+44,ax-52,ay+64);g.fill();
  g.strokeStyle='rgba(255,180,130,.4)';g.lineWidth=3;g.beginPath();g.moveTo(ax+48,ay+66);g.quadraticCurveTo(ax+66,ay+160,ax+56,ay+300);g.stroke();
  g.strokeStyle='#2a1f2a';g.lineWidth=16;g.lineCap='round';g.beginPath();g.moveTo(ax+40,ay+100);g.lineTo(ax+98,ay+168);g.stroke();
  g.fillStyle='#8a5a44';g.beginPath();g.arc(ax+104,ay+172,10,0,7);g.fill();g.fillStyle='#d8dde6';g.beginPath();g.arc(ax+100,ay+170,4,0,7);g.fill();
  g.fillStyle='#8a5a44';g.beginPath();g.ellipse(ax,ay+14,27,34,0,0,7);g.fill();g.fillStyle='rgba(255,190,140,.45)';g.beginPath();g.ellipse(ax+9,ay+14,13,30,0,0,7);g.fill();
  g.fillStyle=v.scarf;g.beginPath();g.moveTo(ax-36,ay+30);g.quadraticCurveTo(ax-40,ay-34,ax,ay-36);g.quadraticCurveTo(ax+40,ay-34,ax+36,ay+30);g.quadraticCurveTo(ax+30,ay-6,ax,ay-12);g.quadraticCurveTo(ax-30,ay-6,ax-36,ay+30);g.fill();
  g.beginPath();g.moveTo(ax-34,ay+36);g.quadraticCurveTo(ax,ay+60,ax+36,ay+36);g.lineTo(ax+30,ay+58);g.quadraticCurveTo(ax,ay+76,ax-28,ay+58);g.fill();
  g.beginPath();g.moveTo(ax+20,ay+56);g.lineTo(ax+46,ay+120);g.lineTo(ax+30,ay+124);g.lineTo(ax+10,ay+60);g.fill();
  g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.moveTo(ax-34,ay+40);g.quadraticCurveTo(ax,ay+60,ax+36,ay+40);g.lineTo(ax+34,ay+46);g.quadraticCurveTo(ax,ay+66,ax-34,ay+46);g.fill();
  /* film grain, vignette, letterbox, slate */
  for(let i=0;i<2600;i++){g.fillStyle=`rgba(255,255,255,${Math.random()*.05})`;g.fillRect(Math.random()*W,Math.random()*H,1.4,1.4);}
  const vg=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=vg;g.fillRect(0,0,W,H);
  g.fillStyle='#000';g.fillRect(0,0,W,46);g.fillRect(0,H-46,W,46);
  g.fillStyle='rgba(233,237,245,.85)';g.font='500 20px "IBM Plex Mono",monospace';g.fillText(v.slate,24,H-16);
}
const A=document.getElementById('sbA'),B=document.getElementById('sbB');
if(A&&B){
  const shotA={scarf:'#e8c23a',cig:'R',slate:'SALT ROAD  ·  SC 4  ·  SHOT 1  ·  DAY 2'},shotB={scarf:'#e0662a',cig:'L',slate:'SALT ROAD  ·  SC 4  ·  SHOT 4  ·  DAY 9'};
  const marks=[];const targets=[
    {id:'scarf',x:.3,y:.37,r:.075,say:'The headscarf. Yellow in shot 1, orange in shot 4.'},
    {id:'cig',x:.6,y:.37,r:.07,say:"The cigarette. It moved from Ravi's right ear to his left, and he had already taken it in shot 2."}];
  const found=new Set();const msg=document.getElementById('sbMsg'),score=document.getElementById('sbScore'),res=document.getElementById('sbResult');let misses=0;
  const pics={};
  const drawPic=(cv,v,im)=>{if(!im)return drawShot(cv,v);cv.width=1600;cv.height=900;const g=cv.getContext('2d');const s=Math.max(cv.width/im.naturalWidth,cv.height/im.naturalHeight);const w=im.naturalWidth*s,h=im.naturalHeight*s;g.drawImage(im,(cv.width-w)/2,(cv.height-h)/2,w,h);
    g.fillStyle='rgba(0,0,0,.55)';g.fillRect(0,cv.height-40,cv.width,40);g.fillStyle='rgba(233,237,245,.85)';g.font='500 18px "IBM Plex Mono",monospace';g.fillText(v.slate,20,cv.height-14);};
  [['a','assets/img/spot-shot1.jpg'],['b','assets/img/spot-shot4.jpg']].forEach(([k,u])=>{const im=new Image();im.onload=()=>{pics[k]=im;if(pics.a&&pics.b){Object.assign(targets[0],{x:.34,y:.36,r:.085});Object.assign(targets[1],{x:.674,y:.15,r:.07});}paint();};im.src=u;});
  const paint=()=>{drawPic(A,shotA,pics.a&&pics.b?pics.a:null);drawPic(B,shotB,pics.a&&pics.b?pics.b:null);[A,B].forEach(cv=>{const g=cv.getContext('2d');marks.forEach(m=>{const t=targets.find(x=>x.id===m);g.strokeStyle='#ffb020';g.lineWidth=6;g.beginPath();g.arc(t.x*cv.width,t.y*cv.height,t.r*cv.width,0,7);g.stroke();g.lineWidth=2;g.beginPath();g.arc(t.x*cv.width,t.y*cv.height,t.r*cv.width+14,0,7);g.stroke();});});};
  (document.fonts&&document.fonts.ready||Promise.resolve()).then(paint);paint();
  const reveal=()=>{targets.forEach(t=>{if(!found.has(t.id)){found.add(t.id);marks.push(t.id);}});paint();score.textContent=`${found.size} of 2 found`;res.hidden=false;document.getElementById('sbReveal').hidden=true;if(!calm())res.scrollIntoView({behavior:'smooth',block:'nearest'});};
  const hit=(cv,e)=>{const r=cv.getBoundingClientRect();const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;const ratio=r.width/r.height;
    const t=targets.find(t=>!found.has(t.id)&&Math.hypot(x-t.x,(y-t.y)/ratio*1)<t.r*1.25);
    if(t){found.add(t.id);marks.push(t.id);paint();msg.textContent='Yes. '+t.say;msg.className='spmsg ok';}
    else{misses++;msg.textContent=misses>=2?'Not there. Look at what they wear on their heads, and near their ears.':'Not there. Keep looking.';msg.className='spmsg';}
    score.textContent=`${found.size} of 2 found`;if(found.size===2)setTimeout(reveal,700);};
  [A,B].forEach(cv=>cv.addEventListener('click',e=>hit(cv,e)));
  document.getElementById('sbReveal').addEventListener('click',reveal);
}

/* ---------- 2. The script that points back ---------- */
document.querySelectorAll('.scriptlink').forEach(box=>{
  const on=k=>box.querySelectorAll('[data-k]').forEach(el=>el.classList.toggle('lit',el.dataset.k===k));
  box.querySelectorAll('.chips [data-k]').forEach(c=>{['mouseenter','focus'].forEach(ev=>c.addEventListener(ev,()=>on(c.dataset.k)));c.addEventListener('click',()=>on(c.dataset.k));});
  box.addEventListener('mouseleave',()=>on(''));
});

/* ---------- 3. One jacket, three timelines ---------- */
const jt=document.getElementById('jacket');
if(jt){
  const tiles=[...jt.querySelectorAll('.jt')];const notes={story:'Story time: the order things happen in the characters\' lives. The jacket is whole until the fight in scene 4, and whole again in the flashback to the week before.',shoot:'Shooting order: the fight is shot on day 9, after scenes shot on days 1 to 7. The costume team must know which scenes come after the tear, whatever day they are shot.',edit:'Edit order: the flashback is cut in after the fight. It still needs the whole jacket, even though it plays later on screen.'};
  const set=mode=>{const first=new Map(tiles.map(t=>[t,t.getBoundingClientRect()]));tiles.forEach(t=>{t.style.order=t.dataset[mode];t.querySelector('.when').textContent=t.dataset[mode+'Label'];});
    jt.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode));document.getElementById('jtNote').textContent=notes[mode];
    if(calm())return;tiles.forEach(t=>{const a=first.get(t),b=t.getBoundingClientRect();const dx=a.left-b.left,dy=a.top-b.top;if(!dx&&!dy)return;t.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.9,.2,1)'});});};
  jt.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>set(b.dataset.mode)));set('story');
}
})();
