import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const materials = {
  ivory: new THREE.MeshPhysicalMaterial({ color: 0xf0e8d8, metalness: 0.8, roughness: 0.23 }),
  silver: new THREE.MeshPhysicalMaterial({ color: 0xc9d0dc, metalness: 0.9, roughness: 0.16 }),
  dark: new THREE.MeshPhysicalMaterial({ color: 0x101321, metalness: 0.8, roughness: 0.2 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x78b8ff, metalness: 0.25, roughness: 0.04, transmission: 0.18, emissive: 0x154fbe, emissiveIntensity: 0.45 }),
  gold: new THREE.MeshPhysicalMaterial({ color: 0xe4b34c, metalness: 0.8, roughness: 0.18 }),
  copper: new THREE.MeshPhysicalMaterial({ color: 0xa8664a, metalness: 0.76, roughness: 0.26 }),
  violet: new THREE.MeshPhysicalMaterial({ color: 0x8277e8, metalness: 0.48, roughness: 0.16, emissive: 0x29205f, emissiveIntensity: 0.23 })
};

const makeRenderer = (container) => {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.append(renderer.domElement);
  return renderer;
};

const lightScene = (scene, strength = 1) => {
  scene.add(new THREE.HemisphereLight(0xbac8ff, 0x443127, 2.4 * strength));
  const key = new THREE.DirectionalLight(0xffe0a6, 3.7 * strength);
  key.position.set(-5, 8, 8);
  scene.add(key);
  const rim = new THREE.PointLight(0x8078ff, 14 * strength, 20, 2);
  rim.position.set(5, 2, -2);
  scene.add(rim);
  const fill = new THREE.PointLight(0x7ac9ff, 9 * strength, 18, 2);
  fill.position.set(-6, -1, 6);
  scene.add(fill);
};

const roundedBox = (width, height, depth, material, radius = 0.12) => {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3 });
  geometry.center();
  return new THREE.Mesh(geometry, material);
};

const buildPhone = () => {
  const group = new THREE.Group();
  const frame = roundedBox(1.15, 2.26, 0.12, materials.silver, 0.18);
  const screen = roundedBox(0.98, 2.04, 0.035, materials.glass, 0.14);
  screen.position.z = 0.085;
  const island = roundedBox(0.38, 0.1, 0.025, materials.dark, 0.06);
  island.position.set(0, 0.86, 0.115);
  group.add(frame, screen, island);
  group.rotation.set(-0.25, 0.45, 0.18);
  return group;
};

const buildCamera = () => {
  const group = new THREE.Group();
  const body = roundedBox(2.2, 1.45, 0.76, materials.ivory, 0.2);
  const grip = roundedBox(0.44, 1.08, 0.88, materials.dark, 0.15);
  grip.position.set(0.87, -0.1, 0.05);
  const lensRing = new THREE.Mesh(new THREE.CylinderGeometry(0.59, 0.59, 0.37, 42), materials.gold);
  lensRing.rotation.x = Math.PI / 2;
  lensRing.position.z = 0.56;
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.405, 42), materials.glass);
  lens.rotation.x = Math.PI / 2;
  lens.position.z = 0.69;
  const prism = roundedBox(0.66, 0.45, 0.54, materials.dark, 0.12);
  prism.position.set(-0.22, 0.88, 0.02);
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 18), materials.copper);
  dial.rotation.x = Math.PI / 2;
  dial.position.set(0.7, 0.8, 0.1);
  group.add(body, grip, lensRing, lens, prism, dial);
  group.rotation.set(0.35, -0.45, -0.15);
  return group;
};

const buildHeadphones = () => {
  const group = new THREE.Group();
  const arch = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.12, 18, 48, Math.PI), materials.ivory);
  arch.rotation.z = Math.PI;
  arch.position.y = 0.17;
  const makeCup = (x) => {
    const cup = new THREE.Group();
    const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.25, 32), materials.gold);
    outer.rotation.z = Math.PI / 2;
    const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.1, 14, 28), materials.dark);
    cushion.rotation.y = Math.PI / 2;
    cushion.position.x = x < 0 ? -0.14 : 0.14;
    cup.add(outer, cushion);
    cup.position.set(x, -0.57, 0);
    return cup;
  };
  group.add(arch, makeCup(-0.86), makeCup(0.86));
  group.rotation.set(0.18, 0.4, -0.26);
  return group;
};

