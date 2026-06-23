(() => {
  const canvas = document.querySelector("#heroCanvas");
  const context = canvas.getContext("2d");
  const hero = document.querySelector(".hero");
  const robot = document.querySelector("#heroRobot");
  const stars = [];
  let width = 0;
  let height = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth; height = canvas.clientHeight;
    canvas.width = width * ratio; canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars.length = 0;
    const amount = Math.min(180, Math.floor(width * height / 8200));
    for (let index = 0; index < amount; index += 1) stars.push({ x:Math.random()*width, y:Math.random()*height, size:Math.random()*1.8+.25, speed:Math.random()*.55+.08, gold:Math.random()>.82 });
  };
  const draw = (time) => {
    context.clearRect(0,0,width,height);
    const originX = width*.72; const originY = height*.54;
    const glow = context.createRadialGradient(originX,originY,0,originX,originY,Math.max(width,height)*.55);
    glow.addColorStop(0,"rgba(71,117,255,.18)"); glow.addColorStop(.55,"rgba(21,48,105,.05)"); glow.addColorStop(1,"rgba(0,0,0,0)"); context.fillStyle=glow; context.fillRect(0,0,width,height);
    [0,1,2].forEach((index) => { context.strokeStyle=index===1?"rgba(234,200,136,.1)":"rgba(126,160,255,.1)"; context.beginPath(); context.ellipse(originX+index*16,originY+index*8,width*(.22+index*.055),height*(.13+index*.035),-.25,.1,Math.PI*1.82); context.stroke(); });
    stars.forEach((star,index) => { star.x-=star.speed*(index%3+1); star.y+=Math.sin(time*.0007+index)*.05; if(star.x < -12){star.x=width+12;star.y=Math.random()*height;} context.strokeStyle=star.gold?"rgba(246,213,145,.37)":"rgba(168,204,255,.34)"; context.beginPath();context.moveTo(star.x+star.size*7,star.y);context.lineTo(star.x,star.y);context.stroke(); context.fillStyle=star.gold?"rgba(250,224,173,.96)":"rgba(213,232,255,.9)";context.beginPath();context.arc(star.x,star.y,star.size,0,Math.PI*2);context.fill(); });
    for(let index=0;index<5;index+=1){const angle=time*.00025*(index%2?1:-1)+index*1.21;const x=originX+Math.cos(angle)*width*(.13+index*.015);const y=originY+Math.sin(angle)*height*(.08+index*.01);context.fillStyle=index===2?"#f3d59d":"#d5ecff";context.shadowBlur=14;context.shadowColor=context.fillStyle;context.beginPath();context.arc(x,y,index===2?2.4:1.45,0,Math.PI*2);context.fill();context.shadowBlur=0;}
    if(!matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(draw);
  };
  hero.addEventListener("pointermove",(event)=>{const x=(event.clientX/innerWidth-.5)*15;const y=(event.clientY/innerHeight-.5)*9;robot.style.transform=`translate3d(${x}px,${y}px,0)`;});
  hero.addEventListener("pointerleave",()=>{robot.style.transform="translate3d(0,0,0)";});
  document.querySelectorAll(".floating-tag").forEach((tag,index)=>{tag.style.setProperty("--duration",`${5.7+Math.random()*3.2}s`);tag.style.setProperty("--delay",`${-Math.random()*4}s`);tag.style.setProperty("--move-x",`${-18+Math.random()*36}px`);tag.style.setProperty("--move-y",`${-22+Math.random()*32}px`);tag.style.setProperty("--turn",`${-5+Math.random()*10}deg`);if(index===1)tag.style.animationDirection="alternate-reverse";});
  resize(); addEventListener("resize",resize,{passive:true}); draw(0);
})();
