const products = [
  { id: 1, nombre: "Corona navideña clásica", precio: 35, categoria: "Coronas", imagen: "img/productos/corona-clasica.svg", descripcion: "Corona decorativa con tonos cálidos y detalle artesanal para la entrada del hogar.", personalizado: true, disponible: true, demo: true },
  { id: 2, nombre: "Adorno personalizado", precio: 18, categoria: "Personalizados", imagen: "img/productos/adorno-arbol.svg", descripcion: "Adorno para árbol o regalo con una propuesta personalizable en colores y textos.", personalizado: true, disponible: true, demo: true },
  { id: 3, nombre: "Centro de mesa navideño", precio: 42, categoria: "Centros de mesa", imagen: "img/productos/centro-mesa.svg", descripcion: "Composición decorativa para mesas y rincones con un aire acogedor y elegante.", personalizado: true, disponible: true, demo: true },
  { id: 4, nombre: "Adorno para árbol", precio: 15, categoria: "Adornos", imagen: "img/productos/adorno-arbol.svg", descripcion: "Adorno artesanal para completar la decoración del árbol con un diseño delicado.", personalizado: false, disponible: true, demo: true },
  { id: 5, nombre: "Caja regalo navideña", precio: 28, categoria: "Regalos", imagen: "img/productos/caja-regalo.svg", descripcion: "Caja decorativa para regalos con un enfoque navideño y artesanal.", personalizado: true, disponible: false, demo: true },
  { id: 6, nombre: "Letrero rústico", precio: 30, categoria: "Decoración", imagen: "img/productos/letrero-rustico.svg", descripcion: "Detalle decorativo con estilo rústico para espacios de casa, tiendas o eventos.", personalizado: true, disponible: true, demo: true }
];

const galleryImages = [
  { src: "img/galeria/galeria-1.svg", alt: "Detalle de una decoración festiva hecha a mano" },
  { src: "img/galeria/galeria-2.svg", alt: "Adorno artesanal con estilo navideño" },
  { src: "img/galeria/galeria-3.svg", alt: "Detalle de un centro de mesa artesanal" },
  { src: "img/galeria/galeria-4.svg", alt: "Producto decorativo hecho manualmente" },
  { src: "img/galeria/galeria-1.svg", alt: "Conjunto de detalles navideños artesanales" },
  { src: "img/galeria/galeria-2.svg", alt: "Material y trabajo artesanal durante la creación" }
];

const whatsappNumber = "[NUMERO WHATSAPP]";
const whatsappBaseUrl = `https://wa.me/${whatsappNumber}`;
const catalogState = {
  activeCategory: "Todas",
  searchQuery: "",
  sortBy: "destacados",
  availableOnly: false,
  favoritesOnly: false,
};

function createWhatsAppLink(productName) {
  const message = encodeURIComponent(`Hola, estoy interesado/a en ${productName}. ¿Podríais darme más información?`);
  return `${whatsappBaseUrl}?text=${message}`;
}

function formatPrice(price) {
  return `${price.toFixed(2).replace(".00", "")} €`;
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("mama-favoritos") || "[]");
  } catch (error) {
    return [];
  }
}

function updateFavoritesStorage(favorites) {
  localStorage.setItem("mama-favoritos", JSON.stringify(favorites));
}

function isFavorite(productId) {
  return getFavorites().includes(productId);
}

function toggleFavorite(productId) {
  const favorites = new Set(getFavorites());
  if (favorites.has(productId)) {
    favorites.delete(productId);
  } else {
    favorites.add(productId);
  }

  updateFavoritesStorage([...favorites]);
  renderProducts(catalogState.activeCategory);
  renderFavoritesList();
}

function renderFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container) return;

  const featured = products.slice(0, 3);
  container.innerHTML = featured.map((product) => `
    <article class="product-card reveal">
      <div class="product-card__image">
        <img src="${product.imagen}" alt="${product.nombre}" loading="lazy" />
      </div>
      <div class="product-card__body">
        <div class="product-card__head">
          <h3>${product.nombre}</h3>
          <span class="product-card__price">${formatPrice(product.precio)}</span>
        </div>
        <div class="product-card__meta">
          <span class="meta-pill">${product.categoria}</span>
          <span class="meta-pill ${product.personalizado ? "meta-pill--warning" : ""}">${product.personalizado ? "Personalizable" : "Estándar"}</span>
        </div>
        <p class="product-card__description">${product.descripcion}</p>
        <div class="product-card__actions">
          <a href="${createWhatsAppLink(product.nombre)}" class="btn btn--primary" target="_blank" rel="noreferrer">Pedir por WhatsApp</a>
        </div>
      </div>
    </article>
  `).join("");
}

