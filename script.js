// ============================================
// TECH2U — Interactions
// ============================================

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Robot parallax (head-tracking feel) ----------
  if (!prefersReducedMotion) {
    var stage = document.getElementById('robotStage');
    var robotWrap = document.getElementById('robotImgWrap');

    if (stage && robotWrap) {
      var targetX = 0, targetY = 0, currentX = 0, currentY = 0;
      var maxTilt = 9; // degrees
      var maxShift = 10; // px

      function onPointerMove(clientX, clientY) {
        var rect = stage.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var relX = (clientX - cx) / (rect.width / 2);
        var relY = (clientY - cy) / (rect.height / 2);
        relX = Math.max(-1, Math.min(1, relX));
        relY = Math.max(-1, Math.min(1, relY));
        targetX = relX;
        targetY = relY;
      }

      window.addEventListener('mousemove', function (e) {
        onPointerMove(e.clientX, e.clientY);
      });

      window.addEventListener('mouseleave', function () {
        targetX = 0;
        targetY = 0;
      });

      function animate() {
        // ease toward target
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;

        var rotateY = currentX * maxTilt;
        var rotateX = -currentY * maxTilt * 0.6;
        var shiftX = currentX * maxShift;

        robotWrap.style.transform =
          'translateX(' + shiftX.toFixed(2) + 'px) ' +
          'rotateY(' + rotateY.toFixed(2) + 'deg) ' +
          'rotateX(' + rotateX.toFixed(2) + 'deg)';

        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
  }

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
