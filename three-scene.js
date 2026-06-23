import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mat = {
  ivory: new THREE.MeshPhysicalMaterial({ color: 0xf0e8d8, metalness: .8, roughness: .23 }),
  silver: new THREE.MeshPhysicalMaterial({ color: 0xc9d0dc, metalness: .9, roughness: .16 }),
  dark: new THREE.MeshPhysicalMaterial({ color: 0x101321, metalness: .8, roughness: .2 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x78b8ff, metalness: .25, roughness: .05, emissive: 0x154fbe, emissiveIntensity: .42 }),
  gold: new THREE.MeshPhysicalMaterial({ color: 0xe4b34c, metalness: .8, roughness: .18 }),
  copper: new THREE.MeshPhysicalMaterial({ color: 0xa8664a, metalness: .76, roughness: .26 }),
  violet: new THREE.MeshPhysicalMaterial({ color: 0x8277e8, metalness: .48, roughness: .16, emissive: 0x29205f, emissiveIntensity: .23 })
};
const makeRenderer = (container) => {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  container.append(renderer.domElement);
  return renderer;
};
const lights = (scene) => {
  scene.add(new THREE.HemisphereLight(0xbac8ff, 0x443127, 2.6));
  const key = new THREE.DirectionalLight(0xffe0a6, 3.7); key.position.set(-5, 8, 8); scene.add(key);
  const violet = new THREE.PointLight(0x8078ff, 14, 20, 2); violet.position.set(5, 2, -2); scene.add(violet);
  const blue = new THREE.PointLight(0x7ac9ff, 9, 18, 2); blue.position.set(-6, -1, 6); scene.add(blue);
};
const cube = (size, material, radius = .1) => {
  const geometry = new THREE.BoxGeometry(...size, 2, 2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.radius = radius;
  return mesh;
};
const phone = () => {
  const group = new THREE.Group();
  const frame = cube([.84, 1.65, .1], mat.silver); const screen = cube([.73, 1.48, .025], mat.glass); screen.position.z = .07;
  const island = cube([.28, .07, .02], mat.dark); island.position.set(0, .62, .09);
  group.add(frame, screen, island); group.rotation.set(-.2, .35, .16); return group;
};
const cameraModel = () => {
  const group = new THREE.Group();
  const body = cube([1.45, .92, .55], mat.ivory); const grip = cube([.27, .7, .65], mat.dark); grip.position.set(.62, -.04, .04);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(.37, .37, .22, 32), mat.gold); ring.rotation.x = Math.PI / 2; ring.position.z = .42;
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(.29, .29, .245, 32), mat.glass); lens.rotation.x = Math.PI / 2; lens.position.z = .53;
  const top = cube([.38, .23, .32], mat.dark); top.position.set(-.15, .56, 0);
  group.add(body, grip, ring, lens, top); group.rotation.set(.28, -.35, -.12); return group;
};
const headphones = () => {
  const group = new THREE.Group();
  const arch = new THREE.Mesh(new THREE.TorusGeometry(.6, .085, 16, 44, Math.PI), mat.ivory); arch.rotation.z = Math.PI; arch.position.y = .09;
  [-.58, .58].forEach((x) => { const cup = new THREE.Mesh(new THREE.CylinderGeometry(.25, .25, .16, 28), mat.gold); cup.rotation.z = Math.PI / 2; cup.position.set(x, -.4, 0); const pad = new THREE.Mesh(new THREE.TorusGeometry(.16, .06, 12, 22), mat.dark); pad.rotation.y = Math.PI / 2; pad.position.set(x + (x < 0 ? -.1 : .1), -.4, 0); group.add(cup,pad); });
  group.add(arch); group.rotation.set(.14,.35,-.18); return group;
};
const setupHero = () => {
  const container = document.querySelector("#heroGadgets"); if (!container) return;
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(34, 1, .1, 100); camera.position.set(0,0,12);
  const renderer = makeRenderer(container); lights(scene);
  const phoneObject = phone(); phoneObject.position.set(-1.45, 1.05, 0);
  const cameraObject = cameraModel(); cameraObject.position.set(1.38, .72, 0);
  const headphonesObject = headphones(); headphonesObject.position.set(.9, -1.22, 0);
  scene.add(phoneObject, cameraObject, headphonesObject);
  const resize = () => { const w = container.clientWidth, h = container.clientHeight; renderer.setSize(w,h,false); camera.aspect = w/h; camera.updateProjectionMatrix(); };
  const pointer = { x: 0, y: 0 };
  document.querySelector(".hero").addEventListener("pointermove", (event) => { pointer.x = event.clientX / innerWidth - .5; pointer.y = event.clientY / innerHeight - .5; });
  const animate = (time) => {
    const t = time * .001;
    phoneObject.position.y = 1.05 + Math.sin(t * 1.1) * .1; cameraObject.position.y = .72 + Math.cos(t * .9) * .09; headphonesObject.position.y = -1.22 + Math.sin(t * 1.2) * .11;
    phoneObject.rotation.y = .35 + t * .1 + pointer.x * .18; cameraObject.rotation.y = -.35 - t * .12 + pointer.x * .18; headphonesObject.rotation.y = .35 + t * .13 + pointer.x * .14; scene.rotation.x = pointer.y * .08;
    renderer.render(scene,camera); if (!reducedMotion) requestAnimationFrame(animate);
  };
  addEventListener("resize", resize, { passive:true }); resize(); animate(0);
};
const car = () => {
  const group = new THREE.Group(); const body = cube([2.15,.45,1.05],mat.copper); body.position.y=-.28; const cabin = cube([1.22,.42,.9],mat.dark); cabin.position.set(-.14,.12,0); const roof = cube([.94,.32,.92],mat.glass); roof.position.set(-.14,.16,0); group.add(body,cabin,roof);
  [-.73,.73].forEach((x) => [-.5,.5].forEach((z) => { const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.23,.23,.16,20),mat.dark); wheel.rotation.x=Math.PI/2; wheel.position.set(x,-.41,z); group.add(wheel); })); group.rotation.set(-.12,-.42,.04); return group;
};
const drone = () => {
  const group = new THREE.Group(); const core = new THREE.Mesh(new THREE.SphereGeometry(.3,22,16),mat.ivory); core.scale.set(1.45,.5,.9); group.add(core);
  [[-.7,-.52],[-.7,.52],[.7,-.52],[.7,.52]].forEach(([x,z]) => { const arm=cube([.86,.06,.08],mat.silver); arm.position.set(x*.48,0,z*.48); arm.rotation.y=Math.atan2(z,x); const motor=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.12,18),mat.gold); motor.position.set(x,0,z); const prop=cube([.61,.018,.07],mat.violet); prop.position.set(x,.11,z); group.add(arm,motor,prop); }); group.rotation.set(.15,-.4,-.12); return group;
};
const setupReview = (selector, create, flying = false) => {
  const container=document.querySelector(selector); if (!container) return; const card=container.closest(".review-card"); const scene=new THREE.Scene(); const camera=new THREE.PerspectiveCamera(33,1,.1,100); camera.position.z=7.2; const renderer=makeRenderer(container); lights(scene); const object=create(); object.position.set(flying?1.05:1.8,flying?-.1:-.55,0); scene.add(object);
  const halo=new THREE.Mesh(new THREE.CircleGeometry(2.3,40),new THREE.MeshBasicMaterial({color:flying?0x8175e8:0xcf9353,transparent:true,opacity:.16})); halo.position.set(.7,.1,-1); scene.add(halo); let hover=false; card.addEventListener("pointerenter",()=>hover=true); card.addEventListener("pointerleave",()=>hover=false);
  const resize=()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}; const animate=(time)=>{const t=time*.001,target=hover?(flying?.2:-.35):(flying?1.05:1.8); object.position.x+=(target-object.position.x)*.05; object.position.y=(flying?-.1:-.55)+Math.sin(t*(flying?3:1.3))*(flying?.23:.07); object.rotation.y+=hover?.012:.003; object.rotation.z=flying?Math.sin(t*2.8)*.14:.04; halo.rotation.z=t*.08; renderer.render(scene,camera);if(!reducedMotion)requestAnimationFrame(animate);}; addEventListener("resize",resize,{passive:true});resize();card.classList.add("three-ready");animate(0);
};

const createCityTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 960; canvas.height = 540;
  const context = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const paint = (time) => {
    const gradient = context.createLinearGradient(0, 0, 960, 540);
    gradient.addColorStop(0, "#09152f"); gradient.addColorStop(.55, "#20346a"); gradient.addColorStop(1, "#120e2d");
    context.fillStyle = gradient; context.fillRect(0, 0, 960, 540);
    context.strokeStyle = "rgba(116, 224, 255, .45)"; context.lineWidth = 3;
    for (let x = 0; x < 1000; x += 58) { const wobble = Math.sin(time * .001 + x) * 15; context.beginPath(); context.moveTo(x, 540); context.lineTo(480 + (x - 480) * .38, 270 + wobble); context.stroke(); }
    context.strokeStyle = "rgba(230, 182, 90, .3)";
    for (let y = 305; y < 560; y += 32) { context.beginPath(); context.moveTo(0, y); context.lineTo(960, y); context.stroke(); }
    const buildings = [[35,155,105,180],[145,89,82,246],[245,144,132,191],[405,54,105,281],[529,120,122,213],[682,76,90,258],[790,152,138,182]];
    buildings.forEach(([x,y,w,h], index) => { context.fillStyle = index % 2 ? "#18264d" : "#0e1d3e"; context.fillRect(x,y,w,h); context.fillStyle = index % 2 ? "rgba(221,109,255,.74)" : "rgba(101,230,255,.65)"; for (let row=y+22;row<y+h-8;row+=31) for (let col=x+16;col<x+w-8;col+=26) if ((col+row+index*3)%4!==0) context.fillRect(col,row,9,5); });
    context.strokeStyle = "rgba(116,244,255,.8)"; context.lineWidth = 5; context.beginPath(); context.ellipse(510, 185, 116, 35, 0, 0, Math.PI * 2); context.stroke();
    context.fillStyle = "rgba(246,240,231,.85)"; context.font = "24px monospace"; context.fillText("TECH2U // REVIEW MODE", 34, 43);
    texture.needsUpdate = true;
  };
  return { texture, paint };
};

