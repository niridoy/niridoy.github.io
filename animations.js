// Scroll-reveal entrances + animated counting stats.
// Respects prefers-reduced-motion and degrades gracefully without
// IntersectionObserver.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- scroll reveal ----
  var revealTargets = document.querySelectorAll('.reveal');
  if (revealTargets.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach(function (el) { el.classList.add('in-view'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealTargets.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  // ---- animated counters ----
  var counters = document.querySelectorAll('[data-count]');

  if (!counters.length) {
    console.warn(
      '[animations] No elements with a data-count attribute were found. ' +
      'Each stat number needs both: <span class="n" data-count="7" data-suffix="+">0</span>. ' +
      'If your stat spans only say <span class="n">7+</span> with no data-count attribute, ' +
      'the counter has nothing to animate and will stay at its literal text.'
    );
    return;
  }

  function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }

  function animateCounter(el) {
    var raw = el.getAttribute('data-count');
    var target = parseFloat(raw);
    if (isNaN(target)) {
      console.warn('[animations] data-count on', el, 'is not a number:', raw);
      return;
    }
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1200;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value = Math.round(target * easeOutQuint(progress));
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(frame);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { counterObserver.observe(el); });
})();
