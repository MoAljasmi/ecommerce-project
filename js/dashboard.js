// Lab 8 dashboard - data below is the result of the SQL queries in sql/lab8_queries.sql
const kpis = { revenue: 27995.00, orders: 7, customers: 1, aov: 3999.29 };

const monthly = [
  { month: "Sep 2026", revenue: 3757 },
  { month: "Oct 2026", revenue: 6356 },
  { month: "Nov 2026", revenue: 17882 }
];
const topProducts = [
  { name: "Wireless Mouse", units: 8 },
  { name: "Dell Laptop", units: 7 },
  { name: "Smartphone X", units: 1 }
];
const categoryRevenue = [
  { name: "Computers", revenue: 24493 },
  { name: "Phones", revenue: 2599 },
  { name: "Accessories", revenue: 1032 }
];
const statusCounts = [
  { status: "Delivered", orders: 3 },
  { status: "Shipped", orders: 3 },
  { status: "Paid", orders: 1 },
  { status: "Cancelled", orders: 1 }
];
const orders = [
  { date: "2026-09-10", status: "Delivered", total: 258 },
  { date: "2026-09-22", status: "Delivered", total: 3499 },
  { date: "2026-10-05", status: "Shipped", total: 2599 },
  { date: "2026-10-18", status: "Delivered", total: 3757 },
  { date: "2026-10-25", status: "Cancelled", total: 129 },
  { date: "2026-11-03", status: "Paid", total: 6998 },
  { date: "2026-11-08", status: "Shipped", total: 387 },
  { date: "2026-11-12", status: "Shipped", total: 10497 }
];

// KPI cards
const aed = n => "AED " + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
document.getElementById("kpi-revenue").textContent = aed(kpis.revenue);
document.getElementById("kpi-orders").textContent = kpis.orders;
document.getElementById("kpi-customers").textContent = kpis.customers;
document.getElementById("kpi-aov").textContent = aed(kpis.aov);

const colors = ["#1f3a6b", "#2e8b57", "#e08a1e", "#c0392b", "#7f8c8d"];

new Chart(document.getElementById("chart-month"), {
  type: "line",
  data: { labels: monthly.map(m => m.month),
          datasets: [{ label: "Revenue (AED)", data: monthly.map(m => m.revenue), borderColor: colors[0], backgroundColor: colors[0], tension: 0.25 }] }
});
new Chart(document.getElementById("chart-top"), {
  type: "bar",
  data: { labels: topProducts.map(p => p.name),
          datasets: [{ label: "Units sold", data: topProducts.map(p => p.units), backgroundColor: colors[1] }] },
  options: { indexAxis: "y" }
});
new Chart(document.getElementById("chart-category"), {
  type: "pie",
  data: { labels: categoryRevenue.map(c => c.name),
          datasets: [{ data: categoryRevenue.map(c => c.revenue), backgroundColor: colors }] }
});
new Chart(document.getElementById("chart-status"), {
  type: "pie",
  data: { labels: statusCounts.map(s => s.status),
          datasets: [{ data: statusCounts.map(s => s.orders), backgroundColor: colors }] }
});

// Orders table with status filter
const select = document.getElementById("status-filter");
["All"].concat(statusCounts.map(s => s.status)).forEach(s => {
  const o = document.createElement("option"); o.value = s; o.textContent = s; select.appendChild(o);
});
function renderOrders() {
  const body = document.querySelector("#orders-table tbody");
  body.replaceChildren();
  orders.filter(o => select.value === "All" || o.status === select.value).forEach(o => {
    const tr = document.createElement("tr");
    [o.date, o.status, o.total.toFixed(2)].forEach(v => { const td = document.createElement("td"); td.textContent = v; tr.appendChild(td); });
    body.appendChild(tr);
  });
}
select.addEventListener("change", renderOrders);
renderOrders();
