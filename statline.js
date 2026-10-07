/* Stat line — the numbers count up once they scroll into view.
   Wrapped in an IIFE so nothing lands in the global scope: hero.js is a
   classic script too, and a duplicate top-level const would be a
   SyntaxError that silently kills this whole file. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  /* A number cell counts up from zero. Cells with no data-count (the
     hackathon finish, the pending "up next") just sit there as text. */
  function countUp(el) {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target) || el.dataset.counted) return;
    el.dataset.counted = '1';

    const decimals = Number(el.dataset.decimals) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const numEl = el.querySelector('.stat-num') || el;
    const write = (v) => {
      numEl.textContent = prefix + v.toFixed(decimals) + suffix;
    };

    if (reduceMotion) {
      write(target);
      return;
    }

    const duration = 1000;
    const start = performance.now();

    function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      write(target * easeOutCubic(p));
      if (p < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  /* Reveal — the head, then the cells in sequence */
  const revealables = document.querySelectorAll('[data-reveal]');

  document.querySelectorAll('.stat[data-reveal]').forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${i * 65}ms`);
  });

  function show(el) {
    el.classList.add('is-in');
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
    }, { threshold: 0.25, rootMargin: '0px 0px -6% 0px' });

    revealables.forEach((el) => io.observe(el));
  }
})();
