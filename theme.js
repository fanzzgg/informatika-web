(function () {
  const KEY = 'informatika-theme';
  const saved = localStorage.getItem(KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  window.setTheme = function (t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(KEY, t);
  };

  window.renderThemeSwitcher = function () {
    const el = document.querySelector('.theme-switch');
    if (!el) return;
    el.innerHTML = ['light', 'dark', 'ocean', 'forest', 'sunset', 'cyber']
      .map(t => `<div class="theme-dot" data-t="${t}" title="${t}" onclick="setTheme('${t}')"></div>`)
      .join('');
  };

  document.addEventListener('DOMContentLoaded', renderThemeSwitcher);
})();