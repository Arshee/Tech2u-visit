(() => {
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const progress = (element, travel = 1) => {
    const rect = element.getBoundingClientRect();
    const available = Math.max(element.offsetHeight - window.innerHeight * travel, 1);
    return clamp(-rect.top / available);
  };

  const canvas = document.querySelector("#heroCanvas");
  const context = canvas.getContext("2d");
  const hero = document.querySelector(".hero");
  const paintHero = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const horizon = height * 0.74;
    context.strokeStyle = "rgba(131, 119, 232, 0.18)";
    context.lineWidth = 1;
    for (let x = -width; x < width * 2; x += 52) {
      context.beginPath();
      context.moveTo(width * 0.69, horizon);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = horizon + 12; y < height; y += 24) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    context.strokeStyle = "rgba(229, 183, 90, 0.35)";
    context.beginPath();
    context.moveTo(0, height * 0.82);
    context.lineTo(width, height * 0.93);
    context.stroke();
    context.beginPath();
    context.moveTo(width * 0.07, height * 0.2);
    context.lineTo(width * 0.9, height * 0.2);
    context.stroke();
  };
  paintHero();
  window.addEventListener("resize", paintHero, { passive: true });

  const heroRobot = document.querySelector("#heroRobot");
  hero.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 16;
    const y = (event.clientY / window.innerHeight - 0.5) * 10;
    heroRobot.style.setProperty("--robot-x", `${x}px`);
    heroRobot.style.setProperty("--robot-y", `${y}px`);
  });
  hero.addEventListener("pointerleave", () => {
    heroRobot.style.setProperty("--robot-x", "0px");
    heroRobot.style.setProperty("--robot-y", "0px");
  });

  const social = document.querySelector("[data-social-intro]");
  const edit = document.querySelector("[data-edit-showcase]");
  const bassmarker = document.querySelector("[data-bassmarker]");
  const editFrames = [...document.querySelectorAll(".frame")];
  let scheduled = false;

  const updateScroll = () => {
    scheduled = false;
    if (social) {
      const amount = progress(social);
      social.style.setProperty("--monitor-y", `${-255 + amount * 255}px`);
    }
    if (edit) {
      const amount = progress(edit);
      const values = [
        [25 - amount * 30, 8 + amount * 7, -7 + amount * 8],
        [5 + amount * 23, 43 - amount * 27, 7 - amount * 9],
        [37 - amount * 20, 53 - amount * 38, -2 + amount * 7]
      ];
      editFrames.forEach((frame, index) => {
        const [x, y, rotation] = values[index];
        frame.style.setProperty("--frame-x", `${x}%`);
        frame.style.setProperty("--frame-y", `${y}%`);
        frame.style.setProperty("--frame-r", `${rotation}deg`);
      });
      edit.style.setProperty("--head-x", `${2 + amount * 93}%`);
    }
    if (bassmarker) {
      const amount = progress(bassmarker);
      const markerProgress = clamp((amount - 0.12) / 0.32);
      const revealProgress = clamp((amount - 0.53) / 0.25);
      const timelineScale = 0.45 + clamp(amount / 0.58) * 0.8;
      bassmarker.style.setProperty("--timeline-scale", timelineScale.toFixed(3));
      bassmarker.style.setProperty("--timeline-opacity", `${1 - revealProgress * 0.92}`);
      bassmarker.style.setProperty("--markers-opacity", markerProgress.toFixed(2));
      bassmarker.style.setProperty("--marker-drop", `${-44 + markerProgress * 44}px`);
      bassmarker.style.setProperty("--playhead-x", `${4 + markerProgress * 81}%`);
      bassmarker.style.setProperty("--product-opacity", revealProgress.toFixed(2));
      bassmarker.style.setProperty("--product-y", `${110 - revealProgress * 110}px`);
      bassmarker.style.setProperty("--product-pointer", revealProgress > 0.95 ? "auto" : "none");
    }
  };
  const onScroll = () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateScroll);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateScroll();

  const cards = document.querySelectorAll(".review-card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting));
  }, { threshold: 0.18 });
  cards.forEach((card) => observer.observe(card));
})();
