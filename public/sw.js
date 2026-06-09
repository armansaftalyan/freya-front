const CACHE_NAME = 'freya-pwa-v2'
const APP_SHELL = [
  '/',
  '/hy',
  '/logo.png?v=4',
  '/logo.svg?v=4',
  '/site.webmanifest?v=5',
  '/tor.webmanifest?v=2',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
]

const shouldBypass = (request) => {
  const url = new URL(request.url)

  return request.method !== 'GET'
    || url.origin !== self.location.origin
    || url.pathname.startsWith('/api')
    || url.pathname.includes('/booking')
    || url.pathname.includes('/cart')
    || url.pathname.includes('/account')
    || url.pathname.includes('/login')
    || url.pathname.includes('/register')
    || url.pathname.includes('/_nuxt/')
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (shouldBypass(event.request)) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
        }

        return response
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/hy'))),
  )
})
