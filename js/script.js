// Enhance complete, navigable HTML. Each feature can initialize independently.
(() => {
  const menu = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("primary-navigation");
  const appearance = document.querySelector(".appearance");
  const mobile = matchMedia("(max-width: 900px)");

  function setMenu(open, restoreFocus = false) {
    menu?.setAttribute("aria-expanded", String(open));
    if (navigation) navigation.hidden = mobile.matches && !open;
    if (restoreFocus) menu?.focus();
  }

  if (menu && navigation) {
    menu.hidden = false;
    setMenu(false);
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      setMenu(open);
      if (open && appearance) appearance.open = false;
    });
    mobile.addEventListener("change", () => {
      const focusWasInside = navigation.contains(document.activeElement);
      setMenu(false, mobile.matches && focusWasInside);
      if (!mobile.matches && document.activeElement === menu)
        navigation.querySelector("a")?.focus();
    });
  }

  if (appearance && window.SitePreferences) {
    appearance.hidden = false;
    SitePreferences.apply();
    appearance.addEventListener("click", (event) => {
      const theme = event.target.closest("[data-theme-choice]");
      const color = event.target.closest("button[data-color]");
      if (theme) SitePreferences.setTheme(theme.dataset.themeChoice);
      if (color) SitePreferences.setColor(color.dataset.color);
    });
    appearance.addEventListener("toggle", () => {
      if (appearance.open && mobile.matches) setMenu(false);
    });
    document.addEventListener("click", (event) => {
      if (!appearance.contains(event.target)) appearance.open = false;
    });
    appearance.addEventListener("focusout", (event) => {
      if (event.relatedTarget && !appearance.contains(event.relatedTarget))
        appearance.open = false;
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (appearance?.open) {
      appearance.open = false;
      appearance.querySelector("summary").focus();
    } else if (
      mobile.matches &&
      menu?.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false, true);
    }
  });

  const form = document.getElementById("contact-form");
  if (!form || !window.fetch) return;
  const submit = form.querySelector('button[type="submit"]');
  const status = document.getElementById("form-status");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submit.disabled || !form.reportValidity()) return;
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.textContent = "Sending your message…";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Submission rejected");
      status.textContent =
        "Thank you—your message has been sent. I’ll reply by email.";
      form.reset();
    } catch {
      status.textContent =
        "Your message could not be confirmed. Your text is still here. Please try again, or contact me on LinkedIn.";
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
      form.removeAttribute("aria-busy");
      status.focus();
    }
  });
})();
