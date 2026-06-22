(function () {
  'use strict';

  var stage = document.getElementById('heroStage');
  var canvas = document.getElementById('heroCanvas');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('pointermove', function (event) {
    if (!stage || reduceMotion) return;
    var rect = stage.getBoundingClientRect();
    var x = (event.clientX - rect.left) / rect.width - .5;
    var y = (event.clientY - rect.top) / rect.height - .5;
    stage.style.setProperty('--plane-x', (x * 12).toFixed(1) + 'px');
    stage.style.setProperty('--plane-y', (y * 8).toFixed(1) + 'px');
  });

  if (!stage || !canvas) return;

  var context = canvas.getContext('2d');
  var width = 0;
  var height = 0;
  var ratio = Math.min(window.devicePixelRatio || 1, 2);
  var raf;

  function fitCanvas() {
    width = Math.max(1, stage.clientWidth);
    height = Math.max(1, stage.clientHeight);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function line(context, x1, y1, x2, y2, color, alpha) {
    context.strokeStyle = color;
    context.globalAlpha = alpha;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  function drawFrame(time) {
    context.clearRect(0, 0, width, height);

    var horizon = height * .56;
    var originX = width * .71;
    var originY = height * .33;
    var drift = Math.sin(time * .00022) * 7;
    var bars = 42;
    var i;

    context.lineWidth = 1;
    for (i = 0; i < 20; i += 1) {
      var gridY = horizon + Math.pow(i / 19, 1.9) * (height - horizon);
      line(context, width * .16, gridY, width * 1.05, gridY, '#d8ff4b', .08 + (i / 19) * .14);
    }

    for (i = -10; i <= 12; i += 1) {
      var baseX = width * .52 + i * width * .095;
      line(context, originX, originY, baseX, height * 1.04, '#75e5ff', .13);
    }

    context.globalAlpha = .88;
    for (i = 0; i < bars; i += 1) {
      var progress = i / (bars - 1);
      var x = width * .43 + progress * width * .5;
      var beat = Math.sin(time * .004 + i * .92) * .5 + .5;
      var pulse = Math.sin(time * .0014 + i * .24) * .5 + .5;
      var barHeight = 10 + (beat * .72 + pulse * .28) * (height * .12);
      context.fillStyle = i % 7 === 0 ? '#ff587b' : (i % 3 === 0 ? '#d8ff4b' : '#75e5ff');
      context.fillRect(x, horizon - barHeight + drift, Math.max(2, width * .0023), barHeight);
    }

    context.globalAlpha = .22;
    context.strokeStyle = '#f4f1e9';
    context.beginPath();
    context.moveTo(width * .42, horizon + drift);
    context.lineTo(width * .98, horizon + drift);
    context.stroke();

    context.globalAlpha = 1;
    if (!reduceMotion) raf = window.requestAnimationFrame(drawFrame);
  }

  new ResizeObserver(fitCanvas).observe(stage);
  fitCanvas();
  drawFrame(0);
  if (!reduceMotion) raf = window.requestAnimationFrame(drawFrame);

  window.addEventListener('pagehide', function () {
    if (raf) window.cancelAnimationFrame(raf);
  }, { once: true });
}());
