/* three.js is loaded as a plain script (three.min.js) so this works over
   file:// and with no network — ES modules are blocked on file:// URLs. */

const canvas = document.getElementById('hero-canvas');
const heroSection = document.querySelector('.hero');

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
  return new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({ color: lineColor.clone(), transparent: true, opacity })
  );
}

const shapes = [
  wireframe(new THREE.SphereGeometry(1.2, 20, 14), 0.85),
  wireframe(new THREE.BoxGeometry(1.6, 1.6, 1.6), 0.85),
  wireframe(new THREE.TetrahedronGeometry(1.55), 0.9),
];

const group = new THREE.Group();
shapes.forEach((shape, i) => {
  shape.visible = i === 0;
  group.add(shape);
});

// sits just below centre, under the CLICK cue
group.position.y = -0.15;
scene.add(group);

let current = 0;

// called by the click cycle
window.__setHeroShape = (i) => {
  current = ((i % shapes.length) + shapes.length) % shapes.length;
  shapes.forEach((shape, n) => {
    shape.visible = n === current;
  });
  if (reduceMotion) renderer.render(scene, camera);
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// let the click-cycle recolor the wireframe when the palette changes
window.__setHeroAccent = (hex) => {
  lineColor.set(hex);
  shapes.forEach((shape) => shape.material.color.set(hex));
  if (reduceMotion) renderer.render(scene, camera);
};

let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / window.innerWidth - 0.5;
  mouseY = e.clientY / window.innerHeight - 0.5;
});

function animate() {
  requestAnimationFrame(animate);

  const shape = shapes[current];
  shape.rotation.y += 0.0028;
  shape.rotation.x += 0.0011;

  // gentle parallax toward the cursor
  group.rotation.y += (mouseX * 0.4 - group.rotation.y) * 0.03;
  group.rotation.x += (mouseY * -0.3 - group.rotation.x) * 0.03;

  renderer.render(scene, camera);
}

if (reduceMotion) {
  renderer.render(scene, camera);
} else {
  animate();
}
