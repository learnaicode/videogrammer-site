/* "Solve a production problem": real V AI output where we have it, labelled illustration where we do not. */
(function(){
const root=document.getElementById('demo');if(!root||!window.LAST_LIGHT)return;
const esc=window.esc;
function sheet(name){const r=LAST_LIGHT[name]||[];let i=1;const sum=[];
  while(i<r.length&&(!(r[i]||[]).some(x=>x)||!(r[i][0]))){if((r[i]||[]).some(x=>x))sum.push(r[i].filter(Boolean).join(' '));i++;}const cols=r[i]||[];const rows=r.slice(i+1).filter(x=>x.some(Boolean));return {title:(r[0]||[''])[0],sum,cols,rows};}
const REAL='Real V AI output from the prototype, 13 November 2026. The film: The Last Light, a one-minute AI video made from a five-sentence story about a Kerala lighthouse keeper. Unedited draft.';
const P=[
 {k:'Pre-production · Story',c:'var(--pre)',t:'Turn five sentences into a film',
  situation:'A filmmaker has a story idea in five sentences and wants a one-minute vertical film for Instagram.',
  inputs:[['Needs','The story, the format, the platform, the length'],['Infers','Genre, tone, characters\' looks, the acts and beats'],['Asks you to confirm','Anything it added to your story, listed as "Added by V AI"']],
  from:'02 Story',real:true,
  ripple:['Characters and their looks go to the record','The beats set the shot plan','The logline goes to the release plan']},
 {k:'Production · Generated shots',c:'var(--prod)',t:'Plan the shots a generator will make',
  situation:'Every shot will be generated. Without a plan, each prompt is written alone, and the old keeper\'s face drifts from shot to shot.',
  inputs:[['Needs','The approved shot list and the look-lock sheet'],['Infers','Prompts, the reference each shot must start from, lengths that add up to the runtime'],['Asks you to confirm','The character wording that is pasted into every prompt']],
  from:'12 Generated shots',real:true,
  ripple:['Each take keeps the reference version it was made from','Continuity checkpoints are set for the riskiest shots','The edit plan inherits the shot lengths']},
 {k:'Production · The day breaks',c:'var(--prod)',t:'Rain stops the exterior shoot',
  situation:'Day 3 of a short film. At 10:40 heavy rain stops the beach exterior. The lead actor is free until 18:00 only.',
  inputs:[['Needs','The approved schedule, cast and location availability, scenes already shot'],['Infers','Which remaining scenes are interior or movable, and what each swap costs'],['Asks you','To approve one option. It will not invent availability it was not given']],
  illus:{cols:['Option','Scenes moved','Why it works','Trade-off','Check'],rows:[
   ['A · Swap in the interior','Sc 14, 15 (cottage, interior) from Day 5 to now','Same cast, location 8 min away, already dressed','Beach scenes 9–11 move to Day 5 morning','Day 5 weather unknown: flagged'],
   ['B · Shoot the close-ups under cover','Sc 10 close-ups under the pier','Keeps the beach geography; rain hidden in tight shots','Wides still owed; light will not match later','Continuity: wet hair must hold into Sc 11'],
   ['C · Wrap and recover','None today','No risk to the actor\'s hours','A full day lost','Not recommended unless A and B fail']]},
  ripple:['A revised call-sheet draft for the first AD to approve','The reason for the change is kept with the schedule','Sc 10 and 11 are flagged for a wet-hair continuity check']},
 {k:'Post-production · Continuity',c:'var(--post)',t:'Decide which shots must be checked',
  situation:'The shots are coming back from the generator. Which ones could break the film, and against what?',
  inputs:[['Needs','The record, the shot plan, the generated-shot plan'],['Infers','The riskiest shots and what to compare them against'],['Leaves to you','Every judgement: a flag is a question until you approve it']],
  from:'19 Continuity check',real:true,
  ripple:['Each check records what was seen, what was inferred, and what you decided','An approved correction stays in memory for the next version','The delivery trail lists every check']},
 {k:'Post-production · Delivery',c:'var(--post)',t:'Show what remains before delivery',
  situation:'The cut is nearly locked. What exactly must be handed over, and in what form?',
  inputs:[['Needs','The brief\'s platform and format, the edit plan, titles and credits'],['Infers','Masters, specs, captions and paperwork for that platform'],['Asks you to confirm','Anything that depends on a contract or a distributor']],
  from:'24 Lock, grade and delivery',real:true,
  ripple:['The deliverables list becomes the final checklist','Every AI shot carries its tool and approval in the trail']}
];
const FLOW=['Problem','Project context','Proposed action','Tool run','Checked deliverable','Approved update'];
root.innerHTML=`<div class="pick">${P.map((p,i)=>`<button data-i="${i}" style="--c:${p.c}"><span class="k">${esc(p.k)}</span><span class="t">${esc(p.t)}</span></button>`).join('')}</div><div class="stage" id="dStage"></div>`;
let timer=null;
function show(i){const p=P[i];root.querySelectorAll('.pick button').forEach((b,j)=>b.classList.toggle('on',j===i));const st=document.getElementById('dStage');st.style.setProperty('--c',p.c);
  const d=p.real?sheet(p.from):{title:'Three ways to save the day',sum:[],cols:p.illus.cols,rows:p.illus.rows};
  st.innerHTML=`<div class="slate" style="color:${p.c}">${esc(p.k)}</div><h3 style="margin:8px 0 10px">${esc(p.t)}</h3><p>${esc(p.situation)}</p>
   <div class="flow">${FLOW.map(f=>`<span>${f}</span>`).join('')}</div>
   <dl class="kv">${p.inputs.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl>
   <div id="dOut" style="opacity:0;transition:opacity .5s"><div class="slate" style="margin-top:6px">${esc(d.title)}</div>
   ${d.sum.length?`<ul style="margin:8px 0 0 18px;font-size:13.5px;color:#cfd5e2">${d.sum.slice(0,4).map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}
   <div class="out"><table><thead><tr>${d.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${d.rows.slice(0,40).map((r,k)=>`<tr style="animation-delay:${Math.min(k,20)*.04}s">${d.cols.map((c,j)=>`<td>${esc(r[j]||'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
   <div class="label"><b>${p.real?'Real output':'Illustration'}</b><span>${p.real?esc(REAL):'An invented example to show the workflow. No real production, schedule or result is shown here. In the product this step reads your real schedule and will not propose a plan without it.'}</span></div>
   <div class="ripple"><span class="slate" style="margin-right:6px">What changes downstream</span>${p.ripple.map(r=>`<i>${esc(r)}</i>`).join('')}</div></div>`;
  const spans=[...st.querySelectorAll('.flow span')];let k=0;clearInterval(timer);window.WORLD_KICK&&window.WORLD_KICK(.5);
  const calm=document.body.classList.contains('calm');
  const tickF=()=>{spans.forEach((s,j)=>{s.classList.toggle('lit',j===k);s.classList.toggle('done',j<k);});if(k===4)document.getElementById('dOut').style.opacity=1;if(k>=spans.length){spans.forEach(s=>{s.classList.remove('lit');s.classList.add('done');});clearInterval(timer);}k++;};
  if(calm){k=6;spans.forEach(s=>s.classList.add('done'));document.getElementById('dOut').style.opacity=1;}else{tickF();timer=setInterval(tickF,520);}}
root.addEventListener('click',e=>{const b=e.target.closest('.pick button');if(b)show(+b.dataset.i);});
show(0);
})();
