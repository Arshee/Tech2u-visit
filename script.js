(() => {
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const getProgress = (element) => {
    const rect = element.getBoundingClientRect();
    return clamp(-rect.top / Math.max(element.offsetHeight - window.innerHeight, 1));
  };

  const canvas = document.querySelector("#heroCanvas");
  const context = canvas.getContext("2d");
  const drawGrid = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const horizon = height * 0.76;
    context.strokeStyle = "rgba(131, 119, 232, .18)";
    context.lineWidth = 1;
    for (let x = -width; x < width * 2; x += 52) {
      context.beginPath(); context.moveTo(width * .69, horizon); context.lineTo(x, height); context.stroke();
    }
    for (let y = horizon + 12; y < height; y += 24) {
      context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
    }
    context.strokeStyle = "rgba(229, 183, 90, .34)";
    context.beginPath(); context.moveTo(0, height * .82); context.lineTo(width, height * .93); context.stroke();
    context.beginPath(); context.moveTo(0, height * .2); context.lineTo(width, height * .2); context.stroke();
  };
  drawGrid();
  window.addEventListener("resize", drawGrid, { passive: true });

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
