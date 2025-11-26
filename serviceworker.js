const CACHE_NAME = "rebecop-cache-v2";

// Rutas ABSOLUTAS para que funcionen en modo PWA instalada y en Windows Store
const BASE = "https://rebecop-website.vercel.app";

const URLS_TO_CACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/styles.css`,
  `${BASE}/manifest.json`,
  `${BASE}/icon-192.png`,
  `${BASE}/icon-512.png`
];

// INSTALACIÓN
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ACTIVACIÓN
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH — "network first" para evitar cuelgues
self.addEventListener("fetch", (event) => {
  const request = event.request;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Guardar en cache la respuesta online
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => {
        // Si la red falla → tirar de cache
        return caches.match(request);
      })
  );
});