const createSeatedRobot = () => {
  const robot = new THREE.Group();
  const metal = new THREE.MeshPhysicalMaterial({ color: 0xd7d4cd, metalness: .9, roughness: .19 });
  const darkMetal = new THREE.MeshPhysicalMaterial({ color: 0x141723, metalness: .85, roughness: .18 });
  const glow = new THREE.MeshPhysicalMaterial({ color: 0x56c8ff, metalness: .1, roughness: .08, emissive: 0x1479e8, emissiveIntensity: 1.15 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(.54, 30, 22), metal); body.scale.set(1, 1.1, .76); body.position.y = .46;
  const core = new THREE.Mesh(new THREE.SphereGeometry(.17, 20, 16), glow); core.position.set(0, .52, .53);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.68, 32, 24), metal); head.scale.set(1.04, .78, .78); head.position.y = 1.44;
  const visor = new THREE.Mesh(new THREE.SphereGeometry(.48, 30, 20), darkMetal); visor.scale.set(1.22, .62, .25); visor.position.set(0, 1.42, .56);
  const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(.08, 16, 12), glow); eyeLeft.position.set(-.18, 1.47, .69);
  const eyeRight = eyeLeft.clone(); eyeRight.position.x = .18;
  robot.add(body, core, head, visor, eyeLeft, eyeRight);
  const headPivot = new THREE.Group(); headPivot.add(head, visor, eyeLeft, eyeRight); robot.remove(head, visor, eyeLeft, eyeRight); robot.add(headPivot);
  const makeArm = (side) => { const arm = new THREE.Group(); const upper = new THREE.Mesh(new THREE.CylinderGeometry(.13, .17, .58, 20), metal); upper.position.y = -.29; const hand = new THREE.Mesh(new THREE.SphereGeometry(.15, 18, 14), metal); hand.position.y = -.64; arm.add(upper, hand); arm.position.set(side * .57, .7, .05); arm.rotation.z = side * -.56; robot.add(arm); };
  makeArm(-1); makeArm(1);
  const legs = [];
  const makeLeg = (side) => { const pivot = new THREE.Group(); const thigh = new THREE.Mesh(new THREE.CylinderGeometry(.16, .21, .58, 20), metal); thigh.position.y = -.3; const shin = new THREE.Mesh(new THREE.CylinderGeometry(.14, .18, .48, 20), metal); shin.position.y = -.82; const foot = new THREE.Mesh(new THREE.SphereGeometry(.21, 20, 14), darkMetal); foot.scale.set(1.2, .65, 1.45); foot.position.set(0, -1.1, .18); pivot.add(thigh, shin, foot); pivot.position.set(side * .3, .1, .43); pivot.rotation.x = .11; robot.add(pivot); legs.push(pivot); };
  makeLeg(-1); makeLeg(1);
  robot.userData = { head: headPivot, legs };
  robot.traverse((child) => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
  return robot;
};

