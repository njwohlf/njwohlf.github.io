// Small, synchronous startup: resolve appearance before content paints.
// Storage is optional. Invalid or unavailable preferences never block the site.
(() => {
  const memory = new Map();
  const preferences = {
    get(key) {
      if (memory.has(key)) return memory.get(key);
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      memory.set(key, value);
      try {
        localStorage.setItem(key, value);
      } catch {
        /* Private/restricted storage. */
      }
    },
  };
  const system = matchMedia("(prefers-color-scheme: dark)");
  let theme = preferences.get("selectedTheme");
  if (!["light", "dark"].includes(theme)) theme = null;
  let color = preferences.get("selectedColor") || "color-3";
  // Preserve the previous site's paired light/dark accent choices.
  color = { "color-7": "color-3", "color-8": "color-6" }[color] || color;
  if (!/^color-[1-6]$/.test(color)) color = "color-3";

  function apply() {
    const resolvedTheme = theme || (system.matches ? "dark" : "light");
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.color = color;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        resolvedTheme === "dark" ? "#141d21" : "#f7f7f2",
      );
    document
      .querySelectorAll("[data-theme-choice]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.themeChoice === resolvedTheme),
        ),
      );
    document.querySelectorAll("[data-color]").forEach((button) => {
      if (button.matches("button"))
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.color === color),
        );
    });
  }

  window.SitePreferences = {
    ...preferences,
    apply,
    setTheme(value) {
      if (!["light", "dark"].includes(value)) return;
      theme = value;
      preferences.set("selectedTheme", theme);
      apply();
    },
    setColor(value) {
      if (!/^color-[1-6]$/.test(value)) return;
      color = value;
      preferences.set("selectedColor", color);
      apply();
    },
  };
  system.addEventListener("change", () => {
    if (!theme) apply();
  });
  apply();
})();
