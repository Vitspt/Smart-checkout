// ============================================
// SmartCheckout — Cart System (localStorage)
// ============================================
function getCart(){ try{ return JSON.parse(localStorage.getItem(ukey('cart'))) || []; }catch(e){ return []; } }
function saveCart(c){ localStorage.setItem(ukey('cart'), JSON.stringify(c)); updateCartBadge(); }
function clearCart(){ localStorage.removeItem(ukey('cart')); updateCartBadge(); }

function addToCart(product, qty=1){
  const cart = getCart();
  
  // 1. INVENTORY CHECK
  if (product.stock !== undefined && product.stock <= 0) {
    alert(`Sorry, ${product.name} is currently Out of Stock!`);
    return;
  }

  // 2. DUPLICATE DETECTION (Fast Scan Prevention)
  const lastScanKey = ukey('last_scan_time');
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
  logActivity('CART_ADD', `Added ${product.name} to cart`);
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
    const h = JSON.parse(localStorage.getItem(ukey('scan_history')) || '[]');
    h.unshift({ id:product.id, name:product.name, emoji:product.emoji, price:product.price, time: new Date().toLocaleTimeString() });
    localStorage.setItem(ukey('scan_history'), JSON.stringify(h.slice(0,20)));
  }catch(e){}
}

// Save order to purchase history
function savePurchaseHistory(order){
  try{
    const h = JSON.parse(localStorage.getItem(ukey('orders')) || '[]');
    h.unshift(order);
    localStorage.setItem(ukey('orders'), JSON.stringify(h.slice(0,50)));
    
    // Global log for Admin
    try {
      const session = getSession();
      const adminLog = JSON.parse(localStorage.getItem('ssc_admin_sales') || '[]');
      adminLog.unshift({ ...order, customer: session ? session.user.name : 'Guest' });
      localStorage.setItem('ssc_admin_sales', JSON.stringify(adminLog.slice(0, 500)));
      logActivity('PAYMENT', `Order completed: ${order.id} (₹${order.total})`);
    } catch(err) {}

    // Award points (1 point per 100 spent)
    const points = Math.floor(order.total / 100);
    awardPoints(points);
  }catch(e){}
}

// Points Logic
function getPoints(){ return parseInt(localStorage.getItem(ukey('points')) || '0'); }
function awardPoints(pts){ 
  const current = getPoints();
  localStorage.setItem(ukey('points'), current + pts);
}
function redeemPoints(pts){
  const current = getPoints();
  if(current < pts) return false;
  localStorage.setItem(ukey('points'), current - pts);
  return true;
}

// ============================================
// CONVIX Digital Wallet System
// ============================================
function getWalletBalance(){ return parseFloat(localStorage.getItem(ukey('wallet_balance')) || '0'); }
function topUpWallet(amt){ 
  const current = getWalletBalance();
  localStorage.setItem(ukey('wallet_balance'), (current + amt).toFixed(2));
  logActivity('WALLET_TOPUP', `Topped up ₹${amt}`);
}
function payWithWallet(amt){
  const current = getWalletBalance();
  if(current < amt) return false;
  localStorage.setItem(ukey('wallet_balance'), (current - amt).toFixed(2));
  return true;
}
