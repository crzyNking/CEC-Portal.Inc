import { useState, useEffect } from 'react'

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdate(true)
              }
            })
          }
        })
      })
    }
  }, [])

  const handleUpdate = async () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
    window.location.reload()
  }

  if (!showUpdate) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[360px] z-50 bg-[#0b1f40] text-white p-4 rounded-xl shadow-2xl border border-white/10">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">New version available</p>
          <p className="text-white/60 text-xs mt-1">Refresh to get the latest features and improvements.</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleUpdate}
          aria-label="Update to latest version"
          className="flex-1 bg-white text-[#0b1f40] py-2 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          Update Now
        </button>
        <button
          onClick={() => setShowUpdate(false)}
          aria-label="Dismiss update notification"
          className="px-4 py-2 text-white/60 text-sm hover:text-white transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  )
}
