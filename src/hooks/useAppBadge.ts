import { useCallback, useEffect } from 'react'

export function useAppBadge() {
  const canSetBadge = typeof navigator !== 'undefined' && 'setAppBadge' in navigator

  const setBadge = useCallback(async (count: number): Promise<boolean> => {
    if (!canSetBadge) return false

    try {
      if (count > 0) {
        await (navigator as Navigator & { setAppBadge: (count: number) => Promise<void> }).setAppBadge(count)
      } else {
        await (navigator as Navigator & { clearAppBadge: () => Promise<void> }).clearAppBadge()
      }
      return true
    } catch {
      return false
    }
  }, [canSetBadge])

  const clearBadge = useCallback(async (): Promise<boolean> => {
    if (!canSetBadge) return false

    try {
      await (navigator as Navigator & { clearAppBadge: () => Promise<void> }).clearAppBadge()
      return true
    } catch {
      return false
    }
  }, [canSetBadge])

  useEffect(() => {
    if (!canSetBadge) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UPDATE_BADGE') {
        setBadge(event.data.count || 0)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [canSetBadge, setBadge])

  return { setBadge, clearBadge, canSetBadge }
}
