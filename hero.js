/* three.js is loaded as a plain script (three.min.js) so this works over
   file:// and with no network — ES modules are blocked on file:// URLs. */

const canvas = document.getElementById('hero-canvas');
const heroSection = document.querySelector('.hero');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const accent = getComputedStyle(document.documentElement)
  .getPropertyValue('--accent')
  .trim() || '#c9962c';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.z = 4.4;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

function resize() {
  const w = heroSection.clientWidth;
  const h = heroSection.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

const lineColor = new THREE.Color(accent);

// One wireframe per click state: sphere -> cube -> 3D triangle (tetrahedron).
function wireframe(geometry, opacity) {
  const mesh = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({ color: lineColor.clone(), transparent: true, opacity })
  );
  mesh.userData.baseOpacity = opacity;
  return mesh;
}

const shapes = [
  wireframe(new THREE.SphereGeometry(1.2, 20, 14), 0.85),
  wireframe(new THREE.BoxGeometry(1.6, 1.6, 1.6), 0.85),
  wireframe(new THREE.TetrahedronGeometry(1.55), 0.9),
];

// group = parallax + drag tilt.  inner = the shared spin every shape rides on,
// so a morph never snaps the rotation back to zero.
const group = new THREE.Group();
const inner = new THREE.Group();

shapes.forEach((shape, i) => {
  shape.visible = i === 0;
  shape.material.opacity = i === 0 ? shape.userData.baseOpacity : 0;
  inner.add(shape);
});
group.add(inner);

/* A loose shell of points around the shape. It counter-rotates against the
   wireframe and brightens the harder you spin, so flicking the shape reads as
   putting energy into something rather than nudging a picture. */
const HALO_COUNT = 420;
const haloPos = new Float32Array(HALO_COUNT * 3);

for (let i = 0; i < HALO_COUNT; i += 1) {
  // even-ish spread over a shell, then jittered outward a touch
  const u = Math.random() * 2 - 1;
  const theta = Math.random() * Math.PI * 2;
  const r = 1.75 + Math.random() * 0.55;
  const s = Math.sqrt(1 - u * u);
  haloPos[i * 3] = Math.cos(theta) * s * r;
  haloPos[i * 3 + 1] = u * r;
  haloPos[i * 3 + 2] = Math.sin(theta) * s * r;
}

const haloGeo = new THREE.BufferGeometry();
haloGeo.setAttribute('position', new THREE.BufferAttribute(haloPos, 3));

const haloMat = new THREE.PointsMaterial({
  color: lineColor.clone(),
  size: 0.028,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.22,
  depthWrite: false,
});

const halo = new THREE.Points(haloGeo, haloMat);
group.add(halo);

// sits just below centre, under the CLICK cue
group.position.y = -0.15;
scene.add(group);

let current = 0;
let morphFrom = 0;
let morphStart = -1;
const MORPH_MS = 620;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// called by the click cycle
window.__setHeroShape = (i, instant) => {
  const next = ((i % shapes.length) + shapes.length) % shapes.length;
  if (next === current) return;

  // the first paint restores a saved palette, so it lands with no morph
  if (reduceMotion || instant) {
    shapes.forEach((shape, n) => {
      shape.visible = n === next;
      shape.material.opacity = n === next ? shape.userData.baseOpacity : 0;
      shape.scale.setScalar(1);
    });
    current = next;
    renderer.render(scene, camera);
    return;
  }

  morphFrom = current;
  current = next;
  morphStart = performance.now();
  shapes[morphFrom].visible = true;
  shapes[current].visible = true;
};

// a click also kicks the shape, so the palette swap has some physics to it
window.__kickHero = () => {
  if (reduceMotion) return;
  spinVel.y += 0.055;
  spinVel.x += 0.012;
};

// let the click-cycle recolor the wireframe when the palette changes
window.__setHeroAccent = (hex) => {
  lineColor.set(hex);
  shapes.forEach((shape) => shape.material.color.set(hex));
  haloMat.color.set(hex);
  if (reduceMotion) renderer.render(scene, camera);
};

