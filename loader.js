// Legacy page-loader controller.
// The optimized HTML no longer includes #page-loader, so this script
// can safely remain temporarily but is no longer required.
//
// Recommended: remove loader.js entirely and remove its <script> tag
// from the HTML to avoid an unnecessary network request.
(function () {
  'use strict';

  var loader = document.getElementById('page-loader');

  if (!loader) return;

  var hidden = false;
  var hideTimer = 0;
  var fallbackTimer = 0;

  function removeLoader() {
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }

  function hideLoader() {
    if (hidden) return;
    hidden = true;

    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    loader.classList.add('is-hidden');
    loader.setAttribute('aria-hidden', 'true');

    if (typeof loader.addEventListener === 'function') {
      loader.addEventListener('transitionend', removeLoader, {
        once: true
      });
    }

    // Fallback for browsers or reduced-motion settings where
    // transitionend may not fire.
    hideTimer = setTimeout(removeLoader, 600);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }

  // Never leave a legacy loader visible indefinitely.
  fallbackTimer = setTimeout(hideLoader, 4000);

  // Prevent unused timer warnings in environments that inspect
  // references after the loader has already been removed.
  void fallbackTimer;
})();