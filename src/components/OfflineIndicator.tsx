import { useState, useEffect } from 'react'
import { useNetworkStatus } from '../hooks/useNetworkStatus'

export default function OfflineIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus()
  const [showStatus, setShowStatus] = useState(false)
  const [message, setMessage] = useState('')
  const [statusType, setStatusType] = useState<'offline' | 'online'>('offline')

  useEffect(() => {
    if (!isOnline) {
      setMessage("You're offline. Some features may be unavailable.")
      setStatusType('offline')
      setShowStatus(true)
    } else if (wasOffline) {
      setMessage("You're back online.")
      setStatusType('online')
      setShowStatus(true)
      const timer = setTimeout(() => setShowStatus(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  if (!showStatus) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] px-4 py-2.5 text-center text-sm font-medium transition-all duration-300 ${
        statusType === 'offline'
          ? 'bg-amber-500 text-white'
          : 'bg-emerald-500 text-white'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {statusType === 'offline' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.242 2.829a5 5 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span>{message}</span>
        {statusType === 'offline' && (
          <button
            onClick={() => setShowStatus(false)}
            className="ml-2 text-white/80 hover:text-white"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
