import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthModalStore } from '../store/authModalStore'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { useSettings } from '../hooks/useSettings'
import { supabase } from '../lib/supabase'
import { CEC_LOGO } from '../lib/constants'

const modalBackdrop = { background: 'rgba(11, 31, 58, 0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }

export function AuthModal() {
  const { open, mode, closeAuth } = useAuthModalStore()
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, error, setError } = useAuthStore()
  const addNotification = useNotificationStore((s) => s.addNotification)
  const { school } = useSettings()
  const navigate = useNavigate()

  const [authTab, setAuthTab] = useState<'login' | 'signup'>(mode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setAuthTab(mode)
      setSubmitting(false)
      setError(null)
    }
  }, [open, mode, setError])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (authTab === 'login') {
        const success = await signInWithEmail(email, password)
        if (success) {
          closeAuth()
          navigate('/dashboard', { replace: true })
        }
      } else {
        const result = await signUpWithEmail(email, password, fullName)
        if (result.success) {
          if (result.message.includes('check your email')) {
            addNotification({ type: 'info', title: 'Check your email', message: 'We sent you a confirmation link to finish creating your account.' })
            closeAuth()
          } else {
            closeAuth()
          }
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    await signInWithGoogle()
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    })
    if (error) {
      setError(error.message)
    } else {
      setError(null)
      addNotification({ type: 'success', title: 'Password reset link sent', message: 'Check your email to reset your password.' })
    }
  }

  const switchTab = (tab: 'login' | 'signup') => {
    setAuthTab(tab)
    setSubmitting(false)
    setError(null)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={modalBackdrop}
      onClick={(e) => { if (e.target === e.currentTarget) closeAuth() }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[rgba(13,33,84,0.92)] border border-white/20 rounded-2xl w-full max-w-[420px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-[20px] relative text-white overflow-hidden" style={{ animation: 'modalIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards' }}>
        <button onClick={closeAuth} aria-label="Close" className="absolute top-4 right-5 text-[#94a3b8] hover:text-white text-xl bg-transparent border-none cursor-pointer">&times;</button>

        <div className="p-[35px_30px]">
          <div className="text-center mb-6">
            <img src={school?.website_logo || CEC_LOGO} alt="CEC Seal" className="w-[65px] h-[65px] rounded-full mx-auto mb-3 shadow-[0_4px_10px_rgba(0,0,0,0.3)]" />
            <h3 className="text-[20px] font-semibold">{school?.school_name || 'Cebu Eastern College'}</h3>
          </div>

          <div className="flex bg-white/8 border border-white/15 rounded-lg p-[3px] mb-6">
            <button onClick={() => switchTab('login')} className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all border-none cursor-pointer ${authTab === 'login' ? 'bg-[#2563eb] text-white shadow' : 'bg-transparent text-[#94a3b8]'}`}>Log In</button>
            <button onClick={() => switchTab('signup')} className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all border-none cursor-pointer ${authTab === 'signup' ? 'bg-[#2563eb] text-white shadow' : 'bg-transparent text-[#94a3b8]'}`}>Sign Up</button>
          </div>

          {error && <div className="bg-red-500/15 border border-red-400/30 text-red-300 text-[12px] rounded-lg px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={handleAuth} className="flex flex-col gap-3.5">
            {authTab === 'signup' && (
              <div className="relative">
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-white/7 border border-white/15 rounded-lg px-3.5 py-3 pr-10 text-[13px] text-white placeholder-[#94a3b8] outline-none focus:border-[#3B82F6] transition-colors" placeholder="Full Name" required />
                <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
              </div>
            )}
            <div className="relative">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/7 border border-white/15 rounded-lg px-3.5 py-3 pr-10 text-[13px] text-white placeholder-[#94a3b8] outline-none focus:border-[#3B82F6] transition-colors" placeholder="Email Address" required />
              <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
            </div>
            <div className="relative">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/7 border border-white/15 rounded-lg px-3.5 py-3 pr-10 text-[13px] text-white placeholder-[#94a3b8] outline-none focus:border-[#3B82F6] transition-colors" placeholder="Password" required minLength={6} />
              <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
            </div>
            {authTab === 'login' && (
              <div className="text-right">
                <button type="button" onClick={handleForgotPassword} className="text-[11px] text-[#cbd5e1] hover:underline bg-transparent border-none cursor-pointer p-0">Forgot Password?</button>
              </div>
            )}
            <button type="submit" disabled={submitting} className="w-full py-3 bg-white text-[#0f172a] rounded-lg text-[13.5px] font-bold hover:bg-[#f1f5f9] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2.5 border-none cursor-pointer">
              {submitting ? 'Please wait...' : authTab === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/15" /></div>
            <div className="relative flex justify-center text-[11px]"><span className="px-3 text-[#94a3b8]">or</span></div>
          </div>

          <button onClick={handleGoogleLogin} className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-[13px] font-medium text-white hover:bg-white/15 transition-all flex items-center justify-center gap-2.5 border-none cursor-pointer">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-[11.5px] text-[#cbd5e1] mt-4">
            {authTab === 'login' ? "Don't have an Account? " : 'Already have an Account? '}
            <button onClick={() => switchTab(authTab === 'login' ? 'signup' : 'login')} className="text-white font-semibold underline bg-transparent border-none cursor-pointer">
              {authTab === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
