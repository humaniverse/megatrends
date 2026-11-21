'use strict';
const $ = selector => document.querySelector(selector);
const icons = {
 bookmark:'<path d="M6 3.5h12v17l-6-4-6 4z"/>',
 time:'<path d="M3 9a9 9 0 1 1 1.4 8M3 4v5h5M12 7v5l3 2"/>',
 shuffle:'<path d="M3 6h3c4 0 7 12 11 12h4m-3-3 3 3-3 3M3 18h3c1.8 0 3.2-2.1 4.5-4.3M13.5 9C14.7 7.2 15.8 6 17 6h4m-3-3 3 3-3 3"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 list:'<path d="M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1"/>',
 close:'<path d="m5 5 14 14M19 5 5 19"/>',
};
function icon(name){ return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>'; }

document.querySelectorAll('[data-i]').forEach((el) => { el.outerHTML = icon(el.dataset.i); });

const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const link = (href, label) => `<a href="${escape(href)}">${escape(label)}</a>`;
const { horizons, stories } = window.OBS_EXPLORER;
const threads = window.OBS_THREADS;
const threadById = new Map(threads.map((thread) => [thread.id, thread]));
const horizonByYear = new Map(horizons.map(([year, label, type]) => [year, { label, type }]));
const latestYear = 2025;
const legacyFilters = { Technology: 'technology', Society: 'population', Environment: 'climate', Economy: 'trade' };
const resolveThread = (id) => Object.hasOwn(window.OBS_EXPLORER_ALIASES, id) ? window.OBS_EXPLORER_ALIASES[id] : id;
function readQuery() {
  const params = new URLSearchParams(location.search);
  const requestedYear = Number(params.get('year'));
  const requestedTheme = params.get('theme');
  const historicalFilter = Object.hasOwn(legacyFilters, requestedTheme) ? legacyFilters[requestedTheme] : '';
  return {
    year: horizonByYear.has(requestedYear) ? requestedYear : latestYear,
    theme: threadById.has(requestedTheme) ? requestedTheme : historicalFilter,
  };
}
let { year, theme } = readQuery();
let saved = new Set();
let layout = 'grid';
try {
  const stored = JSON.parse(localStorage.getItem('longview.saved') || '[]');
  if (Array.isArray(stored)) saved = new Set(stored.map(resolveThread).filter((id) => threadById.has(id)));
  if (localStorage.getItem('longview.layout') === 'list') layout = 'list';
} catch {}

const panel = $('#panel');
let lastSurprise = '';
let activeDetail = null;
let returnFocus = null;
const visibleThreads = () => theme ? [threadById.get(theme)] : threads;
const stageFor = (thread) => stories[thread.id].snapshots[year];
const threadHref = (thread) => `../index.html#thread/${thread.id}`;
const art = (thread) => `../assets/${stories[thread.id].image}.webp`;
const say = (message) => { $('#announce').textContent = message; };

function writeQuery() {
  if (location.protocol === 'file:') return;
  const url = new URL(location.href);
  if (year === latestYear) url.searchParams.delete('year');
  else url.searchParams.set('year', String(year));
  if (theme) url.searchParams.set('theme', theme);
  else url.searchParams.delete('theme');
  history.replaceState(history.state, '', url);
}

function yearState(next) {
  year = next;
  writeQuery();
  renderYears();
  renderCards();
  const { label, type } = horizonByYear.get(year);
  say(`${label}. ${type}.`);
}

function renderYears() {
  const host = $('#main-years');
  if (!host.childElementCount) {
    host.innerHTML = horizons.map(([value, label, type]) => `<button type="button" class="year ${value > latestYear ? 'future' : ''}" data-year="${value}" aria-label="${label}, ${type}"><span class="year-marker"></span><span class="year-text">${label}</span></button>`).join('');
  }
  host.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', Number(button.dataset.year) === year));
}

function renderFilters() {
  const host = $('.filters');
  if (!host.childElementCount) {
    const options = [{ id: '', label: 'All threads' }, ...threads];
    host.innerHTML = options.map(({ id, label, color }) => `<button type="button" class="filter" data-filter="${id}">${color ? `<span class="swatch" style="background:${color}"></span>` : ''}${escape(label)}</button>`).join('');
  }
  host.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', button.dataset.filter === theme));
}

function selectTheme(id) {
  theme = id;
  writeQuery();
  renderFilters();
  renderCards();
  say(theme ? `Showing ${threadById.get(theme).label}.` : 'Showing all eight threads.');
}

function categoryLabel(thread) {
  return `<span class="card-domain"><span class="thread-dot" style="background:${thread.color}"></span>${escape(thread.label)}</span>`;
}

function bookmark(thread) {
  const isSaved = saved.has(thread.id);
  const label = isSaved ? `Remove ${thread.label} from saved timelines` : `Save ${thread.label} timeline`;
  return `<button type="button" class="bookmark" data-save="${thread.id}" aria-label="${escape(label)}" title="${escape(label)}" aria-pressed="${isSaved}">${icon('bookmark')}</button>`;
}

function evidenceList(stage) {
  return `<ul class="timeline-evidence">${stage.evidence.map(({ href, finding, author, year: published, detail }) => `<li>
    <div class="evidence-credit">${escape(author)} · ${published}</div>
    ${link(href, finding)}
    <p>${escape(detail)}</p>
  </li>`).join('')}</ul>`;
}

function stageLink(stage) {
  return stage.related.length ? `<ul class="timeline-related">${stage.related.map(({ href, label }) => `<li>${link(href, label)}</li>`).join('')}</ul>` : '';
}

function renderCards() {
  const host = $('#cards');
  const { label, type } = horizonByYear.get(year);
  host.className = `cards ${layout}`;
  $('#grid-view').setAttribute('aria-pressed', layout === 'grid');
  $('#list-view').setAttribute('aria-pressed', layout === 'list');
  host.innerHTML = visibleThreads().map((thread) => {
    const stage = stageFor(thread);
    return `<article class="trend-card" style="--plate:${thread.color}">
      <div class="plate"><img src="${art(thread)}" alt="" width="1000" height="470" loading="lazy"></div>
      ${bookmark(thread)}
      <div class="card-body">
        ${categoryLabel(thread)}
        <div class="card-meta">${label} <span aria-hidden="true">·</span> ${type}</div>
        <h3 class="card-title"><button type="button" class="open-card" data-trend="${thread.id}">${escape(stage.headline)}<span class="sr"> (${escape(thread.label)})</span></button></h3>
        <p>${escape(stage.decision)}</p>
        ${evidenceList(stage)}
        ${stageLink(stage)}
      </div>
    </article>`;
  }).join('');
}

function toggleSave(id) {
  if (saved.has(id)) saved.delete(id);
  else saved.add(id);
  try { localStorage.setItem('longview.saved', JSON.stringify([...saved])); } catch {}
  say(`${threadById.get(id).label} ${saved.has(id) ? 'saved' : 'removed from saved timelines'}.`);
}

function browse() {
  if (panel.open) closePanel();
  $('#index').scrollIntoView({ behavior: 'instant', block: 'start' });
  $('#index').focus({ preventScroll: true });
}

const closeButton = `<button type="button" class="close" data-close aria-label="Close dialog">${icon('close')}</button>`;

function snapshot(thread) {
  const stage = stageFor(thread);
  const { label, type } = horizonByYear.get(year);
  const yearButtons = horizons.map(([value, text, status]) => `<button type="button" data-detail-year="${value}" aria-pressed="${value === year}" aria-label="${text}, ${status}">${text}</button>`).join('');
  return `<div class="detail-years" role="group" aria-label="Thread timeline">${yearButtons}</div>
    <div class="tiny-label">${type} · ${label}</div>
    <h3>${escape(stage.headline)}</h3>
    <p>${escape(stage.decision)}</p>
    ${evidenceList(stage)}
    ${stageLink(stage)}`;
}

function detail(thread) {
  activeDetail = thread;
  const isSaved = saved.has(thread.id);
  return `${closeButton}
    <div class="detail-art" style="--plate:${thread.color}"><img src="${art(thread)}" alt=""></div>
    <div class="panel-content">
      <div class="panel-title-row"><h2 id="panel-title">${escape(thread.label)}</h2>
        <button type="button" class="panel-save" data-save="${thread.id}" aria-pressed="${isSaved}">${icon('bookmark')}${isSaved ? 'Saved' : 'Save timeline'}</button>
      </div>
      <div class="snapshot">${snapshot(thread)}</div>
      <p id="detail-announce" class="sr" aria-live="polite"></p>
      <nav class="timeline-links" aria-label="Keep exploring">
        ${link(threadHref(thread), `Follow ${thread.label} by theme`)}
        ${link(`../synthesis/index.html#thread-${thread.original.toLowerCase()}`, 'Read this thread in What changed')}
      </nav>
    </div>`;
}

function guide() {
  return `${closeButton}<div class="guide-head"><h2 id="panel-title">How to read the timeline</h2></div>
    <div class="guide-content">
      <section><h3>Follow one thread through time</h3>
        <p>These are the same eight threads you can explore By theme. Choose a year and open a story to see the decision it raises. Switch years inside the story to see how the question changes.</p></section>
      <section><h3>Check the date on the source</h3>
        <p>Historical snapshots use publications from around the selected year. The date beside each finding is the publication year. Some reports describe what their authors expected at the time, and others report observations. The 2025–26 view brings recent findings and interpretations together.</p></section>
      <section><h3>Explore what could happen</h3>
        <p>The 2040 and 2050 stories use earlier findings as a starting point. They ask what could happen under a particular set of conditions. Follow the scenario or assumption to see what would have to change.</p></section>
      <button type="button" class="basic-button" data-explore>Explore the timelines</button>
    </div>`;
}

function savedPanel() {
  const list = threads.filter((thread) => saved.has(thread.id));
  return `${closeButton}<div class="saved-panel-head"><h2 id="panel-title">Saved timelines</h2></div>${list.length ? `<div class="saved-rows">${list.map((thread) => `<div class="saved-row">
    <button type="button" class="saved-open" data-trend="${thread.id}"><img src="${art(thread)}" alt=""><span>${escape(thread.label)}</span></button>
    <button type="button" class="remove" data-save="${thread.id}" aria-label="Remove ${escape(thread.label)}">Remove</button>
  </div>`).join('')}</div>` : `<div class="saved-empty">${icon('bookmark')}<h3>Your collection starts here</h3><p>Bookmark any story to save its timeline on this device.</p><button type="button" class="basic-button" data-explore>Browse the timelines</button></div>`}`;
}

function showRoute() {
  const route = location.hash.slice(1);
  const thread = route.startsWith('trend/') ? threadById.get(resolveThread(route.slice(6))) : null;
  if (!thread && route !== 'guide' && route !== 'saved') {
    if (panel.open) panel.close();
    activeDetail = null;
    return;
  }
  if (!panel.open) returnFocus = document.activeElement;
  activeDetail = null;
  $('#panel-body').innerHTML = thread ? detail(thread) : route === 'guide' ? guide() : savedPanel();
  if (!panel.open) panel.showModal();
  panel.scrollTop = 0;
  panel.querySelector('.close').focus({ preventScroll: true });
}

function routeTo(route) {
  if (location.hash.slice(1) === route) showRoute();
  else location.hash = route;
}

function closePanel() {
  const url = new URL(location.href);
  url.hash = '';
  try { history.replaceState(history.state, '', url); }
  catch { location.hash = ''; }
  panel.close();
  activeDetail = null;
}

panel.addEventListener('cancel', (event) => {
  event.preventDefault();
  closePanel();
});
panel.addEventListener('click', (event) => {
  if (event.target !== panel) return;
  const rect = panel.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closePanel();
});
panel.addEventListener('close', () => {
  if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  else if (returnFocus?.dataset.trend) $(`.open-card[data-trend="${returnFocus.dataset.trend}"]`)?.focus({ preventScroll: true });
  returnFocus = null;
});
window.addEventListener('hashchange', showRoute);
window.addEventListener('popstate', () => {
  const next = readQuery();
  if (year === next.year && theme === next.theme) return;
  ({ year, theme } = next);
  renderYears();
  renderFilters();
  renderCards();
  if (activeDetail) panel.querySelector('.snapshot').innerHTML = snapshot(activeDetail);
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const data = button.dataset;
  if (button.matches('[data-guide]')) routeTo('guide');
  else if (button.matches('[data-close]')) closePanel();
  else if (button.matches('[data-explore]')) browse();
  else if (data.trend) routeTo(`trend/${data.trend}`);
  else if (data.year) yearState(Number(data.year));
  else if (data.detailYear && activeDetail) {
    const next = Number(data.detailYear);
    yearState(next);
    panel.querySelector('.snapshot').innerHTML = snapshot(activeDetail);
    panel.querySelector(`[data-detail-year="${next}"]`).focus({ preventScroll: true });
    $('#detail-announce').textContent = stageFor(activeDetail).headline;
  } else if (data.save) {
    const id = data.save;
    toggleSave(id);
    renderCards();
    if (!panel.open) $(`#cards [data-save="${id}"]`)?.focus({ preventScroll: true });
    else if (activeDetail) {
      button.innerHTML = icon('bookmark') + (saved.has(id) ? 'Saved' : 'Save timeline');
      button.setAttribute('aria-pressed', saved.has(id));
    } else {
      $('#panel-body').innerHTML = savedPanel();
      (panel.querySelector('.remove') || panel.querySelector('.close')).focus();
    }
  } else if (data.filter !== undefined) selectTheme(data.filter);
  else if (button.id === 'shuffle') {
    const pool = visibleThreads();
    const options = pool.length > 1 ? pool.filter((thread) => thread.id !== lastSurprise) : pool;
    const thread = options[Math.floor(Math.random() * options.length)];
    lastSurprise = thread.id;
    routeTo(`trend/${thread.id}`);
  } else if (button.id === 'grid-view' || button.id === 'list-view') {
    layout = button.id === 'grid-view' ? 'grid' : 'list';
    try { localStorage.setItem('longview.layout', layout); } catch {}
    renderCards();
  }
});

renderYears();
renderFilters();
renderCards();
showRoute();
