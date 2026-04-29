// SmartCheckout AI Assistant - Advanced Version
(function(){
  // Safety check for window.t
  const safeT = (k) => (typeof window.t === 'function' ? window.t(k) : k);
  const safeFormat = (n) => (typeof formatPrice === 'function' ? formatPrice(n) : '₹' + n);

  // Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
    .ai-fab { position: fixed; bottom: calc(var(--nav) + 16px); left: 16px; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #ef4d23, #f97316); color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(239,77,35,.4); cursor: pointer; z-index: 1000; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 2px solid rgba(255,255,255,.3); backdrop-filter: blur(4px); }
    .ai-fab:hover { transform: scale(1.1) rotate(5deg); box-shadow: 0 15px 30px rgba(239,77,35,.5); }
    .ai-fab .material-icons { font-size: 30px; }

    .ai-window { position: fixed; bottom: calc(var(--nav) + 85px); left: 16px; width: 340px; max-width: calc(100vw - 32px); height: 500px; max-height: 70vh; background: rgba(11, 15, 26, 0.95); backdrop-filter: blur(20px); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,.5); display: flex; flex-direction: column; overflow: hidden; z-index: 1001; transform-origin: bottom left; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1); opacity: 0; transform: translateY(20px) scale(0.9); pointer-events: none; border: 1px solid rgba(255,255,255,0.1); }
    .ai-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

    .ai-header { background: linear-gradient(135deg, #ef4d23, #f97316); color: #fff; padding: 20px 16px; display: flex; align-items: center; justify-content: space-between; }
    .ai-title { font-weight: 800; font-size: 16px; display: flex; align-items: center; gap: 10px; }
    .ai-close { background: rgba(255,255,255,0.2); border: none; color: #fff; cursor: pointer; display: flex; padding: 4px; border-radius: 50%; }

    .ai-body { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; background: rgba(0,0,0,0.2); scrollbar-width: none; }
    .ai-body::-webkit-scrollbar { display: none; }
    
    .ai-msg { max-width: 85%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.5; font-weight: 500; position: relative; animation: slideIn 0.3s ease-out; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .ai-msg.bot { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-bottom-left-radius: 4px; align-self: flex-start; }
    .ai-msg.user { background: var(--primary); color: #fff; border-bottom-right-radius: 4px; align-self: flex-end; box-shadow: 0 4px 12px rgba(239,77,35,0.3); }
    .ai-msg.system { background: rgba(255,255,255,0.05); color: var(--muted); font-size: 11px; align-self: center; border-radius: 10px; padding: 4px 12px; margin: 4px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .ai-cap-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 10px; border-radius: 12px; display: flex; align-items: center; gap: 10px; font-size: 12px; color: #fff; cursor: pointer; transition: all 0.2s; }
    .ai-cap-item:hover { border-color: var(--primary); background: rgba(255,255,255,0.05); transform: translateX(5px); }
    .ai-cap-item .material-icons { font-size: 18px; color: var(--primary); }

    .ai-footer { padding: 16px; background: rgba(11, 15, 26, 0.95); border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 10px; align-items: center; }
    .ai-input { flex: 1; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); border-radius: 24px; padding: 12px 18px; font-size: 14px; outline: none; transition: all 0.2s; color: #fff; }
    .ai-input:focus { border-color: var(--primary); background: rgba(255,255,255,0.1); }
    .ai-send { background: var(--primary); color: #fff; border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; flex-shrink: 0; }
    
    .ai-action-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 12px 10px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; text-align: center; }
    .ai-action-btn:hover { border-color: var(--primary); background: rgba(255,255,255,0.05); transform: translateY(-2px); }
    .ai-action-btn .material-icons { color: var(--primary); font-size: 24px; }
    .ai-action-btn span { font-size: 11px; font-weight: 700; color: #fff; line-height: 1.2; }
    
    .typing { display: flex; gap: 4px; padding: 8px 0; }
    .typing span { width: 6px; height: 6px; background: #cbd5e1; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out; }
    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
  `;
  document.head.appendChild(style);

  // Inject DOM
  const container = document.createElement('div');
  container.id = 'ai-assistant-container';
  container.innerHTML = `
    <div class="ai-window" id="ai-win">
      <div class="ai-header">
        <div class="ai-title">
          <span class="material-icons">auto_awesome</span>
          <span data-i18n="agent_title">${safeT('agent_title')}</span>
        </div>
        <button class="ai-close" onclick="toggleAI()"><span class="material-icons">close</span></button>
      </div>
      <div class="ai-body" id="ai-chat">
        <div class="ai-msg bot">Hi! I am your <strong>Smart Guide</strong>. How can I assist you today?</div>
        
        <div class="ai-actions-grid">
          <div class="ai-action-btn" onclick="agentAction('POINTS')">
            <span class="material-icons">stars</span>
            <span>Check My Points</span>
          </div>
          <div class="ai-action-btn" onclick="agentAction('ORDERS')">
            <span class="material-icons">history</span>
            <span>Order History</span>
          </div>
          <div class="ai-action-btn" onclick="agentAction('HOW_TO_SCAN')">
            <span class="material-icons">qr_code_scanner</span>
            <span>How to Scan?</span>
          </div>
          <div class="ai-action-btn" onclick="agentAction('STATUS')">
            <span class="material-icons">storefront</span>
            <span>Shop Status</span>
          </div>
          <div class="ai-action-btn" onclick="agentAction('GROCERY')">
            <span class="material-icons">shopping_basket</span>
            <span>Find Groceries</span>
          </div>
          <div class="ai-action-btn" onclick="agentAction('SNACKS')">
            <span class="material-icons">fastfood</span>
            <span>Find Snacks</span>
          </div>
          <div class="ai-action-btn" onclick="agentAction('LANG')">
            <span class="material-icons">translate</span>
            <span>Change Language</span>
          </div>
          <div class="ai-action-btn" onclick="agentAction('PROFILE')">
            <span class="material-icons">person</span>
            <span>My Profile</span>
          </div>
          <div class="ai-action-btn" onclick="agentAction('CART')">
            <span class="material-icons">shopping_cart</span>
            <span>View My Cart</span>
          </div>
          <div class="ai-action-btn" onclick="agentAction('CLEAR_CART')">
            <span class="material-icons">delete_sweep</span>
            <span>Empty Cart</span>
          </div>
          <div class="ai-action-btn" onclick="agentAction('OFFERS')">
            <span class="material-icons">local_offer</span>
            <span>Latest Offers</span>
          </div>
          <div class="ai-action-btn" onclick="agentAction('SUPPORT')">
            <span class="material-icons">support_agent</span>
            <span>Need Help?</span>
          </div>
        </div>
      </div>
      <div class="ai-footer">
        <input type="text" class="ai-input" id="ai-inp" data-i18n="agent_placeholder" placeholder="${safeT('agent_placeholder')}" onkeydown="if(event.key==='Enter') sendAgentMsg()">
        <button class="ai-send" onclick="sendAgentMsg()">
          <span class="material-icons">send</span>
        </button>
      </div>
    </div>
    <div class="ai-fab" onclick="toggleAI()" id="ai-fab">
      <span class="material-icons">auto_awesome</span>
    </div>
  `;
  document.body.appendChild(container);

  let isOpen = false;

  window.toggleAI = function(){
    const win = document.getElementById('ai-win');
    if(!win) return;
    isOpen = !isOpen;
    if(isOpen) {
      win.classList.add('open');
      const inp = document.getElementById('ai-inp');
      if(inp) setTimeout(()=> inp.focus(), 400);
    } else {
      win.classList.remove('open');
    }
  };

  window.sendAgentMsg = function() {
    const inp = document.getElementById('ai-inp');
    if(!inp || !inp.value.trim()) return;
    const txt = inp.value.trim();
    inp.value = '';
    
    addBubble(txt, 'user');
    
    // Add typing indicator
    const chat = document.getElementById('ai-chat');
    const typing = document.createElement('div');
    typing.className = 'ai-msg bot';
    typing.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;
    
    setTimeout(() => {
      typing.remove();
      const resp = handleCommand(txt);
      addBubble(resp, 'bot');
    }, 1000);
  };

  window.agentAction = function(type){
    const chat = document.getElementById('ai-chat');
    if(!chat) return;
    
    // Clear history or add divider
    chat.innerHTML = `<div class="ai-msg system">Requesting: ${type.replace(/_/g, ' ')}</div>`;

    // Add typing indicator
    const typing = document.createElement('div');
    typing.className = 'ai-msg bot';
    typing.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;

    setTimeout(()=>{
      typing.remove();
      let response = "I am processing your request...";
      
      switch(type){
        case 'POINTS':
          const pts = typeof getPoints === 'function' ? getPoints() : 0;
          response = `✨ You currently have <strong>${pts} SmartPoints</strong>! Keep shopping to earn more rewards.`;
          break;
        case 'ORDERS':
          response = "Fetching your <strong>Order History</strong>... Redirecting now.";
          setTimeout(()=> {
             const win = document.querySelector('.tab-btn[onclick*="orders"]');
             if(win) win.click();
             location.href = 'profile.html#orders';
          }, 2500);
          break;
        case 'HOW_TO_SCAN':
          response = "It's easy! Tap the <strong>Center QR Button</strong>, point your camera at the product barcode, and it will be added to your cart instantly. 📸";
          break;
        case 'STATUS':
          response = "Checking the shop status... 🏪 We are currently <strong>Active</strong> and ready for your orders!";
          break;
        case 'GROCERY':
          response = "I'm finding the best groceries for you. 🥦 Redirecting to the <strong>Grocery</strong> section...";
          setTimeout(()=> location.href = 'category.html?c=Grocery', 2500);
          break;
        case 'SNACKS':
          response = "Feeling hungry? 🍿 Redirecting you to the <strong>Snacks & Munchies</strong> section...";
          setTimeout(()=> location.href = 'category.html?c=Snacks', 2500);
          break;
        case 'LANG':
          response = "You can change the language using the <strong>Globe Icon</strong> at the top of the Home page. We support English, Hindi, and Spanish!";
          break;
        case 'PROFILE':
          response = "Opening your <strong>Profile Settings</strong>. You can update your info there.";
          setTimeout(()=> location.href = 'profile.html', 2000);
          break;
        case 'OFFERS':
          response = "We have great deals today! Redirecting you to the <strong>Offers</strong> section...";
          setTimeout(()=> location.href = 'category.html?c=All', 2500);
          break;
        case 'CART':
          response = "Taking you to your <strong>Cart</strong> right now...";
          setTimeout(()=> location.href = 'cart.html', 2000);
          break;
        case 'CLEAR_CART':
          if(confirm('Empty your cart?')){
            if(typeof clearCart === 'function') clearCart();
            response = "🗑️ Done! Your cart has been emptied.";
          } else {
            response = "Okay, I kept your items in the cart!";
          }
          break;
        case 'SUPPORT':
          response = "Need a hand? I'm taking you to our <strong>Support & FAQ</strong> page.";
          setTimeout(()=> location.href = 'support.html', 2000);
          break;
      }
      
      addBubble(response, 'bot');
      
      // Add "Back to Menu" button after response
      const backBtn = document.createElement('div');
      backBtn.style.textAlign = 'center';
      backBtn.innerHTML = `<button onclick="location.reload()" style="background:var(--green-l);color:var(--green);border:1px solid var(--green);padding:6px 12px;border-radius:12px;font-size:12px;font-weight:700;margin-top:10px">↺ Back to Main Menu</button>`;
      chat.appendChild(backBtn);
      chat.scrollTop = chat.scrollHeight;
    }, 1200);
  };

  function addBubble(text, side) {
    const chat = document.getElementById('ai-chat');
    if(!chat) return;
    const b = document.createElement('div');
    b.className = `ai-msg ${side}`;
    b.innerHTML = text;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  }

  function handleCommand(txt) {
    const q = txt.toLowerCase();
    
    // NAVIGATION
    if(q.includes('profile') || q.includes('account')) {
      setTimeout(()=> location.href = 'profile.html', 2000);
      return "Sure! Redirecting you to your <strong>Profile</strong> in a moment...";
    }
    if(q.includes('scan') || q.includes('camera')) {
      setTimeout(()=> location.href = 'scanner.html', 2000);
      return "Opening the <strong>Scanner</strong>. Get ready to scan some products!";
    }
    if(q.includes('cart') || q.includes('basket')) {
      setTimeout(()=> location.href = 'cart.html', 2000);
      return "Let's check your <strong>Cart</strong>. Heading there now...";
    }

    // LANGUAGE
    if(q.includes('hindi')) {
      if(typeof window.setGlobalLang === 'function') {
        setTimeout(()=> window.setGlobalLang('hi'), 1500);
        return "ठीक है, भाषा को <strong>हिन्दी</strong> में बदल दिया गया है।";
      }
      return "I'm sorry, I couldn't change the language right now.";
    }
    if(q.includes('spanish') || q.includes('español')) {
      if(typeof window.setGlobalLang === 'function') {
        setTimeout(()=> window.setGlobalLang('es'), 1500);
        return "Claro, cambiando el idioma a <strong>Español</strong>...";
      }
      return "Lo siento, no pude cambiar el idioma en este momento.";
    }
    if(q.includes('english')) {
      if(typeof window.setGlobalLang === 'function') {
        setTimeout(()=> window.setGlobalLang('en'), 1500);
        return "Switching back to <strong>English</strong> for you.";
      }
      return "I'm sorry, I couldn't change the language right now.";
    }

    // PRICE CHECK & PRODUCT SEARCH
    if(q.includes('price') || q.includes('how much') || q.includes('cost')) {
      const all = typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
      if(all.length === 0) return "I don't have access to the product list right now, but you can check them on the Home page!";
      const match = all.find(p => q.includes(p.name.toLowerCase()) || q.includes(p.category.toLowerCase()));
      if(match) {
        let resp = `The price of <strong>${match.name}</strong> is <strong>${safeFormat(match.price)}</strong>.`;
        if(match.location) {
          resp += `<br><br>📍 You can find it at:<br><strong>${match.location.floor} Floor, ${match.location.hall} Hall, ${match.location.section}</strong>.`;
        }
        return resp;
      }
      return "I couldn't find that specific item's price. Try asking about 'Rice', 'Milk' or 'Chips'.";
    }

    // CART MANAGEMENT
    if(q.includes('add') && (q.includes('cart') || q.includes('basket'))) {
      const all = typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
      const match = all.find(p => q.includes(p.name.toLowerCase()));
      if(match && typeof addToCart === 'function') {
        addToCart(match);
        return `✅ Done! I've added <strong>${match.name}</strong> to your cart.`;
      }
      return "I'm sorry, I can't add items to the cart from this page.";
    }

    if(q.includes('clear') || q.includes('empty')) {
      localStorage.setItem('ssc_cart', '[]');
      if(typeof updateCartBadge === 'function') updateCartBadge();
      return "🗑️ Your cart has been cleared. Time to start fresh!";
    }

    // GENERAL HELP
    if(q.includes('help') || q.includes('what can you do')) {
      return "I can help you <strong>check prices</strong>, <strong>add items to cart</strong>, <strong>change languages</strong>, or <strong>navigate</strong> the app. Just ask!";
    }

    return "I'm not quite sure about that, but I'm learning! 🤖 Try asking to 'Show my cart', 'Price of Milk', or 'Switch to Hindi'.";
  }

})();


