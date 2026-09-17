import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { processPendingClaim, dashboardPathFor } from '../lib/studentAuth'
import { useAuthStore } from '../store/authStore'

function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('Completing sign in...')
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    const timers: ReturnType<typeof setTimeout>[] = []

    const delayedNavigate = (path: string, delay: number, replace?: boolean) => {
      const t = setTimeout(() => {
        if (mountedRef.current) navigate(path, { replace })
      }, delay)
      timers.push(t)
    }

    const handleCallback = async () => {
      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')
      const type = searchParams.get('type')

      if (errorParam) {
        setError(errorDescription || errorParam)
        setStatus('Authentication failed')
        delayedNavigate('/', 3000)
        return
      }

      if (type === 'signup' || type === 'magiclink') {
        setStatus('Confirming your email...')
      }

      if (code) {
        try {
          setStatus('Verifying credentials...')
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          setStatus('Confirming your email...')
          // Link a pending Student ID Number claim if one was saved at signup
          const claimed = await processPendingClaim()
          if (claimed) setStatus('ID Number linked! Redirecting...')
          else setStatus('Email confirmed! Redirecting...')
          delayedNavigate(dashboardPathFor(useAuthStore.getState().profile?.role), 800, true)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Authentication failed')
          setStatus('Redirecting...')
          delayedNavigate('/', 3000)
        }
      } else {
        setStatus('Checking session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          setError('No session found. Please try signing in again.')
          setStatus('Redirecting...')
          delayedNavigate('/', 3000)
        } else {
          const claimed = await processPendingClaim()
          if (claimed) setStatus('ID Number linked! Redirecting...')
          else setStatus('Success! Redirecting...')
          delayedNavigate(dashboardPathFor(useAuthStore.getState().profile?.role), 800, true)
        }
      }
    }

    handleCallback()

    return () => {
      mountedRef.current = false
      timers.forEach(clearTimeout)
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 overflow-hidden hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1E4E8C]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0B1F3A]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          {error ? (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Error</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
              <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
                <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin" />
                <span>Redirecting...</span>
              </div>
            </>
          ) : (
            <>
              <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 w-20 h-20 border-4 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-[#0B1F3A] rounded-full animate-spin spin-reverse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600 dark:text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-1.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verifying Your Identity</h2>
              <p className="text-gray-500 dark:text-gray-400">{status}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthCallback
