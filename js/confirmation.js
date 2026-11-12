const orderId = new URLSearchParams(window.location.search).get("id");

async function loadConfirmation() {
  const user = await requireLogin();
  if (!user) return;
  if (!orderId) { alert("Order not found."); return; }

  const { data: order, error: orderError } = await supabaseClient
    .from(ORDER_TABLE).select("*").eq("order_id", orderId).single();
  if (orderError || !order) { alert("Order not found."); return; }

  const { data: items, error } = await supabaseClient
    .from("order_item").select("*, product(name)").eq("order_id", orderId);
  if (error) { alert(error.message); return; }

  document.getElementById("order-number").textContent = orderId;
  const container = document.getElementById("items");
  container.replaceChildren();
  items.forEach(item => {
    const p = document.createElement("p");
    p.textContent = `${item.product.name} × ${item.quantity} — AED ${(item.price * item.quantity).toFixed(2)}`;
    container.appendChild(p);
  });
  document.getElementById("order-total").textContent = `Total: AED ${Number(order.total).toFixed(2)}`;
}
loadConfirmation();
