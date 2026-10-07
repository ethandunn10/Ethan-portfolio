/* Stat line, scroll reveals and the scroll-progress hairline.
   Wrapped in an IIFE so nothing lands in the global scope — hero.js is a
   classic script too, and a duplicate top-level const is a SyntaxError that
   would silently kill this whole file. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- live counters ---------- */

  // 08.22.26 — the day the Log says he actually started building
  const DAY_ONE = new Date(2026, 7, 22);

  function daysSince(from) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(1, Math.round((today - from) / 86400000));
  }

  const days = daysSince(DAY_ONE);
  document.querySelectorAll('[data-live="days"]').forEach((el) => {
    el.dataset.count = String(days);
  });

  /* ---------- count-up ---------- */

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function countUp(el) {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target) || el.dataset.counted) return;
    el.dataset.counted = '1';

    const prefix = el.dataset.prefix || '';
    const numEl = el.querySelector('.stat-num') || el;

    if (reduceMotion) {
      numEl.textContent = prefix + target;
      return;
    }

    const duration = 900;
    const start = performance.now();

    function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      numEl.textContent = prefix + Math.round(target * easeOutCubic(p));
      if (p < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  /* ---------- scroll reveal ---------- */

  const revealables = document.querySelectorAll('[data-reveal]');

  // stats rise in sequence rather than all at once
  document.querySelectorAll('.stat[data-reveal]').forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${i * 70}ms`);
  });

  function show(el) {
    el.classList.add('is-in');
    if (el.hasAttribute('data-count')) countUp(el);
    el.querySelectorAll('[data-count]').forEach(countUp);
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(show);
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- scroll progress hairline ---------- */

  const rail = document.querySelector('.scroll-rail i');

  if (rail) {
    let queued = false;

    function paintRail() {
      queued = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      rail.style.transform = `scaleX(${p})`;
    }

    window.addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paintRail);
    }, { passive: true });

    window.addEventListener('resize', paintRail);
    paintRail();
  }
})();
