// ============================================
// SmartCheckout — Product System (Full Data)
// ============================================

const DEFAULT_PRODUCTS = [
  { id:'1001', barcode:'1001', name:'India Gate Basmati Rice', brand:'India Gate', category:'Grocery', price:89, mrp:110, emoji:'🍚', stock:50, img:'img/products/india gate basmati rice.jpeg', location:{ floor:'G', section:'Aisle 4', hall:'Main Hall', tab:'T12', row:'R05' } },
  { id:'1002', barcode:'1002', name:'Aashirvaad Whole Wheat Atta', brand:'ITC', category:'Grocery', price:62, mrp:75, emoji:'🌾', stock:35, img:'img/products/Aashirvaad Whole Wheat Atta.png', location:{ floor:'G', section:'Aisle 3', hall:'Main Hall', tab:'T08', row:'R12' } },
  { id:'1003', barcode:'1003', name:'Fortune Sunflower Oil', brand:'Fortune', category:'Grocery', price:148, mrp:180, emoji:'🫙', stock:25, img:'img/sunflower.jpg', location:{ floor:'G', section:'Aisle 5', hall:'Main Hall', tab:'T15', row:'R03' } },
  { id:'1004', barcode:'1004', name:'Tata Salt Iodised', brand:'Tata', category:'Grocery', price:22, mrp:28, emoji:'🧂', stock:100, img:'img/products/Tata Salt Iodised.webp', location:{ floor:'G', section:'Aisle 4', hall:'Main Hall', tab:'T12', row:'R07' } },
  { id:'1005', barcode:'1005', name:'Amul Taaza Milk 1L', brand:'Amul', category:'Grocery', price:64, mrp:66, emoji:'🥛', stock:40, img:'img/products/Amul Taaza Milk 1L.png', location:{ floor:'G', section:'Dairy', hall:'North Hall', tab:'D01', row:'R01' } },
  { id:'1006', barcode:'1006', name:'Fresh Farm Eggs (12pcs)', brand:'Generic', category:'Grocery', price:96, mrp:110, emoji:'🥚', stock:30, img:'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600&q=80', location:{ floor:'G', section:'Dairy', hall:'North Hall', tab:'D01', row:'R03' } },
  { id:'1007', barcode:'1007', name:'Brown Bread', brand:'Harvest Gold', category:'Grocery', price:45, mrp:50, emoji:'🍞', stock:20, img:'img/products/Brown Bread.jpg', location:{ floor:'G', section:'Bakery', hall:'Main Hall', tab:'B01', row:'R02' } },
  { id:'1008', barcode:'1008', name:'Amul Butter 500g', brand:'Amul', category:'Grocery', price:255, mrp:275, emoji:'🧈', stock:55, img:'img/products/Amul Butter 500g.webp', location:{ floor:'G', section:'Dairy', hall:'North Hall', tab:'D02', row:'R04' } },
  { id:'1009', barcode:'1009', name:'Organic Honey 250g', brand:'Dabur', category:'Grocery', price:145, mrp:160, emoji:'🍯', stock:30, img:'img/products/Organic Honey 250g.jpeg', location:{ floor:'G', section:'Aisle 6', hall:'Main Hall', tab:'T18', row:'R09' } },
  { id:'1010', barcode:'1010', name:'Toor Dal 1kg', brand:'Patanjali', category:'Grocery', price:165, mrp:185, emoji:'🫘', stock:45, img:'img/products/Toor Dal 1kg.jpeg', location:{ floor:'G', section:'Pulses', hall:'Main Hall', tab:'T10', row:'R06' } },
  { id:'8909081007811', barcode:'8909081007811', name:"Lay's Classic Salted", brand:"Lay's", category:'Snacks', price:10, mrp:10, emoji:'🥔', stock:150, img:'img/products/lays.jpeg', location:{ floor:'G', section:'Snack Zone', hall:'East Wing', tab:'S02', row:'R01' } },
  { id:'2002', barcode:'2002', name:'Britannia Good Day', brand:'Britannia', category:'Snacks', price:35, mrp:40, emoji:'🍪', stock:120, img:'img/products/Britannia Good Day.jpg', location:{ floor:'G', section:'Biscuits', hall:'East Wing', tab:'S04', row:'R02' } },
  { id:'8901063019232', barcode:'8901063019232', name:'Dairy Milk Silk', brand:'Cadbury', category:'Snacks', price:80, mrp:85, emoji:'🍫', stock:90, img:'img/products/Dairy Milk Silk.jpg', location:{ floor:'G', section:'Confectionery', hall:'East Wing', tab:'S08', row:'R04' } },
  { id:'2004', barcode:'2004', name:'Kurkure Masala Munch', brand:'PepsiCo', category:'Snacks', price:20, mrp:20, emoji:'🌽', stock:180, img:'img/products/Kurkure Masala Munch.jpg', location:{ floor:'G', section:'Snack Zone', hall:'East Wing', tab:'S02', row:'R05' } },
  { id:'8901719130014', barcode:'8901719130014', name:'Oreo Original 120g', brand:'Oreo', category:'Snacks', price:40, mrp:40, emoji:'🍪', stock:100, img:'img/products/Oreo Original 120g.jpg', location:{ floor:'G', section:'Biscuits', hall:'East Wing', tab:'S04', row:'R06' } },
  { id:'2006', barcode:'2006', name:'Haldiram Aloo Bhujia', brand:'Haldiram', category:'Snacks', price:55, mrp:60, emoji:'🌿', stock:45, img:'img/products/Haldiram Aloo Bhujia.jpeg', location:{ floor:'G', section:'Namkeen', hall:'East Wing', tab:'S06', row:'R03' } },
  { id:'2007', barcode:'2007', name:'Maggi Masala Noodles', brand:'Nestle', category:'Snacks', price:14, mrp:14, emoji:'🍜', stock:200, img:'img/products/Maggi Masala Noodles.jpg', location:{ floor:'G', section:'Instant Food', hall:'East Wing', tab:'S10', row:'R08' } },
  { id:'2008', barcode:'2008', name:'Act II Popcorn Butter', brand:'Act II', category:'Snacks', price:35, mrp:40, emoji:'🍿', stock:80, img:'img/products/Act II Popcorn Butter.jpg', location:{ floor:'G', section:'Snack Zone', hall:'East Wing', tab:'S03', row:'R07' } },
  { id:'3001', barcode:'3001', name:'Bisleri Mineral Water 1L', brand:'Bisleri', category:'Drinks', price:20, mrp:20, emoji:'💧', stock:300, img:'img/products/Bisleri Mineral Water 1L.jpg', location:{ floor:'G', section:'Cold Storage', hall:'North Hall', tab:'D05', row:'R10' } },
  { id:'3002', barcode:'3002', name:'Tropicana Orange Juice', brand:'Tropicana', category:'Drinks', price:110, mrp:130, emoji:'🍊', stock:40, img:'img/products/Tropicana Orange Juice.jpg', location:{ floor:'G', section:'Juices', hall:'North Hall', tab:'D06', row:'R02' } },
  { id:'3003', barcode:'3003', name:'Coca-Cola 750ml', brand:'Coca-Cola', category:'Drinks', price:45, mrp:50, emoji:'🥤', stock:150, img:'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=80', location:{ floor:'G', section:'Cold Storage', hall:'North Hall', tab:'D08', row:'R05' } },
  { id:'3004', barcode:'3004', name:'Red Bull Energy Drink', brand:'Red Bull', category:'Drinks', price:125, mrp:125, emoji:'🐂', stock:60, img:'img/products/Red Bull Energy Drink.jpg', location:{ floor:'G', section:'Energy Drinks', hall:'North Hall', tab:'D09', row:'R01' } },
  { id:'3005', barcode:'3005', name:'Nescafe Classic 50g', brand:'Nescafe', category:'Drinks', price:165, mrp:185, emoji:'☕', stock:45, img:'img/products/Nescafe Classic 50g.jpg', location:{ floor:'G', section:'Tea & Coffee', hall:'Main Hall', tab:'T20', row:'R11' } },
  { id:'3006', barcode:'3006', name:'Tata Tea Gold 250g', brand:'Tata Tea', category:'Drinks', price:145, mrp:160, emoji:'🫖', stock:70, img:'img/products/Tata Tea Gold 250g.jpeg', location:{ floor:'G', section:'Tea & Coffee', hall:'Main Hall', tab:'T20', row:'R12' } },
  { id:'3007', barcode:'3007', name:'Sprite 1.25L', brand:'Coca-Cola', category:'Drinks', price:65, mrp:70, emoji:'🍋', stock:100, img:'img/products/Sprite 1.25L.jpg', location:{ floor:'G', section:'Cold Storage', hall:'North Hall', tab:'D08', row:'R06' } },
  { id:'4001', barcode:'4001', name:'Dove Beauty Bar', brand:'Dove', category:'Personal Care', price:48, mrp:55, emoji:'🧼', stock:200, img:'img/products/Dove Beauty Bar.jpeg', location:{ floor:'1st', section:'Bath & Body', hall:'West Hall', tab:'B02', row:'R15' } },
  { id:'4002', barcode:'4002', name:'Head & Shoulders', brand:'P&G', category:'Personal Care', price:149, mrp:175, emoji:'🧴', stock:75, img:'img/products/Head & Shoulders.jpg', location:{ floor:'1st', section:'Hair Care', hall:'West Hall', tab:'B04', row:'R08' } },
  { id:'4003', barcode:'4003', name:'Colgate MaxFresh', brand:'Colgate', category:'Personal Care', price:95, mrp:110, emoji:'🦷', stock:140, img:'img/products/Colgate MaxFresh.jpeg', location:{ floor:'1st', section:'Oral Care', hall:'West Hall', tab:'B06', row:'R03' } },
  { id:'4004', barcode:'4004', name:'Dettol Liquid Handwash', brand:'Dettol', category:'Personal Care', price:85, mrp:99, emoji:'🤲', stock:160, img:'img/products/Dettol Liquid Handwash.jpg', location:{ floor:'1st', section:'Bath & Body', hall:'West Hall', tab:'B02', row:'R18' } },
  { id:'4005', barcode:'4005', name:'Nivea Body Milk', brand:'Nivea', category:'Personal Care', price:245, mrp:299, emoji:'💆', stock:50, img:'img/products/Nivea Body Milk.jpeg', location:{ floor:'1st', section:'Skin Care', hall:'West Hall', tab:'B08', row:'R05' } },
  { id:'4006', barcode:'4006', name:'Gillette Mach3 Razor', brand:'Gillette', category:'Personal Care', price:210, mrp:250, emoji:'🪒', stock:40, img:'img/products/Gillette Mach3 Razor.jpeg', location:{ floor:'1st', section:'Grooming', hall:'West Hall', tab:'B10', row:'R02' } },
  { id:'5001', barcode:'5001', name:'Fresh Banana', brand:'Organic', category:'Produce', price:40, mrp:50, emoji:'🍌', stock:500, img:'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80', location:{ floor:'G', section:'Fruits', hall:'Main Hall', tab:'F01', row:'R02' } },
  { id:'5002', barcode:'5002', name:'Red Onion', brand:'Organic', category:'Produce', price:35, mrp:45, emoji:'🧅', stock:400, img:'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&q=80', location:{ floor:'G', section:'Vegetables', hall:'Main Hall', tab:'F03', row:'R04' } },
  { id:'5003', barcode:'5003', name:'Fresh Tomato', brand:'Organic', category:'Produce', price:25, mrp:35, emoji:'🍅', stock:350, img:'img/products/Fresh Tomato.jpeg', location:{ floor:'G', section:'Vegetables', hall:'Main Hall', tab:'F03', row:'R06' } },
  { id:'5004', barcode:'5004', name:'Fuji Apple', brand:'Imported', category:'Produce', price:180, mrp:220, emoji:'🍎', stock:150, img:'img/products/Fuji Apple.jpeg', location:{ floor:'G', section:'Fruits', hall:'Main Hall', tab:'F02', row:'R08' } },
  { id:'6001', barcode:'6001', name:'Classmate Notebook', brand:'ITC', category:'Stationery', price:60, mrp:65, emoji:'📓', stock:100, img:'img/products/Classmate Notebook.jpg', location:{ floor:'1st', section:'Books', hall:'West Hall', tab:'W02', row:'R11' } },
  { id:'6002', barcode:'6002', name:'Parker Vector Ball Pen', brand:'Parker', category:'Stationery', price:250, mrp:250, emoji:'🖋️', stock:30, img:'img/products/Parker Vector Ball Pen.jpg', location:{ floor:'1st', section:'Writing', hall:'West Hall', tab:'W04', row:'R09' } }
];

const DATA_VERSION = '1.0.5'; // Update this to force refresh

async function fetchProducts() {
  try {
    const v = localStorage.getItem('ssc_products_v');
    if (v !== DATA_VERSION) {
      localStorage.removeItem('ssc_products');
      localStorage.setItem('ssc_products_v', DATA_VERSION);
    }

    const local = localStorage.getItem('ssc_products');
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && parsed.length > 0) return parsed;
    }
  } catch(e) {}
  localStorage.setItem('ssc_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

function saveProducts(prods) {
  localStorage.setItem('ssc_products', JSON.stringify(prods));
}

function getProductById(id) {
  const prods = JSON.parse(localStorage.getItem('ssc_products') || JSON.stringify(DEFAULT_PRODUCTS));
  // Check both ID and Barcode for maximum compatibility
  return prods.find(p => p.id === id || p.barcode === id);
}

function searchProducts(q) {
  const prods = JSON.parse(localStorage.getItem('ssc_products') || JSON.stringify(DEFAULT_PRODUCTS));
  if (!q) return prods;
  q = q.toLowerCase();
  return prods.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.barcode && p.barcode.includes(q)));
}

function discount(mrp, price) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

function formatPrice(p) {
  return '₹' + parseFloat(p).toFixed(2);
}
