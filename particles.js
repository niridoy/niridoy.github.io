(function () {
  'use strict';

  function initParticles() {
    var canvas = document.getElementById('particles-canvas');

    if (!canvas || !canvas.getContext) {
      return;
    }

    var ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    var motionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    var particles = [];

    var width = 0;
    var height = 0;
    var dpr = 1;

    var animationFrame = 0;
    var running = false;

    var PARTICLE_DENSITY = 8500;
    var MIN_PARTICLES = 28;
    var MAX_PARTICLES = 90;

    var CONNECTION_DISTANCE = 135;
    var CONNECTION_DISTANCE_SQUARED =
      CONNECTION_DISTANCE * CONNECTION_DISTANCE;

    var SPEED = 0.18;

    var tealRGB = '14,124,107';

    /* ---------------------------------------------
       Theme color
    --------------------------------------------- */

    function updateColor() {
      var color = getComputedStyle(
        document.documentElement
      )
        .getPropertyValue('--teal')
        .trim()
        .replace('#', '');

      if (/^[0-9a-fA-F]{6}$/.test(color)) {
        tealRGB =
          parseInt(color.substring(0, 2), 16) + ',' +
          parseInt(color.substring(2, 4), 16) + ',' +
          parseInt(color.substring(4, 6), 16);
      }
    }

    /* ---------------------------------------------
       Canvas size
    --------------------------------------------- */

    function resizeCanvas() {
      width = Math.max(
        1,
        Math.round(window.innerWidth)
      );

      height = Math.max(
        1,
        Math.round(window.innerHeight)
      );

      dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      updateColor();
      createParticles();
    }

    /* ---------------------------------------------
       Create particles
    --------------------------------------------- */

    function createParticles() {
      var area = Math.max(
        width * height,
        1
      );

      var count = Math.round(
        area / PARTICLE_DENSITY
      );

      count = Math.max(
        MIN_PARTICLES,
        Math.min(
          MAX_PARTICLES,
          count
        )
      );

      particles = [];

      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,

          vx:
            (Math.random() - 0.5) *
            SPEED,

          vy:
            (Math.random() - 0.5) *
            SPEED,

          radius:
            0.8 +
            Math.random() * 1.4
        });
      }
    }

    /* ---------------------------------------------
       Update particle positions
    --------------------------------------------- */

    function updateParticles() {
      for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0) {
          particle.x = 0;
          particle.vx =
            Math.abs(particle.vx);
        }

        if (particle.x >= width) {
          particle.x = width;
          particle.vx =
            -Math.abs(particle.vx);
        }

        if (particle.y <= 0) {
          particle.y = 0;
          particle.vy =
            Math.abs(particle.vy);
        }

        if (particle.y >= height) {
          particle.y = height;
          particle.vy =
            -Math.abs(particle.vy);
        }
      }
    }

    /* ---------------------------------------------
       Draw connecting lines
    --------------------------------------------- */

    function drawConnections() {
      ctx.lineWidth = 1;

      for (
        var i = 0;
        i < particles.length;
        i++
      ) {
        var first = particles[i];

        for (
          var j = i + 1;
          j < particles.length;
          j++
        ) {
          var second = particles[j];

          var dx =
            first.x -
            second.x;

          var dy =
            first.y -
            second.y;

          var distanceSquared =
            dx * dx +
            dy * dy;

          if (
            distanceSquared >
            CONNECTION_DISTANCE_SQUARED
          ) {
            continue;
          }

          var distance =
            Math.sqrt(
              distanceSquared
            );

          var opacity =
            (
              1 -
              distance /
              CONNECTION_DISTANCE
            ) * 0.28;

          ctx.strokeStyle =
            'rgba(' +
            tealRGB +
            ',' +
            opacity +
            ')';

          ctx.beginPath();

          ctx.moveTo(
            first.x,
            first.y
          );

          ctx.lineTo(
            second.x,
            second.y
          );

          ctx.stroke();
        }
      }
    }

    /* ---------------------------------------------
       Draw particles
    --------------------------------------------- */

    function drawParticles() {
      ctx.fillStyle =
        'rgba(' +
        tealRGB +
        ',0.55)';

      for (
        var i = 0;
        i < particles.length;
        i++
      ) {
        var particle =
          particles[i];

        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }
    }

    /* ---------------------------------------------
       Draw frame
    --------------------------------------------- */

    function draw() {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      drawConnections();
      drawParticles();
    }

    /* ---------------------------------------------
       Animation
    --------------------------------------------- */

    function animate() {
      if (!running) {
        return;
      }

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      updateParticles();
      drawConnections();
      drawParticles();

      animationFrame =
        requestAnimationFrame(
          animate
        );
    }

    function start() {
      if (
        running ||
        motionQuery.matches ||
        document.hidden
      ) {
        return;
      }

      running = true;

      animationFrame =
        requestAnimationFrame(
          animate
        );
    }

    function stop() {
      if (!running) {
        return;
      }

      running = false;

      if (animationFrame) {
        cancelAnimationFrame(
          animationFrame
        );

        animationFrame = 0;
      }
    }

    /* ---------------------------------------------
       Initial setup
    --------------------------------------------- */

    resizeCanvas();

    if (motionQuery.matches) {
      draw();
      return;
    }

    start();

    /* ---------------------------------------------
       Resize
    --------------------------------------------- */

    window.addEventListener(
      'resize',
      function () {
        resizeCanvas();

        if (motionQuery.matches) {
          draw();
        }
      },
      {
        passive: true
      }
    );

    /* ---------------------------------------------
       Pause when browser tab is hidden
    --------------------------------------------- */

    document.addEventListener(
      'visibilitychange',
      function () {
        if (document.hidden) {
          stop();
        } else {
          start();
        }
      }
    );

    /* ---------------------------------------------
       Reduced motion changes
    --------------------------------------------- */

    function handleMotionChange(event) {
      if (event.matches) {
        stop();
        draw();
      } else {
        start();
      }
    }

    if (
      typeof motionQuery.addEventListener ===
      'function'
    ) {
      motionQuery.addEventListener(
        'change',
        handleMotionChange
      );
    } else if (
      typeof motionQuery.addListener ===
      'function'
    ) {
      motionQuery.addListener(
        handleMotionChange
      );
    }
  }

  if (
    document.readyState ===
    'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      initParticles,
      {
        once: true
      }
    );
  } else {
    initParticles();
  }

})();