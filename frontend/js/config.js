// ============================================
// SmartCheckout — Global Configuration
// ============================================
const STORE_NAME = 'SmartCheckout';
const STORE_TAGLINE = 'In-Store Smart Checkout';
const TAX_RATE = 0;        // 0% GST (Removed)
const PLATFORM_FEE = 0;       // no platform fee

const CATEGORIES = ['All','Grocery','Snacks','Drinks','Personal Care'];
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
  ? 'http://localhost:5000/api' 
  : '/api';

// Global Dark Mode Init
if(localStorage.getItem('ssc_dark') === 'true'){
  document.body.classList.add('dark');
}

const CAT_ICONS = {
  'All':'🛍️',  'Grocery': '🥦', 'Snacks': '🍿', 'Drinks': '🥤', 'Personal Care': '🧴', 'Produce': '🍎'
};
const CAT_COLORS = {
  'All':'#f0fdf4','Grocery':'#fef9ee','Snacks':'#fdf2f8','Drinks':'#eff6ff','Personal Care':'#fdf4ff'
};

const SHOP_CONFIG = {
  isOpen: true,
  openTime: "08:00",
  closeTime: "22:00",
  statusActive: "Active Now",
  statusInactive: "Closed"
};

// ============================================
// Native Multi-Language Engine (i18n)
// ============================================
const DICT = {
  'en': {
    'nav_home': 'Home', 'nav_shop': 'All Categories', 'nav_cart': 'Cart', 'nav_profile': 'Profile',
    'app_title': 'SmartCheckout', 'cat_all': 'All Categories', 'btn_add': 'Add to Cart',
    'scan_btn': 'Start Camera Scan', 'damaged_qr': 'DAMAGED BARCODE?', 'img_scan': 'Capture Item from Camera',
    'profile_title': 'Profile', 'settings': 'Settings', 'notif': 'Notifications', 'help': 'Help & FAQ', 'logout': 'Sign Out', 'sign_in': 'Sign In', 'sign_up': 'Sign Up',
    'recent': 'Recently Added', 'manual_scan': 'OR ENTER BARCODE',
    'search_placeholder': 'Search products, brands...', 'promo1_title': 'Save up to 20%', 'promo1_desc': 'On all grocery items today!',
    'promo2_title': 'Smart In-Store', 'promo2_desc': 'Scan & pay in under 2 mins', 'shop_category': 'Shop by Category',
    'cat_grocery': 'Grocery', 'cat_snacks': 'Snacks', 'cat_drinks': 'Drinks', 'cat_care': 'Personal Care',
    'cat_produce': 'Fresh Produce', 'shopping_list': 'My Shopping List', 'just_for_you': 'Just for You', 'see_all': 'See all',
    'banner_limited': '🎉 LIMITED OFFER', 'banner_fast': '⚡ FAST CHECKOUT', 'banner_snacks': '🍫 SNACKS',
    'banner_new': 'New Arrivals', 'banner_fresh': 'Fresh stock of your favourites',
    'trending_now': 'Trending Now', 'view_all': 'View all', 'search_results_title': 'Search Results',
    'cart_title': 'Your Cart', 'checkout_btn': 'Proceed to Checkout', 'total': 'Total', 'tax': 'Tax', 'back': 'Back',
    'filters': 'Filters', 'price_label': 'Price', 'unit_label': 'Unit', 'qty_label': 'Qty',
    'items_in_cart': 'items in your cart', 'empty_cart': 'Your cart is empty', 'empty_cart_msg': 'Add items to start your checkout',
    'browse_products': 'Browse Products', 'apply_coupon': 'Apply Coupon', 'coupon_placeholder': 'Enter coupon code', 'apply': 'Apply',
    'price_breakdown': 'Price Breakdown', 'mrp_total': 'MRP Total', 'discount': 'Discount', 'gst': 'GST (5%)',
    'total_amount': 'Total Amount', 'save_msg': 'You save', 'add_more': '+ Add more items', 'proceed_payment': 'Proceed to Payment',
    'category_label': 'Category', 'scan_buy': 'Scan Barcode to Buy',
    'search_in_cat': 'Search in category...', 'sort_popular': '🔥 Popular', 'sort_low': '💲 Price: Low to High', 'sort_high': '📈 Price: High to Low',
    'product_details': 'Product Details', 'brand_label': 'Brand', 'product_not_found': 'Product not found', 'go_home': 'Go Home',
    'about_product': 'About this product', 'barcode_id': 'Barcode ID', 'mrp_label': 'MRP', 'rating_label': 'Rating',
    'profile_my': 'My Profile', 'profile_account': 'Account Information', 'profile_name': 'Full Name', 'profile_email': 'Email', 'profile_phone': 'Phone',
    'profile_joined': 'Member Since', 'profile_membership': 'Membership', 'profile_actions': 'Quick Actions', 'profile_scan': 'Scan Products',
    'profile_support': 'Help & Support', 'profile_logout': 'Sign Out', 'profile_clear': 'Clear All Data',
    'profile_tab_prof': 'Profile', 'profile_tab_ord': 'Orders', 'profile_tab_scan': 'Scan History', 'profile_tab_sett': 'Settings', 'agent_title': 'Store Assistant AI', 'agent_welcome': 'Hi! I am your AI assistant. How can I help you shop today?',
    'agent_placeholder': 'Ask me anything...', 'agent_cap_price': 'Check Price', 'agent_cap_add': 'Add to Cart', 'agent_cap_nav': 'Navigate Site',
    'agent_cap_lang': 'Change Language',
    'support_title': 'Help & Support', 'support_how_use': '📖 How to Use SmartCheckout', 'support_faq_title': '❓ Frequently Asked Questions',
    'support_contact_title': '📬 Contact Support', 'support_form_name': 'Your Name', 'support_form_email': 'Email',
    'support_form_msg': 'Issue Description', 'support_form_submit': 'Submit Request',
    'status_active': 'Shop Active', 'status_inactive': 'Shop Closed',
    'floor_label': 'Floor', 'section_label': 'Section', 'hall_label': 'Hall', 'tab_label': 'Tab', 'row_label': 'Row',
    'ai_analyzing': 'AI Visual Recognition', 'ai_step_1': 'Capturing frame...', 'ai_step_2': 'Extracting features...', 'ai_step_3': 'Matching with database...', 'ai_step_4': 'Product identified!',
    'ai_badge': 'AI RECOGNIZED'
  },
  'es': {
    'nav_home': 'Inicio', 'nav_shop': 'Todas las categorías', 'nav_cart': 'Carrito', 'nav_profile': 'Perfil',
    'app_title': 'SmartCheckout', 'cat_all': 'Todas las categorías', 'btn_add': 'Añadir al Carrito',
    'scan_btn': 'Iniciar Cámara', 'damaged_qr': '¿CÓDIGO DAÑADO?', 'img_scan': 'Reconocer por Cámara',
    'profile_title': 'Mi Perfil', 'settings': 'Ajustes', 'notif': 'Notificaciones', 'help': 'Ayuda y Preguntas', 'logout': 'Cerrar Sesión', 'sign_in': 'Iniciar Sesión', 'sign_up': 'Registrarse',
    'recent': 'Añadido Recientemente', 'manual_scan': 'O INGRESA EL CÓDIGO',
    'search_placeholder': 'Buscar productos, marcas...', 'promo1_title': 'Ahorra hasta 20%', 'promo1_desc': '¡En todos los abarrotes hoy!',
    'promo2_title': 'Tienda Inteligente', 'promo2_desc': 'Escanea y paga en 2 mins', 'shop_category': 'Comprar por Categoría',
    'cat_grocery': 'Abarrotes', 'cat_snacks': 'Aperitivos', 'cat_drinks': 'Bebidas', 'cat_care': 'Cuidado Personal',
    'just_for_you': 'Para Ti', 'see_all': 'Ver todo',
    'banner_limited': '🎉 OFERTA LIMITADA', 'banner_fast': '⚡ PAGO RÁPIDO', 'banner_snacks': '🍫 APERITIVOS',
    'banner_new': 'Nuevas Llegadas', 'banner_fresh': 'Stock fresco de tus favoritos',
    'trending_now': 'Tendencias Ahora', 'view_all': 'Ver todo', 'search_results_title': 'Resultados de Búsqueda',
    'cart_title': 'Tu Carrito', 'checkout_btn': 'Continuar al Pago', 'total': 'Total', 'tax': 'Impuesto', 'back': 'Volver',
    'filters': 'Filtros', 'price_label': 'Precio', 'unit_label': 'Unidad', 'qty_label': 'Cant',
    'items_in_cart': 'artículos en tu carrito', 'empty_cart': 'Tu carrito está vacío', 'empty_cart_msg': 'Añade artículos para comenzar el pago',
    'browse_products': 'Explorar Productos', 'apply_coupon': 'Aplicar Cupón', 'coupon_placeholder': 'Ingresa código de cupón', 'apply': 'Aplicar',
    'price_breakdown': 'Desglose de Precios', 'mrp_total': 'Total MRP', 'discount': 'Descuento', 'gst': 'IVA (5%)',
    'total_amount': 'Monto Total', 'save_msg': 'Ahorras', 'add_more': '+ Añadir más artículos', 'proceed_payment': 'Continuar al Pago',
    'category_label': 'Categoría', 'scan_buy': 'Escanear Barcode para Comprar',
    'search_in_cat': 'Buscar en categoría...', 'sort_popular': '🔥 Popular', 'sort_low': '💲 Precio: Bajo a Alto', 'sort_high': '📈 Precio: Alto a Bajo',
    'product_details': 'Detalles del Producto', 'brand_label': 'Marca', 'product_not_found': 'Producto no encontrado', 'go_home': 'Ir al Inicio',
    'about_product': 'Acerca de este producto', 'barcode_id': 'ID de Barcode', 'mrp_label': 'MRP', 'rating_label': 'Calificación',
    'profile_my': 'Mi Perfil', 'profile_account': 'Información de la Cuenta', 'profile_name': 'Nombre Completo', 'profile_email': 'Correo', 'profile_phone': 'Teléfono',
    'profile_joined': 'Miembro Desde', 'profile_membership': 'Membresía', 'profile_actions': 'Acciones Rápidas', 'profile_scan': 'Escanear Productos',
    'profile_support': 'Ayuda y Soporte', 'profile_logout': 'Cerrar Sesión', 'profile_clear': 'Borrar Todos los Datos',
    'profile_tab_prof': 'Perfil', 'profile_tab_ord': 'Pedidos', 'profile_tab_scan': 'Historial', 'profile_tab_sett': 'Ajustes', 'agent_title': 'Asistente IA', 'agent_welcome': '¡Hola! Soy tu asistente IA. ¿Cómo puedo ayudarte hoy?',
    'agent_placeholder': 'Pregúntame algo...', 'agent_cap_price': 'Ver Precio', 'agent_cap_add': 'Añadir al Carrito', 'agent_cap_nav': 'Navegar Sitio',
    'agent_cap_lang': 'Cambiar Idioma',
    'support_title': 'Ayuda y Soporte', 'support_how_use': '📖 Cómo usar SmartCheckout', 'support_faq_title': '❓ Preguntas Frecuentes',
    'support_contact_title': '📬 Contactar Soporte', 'support_form_name': 'Tu Nombre', 'support_form_email': 'Correo',
    'support_form_msg': 'Descripción del Problema', 'support_form_submit': 'Enviar Solicitud',
    'status_active': 'Tienda Activa', 'status_inactive': 'Tienda Cerrada',
    'floor_label': 'Piso', 'section_label': 'Sección', 'hall_label': 'Pasillo', 'tab_label': 'Mesa/Pestaña', 'row_label': 'Fila',
    'ai_analyzing': 'Reconocimiento Visual IA', 'ai_step_1': 'Capturando imagen...', 'ai_step_2': 'Extrayendo características...', 'ai_step_3': 'Buscando en base de datos...', 'ai_step_4': '¡Producto identificado!',
    'ai_badge': 'IDENTIFICADO POR IA'
  },
  'hi': {
    'nav_home': 'होम', 'nav_shop': 'सभी श्रेणियां', 'nav_cart': 'कार्ट', 'nav_profile': 'प्रोफ़ाइल',
    'app_title': 'स्मार्टचेकआउट', 'cat_all': 'सभी श्रेणियां', 'btn_add': 'कार्ट में डालें',
    'scan_btn': 'कैमरा शुरू करें', 'damaged_qr': 'खराब बारकोड?', 'img_scan': 'कैमरा से आइटम कैप्चर करें',
    'profile_title': 'प्रोफ़ाइल', 'settings': 'सेटिंग्स', 'notif': 'सूचनाएं', 'help': 'मदद', 'logout': 'लॉग आउट', 'sign_in': 'साइन इन करें', 'sign_up': 'साइन अप करें',
    'recent': 'हाल ही में जोड़ा गया', 'manual_scan': 'या बारकोड दर्ज करें',
    'search_placeholder': 'उत्पाद, ब्रांड खोजें...', 'promo1_title': '20% तक की छूट', 'promo1_desc': 'आज सभी किराने के सामान पर!',
    'promo2_title': 'स्मार्ट इन-स्टोर', 'promo2_desc': '2 मिनट में स्कैन और भुगतान', 'shop_category': 'श्रेणी के अनुसार खरीदारी',
    'cat_grocery': 'किराना', 'cat_snacks': 'स्नैक्स', 'cat_drinks': 'पेय', 'cat_care': 'निजी देखभाल',
    'just_for_you': 'आपके लिए', 'see_all': 'सभी देखें',
    'banner_limited': '🎉 सीमित प्रस्ताव', 'banner_fast': '⚡ तेज़ चेकआउट', 'banner_snacks': '🍫 स्नैक्स',
    'banner_new': 'नवागंतुक', 'banner_fresh': 'आपके पसंदीदा का ताज़ा स्टॉक',
    'trending_now': 'अभी ट्रेंडिंग', 'view_all': 'सभी देखें', 'search_results_title': 'खोज परिणाम',
    'cart_title': 'आपका कार्ट', 'checkout_btn': 'चेकआउट के लिए आगे बढ़ें', 'total': 'कुल', 'tax': 'कर', 'back': 'पीछे',
    'filters': 'फ़िल्टर', 'price_label': 'कीमत', 'unit_label': 'इकाई', 'qty_label': 'मात्रा',
    'items_in_cart': 'आपके कार्ट में आइटम', 'empty_cart': 'आपका कार्ट खाली है', 'empty_cart_msg': 'चेकआउट शुरू करने के लिए आइटम जोड़ें',
    'browse_products': 'उत्पादों ब्राउज़ करें', 'apply_coupon': 'कूपन लागू करें', 'coupon_placeholder': 'कूपन कोड दर्ज करें', 'apply': 'लागू करें',
    'price_breakdown': 'कीमत का विवरण', 'mrp_total': 'एमआरपी कुल', 'discount': 'छूट', 'gst': 'जीएसटी (5%)',
    'total_amount': 'कुल राशि', 'save_msg': 'आप बचाते हैं', 'add_more': '+ और आइटम जोड़ें', 'proceed_payment': 'भुगतान के लिए आगे बढ़ें',
    'category_label': 'श्रेणी', 'scan_buy': 'खरीदने के लिए बारकोड स्कैन करें',
    'search_in_cat': 'श्रेणी में खोजें...', 'sort_popular': '🔥 लोकप्रिय', 'sort_low': '💲 मूल्य: निम्न से उच्च', 'sort_high': '📈 मूल्य: उच्च से निम्न',
    'product_details': 'उत्पाद विवरण', 'brand_label': 'ब्रांड', 'product_not_found': 'उत्पाद नहीं मिला', 'go_home': 'होम पर जाएं',
    'about_product': 'इस उत्पाद के बारे में', 'barcode_id': 'बारकोड आईडी', 'mrp_label': 'एमआरपी', 'rating_label': 'रेटिंग',
    'profile_my': 'मेरी प्रोफ़ाइल', 'profile_account': 'खाता जानकारी', 'profile_name': 'पूरा नाम', 'profile_email': 'ईमेल', 'profile_phone': 'फ़ोन',
    'profile_joined': 'सदस्यता की तिथि', 'profile_membership': 'सदस्यता', 'profile_actions': 'त्वरित कार्रवाई', 'profile_scan': 'उत्पादों को स्कैन करें',
    'profile_support': 'मदद और सहायता', 'profile_logout': 'लॉग आउट', 'profile_clear': 'सभी डेटा मिटाएं',
    'profile_tab_prof': 'प्रोफ़ाइल', 'profile_tab_ord': 'आदेश', 'profile_tab_scan': 'स्कैन इतिहास', 'profile_tab_sett': 'सेटिंग्स', 'agent_title': 'एआई सहायक', 'agent_welcome': 'नमस्ते! मैं आपका एआई सहायक हूं। आज मैं आपकी खरीदारी में कैसे मदद कर सकता हूं?',
    'agent_placeholder': 'मुझसे कुछ भी पूछें...', 'agent_cap_price': 'कीमत जांचें', 'agent_cap_add': 'कार्ट में जोड़ें', 'agent_cap_nav': 'साइट नेविगेट करें',
    'agent_cap_lang': 'भाषा बदलें',
    'support_title': 'मदद और सहायता', 'support_how_use': '📖 स्मार्टचेकआउट का उपयोग कैसे करें', 'support_faq_title': '❓ अक्सर पूछे जाने वाले प्रश्न',
    'support_contact_title': '📬 समर्थन से संपर्क करें', 'support_form_name': 'आपका नाम', 'support_form_email': 'ईमेल',
    'support_form_msg': 'समस्या का विवरण', 'support_form_submit': 'अनुरोध सबमिट करें',
    'status_active': 'दुकान चालू है', 'status_inactive': 'दुकान बंद है',
    'floor_label': 'मंजिल', 'section_label': 'अनुभाग', 'hall_label': 'हॉल', 'tab_label': 'टैब', 'row_label': 'पंक्ति',
    'ai_analyzing': 'एआई विज़ुअल रिकग्निशन', 'ai_step_1': 'फ्रेम कैप्चर कर रहा है...', 'ai_step_2': 'विशेषताएँ निकाल रहा है...', 'ai_step_3': 'डेटाबेस से मिलान कर रहा है...', 'ai_step_4': 'उत्पाद की पहचान हो गई!',
    'ai_badge': 'AI द्वारा पहचाना गया'
  }
};

