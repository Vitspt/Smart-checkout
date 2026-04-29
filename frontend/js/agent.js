// SmartCheckout AI Assistant - Top-Action Symbolized Version
(function(){
  const safeT = (k) => (typeof window.t === 'function' ? window.t(k) : k);
  
  const style = document.createElement('style');
  style.innerHTML = `
    .ai-fab { position: fixed; bottom: calc(var(--nav) + 16px); left: 16px; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #ef4d23, #f97316); color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(239,77,35,.4); cursor: pointer; z-index: 1000; transition: all 0.3s ease; border: 2px solid rgba(255,255,255,.3); backdrop-filter: blur(4px); }
    .ai-fab:hover { transform: scale(1.1); }

    .ai-window { position: fixed; bottom: calc(var(--nav) + 85px); left: 16px; width: 350px; max-width: calc(100vw - 32px); height: 550px; max-height: 80vh; background: #0b0f1a; border-radius: 24px; box-shadow: 0 25px 60px rgba(0,0,0,.7); display: flex; flex-direction: column; overflow: hidden; z-index: 1001; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1); opacity: 0; transform: translateY(20px) scale(0.9); pointer-events: none; border: 1px solid rgba(255,255,255,0.08); }
    .ai-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

    .ai-header { background: linear-gradient(135deg, #ef4d23, #f97316); color: #fff; padding: 16px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
    .ai-title { font-weight: 900; font-size: 14px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 1px; }
    .ai-nav-btns { display: flex; gap: 4px; }
    .ai-nav-btn { background: rgba(255,255,255,0.1); border: none; color: #fff; cursor: pointer; padding: 6px; border-radius: 8px; display: flex; align-items: center; }
    .ai-nav-btn:hover { background: rgba(255,255,255,0.2); }

    .ai-actions-top { padding: 10px; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; }
    .ai-actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    
    .ai-action-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 8px 2px; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; transition: 0.2s; }
    .ai-action-btn:hover { border-color: var(--primary); background: rgba(239,77,35,0.1); transform: translateY(-1px); }
    .ai-action-btn .ai-icon { font-size: 18px; line-height: 1; }
    .ai-action-btn span { font-size: 8px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.3px; opacity: 0.9; }

    .ai-body { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column-reverse; gap: 12px; scrollbar-width: none; background: radial-gradient(circle at bottom, rgba(239,77,35,0.05), transparent); }
    .ai-body::-webkit-scrollbar { display: none; }
    
    .ai-msg { max-width: 90%; padding: 12px 14px; border-radius: 20px; font-size: 14px; line-height: 1.5; animation: popIn 0.3s ease-out; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    @keyframes popIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
    .ai-msg.bot { background: rgba(255,255,255,0.05); color: #fff; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid rgba(255,255,255,0.08); }
    .ai-msg.system { background: rgba(239,77,35,0.1); color: var(--primary); font-size: 10px; align-self: center; border-radius: 10px; padding: 4px 12px; font-weight: 800; border: 1px solid rgba(239,77,35,0.2); }
    
    .typing { display: flex; gap: 4px; padding: 4px 0; }
    .typing span { width: 5px; height: 5px; background: var(--primary); border-radius: 50%; animation: dotBounce 1.4s infinite ease-in-out; }
    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dotBounce { 0%, 80%, 100% { transform:scale(0.5); opacity:0.3; } 40% { transform:scale(1.2); opacity:1; } }
  `;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.id = 'ai-assistant-container';
  container.innerHTML = `
    <div class="ai-window" id="ai-win">
      <div class="ai-header">
        <div class="ai-title">✨ STORE ASSISTANT</div>
        <div class="ai-nav-btns">
          <button class="ai-nav-btn" onclick="agentAction('NAV_BACK')">⬅️</button>
          <button class="ai-nav-btn" onclick="agentAction('NAV_FORWARD')">➡️</button>
          <button class="ai-nav-btn" onclick="toggleAI()">❌</button>
        </div>
      </div>
      <div class="ai-actions-top">
        <div class="ai-actions-grid" id="ai-actions-grid"></div>
      </div>
      <div class="ai-body" id="ai-chat">
        <!-- New messages will be prepended here to stay at bottom -->
        <div class="ai-msg bot">Hello! Use the shortcuts above. My answers will appear here! 👇</div>
      </div>
    </div>
    <div class="ai-fab" onclick="toggleAI()">✨</div>
  `;
  document.body.appendChild(container);

  const ACTIONS = [
    { id: 'POINTS', icon: '⭐', label: 'Points' },
    { id: 'ORDERS', icon: '📜', label: 'History' },
    { id: 'HOW_TO_SCAN', icon: '📸', label: 'Scan' },
    { id: 'STATUS', icon: '🏪', label: 'Status' },
    { id: 'GROCERY', icon: '🍎', label: 'Grocery' },
    { id: 'SNACKS', icon: '🍿', label: 'Snacks' },
    { id: 'OFFERS', icon: '🏷️', label: 'Offers' },
    { id: 'CART', icon: '🛒', label: 'Cart' },
    { id: 'PROFILE', icon: '👤', label: 'Profile' },
    { id: 'LANG', icon: '🌐', label: 'Language' },
    { id: 'SUPPORT', icon: '🆘', label: 'Help' },
    { id: 'CLEAR_CART', icon: '🗑️', label: 'Clear' }
  ];

  function renderActions() {
    const grid = document.getElementById('ai-actions-grid');
    grid.innerHTML = ACTIONS.map(a => `
      <div class="ai-action-btn" onclick="agentAction('${a.id}')">
        <div class="ai-icon">${a.icon}</div>
        <span>${a.label}</span>
      </div>
    `).join('');
  }
  renderActions();

  window.toggleAI = function(){
    const win = document.getElementById('ai-win');
    win.classList.toggle('open');
  };

  window.agentAction = function(type){
    const chat = document.getElementById('ai-chat');
    
    // Create bot response bubble
    const b = document.createElement('div');
    b.className = 'ai-msg bot';
    b.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    
    // Prepend (due to flex-direction: column-reverse)
    chat.insertBefore(b, chat.firstChild);

    setTimeout(()=>{
      let resp = "Done!";
      let redirect = null;
      
      switch(type){
        case 'NAV_BACK': resp="Going back..."; redirect=()=>history.back(); break;
        case 'NAV_FORWARD': resp="Moving forward..."; redirect=()=>history.forward(); break;
        case 'POINTS': 
          const pts = typeof getPoints === 'function' ? getPoints() : 0;
          resp = `✨ Balance: <strong>${pts} Points</strong>.`; 
          break;
        case 'ORDERS': 
          if(!localStorage.getItem('ssc_user')) resp="⚠️ Login needed.";
          else { resp="Opening history..."; redirect=()=>location.href='profile.html#orders'; }
          break;
        case 'HOW_TO_SCAN': resp="Use Scan or AI capture! 📸"; break;
        case 'STATUS': resp="Store is <strong>Online</strong> 🏪"; break;
        case 'GROCERY': resp="Opening Grocery aisle..."; redirect=()=>location.href='category.html?c=Grocery'; break;
        case 'SNACKS': resp="Opening Snacks..."; redirect=()=>location.href='category.html?c=Snacks'; break;
        case 'LANG': resp="Switch language on Home page."; break;
        case 'PROFILE': redirect=()=>location.href=localStorage.getItem('ssc_user')?'profile.html':'login.html'; resp="Opening profile..."; break;
        case 'OFFERS': resp="Checking offers..."; redirect=()=>location.href='category.html?c=All'; break;
        case 'CART': resp="Opening cart..."; redirect=()=>location.href='cart.html'; break;
        case 'CLEAR_CART': 
          if(confirm('Clear cart?')){ if(typeof clearCart==='function') clearCart(); resp="🗑️ Cart cleared."; }
          else resp="Cart kept.";
          break;
        case 'SUPPORT': resp="Opening help..."; redirect=()=>location.href='support.html'; break;
      }
      
      b.innerHTML = resp;
      if(redirect) setTimeout(redirect, 2000);
    }, 800);
  };
})();


