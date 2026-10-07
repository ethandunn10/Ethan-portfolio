/* Click-through states. A visitor always lands on state 0 — the cream-and-gold
   palette with the sphere. Each click advances both the shape and the palette:
     0  sphere   cream bg, gold lines
     1  cube     white bg, black lines
     2  triangle black bg, white lines
   then back to 0. */
/* Wrapped in an IIFE so nothing lands in the global scope: hero.js is a
   classic script too, and a duplicate top-level const (canvas, resize,
   reduceMotion) is a SyntaxError that silently kills this whole file. */
(() => {
  const CYCLE = [
    { id: 'og',     accent: '#c9962c' },
    { id: 'paper',  accent: '#000000' },
    { id: 'carbon', accent: '#ffffff' },
  ];

  const root = document.documentElement;
  const STORE = 'ethan-palette';

  // the palette carries across pages, so About matches whatever Home was left on
  function stored() {
    const n = Number(localStorage.getItem(STORE));
    return Number.isInteger(n) && n >= 0 && n < CYCLE.length ? n : 0;
  }

  let index = stored();

  function apply(i) {
    index = (i + CYCLE.length) % CYCLE.length;
    const state = CYCLE[index];

    // "og" is the bare :root palette, so it carries no data-theme attribute
    if (state.id === 'og') {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = state.id;
    }

    try { localStorage.setItem(STORE, String(index)); } catch (e) { /* private mode */ }

    if (window.__setHeroAccent) window.__setHeroAccent(state.accent);
    if (window.__setHeroShape) window.__setHeroShape(index);
  }

  const cue = document.querySelector('.click-cue');
  const hero = document.querySelector('.hero');

  function advance() {
    apply(index + 1);

    // restart the bloom animation on every click
    if (!cue) return;
    cue.classList.remove('is-firing');
    void cue.offsetWidth;
    cue.classList.add('is-firing');
  }

  if (cue) {
    cue.addEventListener('click', advance);
    cue.addEventListener('animationend', (e) => {
      if (e.animationName === 'cue-fire') cue.classList.remove('is-firing');
    });
  }

  // the shape itself is a click target too
  if (hero) hero.addEventListener('click', advance);

  apply(index);
})();
