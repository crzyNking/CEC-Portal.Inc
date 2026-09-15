import { useEffect } from 'react'

const UPDATE_CHECK_INTERVAL = 60_000

export default function UpdateNotification() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    let refreshing = false
    let pendingReload = false
    let hadController = !!navigator.serviceWorker.controller
    let registration: ServiceWorkerRegistration | null = null

    const reloadNow = () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    }

    const requestReload = () => {
      if (refreshing) return
      if (document.visibilityState === 'visible') {
        reloadNow()
      } else {
        pendingReload = true
      }
    }

    const activateWaiting = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting && navigator.serviceWorker.controller) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    }

    const onVisibilityChange = () => {
      if (pendingReload && document.visibilityState === 'visible') {
        pendingReload = false
        reloadNow()
        return
      }
      if (document.visibilityState === 'visible') {
        registration?.update().catch(() => {})
      }
    }

    const onFocus = () => {
      if (navigator.onLine) registration?.update().catch(() => {})
    }

    navigator.serviceWorker.ready.then((reg) => {
      registration = reg

      // If an update was found and installed before this component mounted,
      // activate the waiting worker now.
      activateWaiting(reg)

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            activateWaiting(reg)
          }
        })
      })
    })

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) {
        // First SW claiming the page (initial load) — not an update.
        hadController = true
        return
      }
      // A new service worker took control — new version is live.
      requestReload()
    })

    // Periodic update checks while the app is open.
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        registration?.update().catch(() => {})
      }
    }, UPDATE_CHECK_INTERVAL)

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', onFocus)
    window.addEventListener('online', onFocus)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('online', onFocus)
    }
  }, [])

  return null
}
