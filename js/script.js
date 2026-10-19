const products = [
  {
    id: "lazo-rojo-dorado-frutos",
    nombre: "Lazo navideño rojo y dorado con frutos",
    precio: 24.90,
    categoria: "Lazos",
    imagenes: [{ src: "img/productos/producto_1.jpeg", alt: "Lazo grande rojo y dorado con frutos decorativos" }],
    descripcion: "Lazo navideño grande en tonos rojos y dorados, con frutos y decoración festiva.",
    personalizado: false,
    disponible: true
  },
  {
    id: "lazo-variante-rojo-dorado",
    nombre: "Lazo navideño rojo y dorado, variante",
    precio: 24.90,
    categoria: "Lazos",
    imagenes: [{ src: "img/productos/producto_2.jpeg", alt: "Variante de lazo navideño rojo y dorado con decoración festiva" }],
    descripcion: "Variante de lazo navideño en tonos rojos y dorados con decoración festiva.",
    personalizado: false,
    disponible: true
  },
  {
    id: "lazo-elegante-blanco-dorado",
    nombre: "Lazo elegante blanco y dorado",
    precio: 24.90,
    categoria: "Lazos",
    imagenes: [{ src: "img/productos/producto_3.jpeg", alt: "Lazo elegante blanco y dorado con decoración navideña" }],
    descripcion: "Lazo decorativo en tonos blancos y dorados con ramas y detalles festivos.",
    personalizado: false,
    disponible: true
  },
  {
    id: "lazo-blanco-ramas-bolas",
    nombre: "Lazo blanco y dorado con ramas y bolas",
    precio: 24.90,
    categoria: "Lazos",
    imagenes: [{ src: "img/productos/producto_4.jpeg", alt: "Lazo blanco y dorado con ramas verdes y bolas decorativas" }],
    descripcion: "Lazo blanco y dorado acompañado de ramas verdes y bolas decorativas.",
    personalizado: false,
    disponible: true
  },
  {
    id: "lazo-terciopelo-burdeos",
    nombre: "Lazo grande de terciopelo burdeos",
    precio: 11.95,
    categoria: "Lazos",
    imagenes: [{ src: "img/productos/producto_5.jpeg", alt: "Lazo grande de terciopelo de color burdeos" }],
    descripcion: "Lazo grande de terciopelo en tono burdeos.",
    personalizado: false,
    disponible: true
  },
  {
    id: "lazo-cuadros-escoceses",
    nombre: "Lazo de cuadros escoceses",
    precio: 5.90,
    categoria: "Lazos",
    imagenes: [{ src: "img/productos/producto_6.jpeg", alt: "Lazo navideño de cuadros escoceses rojos y verdes" }],
    descripcion: "Lazo de cuadros escoceses en tonos rojos y verdes.",
    personalizado: false,
    disponible: true
  },
  {
    id: "pack-lazos-pequenos-burdeos",
    nombre: "Pack de 3 lazos pequeños burdeos",
    precio: 12.90,
    categoria: "Lazos",
    imagenes: [{ src: "img/productos/producto_7.jpeg", alt: "Pack de tres lazos pequeños de color burdeos" }],
    descripcion: "Conjunto de tres lazos pequeños de terciopelo burdeos.",
    personalizado: false,
    disponible: true
  },
  {
    id: "centro-decorativo-invernal",
    nombre: "Centro decorativo blanco, verde y dorado",
    precio: 14.99,
    categoria: "Centros de mesa",
    imagenes: [{ src: "img/productos/producto_8.jpeg", alt: "Centro decorativo con follaje verde, detalles blancos y piñas" }],
    descripcion: "Centro decorativo con follaje verde, detalles claros y piñas en una maceta.",
    personalizado: false,
    disponible: true
  }
];

const galleryImages = products.flatMap((product) =>
  product.imagenes.map((image) => ({ ...image }))
);

const whatsappNumber = "34624527625";
const whatsappBaseUrl = /^\d{8,15}$/.test(whatsappNumber) ? `https://wa.me/${whatsappNumber}` : null;
const shippingThresholdCents = 5000;
const deliveryOptions = {
  inpost: { label: "Entrega en Locker o Punto Pack de InPost", priceCents: 590 },
  home: { label: "Entrega a domicilio", priceCents: 790 },
  pickup: { label: "Recogida en Valencia", priceCents: 0 }
};
const catalogState = {
  activeCategory: "Todas",
  searchQuery: "",
  sortBy: "destacados",
  availableOnly: false,
  favoritesOnly: false,
};
const cartState = { items: [], delivery: "inpost" };

function formatPrice(price) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(price);
}

