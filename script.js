(() => {
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const getProgress = (element) => {
    const rect = element.getBoundingClientRect();
    return clamp(-rect.top / Math.max(element.offsetHeight - window.innerHeight, 1));
  };

  const canvas = document.querySelector("#heroCanvas");
  const context = canvas.getContext("2d");
  const stars = [];
  let canvasWidth = 0;
  let canvasHeight = 0;
  const resizeSpace = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;
    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars.length = 0;
    const count = Math.min(165, Math.floor(canvasWidth * canvasHeight / 8800));
    for (let index = 0; index < count; index += 1) {
      stars.push({ x: Math.random() * canvasWidth, y: Math.random() * canvasHeight, size: Math.random() * 1.8 + .25, speed: Math.random() * .55 + .08, gold: Math.random() > .82 });
    }
  };
  const drawSpace = (time) => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    const originX = canvasWidth * .72;
    const originY = canvasHeight * .54;
    const glow = context.createRadialGradient(originX, originY, 0, originX, originY, Math.max(canvasWidth, canvasHeight) * .54);
    glow.addColorStop(0, "rgba(71, 117, 255, .18)");
    glow.addColorStop(.52, "rgba(21, 48, 105, .05)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow; context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.lineWidth = 1;
    [0, 1, 2].forEach((index) => {
      context.strokeStyle = `rgba(${index === 1 ? "234, 200, 136" : "126, 160, 255"}, ${.12 - index * .023})`;
      context.beginPath();
      context.ellipse(originX + index * 16, originY + index * 8, canvasWidth * (.22 + index * .055), canvasHeight * (.13 + index * .035), -.25, .1, Math.PI * 1.82);
      context.stroke();
    });
    stars.forEach((star, index) => {
      star.x -= star.speed * (index % 3 + 1);
      star.y += Math.sin(time * .0007 + index) * .05;
      if (star.x < -12) { star.x = canvasWidth + 12; star.y = Math.random() * canvasHeight; }
      context.strokeStyle = star.gold ? "rgba(246, 213, 145, .37)" : "rgba(168, 204, 255, .34)";
      context.beginPath(); context.moveTo(star.x + star.size * 7, star.y); context.lineTo(star.x, star.y); context.stroke();
      context.fillStyle = star.gold ? "rgba(250, 224, 173, .96)" : "rgba(213, 232, 255, .9)";
      context.beginPath(); context.arc(star.x, star.y, star.size, 0, Math.PI * 2); context.fill();
    });
    for (let index = 0; index < 5; index += 1) {
      const angle = time * .00025 * (index % 2 ? 1 : -1) + index * 1.21;
      const radiusX = canvasWidth * (.13 + index * .015);
      const radiusY = canvasHeight * (.08 + index * .01);
      const x = originX + Math.cos(angle) * radiusX;
      const y = originY + Math.sin(angle) * radiusY;
      context.fillStyle = index === 2 ? "#f3d59d" : "#d5ecff";
      context.shadowBlur = 14; context.shadowColor = context.fillStyle;
      context.beginPath(); context.arc(x, y, index === 2 ? 2.4 : 1.45, 0, Math.PI * 2); context.fill();
      context.shadowBlur = 0;
    }
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(drawSpace);
  };
  resizeSpace();
  window.addEventListener("resize", resizeSpace, { passive: true });
  drawSpace(0);

  const hero = document.querySelector(".hero");
  const robot = document.querySelector("#heroRobot");
  hero.addEventListener("pointermove", (event) => {
    robot.style.setProperty("--robot-x", `${(event.clientX / window.innerWidth - .5) * 14}px`);
    robot.style.setProperty("--robot-y", `${(event.clientY / window.innerHeight - .5) * 9}px`);
  });
  hero.addEventListener("pointerleave", () => { robot.style.setProperty("--robot-x", "0px"); robot.style.setProperty("--robot-y", "0px"); });

  const social = document.querySelector("[data-social-intro]");
  const edit = document.querySelector("[data-edit-showcase]");
  const bassmarker = document.querySelector("[data-bassmarker]");
  const frames = [...document.querySelectorAll(".frame")];
  let pending = false;
  const update = () => {
    pending = false;
    if (social) social.style.setProperty("--monitor-y", `${-250 + getProgress(social) * 250}px`);
    if (edit) {
      const p = getProgress(edit);
      [[25 - p * 30, 8 + p * 7, -7 + p * 8], [5 + p * 23, 43 - p * 27, 7 - p * 9], [37 - p * 20, 53 - p * 38, -2 + p * 7]].forEach(([x, y, r], index) => {
        frames[index].style.setProperty("--frame-x", `${x}%`); frames[index].style.setProperty("--frame-y", `${y}%`); frames[index].style.setProperty("--frame-r", `${r}deg`);
      });
      edit.style.setProperty("--head-x", `${2 + p * 93}%`);
    }
    if (bassmarker) {
      const p = getProgress(bassmarker);
      const markers = clamp((p - .12) / .32);
      const reveal = clamp((p - .53) / .25);
      bassmarker.style.setProperty("--timeline-scale", (.45 + clamp(p / .58) * .8).toFixed(3));
      bassmarker.style.setProperty("--timeline-opacity", `${1 - reveal * .92}`);
      bassmarker.style.setProperty("--markers-opacity", markers.toFixed(2));
      bassmarker.style.setProperty("--marker-drop", `${-44 + markers * 44}px`);
      bassmarker.style.setProperty("--playhead-x", `${4 + markers * 81}%`);
      bassmarker.style.setProperty("--product-opacity", reveal.toFixed(2));
      bassmarker.style.setProperty("--product-y", `${110 - reveal * 110}px`);
      bassmarker.style.setProperty("--product-pointer", reveal > .95 ? "auto" : "none");
    }
  };
  const requestUpdate = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  update();
})();
