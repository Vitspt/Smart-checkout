// ============================================
// SmartCheckout — Cart System (localStorage)
// ============================================

// Safe ukey: works even if auth.js hasn't loaded yet
function _ukey(key) {
  if (typeof ukey === 'function') return ukey(key);
  try {
    const s = JSON.parse(localStorage.getItem('ssc_session'));
    const id = s ? s.user.email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';
    return `ssc_${id}_${key}`;
  } catch(e) { return `ssc_guest_${key}`; }
}

function getCart(){ try{ return JSON.parse(localStorage.getItem(_ukey('cart'))) || []; }catch(e){ return []; } }
function saveCart(c){ localStorage.setItem(_ukey('cart'), JSON.stringify(c)); updateCartBadge(); }
function clearCart(){ localStorage.removeItem(_ukey('cart')); updateCartBadge(); }

function addToCart(product, qty=1){
  const cart = getCart();
  
  // 1. INVENTORY CHECK
  if (product.stock !== undefined && product.stock <= 0) {
    alert(`Sorry, ${product.name} is currently Out of Stock!`);
    return;
  }

  // 2. DUPLICATE DETECTION (Fast Scan Prevention)
  const lastScanKey = _ukey('last_scan_time');
  const lastScan = localStorage.getItem(lastScanKey);
  const now = Date.now();
  if (lastScan && (now - lastScan < 800)) { 
    console.warn("Duplicate scan detected.");
    return;
  }
  localStorage.setItem(lastScanKey, now);

  const idx = cart.findIndex(i => i.id === product.id);
  if(idx >= 0){ cart[idx].qty += qty; }
  else { cart.push({ id:product.id, name:product.name, brand:product.brand||'', price:product.price, mrp:product.mrp||product.price, emoji:product.emoji||'🛒', img:product.img||'', qty }); }
  saveCart(cart);
  if(typeof logActivity === 'function') logActivity('CART_ADD', `Added ${product.name} to cart`);
  if(navigator.vibrate) navigator.vibrate(60);
  
  // 3. INVENTORY REDUCTION (Simulation)
  if (product.stock !== undefined) product.stock -= 1;

  // 4. AUTO-CHECK SHOPPING LIST
  if(typeof checkListAuto === 'function') checkListAuto(product.name);
}

function removeFromCart(id){ saveCart(getCart().filter(i => i.id !== id)); }
function updateQty(id, delta){
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if(idx < 0) return;
  cart[idx].qty += delta;
  if(cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart(cart);
}

function getCartCount(){ return getCart().reduce((s,i) => s + i.qty, 0); }
function getCartSubtotal(){ return getCart().reduce((s,i) => s + i.price * i.qty, 0); }
function getCartMRP(){ return getCart().reduce((s,i) => s + i.mrp * i.qty, 0); }

function updateCartBadge(){
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// Add to scan history
function addScanHistory(product){
  try{
    const h = JSON.parse(localStorage.getItem(_ukey('scan_history')) || '[]');
    h.unshift({ id:product.id, name:product.name, emoji:product.emoji, price:product.price, time: new Date().toLocaleTimeString() });
    localStorage.setItem(_ukey('scan_history'), JSON.stringify(h.slice(0,20)));
  }catch(e){}
}

// Save order to purchase history
function savePurchaseHistory(order){
  try{
    const h = JSON.parse(localStorage.getItem(_ukey('orders')) || '[]');
    h.unshift(order);
    localStorage.setItem(_ukey('orders'), JSON.stringify(h.slice(0,50)));
    
    // Global log for Admin
    try {
      const session = typeof getSession === 'function' ? getSession() : null;
      const adminLog = JSON.parse(localStorage.getItem('ssc_admin_sales') || '[]');
      adminLog.unshift({ ...order, customer: session ? session.user.name : 'Guest' });
      localStorage.setItem('ssc_admin_sales', JSON.stringify(adminLog.slice(0, 500)));
      if(typeof logActivity === 'function') logActivity('PAYMENT', `Order completed: ${order.id} (₹${order.total})`);
    } catch(err) {}

    // Award points (1 point per 100 spent)
    const points = Math.floor(order.total / 100);
    awardPoints(points);
  }catch(e){}
}

// Points Logic
function getPoints(){ return parseInt(localStorage.getItem(_ukey('points')) || '0'); }
function awardPoints(pts){ 
  const current = getPoints();
  localStorage.setItem(_ukey('points'), current + pts);
}
function redeemPoints(pts){
  const current = getPoints();
  if(current < pts) return false;
  localStorage.setItem(_ukey('points'), current - pts);
  return true;
}

// ============================================
// CONVIX Digital Wallet System
// ============================================

// Helper: fetch with timeout
function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
    fetch(url, options)
      .then(res => { clearTimeout(timer); resolve(res); })
      .catch(err => { clearTimeout(timer); reject(err); });
  });
}

async function getCloudWallet(){ 
  // Always read local balance first — this is our source of truth
  const localBal = parseFloat(localStorage.getItem(_ukey('wallet_balance')) || '0');
  const token = localStorage.getItem('ssc_token');
  if(!token) return localBal;
  try {
    const res = await fetchWithTimeout(`${API_URL}/users/me/wallet`, { headers: { 'Authorization': `Bearer ${token}` } });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    if(result.success) {
      // CRITICAL: Use Math.max — never let cloud overwrite a higher local balance
      // This protects against Supabase returning stale 0 if column not updated
      const cloudBal = parseFloat(result.balance || 0);
      const best = Math.max(cloudBal, localBal);
      localStorage.setItem(_ukey('wallet_balance'), best);
      return best;
    }
  } catch(e) { console.error("Wallet Sync Error:", e); }
  return localBal; 
}

async function topUpWalletCloud(amt){ 
  const token = localStorage.getItem('ssc_token');
  // Always read current local balance before adding
  const currentLocal = parseFloat(localStorage.getItem(_ukey('wallet_balance')) || '0');
  const newLocal = currentLocal + Number(amt);

  // Credit locally immediately — guaranteed
  localStorage.setItem(_ukey('wallet_balance'), newLocal);

  if(!token) return true;

  // Try to sync with backend too
  try {
    const res = await fetchWithTimeout(`${API_URL}/users/me/wallet/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ amount: amt })
    });
    if(res.ok) {
      const result = await res.json();
      if(result.success) {
        // Cloud saved — use Math.max to keep the higher value
        const cloudBal = parseFloat(result.balance || 0);
        const best = Math.max(cloudBal, newLocal);
        localStorage.setItem(_ukey('wallet_balance'), best);
      }
    }
  } catch(e) { 
    console.warn("TopUp cloud sync failed (local already credited):", e.message);
  }
  return true; // Always success — local is always credited
}

function getWalletBalanceLocal(){ return parseFloat(localStorage.getItem(_ukey('wallet_balance')) || '0'); }
function getWalletPin(){ return localStorage.getItem(_ukey('wallet_pin')) || '2019'; }
function setWalletPin(pin){ localStorage.setItem(_ukey('wallet_pin'), pin); }
function verifyWalletPin(pin){ return pin === getWalletPin(); }
