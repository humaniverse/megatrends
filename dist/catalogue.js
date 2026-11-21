(() => {
  'use strict';

  const books = new Map(window.OBS_BOOKS.map((book) => [book.id, book]));
  const themes = new Map(window.OBS_THREADS.map((thread) => [thread.id, thread.label]));
  themes.set('other', 'Other themes');
  const byDecade = document.getElementById('by-decade');
  const compare = document.getElementById('compare');
  const browseMode = document.getElementById('browse-mode');
  const compareMode = document.getElementById('compare-mode');
  const search = document.getElementById('term');
  const decade = document.getElementById('decade');
  const first = document.getElementById('pick-a');
  const second = document.getElementById('pick-b');
  const theme = document.getElementById('pick-theme');
  const results = document.getElementById('results');
  const noMatches = document.getElementById('no-matches');
  const crumbs = document.getElementById('page-crumbs');
  const catalogueCrumbs = [...crumbs.children];
  const catalogueTitle = document.title;
  const eras = [...document.querySelectorAll('.era')];
  const studies = [...document.querySelectorAll('.study')];
  const defaultFirst = 'naisbitt-1982';
  const defaultSecond = 'cifs-2026';
  const findingContext = document.createElement('p');
  findingContext.className = 'finding-context';
  let showingComparison = false;
  let linkedStudy = null;
  let hasComparison = false;

  function normalise(text) {
    return text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }

  const index = new Map(studies.map((study) => {
    const book = books.get(study.id);
    const topicNames = book.entries.flatMap((entry) => entry.themes.map((id) => themes.get(id)));
    return [study.id, normalise([study.textContent, ...topicNames].join(' '))];
  }));

  function makeLink(label, href) {
    const link = document.createElement('a');
    link.textContent = label;
    link.href = href;
    return link;
  }

  function urlFor({ view = 'decades', hash = 'catalogue-views', pair, onlyDecade = decade.value } = {}) {
    const url = new URL(location.href);
    url.search = '';
    url.hash = hash;
    if (search.value.trim()) url.searchParams.set('q', search.value.trim());
    if (onlyDecade) url.searchParams.set('decade', onlyDecade);
    if (view === 'compare' || pair || hasComparison) {
      url.searchParams.set('view', view);
      url.searchParams.set('first', pair?.[0] || first.value);
      url.searchParams.set('second', pair?.[1] || second.value);
      if (theme.value) url.searchParams.set('theme', theme.value);
    }
    return url;
  }

  function remember(hash = location.hash.slice(1)) {
    try {
      history.replaceState(history.state, '', urlFor({
        view: showingComparison ? 'compare' : 'decades', hash,
      }));
    } catch {
      // Local file URLs can restrict changes to the current address.
    }
  }

  function filter() {
    const terms = normalise(search.value.trim()).split(/\s+/).filter(Boolean);
    let matches = 0;
    let linkedOutsideFilter = false;
    for (const study of studies) {
      const inDecade = !decade.value || decade.value === study.closest('.era').dataset.era;
      const matched = inDecade && terms.every((term) => index.get(study.id).includes(term));
      study.hidden = !matched && study !== linkedStudy;
      if (matched) matches++;
      if (!matched && study === linkedStudy) linkedOutsideFilter = true;
    }
    for (const era of eras) era.hidden = !era.querySelector('.study:not([hidden])');
    results.textContent = matches + ' of ' + studies.length + ' publications match';
    if (linkedOutsideFilter) results.textContent += '. Also showing the linked publication.';
    noMatches.hidden = matches > 0 || Boolean(linkedStudy);
  }

  function renderEdition(select, output) {
    const book = books.get(select.value);
    const entries = theme.value
      ? book.entries.filter((entry) => entry.themes.includes(theme.value))
      : book.entries;
    const swatch = document.createElement('img');
    swatch.alt = '';
    swatch.width = 354;
    swatch.height = 156;
    swatch.dataset.weave = book.id;
    swatch.dataset.yarns = [...new Set(book.entries.flatMap((entry) => entry.themes))].join(',');
    swatch.dataset.highlight = theme.value;
    const credit = document.createElement('p');
    credit.className = 'lens';
    credit.textContent = book.year + ' · ' + book.author;
    const title = document.createElement('h3');
    title.textContent = book.title;
    const summary = document.createElement('p');
    summary.textContent = book.summary;
    const actions = document.createElement('div');
    actions.className = 'catalogue-actions';
    const pair = [first.value, second.value];
    actions.append(
      makeLink('Open full edition', urlFor({ hash: book.id, pair })),
      makeLink('Original source', book.url),
    );
    const heading = document.createElement('h4');
    heading.textContent = themes.get(theme.value) || 'Findings in this edition';
    output.replaceChildren(swatch, credit, title, summary, actions, heading);
    if (!entries.length) {
      const note = document.createElement('p');
      note.textContent = book.entries.length
        ? 'No finding from this edition is assigned to this theme.'
        : 'This review describes how researchers identify megatrends.';
      output.append(note);
    } else {
      const list = document.createElement('ol');
      for (const entry of entries) {
        const item = document.createElement('li');
        const label = document.createElement('strong');
        const detail = document.createElement('p');
        label.textContent = entry.text;
        detail.textContent = entry.detail;
        item.append(label, detail);
        list.append(item);
      }
      output.append(list);
    }
    window.drawWeaves(output);
  }

  function setCrumbs(study) {
    const last = catalogueCrumbs.at(-1);
    crumbs.replaceChildren(...catalogueCrumbs);
    if (!study && !showingComparison) return;
    last.replaceWith(makeLink(last.textContent, urlFor()));
    const addPart = (part) => {
      const separator = document.createElement('span');
      separator.setAttribute('aria-hidden', 'true');
      separator.textContent = '/';
      crumbs.append(separator, part);
    };
    const current = document.createElement('span');
    current.setAttribute('aria-current', 'page');
    if (study) {
      const year = study.closest('.era').dataset.era;
      addPart(makeLink(year + 's', urlFor({ onlyDecade: year, hash: 'era-' + year })));
      current.textContent = books.get(study.id).title;
    } else {
      current.textContent = 'Compare';
    }
    addPart(current);
  }

  function updateLinks() {
    browseMode.href = urlFor();
    compareMode.href = urlFor({ view: 'compare' });
    const params = new URLSearchParams(location.search);
    const fromCompare = linkedStudy && params.get('view') === 'decades' && hasComparison;
    for (const study of studies) {
      study.querySelector('[data-compare-edition]').href = urlFor({
        view: 'compare', pair: [study.id, study.id === defaultFirst ? defaultSecond : defaultFirst],
      });
      const back = study.querySelector('[data-return-comparison]');
      back.href = compareMode.href;
      back.hidden = !fromCompare || (study.id !== first.value && study.id !== second.value);
    }
  }

  function readAddress() {
    findingContext.remove();
    const params = new URLSearchParams(location.search);
    const anchor = document.getElementById(location.hash.slice(1));
    linkedStudy = anchor?.closest('.study') || null;
    hasComparison = params.has('first') || params.has('second');
    showingComparison = !linkedStudy && (
      params.get('view') === 'compare' || compare.contains(anchor) ||
      (!params.has('view') && (params.has('first') || params.has('second')))
    );
    hasComparison ||= showingComparison;
    document.title = linkedStudy
      ? books.get(linkedStudy.id).title + ' · Megatrend Observatory'
      : showingComparison ? 'Compare publications · Megatrend Observatory' : catalogueTitle;
    search.value = params.get('q') || '';
    decade.value = params.get('decade') || '';
    first.value = books.has(params.get('first')) ? params.get('first') : defaultFirst;
    second.value = books.has(params.get('second')) ? params.get('second') : defaultSecond;
    theme.value = themes.has(params.get('theme')) ? params.get('theme') : '';
    byDecade.hidden = showingComparison;
    compare.hidden = !showingComparison;
    for (const [link, current] of [[browseMode, !showingComparison], [compareMode, showingComparison]]) {
      if (current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    if (showingComparison) {
      renderEdition(first, document.getElementById('compare-a'));
      renderEdition(second, document.getElementById('compare-b'));
    } else {
      filter();
      window.drawWeaves(byDecade);
    }
    setCrumbs(linkedStudy);
    updateLinks();
    if (linkedStudy) {
      linkedStudy.open = true;
      if (anchor !== linkedStudy) {
        findingContext.replaceChildren(makeLink(books.get(linkedStudy.id).title,
          urlFor({ hash: linkedStudy.id })));
        anchor.prepend(findingContext);
      }
    }
    if (anchor && !anchor.closest('[hidden]')) anchor.scrollIntoView({ block: 'start' });
  }

  for (const select of [first, second, theme]) {
    select.addEventListener('change', () => {
      renderEdition(first, document.getElementById('compare-a'));
      renderEdition(second, document.getElementById('compare-b'));
      remember();
      updateLinks();
    });
  }
  for (const link of compare.querySelectorAll('.other-edition')) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const edition = document.getElementById(link.hash.slice(1));
      edition.focus({ preventScroll: true });
      edition.scrollIntoView({ block: 'start' });
    });
  }

  function applyFilters() {
    const hadLinkedStudy = Boolean(linkedStudy);
    linkedStudy = null;
    filter();
    setCrumbs(null);
    remember(hadLinkedStudy ? '' : undefined);
    updateLinks();
  }

  search.addEventListener('input', applyFilters);
  decade.addEventListener('change', applyFilters);
  document.getElementById('clear').addEventListener('click', () => {
    search.value = '';
    decade.value = '';
    applyFilters();
    search.focus();
  });
  window.addEventListener('hashchange', readAddress);
  document.documentElement.classList.add('enhanced');
  readAddress();
})();
