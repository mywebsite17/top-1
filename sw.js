const CACHE_NAME = 'pwa-cache-v1782176129195';
const urlsToCache = [ './', './index.html?v=v1782176129195', './offline.html?v=v1782176129195', './icon-192.png?v=v1782176129195', './icon-512.png?v=v1782176129195', './manifest.json?v=v1782176129195' ];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./offline.html?v=v1782176129195');
          }
        });
      })
  );
});