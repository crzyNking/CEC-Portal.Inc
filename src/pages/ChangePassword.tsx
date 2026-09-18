import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { useNotification } from '../hooks/useNotification'
import StudentLayout from '../components/StudentLayout'

export default function ChangePassword() {
  const user = useAuthStore((s) => s.user)
  const notify = useNotification()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const guidelines = [
    { text: 'At least 8 characters long', met: newPassword.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
    { text: 'Contains number', met: /\d/.test(newPassword) },
    { text: 'Passwords match', met: newPassword === confirmPassword && confirmPassword.length > 0 },
  ]

  const allMet = guidelines.every(g => g.met)

  const handleChangePassword = async () => {
    if (!user || !allMet) return
    if (!currentPassword) {
      notify.error({ title: 'Required', message: 'Please enter your current password.' })
      return
    }
    setLoading(true)
    try {
      const email = user.email
      if (!email) throw new Error('No email found')

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword })
      if (signInError) {
        notify.error({ title: 'Wrong password', message: 'Your current password is incorrect.' })
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error

      notify.success({ title: 'Password changed', message: 'Your password has been updated successfully.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      navigate('/dashboard')
    } catch (err: any) {
      notify.error({ title: 'Error', message: err.message || 'Failed to change password.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <StudentLayout title="Change Password">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
          {/* Form */}
          <div className="bg-white rounded-xl p-5 border border-[#E6E8EE]">
            <h2 className="text-[14px] font-bold text-[#14213D] mb-4">Change Your Password</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-[#7A8299] mb-1 block">Current Password</label>
                <div className="relative">
                  <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-[#F8F9FB] border border-[#E6E8EE] text-[13px] text-[#14213D] focus:outline-none focus:border-[#2F5DD4]"
                    placeholder="Enter current password" />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9AA1B5] hover:text-[#525A6E]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{showCurrent ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}</svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-[#7A8299] mb-1 block">New Password</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-[#F8F9FB] border border-[#E6E8EE] text-[13px] text-[#14213D] focus:outline-none focus:border-[#2F5DD4]"
                    placeholder="Enter new password" />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9AA1B5] hover:text-[#525A6E]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{showNew ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}</svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-[#7A8299] mb-1 block">Confirm New Password</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-[#F8F9FB] border border-[#E6E8EE] text-[13px] text-[#14213D] focus:outline-none focus:border-[#2F5DD4]"
                    placeholder="Confirm new password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9AA1B5] hover:text-[#525A6E]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{showConfirm ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}</svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => navigate('/dashboard')} className="px-5 py-2 rounded-lg border border-[#E6E8EE] text-[12.5px] font-medium text-[#525A6E] hover:bg-[#F8F9FB] transition-colors">
                Cancel
              </button>
              <button onClick={handleChangePassword} disabled={loading || !allMet || !currentPassword}
                className="px-5 py-2 rounded-lg bg-[#2F5DD4] hover:bg-[#1E4E8C] text-white text-[12.5px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>

          {/* Guidelines */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl p-4 border border-[#E6E8EE]">
              <h3 className="text-[13px] font-bold text-[#14213D] mb-3">Password Requirements</h3>
              <div className="flex flex-col gap-2">
                {guidelines.map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${g.met ? 'bg-[#0F9D58]' : 'bg-[#EEF1F8]'}`}>
                      {g.met && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <span className={`text-[11.5px] ${g.met ? 'text-[#0F9D58] font-medium' : 'text-[#7A8299]'}`}>{g.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#F8F9FB] rounded-xl p-4 border border-[#E6E8EE]">
              <h3 className="text-[12px] font-bold text-[#14213D] mb-2">Need Help?</h3>
              <p className="text-[11px] text-[#7A8299] leading-relaxed">
                For password reset assistance, contact the <strong className="text-[#14213D]">EDP Office</strong> — Ground Floor, Main Academic Building.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#7A8299] mt-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Mon–Fri, 8:00 AM – 5:00 PM
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}