/* ---------- pointer: parallax, drag-to-spin, inertia ---------- */

const AUTO_Y = 0.0028;
const AUTO_X = 0.0011;

const spinVel = { x: AUTO_X, y: AUTO_Y };
let mouseX = 0;
let mouseY = 0;

let dragging = false;
let lastX = 0;
let lastY = 0;
let dragDist = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / window.innerWidth - 0.5;
  mouseY = e.clientY / window.innerHeight - 0.5;
});

if (heroSection && !reduceMotion) {
  heroSection.addEventListener('pointerdown', (e) => {
    // touch keeps tap-to-cycle and page scrolling; drag is mouse/pen only
    if (e.pointerType === 'touch') return;
    dragging = true;
    dragDist = 0;
    lastX = e.clientX;
    lastY = e.clientY;
    heroSection.classList.add('is-dragging');
    heroSection.setPointerCapture(e.pointerId);
  });

  heroSection.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    dragDist += Math.abs(dx) + Math.abs(dy);

    // drive velocity directly while held, so the shape tracks the hand
    spinVel.y = dx * 0.012;
    spinVel.x = dy * 0.009;
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    heroSection.classList.remove('is-dragging');
    if (e && heroSection.hasPointerCapture(e.pointerId)) {
      heroSection.releasePointerCapture(e.pointerId);
    }
    // a real drag shouldn't also fire the palette click
    window.__heroWasDragged = dragDist > 8;
    setTimeout(() => { window.__heroWasDragged = false; }, 0);
  };

  // capture means pointerup always comes back to us, so there is no need to
  // watch pointerleave — and watching it would cut a drag short mid-flick
  heroSection.addEventListener('pointerup', endDrag);
  heroSection.addEventListener('pointercancel', endDrag);
}

/* ---------- frame ---------- */

function animate(now) {
  requestAnimationFrame(animate);

  // inertia: let the flick carry, then ease back into the idle drift
  if (!dragging) {
    spinVel.y += (AUTO_Y - spinVel.y) * 0.026;
    spinVel.x += (AUTO_X - spinVel.x) * 0.026;
  }

  inner.rotation.y += spinVel.y;
  inner.rotation.x += spinVel.x;

  // morph: old shape fades and swells out, new one fades and settles in
  if (morphStart >= 0) {
    const p = Math.min(1, (now - morphStart) / MORPH_MS);
    const e = easeOutCubic(p);
    const from = shapes[morphFrom];
    const to = shapes[current];

    from.material.opacity = from.userData.baseOpacity * (1 - e);
    from.scale.setScalar(1 + e * 0.22);
    to.material.opacity = to.userData.baseOpacity * e;
    to.scale.setScalar(0.82 + e * 0.18);

    if (p >= 1) {
      from.visible = false;
      from.scale.setScalar(1);
      morphStart = -1;
    }
  }

  // spin energy drives the halo and gives the wireframe a faint charge
  const energy = Math.min(1, Math.abs(spinVel.y - AUTO_Y) / 0.05);
  haloMat.opacity = 0.17 + energy * 0.45;
  haloMat.size = 0.026 + energy * 0.014;
  halo.rotation.y -= 0.0016 + energy * 0.004;
  halo.rotation.z += 0.0006;

  const breathe = 1 + Math.sin(now * 0.0007) * 0.015;
  halo.scale.setScalar(breathe);

  // gentle parallax toward the cursor, softer while the shape is being held
  const reach = dragging ? 0.12 : 1;
  group.rotation.y += (mouseX * 0.4 * reach - group.rotation.y) * 0.03;
  group.rotation.x += (mouseY * -0.3 * reach - group.rotation.x) * 0.03;

  renderer.render(scene, camera);
}

if (reduceMotion) {
  renderer.render(scene, camera);
} else {
  requestAnimationFrame(animate);
}
