import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useSettings } from '../hooks/useSettings'
import { CEC_LOGO } from '../lib/constants'
import {
  checkIdStatus,
  claimStudentAccount,
  syncStudentProfileName,
  setPendingClaim,
  ID_NUMBER_MESSAGES,
  isValidIdNumber,
  dashboardPathFor,
} from '../lib/studentAuth'

const pageBackdrop = { background: 'linear-gradient(135deg, #0B1F3A 0%, #102A43 50%, #1E4E8C 100%)' }
const modalBackdrop = { background: 'rgba(11, 31, 58, 0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }

export default function Signup() {
  const { user, profile } = useAuthStore()
  const { signUpWithEmail } = useAuthStore()
  const { school } = useSettings()
  const navigate = useNavigate()

  const [idNumber, setIdNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (profile) setError('')
  }, [profile])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNotice('')

    if (!isValidIdNumber(idNumber.trim())) {
      setError(ID_NUMBER_MESSAGES.invalid)
      return
    }

    setSubmitting(true)
    try {
      const status = await checkIdStatus(idNumber.trim())
      if (status === 'not_found') {
        setError(ID_NUMBER_MESSAGES.not_found)
        setSubmitting(false)
        return
      }
      if (status === 'claimed') {
        setError(ID_NUMBER_MESSAGES.claimed)
        setSubmitting(false)
        return
      }

      if (user) {
        // Already authenticated (e.g. Google user) — just link the ID number
        const ok = await claimStudentAccount(idNumber.trim())
        if (!ok) {
          setError(ID_NUMBER_MESSAGES.claimed)
          setSubmitting(false)
          return
        }
        await syncStudentProfileName()
        setDone(true)
        setSubmitting(false)
        setTimeout(() => navigate(dashboardPathFor(profile?.role), { replace: true }), 1500)
        return
      }

      const result = await signUpWithEmail(email.trim(), password, '')
      if (!result.success) {
        setError(result.message)
        setSubmitting(false)
        return
      }

      if (result.message.includes('check your email')) {
        // Email confirmation enabled — claim after the user confirms via AuthCallback
        setPendingClaim(idNumber.trim())
        setNotice('Account created! Check your email to confirm — your ID Number will be linked automatically.')
        setDone(true)
        setSubmitting(false)
        return
      }

      // Signed in immediately — claim now
      const ok = await claimStudentAccount(idNumber.trim())
      if (!ok) {
        setError('Account created, but linking your ID Number failed. Please contact the registrar.')
        setSubmitting(false)
        return
      }
      await syncStudentProfileName()
      setDone(true)
      setSubmitting(false)
      setTimeout(() => navigate(dashboardPathFor(profile?.role), { replace: true }), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={pageBackdrop}>
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-6">
          <img src={school?.website_logo || CEC_LOGO} alt="CEC Seal" className="w-[70px] h-[70px] rounded-full mx-auto mb-3 shadow-[0_4px_10px_rgba(0,0,0,0.3)]" />
          <h1 className="text-white text-xl font-bold">{school?.school_name || 'Cebu Eastern College'}</h1>
          <p className="text-white/60 text-sm mt-1">Student Sign Up</p>
        </div>

        <div
          className="bg-[rgba(13,33,84,0.92)] border border-white/20 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-[20px] p-[35px_30px] text-white"
          style={modalBackdrop}
        >
          {done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{notice ? 'Check your email' : 'ID Number linked!'}</h3>
              <p className="text-white/70 text-sm">{notice || 'Your account is ready. Redirecting to your dashboard...'}</p>
            </div>
          ) : (
            <>
              {error && <div className="bg-red-500/15 border border-red-400/30 text-red-300 text-[12px] rounded-lg px-4 py-3 mb-4">{error}</div>}
              <form onSubmit={handleSignup} className="flex flex-col gap-3.5">
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
                  <p className="text-[11px] text-[#94a3b8] mt-1.5">The 6-digit ID Number given to you after enrollment.</p>
                </div>
                <div>
                  <label className="block text-[12px] text-[#cbd5e1] mb-1.5 font-medium">Gmail Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/7 border border-white/15 rounded-lg px-3.5 py-3 text-[13px] text-white placeholder-[#94a3b8] outline-none focus:border-[#3B82F6] transition-colors"
                    placeholder="you@gmail.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#cbd5e1] mb-1.5 font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/7 border border-white/15 rounded-lg px-3.5 py-3 text-[13px] text-white placeholder-[#94a3b8] outline-none focus:border-[#3B82F6] transition-colors"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-white text-[#0f172a] rounded-lg text-[13.5px] font-bold hover:bg-[#f1f5f9] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {submitting ? 'Verifying ID Number...' : 'Create Account'}
                </button>
              </form>
              <p className="text-center text-[11.5px] text-[#cbd5e1] mt-4">
                Already have an Account?{' '}
                <Link to="/login" className="text-white font-semibold underline">Log In</Link>
              </p>
              <p className="text-center text-[11px] text-[#94a3b8] mt-3">
                Haven't enrolled yet?{' '}
                <Link to="/enroll" className="text-[#7db4f5] underline">Complete enrollment first</Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-white/40 mt-5">
          <Link to="/" className="hover:text-white/70">Back to Website</Link>
        </p>
      </div>
    </div>
  )
}
