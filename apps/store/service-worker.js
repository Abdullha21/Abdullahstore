const CACHE_NAME = "abdullah-store-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/products.html",
  "/cart.html",
  "/offline.html",
  "/css/variables.css",
  "/css/base.css",
  "/css/components.css",
  "/css/layout.css",
  "/css/home.css",
  "/css/product.css",
  "/css/checkout.css",
  "/css/responsive.css",
  "/js/app.js",
  "/js/cart.js",
  "/js/ui.js",
  "/js/utils.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache API, admin, or payment endpoints
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        })
      );
    })
  );
});
