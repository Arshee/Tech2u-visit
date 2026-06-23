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

  mountScene('carScene', 'car');
  mountScene('droneScene', 'drone');
}
