import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useNotification } from '../hooks/useNotification'
import StudentLayout from '../components/StudentLayout'

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
)

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.45 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
)

export default function ChangePassword() {
  const notify = useNotification()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const checks = [
    { label: 'At least 8 characters in length.', ok: newPassword.length >= 8 },
    { label: 'Contain at least one uppercase letter (A-Z).', ok: /[A-Z]/.test(newPassword) },
    { label: 'Contain at least one numerical digit (0-9).', ok: /[0-9]/.test(newPassword) },
    { label: 'Special character recommended (e.g. @, #, %, !).', ok: /[^A-Za-z0-9]/.test(newPassword) },
  ]

  const handleSave = async () => {
    setError('')
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.')
      return
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    setSaving(true)
    try {
      const userEmail = (await supabase.auth.getUser()).data.user?.email
      if (!userEmail) throw new Error('Not authenticated.')
      const { error: verifyErr } = await supabase.auth.signInWithPassword({ email: userEmail, password: currentPassword })
      if (verifyErr) {
        setError('Current password is incorrect.')
        setSaving(false)
        return
      }
      const { error: err } = await supabase.auth.updateUser({ password: newPassword })
      if (err) throw err
      notify.success({ title: 'Password updated', message: 'Your portal password has been changed successfully.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => navigate('/profile'), 1200)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <StudentLayout title="Change Password">
      <div className="px-1 md:px-2">
        <div className="text-[12px] text-[#7A8299] mb-4">Student Portal › Student Profile › <b className="text-[#1F2433] font-semibold">Change Password</b></div>

        <div className="flex flex-col lg:flex-row items-start gap-5 max-w-[900px]">
          <div className="flex-1 w-full bg-white border border-[#E6E8EE] rounded-[10px] shadow-[0_1px_3px_rgba(20,33,61,0.06),0_1px_2px_rgba(20,33,61,0.04)] px-5 py-6 md:px-[26px]">
            <div className="flex items-center gap-3 mb-[22px]">
              <div className="w-9 h-9 rounded-[9px] bg-[#EAF0FF] text-[#2F5DD4] flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div>
                <div className="text-[16.5px] font-bold text-[#1F2433]">Change Password</div>
                <div className="text-[12px] text-[#7A8299] mt-0.5">Update your portal login credentials to secure your student account and academic records.</div>
              </div>
            </div>

            {error && (
              <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-[#FDECEB] border border-[#F5C6C0] text-[12px] text-[#E4483F] font-medium">{error}</div>
            )}

            <div className="mb-4">
              <label className="text-[12px] font-semibold text-[#1F2433] mb-1.5 block">CURRENT PASSWORD <span className="text-[#E4483F]">*</span></label>
              <div className="relative">
                <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current portal password"
                  className="w-full px-3 py-2.5 pr-9 border border-[#E6E8EE] rounded-[7px] text-[13px] text-[#1F2433] bg-white outline-none focus:border-[#2F5DD4] focus:shadow-[0_0_0_3px_#EAF0FF] transition-shadow" />
                <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-[11px] top-1/2 -translate-y-1/2 text-[#A7ADC0] hover:text-[#525A6E] transition-colors" tabIndex={-1}>
                  {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <div className="text-[11px] text-[#9AA1B5] mt-[5px]">Must match your active student portal credential.</div>
            </div>

            <div className="mb-4">
              <label className="text-[12px] font-semibold text-[#1F2433] mb-1.5 block">NEW PASSWORD <span className="text-[#E4483F]">*</span></label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong, new password"
                  className="w-full px-3 py-2.5 pr-9 border border-[#E6E8EE] rounded-[7px] text-[13px] text-[#1F2433] bg-white outline-none focus:border-[#2F5DD4] focus:shadow-[0_0_0_3px_#EAF0FF] transition-shadow" />
                <button onClick={() => setShowNew(!showNew)} className="absolute right-[11px] top-1/2 -translate-y-1/2 text-[#A7ADC0] hover:text-[#525A6E] transition-colors" tabIndex={-1}>
                  {showNew ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[12px] font-semibold text-[#1F2433] mb-1.5 block">CONFIRM NEW PASSWORD <span className="text-[#E4483F]">*</span></label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your new password"
                  className="w-full px-3 py-2.5 pr-9 border border-[#E6E8EE] rounded-[7px] text-[13px] text-[#1F2433] bg-white outline-none focus:border-[#2F5DD4] focus:shadow-[0_0_0_3px_#EAF0FF] transition-shadow" />
                <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-[11px] top-1/2 -translate-y-1/2 text-[#A7ADC0] hover:text-[#525A6E] transition-colors" tabIndex={-1}>
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 mt-5">
              <button onClick={handleSave} disabled={saving}
                className="border-none rounded-[7px] px-[18px] py-[9px] text-[12px] font-semibold cursor-pointer flex items-center gap-1.5 bg-[#14213D] text-white hover:bg-[#1B2A52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => navigate('/profile')}
                className="rounded-[7px] px-[18px] py-[9px] text-[12px] font-semibold cursor-pointer bg-white border border-[#E6E8EE] text-[#4A5066] hover:bg-[#FAFBFF] transition-colors">
                Cancel
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[260px] flex-shrink-0 flex flex-col gap-4">
            <div className="bg-[#EAF0FF] border border-[#D6E2FF] rounded-[10px] px-[18px] py-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#1F2433] mb-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2F5DD4" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                Password Guidelines
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-2">
                {[
                  'At least 8 characters in length.',
                  'Contain at least one uppercase letter (A-Z).',
                  'Contain at least one numerical digit (0-9).',
                  'Special character recommended (e.g. @, #, %, !).',
                  'Must not contain your Student ID number or birthdate.',
                ].map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-[#3B4256] leading-[1.4]">
                    <span className={`shrink-0 mt-0.5 ${checks[i] ? 'text-[#0F9D58]' : 'text-[#9AA1B5]'}`}>✓</span> {g}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-[#E6E8EE] rounded-[10px] px-[18px] py-4">
              <div className="text-[13px] font-bold text-[#1F2433] mb-2 flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Need In-Person Assistance?
              </div>
              <div className="text-[12px] text-[#4A5066] leading-[1.5]">
                For password reset, lost credentials, or locked student accounts, please visit the <b className="text-[#1F2433]">Electronic Data Processing (EDP) Office</b> located on the Ground Floor, Main Academic Building.
              </div>
              <div className="flex items-center gap-[7px] text-[11.5px] text-[#7A8299] mt-2.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}
