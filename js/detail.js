const productId = new URLSearchParams(window.location.search).get("id");

async function loadProduct() {
  const detail = document.getElementById("detail");
  if (!productId) { detail.innerHTML = "<p>Product ID is missing from URL.</p>"; return; }
  const { data, error } = await supabaseClient.from("product").select("*").eq("product_id", productId).maybeSingle();
  if (error) { detail.innerHTML = "<p>Error loading product details.</p>"; return; }
  if (!data) { detail.innerHTML = "<p>Product not found.</p>"; return; }
  detail.innerHTML = `<h2>${data.name}</h2><p>${data.description ?? ""}</p><p>Price: AED ${data.price}</p><p>Stock: ${data.stock}</p>`;
}
loadProduct();
