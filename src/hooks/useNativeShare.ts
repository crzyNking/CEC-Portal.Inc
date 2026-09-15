import { useCallback } from 'react'

interface ShareData {
  title?: string
  text?: string
  url?: string
}

export function useNativeShare() {
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  const share = useCallback(async (data: ShareData): Promise<boolean> => {
    if (!canShare) {
      await copyToClipboard(data.url || window.location.href)
      return false
    }

    try {
      await navigator.share({
        title: data.title || document.title,
        text: data.text || 'Check out CEC Portal',
        url: data.url || window.location.href
      })
      return true
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        await copyToClipboard(data.url || window.location.href)
      }
      return false
    }
  }, [canShare])

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        document.body.removeChild(textarea)
        return true
      } catch {
        document.body.removeChild(textarea)
        return false
      }
    }
  }

  return { share, canShare, copyToClipboard }
}
