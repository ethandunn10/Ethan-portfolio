/* Home page top half: the sticky sphere section.
   While the section is pinned, scroll progress picks which fact shows on the
   sphere and spins the sphere (hero.js). The opening screen and the ticker
   are pure CSS. Wrapped in an IIFE so nothing lands in the global scope. */
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = window.matchMedia('(max-width: 760px)');

  const track = document.querySelector('.facts-track');
  if (!track) return;

  const facts = [...document.querySelectorAll('.fact')];
  const dots = [...document.querySelectorAll('.fact-dots i')];
  const log = document.querySelector('.facts-log');
  const logDesk = document.querySelector('.facts-log-slot');
  const logPhone = document.querySelector('.log-phone-slot');

  /* The Log sits left of the sphere on a laptop. On a phone there's no room,
     so it moves below the sphere section as a normal list. */
  function placeLog() {
    const slot = phone.matches ? logPhone : logDesk;
    if (log && slot && log.parentElement !== slot) slot.appendChild(log);
  }
  placeLog();
  phone.addEventListener ? phone.addEventListener('change', placeLog) : phone.addListener(placeLog);

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
