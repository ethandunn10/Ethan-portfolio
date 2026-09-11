import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

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

// Wireframe sphere
const sphereGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(1.2, 20, 14));
const sphere = new THREE.LineSegments(
  sphereGeo,
  new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.85 })
);

// Wireframe cube, nested inside the sphere
const cubeGeo = new THREE.WireframeGeometry(new THREE.BoxGeometry(1.35, 1.35, 1.35));
const cube = new THREE.LineSegments(
  cubeGeo,
  new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.5 })
);

const group = new THREE.Group();
group.add(sphere, cube);
scene.add(group);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / window.innerWidth - 0.5;
  mouseY = e.clientY / window.innerHeight - 0.5;
});

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.y += 0.0028;
  sphere.rotation.x += 0.0011;
  cube.rotation.y -= 0.0019;
  cube.rotation.x += 0.0015;

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
