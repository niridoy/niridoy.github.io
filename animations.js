// Scroll reveals + animated statistics.
// Respects prefers-reduced-motion and progressively enhances the page.
(function () {
  'use strict';

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = motionQuery.matches;

  // ---- scroll reveal ----
  var revealTargets = document.querySelectorAll('.reveal');

  if (revealTargets.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach(function (element) {
        element.classList.add('in-view');
      });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      revealTargets.forEach(function (element) {
        revealObserver.observe(element);
      });
    }
  }

  // ---- animated counters ----
  var counters = document.querySelectorAll('[data-count]');

  if (!counters.length) return;

  function easeOutQuint(progress) {
    return 1 - Math.pow(1 - progress, 5);
  }

  function animateCounter(element) {
    var target = Number(element.getAttribute('data-count'));
    var suffix = element.getAttribute('data-suffix') || '';

    if (!Number.isFinite(target)) return;

    if (reduceMotion) {
      element.textContent = target + suffix;
      return;
    }

    var duration = 1000;
    var startTime = null;

    function frame(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }

      var progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      var value = Math.round(
        target * easeOutQuint(progress)
      );

      element.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.4,
      rootMargin: '0px 0px -20px 0px'
    }
  );

  counters.forEach(function (element) {
    counterObserver.observe(element);
  });

  // Respect changes to the user's motion preference after page load.
  function handleMotionChange(event) {
    reduceMotion = event.matches;

    if (!reduceMotion) return;

    revealTargets.forEach(function (element) {
      element.classList.add('in-view');
    });

    counters.forEach(function (element) {
      var target = Number(element.getAttribute('data-count'));
      var suffix = element.getAttribute('data-suffix') || '';

      if (Number.isFinite(target)) {
        element.textContent = target + suffix;
      }
    });
  }

  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', handleMotionChange);
  } else if (typeof motionQuery.addListener === 'function') {
    motionQuery.addListener(handleMotionChange);
  }
})();