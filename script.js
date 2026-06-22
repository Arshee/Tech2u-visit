// ============================================
// TECH2U — Interactions
// ============================================

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Reusable 3D tilt-on-pointer stage ----------
  function setupTiltStage(stageEl, wrapEl, options) {
    if (!stageEl || !wrapEl || prefersReducedMotion) return;

    var maxTilt = options && options.maxTilt !== undefined ? options.maxTilt : 9;
    var maxShift = options && options.maxShift !== undefined ? options.maxShift : 10;
    var ease = options && options.ease !== undefined ? options.ease : 0.06;
    var trackWindow = options && options.trackWindow === true;

    var targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    var hovering = !trackWindow; // window-tracked stages are always "live"

    function updateFromPointer(clientX, clientY) {
      var rect = stageEl.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var relX = (clientX - cx) / (rect.width / 2);
      var relY = (clientY - cy) / (rect.height / 2);
      targetX = Math.max(-1, Math.min(1, relX));
      targetY = Math.max(-1, Math.min(1, relY));
    }

    if (trackWindow) {
      window.addEventListener('mousemove', function (e) {
        updateFromPointer(e.clientX, e.clientY);
      });
      window.addEventListener('mouseleave', function () {
        targetX = 0;
        targetY = 0;
      });
    } else {
      stageEl.addEventListener('mousemove', function (e) {
        updateFromPointer(e.clientX, e.clientY);
      });
      stageEl.addEventListener('mouseleave', function () {
        targetX = 0;
        targetY = 0;
      });
    }

    function animate() {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      var rotateY = currentX * maxTilt;
      var rotateX = -currentY * maxTilt * 0.6;
      var shiftX = currentX * maxShift;

      wrapEl.style.transform =
        'translateX(' + shiftX.toFixed(2) + 'px) ' +
        'rotateY(' + rotateY.toFixed(2) + 'deg) ' +
        'rotateX(' + rotateX.toFixed(2) + 'deg)';

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // Hero robot — tracks the whole window for a "looking at you" feel
  setupTiltStage(
    document.getElementById('robotStage'),
    document.getElementById('robotImgWrap'),
    { maxTilt: 9, maxShift: 10, ease: 0.06, trackWindow: true }
  );

  // Note: the BassMarker coin has its own pointer-driven rotation,
  // handled inside bassmarker-coin.js (Three.js scene).

  // ---------- Scroll reveal ----------
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
