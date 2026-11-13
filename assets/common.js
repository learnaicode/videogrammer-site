(function(){
const here=(document.body.dataset.page||'home');
const NAV=[['films','Films','films.html'],['studio','Studios','studio.html'],['process','Process','process.html'],['school','School','school.html'],['vai','V AI','vai.html'],['research','Research','research.html']];
const head=document.createElement('header');head.className='top';
head.innerHTML=`<div class="wrap"><a class="brand logo" href="index.html" aria-label="Videogrammer home"><img src="assets/logo/mark.png" alt="" class="lm"><span class="lt">Videogrammer</span></a>
<button id="burger" aria-expanded="false" aria-controls="mainnav">Menu</button>
<nav class="main" id="mainnav">${NAV.map(([k,l,h])=>`<a href="${h}" class="${k===here?'on':''}">${l}</a>`).join('')}<button class="tog" id="motionTog" aria-pressed="true">Motion on</button>${here==='school'?'<a class="cta" href="school.html#interest">Register interest</a>':'<a class="cta" href="studio.html#enquire">Make a film with us</a>'}</nav></div>`;
document.body.prepend(head);
const foot=document.createElement('footer');foot.className='foot';
foot.innerHTML=`<div class="wrap">
<div><a class="brand logo" href="index.html" aria-label="Videogrammer home"><img src="assets/logo/mark.png" alt="" class="lm"><span class="lt">Videogrammer</span></a><p style="margin-top:12px;max-width:380px;font-size:14px">A film school, a film studio, and V AI: the guide that holds what your film has established. London · Dubai · India.</p></div>
<div><h5>Videogrammer Studios</h5><a href="studio.html#enquire">Commission a film</a><a href="process.html">Process</a><a href="films.html">Films</a><a href="mailto:guru@videogrammer.com">guru@videogrammer.com</a></div>
<div><h5>Learn</h5><a href="school.html">AI Film School</a><a href="school.html#open">The 48-week programme</a><a href="https://www.skool.com/videogrammer-8702/classroom">Classroom</a></div>
<div><h5>Build</h5><a href="vai.html">V AI</a><a href="vai.html#steps">The 25 steps</a><a href="research.html">Research</a><a href="mailto:guru@videogrammer.com">guru@videogrammer.com</a></div>
<div class="fine">© 2026 Videogrammer. All rights reserved.</div></div>`;
document.body.append(foot);
const wa=document.createElement('a');wa.className='wa';wa.href='https://wa.me/16504437662';wa.textContent='WhatsApp';wa.rel='noopener';document.body.append(wa);
if(!document.getElementById('hud')){const h=document.createElement('div');h.id='hud';h.innerHTML='<div class="a">ENTERING</div><div class="b">Your film</div>';document.body.append(h);}
const wc=document.getElementById('world'),vl=document.querySelector('.veil');
const dim=()=>{head.classList.toggle('solid',scrollY>40);const k=Math.min(1,scrollY/(innerHeight*0.7));if(wc)wc.style.opacity=String(1-k*0.62);if(vl)vl.style.opacity=String(0.6+k*0.4);};
addEventListener('scroll',dim,{passive:true});dim();
document.getElementById('burger').onclick=e=>{const n=document.getElementById('mainnav');n.classList.toggle('open');e.target.setAttribute('aria-expanded',n.classList.contains('open'));};
const mt=document.getElementById('motionTog');const setT=()=>{const on=!document.body.classList.contains('calm');mt.textContent=on?'Motion on':'Motion off';mt.setAttribute('aria-pressed',on);};
mt.onclick=()=>{const on=document.body.classList.contains('calm');window.setMotion&&window.setMotion(on);document.body.classList.toggle('calm',!on);setT();};setTimeout(setT,50);
/* jump between worlds */
const NAMES={'index.html':'The map','studio.html':'The studio','school.html':'The school','vai.html':'V AI','films.html':'The films','research.html':'Research','process.html':'Process'};
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||a.target==='_blank'||e.metaKey||e.ctrlKey)return;const href=a.getAttribute('href');const file=href.split('#')[0];
  if(!NAMES[file]||file===(location.pathname.split('/').pop()||'index.html'))return;if(document.body.classList.contains('calm'))return;
  e.preventDefault();const h=document.getElementById('hud');if(h){h.querySelector('.a').textContent='TRAVELLING TO';h.querySelector('.b').textContent=NAMES[file];h.classList.add('on');}
  window.WORLD_KICK&&window.WORLD_KICK(1.6);document.body.classList.add('leaving');setTimeout(()=>location.href=href,620);});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
window.esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* the 25 steps map, wherever a page has #stepsMap */
const sm=document.getElementById('stepsMap');
if(sm&&window.STEPS){const L=[['pre','Pre-production','Before a frame is shot','var(--pre)'],['prod','Production','On the floor','var(--prod)'],['post','Post-production','After the wrap','var(--post)']];
  sm.innerHTML=L.map(([k,n,sub,c])=>{const ss=STEPS.filter(s=>s.lane===k);return `<div class="lane rv" style="--c:${c}"><h3>${n}</h3><div class="sub">${sub} · ${ss.length} steps</div>${ss.map((s,i)=>`<button class="step"><b>${String(i+1).padStart(2,'0')}</b><span>${esc(s.name)}${s.early?'<em class="early">● early engine</em>':''}<small><strong style="color:#e9edf5">The problem.</strong> ${esc(s.problem)}<br><strong style="color:#e9edf5">What V AI does.</strong> ${esc(s.does)}</small></span></button>`).join('')}</div>`;}).join('');
  sm.addEventListener('click',e=>{const b=e.target.closest('.step');if(b)b.classList.toggle('open');});
  sm.querySelectorAll('.rv').forEach(el=>io.observe(el));}
/* films grid, wherever a page has #filmsGrid */
const fg=document.getElementById('filmsGrid');
if(fg&&window.FILMS){const lim=+(fg.dataset.limit||99);fg.innerHTML=FILMS.slice(0,lim).map(f=>`<a class="film rv" href="https://www.youtube.com/watch?v=${f.yt}" target="_blank" rel="noopener"><div class="im" style="background-image:url(https://i.ytimg.com/vi/${f.yt}/hqdefault.jpg)"></div><div class="tx"><div class="slate">${esc(f.no)} · ${esc(f.type)} · ${esc(f.language)} · ${esc(f.released_display)}</div><h4>${esc(f.title)}</h4><p>${esc(f.logline)}</p>${fg.dataset.full?`<p style="margin-top:8px;font-size:12.5px"><b style="color:#e9edf5">Made with:</b> ${esc(f.provenance)} ${esc(f.tools||'')}</p>`:''}</div></a>`).join('');
  fg.querySelectorAll('.rv').forEach(el=>io.observe(el));}
})();
