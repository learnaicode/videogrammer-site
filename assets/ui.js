/* Small, honest interactions: tabs, click-to-play films, enquiry forms that prepare an email. */
(function(){
/* tabs with keyboard support */
document.querySelectorAll('[role="tablist"]').forEach(list=>{
  const tabs=[...list.querySelectorAll('[role="tab"]')];
  const select=t=>{tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;const p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on;});};
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(t));t.addEventListener('keydown',e=>{let j=null;if(e.key==='ArrowRight')j=(i+1)%tabs.length;if(e.key==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;if(e.key==='Home')j=0;if(e.key==='End')j=tabs.length-1;if(j!==null){e.preventDefault();select(tabs[j]);tabs[j].focus();}});});
});
/* click to play: the YouTube player loads only when asked */
document.querySelectorAll('.player[data-yt]').forEach(b=>b.addEventListener('click',()=>{
  const f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+b.dataset.yt+'?autoplay=1&rel=0';f.title=b.getAttribute('aria-label')||'Film';
  f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.className='playerframe';b.replaceWith(f);f.focus();}));
/* enquiry forms: validate, then open the visitor's email app with the brief. Nothing is claimed as sent. */
document.querySelectorAll('form.enq').forEach(form=>form.addEventListener('submit',e=>{
  e.preventDefault();const msg=form.querySelector('.formmsg');const bad=[...form.querySelectorAll('[required]')].filter(el=>!el.value.trim()||(el.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim())));
  form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
  if(bad.length){bad.forEach(el=>el.setAttribute('aria-invalid','true'));bad[0].focus();msg.textContent='Please fill in: '+bad.map(el=>el.closest('label').firstChild.textContent.trim()).join(', ')+'.';msg.className='formmsg err';return;}
  const v=n=>{const el=form.querySelector('[name="'+n+'"]');return el?el.value.trim():'';};
  const body=['Name: '+v('name'),'Email: '+v('email'),'Need: '+v('type'),v('length')?'Detail: '+v('length'):'',v('date')?'Date / place: '+v('date'):'',v('budget')?'Budget: '+v('budget'):'',(form.querySelector('[name=notify]')||{}).checked?'Please email me when enrolment opens.':'','',v('brief'),'','(Sent from videogrammer.com)'].filter((x,i,a)=>x!==''||a[i-1]!=='').join('\n');
  const href='mailto:guru@videogrammer.com?subject='+encodeURIComponent(form.dataset.subject+': '+v('name'))+'&body='+encodeURIComponent(body);
  window.location.href=href;
  msg.innerHTML='Your email app should now open with the message ready. Press send there to reach us. If nothing opened, write to <a href="mailto:guru@videogrammer.com">guru@videogrammer.com</a> or use WhatsApp.';msg.className='formmsg';
}));
})();