const setupHeroGadgets = () => {
  const container = document.querySelector("#heroGadgets");
  if (!container) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 9.2);
  const renderer = makeRenderer(container);
  lightScene(scene, 1.05);
  const phone = buildPhone();
  phone.position.set(-2.4, 1.6, 0.1);
  const cameraBody = buildCamera();
  cameraBody.position.set(2.4, 1.15, 0);
  const headphones = buildHeadphones();
  headphones.position.set(2.12, -2.05, 0.2);
  scene.add(phone, cameraBody, headphones);
  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const pointer = { x: 0, y: 0 };
  document.querySelector(".hero").addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / window.innerWidth - 0.5;
    pointer.y = event.clientY / window.innerHeight - 0.5;
  });
  const animate = (time) => {
    const wave = time * 0.001;
    phone.position.y = 1.6 + Math.sin(wave * 1.1) * 0.16;
    cameraBody.position.y = 1.15 + Math.cos(wave * 0.9) * 0.13;
    headphones.position.y = -2.05 + Math.sin(wave * 1.2) * 0.18;
    phone.rotation.y = 0.45 + wave * 0.16 + pointer.x * 0.25;
    cameraBody.rotation.y = -0.45 - wave * 0.18 + pointer.x * 0.25;
    headphones.rotation.y = 0.4 + wave * 0.19 + pointer.x * 0.18;
    scene.rotation.x = pointer.y * 0.1;
    renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(animate);
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();
  animate(0);
};

const buildCar = () => {
  const group = new THREE.Group();
  const body = roundedBox(2.7, 0.55, 1.28, materials.copper, 0.25);
  body.position.y = -0.32;
  const cabin = roundedBox(1.52, 0.54, 1.12, materials.dark, 0.22);
  cabin.position.set(-0.18, 0.18, 0);
  const roofGlass = roundedBox(1.17, 0.39, 1.15, materials.glass, 0.18);
  roofGlass.position.set(-0.18, 0.24, 0);
  group.add(body, cabin, roofGlass);
  [-0.93, 0.93].forEach((x) => {
    [-0.61, 0.61].forEach((z) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.18, 22), materials.dark);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, -0.49, z);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.19, 18), materials.gold);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(x, -0.49, z + (z < 0 ? -0.01 : 0.01));
      group.add(wheel, hub);
    });
  });
  const light = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.11, 0.02), materials.gold);
  light.position.set(1.37, -0.11, 0.43);
  group.add(light, light.clone().translateZ(-0.86));
  group.rotation.set(-0.12, -0.42, 0.04);
  return group;
};

const buildDrone = () => {
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 18), materials.ivory);
  core.scale.set(1.45, 0.5, 0.9);
  group.add(core);
  [[-0.9, -0.62], [-0.9, 0.62], [0.9, -0.62], [0.9, 0.62]].forEach(([x, z]) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.09, 0.1), materials.silver);
    arm.position.set(x * 0.48, 0, z * 0.48);
    arm.rotation.y = Math.atan2(z, x);
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.15, 20), materials.gold);
    motor.position.set(x, 0.03, z);
    const prop = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.025, 0.1), materials.violet);
    prop.position.set(x, 0.14, z);
    prop.rotation.y = Math.random() * Math.PI;
    group.add(arm, motor, prop);
  });
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 12), materials.glass);
  eye.position.set(0.45, -0.1, 0);
  group.add(eye);
  group.rotation.set(0.15, -0.4, -0.12);
  return group;
};

const setupReviewScene = (id, makeObject, isDrone = false) => {
  const container = document.querySelector(id);
  if (!container) return;
  const card = container.closest(".review-card");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
  camera.position.set(0, 0, 8.1);
  const renderer = makeRenderer(container);
  lightScene(scene, 1.1);
  const object = makeObject();
  object.position.set(isDrone ? 1.3 : 2.1, isDrone ? -0.2 : -0.7, 0);
  scene.add(object);
  const halo = new THREE.Mesh(new THREE.CircleGeometry(2.7, 48), new THREE.MeshBasicMaterial({ color: isDrone ? 0x8175e8 : 0xcf9353, transparent: true, opacity: 0.16 }));
  halo.position.set(1.1, 0.3, -1.5);
  scene.add(halo);
  let hovering = false;
  card.addEventListener("pointerenter", () => { hovering = true; });
  card.addEventListener("pointerleave", () => { hovering = false; });
  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const animate = (time) => {
    const wave = time * 0.001;
    const targetX = hovering ? (isDrone ? 0.32 : -0.42) : (isDrone ? 1.3 : 2.1);
    object.position.x += (targetX - object.position.x) * 0.045;
    object.position.y = (isDrone ? -0.2 : -0.7) + Math.sin(wave * (isDrone ? 3 : 1.3)) * (isDrone ? 0.25 : 0.08);
    object.rotation.y += hovering ? 0.012 : 0.003;
    object.rotation.z = isDrone ? Math.sin(wave * 2.8) * 0.14 : 0.04;
    halo.rotation.z = wave * 0.08;
    renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(animate);
  };
  const fallbackImage = container.querySelector(":scope > img");
  if (fallbackImage) fallbackImage.addEventListener("load", () => card.classList.add("three-ready"), { once: true });
  card.classList.add("three-ready");
  window.addEventListener("resize", resize, { passive: true });
  resize();
  animate(0);
};

try {
  setupHeroGadgets();
  setupReviewScene("#carScene", buildCar);
  setupReviewScene("#droneScene", buildDrone, true);
} catch (error) {
  console.warn("3D visuals unavailable; image fallbacks remain visible.", error);
}
