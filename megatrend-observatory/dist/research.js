'use strict';

document.documentElement.classList.add('enhanced');

function revealAnchor() {
  const target = document.getElementById(location.hash.slice(1));
  if (!target) return;
  if (target.matches('details')) {
    target.open = true;
    target.scrollIntoView({ block: 'start' });
  }
}

const archive = document.querySelector('.archive-tools');
if (archive) {
  const search = document.querySelector('#term');
  const decade = document.querySelector('#decade');
  const studies = [...document.querySelectorAll('.study')];
  const eras = [...document.querySelectorAll('.era')];
  const searchIndex = new Map(studies.map(study => [study.id, normalise(study.textContent)]));
  const start = new URL(location.href);
  const first = document.querySelector('#pick-a');
  const second = document.querySelector('#pick-b');
  const compare = document.querySelector('#compare');

  function normalise(value) {
    return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }

  function updateUrl(values) {
    const url = new URL(location.href);
    Object.entries(values).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    });
    if (location.protocol !== 'file:') history.replaceState(history.state, '', url);
  }

  function filter() {
    const terms = normalise(search.value.trim()).split(/\s+/).filter(Boolean);
    let total = 0;
    for (const item of studies) {
      const year = Number(item.dataset.year);
      const inEra = !decade.value || Math.floor(year / 10) * 10 === Number(decade.value);
      const matches = inEra && terms.every(term => searchIndex.get(item.id).includes(term));
      item.hidden = !matches;
      if (matches) total++;
    }
    eras.forEach(era => { era.hidden = !era.querySelector('.study:not([hidden])'); });
    document.querySelector('#results').textContent = total + ' of ' + studies.length + ' publications';
    document.querySelector('#no-matches').hidden = total !== 0;
    updateUrl({ q: search.value.trim(), decade: decade.value });
  }

  function comparison(select, output) {
    const source = document.getElementById(select.value);
    const title = source.querySelector('summary b').textContent;
    const summary = document.createElement('p');
    summary.textContent = source.querySelector('.study-body > p:not(.lens)').textContent;
    const list = document.createElement('ol');
    source.querySelectorAll('.entries strong').forEach(heading => {
      const item = document.createElement('li');
      item.textContent = heading.textContent;
      list.append(item);
    });
    const full = document.createElement('a');
    full.href = '#' + source.id;
    full.textContent = 'Read the full entry';
    full.setAttribute('aria-label', 'Read the full entry for ' + title + ' (' + source.dataset.year + ')');
    full.addEventListener('click', () => {
      search.value = ''; decade.value = ''; filter();
      source.open = true;
    });
    output.replaceChildren(summary, list, full);
  }

  function refreshComparisons() {
    comparison(first, document.querySelector('#compare-a'));
    comparison(second, document.querySelector('#compare-b'));
  }

  function available(select, value, fallback) {
    return [...select.options].some(option => option.value === value) ? value : fallback;
  }

  function saveComparison() {
    updateUrl({ first: compare.open ? first.value : '', second: compare.open ? second.value : '' });
  }

  search.value = start.searchParams.get('q') || '';
  decade.value = available(decade, start.searchParams.get('decade'), '');
  first.value = available(first, start.searchParams.get('first'), 'naisbitt-1982');
  second.value = available(second, start.searchParams.get('second'), 'cifs-2026');
  if (start.searchParams.has('first') || start.searchParams.has('second')) compare.open = true;
  refreshComparisons();
  filter();
  compare.addEventListener('toggle', saveComparison);
  for (const select of [first, second]) {
    select.addEventListener('change', () => { refreshComparisons(); saveComparison(); });
  }
  search.addEventListener('input', filter);
  decade.addEventListener('change', filter);
  document.querySelector('#clear').addEventListener('click', () => {
    search.value = ''; decade.value = ''; filter(); search.focus();
  });
}
window.addEventListener('hashchange', revealAnchor);
revealAnchor();
