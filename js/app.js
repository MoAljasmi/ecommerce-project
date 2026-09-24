const products = [
  { id: 1, name: "Dell Laptop", category: "Computers", price: 3499, stock: 10 },
  { id: 2, name: "Wireless Mouse", category: "Accessories", price: 129, stock: 25 },
  { id: 3, name: "Smartphone", category: "Phones", price: 2499, stock: 0 },
  { id: 4, name: "iphone 18 pro max", category: "Phones", price: 6000, stock: 1 },
  { id: 5, name: "Gaming Pc Rtx5090", category: "Computers", price: 19930, stock: 1 },
  { id: 6, name: "Gaming Pc Rtx5060", category: "Computers", price: 3500, stock: 1},
  { id: 7, name: "asus rog Mouse", category: "Accessories", price: 560, stock: 3 },
  { id: 8, name: "mousebad", category: "Accessories", price: 2499, stock: 53 },
  // ... add at least 12 more products across three categories
];
function renderProducts(list) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<p>No products match your search.</p>";
    return;
  }
  list.forEach(prod => {
    const stockLabel = prod.stock === 0 ? "Out of Stock"
      : prod.stock <= 5 ? "Low Stock" : "In Stock";
    container.innerHTML += `
      <div class="product">
        <h3>${prod.name}</h3>
        <p>AED ${prod.price.toLocaleString()}</p>
        <p class="stock">${stockLabel}</p>
        <button ${prod.stock === 0 ? "disabled" : ""}>Add to Cart</button>
      </div>`;
  });
}
renderProducts(products);

document.getElementById("search-box").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
});

document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.category;
    renderProducts(cat === "All" ? products : products.filter(p => p.category === cat));
  });
});

document.getElementById("sort-select").addEventListener("change", e => {
  let sorted = [...products];
  if (e.target.value === "low-high") sorted.sort((a, b) => a.price - b.price);
  if (e.target.value === "high-low") sorted.sort((a, b) => b.price - a.price);
  renderProducts(sorted);
});
