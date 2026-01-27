(function () {
  const grid = document.getElementById("projects-grid");
  const list = document.getElementById("projects-list");
  const cardTemplate = document.getElementById("project-card-template");
  const rowTemplate = document.getElementById("project-row-template");
  const buttons = document.querySelectorAll(".filter-button");
  const viewButtons = document.querySelectorAll(".view-button");

  if (!grid || !list || !cardTemplate || !rowTemplate || !Array.isArray(window.PROJECTS)) return;

  function renderGrid(projects) {
    grid.innerHTML = "";
    projects.forEach((project) => {
      const node = cardTemplate.content.cloneNode(true);
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

  function renderList(projects) {
    const header = list.querySelector(".project-row-header");
    list.innerHTML = "";
    if (header) {
      list.appendChild(header);
    }
    projects.forEach((project) => {
      const node = rowTemplate.content.cloneNode(true);
      const title = node.querySelector(".project-row-title");
      const tags = node.querySelector(".project-row-tags");
      const label = node.querySelector(".project-row-label");

      title.href = project.href;
      title.textContent = project.title;

      tags.innerHTML = "";
      project.tags.forEach((tag) => {
        const tagEl = document.createElement("span");
        tagEl.className = "project-tag";
        tagEl.textContent = tag;
        tags.appendChild(tagEl);
      });

      label.textContent = project.category;
      list.appendChild(node);
    });
  }

  function renderProjects(filter, view) {
    const projects = window.PROJECTS.filter((project) => {
      return filter === "All" || project.category === filter;
    });

    if (view === "list") {
      grid.classList.add("is-hidden");
      list.classList.add("is-active");
      renderList(projects);
    } else {
      list.classList.remove("is-active");
      grid.classList.remove("is-hidden");
      renderGrid(projects);
    }
  }

  function setActiveFilter(filter) {
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === filter);
    });
  }

  function setActiveView(view) {
    viewButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === view);
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "All";
      const view = localStorage.getItem("projectsView") || "grid";
      renderProjects(filter, view);
      setActiveFilter(filter);
    });
  });

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view || "grid";
      const filter = document.querySelector(".filter-button.is-active")?.dataset.filter || "All";
      localStorage.setItem("projectsView", view);
      renderProjects(filter, view);
      setActiveView(view);
    });
  });

  const initialFilter = "All";
  const initialView = localStorage.getItem("projectsView") || "grid";
  renderProjects(initialFilter, initialView);
  setActiveFilter(initialFilter);
  setActiveView(initialView);
})();
