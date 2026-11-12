// ===== Checkout (Lab 6) =====
requireLogin();

document.getElementById("checkout-form").addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  if (!name || !address) { alert("Name and address are required."); return; }
  if (!/^[0-9+ ]{7,15}$/.test(phone)) { alert("Enter a valid phone number."); return; }
  await placeOrder(name, address, phone);
});

async function placeOrder(name, address, phone) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) { window.location.href = "login.html"; return; }

  const cart = getCart();
  if (cart.length === 0) { alert("Your cart is empty."); return; }
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const { data: order, error } = await supabaseClient
    .from(ORDER_TABLE)
    .insert([{ customer_id: user.id, total: subtotal, status: "Paid" }])
    .select()
    .single();
  if (error) { alert("Could not place order: " + error.message); return; }

  const items = cart.map(i => ({
    order_id: order.order_id, product_id: i.product_id, quantity: i.quantity, price: i.price
  }));
  const { error: itemsError } = await supabaseClient.from("order_item").insert(items);
  if (itemsError) { alert("Order created, but items failed: " + itemsError.message); return; }

  localStorage.removeItem("cart");
  window.location.href = `order-confirmation.html?id=${order.order_id}`;
}
