/* Home page top half: the sticky sphere section.
   While the section is pinned, scroll progress picks which fact shows on the
   sphere and spins the sphere (hero.js).
   The opening screen and the ticker are pure CSS. Wrapped in an IIFE so nothing lands in the global scope. */
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const track = document.querySelector('.facts-track');
  if (!track) return;

  const facts = [...document.querySelectorAll('.fact')];
  const dots = [...document.querySelectorAll('.fact-dots i')];

  /* Reduce motion: no pinning, no swapping. Every fact is listed at once. */
  if (reduceMotion) {
    root.classList.add('facts-static');
    facts.forEach((f) => f.classList.add('is-on'));
    if (window.__sphereProgress) window.__sphereProgress(0.15);
    return;
  }

  let active = 0;
  function setActive(i) {
    if (i === active) return;
    facts[active].classList.remove('is-on');
    dots[active] && dots[active].classList.remove('is-on');
    active = i;
    facts[active].classList.add('is-on');
    dots[active] && dots[active].classList.add('is-on');
  }

  let ticking = false;
  function update() {
    ticking = false;
    const rect = track.getBoundingClientRect();
    const total = track.offsetHeight - window.innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    setActive(Math.min(facts.length - 1, Math.floor(p * facts.length)));
    if (window.__sphereProgress) window.__sphereProgress(p);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

/* Latest section: show the 6 newest Log items, "See full log" expands the rest in place.
   Without JS the whole list is simply shown. */
(() => {
  const list = document.getElementById('log-list');
  const btn = document.querySelector('.log-more');
  if (!list || !btn) return;

  list.classList.add('is-collapsed');
  btn.hidden = false;

  btn.addEventListener('click', () => {
    const open = list.classList.toggle('is-collapsed') === false;
    btn.setAttribute('aria-expanded', String(open));
    btn.innerHTML = open ? 'Show less &uarr;' : 'See full log &rarr;';
    if (!open) list.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
})();
