const CACHE_NAME = `exif-editor-cache-v${BUILD_VERSION}`

const urlsToCache = [
  '/',
  '/assets/manifest.json',
  '/assets/192.png',
  '/assets/512.png',
  '/app.js',
]

function clearCache() {
  return caches.keys().then(names => {
    return Promise.all(names.filter(i => i !== CACHE_NAME)
      .map(i => caches.delete(i)))
  })
}

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    clearCache().then(() => {
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(urlsToCache)
        })
    }),
  )
})

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // fetch(event.request)
          return response
        }
        return fetch(event.request)
      }),
  )
})