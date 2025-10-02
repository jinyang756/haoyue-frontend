const CACHE_NAME = 'haoyue-quant-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/main.js',
  '/static/css/main.css',
  '/logo.svg',
  '/manifest.json'
];

// 安装Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 拦截网络请求并实现缓存策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果在缓存中找到响应，则返回缓存的响应
        if (response) {
          return response;
        }
        
        // 重要：克隆请求，因为请求是一个流，只能被消费一次
        const fetchRequest = event.request.clone();
        
        // 如果在缓存中找不到响应，则发起网络请求
        return fetch(fetchRequest).then((response) => {
          // 检查响应是否有效
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 重要：克隆响应，因为响应是一个流，只能被消费一次
          const responseToCache = response.clone();
          
          // 将响应添加到缓存中
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
    );
});

// 更新Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 删除旧缓存
            return caches.delete(cacheName);
          }
          // 对于不需要删除的缓存，返回一个已解决的 Promise
          return Promise.resolve();
        })
      );
    })
  );
});