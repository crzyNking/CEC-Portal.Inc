import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useActivityStore } from '../store/activityStore'
import { supabase } from '../lib/supabase'
import StudentLayout from '../components/StudentLayout'
import { dashboardPathFor } from '../lib/studentAuth'

interface EnrollmentRecord {
  id_number: string
  program: string
  level: string
  first_name: string
  last_name: string
  student_id: string
  status: string
}

interface BillingRecord {
  id: string
  student_id: string
  total_amount: number
  total_paid: number
  balance: number
  academic_year: string
  semester: string
}

interface ClassRecord {
  id: string
  subject_name: string
  subject_code: string
  schedule: string
  room: string
  instructor: string
}

interface GradeRecord {
  id: string
  subject_name: string
  subject_code: string
  grade: number
  remarks: string
  semester: string
}

interface AnnouncementRecord {
  id: string
  title: string
  content: string
  priority: string
  created_at: string
  author_name: string
}

const priorityColors: Record<string, string> = {
  urgent: 'bg-[#E4483F]/10 border-l-[3px] border-l-[#E4483F] text-[#E4483F]',
  high: 'bg-[#E4483F]/10 border-l-[3px] border-l-[#E4483F] text-[#E4483F]',
  normal: 'bg-[#D5EBF9]/60 border-l-[3px] border-l-[#2F5DD4] text-[#1F2433]',
  low: 'bg-[#EEF1F8]/60 border-l-[3px] border-l-[#9AA1B5] text-[#525A6E]',
}

