(() => {
  "use strict";
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      menuToggle.setAttribute("aria-label", expanded ? "Abrir menú" : "Cerrar menú");
      mainNav.classList.toggle("open", !expanded);
    });
    mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      mainNav.classList.remove("open");
    }));
  }

  const tabs = [...document.querySelectorAll(".search-tab")];
  const panels = {name: document.querySelector("#panel-name"), filters: document.querySelector("#panel-filters")};
  function setMode(mode) {
    tabs.forEach(tab => {
      const selected = tab.dataset.mode === mode;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.setAttribute("tabindex", selected ? "0" : "-1");
    });
    Object.entries(panels).forEach(([key, panel]) => { if (panel) panel.hidden = key !== mode; });
    document.querySelectorAll(".search-feedback").forEach(node => { node.textContent = ""; });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setMode(tab.dataset.mode));
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const next = (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      setMode(tabs[next].dataset.mode);
    });
  });

  const nameForm = document.querySelector("#name-search-form");
  const nameInput = document.querySelector("#recipe-query");
  const nameFeedback = document.querySelector("#name-search-feedback");
  if (nameForm && nameInput && nameFeedback) nameForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!nameInput.value.trim()) {
      nameFeedback.textContent = "Escribí el nombre de la receta que querés encontrar.";
      nameInput.focus();
      return;
    }
    nameFeedback.textContent = "La búsqueda por nombre está preparada. Los resultados se conectarán cuando definamos el catálogo de recetas.";
  });

  const filterForm = document.querySelector("#filter-search-form");
  const filterFeedback = document.querySelector("#filter-search-feedback");
  if (filterForm && filterFeedback) filterForm.addEventListener("submit", event => {
    event.preventDefault();
    filterFeedback.textContent = "La interfaz de filtros está preparada. Definiremos su lógica progresivamente; todavía no hay recetas cargadas.";
  });

  document.querySelectorAll("[data-cuisine]").forEach(card => card.addEventListener("click", () => {
    setMode("filters");
    const feedback = document.querySelector("#filter-search-feedback");
    const label = card.querySelector(".cuisine-label")?.textContent.trim();
    if (feedback && label) feedback.textContent = "Categoría seleccionada: " + label + ". La selección se conectará al catálogo en una siguiente etapa.";
  }));
  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();