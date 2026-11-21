(() => {
  'use strict';
  const books = window.OBS_BOOKS;
  const threads = window.OBS_THREADS;
  const future = window.OBS_FUTURES;
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
  const validTheme = (id) => threadById.has(id) || id === 'other';
  const themeName = (id) => threadById.get(id)?.label || 'Other themes';
  const themeColour = (id) => threadById.get(id)?.color || '#857782';
  const icon =
    '<svg class="fiber-icon" viewBox="0 0 26 20" aria-hidden="true"><path d="M1 6c4 0 5 6 10 6s5-8 10-8c3 0 4 3 2 5-3 3-7 1-9 0M1 10c4 0 5 6 10 6"/></svg>';
  let title = '';
  let previousRoute = '';
  let saved = [];
  try {
    const stored = JSON.parse(
      localStorage.getItem('observatory.threads') || '[]',
    );
    if (Array.isArray(stored))
      saved = stored.filter((id) => threadById.has(id));
  } catch {}
  const link = (href, label, classes = '') =>
    '<a class="' +
    classes +
    '" href="' +
    escape(href) +
    '">' +
    escape(label) +
    '</a>';
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
  function bookWeave(book, highlight = '') {
    const themes = [
      ...new Set(
        book.entries.flatMap((entry) => entry.themes || [entry.theme]),
      ),
    ];
    return weave(book.id, themes, 'front', highlight);
  }
  function header(back, label, heading, description = '') {
    title = heading;
    return (
      '<div class="wrap read-head">' +
      link(back, label, 'back') +
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
      '<section class="night hero"><div class="hero-copy"><h1>How ideas of the future change</h1><p>Follow a thread through four decades of books and reports about the forces shaping our lives.</p><div class="actions"><a class="primary" href="#thread/technology">' +
      icon +
      'Follow a thread</a>' +
      link('#book', 'Open the swatch book', 'quiet-action') +
      '</div></div><div class="hero-art" role="img" aria-label="A close view of raspberry, indigo and gold Jacquard cloth with loose yarn at its edge"></div></section>' +
      '<section class="wrap section"><div class="section-title"><div><h2>Pick up a thread</h2><p>Start with a question that draws you in. See how earlier authors understood it.</p></div>' +
      link('#loom', 'All eight threads', 'action') +
      '</div><div class="thread-shelf">' +
      ['technology', 'climate', 'population', 'information']
        .map((id) => threadLink(threadById.get(id)))
        .join('') +
      '</div></section>' +
      '<section class="white"><div class="wrap invitation"><div class="book-art" role="img" aria-label="An archive of woven samples, open at 1982 and the 2020s"></div><div><h2>The swatch book</h2><p>John Naisbitt saw an information society taking shape in 1982. What did later authors see? Lay two publications side by side and examine their choices.</p><div class="actions">' +
      link(
        '#compare/' + bookDefault + '/cifs-2026',
        'Compare two publications',
        'primary',
      ) +
      link('#book', 'Browse the catalogue', 'action') +
      '</div></div></div></section>' +
      '<section class="wrap section chapter-menu">' +
      [
        [
          '#watch',
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
          'The horizon explorer',
          'Move between 1980 and 2050 with six illustrated trends.',
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
        'The loom',
        'Eight themes recur across the collection. Each thread follows a changing idea through the words and concerns of its time.',
      ) +
      '<div class="wrap section"><div class="thread-shelf">' +
      threads.map(threadLink).join('') +
      '</div><div class="page-end">' +
      link('synthesis/index.html', 'Read the historical synthesis', 'action') +
      link('explorer/index.html', 'Explore six trends across time', 'action') +
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
            '<a href="#publication/' +
            b.id +
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
            link('#publication/' + b.id, 'Open publication') +
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
      header('#loom', 'All threads', t.label) +
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
      (back ? 'Turn to the story' : 'Turn the cloth over') +
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
        '#compare/' +
          witnesses[0].id +
          '/' +
          witnesses[witnesses.length - 1].id +
          '/' +
          t.id,
        'Compare the first and last editions',
        'action',
      ) +
      '</div></article></div>'
    );
  }
  function bookRow(b) {
    return (
      '<a class="row-link" href="#publication/' +
      b.id +
      '">' +
      bookWeave(b) +
      '<time>' +
      b.year +
      '</time><span><strong>' +
      escape(b.title) +
      '</strong><small>' +
      escape(b.author) +
      '</small></span><span class="open">Open edition</span></a>'
    );
  }
  function catalogue(q) {
    const decade = q.get('decade') || '';
    return (
      header(
        '#home',
        'Home',
        'The swatch book',
        'Browse the 24 publications. Their scope ranges from one country’s changing habits to the world economy.',
      ) +
      '<div class="wrap"><div class="actions">' +
      link(
        '#compare/' + bookDefault + '/cifs-2026',
        'Compare two publications',
        'primary',
      ) +
      link('history/index.html', 'Read the decade histories', 'action') +
      '</div><div class="toolbar"><label class="control">Search the collection<input id="book-term" type="search" placeholder="Title, author or theme" value="' +
      escape(q.get('q') || '') +
      '"></label><label class="control">Decade<select id="book-decade"><option value="">All decades</option>' +
      Object.keys(window.OBS_ERAS)
        .map(
          (d) =>
            '<option ' +
            (d === decade ? 'selected ' : '') +
            'value="' +
            d +
            '">' +
            d +
            's</option>',
        )
        .join('') +
      '</select></label></div><p class="status" role="status" id="book-status"></p><div id="book-results" class="book-list"></div></div>'
    );
  }
  function filterBooks(updateAddress) {
    const input = document.getElementById('book-term');
    if (!input) return;
    const value = input.value.trim().toLocaleLowerCase();
    const decade = document.getElementById('book-decade').value;
    const matches = books.filter(
      (b) =>
        (!decade || Math.floor(b.year / 10) * 10 === Number(decade)) &&
        (!value ||
          [
            b.title,
            b.author,
            b.lens,
            b.summary,
            ...b.entries.flatMap((e) => [
              e.text,
              e.detail,
              ...(e.themes || [e.theme]).map(themeName),
            ]),
          ]
            .join(' ')
            .toLocaleLowerCase()
            .includes(value)),
    );
    if (updateAddress && location.protocol !== 'file:') {
      const params = new URLSearchParams();
      if (value) params.set('q', input.value);
      if (decade) params.set('decade', decade);
      history.replaceState(
        null,
        '',
        '#book' + (params.size ? '?' + params : ''),
      );
    }
    document.getElementById('book-status').textContent =
      matches.length + ' of ' + books.length + ' publications';
    const results = document.getElementById('book-results');
    results.innerHTML = matches.length
      ? matches.map(bookRow).join('')
      : '<p class="empty">No editions matched. <button class="button-line" data-clear>Clear search and decade</button></p>';
    window.drawWeaves(results);
  }
  function entries(items, theme) {
    return (
      '<ul class="entries">' +
      items
        .map(
          (e) =>
            '<li class="' +
            ((e.themes || [e.theme]).includes(theme) ? 'matched' : '') +
            '"><h4>' +
            escape(e.text) +
            '</h4><p>' +
            escape(e.detail) +
            '</p></li>',
        )
        .join('') +
      '</ul>'
    );
  }
  function publication(bid) {
    const b = bookById.get(bid);
    if (!b) return missing();
    return (
      header('#book', 'Swatch book', b.title, b.author + ' / ' + b.year) +
      '<div class="wrap reader"><article class="book-reading">' +
      bookWeave(b) +
      '<p class="credit">' +
      escape(b.lens) +
      '</p><p class="deck">' +
      escape(b.summary) +
      '</p><div class="page-end">' +
      link(b.url, 'Read the original source', 'action') +
      link(
        '#compare/' +
          b.id +
          '/' +
          (b.id === bookDefault ? 'cifs-2026' : bookDefault),
        'Compare with another edition',
        'action',
      ) +
      '</div>' +
      (b.entries.length
        ? '<h2 class="text-heading">Inside this edition</h2>' +
          entries(b.entries)
        : '<p>This methods review examines how megatrends are identified.</p>') +
      '</article></div>'
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
  function compare(left, right, filter) {
    const a = bookById.get(left) || books[0],
      b = bookById.get(right) || bookById.get('cifs-2026');
    filter = validTheme(filter) ? filter : '';
    const pane = (book, side, label) => {
      const lines = filter
        ? book.entries.filter((e) => (e.themes || [e.theme]).includes(filter))
        : book.entries;
      return (
        '<section class="leaf" id="page-' +
        side +
        '" tabindex="-1"><button class="switch-leaf" data-other-leaf="' +
        (side === 'left' ? 'right' : 'left') +
        '">Read the other edition</button><label class="control">' +
        label +
        '<select id="pick-' +
        side +
        '">' +
        options(
          books,
          book.id,
          (x) => x.year + ' / ' + x.author + ' / ' + x.title,
        ) +
        '</select></label>' +
        bookWeave(book, filter) +
        '<div class="credit">' +
        book.year +
        ' / ' +
        escape(book.author) +
        '</div><h2>' +
        escape(book.title) +
        '</h2><p>' +
        escape(book.summary) +
        '</p><h3>' +
        (filter ? escape(themeName(filter)) : 'Themes in this edition') +
        '</h3>' +
        (lines.length
          ? entries(lines, filter)
          : '<p class="empty">' +
            (book.entries.length
              ? 'This edition has no entry assigned to this thread.'
              : 'This methods review does not propose a list of trends.') +
            '</p>') +
        '<div class="page-end">' +
        link('#publication/' + book.id, 'Open full edition', 'action') +
        link(book.url, 'Source', 'action') +
        '</div></section>'
      );
    };
    return (
      header(
        '#book',
        'Swatch book',
        'Two editions, side by side',
        'Choose a thread to see where the two editions speak to the same question. A gap can be as revealing as a match.',
      ) +
      '<div class="wrap"><div class="toolbar"><label class="control big-select">Trace a theme<select id="pick-filter"><option value="">All themes</option>' +
      options(
        [...threads, { id: 'other', label: 'Other themes' }],
        filter,
        (t) => t.label,
      ) +
      '</select></label></div><div class="spread" style="--yarn:' +
      themeColour(filter) +
      '">' +
      pane(a, 'left', 'Left-hand edition') +
      pane(b, 'right', 'Right-hand edition') +
      '</div><div class="page-end">' +
      link('#book', 'Return to the catalogue', 'action') +
      '</div></div>'
    );
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
        link('#next', 'Explore the next generation', 'action') +
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
      link('#watch', 'See the six studies', 'action') +
      '</div></article></div>'
    );
  }
  function nextPage() {
    return (
      header(
        '#watch',
        'Six to watch',
        'The next generation',
        'Four candidates at the unfinished edge of the collection. Each is a proposition you can test.',
      ) +
      '<div class="wrap reader">' +
      future.candidates
        .map(
          (c) =>
            '<details class="note"><summary>' +
            escape(c.title) +
            '</summary><p>' +
            escape(c.baseline) +
            '</p><p>' +
            escape(c.implication) +
            '</p><p><strong>What to watch</strong> ' +
            escape(c.signal) +
            '</p><p>' +
            escape(c.question) +
            '</p>' +
            sources(c.sources) +
            '</details>',
        )
        .join('') +
      '<div class="page-end">' +
      link('next/index.html', 'Read the next-generation chapter', 'action') +
      '</div></div>'
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
        'scenarios/index.html',
        'Read the complete scenario chapter',
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
      '</ul></div>'
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
      '<section><h3>How to read the cloth</h3><p>Each colour follows a theme through the collection. A swatch combines colours from the themes assigned to a publication. Its pattern identifies the edition. The amount of each colour carries no statistical weight.</p><p>Turn a thread over to see the publications behind the interpretation. Catalogue entries paraphrase the original works. Follow each edition’s source link to read it in context.</p></section>' +
      '<section><h3>Choose a way in</h3><ul class="plain-list">' +
      [
        ['#thread/technology', 'Follow the information society from 1982'],
        [
          '#compare/' + bookDefault + '/cifs-2026',
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
        ['#next', 'Consider four candidates for the next generation'],
      ]
        .map(([h, l]) => '<li>' + link(h, l) + '</li>')
        .join('') +
      '</ul></section></div>'
    );
  }
  function savedPage() {
    return (
      header(
        '#loom',
        'The loom',
        'Saved threads',
        'Revisit the threads you have marked on this device.',
      ) +
      '<div class="wrap reader">' +
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
      '<div class="page-end">' +
      link('#loom', 'Browse threads', 'action') +
      link('explorer/index.html#saved', 'Open saved horizon trends', 'action') +
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
        page === 'compare' ||
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
      case 'book':
        content = catalogue(q);
        break;
      case 'publication':
        content = publication(id);
        break;
      case 'compare':
        content = compare(id, extra, filter);
        break;
      case 'watch':
        content = watchPage(id, extra === 'earlier');
        break;
      case 'next':
        content = nextPage();
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
        publication: 'book',
        compare: 'book',
        scenario: 'futures',
        next: 'watch',
      }[page] || page;
    document.querySelectorAll('#menu a').forEach((a) => {
      if (a.hash === '#' + navPage) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    if (page === 'book') filterBooks(false);
    window.drawWeaves(main);
    setMenu(false);
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
  function setMenu(open) {
    document.getElementById('menu').classList.toggle('shown', open);
    document
      .querySelector('.menu-toggle')
      .setAttribute('aria-expanded', String(open));
  }
  function storeSaved() {
    try {
      localStorage.setItem('observatory.threads', JSON.stringify(saved));
    } catch {}
  }
  document.addEventListener('click', (event) => {
    const target = event.target.closest('button,a');
    if (!target) return;
    if (target.dataset.otherLeaf) {
      const leaf = document.getElementById('page-' + target.dataset.otherLeaf);
      leaf?.focus({ preventScroll: true });
      leaf?.scrollIntoView({ block: 'start' });
      return;
    }
    if (target.matches('.skip')) {
      event.preventDefault();
      main.focus();
      return;
    }
    if (target.matches('.menu-toggle')) {
      setMenu(target.getAttribute('aria-expanded') === 'false');
      return;
    }
    if (target.matches('#menu a')) setMenu(false);
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
    if (target.hasAttribute('data-clear')) {
      document.getElementById('book-term').value = '';
      document.getElementById('book-decade').value = '';
      filterBooks(true);
      document.getElementById('book-term').focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      document.getElementById('menu').classList.contains('shown')
    ) {
      setMenu(false);
      document.querySelector('.menu-toggle').focus();
    }
  });
  document.addEventListener('input', (event) => {
    if (event.target.id === 'book-term') filterBooks(true);
  });
  document.addEventListener('change', (event) => {
    if (event.target.id === 'book-decade') {
      filterBooks(true);
      return;
    }
    if (event.target.id === 'pick-assumption') {
      location.hash = 'futures/' + event.target.value;
      return;
    }
    if (['pick-left', 'pick-right', 'pick-filter'].includes(event.target.id)) {
      const value = (id) => document.getElementById('pick-' + id).value;
      location.hash =
        'compare/' +
        value('left') +
        '/' +
        value('right') +
        (value('filter') ? '/' + value('filter') : '');
    }
  });
  window.addEventListener('hashchange', render);
  render();
})();
