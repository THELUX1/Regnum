// sw.js - Service Worker para Crónicas Medievales

const CACHE_NAME = 'cronicas-medievales-v1';
const OFFLINE_URL = 'offline.html'; // Opcional: página de respaldo
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/engine.js',
  '/novelData.js',
  '/img/medieval-bg.jpg',
  '/img/wood-planks.jpg',
  '/img/parchment-texture.jpg',
  '/img/characters/lilianne.png',
  '/img/characters/feyra.png',
  '/img/backgrounds/hospital.jpg',
  '/img/backgrounds/dungeon.jpg',
  '/img/backgrounds/fortress.jpg',
  '/img/backgrounds/throne_room.jpg',
  '/img/backgrounds/city.jpg',
  '/img/backgrounds/black.jpg',
  '/sounds/medieval-ambient.mp3',
  '/sounds/button-click.mp3',
  '/sounds/page-turn.mp3',
  '/sounds/door-open.mp3',
  '/sounds/door-close.mp3',
  '/sounds/error.mp3',
  '/sounds/wind-howling.mp3'
];

// Instalación: Cachear recursos esenciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cacheando recursos esenciales');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Estrategia: Cache First, Network Fallback
self.addEventListener('fetch', event => {
  // Ignora solicitudes no-GET o de origen diferente
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Devuelve recurso cacheado si existe
        if (cachedResponse) {
          return cachedResponse;
        }

        // Intenta con la red
        return fetch(event.request)
          .then(response => {
            // Si la respuesta es válida, la cacheamos
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));

            return response;
          })
          .catch(() => {
            // Fallback para páginas (solo si es navegación)
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL || '/index.html');
            }
            return new Response('', { status: 408, statusText: 'Offline' });
          });
      })
  );
});

// Limpieza de caches viejos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Eliminando cache obsoleto:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Manejo de mensajes (para actualizaciones)
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});