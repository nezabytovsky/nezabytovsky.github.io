/* ====================================================
   Service Worker — «Побег из Лабиринта Дракона»
   Кэширует оболочку приложения для офлайн-работы.
   ==================================================== */

const VERSION = 'dragon-maze-v2';
const APP_SHELL = [
  './game-pwa.html',
  './game-rpg.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png'
];

// Установка: кладём оболочку приложения в кэш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Активация: вычищаем старые версии кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Навигация: сначала сеть, при ошибке — кэшированная оболочка (офлайн)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('./game-rpg.html')))
    );
    return;
  }

  // Статика: кэш-сначала + рантайм-кэширование (в т.ч. CDN-скрипты/шрифты)
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && (sameOrigin || ['script', 'style', 'font', 'image'].includes(req.destination))) {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match('./game-rpg.html'));
    })
  );
});
