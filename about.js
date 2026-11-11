/* About page: the text fades in line by line as it scrolls into view, and
   the cut-out drifts a little slower than the page (laptop only, so phones
   stay smooth). Wrapped in an IIFE so nothing lands in the global scope. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.querySelector('.about-body');
  if (!body || reduceMotion) return;

  const paras = [...body.querySelectorAll('p')];

  // wrap every word so we can tell which line it landed on
  paras.forEach((p) => {
    [...p.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const w = document.createElement('span');
            w.className = 'line';
            w.textContent = part;
            frag.appendChild(w);
          }
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.classList.add('line');
      }
    });
  });

  // same line = same delay; each next line ~90ms later
  function stagger() {
    paras.forEach((p) => {
      let top = null;
      let line = -1;
      p.querySelectorAll('.line').forEach((w) => {
        if (w.offsetTop !== top) {
          top = w.offsetTop;
          line += 1;
        }
        w.style.setProperty('--d', `${Math.min(line * 90, 900)}ms`);
      });
    });
  }
  stagger();
  window.addEventListener('resize', stagger, { passive: true });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    paras.forEach((p) => io.observe(p));
  } else {
    paras.forEach((p) => p.classList.add('is-in'));
  }

  // slight parallax on the cut-out
  const wrap = document.querySelector('.about-me-wrap');
  if (!wrap || window.matchMedia('(max-width: 760px)').matches) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      wrap.style.transform = `translateY(${Math.min(window.scrollY * 0.12, 160)}px)`;
    });
  }, { passive: true });
})();
