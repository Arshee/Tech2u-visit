(() => {
  const canvas = document.querySelector("#heroCanvas");
  const context = canvas.getContext("2d");
  const robot = document.querySelector("#heroRobot");
  const hero = document.querySelector(".hero");
  const stars = [];
  let width = 0;
  let height = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars.length = 0;
    const amount = Math.min(165, Math.floor(width * height / 8800));
    for (let index = 0; index < amount; index += 1) {
      stars.push({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 1.8 + .25, speed: Math.random() * .55 + .08, gold: Math.random() > .82 });
    }
  };

  const paint = (time) => {
    context.clearRect(0, 0, width, height);
    const x = width * .72;
    const y = height * .54;
    const glow = context.createRadialGradient(x, y, 0, x, y, Math.max(width, height) * .55);
    glow.addColorStop(0, "rgba(71,117,255,.18)");
    glow.addColorStop(.55, "rgba(21,48,105,.05)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = glow; context.fillRect(0, 0, width, height);
    [0, 1, 2].forEach((index) => {
      context.strokeStyle = index === 1 ? "rgba(234,200,136,.1)" : "rgba(126,160,255,.1)";
      context.beginPath(); context.ellipse(x + index * 16, y + index * 8, width * (.22 + index * .055), height * (.13 + index * .035), -.25, .1, Math.PI * 1.82); context.stroke();
    });
    stars.forEach((star, index) => {
      star.x -= star.speed * (index % 3 + 1);
      star.y += Math.sin(time * .0007 + index) * .05;
      if (star.x < -12) { star.x = width + 12; star.y = Math.random() * height; }
      context.strokeStyle = star.gold ? "rgba(246,213,145,.37)" : "rgba(168,204,255,.34)";
      context.beginPath(); context.moveTo(star.x + star.size * 7, star.y); context.lineTo(star.x, star.y); context.stroke();
      context.fillStyle = star.gold ? "rgba(250,224,173,.96)" : "rgba(213,232,255,.9)";
      context.beginPath(); context.arc(star.x, star.y, star.size, 0, Math.PI * 2); context.fill();
    });
    for (let index = 0; index < 5; index += 1) {
      const angle = time * .00025 * (index % 2 ? 1 : -1) + index * 1.21;
      const starX = x + Math.cos(angle) * width * (.13 + index * .015);
      const starY = y + Math.sin(angle) * height * (.08 + index * .01);
      context.fillStyle = index === 2 ? "#f3d59d" : "#d5ecff";
      context.shadowBlur = 14; context.shadowColor = context.fillStyle;
      context.beginPath(); context.arc(starX, starY, index === 2 ? 2.4 : 1.45, 0, Math.PI * 2); context.fill(); context.shadowBlur = 0;
    }
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(paint);
  };

  hero.addEventListener("pointermove", (event) => {
    const offsetX = (event.clientX / window.innerWidth - .5) * 14;
    const offsetY = (event.clientY / window.innerHeight - .5) * 9;
    robot.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  });
  hero.addEventListener("pointerleave", () => { robot.style.transform = "translate3d(0, 0, 0)"; });

  resize();
  addEventListener("resize", resize, { passive: true });
  paint(0);
})();