function productImage(product, index = 0) {
  return product.imagenes[index] || product.imagenes[0];
}

function readCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("mama-carrito") || "{}");
    const validIds = new Set(products.map((product) => product.id));
    const items = Array.isArray(savedCart.items)
      ? savedCart.items
        .filter((item) => validIds.has(item.id) && Number.isInteger(item.quantity) && item.quantity > 0)
        .map((item) => ({ id: item.id, quantity: item.quantity }))
      : [];
    const delivery = Object.prototype.hasOwnProperty.call(deliveryOptions, savedCart.delivery)
      ? savedCart.delivery
      : "inpost";
    return { items, delivery };
  } catch (error) {
    console.error("No se pudo leer el carrito guardado.", error);
    return { items: [], delivery: "inpost" };
  }
}

function saveCart() {
  try {
    localStorage.setItem("mama-carrito", JSON.stringify(cartState));
  } catch (error) {
    console.error("No se pudo guardar el carrito.", error);
  }
}

function cartSubtotalCents() {
  return cartState.items.reduce((subtotal, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return product ? subtotal + Math.round(product.precio * 100) * item.quantity : subtotal;
  }, 0);
}

function cartShippingCents(subtotalCents = cartSubtotalCents()) {
  if (cartState.items.length === 0) return 0;
  if (cartState.delivery === "pickup" || subtotalCents >= shippingThresholdCents) return 0;
  return deliveryOptions[cartState.delivery].priceCents;
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product || !product.disponible) return;

  const cartItem = cartState.items.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cartState.items.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
}

