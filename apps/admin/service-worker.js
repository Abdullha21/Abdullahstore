const CACHE_NAME = "abdullah-admin-v1";
self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => self.clients.claim());
self.addEventListener("fetch", (e) => {
  // Pass-through network for admin console
  e.respondWith(fetch(e.request).catch(() => caches.match("/offline.html")));
});
