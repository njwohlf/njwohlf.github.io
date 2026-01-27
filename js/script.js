const DEFAULT_THEME = "dark";
const DEFAULT_COLOR = "color-3";

function normalizeColorForTheme(color, theme) {
  if (theme === "light") {
    if (color === "color-3") return "color-7";
    if (color === "color-6") return "color-8";
  } else {
    if (color === "color-7") return "color-3";
    if (color === "color-8") return "color-6";
  }
  return color;
}

function updateButtonTextColor(color) {
  const lightTextColors = new Set(["color-1", "color-4", "color-7"]);
  const textColor = lightTextColors.has(color) ? "#ffffff" : "#111111";
  document.documentElement.style.setProperty("--button-text-color", textColor);
}

/**
 * Sets the active color theme.
 * @param {string} color - the color theme name (matches the CSS file title attribute)
 */
function setActiveStyle(color) {
  document.documentElement.style.removeProperty("--skin-color");
  const theme = localStorage.getItem("selectedTheme") || DEFAULT_THEME;
  const normalizedColor = normalizeColorForTheme(color, theme);
  const alternateStyles = document.querySelectorAll(".alternate-style");

  if (alternateStyles.length) {
    alternateStyles.forEach((style) => {
      if (normalizedColor === style.getAttribute("title")) {
        style.removeAttribute("disabled");
      } else {
        style.setAttribute("disabled", "true");
      }
    });
  }

  // Update star colors if they exist
  const skinColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--skin-color")
    .trim();
  if (skinColor) {
    document.querySelectorAll(".star").forEach((star) => {
      star.style.color = skinColor;
    });
  }

  localStorage.setItem("selectedColor", normalizedColor);
  updateButtonTextColor(normalizedColor);
}

function updateThemeToggleButtons(theme) {
  const lightBtn = document.getElementById("light-mode-toggle");
  const darkBtn = document.getElementById("dark-mode-toggle");
  if (!lightBtn || !darkBtn) return;

  if (theme === "light") {
    lightBtn.classList.add("active");
    darkBtn.classList.remove("active");
  } else {
    darkBtn.classList.add("active");
    lightBtn.classList.remove("active");
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  const isLight = theme === "light";
  const themeLinks = document.querySelectorAll(".alternate-theme");

  root.dataset.theme = theme;
  root.style.setProperty("--page-bg", isLight ? "#F5F5F5" : "#1E1E1E");
  root.style.setProperty("--panel-bg", isLight ? "#DCDCDC" : "#2C2C2C");
  root.style.setProperty("--panel-bg-alt", isLight ? "#E9E9E9" : "#333");
  root.style.setProperty("--text-color", isLight ? "#000000" : "#ffffff");
  root.style.setProperty("--muted-text", isLight ? "#555" : "#aaa");
  root.style.setProperty("--border-color", isLight ? "#ccc" : "#444");
  root.style.setProperty("--heading-color", isLight ? "#555" : "#aaa");
  root.style.setProperty("--dropdown-bg", isLight ? "#F5F5F5" : "#333");
  root.style.setProperty("--color-picker-text", isLight ? "#000" : "#fff");
  root.style.setProperty("--tag-bg", isLight ? "#e9e9e9" : "#333");
  root.style.setProperty("--input-bg", isLight ? "#ffffff" : "#1E1E1E");
  root.style.setProperty("--input-text", isLight ? "#000000" : "#ffffff");
  root.style.setProperty("--timeline-border-color", isLight ? "#e9e9e9" : "#1E1E1E");

  themeLinks.forEach((link) => {
    if (link.getAttribute("title") === theme) {
      link.removeAttribute("disabled");
    } else {
      link.setAttribute("disabled", "true");
    }
  });

  const color3 = isLight ? "#c902c9ff" : "#FFC107";
  const color6 = isLight ? "#008080" : "#00ff33";
  root.style.setProperty("--skin-color-3", color3);
  root.style.setProperty("--skin-color-6", color6);

  const color3Swatch = document.querySelector(".color-3");
  const color6Swatch = document.querySelector(".color-6");
  if (color3Swatch) color3Swatch.style.color = color3;
  if (color6Swatch) color6Swatch.style.color = color6;

  localStorage.setItem("selectedTheme", theme);
  updateThemeToggleButtons(theme);
}

function applySavedPreferences() {
  const savedTheme = localStorage.getItem("selectedTheme") || DEFAULT_THEME;
  const savedColor = localStorage.getItem("selectedColor") || DEFAULT_COLOR;
  applyTheme(savedTheme);
  setActiveStyle(savedColor);
}

function watchForNavbar() {
  if (document.getElementById("navbar")) return;
  const container = document.getElementById("navbar-container");
  if (!container) return;

  const observer = new MutationObserver(() => {
    if (document.getElementById("navbar")) {
      observer.disconnect();
      applySavedPreferences();
    }
  });

  observer.observe(container, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", () => {
  applySavedPreferences();
  watchForNavbar();
});

const navbarContainer = document.getElementById("navbar-container");
if (navbarContainer) {
  navbarContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.id === "light-mode-toggle") {
      applyTheme("light");
      setActiveStyle(localStorage.getItem("selectedColor") || DEFAULT_COLOR);
    }
    if (button.id === "dark-mode-toggle") {
      applyTheme("dark");
      setActiveStyle(localStorage.getItem("selectedColor") || DEFAULT_COLOR);
    }
  });
}