window.t = function(key) {
  const lang = localStorage.getItem('ssc_lang_code') || 'en';
  if(!DICT[lang]) return DICT['en'][key] || key;
  return DICT[lang][key] || DICT['en'][key] || key;
};

let i18nObserver = null;

window.applyNativeLanguage = function() {
  if (i18nObserver) i18nObserver.disconnect();

  const lang = localStorage.getItem('ssc_lang_code') || 'en';
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = window.t(key);
    
    if (translated === key && lang !== 'en') return;

    if(el.classList.contains('ni')) {
       const icon = el.querySelector('.material-icons');
       el.innerHTML = '';
       if(icon) el.appendChild(icon);
       if(el.classList.contains('badge')) {
           const b = document.createElement('span');
           b.className = 'badge-dot cart-badge';
           b.style.display = 'none';
           b.textContent = '0';
           el.appendChild(b);
       }
       el.appendChild(document.createTextNode(translated));
    } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
       el.placeholder = translated;
    } else if (el.classList.contains('menu-item') && el.querySelector('.label')) {
       el.querySelector('.label').textContent = translated;
    } else {
       if (translated.includes('<') || translated.includes('&')) {
         if (el.innerHTML !== translated) el.innerHTML = translated;
       } else {
         if (el.textContent !== translated) el.textContent = translated;
       }
    }
  });
  
  if (typeof updateCartBadge === 'function') updateCartBadge();

  const sel = document.getElementById('lang-select');
  if(sel) sel.value = lang;

  if (i18nObserver) {
    i18nObserver.observe(document.body, { childList: true, subtree: true });
  }
};

window.setGlobalLang = function(code) {
  localStorage.setItem('ssc_lang_code', code);
  applyNativeLanguage();
  // Dispatch event for other scripts to know language changed
  window.dispatchEvent(new Event('languagechange'));
};

// Auto-apply on load and also watch for dynamic content
document.addEventListener('DOMContentLoaded', () => {
  // Setup Observer first so it's ready for applyNativeLanguage to use
  i18nObserver = new MutationObserver((mutations) => {
    let shouldTranslate = false;
    for (let m of mutations) {
      if (m.addedNodes.length) { shouldTranslate = true; break; }
    }
    if (shouldTranslate) applyNativeLanguage();
  });
  
  applyNativeLanguage();
});
