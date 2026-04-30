// ============================================
// SmartCheckout — Product System (Persistent)
// ============================================

async function fetchProducts() {
  // 1. Check if we have products in LocalStorage
  const local = localStorage.getItem('ssc_products');
  if (local) return JSON.parse(local);

  // 2. Otherwise fetch from JSON
  try {
    const res = await fetch('data/products.json');
    const data = await res.json();
    // Save to local for future persistence
    localStorage.setItem('ssc_products', JSON.stringify(data));
    return data;
  } catch (e) {
    console.error("Fetch failed, using empty list");
    return [];
  }
}

function saveProducts(prods) {
  localStorage.setItem('ssc_products', JSON.stringify(prods));
}

function getProductById(id) {
  const prods = JSON.parse(localStorage.getItem('ssc_products') || '[]');
  return prods.find(p => p.id === id);
}

function searchProducts(q) {
  const prods = JSON.parse(localStorage.getItem('ssc_products') || '[]');
  if (!q) return prods;
  q = q.toLowerCase();
  return prods.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
}

function discount(mrp, price) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

function formatPrice(p) {
  return '₹' + parseFloat(p).toFixed(2);
}
