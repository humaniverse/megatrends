(() => {
  'use strict';

  const toggle = document.querySelector('.site-menu-toggle');
  const menu = document.getElementById('site-menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  }

  document.documentElement.classList.add('site-enhanced');
  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') === 'false');
  });
  menu.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    if (menu.classList.contains('is-open') && link.href === location.href) toggle.focus();
    setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.setObservatorySection = (section, page) => {
    for (const link of menu.querySelectorAll('[data-nav]')) {
      if (link.dataset.nav === section) {
        link.setAttribute('aria-current', section === page ? 'page' : 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    }
    for (const nav of document.querySelectorAll('.site-subnav')) {
      nav.hidden = nav.dataset.section !== section;
      for (const link of nav.querySelectorAll('[data-subnav]')) {
        if (link.dataset.subnav === page) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }
    }
    setMenu(false);
  };
})();
