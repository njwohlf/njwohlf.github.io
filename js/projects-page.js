// Filter existing HTML rather than rebuilding content or duplicating card markup.
(() => {
  const grid = document.getElementById("projects-grid");
  const controls = document.querySelector(".project-controls");
  if (!grid || !controls) return;
  const projects = Array.from(grid.querySelectorAll(".project-card")).map(
    (element) => ({
      element,
      category: element.dataset.category,
    }),
  );
  const count = document.getElementById("project-count");
  const filters = controls.querySelectorAll("[data-filter]");
  const views = controls.querySelectorAll("[data-view]");
  const savedView = window.SitePreferences?.get("projectsView");
  let view = savedView === "list" ? "list" : "grid";
  let category = "All";

  function render() {
    let visible = 0;
    projects.forEach((project) => {
      const matches = category === "All" || project.category === category;
      project.element.hidden = !matches;
      if (matches) visible++;
    });
    grid.dataset.view = view;
    filters.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === category),
      ),
    );
    views.forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.view === view)),
    );
    count.textContent = `${visible} ${visible === 1 ? "project" : "projects"}${category === "All" ? "" : ` · ${category}`}`;
  }

  controls.hidden = false;
  controls.addEventListener("click", (event) => {
    const filter = event.target.closest("[data-filter]");
    const layout = event.target.closest("[data-view]");
    if (filter) category = filter.dataset.filter;
    if (layout) {
      view = layout.dataset.view;
      window.SitePreferences?.set("projectsView", view);
    }
    if (filter || layout) render();
  });
  render();
})();
