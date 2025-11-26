// Nombre del caché
const CACHE_NAME = "rebecop-cache-v1";

// Archivos que queremos cachear
const URLS_TO_CACHE = [
    "/",
    "/index.html",
    "/styles.css",
    "/manifest.json",
    "/icon-192.png",
    "/icon-512.png"
];

// Instalación del Service Worker
self.addEventListener("install", event => {
    console.log("Service Worker instalado");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// Activación del Service Worker
self.addEventListener("activate", event => {
    console.log("Service Worker activado");
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});

// Intercepción de peticiones (fetch)
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
