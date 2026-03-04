// 상하이 여행 가이드 - Service Worker
const CACHE_NAME = 'shanghai-travel-v1';
const STATIC_ASSETS = [
  '/',
  '/map/',
  '/tips/',
  '/settings/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// 설치: 정적 에셋 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // 일부 에셋 캐시 실패해도 설치 진행
      });
    })
  );
  self.skipWaiting();
});

// 활성화: 이전 캐시 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 패치: 캐시 우선 전략
self.addEventListener('fetch', (event) => {
  // Amap API 요청은 캐시 안함
  if (event.request.url.includes('amap.com') || event.request.url.includes('gdal.com')) {
    return;
  }

  // GET 요청만 처리
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // 오프라인: 기본 페이지 반환
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
    })
  );
});
