// ============================================
// TECH2U — BassMarker Pro 3D Coin (Three.js)
// ============================================
//
// Renders the BassMarker logo as a spinning, metallic-edged coin.
// Falls back to the static <img> (already in the DOM) if WebGL,
// Three.js, or reduced-motion preference make 3D inappropriate.

import * as THREE from 'three';

(function () {
  'use strict';

  var wrap = document.getElementById('bmCoinWrap');
  var canvas = document.getElementById('bmCoinCanvas');
  var fallbackImg = document.querySelector('.bm-coin-fallback');

  if (!wrap || !canvas || !fallbackImg) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function supportsWebGL() {
    try {
      var testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  function showFallback() {
    canvas.style.display = 'none';
    fallbackImg.style.display = 'block';
  }

  if (prefersReducedMotion || !supportsWebGL()) {
    showFallback();
    return;
  }

  var renderer, scene, camera, coin, coinTilt, frameId;
  var targetRotX = 0, targetRotY = 0, currentRotX = 0, currentRotY = 0;
  var baseSpin = 0;
  var hovering = false;

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Lighting: soft ambient + key light + cyan rim light for that Tech2u accent
    var ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    var keyLight = new THREE.DirectionalLight(0xfff3dd, 1.1);
    keyLight.position.set(3, 4, 6);
    scene.add(keyLight);

    var rimLight = new THREE.PointLight(0x5bc4e8, 1.4, 20);
    rimLight.position.set(-4, -2, 3);
    scene.add(rimLight);

    var goldLight = new THREE.PointLight(0xe3c896, 0.8, 20);
    goldLight.position.set(4, 3, -3);
    scene.add(goldLight);

    buildCoin();
    resize();
    animate();
  }

  function buildCoin() {
    var loader = new THREE.TextureLoader();
    var faceTexture = loader.load('images/bassmarker.png');
    faceTexture.colorSpace = THREE.SRGBColorSpace;
    faceTexture.anisotropy = 4;

    var radius = 2.6;
    var thickness = 0.34;
    var bevel = 0.06;

    var geometry = new THREE.CylinderGeometry(radius, radius, thickness, 64, 1, false);

    var edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xc9a876,
      metalness: 0.85,
      roughness: 0.28,
      envMapIntensity: 1.1
    });

    var faceMaterial = new THREE.MeshStandardMaterial({
      map: faceTexture,
      metalness: 0.15,
      roughness: 0.45
    });

    // CylinderGeometry material order: [side, topCap, bottomCap]
    var materials = [edgeMaterial, faceMaterial, faceMaterial];

    coin = new THREE.Mesh(geometry, materials);
    scene.add(coin);

    // Thin bezel ring for a premium, machined-edge look
    var bezelGeo = new THREE.TorusGeometry(radius - bevel * 0.5, bevel, 16, 64);
    var bezelMat = new THREE.MeshStandardMaterial({
      color: 0xe3c896,
      metalness: 0.9,
      roughness: 0.2
    });

    var bezelFront = new THREE.Mesh(bezelGeo, bezelMat);
    bezelFront.position.y = thickness / 2;
    bezelFront.rotation.x = Math.PI / 2;
    coin.add(bezelFront);

    var bezelBack = new THREE.Mesh(bezelGeo, bezelMat);
    bezelBack.position.y = -thickness / 2;
    bezelBack.rotation.x = Math.PI / 2;
    coin.add(bezelBack);

    // Tilt group faces the coin toward the camera (flat sides on +Z/-Z),
    // while `coin` itself keeps spinning around its own native Y axis —
    // this avoids Euler-order fighting between the two rotations.
    coinTilt = new THREE.Group();
    coinTilt.rotation.x = Math.PI / 2;
    coinTilt.add(coin);
    scene.add(coinTilt);
  }

  function resize() {
    var size = wrap.clientWidth;
    if (!size) return;
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  function onPointerMove(clientX, clientY) {
    var rect = wrap.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var relX = (clientX - cx) / (rect.width / 2);
    var relY = (clientY - cy) / (rect.height / 2);
    targetRotY = Math.max(-1, Math.min(1, relX)) * 0.5;
    targetRotX = Math.max(-1, Math.min(1, relY)) * 0.35;
  }

  wrap.addEventListener('mouseenter', function () { hovering = true; });
  wrap.addEventListener('mouseleave', function () {
    hovering = false;
    targetRotX = 0;
    targetRotY = 0;
  });
  wrap.addEventListener('mousemove', function (e) {
    onPointerMove(e.clientX, e.clientY);
  });

  var resizeObserver = ('ResizeObserver' in window)
    ? new ResizeObserver(resize)
    : null;
  if (resizeObserver) resizeObserver.observe(wrap);
  window.addEventListener('resize', resize);

  function animate() {
    frameId = requestAnimationFrame(animate);

    baseSpin += 0.006;
    currentRotX += (targetRotX - currentRotX) * 0.08;
    currentRotY += (targetRotY - currentRotY) * 0.08;

    if (coin && coinTilt) {
      coin.rotation.y = baseSpin;
      coinTilt.rotation.z = currentRotX * 0.6;
      coinTilt.rotation.x = Math.PI / 2 + currentRotY * 0.4;
    }

    renderer.render(scene, camera);
  }

  // Pause rendering when the coin scrolls out of view (saves battery/CPU)
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!frameId) animate();
        } else if (frameId) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
      });
    }, { threshold: 0.05 });
    io.observe(wrap);
  }

  try {
    init();
    canvas.style.display = 'block';
    fallbackImg.style.display = 'none';
  } catch (err) {
    showFallback();
  }
})();
