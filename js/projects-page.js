(function () {
  const grid = document.getElementById("projects-grid");
  const template = document.getElementById("project-card-template");
  const buttons = document.querySelectorAll(".filter-button");

  if (!grid || !template || !Array.isArray(window.PROJECTS)) return;

  function renderProjects(filter) {
    grid.innerHTML = "";
    const projects = window.PROJECTS.filter((project) => {
      return filter === "All" || project.category === filter;
    });

    projects.forEach((project) => {
      const node = template.content.cloneNode(true);
      const card = node.querySelector(".project-card");
      const label = node.querySelector(".project-label");
      const title = node.querySelector(".project-title");
      const description = node.querySelector(".project-description");
      const tags = node.querySelector(".project-tags");
      const link = node.querySelector(".project-link");

      card.dataset.category = project.category;
      if (project.status === "coming-soon") {
        card.classList.add("is-coming-soon");
      }

      label.textContent = project.category;
      title.textContent = project.title;
      description.textContent = project.description;

      tags.innerHTML = "";
      project.tags.forEach((tag) => {
        const tagEl = document.createElement("span");
        tagEl.className = "project-tag";
        tagEl.textContent = tag;
        tags.appendChild(tagEl);
      });

      link.href = project.href;
      link.textContent = project.status === "coming-soon" ? "Coming Soon" : "View Project";

      grid.appendChild(node);
    });
  }

  function setActiveFilter(filter) {
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === filter);
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "All";
      renderProjects(filter);
      setActiveFilter(filter);
    });
  });

  renderProjects("All");
  setActiveFilter("All");
})();
