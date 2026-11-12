// ===== Products (Lab 4) =====
let allProducts = [];
let searchTerm = "";
let sortOrder = "default";

function renderProducts(list) {
  const container = document.getElementById("product-list");
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }
  container.innerHTML = list.map(prod => `
    <div class="product">
      <h3>${prod.name}</h3>
      <p>AED ${prod.price}</p>
      <p>Stock: ${prod.stock}</p>
      <button data-id="${prod.product_id}" class="add-btn">Add to Cart</button>
      <a href="product-detail.html?id=${prod.product_id}">View Details</a>
    </div>`).join("");
  container.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const prod = allProducts.find(p => String(p.product_id) === btn.dataset.id);
      addToCart(prod);
    });
  });
}

function updateProductView() {
  let list = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
  if (sortOrder === "low-high") list.sort((a, b) => a.price - b.price);
  if (sortOrder === "high-low") list.sort((a, b) => b.price - a.price);
  renderProducts(list);
}

async function loadProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "<p>Loading products...</p>";
  const { data, error } = await supabaseClient.from("product").select("*");
  if (error) {
    container.innerHTML = `<p>Could not load products: ${error.message}</p>`;
    return;
  }
  allProducts = data || [];
  updateProductView();
}

const searchBox = document.getElementById("search-box");
if (searchBox) searchBox.addEventListener("input", e => { searchTerm = e.target.value.toLowerCase(); updateProductView(); });
const sortSelect = document.getElementById("sort-select");
if (sortSelect) sortSelect.addEventListener("change", e => { sortOrder = e.target.value; updateProductView(); });
loadProducts();

// ===== Cart (Lab 5 - localStorage) =====
function getCart() { return JSON.parse(localStorage.getItem("cart") || "[]"); }
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.product_id === product.product_id);
  if (existing) existing.quantity += 1;
  else cart.push({ product_id: product.product_id, name: product.name, price: Number(product.price), quantity: 1 });
  saveCart(cart);
}

function removeFromCart(productId) {
  saveCart(getCart().filter(i => String(i.product_id) !== String(productId)));
}

function updateQuantity(productId, quantity) {
  const q = parseInt(quantity);
  if (isNaN(q) || q <= 0) return removeFromCart(productId);
  saveCart(getCart().map(i => String(i.product_id) === String(productId) ? { ...i, quantity: q } : i));
}

function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("subtotal").textContent = "0.00";
    return;
  }
  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    const line = item.price * item.quantity;
    subtotal += line;
    return `
      <div class="cart-item">
        <span>${item.name}</span>
        <input type="number" min="1" value="${item.quantity}"
          onchange="updateQuantity(${item.product_id}, this.value); renderCart();">
        <span>AED ${line.toFixed(2)}</span>
        <button onclick="removeFromCart(${item.product_id}); renderCart();">Remove</button>
      </div>`;
  }).join("");
  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
}

function goToCheckout() {
  if (getCart().length === 0) { alert("Your cart is empty."); return; }
  window.location.href = "checkout.html";
}
renderCart();

// ===== Authentication (Lab 5 - Supabase Auth) =====
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const { error } = await supabaseClient.auth.signUp({ email, password });
    if (error) { alert("Registration Error: " + error.message); return; }
    alert("Account created - you can now log in.");
    window.location.href = "login.html";
  });
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = "index.html";
  });
}

async function updateNavForAuth() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  const slot = document.getElementById("auth-nav-slot");
  if (!slot) return;
  if (user) {
    slot.innerHTML = `<span>Hi, ${user.email}</span> <a href="#" id="logout-link">Log out</a>`;
    document.getElementById("logout-link").addEventListener("click", async e => { e.preventDefault(); await logout(); });
  } else {
    slot.innerHTML = '<a href="login.html">Login</a> <a href="register.html">Register</a>';
  }
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

async function requireLogin() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) { window.location.href = "login.html"; return null; }
  return user;
}
updateNavForAuth();
