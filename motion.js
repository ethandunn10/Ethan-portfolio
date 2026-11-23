// Subtle motion, built on Motion (the framework-free Framer Motion).
// Only runs when the inline script in <head> added the "motion" class,
// which it skips for prefers-reduced-motion. Opacity + transform only,
// so it stays on the GPU and cheap on phones.
import { animate } from './assets/js/motion-mini-11.18.2.js';

const root = document.documentElement;

if (root.classList.contains('motion')) {
  window.__motion = true;

  const EASE = [0.22, 1, 0.36, 1];
  const UP = ['translateY(20px)', 'translateY(0)'];
  const FADE = 1.2;     // seconds each item takes to fade in
  const STAGGER = 0.15; // gap between items that appear together

  // Fade an element in. Opacity gets its own even curve so the fade is
  // actually visible (a snappy ease-out makes it look like a pop); the 20px
  // rise keeps the soft settle. Then hand the element back to CSS, since a
  // finished animation would keep holding transform and block the hover lift.
  const reveal = (el, { move = true, duration = FADE, delay = 0 } = {}) => {
    const anims = [animate(el, { opacity: [0, 1] }, { duration, delay, ease: [0.4, 0, 0.6, 1] })];
    if (move) anims.push(animate(el, { transform: UP }, { duration, delay, ease: EASE }));
    Promise.all(anims).then(() => {
      el.classList.add('is-in');
      anims.forEach((a) => a.cancel());
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
    });
  };

  // Header: a soft fade on load (no movement, it's sticky)
  const header = document.querySelector('.site-header');
  if (header) reveal(header, { move: false, duration: 1 });

  // 2. Hero: headline lines, tagline, buttons, photo, marquee, staggered on load
  const hero = document.querySelectorAll(
    '.hero h1 span, .hero-sub, .hero-actions, .hero-photo, .marquee,' +
    '.about-hero .hero-photo, .about-hero h1, .about-body'
  );
  hero.forEach((el, i) => {
    reveal(el, { delay: 0.25 + i * STAGGER });
  });

  // 3. Proof bar: "150K+" counts up from 0. Screen readers get the real value.
  const counters = [];
  document.querySelectorAll('.proof strong').forEach((el) => {
    const m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m) return;
    const target = Number(m[1]);
    const suffix = m[2];
    el.textContent = '';
    const real = document.createElement('span');
    real.className = 'sr-only';
    real.textContent = target + suffix;
    const shown = document.createElement('span');
    shown.setAttribute('aria-hidden', 'true');
    shown.textContent = '0' + suffix;
    el.append(real, shown);
    counters.push({ shown, target, suffix });
  });

  let counted = false;
  const countUp = () => {
    if (counted) return;
    counted = true;
    const start = performance.now();
    const DURATION = 1600;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      counters.forEach((c) => { c.shown.textContent = Math.round(c.target * eased) + c.suffix; });
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // 1. Every piece of every section fades in + up 20px when it scrolls into
  //    view, once. Items that arrive together play one after another.
  const onEnter = (entries, io) => {
    let i = 0;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      reveal(el, { delay: i * STAGGER });
      if (el.closest('.proof')) countUp();
      i += 1;
    });
  };
  const io = new IntersectionObserver(onEnter, { rootMargin: '0px 0px -15% 0px', threshold: 0.2 });
  // the footer sits at the very bottom and can't scroll past that line
  const footerIo = new IntersectionObserver(onEnter, { threshold: 0.5 });
  document.querySelectorAll('.site-footer .wrap > *').forEach((el) => footerIo.observe(el));

  document.querySelectorAll(
    '.section-label, .section-title, .card, .highlights li, .about-short p:not(.section-label),' +
    '.text-link, .proof li, .log li'
  ).forEach((el) => io.observe(el));
}

// 5. Marquee: pause the CSS loop while it's off screen (saves battery on phones)
const marquee = document.querySelector('.marquee');
if (marquee) {
  new IntersectionObserver(([e]) => {
    marquee.classList.toggle('is-paused', !e.isIntersecting);
  }).observe(marquee);
}
