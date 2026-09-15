import { useEffect } from 'react'

export default function UpdateNotification() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    let refreshing = false

    const onUpdateFound = (reg: ServiceWorkerRegistration) => {
      const newWorker = reg.installing
      if (!newWorker) return

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' })
          }
          if (!refreshing) {
            refreshing = true
            window.location.reload()
          }
        }
      })
    }

    navigator.serviceWorker.ready.then((reg) => {
      reg.addEventListener('updatefound', () => onUpdateFound(reg))
    })

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })
  }, [])

  return null
}
