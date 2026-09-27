// Day/night mode toggle. The initial theme (if the person has picked one
// before) is already applied by the inline script in <head> to avoid a
// flash — this file just wires up the button and keeps things in sync.
(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  var root = document.documentElement;

  function systemPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function currentTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit === 'light' || explicit === 'dark') return explicit;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { }
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // Make sure the button's aria-label matches whatever theme ended up
  // active on load (system preference or a saved choice).
  btn.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

  btn.addEventListener('click', function () {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });
})();