function updateCartQuantity(productId, change) {
  const cartItem = cartState.items.find((item) => item.id === productId);
  if (!cartItem) return;

  cartItem.quantity += change;
  if (cartItem.quantity <= 0) {
    cartState.items = cartState.items.filter((item) => item.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cartState.items = cartState.items.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function orderWhatsAppUrl(customer) {
  if (!whatsappBaseUrl || cartState.items.length === 0) return null;

  const subtotal = cartSubtotalCents();
  const shipping = cartShippingCents(subtotal);
  const isFreeShipping = subtotal >= shippingThresholdCents;
  const deliveryDetails = cartState.delivery === "inpost"
    ? `Punto InPost: ${customer.deliveryDetails}`
    : cartState.delivery === "home"
      ? `Dirección: ${customer.deliveryDetails}`
      : null;
  const lines = cartState.items.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `🎀 ${product.nombre} x${item.quantity} — ${formatPrice(product.precio)}`;
  });
  const message = [
    "Hola, quiero realizar este pedido:",
    "",
    `Nombre: ${customer.name}`,
    `Teléfono: ${customer.phone}`,
    ...(deliveryDetails ? [deliveryDetails] : []),
    "",
    ...lines,
    "",
    `Subtotal: ${formatPrice(subtotal / 100)}`,
    `🚚 Entrega: ${deliveryOptions[cartState.delivery].label}`,
    `Envío: ${shipping === 0 ? "GRATIS" : formatPrice(shipping / 100)}`,
    ...(isFreeShipping ? ["🎁 ¡Envío GRATIS!"] : []),
    `TOTAL: ${formatPrice((subtotal + shipping) / 100)}`,
    "",
    "Gracias."
  ].join("\n");

  return `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}

function renderCart() {
  const cartLines = document.getElementById("cart-lines");
  if (!cartLines) return;

  const subtotal = cartSubtotalCents();
  const shipping = cartShippingCents(subtotal);
  const itemCount = cartState.items.reduce((total, item) => total + item.quantity, 0);
  const cartEmpty = document.getElementById("cart-empty");
  const countElement = document.getElementById("cart-count");
  const orderButton = document.getElementById("whatsapp-order");
  const guestCheckout = document.getElementById("guest-checkout");
  const setupNote = document.getElementById("whatsapp-config-note");
  const shippingMessage = document.getElementById("shipping-message");
  const isFreeShipping = subtotal >= shippingThresholdCents;

  cartLines.innerHTML = cartState.items.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return "";
    return `
      <article class="cart-item">
        <img src="${productImage(product).src}" alt="${productImage(product).alt}" />
        <div class="cart-item__details">
          <h4>${product.nombre}</h4>
          <span>${formatPrice(product.precio)} cada uno</span>
          <div class="cart-item__controls" aria-label="Cantidad de ${product.nombre}">
            <button type="button" data-cart-action="decrease" data-product-id="${product.id}" aria-label="Quitar una unidad de ${product.nombre}">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-action="increase" data-product-id="${product.id}" aria-label="Añadir una unidad de ${product.nombre}">+</button>
            <button type="button" class="cart-item__remove" data-cart-action="remove" data-product-id="${product.id}">Eliminar</button>
          </div>
        </div>
        <strong>${formatPrice(Math.round(product.precio * 100) * item.quantity / 100)}</strong>
      </article>
    `;
  }).join("");

  if (cartEmpty) cartEmpty.hidden = itemCount > 0;
  if (countElement) countElement.textContent = String(itemCount);
  document.getElementById("cart-subtotal").textContent = formatPrice(subtotal / 100);
  document.getElementById("cart-shipping").textContent = shipping === 0 ? "GRATIS" : formatPrice(shipping / 100);
  document.getElementById("cart-total").textContent = formatPrice((subtotal + shipping) / 100);
  document.getElementById("inpost-price").textContent = isFreeShipping ? "GRATIS" : formatPrice(deliveryOptions.inpost.priceCents / 100);
  document.getElementById("home-price").textContent = isFreeShipping ? "GRATIS" : formatPrice(deliveryOptions.home.priceCents / 100);

  if (shippingMessage) {
    if (itemCount === 0) {
      shippingMessage.textContent = "Añade productos: a partir de 50,00 € el envío es gratis. La recogida en Valencia siempre es gratuita.";
      shippingMessage.classList.remove("shipping-message--free");
    } else if (isFreeShipping) {
      shippingMessage.textContent = "🎁 ¡Envío GRATIS!";
      shippingMessage.classList.add("shipping-message--free");
    } else {
      const remaining = (shippingThresholdCents - subtotal) / 100;
      shippingMessage.textContent = cartState.delivery === "pickup"
        ? `La recogida en Valencia es gratuita. Te faltan ${formatPrice(remaining)} para conseguir envío GRATIS con InPost o a domicilio.`
        : `Te faltan ${formatPrice(remaining)} para conseguir envío GRATIS.`;
      shippingMessage.classList.remove("shipping-message--free");
    }
  }

  document.querySelectorAll('input[name="delivery-method"]').forEach((radio) => {
    radio.checked = radio.value === cartState.delivery;
  });
  if (orderButton) orderButton.disabled = itemCount === 0 || !whatsappBaseUrl;
  if (guestCheckout) guestCheckout.hidden = itemCount === 0;
  if (setupNote) setupNote.hidden = Boolean(whatsappBaseUrl);
  syncGuestDeliveryFields();
}

function syncGuestDeliveryFields() {
  const inpostDetails = document.getElementById("inpost-details");
  const inpostLocation = document.getElementById("inpost-location");
  const homeDetails = document.getElementById("home-details");
  const homeAddress = document.getElementById("home-address");

  if (!inpostDetails || !inpostLocation || !homeDetails || !homeAddress) return;

  const inpostSelected = cartState.delivery === "inpost";
  const homeSelected = cartState.delivery === "home";
  inpostDetails.hidden = !inpostSelected;
  inpostLocation.required = inpostSelected;
  homeDetails.hidden = !homeSelected;
  homeAddress.required = homeSelected;
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
        <img src="${productImage(product).src}" alt="${productImage(product).alt}" loading="lazy" />
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
          <a href="productos.html#product-grid" class="btn btn--primary">Ver en catálogo</a>
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
    const firstImage = productImage(product);
    return `
      <article class="product-card reveal">
        <button type="button" class="favorite-btn ${favorite ? "is-active" : ""}" data-favorite-id="${product.id}" aria-label="${favorite ? "Quitar de favoritos" : "Añadir a favoritos"}" title="${favorite ? "Quitar de favoritos" : "Añadir a favoritos"}">
          ♥
        </button>
        <div class="product-card__image">
          <img src="${firstImage.src}" alt="${firstImage.alt}" loading="lazy" data-product-image="${product.id}" data-image-index="0" />
          ${product.imagenes.length > 1 ? `<button type="button" class="product-image-next" data-gallery-id="${product.id}" aria-label="Ver otra foto de ${product.nombre}">Ver otra foto</button>` : ""}
        </div>
        <div class="product-card__body">
          <div class="product-card__head">
            <h3>${product.nombre}</h3>
            <span class="product-card__price">${formatPrice(product.precio)}</span>
          </div>
          <div class="product-card__meta">
            <span class="meta-pill">${product.categoria}</span>
            <span class="meta-pill ${product.personalizado ? "meta-pill--warning" : ""}">${product.personalizado ? "Personalizable" : "Hecho a mano"}</span>
          </div>
          <p class="product-card__description">${product.descripcion}</p>
          <div class="product-card__actions">
            <button type="button" class="btn btn--primary" data-add-to-cart="${product.id}">Añadir al carrito</button>
            <button type="button" class="btn btn--secondary btn--small" data-customize-id="${product.id}">Consultar opciones</button>
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
      <img src="${productImage(product).src}" alt="${productImage(product).alt}" loading="lazy" />
      <div>
        <h3>${product.nombre}</h3>
        <p>${product.descripcion}</p>
        <div class="favorite-item__meta">
          <span>${formatPrice(product.precio)}</span>
          <a href="productos.html#product-grid">Ver en catálogo</a>
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
    if (!whatsappBaseUrl) {
      messageBox.textContent = "Los pedidos por WhatsApp todavía no están configurados. Contacta con el negocio por otro medio.";
      messageBox.className = "form-message form-message--error";
      return;
    }

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
    const productId = form.dataset.productId;
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

    if (!whatsappBaseUrl) {
      document.getElementById("customizer-alert").textContent = "El número de WhatsApp de pedidos todavía no está configurado.";
      return;
    }

    const text = encodeURIComponent(`Hola, quisiera consultar opciones para ${product.nombre}. Nombre: ${name}. Color o detalle deseado: ${color || "No especificado"}. Cantidad: ${quantity}. Detalles: ${details || "Sin detalles adicionales"}.`);
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
  title.textContent = `Consulta opciones: ${product.nombre}`;
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
    const addButton = event.target.closest("[data-add-to-cart]");
    const galleryButton = event.target.closest("[data-gallery-id]");

    if (favoriteButton) {
      toggleFavorite(favoriteButton.dataset.favoriteId);
    }

    if (customizeButton) {
      openCustomization(customizeButton.dataset.customizeId);
    }

    if (addButton) {
      addToCart(addButton.dataset.addToCart);
    }

    if (galleryButton) {
      const product = products.find((item) => item.id === galleryButton.dataset.galleryId);
      const image = product && productGrid.querySelector(`[data-product-image="${product.id}"]`);
      if (product && image) {
        const nextIndex = (Number(image.dataset.imageIndex) + 1) % product.imagenes.length;
        const nextImage = productImage(product, nextIndex);
        image.src = nextImage.src;
        image.alt = nextImage.alt;
        image.dataset.imageIndex = String(nextIndex);
      }
    }
  });
}

