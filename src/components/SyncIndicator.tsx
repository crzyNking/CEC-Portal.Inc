import { useState, useEffect } from 'react'
import { useBackgroundSync } from '../hooks/useBackgroundSync'

export default function SyncIndicator() {
  const { pendingCount, isSyncing } = useBackgroundSync()
  const [showSync, setShowSync] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')

  useEffect(() => {
    if (isSyncing) {
      setSyncMessage('Syncing changes...')
      setShowSync(true)
    } else if (pendingCount > 0) {
      setSyncMessage(`${pendingCount} change${pendingCount > 1 ? 's' : ''} pending`)
      setShowSync(true)
    } else if (showSync && !isSyncing) {
      setSyncMessage('All changes synced')
      const timer = setTimeout(() => setShowSync(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isSyncing, pendingCount])

  if (!showSync) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[300px] z-50 bg-[#0b1f40]/95 text-white p-3 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {isSyncing ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : pendingCount > 0 ? (
          <div className="w-4 h-4 bg-amber-400 rounded-full" />
        ) : (
          <div className="w-4 h-4 bg-emerald-400 rounded-full" />
        )}
        <span className="text-sm">{syncMessage}</span>
      </div>
    </div>
  )
}
