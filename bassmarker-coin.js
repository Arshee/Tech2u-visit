(function () {
  var canvas = document.getElementById('bmCoinCanvas');
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = canvas.getContext('2d');
  var pointer = 0, target = 0, raf;
  function fit() {
    var size = Math.min(canvas.clientWidth || 320, canvas.clientHeight || 320);
    canvas.width = size * devicePixelRatio; canvas.height = size * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  function draw(time) {
    var s = canvas.width / devicePixelRatio, c = s / 2, r = s * .32;
    pointer += (target - pointer) * .07;
    ctx.clearRect(0, 0, s, s);
    var wobble = Math.sin(time / 1000) * .07 + pointer;
    ctx.save(); ctx.translate(c, c); ctx.scale(1, .88); ctx.rotate(wobble);
    var halo = ctx.createRadialGradient(0,0,r*.2,0,0,r*1.8); halo.addColorStop(0,'rgba(216,255,75,.28)');halo.addColorStop(1,'rgba(216,255,75,0)');
    ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,r*1.8,0,Math.PI*2);ctx.fill();
    var rim=ctx.createLinearGradient(-r,-r,r,r);rim.addColorStop(0,'#f4f1e9');rim.addColorStop(.34,'#d8ff4b');rim.addColorStop(.64,'#ff587b');rim.addColorStop(1,'#f4f1e9');
    ctx.fillStyle=rim;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#11110f';ctx.beginPath();ctx.arc(0,0,r*.86,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(244,241,233,.72)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.76,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#d8ff4b';ctx.lineWidth=r*.13;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-r*.42,r*.22);ctx.lineTo(-r*.16,-r*.2);ctx.lineTo(r*.02,r*.15);ctx.lineTo(r*.37,-r*.3);ctx.stroke();
    ctx.fillStyle='#ff587b';ctx.beginPath();ctx.arc(r*.37,-r*.3,r*.08,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f5f6f8';ctx.font='bold '+(r*.16)+'px Space Grotesk';ctx.textAlign='center';ctx.fillText('BASS',0,r*.48);ctx.fillStyle='#75e5ff';ctx.fillText('MARKER',0,r*.66);
    ctx.restore(); raf=requestAnimationFrame(draw);
  }
  new ResizeObserver(fit).observe(canvas); fit();
  canvas.addEventListener('pointermove',function(e){var rect=canvas.getBoundingClientRect();target=((e.clientX-rect.left)/rect.width-.5)*.42});
  canvas.addEventListener('pointerleave',function(){target=0}); raf=requestAnimationFrame(draw);
}());
