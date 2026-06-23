(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var robotStage = document.getElementById('robotStage');
  var heroCanvas = document.getElementById('heroCanvas');
  var bassmarker = document.querySelector('[data-bassmarker]');

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

    function line(x1, y1, x2, y2, color, opacity) {
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

      var horizon = height * .67;
      var originX = width * .71;
      var travel = (time * .000055) % 1;
      var i;

      for (i = 0; i < 15; i += 1) {
        var depth = (i + travel) / 15;
        var y = horizon + Math.pow(depth, 2.1) * (height - horizon);
        line(width * .26, y, width * 1.02, y, '#756deb', .025 + depth * .09);
      }

      for (i = -10; i < 14; i += 1) {
        var baseX = originX + i * width * .08;
        line(originX, height * .31, baseX, height * 1.04, i % 3 ? '#68a9e9' : '#d3a759', .055);
      }

      for (i = 0; i < 17; i += 1) {
        var signal = (Math.sin(time * .003 + i * 1.55) + 1) * .5;
        var x = width * .5 + (i / 16) * width * .47;
        var barHeight = 10 + signal * height * .105;
        context.globalAlpha = .46;
        context.fillStyle = i % 5 === 0 ? '#d3a759' : (i % 2 === 0 ? '#756deb' : '#68a9e9');
        context.fillRect(x, horizon - barHeight, Math.max(2, width * .0018), barHeight);
      }

      context.globalAlpha = 1;
      if (!reduceMotion) canvasFrame = window.requestAnimationFrame(draw);
    }

    new ResizeObserver(fitCanvas).observe(heroCanvas);
    fitCanvas();
    draw(0);
    if (!reduceMotion) canvasFrame = window.requestAnimationFrame(draw);
    window.addEventListener('pagehide', function () {
      if (canvasFrame) window.cancelAnimationFrame(canvasFrame);
    }, { once: true });
  }

  var revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .15 });
    revealElements.forEach(function (element) { observer.observe(element); });
  } else {
    revealElements.forEach(function (element) { element.classList.add('is-visible'); });
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function updateBassmarker() {
    if (!bassmarker) return;
    var rect = bassmarker.getBoundingClientRect();
    var scrollRange = Math.max(1, rect.height - window.innerHeight);
    var progress = clamp(-rect.top / scrollRange, 0, 1);
    var markers = clamp((progress - .1) / .2, 0, 1);
    var product = clamp((progress - .53) / .28, 0, 1);

    bassmarker.style.setProperty('--timeline-scale', (1.12 - progress * .12).toFixed(3));
    bassmarker.style.setProperty('--timeline-scale-mobile', (1.43 - progress * .43).toFixed(3));
    bassmarker.style.setProperty('--markers-opacity', markers.toFixed(3));
    bassmarker.style.setProperty('--marker-drop', (-26 + markers * 26).toFixed(1) + 'px');
    bassmarker.style.setProperty('--playhead-x', (4 + progress * 91).toFixed(2) + '%');
    bassmarker.style.setProperty('--product-opacity', product.toFixed(3));
    bassmarker.style.setProperty('--product-y', ((1 - product) * 54).toFixed(1) + 'px');
    bassmarker.style.setProperty('--icon-y', ((1 - product) * 34).toFixed(1) + 'px');
    bassmarker.style.setProperty('--hint-opacity', (1 - clamp(product * 1.6, 0, 1)).toFixed(3));
  }

  if (bassmarker) {
    var ticking = false;
    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateBassmarker();
        ticking = false;
      });
    }
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    updateBassmarker();
  }
}());
