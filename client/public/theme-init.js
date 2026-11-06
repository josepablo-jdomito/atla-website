// The navbar's sun/moon toggle stores "light" or "dark" under atla-theme (SiteHeader.tsx).
// Read before the first paint so a stored choice never flashes the other theme.
(function () {
  try {
    var theme = window.localStorage.getItem("atla-theme");
    if (theme === "light" || theme === "dark") document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {
    /* storage blocked: the system preference applies */
  }
})();
