(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var robotStage = document.getElementById('robotStage');
  var canvas = document.getElementById('heroCanvas');
  var productScene = document.querySelector('[data-bassmarker-scene]');

  if (robotStage && !reduceMotion) {
    robotStage.addEventListener('pointermove', function (event) {
      var rect = robotStage.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - .5;
      var y = (event.clientY - rect.top) / rect.height - .5;
      robotStage.style.setProperty('--robot-x', (x * 18).toFixed(1) + 'px');
      robotStage.style.setProperty('--robot-y', (y * 11).toFixed(1) + 'px');
      robotStage.style.setProperty('--robot-rotate', (x * 7).toFixed(1) + 'deg');
    });
    robotStage.addEventListener('pointerleave', function () {
      robotStage.style.removeProperty('--robot-x');
      robotStage.style.removeProperty('--robot-y');
      robotStage.style.removeProperty('--robot-rotate');
    });
  }

  if (canvas) {
    var context = canvas.getContext('2d');
    var width = 0;
    var height = 0;
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var frame;

    function fitCanvas() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function drawLine(x1, y1, x2, y2, color, opacity) {
      context.globalAlpha = opacity;
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    }

    function draw(time) {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;

      var i;
      var horizon = height * .64;
      var originX = width * .7;
      var travel = (time * .00006) % 1;

      for (i = 0; i < 15; i += 1) {
        var depth = (i + travel) / 15;
        var y = horizon + Math.pow(depth, 2.2) * (height - horizon);
        drawLine(width * .27, y, width * 1.02, y, '#79ddff', .025 + depth * .09);
      }

      for (i = -10; i < 14; i += 1) {
        var base = originX + i * width * .08;
        drawLine(originX, height * .29, base, height * 1.03, i % 3 ? '#79ddff' : '#d8ff4b', .055);
      }

      for (i = 0; i < 18; i += 1) {
        var progress = i / 17;
        var signal = (Math.sin(time * .003 + i * 1.8) + 1) * .5;
        var x = width * .49 + progress * width * .48;
        var bar = 9 + signal * height * .11;
        context.globalAlpha = .48;
        context.fillStyle = i % 5 === 0 ? '#ff5c99' : (i % 2 === 0 ? '#d8ff4b' : '#79ddff');
        context.fillRect(x, horizon - bar, Math.max(2, width * .0019), bar);
      }

      context.globalAlpha = 1;
      if (!reduceMotion) frame = window.requestAnimationFrame(draw);
    }

    new ResizeObserver(fitCanvas).observe(canvas);
    fitCanvas();
    draw(0);
    if (!reduceMotion) frame = window.requestAnimationFrame(draw);
    window.addEventListener('pagehide', function () {
      if (frame) window.cancelAnimationFrame(frame);
    }, { once: true });
  }

  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .16 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateProductScene() {
    if (!productScene) return;
    var rect = productScene.getBoundingClientRect();
    var maxScroll = Math.max(1, rect.height - window.innerHeight);
    var progress = clamp(-rect.top / maxScroll, 0, 1);
    var reveal = clamp((progress - .53) / .28, 0, 1);
    var marker = clamp((progress - .12) / .18, 0, 1);
    productScene.style.setProperty('--scroll', progress.toFixed(3));
    productScene.style.setProperty('--reveal', reveal.toFixed(3));
    productScene.style.setProperty('--timeline-scale', (1.13 - progress * .13).toFixed(3));
    productScene.style.setProperty('--timeline-scale-mobile', (1.35 - progress * .35).toFixed(3));
    productScene.style.setProperty('--head-x', (13 + progress * 69).toFixed(2) + '%');
    productScene.style.setProperty('--head-x-mobile', (8 + progress * 80).toFixed(2) + '%');
    productScene.style.setProperty('--marker-opacity', marker.toFixed(3));
    productScene.style.setProperty('--marker-scale', (.3 + marker * .7).toFixed(3));
    productScene.style.setProperty('--reveal-y', ((1 - reveal) * 55).toFixed(1) + 'px');
    productScene.style.setProperty('--icon-y', ((1 - reveal) * 30).toFixed(1) + 'px');

  }

  if (productScene) {
    var ticking = false;
    function requestProductUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateProductScene();
        ticking = false;
      });
    }
    window.addEventListener('scroll', requestProductUpdate, { passive: true });
    window.addEventListener('resize', requestProductUpdate);
    updateProductScene();
  }
}());
