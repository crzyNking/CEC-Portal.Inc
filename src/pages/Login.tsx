import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useSettings } from '../hooks/useSettings'
import { CEC_LOGO } from '../lib/constants'
import { loginWithIdNumber, isValidIdNumber, ID_NUMBER_MESSAGES, dashboardPathFor } from '../lib/studentAuth'

const pageBackdrop = { background: 'linear-gradient(135deg, #0B1F3A 0%, #102A43 50%, #1E4E8C 100%)' }
const modalBackdrop = { background: 'rgba(11, 31, 58, 0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }

export default function Login() {
  const { signInWithGoogle, error, setError } = useAuthStore()
  const { school } = useSettings()
  const navigate = useNavigate()

  const [tab, setTab] = useState<'email' | 'id'>('email')
  const [email, setEmail] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (tab === 'id') {
        if (!isValidIdNumber(idNumber.trim())) {
          setError(ID_NUMBER_MESSAGES.invalid)
          setSubmitting(false)
          return
        }
        const result = await loginWithIdNumber(idNumber.trim(), password)
        if (!result.success) {
          setError(result.message)
          setSubmitting(false)
          return
        }
        navigate(dashboardPathFor(useAuthStore.getState().profile?.role), { replace: true })
      } else {
        const success = await useAuthStore.getState().signInWithEmail(email.trim(), password)
        if (success) {
          navigate(dashboardPathFor(useAuthStore.getState().profile?.role), { replace: true })
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const switchTab = (t: 'email' | 'id') => {
    setTab(t)
    setSubmitting(false)
    setError(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={pageBackdrop}>
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-6">
          <img src={school?.website_logo || CEC_LOGO} alt="CEC Seal" className="w-[70px] h-[70px] rounded-full mx-auto mb-3 shadow-[0_4px_10px_rgba(0,0,0,0.3)]" />
          <h1 className="text-white text-xl font-bold">{school?.school_name || 'Cebu Eastern College'}</h1>
          <p className="text-white/60 text-sm mt-1">Log In to your account</p>
        </div>

        <div
          className="bg-[rgba(13,33,84,0.92)] border border-white/20 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-[20px] p-[35px_30px] text-white"
          style={modalBackdrop}
        >
          <div className="flex bg-white/8 border border-white/15 rounded-lg p-[3px] mb-6">
            <button onClick={() => switchTab('email')} className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all border-none cursor-pointer ${tab === 'email' ? 'bg-[#2563eb] text-white shadow' : 'bg-transparent text-[#94a3b8]'}`}>Email</button>
            <button onClick={() => switchTab('id')} className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all border-none cursor-pointer ${tab === 'id' ? 'bg-[#2563eb] text-white shadow' : 'bg-transparent text-[#94a3b8]'}`}>Student ID</button>
          </div>

          {error && <div className="bg-red-500/15 border border-red-400/30 text-red-300 text-[12px] rounded-lg px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
            {tab === 'id' ? (
              <div>
                <label className="block text-[12px] text-[#cbd5e1] mb-1.5 font-medium">Student ID Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-white/7 border border-white/15 rounded-lg px-3.5 py-3 text-[15px] text-white placeholder-[#94a3b8] outline-none focus:border-[#3B82F6] transition-colors tracking-[0.3em] font-bold text-center"
                  placeholder="000000"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-[12px] text-[#cbd5e1] mb-1.5 font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/7 border border-white/15 rounded-lg px-3.5 py-3 text-[13px] text-white placeholder-[#94a3b8] outline-none focus:border-[#3B82F6] transition-colors"
                  placeholder="you@gmail.com"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-[12px] text-[#cbd5e1] mb-1.5 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/7 border border-white/15 rounded-lg px-3.5 py-3 text-[13px] text-white placeholder-[#94a3b8] outline-none focus:border-[#3B82F6] transition-colors"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-white text-[#0f172a] rounded-lg text-[13.5px] font-bold hover:bg-[#f1f5f9] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/15" /></div>
            <div className="relative flex justify-center text-[11px]"><span className="px-3 text-[#94a3b8]">or</span></div>
          </div>

          <button onClick={() => signInWithGoogle()} className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-[13px] font-medium text-white hover:bg-white/15 transition-all flex items-center justify-center gap-2.5 border-none cursor-pointer">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-[11.5px] text-[#cbd5e1] mt-4">
            Don't have an Account?{' '}
            <Link to="/signup" className="text-white font-semibold underline">Sign Up</Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-white/40 mt-5">
          <Link to="/" className="hover:text-white/70">Back to Website</Link>
        </p>
      </div>
    </div>
  )
}
