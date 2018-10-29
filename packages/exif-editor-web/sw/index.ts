const CACHE_NAME = `exif-editor-cache-v${BUILD_VERSION}`

const urlsToCache = [
  `${PATH}`,
  `${PATH}assets/manifest.json`,
  `${PATH}assets/192.png`,
  `${PATH}assets/512.png`,
  `${PATH}app.js`,
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
    caches.match(event.request, {ignoreSearch: true})
      .then(response => {
        if (response) {
          // fetch(event.request)
          return response
        }
        return fetch(event.request)
      }),
  )
})