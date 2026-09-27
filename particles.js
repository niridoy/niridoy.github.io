// Lightweight particle-network background for the hero.
// Pure canvas, no external library. Skips animation entirely under
// prefers-reduced-motion, and pauses while off-screen / tab hidden.
(function () {
  function init() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas || !canvas.getContext) {
      console.warn('[particles] #particles-canvas not found — check the id on your <canvas> matches this script.');
      return;
    }

    var header = canvas.closest('header');
    if (!header) {
      console.warn('[particles] canvas is not inside a <header> element.');
      return;
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var width = 0, height = 0, dpr = 1;
    var running = false;
    var rafId = null;

    var DENSITY = 9000;
    var MAX_PARTICLES = 70;
    var MIN_PARTICLES = 24;
    var LINK_DIST = 130;
    var SPEED = 0.18;

    function getTealRGB() {
      var v = getComputedStyle(document.documentElement).getPropertyValue('--teal').trim();
      var hex = v.replace('#', '');
      if (hex.length !== 6) return '14,124,107';
      return parseInt(hex.substring(0, 2), 16) + ',' +
             parseInt(hex.substring(2, 4), 16) + ',' +
             parseInt(hex.substring(4, 6), 16);
    }

    function seedParticles() {
      var area = Math.max(width * height, 1);
      var count = Math.max(MIN_PARTICLES, Math.min(MAX_PARTICLES, Math.round(area / DENSITY)));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * SPEED,
          vy: (Math.random() - 0.5) * SPEED,
          r: 1 + Math.random() * 1.4
        });
      }
    }

    function resize() {
      var rect = header.getBoundingClientRect();
      // Fallback if the header hasn't been laid out yet (rect can be 0x0
      // momentarily on first paint) — use viewport width and a sane default.
      width = rect.width > 0 ? rect.width : window.innerWidth;
      height = rect.height > 0 ? rect.height : 320;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      seedParticles();
    }

    function step() {
      var rgb = getTealRGB();
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      }

      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            var alpha = (1 - dist / LINK_DIST) * 0.35;
            ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      for (var j = 0; j < particles.length; j++) {
        var pt = particles[j];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rgb + ',0.55)';
        ctx.fill();
      }

      if (running) rafId = requestAnimationFrame(step);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      rafId = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    resize();

    if (reduceMotion) {
      step(); // single static frame
      return;
    }

    start();

    // Re-measure whenever the header itself changes size (font swap,
    // window resize, content reflow) — more reliable than a plain
    // window 'resize' listener alone.
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { resize(); }).observe(header);
    } else {
      window.addEventListener('resize', resize);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) start(); else stop();
        });
      }, { threshold: 0 }).observe(canvas);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
  }

  // Wait for full load (fonts, stylesheets, layout) so the header has
  // its real, final size before we measure it — this is the #1 reason
  // a canvas ends up sized 0x0 and appears to "not work".
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
