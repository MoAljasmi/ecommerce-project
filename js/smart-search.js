// ===== Lab 9 - Smart product search (client-side keyword scoring) =====

// Rule-based price understanding: "under 500" / "below 500"
function extractMaxPrice(query) {
  const match = query.match(/under\s+(\d+)|below\s+(\d+)/i);
  if (!match) return null;
  return Number(match[1] || match[2]);
}

// Score a product by how many query words appear in its name / description / category
function scoreProduct(product, queryWords) {
  const text = `${product.name} ${product.description || ""} ${product.category || ""}`.toLowerCase();
  let score = 0;
  queryWords.forEach(word => {
    if (text.includes(word)) score += 1;
  });
  return score;
}

function smartSearch(query, products) {
  const maxPrice = extractMaxPrice(query);
  const candidates = maxPrice !== null ? products.filter(p => Number(p.price) <= maxPrice) : products;

  // remove the price phrase, then drop short filler words (simple stopword removal)
  const queryWords = query.toLowerCase()
    .replace(/(under|below)\s+\d+/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2);

  if (queryWords.length === 0 && maxPrice !== null) return candidates.slice(0, 5);

  return candidates
    .map(p => ({ product: p, score: scoreProduct(p, queryWords) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(r => r.product);
}

// ===== UI wiring =====
let smartProducts = null;

async function loadSmartProducts() {
  if (smartProducts) return smartProducts;
  const { data } = await supabaseClient.from("product").select("*, category(category_name)");
  smartProducts = (data || []).map(p => ({ ...p, category: p.category ? p.category.category_name : "" }));
  return smartProducts;
}

const smartInput = document.getElementById("smart-search");
if (smartInput) {
  smartInput.addEventListener("input", async e => {
    const query = e.target.value;
    const resultsDiv = document.getElementById("smart-results");
    if (query.length < 3) { resultsDiv.innerHTML = ""; return; }

    const products = await loadSmartProducts();
    const matches = smartSearch(query, products);

    resultsDiv.replaceChildren();
    if (matches.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No matches. Try different words.";
      resultsDiv.appendChild(p);
      return;
    }
    matches.forEach(m => {
      const p = document.createElement("p");
      p.textContent = `${m.name} — AED ${m.price}`;
      resultsDiv.appendChild(p);
    });
  });
}
