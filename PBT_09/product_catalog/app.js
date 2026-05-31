const root = document.getElementById("productApp");

const products = [
  { id: 1, name: "iPhone 16", price: 25990000, category: "phone", image: "https://placehold.co/400x280?text=iPhone+16", rating: 4.5, inStock: true },
  { id: 2, name: "Galaxy S25", price: 23990000, category: "phone", image: "https://placehold.co/400x280?text=Galaxy+S25", rating: 4.2, inStock: true },
  { id: 3, name: "MacBook Air", price: 31990000, category: "laptop", image: "https://placehold.co/400x280?text=MacBook+Air", rating: 4.8, inStock: true },
  { id: 4, name: "ThinkPad X1", price: 28990000, category: "laptop", image: "https://placehold.co/400x280?text=ThinkPad+X1", rating: 4.4, inStock: false },
  { id: 5, name: "Apple Watch", price: 9490000, category: "watch", image: "https://placehold.co/400x280?text=Apple+Watch", rating: 4.7, inStock: true },
  { id: 6, name: "Galaxy Watch", price: 7490000, category: "watch", image: "https://placehold.co/400x280?text=Galaxy+Watch", rating: 4.2, inStock: true },
  { id: 7, name: "Wireless Earbuds", price: 2490000, category: "accessory", image: "https://placehold.co/400x280?text=Earbuds", rating: 4.0, inStock: true },
  { id: 8, name: "Portable Charger", price: 590000, category: "accessory", image: "https://placehold.co/400x280?text=Charger", rating: 3.9, inStock: true },
  { id: 9, name: "Camera Lens", price: 6590000, category: "accessory", image: "https://placehold.co/400x280?text=Lens", rating: 4.3, inStock: false },
  { id: 10, name: "Surface Pro", price: 27990000, category: "laptop", image: "https://placehold.co/400x280?text=Surface+Pro", rating: 4.6, inStock: true },
  { id: 11, name: "Pixel 8", price: 18990000, category: "phone", image: "https://placehold.co/400x280?text=Pixel+8", rating: 4.3, inStock: true },
  { id: 12, name: "Smart Band", price: 1290000, category: "watch", image: "https://placehold.co/400x280?text=Smart+Band", rating: 3.8, inStock: true },
];

const state = {
  search: "",
  category: "all",
  sort: "default",
  cartQty: 0,
};

const categories = ["all", "phone", "laptop", "watch", "accessory"];

const header = document.createElement("section");
const categoryWrapper = document.createElement("section");
const grid = document.createElement("section");
const modalOverlay = document.createElement("div");

let cartBadge;
let activeCategoryButtons = new Map();

function formatPrice(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

function createButton(text, className = "") {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = className;
  btn.textContent = text;
  return btn;
}

function applyBodyTheme() {
  document.body.classList.toggle("dark-mode", state.darkMode);
}

function updateCartBadge() {
  cartBadge.textContent = state.cartQty;
  cartBadge.style.display = state.cartQty > 0 ? "inline-flex" : "none";
}

function filterProducts() {
  return products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(state.search.toLowerCase());
    const matchCategory = state.category === "all" || product.category === state.category;
    return matchSearch && matchCategory;
  });
}

