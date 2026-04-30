const MOCK_PRODUCTS = [
  // Grocery
  { id: '1001', name: 'Premium Basmati Rice', brand: 'India Gate', price: 120, category: 'Grocery', emoji: '🌾', stock: 45, img: 'https://m.media-amazon.com/images/I/71R2oK+8mPL._SL1500_.jpg' },
  { id: '1005', name: 'Amul Pure Ghee', brand: 'Amul', price: 595, category: 'Grocery', emoji: '🥛', stock: 20, img: 'https://m.media-amazon.com/images/I/71Xm3x4T+TL._SL1500_.jpg' },
  { id: '1003', name: 'Fortune Sunflower Oil', brand: 'Fortune', price: 155, category: 'Grocery', emoji: '🌻', stock: 30 },
  
  // Snacks
  { id: '2001', name: "Lay's Classic Salted", brand: "Lay's", price: 20, category: 'Snacks', emoji: '🥔', stock: 100, img: 'https://m.media-amazon.com/images/I/81vjS9NnLhL._SL1500_.jpg' },
  { id: '2003', name: 'Dairy Milk Silk', brand: 'Cadbury', price: 80, category: 'Snacks', emoji: '🍫', stock: 60, img: 'https://m.media-amazon.com/images/I/61M-W0W-7SL._SL1500_.jpg' },
  { id: '2005', name: 'Oreo Biscuits', brand: 'Oreo', price: 35, category: 'Snacks', emoji: '🍪', stock: 85, img: 'https://m.media-amazon.com/images/I/61N+U-z1SLL._SL1500_.jpg' },
  
  // Drinks
  { id: '3001', name: 'Bisleri Water 1L', brand: 'Bisleri', price: 20, category: 'Drinks', emoji: '💧', stock: 200 },
  { id: '3003', name: 'Coca-Cola 500ml', brand: 'Coca-Cola', price: 40, category: 'Drinks', emoji: '🥤', stock: 120 },
  { id: '3005', name: 'Tropicana Orange', brand: 'Tropicana', price: 95, category: 'Drinks', emoji: '🍊', stock: 40 },
  
  // Produce
  { id: '4001', name: 'Fresh Apples (4pc)', brand: 'FarmFresh', price: 160, category: 'Produce', emoji: '🍎', stock: 25 },
  { id: '4003', name: 'Organic Bananas (6pc)', brand: 'FarmFresh', price: 40, category: 'Produce', emoji: '🍌', stock: 50 }
];

const CAT_EMOJIS = {
  'All': '📦',
  'Grocery': '🌾',
  'Snacks': '🍫',
  'Drinks': '🥤',
  'Produce': '🍎'
};

async function fetchProducts() {
  // Simulate API delay
  return new Promise(resolve => setTimeout(() => resolve(MOCK_PRODUCTS), 100));
}

function getProductByBarcode(id) {
  return MOCK_PRODUCTS.find(p => p.id === id);
}

function searchProducts(query) {
  const q = query.toLowerCase();
  return MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}
