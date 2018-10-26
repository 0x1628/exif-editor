const CACHE_NAME = 'exif-editor-cache-v2'

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log(cache)
        return true
      }),
  )
})