(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var robotStage = document.getElementById('robotStage');
  var heroCanvas = document.getElementById('heroCanvas');
  var bassmarkerScene = document.querySelector('[data-bassmarker]');

  if (robotStage && !reduceMotion) {
    robotStage.addEventListener('pointermove', function (event) {
      var rect = robotStage.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - .5;
      var y = (event.clientY - rect.top) / rect.height - .5;
      robotStage.style.setProperty('--robot-x', (x * 15).toFixed(1) + 'px');
      robotStage.style.setProperty('--robot-y', (y * 10).toFixed(1) + 'px');
      robotStage.style.setProperty('--robot-rx', (x * 6).toFixed(1) + 'deg');
    });
    robotStage.addEventListener('pointerleave', function () {
      robotStage.style.removeProperty('--robot-x');
      robotStage.style.removeProperty('--robot-y');
      robotStage.style.removeProperty('--robot-rx');
    });
  }

  if (heroCanvas) {
    var context = heroCanvas.getContext('2d');
    var width = 0;
    var height = 0;
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var canvasFrame;

    function fitCanvas() {
      width = heroCanvas.clientWidth;
      height = heroCanvas.clientHeight;
      heroCanvas.width = Math.max(1, Math.round(width * ratio));
      heroCanvas.height = Math.max(1, Math.round(height * ratio));
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

    function drawHero(time) {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;

      var horizon = height * .67;
      var originX = width * .71;
      var travel = (time * .000055) % 1;
      var i;

      for (i = 0; i < 15; i += 1) {
        var depth = (i + travel) / 15;
        var y = horizon + Math.pow(depth, 2.1) * (height - horizon);
        drawLine(width * .26, y, width * 1.02, y, '#8179ff', .025 + depth * .09);
      }

      for (i = -10; i < 14; i += 1) {
        var baseX = originX + i * width * .08;
        drawLine(originX, height * .31, baseX, height * 1.04, i % 3 ? '#6db5f7' : '#d8ae63', .055);
      }

      for (i = 0; i < 17; i += 1) {
        var position = i / 16;
        var signal = (Math.sin(time * .003 + i * 1.55) + 1) * .5;
        var x = width * .5 + position * width * .47;
        var barHeight = 10 + signal * height * .105;
        context.globalAlpha = .46;
        context.fillStyle = i % 5 === 0 ? '#d8ae63' : (i % 2 === 0 ? '#8179ff' : '#6db5f7');
        context.fillRect(x, horizon - barHeight, Math.max(2, width * .0018), barHeight);
      }

      context.globalAlpha = 1;
      if (!reduceMotion) canvasFrame = window.requestAnimationFrame(drawHero);
    }

    new ResizeObserver(fitCanvas).observe(heroCanvas);
    fitCanvas();
    drawHero(0);
    if (!reduceMotion) canvasFrame = window.requestAnimationFrame(drawHero);
    window.addEventListener('pagehide', function () {
      if (canvasFrame) window.cancelAnimationFrame(canvasFrame);
    }, { once: true });
  }

  var revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .14 });
    revealElements.forEach(function (element) { revealObserver.observe(element); });
  } else {
    revealElements.forEach(function (element) { element.classList.add('is-visible'); });
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateBassmarker() {
    if (!bassmarkerScene) return;

    var rect = bassmarkerScene.getBoundingClientRect();
    var maxScroll = Math.max(1, rect.height - window.innerHeight);
    var progress = clamp(-rect.top / maxScroll, 0, 1);
    var markerProgress = clamp((progress - .1) / .2, 0, 1);
    var productProgress = clamp((progress - .53) / .28, 0, 1);

    bassmarkerScene.style.setProperty('--timeline-scale', (1.12 - progress * .12).toFixed(3));
    bassmarkerScene.style.setProperty('--timeline-scale-mobile', (1.38 - progress * .38).toFixed(3));
    bassmarkerScene.style.setProperty('--markers-opacity', markerProgress.toFixed(3));
    bassmarkerScene.style.setProperty('--marker-drop', (-28 + markerProgress * 28).toFixed(1) + 'px');
    bassmarkerScene.style.setProperty('--playhead-x', (13 + progress * 71).toFixed(2) + '%');
    bassmarkerScene.style.setProperty('--product-opacity', productProgress.toFixed(3));
    bassmarkerScene.style.setProperty('--product-y', ((1 - productProgress) * 54).toFixed(1) + 'px');
    bassmarkerScene.style.setProperty('--icon-y', ((1 - productProgress) * 34).toFixed(1) + 'px');
    bassmarkerScene.style.setProperty('--hint-opacity', (1 - clamp(productProgress * 1.6, 0, 1)).toFixed(3));
  }

  if (bassmarkerScene) {
    var scrollTicking = false;
    function requestBassmarkerUpdate() {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(function () {
        updateBassmarker();
        scrollTicking = false;
      });
    }
    window.addEventListener('scroll', requestBassmarkerUpdate, { passive: true });
    window.addEventListener('resize', requestBassmarkerUpdate);
    updateBassmarker();
  }
}());
