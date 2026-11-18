self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open('saadi-store-v3').then((cache) => { // غيرنا هنا إلى v3
            return cache.addAll([
                './index.html',
                './style.css',
                './script.js',
                './manifest.json',
                './logo.jpg'
            ]);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== 'saadi-store-v3') { // وهنا كمان إلى v3 عشان يحذف القديم
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
