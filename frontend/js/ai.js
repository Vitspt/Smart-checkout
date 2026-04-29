// ============================================
// SmartCheckout — AI Recommendation Engine
// ============================================
const ASSOCIATIONS = {
  '1001': ['1005', '1006'], // Rice -> Ghee, Dal
  '1005': ['1001', '1006'], // Ghee -> Rice, Dal
  '2001': ['3003', '2003'], // Chips -> Coke, Chocolate
  '2003': ['3003', '2001'], // Chocolate -> Coke, Chips
  '3001': ['2001', '2004'], // Water -> Chips, Kurkure
  '3003': ['2001', '2007'], // Coke -> Chips, KitKat
  '4001': ['4002', '4003'], // Soap -> Shampoo, Toothpaste
  '4002': ['4001', '4005'], // Shampoo -> Soap, Handwash
};

function getRecommendations(cartItems){
  const recIds = new Set();
  cartItems.forEach(item => {
    const matched = ASSOCIATIONS[item.id] || [];
    matched.forEach(id => {
      // Don't recommend if already in cart
      if(!cartItems.find(ci => ci.id === id)) recIds.add(id);
    });
  });
  
  // If no specific associations, recommend top rated
  if(recIds.size === 0){
    return PRODUCTS.filter(p => p.rating >= 4.7).slice(0, 3);
  }
  
  return Array.from(recIds).map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean).slice(0, 3);
}
