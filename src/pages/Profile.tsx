import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useActivityStore } from '../store/activityStore'
import { useNotification } from '../hooks/useNotification'
import { supabase } from '../lib/supabase'
import StudentLayout from '../components/StudentLayout'

interface EnrollmentRecord {
  id_number: string | null
  level: string
  degree_program: string | null
  grade_level: string | null
  first_name: string
  middle_name: string | null
  last_name: string
  status: string
  parent_contact: string | null
  address: string | null
}

export function Profile() {
  const { user, profile, uploadAvatar } = useAuthStore()
  const { logActivity } = useActivityStore()
  const notify = useNotification()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [enrollment, setEnrollment] = useState<EnrollmentRecord | null>(null)

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
      await logActivity(user.id, 'avatar_updated')
      notify.success({ title: 'Avatar updated', message: 'Your profile picture has been changed.' })
    }
  }

  const userMetadata = user?.user_metadata
  const displayName = enrollment
    ? `${enrollment.first_name} ${enrollment.middle_name ? enrollment.middle_name + ' ' : ''}${enrollment.last_name}`.trim()
    : profile?.full_name || userMetadata?.full_name || userMetadata?.name || user?.email?.split('@')[0] || 'Student'
  const avatarUrl = profile?.avatar_url || userMetadata?.avatar_url
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const portalLabel = enrollment?.degree_program?.match(/\(([^)]+)\)/)?.[1] || 'Student'
  const course = enrollment?.degree_program || enrollment?.level || '—'
  const yearSection = enrollment?.grade_level || enrollment?.level || '—'
  const contact = enrollment?.parent_contact || '—'
  const address = enrollment?.address || '—'

  return (
    <StudentLayout title="Student Profile">
      <div className="px-1 md:px-2">
        <div className="text-[12px] text-[#7A8299] mb-4">{portalLabel} Portal › <b className="text-[#1F2433] font-semibold">Student Profile</b></div>
        <div className="text-[22px] font-bold text-[#1F2433] mb-1">Student Profile</div>
        <div className="text-[13px] text-[#7A8299] mb-[22px]">Official institutional identification, enrollment record, and student credentials.</div>

        <div className="bg-white border border-[#E6E8EE] rounded-[10px] shadow-[0_1px_3px_rgba(20,33,61,0.06),0_1px_2px_rgba(20,33,61,0.04)] px-5 py-[26px] md:px-7 max-w-[760px]">
          <div className="flex items-center gap-4 pb-[22px] border-b border-[#E6E8EE] mb-[22px]">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="w-16 h-16 rounded-[10px] overflow-hidden bg-[#E5E7EE] flex items-center justify-center text-[18px] font-bold text-[#7A8299] hover:opacity-85 transition-opacity relative shrink-0" title="Click to change photo">
              {uploading ? (
                <svg className="animate-spin h-6 w-6 text-[#2F5DD4]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              ) : avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </button>
            <div>
              <div className="text-[17px] font-bold text-[#1F2433]">{displayName}</div>
              <div className="text-[12.5px] text-[#7A8299] mt-[3px]">Student ID: <b className="text-[#1F2433]">{enrollment?.id_number || 'Not assigned'}</b></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 row-gap-5 column-gap-10">
            <div className="border-b border-[#F0F1F6] pb-[14px]">
              <div className="text-[10.5px] tracking-[0.05em] text-[#9AA1B5] font-bold mb-1.5">FULL NAME</div>
              <div className="text-[13.8px] text-[#1F2433] font-semibold">{displayName}</div>
            </div>
            <div className="border-b border-[#F0F1F6] pb-[14px]">
              <div className="text-[10.5px] tracking-[0.05em] text-[#9AA1B5] font-bold mb-1.5">STUDENT ID</div>
              <div className="text-[13.8px] text-[#1F2433] font-semibold">{enrollment?.id_number || '—'}</div>
            </div>
            <div className="border-b border-[#F0F1F6] pb-[14px]">
              <div className="text-[10.5px] tracking-[0.05em] text-[#9AA1B5] font-bold mb-1.5">COURSE</div>
              <div className="text-[13.8px] text-[#1F2433] font-semibold">{course}</div>
            </div>
            <div className="border-b border-[#F0F1F6] pb-[14px]">
              <div className="text-[10.5px] tracking-[0.05em] text-[#9AA1B5] font-bold mb-1.5">YEAR AND SECTION</div>
              <div className="text-[13.8px] text-[#1F2433] font-semibold">{yearSection}</div>
            </div>
            <div className="border-b border-[#F0F1F6] pb-[14px]">
              <div className="text-[10.5px] tracking-[0.05em] text-[#9AA1B5] font-bold mb-1.5">CONTACT NUMBER</div>
              <div className="text-[13.8px] text-[#1F2433] font-semibold">{contact}</div>
            </div>
            <div className="border-b border-[#F0F1F6] pb-[14px]">
              <div className="text-[10.5px] tracking-[0.05em] text-[#9AA1B5] font-bold mb-1.5">ADDRESS</div>
              <div className="text-[13.8px] text-[#1F2433] font-semibold">{address}</div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

export default Profile
