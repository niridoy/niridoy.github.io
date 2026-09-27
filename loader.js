// Shows the robot loader until the page is fully loaded (fonts, images,
// the works), with a small minimum display time so it never just flashes.
(function () {
  var loader = document.getElementById('page-loader');
  if (!loader) return;

  var MIN_VISIBLE_MS = 500;
  var shownAt = Date.now();

  function hideLoader() {
    var elapsed = Date.now() - shownAt;
    var wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    setTimeout(function () {
      loader.classList.add('is-hidden');
      loader.setAttribute('aria-hidden', 'true');
      // Remove from the DOM after the fade so it can't block clicks
      // or be found by screen readers/tab order.
      loader.addEventListener('transitionend', function remove() {
        loader.removeEventListener('transitionend', remove);
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      });
      // Fallback in case transitionend doesn't fire (e.g. reduced motion).
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 600);
    }, wait);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  // Safety net: never let the loader stay up for more than 4s even if
  // something (a slow font or asset) never fires 'load'.
  setTimeout(hideLoader, 4000);
})();
