// Site nav: sticky bar that turns solid on scroll, Projects/Content
// dropdowns (hover, click, keyboard), and the full-screen phone menu.
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  if (!header) return;

  const desktop = window.matchMedia('(min-width: 768px)');

  /* ---- Transparent at the top, white + border + blur once scrolled ---- */
  const sentinel = document.createElement('div');
  sentinel.className = 'scroll-sentinel';
  sentinel.setAttribute('aria-hidden', 'true');
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => {
    header.classList.toggle('is-scrolled', !e.isIntersecting);
  }).observe(sentinel);

  /* ---- Dropdowns ---- */
  const items = [...header.querySelectorAll('.has-dropdown')];

  const isOpen = (item) => item.querySelector('.nav-trigger').getAttribute('aria-expanded') === 'true';
  const setOpen = (item, open) => {
    item.querySelector('.nav-trigger').setAttribute('aria-expanded', String(open));
    if (!open) delete item.dataset.hover;
  };
  const closeAll = (except) => items.forEach((i) => { if (i !== except) setOpen(i, false); });

  items.forEach((item) => {
    const trigger = item.querySelector('.nav-trigger');
    const links = [...item.querySelectorAll('.dropdown a')];
    let leaveTimer;

    trigger.addEventListener('click', () => {
      /* opened by hovering a moment ago: the click pins it open instead of closing it */
      if (isOpen(item) && item.dataset.hover) { delete item.dataset.hover; return; }
      const next = !isOpen(item);
      closeAll(item);
      setOpen(item, next);
    });

    /* hover (desktop mouse only) */
    item.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !desktop.matches) return;
      clearTimeout(leaveTimer);
      if (!isOpen(item)) {
        closeAll(item);
        setOpen(item, true);
        item.dataset.hover = '1';
      }
    });
    item.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse' || !desktop.matches || !item.dataset.hover) return;
      leaveTimer = setTimeout(() => setOpen(item, false), 150);
    });

    /* keyboard: arrows into and around the panel */
    trigger.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      closeAll(item);
      setOpen(item, true);
      (e.key === 'ArrowDown' ? links[0] : links[links.length - 1]).focus();
    });
    item.querySelector('.dropdown').addEventListener('keydown', (e) => {
      const i = links.indexOf(document.activeElement);
      let next = null;
      if (e.key === 'ArrowDown') next = links[(i + 1) % links.length];
      if (e.key === 'ArrowUp') next = links[(i - 1 + links.length) % links.length];
      if (e.key === 'Home') next = links[0];
      if (e.key === 'End') next = links[links.length - 1];
      if (next) { e.preventDefault(); next.focus(); }
    });

    /* tabbing out of a desktop dropdown closes it */
    item.addEventListener('focusout', (e) => {
      if (desktop.matches && !item.contains(e.relatedTarget)) setOpen(item, false);
    });
  });

  /* click anywhere else closes (desktop; on the phone they're accordions) */
  document.addEventListener('click', (e) => {
    if (desktop.matches && !e.target.closest('.has-dropdown')) closeAll();
  });

  /* ---- Phone menu ---- */
  const toggle = header.querySelector('.menu-toggle');
  const nav = header.querySelector('.site-nav');
  const outside = [document.querySelector('main'), document.querySelector('.site-footer'), document.querySelector('.skip')].filter(Boolean);

  const menuOpen = () => root.classList.contains('nav-open');
  const setMenu = (open, { focusToggle = false } = {}) => {
    root.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    outside.forEach((el) => { el.inert = open; });
    if (open) nav.querySelector('a, button')?.focus();
    else if (focusToggle) toggle.focus();
  };

  toggle.addEventListener('click', () => setMenu(!menuOpen()));
  nav.addEventListener('click', (e) => { if (e.target.closest('a') && menuOpen()) setMenu(false); });
  desktop.addEventListener('change', (e) => {
    if (e.matches && menuOpen()) setMenu(false);
    closeAll();
  });

  /* ---- Escape closes whatever is open ---- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = items.find(isOpen);
    if (open && (desktop.matches || !menuOpen())) {
      const hadFocus = open.contains(document.activeElement);
      setOpen(open, false);
      if (hadFocus) open.querySelector('.nav-trigger').focus();
      return;
    }
    if (menuOpen()) setMenu(false, { focusToggle: true });
  });
})();
