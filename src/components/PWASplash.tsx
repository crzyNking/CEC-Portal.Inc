import { useState, useEffect } from 'react'

export default function PWASplash() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    if (isStandalone) {
      setVisible(true)
      const textTimer = setTimeout(() => setShowText(true), 200)
      const fadeTimer = setTimeout(() => setFading(true), 800)
      const hideTimer = setTimeout(() => setVisible(false), 1200)
      return () => {
        clearTimeout(textTimer)
        clearTimeout(fadeTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b1f40] transition-opacity duration-400 ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className={`transition-all duration-500 ${fading ? 'scale-105 opacity-0' : 'scale-100 opacity-100'}`}>
        <img src="/icons/icon.svg" alt="CEC Portal" className="w-24 h-24 rounded-3xl mb-4 mx-auto" />
        <div className={`text-center transition-all duration-300 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <h1 className="text-white text-xl font-bold">CEC Portal</h1>
          <p className="text-white/60 text-sm mt-1">Cebu Eastern College</p>
        </div>
      </div>
    </div>
  )
}