function sortProducts(items) {
  const sorted = [...items];
  if (state.sort === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  }
  if (state.sort === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  }
  if (state.sort === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (state.sort === "rating") {
    sorted.sort((a, b) => b.rating - a.rating);
  }
  return sorted;
}

function renderProducts() {
  grid.innerHTML = "";
  const filtered = sortProducts(filterProducts());

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Không tìm thấy sản phẩm phù hợp.";
    empty.style.color = "var(--muted)";
    grid.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Xem chi tiết ${product.name}`);

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = `${product.category.toUpperCase()} • Rating ${product.rating}`;

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = product.inStock ? "In stock" : "Out of stock";
    if (!product.inStock) {
      badge.classList.add("out-of-stock");
    }

    const priceRow = document.createElement("div");
    priceRow.className = "price-row";

    const price = document.createElement("strong");
    price.textContent = formatPrice(product.price);

    const cartButton = document.createElement("button");
    cartButton.className = "add-cart";
    cartButton.textContent = "Thêm giỏ";
    cartButton.disabled = !product.inStock;
    cartButton.addEventListener("click", (event) => {
      event.stopPropagation();
      state.cartQty += 1;
      updateCartBadge();
    });

    priceRow.append(price, cartButton);
    card.append(image, title, description, badge, priceRow);
    card.addEventListener("click", () => showProductModal(product));
    card.addEventListener("keydown", (keyboard) => {
      if (keyboard.key === "Enter") {
        showProductModal(product);
      }
    });
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

function updateCategoryButtons() {
  activeCategoryButtons.forEach((button, category) => {
    button.classList.toggle("active", category === state.category);
  });
}

function showProductModal(product) {
  modalOverlay.innerHTML = "";
  modalOverlay.classList.add("active");

  const modal = document.createElement("div");
  modal.className = "modal";

  const close = document.createElement("button");
  close.className = "modal-close";
  close.textContent = "✕";
  close.setAttribute("aria-label", "Close product details");
  close.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });

  const heading = document.createElement("h2");
  heading.textContent = product.name;

  const detailText = document.createElement("p");
  detailText.textContent = "Thông tin chi tiết sản phẩm được tạo bằng DOM.";

  const details = document.createElement("div");
  details.className = "detail-row";

  const fields = [
    ["Giá", formatPrice(product.price)],
    ["Danh mục", product.category],
    ["Đánh giá", `${product.rating} / 5`],
    ["Tình trạng", product.inStock ? "Còn hàng" : "Hết hàng"],
  ];

  fields.forEach(([label, value]) => {
    const field = document.createElement("div");
    const title = document.createElement("span");
    title.textContent = label;
    const content = document.createElement("div");
    content.textContent = value;
    field.append(title, content);
    details.appendChild(field);
  });

  const addButton = document.createElement("button");
  addButton.className = "add-cart";
  addButton.textContent = product.inStock ? "Thêm vào giỏ" : "Không thể mua";
  addButton.disabled = !product.inStock;
  addButton.addEventListener("click", () => {
    state.cartQty += 1;
    updateCartBadge();
    modalOverlay.classList.remove("active");
  });

  modal.append(close, heading, detailText, details, addButton);
  modalOverlay.appendChild(modal);
}

function buildUI() {
  header.className = "header";

  const titleGroup = document.createElement("div");
  titleGroup.className = "title-group";
  const title = document.createElement("h1");
  title.textContent = "Product Catalog";
  const subtitle = document.createElement("p");
  subtitle.textContent = "Tìm kiếm, lọc, sắp xếp và xem chi tiết sản phẩm.";
  titleGroup.append(title, subtitle);

  const controlGroup = document.createElement("div");
  controlGroup.className = "controls";

  const searchGroup = document.createElement("div");
  searchGroup.className = "input-group";
  const searchInput = document.createElement("input");
  searchInput.className = "search-input";
  searchInput.placeholder = "Tìm kiếm sản phẩm...";
  searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderProducts();
  });
  searchGroup.appendChild(searchInput);

  const sortGroup = document.createElement("div");
  sortGroup.className = "select-group";
  const sortSelect = document.createElement("select");
  sortSelect.className = "sort-select";
  sortSelect.innerHTML = `
    <option value="default">Sắp xếp</option>
    <option value="price-asc">Giá tăng</option>
    <option value="price-desc">Giá giảm</option>
    <option value="name">Tên A-Z</option>
    <option value="rating">Đánh giá cao</option>
  `;
  sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderProducts();
  });
  sortGroup.appendChild(sortSelect);

  const modeGroup = document.createElement("div");
  modeGroup.className = "mode-group";
  const darkToggle = createButton("Dark mode", "dark-toggle");
  darkToggle.addEventListener("click", () => {
    state.darkMode = !state.darkMode;
    darkToggle.classList.toggle("active", state.darkMode);
    applyBodyTheme();
  });
  modeGroup.appendChild(darkToggle);

  const cartButton = createButton("Giỏ hàng", "cart-button");
  cartBadge = document.createElement("span");
  cartBadge.className = "badge";
  cartBadge.style.display = "none";
  cartButton.appendChild(cartBadge);

  controlGroup.append(searchGroup, sortGroup, modeGroup, cartButton);
  header.append(titleGroup, controlGroup);

  categoryWrapper.className = "category-buttons";
  categories.forEach((category) => {
    const btn = createButton(category === "all" ? "Tất cả" : category, "category-btn");
    btn.dataset.category = category;
    btn.addEventListener("click", () => {
      state.category = category;
      updateCategoryButtons();
      renderProducts();
    });
    activeCategoryButtons.set(category, btn);
    categoryWrapper.appendChild(btn);
  });

  grid.className = "product-grid";
  modalOverlay.className = "modal-overlay";
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      modalOverlay.classList.remove("active");
    }
  });

  root.append(header, categoryWrapper, grid, modalOverlay);
  updateCategoryButtons();
}

buildUI();
updateCartBadge();
renderProducts();