function initializeCart() {
  const cartSection = document.getElementById("cart-lines");
  if (!cartSection) return;

  const savedCart = readCart();
  cartState.items = savedCart.items;
  cartState.delivery = savedCart.delivery;
  renderCart();

  document.querySelectorAll('input[name="delivery-method"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (!radio.checked) return;
      cartState.delivery = radio.value;
      saveCart();
      renderCart();
    });
  });

  cartSection.addEventListener("click", (event) => {
    const cartButton = event.target.closest("[data-cart-action]");
    if (!cartButton) return;

    const productId = cartButton.dataset.productId;
    if (cartButton.dataset.cartAction === "increase") updateCartQuantity(productId, 1);
    if (cartButton.dataset.cartAction === "decrease") updateCartQuantity(productId, -1);
    if (cartButton.dataset.cartAction === "remove") removeFromCart(productId);
  });

  const checkoutForm = document.getElementById("guest-checkout");
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!checkoutForm.reportValidity()) return;

    const url = orderWhatsAppUrl({
      name: document.getElementById("customer-name").value.trim(),
      phone: document.getElementById("customer-phone").value.trim(),
      deliveryDetails: cartState.delivery === "inpost"
        ? document.getElementById("inpost-location").value.trim()
        : document.getElementById("home-address").value.trim()
    });
    if (url) window.open(url, "_blank", "noopener,noreferrer");
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
      elegante: ["Lazos", "Centros de mesa"],
      rustico: ["Lazos", "Centros de mesa"],
      moderno: ["Lazos", "Centros de mesa"],
      calido: ["Lazos", "Centros de mesa"]
    };

    const occasionMap = {
      casa: ["Lazos", "Centros de mesa"],
      arbol: ["Lazos"],
      regalo: ["Lazos", "Centros de mesa"],
      personalizado: ["Lazos", "Centros de mesa"]
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
        <img src="${productImage(product).src}" alt="${productImage(product).alt}" loading="lazy" />
        <div>
          <h3>${product.nombre}</h3>
          <p>${product.descripcion}</p>
          <div class="recommendation-card__meta">
            <span>${formatPrice(product.precio)}</span>
            <a href="productos.html#product-grid" class="btn btn--secondary">Ver en catálogo</a>
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
  initializeCart();
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