const setupSocialScene = () => {
  const container = document.querySelector("#socialScene"); if (!container) return;
  const host = container.closest(".social-monitor");
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(31, 1, .1, 100); camera.position.set(0, .1, 15.7);
  const renderer = makeRenderer(container); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene.add(new THREE.HemisphereLight(0x89a5ff, 0x2b1d1a, 1.6));
  const key = new THREE.DirectionalLight(0xffdb99, 4.2); key.position.set(-5, 7, 8); key.castShadow = true; key.shadow.mapSize.set(1024,1024); scene.add(key);
  const neon = new THREE.PointLight(0x7a78ff, 24, 18, 2); neon.position.set(3, 1, 3); scene.add(neon);
  const screen = createCityTexture();
  const monitor = new THREE.Group(); monitor.position.set(.8, -.9, 0); monitor.rotation.set(.05, -.28, -.025);
  const outer = new THREE.Mesh(new THREE.BoxGeometry(7.5, 4.45, .42), darkMetal); const rim = new THREE.Mesh(new THREE.BoxGeometry(7.15, 4.12, .12), mat.gold); rim.position.z = .25;
  const display = new THREE.Mesh(new THREE.BoxGeometry(6.83, 3.78, .055), new THREE.MeshStandardMaterial({ map: screen.texture, metalness: .16, roughness: .42, emissive: 0x121b40, emissiveIntensity: .35 })); display.position.z = .34;
  const stand = new THREE.Mesh(new THREE.BoxGeometry(1.25, .18, .7), darkMetal); stand.position.set(.15, -2.55, -.06); stand.rotation.y = -.18;
  monitor.add(outer, rim, display, stand); [outer,rim,display,stand].forEach((mesh) => { mesh.castShadow = true; mesh.receiveShadow = true; });
  const robot = createSeatedRobot(); robot.position.set(.18, 1.43, .34); robot.scale.set(.93,.93,.93); monitor.add(robot); scene.add(monitor);
  const pointer = { x: 0, y: 0 }; const target = { x: 0, y: 0 };
  host.closest(".social-sticky").addEventListener("pointermove", (event) => { const bounds = host.getBoundingClientRect(); pointer.x = ((event.clientX - bounds.left) / bounds.width - .5); pointer.y = ((event.clientY - bounds.top) / bounds.height - .5); });
  const resize = () => { const width=container.clientWidth,height=container.clientHeight; renderer.setSize(width,height,false); camera.aspect=width/height; camera.updateProjectionMatrix(); };
  const animate = (time) => { const t=time*.001; target.x += (pointer.x - target.x) * .045; target.y += (pointer.y - target.y) * .045; camera.position.x = target.x * .42; camera.position.y = .1 - target.y * .26; camera.lookAt(.25,-.1,0);
    monitor.position.y = -.9 + Math.sin(t*.8)*.025; robot.userData.head.rotation.y = Math.sin(t*1.05)*.19; robot.userData.legs[0].rotation.z = .16 + Math.sin(t*3.2)*.22; robot.userData.legs[1].rotation.z = -.16 - Math.sin(t*3.2)*.22; screen.paint(time); renderer.render(scene,camera); if(!reducedMotion) requestAnimationFrame(animate); };
  addEventListener("resize",resize,{passive:true}); resize(); host.classList.add("three-ready"); animate(0);
};

try { setupHero(); setupSocialScene(); setupReview("#carScene",car); setupReview("#droneScene",drone,true); } catch (error) { console.warn("3D visuals unavailable; image fallbacks remain visible.",error); }
