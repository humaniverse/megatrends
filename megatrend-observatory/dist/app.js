'use strict';
const $ = selector => document.querySelector(selector);
const icons = {
 orbit:'<circle cx="12" cy="12" r="6"/><ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-35 12 12)"/>',
 book:'<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1zM12 6v14"/>',
 bookmark:'<path d="M6 3.5h12v17l-6-4-6 4z"/>',
 time:'<path d="M3 9a9 9 0 1 1 1.4 8M3 4v5h5M12 7v5l3 2"/>',
 shuffle:'<path d="M3 6h3c4 0 7 12 11 12h4m-3-3 3 3-3 3M3 18h3c1.8 0 3.2-2.1 4.5-4.3M13.5 9C14.7 7.2 15.8 6 17 6h4m-3-3 3 3-3 3"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 list:'<path d="M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1"/>',
 chip:'<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M8 2v3m4-3v3m4-3v3M8 19v3m4-3v3m4-3v3M2 8h3m-3 4h3m-3 4h3m14-8h3m-3 4h3m-3 4h3"/>',
 leaf:'<path d="M4 16C3 7 12 4 21 3c-1 9-4 17-12 16M3 21l12-12"/>',
 people:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-4 2.5-7 7-7s7 3 7 7M16 5a3 3 0 0 1 0 6m2 3c2.5.5 4 2.5 4 5"/>',
 city:'<path d="M2 21h20M4 21V9l6-3v15m0-16 7-3v19m0-11 4 2v9M6 12v1m7-5v1m0 4v1"/>',
 work:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12q9 6 18 0M10 14h4"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M20 4l-2 2M6 18l-2 2"/>',
 close:'<path d="m5 5 14 14M19 5 5 19"/>',
 link:'<path d="m9 15 6-6m-5-2 2-2a4.2 4.2 0 0 1 6 6l-2 2m-2 4-2 2a4.2 4.2 0 0 1-6-6l2-2"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
 paths:'<path d="M5 20v-5c0-5 11-3 11-9V3M5 14c0-3 0-6 0-10"/><circle cx="5" cy="3" r="1"/><circle cx="16" cy="3" r="1"/>',
 check:'<path d="m4 12 5 5L20 6"/>'
};
function icon(name){ return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>'; }
document.querySelectorAll('[data-i]').forEach(el=>el.outerHTML=icon(el.dataset.i));
const domains = {'All trends':'',Technology:'#a5bf5c',Environment:'#d28e60',Society:'#a48cc7',Economy:'#cfaf5c'};
const palette = {intelligence:'#deed92',climate:'#f4c19d',population:'#d9cef1',cities:'#bce2dc',work:'#f1d69b',energy:'#bed3e7'};
const params = new URLSearchParams(location.search);
let year = HORIZONS.includes(Number(params.get('year'))) ? Number(params.get('year')) : 2025;
let domain = Object.hasOwn(domains,params.get('theme')) ? params.get('theme') : 'All trends';
let saved = new Set();
let layout = 'grid';
try {
 const stored=JSON.parse(localStorage.getItem('longview.saved')||'[]');
 if(Array.isArray(stored)) saved=new Set(stored.filter(id=>TRENDS.some(t=>t.id===id)));
 if(localStorage.getItem('longview.layout')==='list')layout='list';
} catch {}
const panel=$('#panel');
let lastSurprise='', activeDetail=null, returnFocus=null;
const stageType = () => year>2025?'Possible future':'Historical snapshot';
const currentTrends = () => TRENDS.filter(t=>domain==='All trends'||t.domain===domain);
function say(message){$('#announce').textContent=message;}
function queryState(){
 const url=new URL(location.href);
 if(year===2025)url.searchParams.delete('year');else url.searchParams.set('year',String(year));
 if(domain==='All trends')url.searchParams.delete('theme');else url.searchParams.set('theme',domain);
 if (location.protocol !== 'file:') history.replaceState(history.state,'',url);
}
function yearState(next){
 year=next;queryState();renderYears();renderCards();say('Showing '+stageType().toLowerCase()+'s for '+year+'.');
}
function renderYears(){
 const host=$('#main-years');
 if(!host.childElementCount)host.innerHTML=HORIZONS.map(y=>'<button class="year '+(y>2025?'future':'')+'" data-year="'+y+'" aria-label="'+y+', '+(y>2025?'possible future':'historical snapshot')+'" title="'+(y>2025?'Possible future':'Historical snapshot')+'"><span class="year-marker"></span><span class="year-text">'+y+'</span></button>').join('');
 host.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.year)===year));
}
function categoryLabel(t){return '<span class="card-domain">'+icon(t.icon)+t.domain+'</span>';}
function bookmark(t){
 return '<button class="bookmark" data-save="'+t.id+'" aria-label="'+(saved.has(t.id)?'Remove '+t.name+' from saved trends':'Save '+t.name)+'" title="'+(saved.has(t.id)?'Remove from saved':'Save trend')+'" aria-pressed="'+saved.has(t.id)+'">'+icon('bookmark')+'</button>';
}
function renderCards(){
 const host=$('#cards'),trends=currentTrends(),idx=HORIZONS.indexOf(year);
 $('#result-count').textContent=String(trends.length).padStart(2,'0');
 host.className='cards '+layout;
 $('#grid-view').setAttribute('aria-pressed',layout==='grid');$('#list-view').setAttribute('aria-pressed',layout==='list');
 host.innerHTML=trends.map(t=>'<article class="trend-card" style="--plate:'+palette[t.id]+'"><div class="plate"><img src="../assets/'+t.id+'.webp" alt="" width="1000" height="470">'+(layout==='grid'?categoryLabel(t):'')+'</div>'+bookmark(t)+'<div class="card-body">'+(layout==='list'?categoryLabel(t):'')+'<h3 class="card-title"><button class="open-card" data-trend="'+t.id+'">'+t.name+'</button></h3><p>'+t.stages[idx][1]+'</p><div class="card-meta">'+icon(year>2025?'paths':'clock')+year+'<span aria-hidden="true">/</span>'+stageType()+'</div></div></article>').join('');
}
function renderFilters(){
 const h=$('.filters');
 if(!h.childElementCount)h.innerHTML=Object.entries(domains).map(([key,color])=>'<button class="filter" data-filter="'+key+'">'+(color?'<span class="swatch" style="background:'+color+'"></span>':'')+key+'</button>').join('');
 h.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter===domain));
}
function selectDomain(value){
 domain=value;queryState();renderFilters();renderCards();say('Showing '+currentTrends().length+' '+(domain==='All trends'?'':domain.toLowerCase()+' ')+'trends.');
}
function toggleSave(id){
 if(saved.has(id))saved.delete(id);else saved.add(id);
 try{localStorage.setItem('longview.saved',JSON.stringify([...saved]));}catch{}
 $('.saved-count').textContent=saved.size;
 const trend=TRENDS.find(t=>t.id===id);
 say(trend.name+(saved.has(id)?' saved.':' removed from saved trends.'));
}
function browse(){
 if(panel.open)closePanel();
 $('#index').scrollIntoView({behavior:'instant',block:'start'});$('#index').focus({preventScroll:true});
}
const closeButton='<button class="close" data-close aria-label="Close dialog">'+icon('close')+'</button>';
function snapshot(t){
 const point=t.stages[HORIZONS.indexOf(year)];
 return '<div class="detail-years" role="group" aria-label="Trend timeline">'+HORIZONS.map(y=>'<button data-detail-year="'+y+'" aria-pressed="'+(y===year)+'">'+y+'</button>').join('')+'</div><div aria-live="polite"><div class="tiny-label">'+stageType()+' · '+year+'</div><h3>'+point[0]+'</h3><p>'+point[1]+'</p><p>'+point[2]+'</p></div>';
}
function sourceList(sources){return '<ul class="source-list">'+sources.map(([label,url])=>'<li><a href="'+url+'" target="_blank" rel="noopener noreferrer">'+label+'</a></li>').join('')+'</ul>';}
const researchPaths = {
 intelligence: [['From AI tools to autonomous infrastructure','../priorities/index.html#machine-agency'], ['The return of the human','../scenarios/index.html#return-of-the-human']],
 climate: [['Climate-driven reorganisation of society','../priorities/index.html#climate-reorganisation'], ['The next generation of trends','../next/index.html']],
 population: [['Demographic bifurcation','../priorities/index.html#demographic-bifurcation'], ['The inversion of demographic vulnerability','../scenarios/index.html#demographic-inversion']],
 cities: [['Who controls network infrastructure?','../priorities/index.html#network-power'], ['A polycentric or shrinking urban future','../scenarios/index.html#cities']],
 work: [['The changing balance of economic power','../synthesis/index.html#thread-economy'], ['Human–AI hybrid work','../scenarios/index.html#hybrid']],
 energy: [['Physical limits on digital progress','../next/index.html#physical'], ['How energy transitions could diverge','../scenarios/index.html#transition']]
};
function detail(t){
 activeDetail=t;
 const links=t.links.map(([id,text])=>'<button class="relation" data-trend="'+id+'"><span><strong>'+TRENDS.find(s=>s.id===id).name+'</strong><span class="relation-text">'+text+'</span></span>'+icon('link')+'</button>').join('');
 return closeButton+'<div class="detail-art" style="--plate:'+palette[t.id]+'"><img src="../assets/'+t.id+'.webp" alt="">'+categoryLabel(t)+'</div><div class="panel-content"><div class="panel-title-row"><h2 id="panel-title">'+t.name+'</h2><button class="panel-save" data-save="'+t.id+'" aria-pressed="'+saved.has(t.id)+'">'+icon('bookmark')+(saved.has(t.id)?'Saved':'Save')+'</button></div><p class="lede">'+t.intro+'</p><div class="snapshot">'+snapshot(t)+'</div><section class="connections"><h3>Connected trends</h3>'+links+'</section><section class="question"><h3>A question to take with you</h3><p>'+t.ask+'</p></section><section class="connections"><h3>Trace this idea in the research</h3>'+sourceList(researchPaths[t.id])+'</section><details class="sources"><summary>Sources &amp; further reading</summary>'+sourceList(t.sources)+'</details></div>';
}
function guide(){
 return closeButton+'<div class="guide-head"><p class="kicker">'+icon('book')+' Field guide</p><h2 id="panel-title">What is a megatrend?</h2></div><div class="guide-content"><section><p>A megatrend is a change that unfolds over decades, reaches across countries and affects several parts of life at once.</p><p class="guide-ex">Take longer lives. As more people reach older ages, families may spend more time caring, employers may redesign jobs and towns may need more accessible homes. One slow change ripples through everyday life.</p></section><section><h3>What is strategic foresight?</h3><p>Strategic foresight is the practice of exploring several plausible futures so we can make better choices today. A good place to start is to ask what might change course, who would experience the change first and what choices people still have.</p></section><section><h3>Try the observatory</h3><ol><li>Choose a year on the time horizon. Every card shows a snapshot from that viewpoint.</li><li>Open a trend and switch years to follow its evolution. Follow a connection to see how one change can affect another.</li><li>Visit 2040 or 2050 and imagine a different outcome. What would have to happen for it to come about?</li></ol></section><section><h3>Follow the research</h3><p><a class="front-link" href="../history/index.html">Compare the original publications</a>, <a class="front-link" href="../priorities/index.html">explore six shifts that warrant closer attention</a> or <a class="front-link" href="../scenarios/index.html">try a scenario</a>.</p></section><section><h3>How to read the timeline</h3><p>These six illustrated topics introduce the explorer. The research chapters follow the changing lists in the books and reports, from 1982 to 2026. The 1980–2025 snapshots describe developments around each date using historical evidence. The 2040 and 2050 entries are illustrative scenarios. Each is one possibility among many, and neither comes with a probability.</p></section><details class="sources"><summary>Sources &amp; approach</summary><p style="margin-top:9px">The selection draws on international foresight and development research. Each trend links to its own evidence. The illustrations accompany the six topics. Their sizes carry no numerical meaning.</p>'+sourceList([['European Commission · Megatrends Hub','https://knowledge-for-policy.ec.europa.eu/foresight/tool/megatrends-hub_en'],['United Nations · The megatrends that shape our world','https://www.un.org/development/desa/publications/wp-content/uploads/sites/10/2020/10/20-124-UNEN-75Report-Full-EN-REVISED.pdf']])+'</details><button class="basic-button" data-explore>Explore the trends</button></div>';
}
function savedPanel(){
 const list=TRENDS.filter(t=>saved.has(t.id));
 return closeButton+'<div class="saved-panel-head"><p class="kicker">Your collection</p><h2 id="panel-title">Saved trends</h2></div>'+(list.length?'<div class="saved-rows">'+list.map(t=>'<div class="saved-row"><button class="saved-open" data-trend="'+t.id+'"><img src="../assets/'+t.id+'.webp" alt=""><span>'+t.name+'<small>'+t.domain+'</small></span></button><button class="remove" data-save="'+t.id+'" aria-label="Remove '+t.name+'">Remove</button></div>').join('')+'</div>':'<div class="saved-empty">'+icon('bookmark')+'<h3>Your collection starts here</h3><p>Use the bookmark on a trend card to keep it here for your next visit on this device.</p><button class="basic-button" data-explore>Browse the index</button></div>');
}
function showRoute(){
 const route=location.hash.slice(1);const trend=TRENDS.find(t=>route==='trend/'+t.id);
 if(!trend&&route!=='guide'&&route!=='saved'){if(panel.open)panel.close();return;}
 if(!panel.open)returnFocus=document.activeElement;
 activeDetail=null;
 $('#panel-body').innerHTML=trend?detail(trend):route==='guide'?guide():savedPanel();
 if(!panel.open)panel.showModal();
 panel.scrollTop=0;
 panel.querySelector('.close').focus({preventScroll:true});
}
function routeTo(route){if(location.hash.slice(1)===route)showRoute();else location.hash=route;}
function closePanel(){
 const url=new URL(location.href);
 url.hash='';
 try { history.replaceState(history.state,'',url); }
 catch { location.hash=''; }
 panel.close();activeDetail=null;
}
panel.addEventListener('cancel',event=>{event.preventDefault();closePanel();});
panel.addEventListener('click',event=>{if(event.target===panel){const r=panel.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closePanel();}});
panel.addEventListener('close',()=>{
 if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
 else if(returnFocus?.dataset?.trend){document.querySelector('.open-card[data-trend="'+returnFocus.dataset.trend+'"]')?.focus({preventScroll:true});}
 returnFocus=null;
});
window.addEventListener('hashchange',showRoute);
document.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 if(b.matches('[data-guide]'))routeTo('guide');
 else if(b.matches('[data-close]'))closePanel();
 else if(b.matches('[data-explore]')||b.id==='explorer-nav')browse();
 else if(b.id==='saved-nav')routeTo('saved');
 else if(b.dataset.trend)routeTo('trend/'+b.dataset.trend);
 else if(b.dataset.year)yearState(Number(b.dataset.year));
 else if(b.dataset.detailYear&&activeDetail){
  const next=Number(b.dataset.detailYear);yearState(next);panel.querySelector('.snapshot').innerHTML=snapshot(activeDetail);panel.querySelector('[data-detail-year="'+next+'"]').focus({preventScroll:true});
 } else if(b.dataset.save){
  const id=b.dataset.save;toggleSave(id);renderCards();
  if(panel.open){
   if(activeDetail){b.innerHTML=icon('bookmark')+(saved.has(id)?'Saved':'Save');b.setAttribute('aria-pressed',saved.has(id));}
   else{$('#panel-body').innerHTML=savedPanel();(panel.querySelector('.remove')||panel.querySelector('.close')).focus();}
  }else{$('#cards').querySelector('[data-save="'+id+'"]')?.focus({preventScroll:true});}
 } else if(b.dataset.filter)selectDomain(b.dataset.filter);
 else if(b.dataset.orbit){selectDomain(b.dataset.orbit);browse();}
 else if(b.id==='shuffle'){
  const pool=currentTrends(),opts=pool.length>1?pool.filter(t=>t.id!==lastSurprise):pool;
  const t=opts[Math.floor(Math.random()*opts.length)];lastSurprise=t.id;routeTo('trend/'+t.id);
 }else if(b.id==='grid-view'||b.id==='list-view'){
  layout=b.id==='grid-view'?'grid':'list';try{localStorage.setItem('longview.layout',layout);}catch{}renderCards();
 }
});
renderYears();renderFilters();renderCards();$('.saved-count').textContent=saved.size;showRoute();
