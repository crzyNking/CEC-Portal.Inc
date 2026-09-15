import { useState, useEffect, useCallback } from 'react'

interface PushNotificationState {
  permission: NotificationPermission
  isSupported: boolean
  subscription: PushSubscription | null
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    permission: 'default',
    isSupported: false,
    subscription: null
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setState(prev => ({ ...prev, isSupported: false }))
      return
    }

    setState(prev => ({
      ...prev,
      isSupported: true,
      permission: Notification.permission
    }))

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          setState(prev => ({ ...prev, subscription }))
        })
      })
    }
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      setState(prev => ({ ...prev, permission }))
      return permission === 'granted'
    } catch {
      return false
    }
  }, [state.isSupported])

  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!state.isSupported || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const applicationServerKey = urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
      )
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer
      })
      setState(prev => ({ ...prev, subscription }))
      return subscription
    } catch {
      return null
    }
  }, [state.isSupported])

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) return false

    try {
      await state.subscription.unsubscribe()
      setState(prev => ({ ...prev, subscription: null }))
      return true
    } catch {
      return false
    }
  }, [state.subscription])

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
