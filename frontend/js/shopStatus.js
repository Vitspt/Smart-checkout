function updateShopStatus() {
  const statusContainer = document.getElementById('shop-status-container');
  if (!statusContainer) return;

  const config = window.SHOP_CONFIG || { isOpen: true, openTime: "08:00", closeTime: "22:00" };
  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
  
  const isActive = config.isOpen && (currentTime >= config.openTime && currentTime <= config.closeTime);
  
  const statusLabel = isActive ? window.t('status_active') : window.t('status_inactive');
  const statusClass = isActive ? 'status-active' : 'status-inactive';
  
  statusContainer.innerHTML = `
    <div class="shop-status ${statusClass}">
      <span class="status-dot"></span>
      <span>${statusLabel}</span>
    </div>
  `;
}

// Initial update and periodic check
document.addEventListener('DOMContentLoaded', () => {
  updateShopStatus();
  setInterval(updateShopStatus, 60000); // Check every minute
});

// Update if language changes
window.addEventListener('languagechange', updateShopStatus);
