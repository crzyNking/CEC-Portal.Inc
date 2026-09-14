import { useState, useEffect } from 'react'

export default function PWASplash() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    if (isStandalone) {
      setVisible(true)
      const fadeTimer = setTimeout(() => setFading(true), 600)
      const hideTimer = setTimeout(() => setVisible(false), 1000)
      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b1f40] transition-opacity duration-400 ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className={`transition-transform duration-500 ${fading ? 'scale-105' : 'scale-100'}`}>
        <img src="/icons/icon.svg" alt="CEC Portal" className="w-28 h-28 rounded-3xl" />
      </div>
    </div>
  )
}
