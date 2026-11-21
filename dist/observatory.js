(() => {
  'use strict';
  const books = window.OBS_BOOKS;
  const threads = window.OBS_THREADS;
  const future = window.OBS_FUTURES;
  const explorerAliases = window.OBS_EXPLORER_ALIASES;
  const main = document.getElementById('main');
  const threadById = new Map(threads.map((t) => [t.id, t]));
  const bookById = new Map(books.map((b) => [b.id, b]));
  const bookDefault = books[0].id;
  const escape = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[c],
    );
  const themeName = (id) => threadById.get(id)?.label || 'Other themes';
  const cataloguePath = 'history/index.html';
  const defaultComparison = comparisonLink(bookDefault, 'cifs-2026');
  const icon =
    '<svg class="fiber-icon" viewBox="0 0 26 20" aria-hidden="true"><path d="M1 6c4 0 5 6 10 6s5-8 10-8c3 0 4 3 2 5-3 3-7 1-9 0M1 10c4 0 5 6 10 6"/></svg>';
  let title = '';
  let previousRoute = '';
  let saved = readSaved('observatory.threads').filter((id) => threadById.has(id));
  function readSaved(key) {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }
  const link = (href, label, classes = '') =>
    '<a class="' +
    classes +
    '" href="' +
    escape(href) +
    '">' +
    escape(label) +
    '</a>';
  function comparisonLink(first, second, theme) {
    const query = new URLSearchParams({ view: 'compare', first, second });
    if (theme) query.set('theme', theme);
    return cataloguePath + '?' + query.toString() + '#catalogue-views';
  }
  function publicationLink(book, evidence) {
    const entry = evidence ? book.entries.findIndex((item) => item.text === evidence) : -1;
    return cataloguePath + '#' + book.id + (entry >= 0 ? '--trend-' + (entry + 1) : '');
  }
  function related(items, label = 'Related reading') {
    return '<nav class="related-reading" aria-label="' + escape(label) + '"><strong>' +
      escape(label) + '</strong><ul>' +
      items.map(([href, name]) => '<li>' + link(href, name) + '</li>').join('') +
      '</ul></nav>';
  }
  const populationReading = [
    ['#thread/population', 'Follow the Population & ageing thread'],
    [publicationLink(bookById.get('un-wpp-2024'), threadById.get('population').evidence['un-wpp-2024']), 'Read the 2024 population finding'],
    ['priorities/index.html#demographic-bifurcation', 'Read about demographic bifurcation'],
    ['scenarios/index.html#demographic-inversion', 'Explore the 2040 demographic scenario'],
  ];
  function weave(seed, yarns, face = 'front', highlight = '') {
    return (
      '<img class="weave" alt="" width="354" height="156" data-weave="' +
      escape(seed) +
      '" data-yarns="' +
      escape(yarns.join(',')) +
      '" data-face="' +
      escape(face) +
      '" data-highlight="' +
      escape(highlight) +
      '">'
    );
  }
  function header(back, label, heading, description = '') {
    title = heading;
    const separator = '<span aria-hidden="true">/</span>';
    return (
      '<div class="wrap read-head"><nav class="site-crumbs" aria-label="Breadcrumb">' +
      link('#home', 'Home') + separator +
      (back === '#home' ? '' : link(back, label) + separator) +
      '<span aria-current="page">' + escape(heading) + '</span></nav>' +
      '<h1>' +
      escape(heading) +
      '</h1>' +
      (description ? '<p class="deck">' + escape(description) + '</p>' : '') +
      '</div>'
    );
  }
  function section(heading, content) {
    return (
      '<section class="field"><h3>' +
      escape(heading) +
      '</h3><p>' +
      escape(content) +
      '</p></section>'
    );
  }
  function sources(items) {
    return items?.length
      ? '<details class="note"><summary>Sources and further reading</summary><ul class="source-list">' +
          items.map((x) => '<li>' + link(x.url, x.label) + '</li>').join('') +
          '</ul></details>'
      : '';
  }
  function threadLink(t) {
    return (
      '<a class="swatch-link" href="#thread/' +
      t.id +
      '">' +
      weave(t.id, [t.id]) +
      '<h3>' +
      escape(t.label) +
      '</h3><small>' +
      escape(t.title) +
      '</small></a>'
    );
  }
  function home() {
    title = 'Megatrend Observatory';
    return (
      '<section class="night hero"><div class="hero-copy"><h1>How ideas of the future change</h1><p>Follow long-term changes through four decades of books and reports, then see how they could shape the future.</p><div class="actions"><a class="primary" href="#loom">' +
      icon +
      'Follow a theme</a>' +
      link(defaultComparison, 'Compare 1982 with today', 'quiet-action') +
      link('#futures', 'Test an assumption', 'quiet-action') +
      '</div></div><div class="hero-art" role="img" aria-label="A close view of raspberry, indigo and gold Jacquard cloth with loose yarn at its edge"></div></section>' +
      '<section class="wrap section"><div class="section-title"><div><h2>Pick up a thread</h2><p>Start with a question that draws you in. See how earlier authors understood it.</p></div>' +
      link('#loom', 'All eight threads', 'action') +
      '</div><div class="thread-shelf">' +
      ['technology', 'climate', 'population', 'information']
        .map((id) => threadLink(threadById.get(id)))
        .join('') +
      '</div></section>' +
      '<section class="white"><div class="wrap invitation"><div class="book-art" role="img" aria-label="An archive of woven samples, open at 1982 and the 2020s"></div><div><h2>Books &amp; reports</h2><p>John Naisbitt saw an information society taking shape in 1982. What did later authors see? Lay two publications side by side and examine their choices.</p><div class="actions">' +
      link(
        defaultComparison,
        'Compare two publications',
        'primary',
      ) +
      link(cataloguePath, 'Browse by decade', 'action') +
      '</div></div></div></section>' +
      '<section class="wrap section chapter-menu">' +
      [
        [
          'priorities/index.html',
          'Six to watch',
          'Which changes deserve a closer look, and what makes them new?',
        ],
        [
          '#futures',
          'Possible futures',
          'Loosen an assumption and read what might follow.',
        ],
        [
          'explorer/index.html',
          'By year',
          'Follow the eight research threads from 1980 to possible futures in 2050.',
        ],
      ]
        .map(
          ([href, h, p]) =>
            '<a href="' + href + '"><h3>' + h + '</h3><p>' + p + '</p></a>',
        )
        .join('') +
      '</section>'
    );
  }
  function loom() {
    return (
      header(
        '#home',
        'Home',
        'Explore by theme',
        'Eight themes recur across the collection. Each thread follows a changing idea through the words and concerns of its time.',
      ) +
      '<div class="wrap section"><p class="theme-example">' +
      link('#thread/technology', 'Follow the rise of machine autonomy', 'action') +
      '</p><div class="thread-shelf">' +
      threads.map(threadLink).join('') +
      '</div><div class="page-end">' +
      link('synthesis/index.html', 'Read the historical synthesis', 'action') +
      link('explorer/index.html', 'Explore the threads by year', 'action') +
      '</div></div>'
    );
  }
  function threadPage(id, back) {
    const t = threadById.get(id);
    if (!t) return missing();
    const witnesses = t.books.map((id) => bookById.get(id)).filter(Boolean);
    const chapters = [
      ['Earlier emphasis', t.opening],
      ['How it developed', t.middle],
      ['The question now', t.question],
    ];
    const trail =
      '<div class="thread-dates" aria-label="Editions on this thread">' +
      witnesses
        .map(
          (b) =>
            '<a href="' +
            publicationLink(b, t.evidence[b.id]) +
            '"><b>' +
            b.year +
            '</b><span>' +
            escape(b.author) +
            '</span></a>',
        )
        .join('') +
      '</div>';
    const overview =
      '<h2>' +
      escape(t.title) +
      '</h2>' +
      trail +
      '<ol class="stage-list">' +
      chapters
        .map(([h, p]) => '<li><h3>' + h + '</h3><p>' + escape(p) + '</p></li>')
        .join('') +
      '</ol>';
    const reverse =
      '<h2>The reverse of the cloth</h2><p>These publications informed this thread. The summaries paraphrase each edition. The links between editions are the Observatory’s interpretation.</p>' +
      witnesses
        .map((b) => {
          const entry =
            b.entries.find((e) => e.text === t.evidence?.[b.id]) ||
            b.entries.find((e) => e.theme === t.id);
          return (
            '<section class="source-row"><span class="meta">' +
            b.year +
            ' / ' +
            escape(b.author) +
            '</span><h3>' +
            escape(b.title) +
            '</h3>' +
            (entry
              ? '<p><strong>' +
                escape(entry.text) +
                '</strong> ' +
                escape(entry.detail) +
                '</p>'
              : '<p>' + escape(b.summary) + '</p>') +
            link(publicationLink(b, t.evidence[b.id]), 'Read the finding in the publication') +
            '</section>'
          );
        })
        .join('') +
      '<details class="note"><summary>Why connect these editions?</summary><p>' +
      escape(t.middle) +
      '</p><p>' +
      escape(t.question) +
      '</p></details>';
    const faceHref = '#thread/' + t.id + (back ? '' : '/reverse');
    return (
      header('#loom', 'Explore by theme', t.label) +
      '<div class="wrap section read-grid" style="--yarn:' +
      t.color +
      '"><aside class="sample-board"><h2>' +
      (back ? 'Source side' : 'Story side') +
      '</h2>' +
      weave(t.id, [t.id], back ? 'back' : 'front') +
      '<div class="actions"><a class="primary" data-keep-focus="turn" href="' +
      faceHref +
      '">' +
      icon +
      (back ? 'Back to the story' : 'See the sources') +
      '</a><button class="button-line" data-save="' +
      t.id +
      '" aria-pressed="' +
      saved.includes(t.id) +
      '">' +
      (saved.includes(t.id) ? 'Saved thread' : 'Save thread') +
      '</button></div></aside><article class="story ' +
      (back ? 'face-back' : '') +
      '">' +
      (back ? reverse : overview) +
      '<div class="page-end">' +
      link(
        comparisonLink(witnesses[0].id, witnesses[witnesses.length - 1].id, t.id),
        'Compare the first and last editions',
        'action',
      ) +
      '</div>' + related([
        ['explorer/index.html#trend/' + t.id, 'Explore this thread by year'],
        ['synthesis/index.html#thread-' + t.original.toLowerCase(), 'Read this thread in the historical synthesis'],
        ...(t.id === 'population' ? populationReading.slice(1) : future.watch
          .filter((item) => item.theme === t.id)
          .map((item) => ['priorities/index.html#' + item.originalId, item.title])),
      ]) + '</article></div>'
    );
  }
  function options(records, selected, getLabel) {
    return records
      .map(
        (x) =>
          '<option value="' +
          escape(x.id) +
          '"' +
          (x.id === selected ? ' selected' : '') +
          '>' +
          escape(getLabel(x)) +
          '</option>',
      )
      .join('');
  }
  const watchYarns = {
    'autonomous-infrastructure': ['technology', 'networks'],
    'synthetic-reality': ['information'],
    'geoeconomic-confrontation': ['trade', 'power'],
    'climate-reorganisation': ['climate'],
    'demographic-bifurcation': ['population', 'health'],
    'network-power': ['networks', 'power'],
  };
  function study(w, before = false) {
    const yarns = watchYarns[w.id] || [w.theme];
    const kind =
      w.category === 'New phenomenon'
        ? 'appears'
        : w.category === 'New framing'
          ? 'reframes'
          : 'combines';
    return (
      '<div class="weave-study ' +
      kind +
      (before ? ' earlier' : '') +
      '">' +
      weave(
        w.theme,
        before ? yarns.slice(0, 1) : yarns,
        kind === 'reframes' && !before ? 'back' : 'front',
      ) +
      '</div>'
    );
  }
  function watchPage(id, before) {
    if (!id) {
      return (
        header(
          '#home',
          'Home',
          'Six to watch',
          'A new capability, a new combination, or a familiar change seen differently. These six shifts make different claims to novelty.',
        ) +
        '<div class="wrap section"><div class="swatch-nav">' +
        future.watch
          .map(
            (w) =>
              '<a class="swatch-link" href="#watch/' +
              w.id +
              '">' +
              study(w) +
              '<small>' +
              escape(w.category) +
              '</small><h3>' +
              escape(w.title) +
              '</h3></a>',
          )
          .join('') +
        '</div><h2 class="text-heading">Three meanings of new</h2>' +
        future.classifications
          .map(
            (c) =>
              '<details class="note"><summary>' +
              escape(c.title) +
              '</summary><p>' +
              escape(c.description) +
              '</p></details>',
          )
          .join('') +
        '<div class="page-end">' +
        link(
          'priorities/index.html',
          'Read the full analysis and two further themes',
          'action',
        ) +
        link('next/index.html', 'Explore the next generation', 'action') +
        '</div></div>'
      );
    }
    const w = future.watch.find((w) => w.id === id);
    if (!w) return missing();
    return (
      header('#watch', 'Six to watch', w.title, w.subtitle) +
      '<div class="wrap section read-grid"><aside class="sample-board"><h2>' +
      escape(w.category) +
      '</h2>' +
      study(w, before) +
      '<p>' +
      escape(
        future.classifications.find((c) => c.title === w.category).description,
      ) +
      '</p>' +
      '<div class="actions"><a class="primary" data-keep-focus="turn" href="#watch/' +
      w.id +
      (before ? '' : '/earlier') +
      '">' +
      icon +
      (before ? 'See what changed' : 'See the earlier pattern') +
      '</a></div></aside><article class="story">' +
      (before
        ? section('Earlier roots', w.baseline)
        : section('What changed', w.premise)) +
      section('Why it matters', w.implication) +
      section('What to watch', w.signal) +
      sources(w.sources) +
      '<div class="large-quote">' +
      escape(w.question) +
      '</div><div class="page-end">' +
      link('#thread/' + w.theme, 'Follow the historical thread', 'action') +
      link('priorities/index.html#' + w.originalId, 'Read the full analysis', 'action') +
      link('#watch', 'See the six studies', 'action') +
      '</div>' + (w.theme === 'population' ? related([populationReading[1], populationReading[3]]) : '') +
      '</article></div>'
    );
  }
  const assumptionYarns = {
    fragmentation: ['trade', 'power'],
    automation: ['technology', 'trade'],
    'green-transition': ['climate', 'trade'],
    ageing: ['population', 'health'],
    urbanisation: ['population', 'climate'],
    individualisation: ['networks', 'power'],
    'democratic-decline': ['power', 'information'],
    digitalisation: ['technology', 'information'],
    'concentrated-networks': ['networks', 'power'],
    inequality: ['trade', 'power'],
    'chronic-disease': ['health', 'population'],
    scarcity: ['climate', 'trade'],
  };
  function futuresPage(id, loose) {
    const a =
      future.assumptions.find((x) => x.id === id) ||
      future.assumptions.find((x) => x.id === 'ageing') ||
      future.assumptions[0];
    const scenLinks = a.scenarioIds
      .map((s) => future.scenarios.find((x) => x.id === s))
      .map((s) => link('#scenario/' + s.id, s.title, 'action'))
      .join('');
    const routes = future.scenarios
      .map((s) => '<li>' + link('#scenario/' + s.id, s.title) + '</li>')
      .join('');
    return (
      header(
        '#home',
        'Home',
        'Possible futures',
        'What would have to happen for a familiar trend to change direction? Pick one of twelve assumptions and try loosening it.',
      ) +
      '<div class="wrap reader"><label class="control big-select">Choose an assumption<select id="pick-assumption">' +
      options(future.assumptions, a.id, (x) => x.title) +
      '</select></label><div class="panels"><section class="reading-card">' +
      weave(a.id, assumptionYarns[a.id]) +
      '<h3>If the assumption holds</h3><p>' +
      escape(a.holds) +
      '</p></section><section class="reading-card alternate">' +
      (loose
        ? weave(a.id, [...assumptionYarns[a.id]].reverse(), 'back') +
          '<h3>' +
          escape(a.alternative) +
          '</h3><p>' +
          escape(a.loosens) +
          '</p>'
        : '<h3>What might change its course?</h3><div class="page-end"><a class="primary" data-keep-focus="loosen" href="#futures/' +
          a.id +
          '/loose">' +
          icon +
          'Loosen the assumption</a></div>') +
      '</section></div>' +
      (loose
        ? '<article class="story" tabindex="-1" data-reveal-heading>' +
          section('What could follow', a.implication) +
          section('Signs to look for', a.signal) +
          sources(a.sources) +
          (scenLinks
            ? '<h3 class="text-heading">Explore a connected scenario</h3><div class="actions">' +
              scenLinks +
              '</div>'
            : '') +
          '<div class="page-end">' +
          link('#futures/' + a.id, 'Fold the alternative away', 'action') +
          '</div></article>'
        : '') +
      '<h2 class="text-heading">Three imagined futures</h2><p>These stories combine several assumptions. Read each as one plausible outcome.</p><ul class="plain-list">' +
      routes +
      '</ul><div class="page-end">' +
      link(
        'scenarios/index.html#' + a.originalId,
        'Read this assumption in the scenario chapter',
        'action',
      ) +
      '</div></div>'
    );
  }
  function scenarioPage(id) {
    const s = future.scenarios.find((x) => x.id === id);
    if (!s) return missing();
    return (
      header(
        '#futures',
        'Possible futures',
        s.title,
        'An illustrative scenario',
      ) +
      '<div class="wrap reader story"><p class="large-quote">' +
      escape(s.story) +
      '</p>' +
      section('How it could happen', s.mechanism) +
      section('Who gains, who misses out?', s.implication) +
      section('Signs to look for', s.signal) +
      '<h3 class="text-heading">Assumptions in this story</h3><ul class="plain-list">' +
      s.assumptionIds
        .map((id) => future.assumptions.find((a) => a.id === id))
        .map(
          (a) =>
            '<li>' + link('#futures/' + a.id + '/loose', a.title) + '</li>',
        )
        .join('') +
      '</ul>' + related([
        ['scenarios/index.html#' + s.originalId, 'Read this scenario in the complete chapter'],
        ...(s.originalId === 'demographic-inversion' ? populationReading.slice(0, 3) : []),
      ]) + '</div>'
    );
  }
  function guide() {
    return (
      header(
        '#home',
        'Home',
        'Field guide',
        'A first visit to the Observatory',
      ) +
      '<div class="wrap reader story">' +
      section(
        'What is a megatrend?',
        'A megatrend is a change that unfolds over decades, reaches across countries and affects several parts of life at once. As more people reach older ages, families may spend more time caring, employers may redesign jobs and towns may need more accessible homes.',
      ) +
      section(
        'What is strategic foresight?',
        'Strategic foresight explores several plausible futures to help people make choices today. Ask what might change course, who would experience the change first and what choices they have.',
      ) +
      '<section><h3>How to read the cloth</h3><p>Each colour follows a theme through the collection. A swatch combines colours from the themes assigned to a publication. Its pattern identifies the edition. The amount of each colour carries no statistical weight.</p><p>Choose <strong>See the sources</strong> to turn a thread over and reveal the publications behind it. Catalogue entries paraphrase the original works. Follow each edition’s source link to read it in context.</p></section>' +
      '<section><h3>Choose a way in</h3><ul class="plain-list">' +
      [
        ['#thread/technology', 'Follow the information society from 1982'],
        [
          defaultComparison,
          'Compare a book and a contemporary report',
        ],
        [
          'explorer/index.html',
          'Explore historical snapshots and possible futures, 1980–2050',
        ],
        [
          'synthesis/index.html#method',
          'See how researchers identify megatrends',
        ],
        ['next/index.html', 'Consider four candidates for the next generation'],
      ]
        .map(([h, l]) => '<li>' + link(h, l) + '</li>')
        .join('') +
      '</ul></section></div>'
    );
  }
  function savedPage() {
    const savedTrendIds = new Set(readSaved('longview.saved').map((id) =>
      Object.hasOwn(explorerAliases, id) ? explorerAliases[id] : id));
    const trends = threads.filter((thread) => savedTrendIds.has(thread.id));
    return (
      header(
        '#home',
        'Home',
        'Saved',
        'Revisit the threads and timelines you’ve saved on this device.',
      ) +
      '<div class="wrap reader"><h2 class="text-heading">Saved threads</h2>' +
      (saved.length
        ? '<ul class="saved-list">' +
          saved
            .map(
              (id) =>
                '<li>' +
                link('#thread/' + id, themeName(id)) +
                '<button class="button-line" data-remove="' +
                id +
                '" aria-label="Remove ' +
                escape(themeName(id)) +
                '">Remove</button></li>',
            )
            .join('') +
          '</ul>'
        : '<p class="empty">Follow a thread and choose <strong>Save thread</strong> to keep it here.</p>') +
      link('#loom', 'Browse themes', 'action') +
      '<h2 class="text-heading">Saved timelines</h2>' +
      (trends.length
        ? '<ul class="saved-list">' + trends.map((trend) => '<li>' +
          link('explorer/index.html#trend/' + trend.id, trend.label) + '</li>').join('') + '</ul>'
        : '<p class="empty">Bookmark a timeline in By year to see it here.</p>') +
      '<div class="page-end">' +
      (trends.length
        ? link('explorer/index.html#saved', 'Manage saved timelines', 'action')
        : link('explorer/index.html', 'Explore by year', 'action')) +
      '</div></div>'
    );
  }
  function missing() {
    return (
      header(
        '#home',
        'Home',
        'This thread ends here',
        'The address does not match an entry in the collection.',
      ) +
      '<div class="wrap reader">' +
      link('#loom', 'Return to the loom', 'action') +
      '</div>'
    );
  }
  function readRoute() {
    const fragment = location.hash.slice(1);
    const [path, query] = fragment.split('?');
    const [page = 'home', id, extra, filter] = path.split('/');
    return {
      page: page || 'home',
      id,
      extra,
      filter,
      q: new URLSearchParams(query),
    };
  }
  function render() {
    const { page, id, extra, filter, q } = readRoute();
    const previousPage = previousRoute.split('/')[0];
    if (page === 'main') {
      main.focus();
      return;
    }
    if (page === 'book' || page === 'publication' || page === 'compare' || page === 'next') {
      let target = cataloguePath;
      if (page === 'book' && q.size) target += '?' + q.toString();
      if (page === 'publication' && bookById.has(id)) target = publicationLink(bookById.get(id));
      if (page === 'compare') target = comparisonLink(id || bookDefault, extra || 'cifs-2026', filter);
      if (page === 'next') target = 'next/index.html';
      location.replace(target);
      return;
    }
    if (
      page === 'trend' ||
      page === 'index' ||
      (!location.hash && new URLSearchParams(location.search).has('year')) ||
      (!location.hash && new URLSearchParams(location.search).has('theme'))
    ) {
      location.replace(
        'explorer/index.html' +
          location.search +
          (page === 'home' ? '' : location.hash),
      );
      return;
    }
    const lastActive = document.activeElement?.dataset.keepFocus;
    const controlId = document.activeElement?.id;
    const keepScroll =
      previousPage === page &&
      (((page === 'thread' || page === 'watch' || page === 'futures') &&
        previousRoute.split('/')[1] === id) ||
        (page === 'futures' && controlId === 'pick-assumption'));
    const scroll = window.scrollY;
    let content;
    switch (page) {
      case 'home':
        content = home();
        break;
      case 'loom':
        content = loom();
        break;
      case 'thread':
        content = threadPage(id, extra === 'reverse');
        break;
      case 'watch':
        content = watchPage(id, extra === 'earlier');
        break;
      case 'futures':
        content = futuresPage(id, extra === 'loose');
        break;
      case 'scenario':
        content = scenarioPage(id);
        break;
      case 'guide':
        content = guide();
        break;
      case 'saved':
        content = savedPage();
        break;
      default:
        content = missing();
    }
    main.innerHTML = content;
    document.title =
      title === 'Megatrend Observatory'
        ? title
        : title + ' · Megatrend Observatory';
    const navPage =
      {
        thread: 'loom',
        watch: 'priorities',
        scenario: 'futures',
      }[page] || page;
    const navSection = { loom: 'explore', priorities: 'change' }[navPage] || navPage;
    window.setObservatorySection(navSection, navPage);
    window.drawWeaves(main);
    if (keepScroll) {
      const replacement =
        (controlId && document.getElementById(controlId)) ||
        (lastActive &&
          main.querySelector('[data-keep-focus="' + lastActive + '"]')) ||
        main.querySelector('[data-reveal-heading]');
      replacement?.focus({ preventScroll: true });
      window.scrollTo(0, scroll);
    } else {
      window.scrollTo(0, 0);
      if (previousRoute) main.focus({ preventScroll: true });
    }
    previousRoute = [page, id || '', extra || ''].join('/');
  }
  function storeSaved() {
    try {
      localStorage.setItem('observatory.threads', JSON.stringify(saved));
    } catch {}
  }
  document.addEventListener('click', (event) => {
    const target = event.target.closest('button,a');
    if (!target) return;
    if (target.matches('.skip')) {
      event.preventDefault();
      main.focus();
      return;
    }
    if (target.dataset.save) {
      const id = target.dataset.save;
      saved = saved.includes(id)
        ? saved.filter((x) => x !== id)
        : [...saved, id];
      storeSaved();
      target.textContent = saved.includes(id) ? 'Saved thread' : 'Save thread';
      target.setAttribute('aria-pressed', String(saved.includes(id)));
    }
    if (target.dataset.remove) {
      saved = saved.filter((x) => x !== target.dataset.remove);
      storeSaved();
      render();
      (main.querySelector('[data-remove]') || main).focus();
    }
  });
  document.addEventListener('change', (event) => {
    if (event.target.id === 'pick-assumption') {
      location.hash = 'futures/' + event.target.value;
      return;
    }
  });
  window.addEventListener('hashchange', render);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && readRoute().page === 'saved') render();
  });
  render();
})();
