import { useState, useEffect, useCallback } from 'react'

interface NetworkStatus {
  isOnline: boolean
  isOffline: boolean
  wasOffline: boolean
  lastOnline: Date | null
  lastOffline: Date | null
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [wasOffline, setWasOffline] = useState(false)
  const [lastOnline, setLastOnline] = useState<Date | null>(null)
  const [lastOffline, setLastOffline] = useState<Date | null>(null)

  const handleOnline = useCallback(() => {
    setIsOnline(true)
    setLastOnline(new Date())
    if (!navigator.onLine) {
      setWasOffline(true)
    }
  }, [])

  const handleOffline = useCallback(() => {
    setIsOnline(false)
    setLastOffline(new Date())
    setWasOffline(false)
  }, [])

  useEffect(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if (!navigator.onLine) {
      setLastOffline(new Date())
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [handleOnline, handleOffline])

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    lastOnline,
    lastOffline
  }
}
