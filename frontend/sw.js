const CACHE_NAME = 'smartcheckout-v2';
const ASSETS = [
  'home.html', 'category.html', 'scanner.html', 'cart.html', 'profile.html', 'product.html', 'payment.html', 'qrcode.html', 'support.html',
  'css/style.css', 'js/config.js', 'js/products.js', 'js/cart.js', 'js/auth.js', 'js/shopStatus.js', 'js/list.js', 'js/ai.js', 'js/agent.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
