// State
let products = [];
let cart = [];
let currentPage = "products";

// DOM Elements
const productsBtn = document.getElementById("productsBtn");
const cartBtn = document.getElementById("cartBtn");
const productsPage = document.getElementById("productsPage");
const cartPage = document.getElementById("cartPage");
const loading = document.getElementById("loading");
const productGrid = document.getElementById("productGrid");
const cartBadge = document.getElementById("cartBadge");
const cartContent = document.getElementById("cartContent");

// Event Listeners
productsBtn.addEventListener("click", () => showPage("products"));
cartBtn.addEventListener("click", () => showPage("cart"));

// Initialize
init();

async function init() {
  await loadProducts();
  renderProducts();
  updateCartBadge();
}

// Load products from API
async function loadProducts() {
  let tempProducts = [];
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    tempProducts = await response.json();
    for (let i = 0; i < tempProducts.length; i++) {
      products.push({ ...tempProducts[i], status: "off" });
    }
    loading.classList.add("hidden");
  } catch (error) {
    console.error("Xatolik:", error);
    loading.textContent = "Xatolik yuz berdi";
  }
}

// Render products
function renderProducts() {
  productGrid.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
          <div class="product-image-container">
            <img src="${product.image}" alt="${
      product.title
    }" class="product-image">
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <span class="product-price">$${product.price}</span>
                ${
                  product.status === "off"
                    ? `<button class="add-button" onclick="addToCart(${product.id})">Savatchaga qo'shish</button>`
                    : `<button class="added-button" onclick="undoCart(${product.id})">Back</button>`
                }
              </div>
          </div>
        `;
    productGrid.appendChild(card);
  });
}

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  product.status = "on";
  renderProducts();
  updateCartBadge();
  renderCart();
}
// Undo cart
function undoCart(productId) {
  const product = products.find((p) => p.id === productId);
  product.status = "off";
  renderProducts();
  removeFromCart(productId);
}
// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartBadge();
  renderCart();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
  if (newQuantity === 0) {
    removeFromCart(productId);
  } else {
    const item = cart.find((item) => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
      renderCart();
    }
  }
}

// Update cart badge
function updateCartBadge() {
  if (cart.length > 0) {
    cartBadge.textContent = cart.length;
    cartBadge.classList.remove("hidden");
  } else {
    cartBadge.classList.add("hidden");
  }
}

// Render cart
function renderCart() {
  if (cart.length === 0) {
    cartContent.innerHTML = `
          <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <p class="empty-cart-text">Savat bo'sh</p>
            <button class="shop-button" onclick="showPage('products')">
              Xarid qilishni boshlash
            </button>
          </div>
        `;
  } else {
    const total = cart
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);

    cartContent.innerHTML = `
          <div class="cart-items">
            ${cart
              .map(
                (item) => `
              <div class="cart-item">
                <div class="cart-item-image">
                  <img src="${item.image}" alt="${
                  item.title
                }" class="cart-image">
                </div>
                <div class="cart-item-details">
                  <h3 class="cart-item-title">${item.title}</h3>
                  <p class="cart-item-price">$${item.price}</p>
                  <div class="quantity-controls">
                    <button class="quantity-button" onclick="updateQuantity(${
                      item.id
                    }, ${item.quantity - 1})">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-button" onclick="updateQuantity(${
                      item.id
                    }, ${item.quantity + 1})">+</button>
                  </div>
                </div>
                <div class="cart-item-actions">
                  <p class="item-total">$${(item.price * item.quantity).toFixed(
                    2
                  )}</p>
                  <button class="remove-button" onclick="removeFromCart(${
                    item.id
                  })">🗑</button>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="cart-summary">
            <div class="summary-row">
              <span class="summary-label">Jami:</span>
              <span class="summary-total">$${total}</span>
            </div>
          </div>
        `;
  }
}

// Show page
function showPage(page) {
  currentPage = page;

  if (page === "products") {
    productsPage.classList.remove("hidden");
    cartPage.classList.add("hidden");
    productsBtn.classList.add("active");
    cartBtn.classList.remove("active");
  } else {
    productsPage.classList.add("hidden");
    cartPage.classList.remove("hidden");
    productsBtn.classList.remove("active");
    cartBtn.classList.add("active");
    renderCart();
  }
}