export function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
  const fetchActivities = useActivityStore((s) => s.fetchActivities)
  const navigate = useNavigate()
  const location = useLocation()

  const [enrollment, setEnrollment] = useState<EnrollmentRecord | null>(null)
  const [billing, setBilling] = useState<BillingRecord[]>([])
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [grades, setGrades] = useState<GradeRecord[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([])

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }, [location.state])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const [enrollRes, billingRes, classRes, gradeRes, announceRes] = await Promise.all([
        supabase.from('enrollment_submissions').select('*').eq('student_id', user.id).order('claimed_at', { ascending: false }).limit(1),
        supabase.from('billing_accounts').select('*').eq('student_id', user.id),
        supabase.from('class_rosters').select('*').eq('student_id', user.id),
        supabase.from('grades').select('*').eq('student_id', user.id),
        supabase.from('announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(5),
      ])
      if (enrollRes.data?.[0]) setEnrollment(enrollRes.data[0])
      if (billingRes.data) setBilling(billingRes.data)
      if (classRes.data) setClasses(classRes.data)
      if (gradeRes.data) setGrades(gradeRes.data)
      if (announceRes.data) {
        const now = new Date()
        const filtered = announceRes.data.filter(a => {
          if (a.start_date && new Date(a.start_date) > now) return false
          if (a.end_date && new Date(a.end_date) < now) return false
          return true
        })
        setAnnouncements(filtered)
      }
    }
    load()
  }, [user])

  useEffect(() => {
    if (user) fetchActivities(user.id, 5)
  }, [user, fetchActivities])

  const totalDue = useMemo(() => billing.reduce((s, b) => s + (b.total_amount || 0), 0), [billing])
  const totalBalance = useMemo(() => billing.reduce((s, b) => s + (b.balance || 0), 0), [billing])

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student'
  const firstName = displayName.split(' ')[0]

  const content = (
    <div className="flex flex-col gap-6">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-[#14213D]">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {firstName}</h1>
            <p className="text-[13px] text-[#7A8299] mt-0.5">What are we going to do today?</p>
          </div>
          <div className="text-[11px] text-[#9AA1B5]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          {/* Main Column */}
          <div className="flex flex-col gap-5 min-w-0">
            {/* Quick Links */}
            <div className="bg-white rounded-xl p-5 border border-[#E6E8EE]">
              <h2 className="text-[14px] font-bold text-[#14213D] mb-4">Quick Links</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Schedule', path: '#schedule', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, color: 'text-[#2F5DD4]' },
                  { label: 'Grades', path: '#grades', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>, color: 'text-[#0F9D58]' },
                  { label: 'Fees', path: '/payments', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>, color: 'text-[#E4483F]' },
                  { label: 'Announcement', path: '#announcements', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11 12v6a2 2 0 0 0 4 0v-1"/></svg>, color: 'text-[#9B59B6]' },
                ].map(link => (
                  <a key={link.label} href={link.path.startsWith('#') ? link.path : undefined}
                    onClick={e => { if (link.path.startsWith('#')) { e.preventDefault(); document.getElementById(link.path.slice(1))?.scrollIntoView({ behavior: 'smooth' }) } else { navigate(link.path) } }}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[#F8F9FB] hover:bg-[#EEF1F8] transition-colors cursor-pointer">
                    <div className={`${link.color}`}>{link.icon}</div>
                    <span className="text-[11.5px] font-medium text-[#525A6E]">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Class Track */}
            <div id="schedule" className="bg-white rounded-xl p-5 border border-[#E6E8EE]">
              <h2 className="text-[14px] font-bold text-[#14213D] mb-4">Class Track</h2>
              {classes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#E6E8EE]">
                        <th className="text-[11px] font-semibold text-[#7A8299] pb-2 pr-4">Subject</th>
                        <th className="text-[11px] font-semibold text-[#7A8299] pb-2 pr-4">Schedule</th>
                        <th className="text-[11px] font-semibold text-[#7A8299] pb-2 pr-4">Room</th>
                        <th className="text-[11px] font-semibold text-[#7A8299] pb-2">Instructor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.slice(0, 6).map(c => (
                        <tr key={c.id} className="border-b border-[#F0F2F7] last:border-0">
                          <td className="py-2.5 pr-4">
                            <div className="text-[12.5px] font-semibold text-[#14213D]">{c.subject_name}</div>
                            <div className="text-[11px] text-[#9AA1B5]">{c.subject_code}</div>
                          </td>
                          <td className="py-2.5 pr-4 text-[12px] text-[#525A6E]">{c.schedule || '—'}</td>
                          <td className="py-2.5 pr-4 text-[12px] text-[#525A6E]">{c.room || '—'}</td>
                          <td className="py-2.5 text-[12px] text-[#525A6E]">{c.instructor || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-full bg-[#EEF1F8] flex items-center justify-center mx-auto mb-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA1B5" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                  </div>
                  <p className="text-[12px] text-[#9AA1B5]">No classes assigned yet</p>
                </div>
              )}
            </div>

            {/* Grades */}
            <div id="grades" className="bg-white rounded-xl p-5 border border-[#E6E8EE]">
              <h2 className="text-[14px] font-bold text-[#14213D] mb-4">Grades</h2>
              {grades.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#E6E8EE]">
                        <th className="text-[11px] font-semibold text-[#7A8299] pb-2 pr-4">Subject</th>
                        <th className="text-[11px] font-semibold text-[#7A8299] pb-2 pr-4">Grade</th>
                        <th className="text-[11px] font-semibold text-[#7A8299] pb-2">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.slice(0, 6).map(g => (
                        <tr key={g.id} className="border-b border-[#F0F2F7] last:border-0">
                          <td className="py-2.5 pr-4">
                            <div className="text-[12.5px] font-semibold text-[#14213D]">{g.subject_name}</div>
                            <div className="text-[11px] text-[#9AA1B5]">{g.subject_code}</div>
                          </td>
                          <td className="py-2.5 pr-4 text-[12px] font-semibold text-[#14213D]">{g.grade ?? '—'}</td>
                          <td className="py-2.5">
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${g.remarks === 'Passed' ? 'bg-[#E6F7ED] text-[#0F9D58]' : g.remarks === 'Failed' ? 'bg-[#FDECEB] text-[#E4483F]' : 'bg-[#EEF1F8] text-[#7A8299]'}`}>
                              {g.remarks || '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-full bg-[#EEF1F8] flex items-center justify-center mx-auto mb-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA1B5" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </div>
                  <p className="text-[12px] text-[#9AA1B5]">No grades available yet</p>
                </div>
              )}
            </div>

            {/* Admin Services */}
            {enrollment && (
              <div className="bg-white rounded-xl p-5 border border-[#E6E8EE]">
                <h2 className="text-[14px] font-bold text-[#14213D] mb-3">Administrative Services</h2>
                <p className="text-[12px] text-[#7A8299] mb-4">View your outstanding balance and pay your school fees</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-[#F8F9FB] border border-[#E6E8EE]">
                    <div className="text-[11px] text-[#7A8299] mb-0.5">Total Assessment</div>
                    <div className="text-[14px] font-bold text-[#14213D]">₱{totalDue.toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8F9FB] border border-[#E6E8EE]">
                    <div className="text-[11px] text-[#7A8299] mb-0.5">Remaining Balance</div>
                    <div className="text-[14px] font-bold text-[#E4483F]">₱{totalBalance.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/payments')} className="flex-1 py-2 rounded-lg bg-[#0F9D58] hover:bg-[#0D8A4C] text-white text-[12.5px] font-semibold transition-colors">
                    Pay Now
                  </button>
                  <button onClick={() => navigate('/payments')} className="flex-1 py-2 rounded-lg bg-[#2F5DD4] hover:bg-[#1E4E8C] text-white text-[12.5px] font-semibold transition-colors">
                    View Ledger
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Student Profile Card */}
            {enrollment && (
              <div className="bg-white rounded-xl p-4 border border-[#E6E8EE]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14213D] to-[#2F5DD4] flex items-center justify-center text-white text-[13px] font-bold">
                    {user?.email?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[#14213D] truncate">{enrollment.first_name} {enrollment.last_name}</div>
                    <div className="text-[11px] text-[#7A8299]">ID: {enrollment.id_number}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 text-[11.5px]">
                  <div className="flex justify-between"><span className="text-[#7A8299]">Course:</span><span className="font-medium text-[#14213D]">{enrollment.program}</span></div>
                  <div className="flex justify-between"><span className="text-[#7A8299]">Level:</span><span className="font-medium text-[#14213D]">{enrollment.level}</span></div>
                  <div className="flex justify-between"><span className="text-[#7A8299]">Status:</span>
                    <span className={`font-medium ${enrollment.status === 'approved' ? 'text-[#0F9D58]' : enrollment.status === 'pending' ? 'text-[#D4A017]' : 'text-[#E4483F]'}`}>{enrollment.status}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Urgent Announcements */}
            <div id="announcements" className="bg-white rounded-xl p-4 border border-[#E6E8EE]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-[#14213D]">Urgent Announcements</h3>
                {announcements.length > 0 && (
                  <span className="bg-[#E4483F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{announcements.filter(a => a.priority === 'urgent').length || announcements.length}</span>
                )}
              </div>
              <div className="flex flex-col gap-2.5">
                {announcements.length > 0 ? announcements.slice(0, 4).map(a => (
                  <div key={a.id} className={`rounded-lg p-2.5 ${priorityColors[a.priority] || priorityColors.normal}`}>
                    <div className="text-[12px] font-semibold">{a.title}</div>
                    <div className="text-[11px] opacity-80 mt-0.5 line-clamp-2">{a.content}</div>
                  </div>
                )) : (
                  <div className="text-center py-6">
                    <div className="w-8 h-8 rounded-full bg-[#EEF1F8] flex items-center justify-center mx-auto mb-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9AA1B5" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
                    </div>
                    <p className="text-[11px] text-[#9AA1B5]">No urgent announcements</p>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Link */}
            {isAdmin && (
              <Link to={dashboardPathFor(profile?.role || 'admin')} className="flex items-center gap-2 p-3 rounded-lg bg-[#FFF8E6] border border-[#F0D68A] hover:bg-[#FFF0CC] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span className="text-[12.5px] font-semibold text-[#D4A017]">Open Admin Panel</span>
              </Link>
            )}
          </div>
        </div>
      </div>
  )

  // Admin gets a simpler dashboard (no student sidebar)
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-[#F8FAFC]/80 backdrop-blur-2xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <h1 className="text-lg font-semibold text-[#0B1F3A]">Dashboard</h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{displayName}</span>
                <Link to={dashboardPathFor(profile?.role || 'admin')} className="px-3 py-1.5 rounded-lg bg-[#1E4E8C] text-white text-xs font-semibold">
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {content}
        </main>
      </div>
    )
  }

  return <StudentLayout title="Dashboard">{content}</StudentLayout>
}

export default Dashboard
