// Theme toggle with system-preference support and accessible state.
(function () {
  'use strict';

  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  var root = document.documentElement;
  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getSystemTheme() {
    return mediaQuery.matches ? 'dark' : 'light';
  }

  function getCurrentTheme() {
    var theme = root.getAttribute('data-theme');

    if (theme === 'light' || theme === 'dark') {
      return theme;
    }

    return getSystemTheme();
  }

  function updateButton(theme) {
    var isDark = theme === 'dark';

    btn.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );

    btn.setAttribute('aria-pressed', String(isDark));
  }

  function setTheme(theme, persist) {
    if (theme !== 'light' && theme !== 'dark') return;

    root.setAttribute('data-theme', theme);
    updateButton(theme);

    if (persist) {
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        // Storage may be unavailable in private/restricted environments.
      }
    }
  }

  updateButton(getCurrentTheme());

  btn.addEventListener('click', function () {
    var nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, true);
  });

  // If the visitor has not manually selected a theme, follow
  // future operating-system theme changes automatically.
  function handleSystemThemeChange() {
    var explicitTheme = root.getAttribute('data-theme');

    if (explicitTheme !== 'light' && explicitTheme !== 'dark') {
      updateButton(getSystemTheme());
    }
  }

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(handleSystemThemeChange);
  }
})();