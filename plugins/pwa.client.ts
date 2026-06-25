export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
      .then(registration => registration.update())
      .catch(() => {
        // PWA installability should not block normal browsing.
      })

    if ('caches' in window) {
      caches.keys()
        .then(keys => Promise.all(keys.filter(key => key.startsWith('freya-pwa')).map(key => caches.delete(key))))
        .catch(() => {
          // Cache cleanup should not block normal browsing.
        })
    }
  }, { once: true })
})
