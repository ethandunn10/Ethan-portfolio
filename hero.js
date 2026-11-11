/* The gold wireframe sphere. three.js is loaded as a plain script
   (three.min.js) so this works over file:// and with no network.

   Scrolling through the facts section spins it: intro.js calls
   window.__sphereProgress(p) with p going 0 -> 1. It also turns slowly on
   its own, and stops drawing whenever it's off screen so phones stay cool.
   Wrapped in an IIFE so nothing lands in the global scope. */
(() => {
  const canvas = document.getElementById('sphere-canvas');
  if (!canvas || !window.THREE) return;

  const box = canvas;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = window.matchMedia('(max-width: 760px)').matches;

  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim() || '#c9962c';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.9;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2));

  const sphere = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(1.2, phone ? 18 : 22, phone ? 12 : 16)),
    new THREE.LineBasicMaterial({ color: new THREE.Color(accent), transparent: true, opacity: 0.8 })
  );
  sphere.rotation.x = 0.35;

  const group = new THREE.Group();
  group.add(sphere);
  scene.add(group);

  const render = () => renderer.render(scene, camera);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (reduceMotion) render();
  }
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(box);
  else window.addEventListener('resize', resize);

  // scroll-driven spin: 1.5 full turns across the whole facts section
  let target = 0;
  let current = 0;
  window.__sphereProgress = (p) => {
    target = p * Math.PI * 3;
    if (reduceMotion) {
      current = target;
      sphere.rotation.y = current;
      render();
    }
  };

  if (reduceMotion) {
    render();
    return;
  }

  // gentle lean toward the cursor (desktop only; phones have no hover)
  let mouseX = 0;
  let mouseY = 0;
  if (!phone) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  let onScreen = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      onScreen = entries[0].isIntersecting;
    }).observe(box);
  }

  let idle = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (!onScreen) return;

    idle += 0.0025;
    current += (target - current) * 0.08;
    sphere.rotation.y = idle + current;
    sphere.rotation.x = 0.35 + Math.sin(idle * 0.6) * 0.08;

    group.rotation.y += (mouseX * 0.35 - group.rotation.y) * 0.04;
    group.rotation.x += (mouseY * -0.25 - group.rotation.x) * 0.04;

    render();
  }
  requestAnimationFrame(frame);
})();
