/* Slow-drifting star field behind the page. Picks its color up from the
   active palette, so it re-tints whenever the click cycle fires. */
/* Wrapped in an IIFE so nothing lands in the global scope: hero.js is a
   classic script too, and a duplicate top-level const (canvas, resize,
   reduceMotion) is a SyntaxError that silently kills this whole file. */
(() => {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const COUNT = 90;
  let stars = [];
  let w = 0;
  let h = 0;

  function readColor() {
    const muted = getComputedStyle(document.documentElement)
      .getPropertyValue('--muted')
      .trim();
    return muted || '#8a8579';
  }

  let color = readColor();

  // the palette changes on click, so re-read it when the attribute flips
  new MutationObserver(() => {
    color = readColor();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function seed() {
    stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.1 + 1.1,
      // visible drift — roughly 20-45px a second across the page
      vx: (Math.random() - 0.5) * 1.3,
      vy: (Math.random() - 0.5) * 1.3,
      base: Math.random() * 0.4 + 0.22,
      phase: Math.random() * Math.PI * 2,
      twinkle: Math.random() * 0.0035 + 0.0012,
    }));
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;

    for (const s of stars) {
      if (!reduceMotion) {
        s.x += s.vx;
        s.y += s.vy;

        // wrap around the edges so the field never empties out
        if (s.x < -2) s.x = w + 2;
        if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2;
        if (s.y > h + 2) s.y = -2;
      }

      const alpha = reduceMotion
        ? s.base
        : s.base + Math.sin(t * s.twinkle + s.phase) * 0.3;

      ctx.globalAlpha = Math.max(0.06, Math.min(0.85, alpha));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function frame(t) {
    draw(t);
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduceMotion) {
    draw(0);
  } else {
    requestAnimationFrame(frame);
  }
})();
