export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', () => {
    let refreshing = false
    let hadController = Boolean(navigator.serviceWorker.controller)

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) {
        hadController = true
        return
      }

      if (refreshing) return
      refreshing = true
      window.location.reload()
    })

    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
      .then(registration => registration.update())
      .catch(() => {
        // PWA installability should not block normal browsing.
      })
  }, { once: true })
})
