import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { useNotification } from '../hooks/useNotification'
import StudentLayout from '../components/StudentLayout'

interface EnrollmentRecord {
  id_number: string
  program: string
  level: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  date_of_birth: string
  gender: string
  civil_status: string
  guardian_name: string
  guardian_phone: string
}

export function Profile() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const uploadAvatar = useAuthStore((s) => s.uploadAvatar)
  const notify = useNotification()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [enrollment, setEnrollment] = useState<EnrollmentRecord | null>(null)
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (profile) setFullName(profile.full_name || '')
  }, [profile])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data } = await supabase.from('enrollment_submissions').select('*').eq('student_id', user.id).order('claimed_at', { ascending: false }).limit(1)
      if (data?.[0]) setEnrollment(data[0])
    }
    load()
  }, [user])

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return
    if (!file.type.startsWith('image/')) {
      notify.error({ title: 'Invalid file', message: 'Please select an image file.' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      notify.error({ title: 'File too large', message: 'Image must be less than 5MB.' })
      return
    }
    setUploading(true)
    const avatarUrl = await uploadAvatar(file)
    setUploading(false)
    if (avatarUrl) {
      notify.success({ title: 'Avatar updated', message: 'Your profile picture has been changed.' })
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').update({ full_name: fullName, updated_at: new Date().toISOString() }).eq('id', user.id)
      if (error) throw error
      notify.success({ title: 'Profile saved', message: 'Your profile has been updated.' })
    } catch {
      notify.error({ title: 'Error', message: 'Failed to save profile.' })
    } finally {
      setSaving(false)
    }
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url
  const email = profile?.email || user?.email
  const studentId = enrollment?.id_number || user?.id?.slice(0, 8) || '—'

  return (
    <StudentLayout title="Student Profile">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 border border-[#E6E8EE] mb-5">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border-3 border-[#E6E8EE]" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#14213D] to-[#2F5DD4] flex items-center justify-center text-white text-[22px] font-bold border-3 border-[#E6E8EE]">
                    {displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><circle cx="16.5" cy="12.75" r="4.5"/></svg>
                  )}
                </div>
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-[18px] font-bold text-[#14213D]">{displayName}</h2>
              <div className="text-[12px] text-[#7A8299] mt-0.5">Student ID: <span className="font-medium text-[#14213D]">{studentId}</span></div>
            </div>
          </div>
        </div>

        {/* Personal Info Grid */}
        <div className="bg-white rounded-xl p-5 border border-[#E6E8EE] mb-5">
          <h3 className="text-[14px] font-bold text-[#14213D] mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', value: enrollment ? `${enrollment.first_name} ${enrollment.last_name}` : displayName, field: 'name' },
              { label: 'Student ID', value: studentId, field: 'id' },
              { label: 'Program / Course', value: enrollment?.program || '—', field: 'program' },
              { label: 'Year / Level', value: enrollment?.level || '—', field: 'level' },
              { label: 'Email', value: email || '—', field: 'email' },
              { label: 'Phone', value: enrollment?.phone || '—', field: 'phone' },
              { label: 'Address', value: enrollment?.address || '—', field: 'address', full: true },
              { label: 'Date of Birth', value: enrollment?.date_of_birth ? new Date(enrollment.date_of_birth).toLocaleDateString() : '—', field: 'dob' },
              { label: 'Gender', value: enrollment?.gender || '—', field: 'gender' },
              { label: 'Civil Status', value: enrollment?.civil_status || '—', field: 'civil' },
              { label: 'Guardian Name', value: enrollment?.guardian_name || '—', field: 'guardian' },
              { label: 'Guardian Phone', value: enrollment?.guardian_phone || '—', field: 'gphone' },
            ].map(item => (
              <div key={item.field} className={item.full ? 'sm:col-span-2' : ''}>
                <label className="text-[11px] font-medium text-[#7A8299] mb-1 block">{item.label}</label>
                <div className="text-[13px] text-[#14213D] font-medium">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Name */}
        <div className="bg-white rounded-xl p-5 border border-[#E6E8EE] mb-5">
          <h3 className="text-[14px] font-bold text-[#14213D] mb-4">Edit Display Name</h3>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-[11px] font-medium text-[#7A8299] mb-1 block">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9FB] border border-[#E6E8EE] text-[13px] text-[#14213D] focus:outline-none focus:border-[#2F5DD4]"
                placeholder="Enter your name" />
            </div>
            <button onClick={handleSaveProfile} disabled={saving || fullName === (profile?.full_name || '')}
              className="px-5 py-2 rounded-lg bg-[#2F5DD4] hover:bg-[#1E4E8C] text-white text-[12.5px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => navigate('/dashboard')} className="px-5 py-2 rounded-lg border border-[#E6E8EE] text-[12.5px] font-medium text-[#525A6E] hover:bg-[#F8F9FB] transition-colors">
            Back to Dashboard
          </button>
          <button onClick={() => navigate('/change-password')} className="px-5 py-2 rounded-lg bg-[#14213D] hover:bg-[#1E4E8C] text-white text-[12.5px] font-semibold transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </StudentLayout>
  )
}

export default Profile
