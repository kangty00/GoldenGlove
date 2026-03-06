// 가벼운 서비스 워커 (앱 설치 인식용)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // 기본 네트워크 요청 처리 (설치 인식 트리거)
  event.respondWith(fetch(event.request));
});