function getFilteredProducts() {
  const query = catalogState.searchQuery.trim().toLowerCase();
  let filtered = [...products];

  if (catalogState.activeCategory !== "Todas") {
    filtered = filtered.filter((product) => product.categoria === catalogState.activeCategory);
  }

  if (query) {
    filtered = filtered.filter((product) => {
      const haystack = `${product.nombre} ${product.descripcion} ${product.categoria}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  if (catalogState.availableOnly) {
    filtered = filtered.filter((product) => product.disponible);
  }

  if (catalogState.favoritesOnly) {
    const favorites = getFavorites();
    filtered = filtered.filter((product) => favorites.includes(product.id));
  }

  if (catalogState.sortBy === "precio-asc") {
    filtered.sort((a, b) => a.precio - b.precio);
  } else if (catalogState.sortBy === "precio-desc") {
    filtered.sort((a, b) => b.precio - a.precio);
  } else if (catalogState.sortBy === "alfabetico") {
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  return filtered;
}

function renderProducts(category = "Todas") {
  const container = document.getElementById("product-grid");
  const countElement = document.getElementById("result-count");
  const emptyState = document.getElementById("no-products");
  if (!container) return;

  catalogState.activeCategory = category;
  const filteredProducts = getFilteredProducts();

  if (countElement) {
    countElement.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? "producto" : "productos"}`;
  }

  if (emptyState) {
    emptyState.hidden = filteredProducts.length > 0;
  }

  if (!filteredProducts.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = filteredProducts.map((product) => {
    const favorite = isFavorite(product.id);
    return `
      <article class="product-card reveal">
        <button type="button" class="favorite-btn ${favorite ? "is-active" : ""}" data-favorite-id="${product.id}" aria-label="${favorite ? "Quitar de favoritos" : "Añadir a favoritos"}" title="${favorite ? "Quitar de favoritos" : "Añadir a favoritos"}">
          ♥
        </button>
        <div class="product-card__image">
          <img src="${product.imagen}" alt="${product.nombre}" loading="lazy" />
        </div>
        <div class="product-card__body">
          <div class="product-card__head">
            <h3>${product.nombre}</h3>
            <span class="product-card__price">${formatPrice(product.precio)}</span>
          </div>
          <div class="product-card__meta">
            <span class="meta-pill">${product.categoria}</span>
            <span class="meta-pill ${product.personalizado ? "meta-pill--warning" : ""}">${product.personalizado ? "Personalizable" : "No personalizado"}</span>
          </div>
          <p class="product-card__description">${product.descripcion}</p>
          <div class="product-card__actions">
            <a href="${createWhatsAppLink(product.nombre)}" class="btn btn--primary" target="_blank" rel="noreferrer">Pedir por WhatsApp</a>
            <button type="button" class="btn btn--secondary btn--small" data-customize-id="${product.id}">Personalizar</button>
          </div>
          <span class="product-card__status ${product.disponible ? "product-card__status--available" : "product-card__status--unavailable"}">${product.disponible ? "Disponible" : "Próximamente"}</span>
        </div>
      </article>
    `;
  }).join("");

  setupRevealAnimations();
}

function renderFavoritesList() {
  const container = document.getElementById("favorites-list");
  if (!container) return;

  const favorites = products.filter((product) => isFavorite(product.id));
  if (!favorites.length) {
    container.innerHTML = '<p class="favorites-empty">Todavía no has marcado favoritos. Explora el catálogo y guarda tus piezas preferidas aquí.</p>';
    return;
  }

  container.innerHTML = favorites.map((product) => `
    <article class="favorite-item">
      <img src="${product.imagen}" alt="${product.nombre}" loading="lazy" />
      <div>
        <h3>${product.nombre}</h3>
        <p>${product.descripcion}</p>
        <div class="favorite-item__meta">
          <span>${formatPrice(product.precio)}</span>
          <a href="${createWhatsAppLink(product.nombre)}" target="_blank" rel="noreferrer">Pedir por WhatsApp</a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderGallery() {
  const container = document.getElementById("gallery-grid");
  if (!container) return;

  container.innerHTML = galleryImages.map((image, index) => `
    <img src="${image.src}" alt="${image.alt}" loading="lazy" data-index="${index}" />
  `).join("");

  [...container.querySelectorAll("img")].forEach((image) => {
    image.addEventListener("click", () => openLightbox(image.src, image.alt));
  });
}

function openLightbox(src, alt) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  if (!lightbox || !lightboxImage) return;

  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}

function initializeNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (!navToggle || !siteNav) return;

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => observer.observe(item));
}

function initializeContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const messageBox = document.getElementById("form-message");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const text = document.getElementById("message").value.trim();

    if (!name || !email || !text) {
      messageBox.textContent = "Por favor, rellena todos los campos antes de continuar.";
      messageBox.className = "form-message form-message--error";
      return;
    }

    const encodedMessage = encodeURIComponent(`Hola, me llamo ${name}. Estoy interesada/o en información sobre tus productos. ${text}. Mi email es ${email}.`);
    window.open(`${whatsappBaseUrl}?text=${encodedMessage}`, "_blank");
    messageBox.textContent = "Se abrirá WhatsApp con tu mensaje preparado.";
    messageBox.className = "form-message form-message--success";
    form.reset();
  });
}

function initializeCatalogControls() {
  const searchInput = document.getElementById("product-search");
  const sortSelect = document.getElementById("product-sort");
  const availableOnly = document.getElementById("available-only");
  const favoritesOnly = document.getElementById("favorites-only");
  const clearFiltersButton = document.getElementById("clear-filters");

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      catalogState.searchQuery = event.target.value;
      renderProducts(catalogState.activeCategory);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      catalogState.sortBy = event.target.value;
      renderProducts(catalogState.activeCategory);
    });
  }

  if (availableOnly) {
    availableOnly.addEventListener("change", (event) => {
      catalogState.availableOnly = event.target.checked;
      renderProducts(catalogState.activeCategory);
    });
  }

  if (favoritesOnly) {
    favoritesOnly.addEventListener("change", (event) => {
      catalogState.favoritesOnly = event.target.checked;
      renderProducts(catalogState.activeCategory);
    });
  }

  if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
      catalogState.searchQuery = "";
      catalogState.sortBy = "destacados";
      catalogState.availableOnly = false;
      catalogState.favoritesOnly = false;

      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "destacados";
      if (availableOnly) availableOnly.checked = false;
      if (favoritesOnly) favoritesOnly.checked = false;

      renderProducts("Todas");
      const filterButtons = document.querySelectorAll(".filter-btn");
      filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.filter === "Todas"));
    });
  }
}

function initializeFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!filterButtons.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderProducts(button.dataset.filter);
    });
  });
}

function initializeProductModal() {
  const modal = document.getElementById("product-modal");
  const form = document.getElementById("product-customizer");
  if (!modal || !form) return;

  const closeButton = modal.querySelector(".modal__close");
  const backdrop = modal.querySelector(".modal__backdrop");

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  const handleClose = (event) => {
    if (event.target === backdrop || event.target === closeButton || event.target.matches("[data-close-modal='true']")) {
      closeModal();
    }
  };

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener("click", handleClose);
  }

  modal.querySelectorAll("[data-close-modal='true']").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const productId = Number(form.dataset.productId);
    const product = products.find((item) => item.id === productId);

    if (!product) {
      closeModal();
      return;
    }

    const name = document.getElementById("customizer-name").value.trim();
    const color = document.getElementById("customizer-color").value.trim();
    const quantity = document.getElementById("customizer-quantity").value.trim();
    const details = document.getElementById("customizer-details").value.trim();

    if (!name || !quantity) {
      const message = "Necesitamos tu nombre y la cantidad para preparar la petición.";
      document.getElementById("customizer-alert").textContent = message;
      return;
    }

    const text = encodeURIComponent(`Hola, me gustaría personalizar ${product.nombre}. Nombre: ${name}. Color o tono deseado: ${color || "No especificado"}. Cantidad: ${quantity}. Detalles: ${details || "Sin detalles adicionales"}.`);
    window.open(`${whatsappBaseUrl}?text=${text}`, "_blank");
    closeModal();
    form.reset();
  });
}

function openCustomization(productId) {
  const modal = document.getElementById("product-modal");
  const form = document.getElementById("product-customizer");
  const title = document.getElementById("product-modal-title");
  const fieldsContainer = document.getElementById("customizer-fields");
  const product = products.find((item) => item.id === productId);
  if (!modal || !form || !title || !fieldsContainer || !product) return;

  form.dataset.productId = String(productId);
  title.textContent = `Personaliza: ${product.nombre}`;
  fieldsContainer.innerHTML = `
    <div class="field-group">
      <label for="customizer-name">Tu nombre</label>
      <input id="customizer-name" type="text" placeholder="Escribe tu nombre" required />
    </div>
    <div class="field-group">
      <label for="customizer-color">Color o detalle deseado</label>
      <input id="customizer-color" type="text" placeholder="Por ejemplo: tonos rojos, nombres personalizados..." />
    </div>
    <div class="field-group">
      <label for="customizer-quantity">Cantidad</label>
      <input id="customizer-quantity" type="number" min="1" value="1" required />
    </div>
    <div class="field-group">
      <label for="customizer-details">Detalles adicionales</label>
      <textarea id="customizer-details" rows="4" placeholder="Añade el texto, tema o cualquier dato importante para la personalización."></textarea>
    </div>
    <p id="customizer-alert" class="form-message"></p>
  `;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.getElementById("customizer-name").focus();
}

function initializeProductCardInteractions() {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;

  productGrid.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-favorite-id]");
    const customizeButton = event.target.closest("[data-customize-id]");

    if (favoriteButton) {
      toggleFavorite(Number(favoriteButton.dataset.favoriteId));
    }

    if (customizeButton) {
      openCustomization(Number(customizeButton.dataset.customizeId));
    }
  });
}

function initializeRecommendationForm() {
  const form = document.getElementById("product-recommend-form");
  const results = document.getElementById("recommendation-results");
  if (!form || !results) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const style = document.getElementById("style-choice").value;
    const budget = Number(document.getElementById("budget-choice").value);
    const occasion = document.getElementById("occasion-choice").value;

    const styleMap = {
      elegante: ["Coronas", "Centros de mesa", "Decoración", "Regalos"],
      rustico: ["Decoración", "Coronas", "Regalos", "Adornos"],
      moderno: ["Decoración", "Personalizados", "Adornos", "Coronas"],
      calido: ["Coronas", "Centros de mesa", "Regalos", "Decoración"]
    };

    const occasionMap = {
      casa: ["Decoración", "Centros de mesa", "Coronas"],
      arbol: ["Adornos", "Personalizados", "Coronas"],
      regalo: ["Regalos", "Personalizados", "Decoración"],
      personalizado: ["Personalizados", "Decoración", "Coronas"]
    };

    const scored = products
      .map((product) => {
        let score = 0;
        if (styleMap[style].includes(product.categoria)) score += 4;
        if (occasionMap[occasion].includes(product.categoria)) score += 3;
        if (product.disponible) score += 2;
        if (product.personalizado && occasion === "personalizado") score += 2;
        if (product.precio <= budget) score += 2;
        if (product.precio <= budget * 0.7) score += 1;
        return { product, score };
      })
      .filter(({ product, score }) => product.precio <= budget + 20 && score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (!scored.length) {
      results.innerHTML = '<p class="recommendation-empty">No hemos encontrado una sugerencia exacta para ese presupuesto, pero puedes consultar el catálogo completo.</p>';
      return;
    }

    results.innerHTML = scored.map(({ product }) => `
      <article class="recommendation-card">
        <img src="${product.imagen}" alt="${product.nombre}" loading="lazy" />
        <div>
          <h3>${product.nombre}</h3>
          <p>${product.descripcion}</p>
          <div class="recommendation-card__meta">
            <span>${formatPrice(product.precio)}</span>
            <a href="${createWhatsAppLink(product.nombre)}" class="btn btn--secondary" target="_blank" rel="noreferrer">Consultar</a>
          </div>
        </div>
      </article>
    `).join("");
  });
}

function initializeFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;

    answer.style.maxHeight = "0px";
    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      item.classList.toggle("is-open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = isOpen ? "0px" : `${answer.scrollHeight}px`;
    });
  });
}

function initializeYear() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function initializeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const closeButton = document.querySelector(".lightbox__close");
  if (!lightbox || !closeButton) return;

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initializeYear();
  initializeLightbox();
  initializeContactForm();
  initializeCatalogControls();
  initializeFilterButtons();
  initializeProductCardInteractions();
  initializeProductModal();
  initializeRecommendationForm();
  initializeFaqAccordion();
  renderFeaturedProducts();
  renderProducts("Todas");
  renderFavoritesList();
  renderGallery();
  setupRevealAnimations();
});
