'use strict';

function revealChapterAnchor() {
  const target = document.getElementById(location.hash.slice(1));
  const disclosure = target?.closest('details');
  if (disclosure) {
    disclosure.open = true;
    target.scrollIntoView({ block: 'start' });
  }
}

window.addEventListener('hashchange', revealChapterAnchor);
revealChapterAnchor();
