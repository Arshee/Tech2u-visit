const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js').catch(() => null);

if (THREE && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const smallScreen = window.matchMedia('(max-width: 640px)').matches;

  function addLighting(scene) {
    scene.add(new THREE.HemisphereLight(0x8791ff, 0x1b1110, 2.3));

    const key = new THREE.DirectionalLight(0xf1cf93, 4.6);
    key.position.set(4, 6, 5);
    scene.add(key);

    const rim = new THREE.PointLight(0x756deb, 24, 12);
    rim.position.set(-4, 3, -2);
    scene.add(rim);
  }

  function metal(color, roughness = 0.28) {
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.83,
      roughness,
      clearcoat: 0.48,
      clearcoatRoughness: 0.18
    });
  }

  function wheel() {
    const wheelGroup = new THREE.Group();
    const tire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.41, 0.41, 0.24, 28),
      new THREE.MeshStandardMaterial({ color: 0x06070b, roughness: 0.76, metalness: 0.16 })
    );
    tire.rotation.x = Math.PI / 2;
    wheelGroup.add(tire);

    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.255, 20),
      metal(0xb88e5e, 0.19)
    );
    rim.rotation.x = Math.PI / 2;
    wheelGroup.add(rim);
    return wheelGroup;
  }

  function createCar() {
    const group = new THREE.Group();
    const paint = metal(0x12182d, 0.22);
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x191b36,
      metalness: 0.35,
      roughness: 0.08,
      transparent: true,
      opacity: 0.82
    });

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.52, 1.56), paint);
    chassis.position.y = -0.42;
    chassis.castShadow = true;
    group.add(chassis);

    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.26, 1.48), paint);
    hood.position.set(-1.13, -0.02, 0);
    hood.rotation.z = -0.08;
    group.add(hood);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.66, 1.34), glass);
    cabin.position.set(0.38, 0.24, 0);
    cabin.rotation.z = -0.05;
    group.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.12, 1.28), paint);
    roof.position.set(0.38, 0.62, 0);
    group.add(roof);

    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xf6d69b });
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.1), lightMaterial);
    light.position.set(-1.94, -0.31, 0);
    group.add(light);

    const wheels = [
      [-1.23, -0.65, -0.83],
      [1.2, -0.65, -0.83],
      [-1.23, -0.65, 0.83],
      [1.2, -0.65, 0.83]
    ];
    wheels.forEach((position) => {
      const item = wheel();
      item.position.set(position[0], position[1], position[2]);
      group.add(item);
    });

    const goldRail = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.045, 0.045), metal(0xd3a759, 0.2));
    goldRail.position.set(0.12, -0.36, -0.8);
    group.add(goldRail);

    group.rotation.set(-0.09, -0.62, 0.03);
    return group;
  }

  function createDrone() {
    const group = new THREE.Group();
    const bodyMaterial = metal(0x272638, 0.22);
    const accent = metal(0xb08a62, 0.2);
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.66, 28, 20), bodyMaterial);
    body.scale.set(1.45, 0.55, 0.95);
    group.add(body);

    const camera = new THREE.Mesh(new THREE.SphereGeometry(0.23, 20, 16), new THREE.MeshStandardMaterial({ color: 0x05060c, roughness: 0.18, metalness: 0.75 }));
    camera.position.set(-0.38, -0.28, -0.04);
    group.add(camera);

    const propellers = [];
    [[-.9, -.62], [.9, -.62], [-.9, .62], [.9, .62]].forEach((point) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.07, 0.09), bodyMaterial);
      arm.position.set(0, 0, point[1]);
      arm.rotation.y = point[0] > 0 ? -0.52 : 0.52;
      arm.position.x = point[0] * .52;
      group.add(arm);

      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.15, 16), accent);
      motor.rotation.x = Math.PI / 2;
      motor.position.set(point[0], 0.03, point[1]);
      group.add(motor);

      const blade = new THREE.Group();
      const bladeA = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.018, 0.09), new THREE.MeshStandardMaterial({ color: 0x77718a, transparent: true, opacity: 0.62 }));
      const bladeB = bladeA.clone();
      bladeB.rotation.y = Math.PI / 2;
      blade.add(bladeA, bladeB);
      blade.position.set(point[0], 0.13, point[1]);
      group.add(blade);
      propellers.push(blade);
    });

    group.rotation.set(0.18, -0.5, -0.05);
    return { group, propellers };
  }

  function mountScene(id, type) {
    const container = document.getElementById(id);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100);
    camera.position.set(0, 1.55, 7.7);
    camera.lookAt(0, -0.1, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    addLighting(scene);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 12),
      new THREE.MeshStandardMaterial({ color: 0x101325, metalness: 0.52, roughness: 0.44, transparent: true, opacity: 0.76 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.08;
    scene.add(floor);

    let object;
    let propellers = [];
    let targetX;
    let targetY = -0.33;

    if (type === 'car') {
      object = createCar();
      object.position.set(smallScreen ? 0.6 : 2.6, -0.26, 0);
      targetX = smallScreen ? 0.5 : 2.4;
    } else {
      const drone = createDrone();
      object = drone.group;
      propellers = drone.propellers;
      object.position.set(smallScreen ? .4 : 2.25, -0.05, 0);
      targetX = smallScreen ? .35 : 2.1;
      targetY = 0;
    }
    scene.add(object);

    const mediaScene = container.closest('.media-scene');
    mediaScene.classList.add('three-ready');
    container.addEventListener('pointerenter', () => { targetX = type === 'car' ? -0.1 : -0.15; });
    container.addEventListener('pointerleave', () => { targetX = smallScreen ? (type === 'car' ? .5 : .35) : (type === 'car' ? 2.4 : 2.1); });

    function resize() {
      const bounds = container.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      camera.aspect = bounds.width / bounds.height;
      camera.updateProjectionMatrix();
      renderer.setSize(bounds.width, bounds.height, false);
    }
    new ResizeObserver(resize).observe(container);
    resize();

    function render(time) {
      object.position.x += (targetX - object.position.x) * 0.047;
      object.position.y += (targetY + Math.sin(time * .0014) * (type === 'drone' ? .12 : .025) - object.position.y) * 0.045;
      object.rotation.y += ((type === 'car' ? -0.62 : -0.5) - object.rotation.y) * 0.03;
      propellers.forEach((item) => { item.rotation.y += 0.52; });
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  function brightMetal(color, roughness = 0.22) {
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.55,
      roughness,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.4
    });
  }

  function glow(color, intensity = 1.4) {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: intensity,
      roughness: 0.35,
      metalness: 0.1
    });
  }

  function createPhone() {
    const group = new THREE.Group();
    const titanium = brightMetal(0x8b8d93, 0.3);
    const screenGlass = new THREE.MeshPhysicalMaterial({
      color: 0x0d0e14,
      metalness: 0.2,
      roughness: 0.06,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.28, 0.09), titanium);
    group.add(body);

    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.54, 1.18, 0.015), screenGlass);
    screen.position.z = 0.05;
    group.add(screen);

    const screenGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.46, 1.0),
      glow(0x5bc4e8, 0.55)
    );
    screenGlow.position.z = 0.059;
    group.add(screenGlow);

    const islandMaterial = new THREE.MeshStandardMaterial({ color: 0x05060a, roughness: 0.3, metalness: 0.6 });
    const island = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.12, 4, 8), islandMaterial);
    island.rotation.z = Math.PI / 2;
    island.position.set(-0.13, 0.46, 0.06);
    group.add(island);

    const lensGlass = new THREE.MeshPhysicalMaterial({ color: 0x1a2a33, metalness: 0.7, roughness: 0.08, clearcoat: 1 });
    [[-0.16, 0.62], [-0.16, 0.46], [-0.16, 0.30]].forEach((pos) => {
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.025, 20), lensGlass);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(pos[0], pos[1], -0.05);
      group.add(lens);
    });

    return group;
  }

  function createCamera() {
    const group = new THREE.Group();
    const body = brightMetal(0x3a3a40, 0.32);
    const grip = brightMetal(0x232326, 0.4);
    const accent = brightMetal(0xc9a876, 0.22);

    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.56, 0.4), body);
    group.add(mainBody);

    const gripBlock = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.56, 0.4), grip);
    gripBlock.position.set(0.38, -0.02, 0);
    group.add(gripBlock);

    const viewfinder = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.16, 0.22), body);
    viewfinder.position.set(-0.1, 0.34, -0.04);
    group.add(viewfinder);

    const lensBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.5, 28), grip);
    lensBarrel.rotation.x = Math.PI / 2;
    lensBarrel.position.set(-0.2, 0, 0.42);
    group.add(lensBarrel);

    const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.225, 0.025, 10, 28), accent);
    lensRing.rotation.x = Math.PI / 2;
    lensRing.position.set(-0.2, 0, 0.2);
    group.add(lensRing);

    const lensGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x10151c, metalness: 0.8, roughness: 0.04, clearcoat: 1 });
    const lensGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.02, 28), lensGlassMat);
    lensGlass.rotation.x = Math.PI / 2;
    lensGlass.position.set(-0.2, 0, 0.67);
    group.add(lensGlass);

    const shutterDial = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 16), accent);
    shutterDial.position.set(0.3, 0.32, 0.05);
    group.add(shutterDial);

    const hotShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.12), grip);
    hotShoe.position.set(0, 0.31, 0);
    group.add(hotShoe);

    return group;
  }

  function createHeadphones() {
    const group = new THREE.Group();
    const shellMaterial = brightMetal(0xe6e7ea, 0.35);
    const cushionMaterial = new THREE.MeshStandardMaterial({ color: 0x1b1c22, roughness: 0.78, metalness: 0.08 });
    const accent = glow(0xd3a759, 0.5);

    const band = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 12, 32, Math.PI), shellMaterial);
    band.rotation.z = Math.PI;
    group.add(band);

    function earCup(sign) {
      const cup = new THREE.Group();
      const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.13, 24), shellMaterial);
      shell.rotation.z = Math.PI / 2;
      cup.add(shell);

      const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.06, 10, 20), cushionMaterial);
      cushion.rotation.y = Math.PI / 2;
      cushion.position.x = sign * 0.07;
      cup.add(cushion);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.012, 8, 24), accent);
      ring.rotation.y = Math.PI / 2;
      ring.position.x = sign * 0.066;
      cup.add(ring);

      return cup;
    }

    const cupLeft = earCup(-1);
    cupLeft.position.set(-0.5, -0.16, 0);
    group.add(cupLeft);

    const cupRight = earCup(1);
    cupRight.position.set(0.5, -0.16, 0);
    group.add(cupRight);

    return group;
  }

  function createGadgetSet() {
    const group = new THREE.Group();

    const phone = createPhone();
    phone.position.set(-1.34, 0.6, 0);
    phone.rotation.set(0.22, -0.42, -0.18);
    group.add(phone);

    const headphones = createHeadphones();
    headphones.position.set(1.4, 0.72, -0.1);
    headphones.rotation.set(0.1, 0.4, 0.16);
    group.add(headphones);

    const camera = createCamera();
    camera.position.set(1.5, -0.78, 0);
    camera.rotation.set(-0.16, -0.5, 0.16);
    group.add(camera);

    return { group, phone, headphones, camera };
  }

  function mountHeroGadgets() {
    const container = document.getElementById('heroGadgets');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 5.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    addLighting(scene);

    const fillLight = new THREE.DirectionalLight(0xffffff, 2.4);
    fillLight.position.set(-3, -2, 6);
    scene.add(fillLight);

    const topGlow = new THREE.PointLight(0xffffff, 8, 14);
    topGlow.position.set(0, 3, 3);
    scene.add(topGlow);

    const gadgets = createGadgetSet();
    scene.add(gadgets.group);

    function resize() {
      const bounds = container.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      camera.aspect = bounds.width / bounds.height;
      camera.updateProjectionMatrix();
      renderer.setSize(bounds.width, bounds.height, false);
    }
    new ResizeObserver(resize).observe(container);
    resize();

    function render(time) {
      gadgets.phone.position.y = 0.64 + Math.sin(time * .0012) * .09;
      gadgets.phone.rotation.z = -0.2 + Math.sin(time * .0009) * .08;
      gadgets.headphones.position.y = 0.76 + Math.sin(time * .0011 + 1.4) * .11;
      gadgets.headphones.rotation.z = 0.18 + Math.sin(time * .0008) * .1;
      gadgets.camera.position.y = -0.76 + Math.sin(time * .0014 + 2) * .08;
      gadgets.camera.rotation.y = -0.34 + Math.sin(time * .00075) * .1;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  mountScene('carScene', 'car');
  mountScene('droneScene', 'drone');
  mountHeroGadgets();
}
