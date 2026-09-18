import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useNotification } from '../hooks/useNotification'
import { supabase } from '../lib/supabase'
import StudentLayout from '../components/StudentLayout'
import { dashboardPathFor } from '../lib/studentAuth'

interface BillingRecord {
  id: string
  total_due: number | null
  balance: number | null
  status: string
  school_year: string
  semester: string
  created_at: string
}

interface GradeRecord {
  id: string
  grade: number | null
  remarks: string | null
}

interface AnnouncementRecord {
  id: string
  title: string
  content: string
  priority: string
  created_at: string
}

const CLASS_TRACKS = [
  { title: 'Project Milestone I', sub: '(UI Design)', due: 'Oct 23' },
  { title: 'Assignment', sub: '(Research Paper)', due: 'Nov 5' },
  { title: 'Extracurricular', sub: "(Student Gov't Planning)", due: 'Nov 12' },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
  const notify = useNotification()
  const location = useLocation()

  const [billing, setBilling] = useState<BillingRecord[]>([])
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
      const [billingRes, gradeRes, announceRes] = await Promise.all([
        supabase.from('billing_accounts').select('*').eq('student_id', user.id).order('created_at', { ascending: false }),
        supabase.from('grades').select('*').eq('student_id', user.id),
        supabase.from('announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(6),
      ])
      if (billingRes.data) setBilling(billingRes.data)
      if (gradeRes.data) setGrades(gradeRes.data)
      if (announceRes.data) {
        const now = new Date()
        setAnnouncements(announceRes.data.filter(a => {
          if (a.start_date && new Date(a.start_date) > now) return false
          if (a.end_date && new Date(a.end_date) < now) return false
          return true
        }))
      }
    }
    load()
  }, [user])

  const gpa = useMemo(() => {
    const valid = grades.filter(g => g.grade !== null && g.grade !== undefined)
    if (valid.length === 0) return null
    return (valid.reduce((s, g) => s + Number(g.grade), 0) / valid.length).toFixed(2)
  }, [grades])

  const finances = useMemo(() => {
    const current = billing[0]
    const backBalance = billing.slice(1).reduce((s, b) => s + (b.balance || 0), 0)
    const totalDueToday = current ? (current.balance && current.balance > 0 ? current.balance : (current.total_due || 0)) : 0
    const netTotal = billing.reduce((s, b) => s + (b.total_due || 0), 0)
    return { backBalance, totalDueToday, netTotal }
  }, [billing])

  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student'

  const handlePay = (channel: string) => {
    notify.info({ title: 'e-Payment', message: `${channel} payments will be available soon. Please visit the Accounting Office for now.` })
  }

  const content = (
    <div className="flex flex-col lg:flex-row items-start gap-[18px]">
      <div className="flex-1 min-w-0 flex flex-col gap-[18px] w-full">
        {/* Dashboard Overview */}
        <div id="schedule" className="bg-white border border-[#E6E8EE] rounded-[10px] shadow-[0_1px_3px_rgba(20,33,61,0.06),0_1px_2px_rgba(20,33,61,0.04)] px-5 py-[18px]">
          <div className="flex items-center justify-between mb-3.5">
            <div className="text-[14px] font-bold text-[#1F2433]">Dashboard Overview</div>
            <button className="text-[#B7BDCF] font-bold tracking-[1px] px-1.5 py-0.5 text-[15px]" title="More">⋯</button>
          </div>

          <div className="text-[11.5px] text-[#9AA1B5] font-semibold mb-2.5">Quick Links</div>
          <div className="flex flex-col sm:flex-row gap-3.5 mb-[18px]">
            <button onClick={() => document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex-1 flex items-center gap-2.5 border border-[#E6E8EE] rounded-[9px] px-3.5 py-3 text-left hover:border-[#C7D2EE] hover:bg-[#FAFBFF] transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#EAF0FF] flex items-center justify-center text-[#2F5DD4] shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div className="font-semibold text-[12.8px] text-[#1F2433]">View Class Schedule</div>
            </button>
            <button onClick={() => document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex-1 flex items-center gap-2.5 border border-[#E6E8EE] rounded-[9px] px-3.5 py-3 text-left hover:border-[#C7D2EE] hover:bg-[#FAFBFF] transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#EAF0FF] flex items-center justify-center text-[#2F5DD4] shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </div>
              <div>
                <div className="font-semibold text-[12.8px] text-[#1F2433]">Grades</div>
                <div className="text-[11px] text-[#7A8299] mt-0.5">{gpa ? `Latest GPA: ${gpa}` : 'No grades yet'}</div>
              </div>
            </button>
          </div>

          <div id="tracks" className="text-[11.5px] text-[#9AA1B5] font-semibold mb-2.5">Class Tracks</div>
          <div className="flex flex-col sm:flex-row gap-3">
            {CLASS_TRACKS.map(t => (
              <div key={t.title} className="flex-1 border border-[#E6E8EE] rounded-[9px] px-3.5 py-3">
                <div className="font-bold text-[12.6px] text-[#1F2433]">{t.title}</div>
                <div className="text-[11px] text-[#7A8299] mt-0.5 mb-3.5">{t.sub}</div>
                <div className="text-[11px] text-[#9AA1B5]">Due: <b className="text-[#4A5066] font-semibold">{t.due}</b></div>
              </div>
            ))}
          </div>
        </div>

        {/* Administrative Services */}
        <div id="payments" className="bg-white border border-[#E6E8EE] rounded-[10px] shadow-[0_1px_3px_rgba(20,33,61,0.06),0_1px_2px_rgba(20,33,61,0.04)] px-5 py-[18px]">
          <div className="flex items-center justify-between mb-3.5">
            <div className="text-[14px] font-bold text-[#1F2433]">Administrative Services</div>
            <button className="text-[#B7BDCF] font-bold tracking-[1px] px-1.5 py-0.5 text-[15px]" title="More">⋯</button>
          </div>
          <div className="text-[11.5px] text-[#9AA1B5] font-semibold mb-1">Financial Overview</div>
          <div className="flex justify-between py-2 text-[12.8px] text-[#4A5066] border-b border-[#F0F1F6]">
            <span className="text-[#7A8299]">Back Balance</span><span>{fmt(finances.backBalance)}</span>
          </div>
          <div className="flex justify-between py-2 text-[12.8px] text-[#4A5066] border-b border-[#F0F1F6]">
            <span className="text-[#7A8299]">Forwarded</span><span>0.00</span>
          </div>
          <div className="flex justify-between py-2 text-[12.8px] font-bold">
            <span className="text-[#7A8299]">Total Due Today</span><span>{fmt(finances.totalDueToday)}</span>
          </div>

          <div className="flex justify-between items-center pt-3.5 mt-1.5 border-t border-[#E6E8EE]">
            <div className="text-[12px] text-[#7A8299]">Net Total Due</div>
            <div className="text-[22px] font-extrabold text-[#1F2433]">{fmt(finances.netTotal)}</div>
          </div>

          <div className="flex justify-end items-center gap-2 mt-3.5 flex-wrap">
            <span className="text-[11px] text-[#7A8299] mr-1">Pay via e-wallet:</span>
            <button onClick={() => handlePay('GCash')} className="border-none rounded-[7px] px-3.5 py-2 text-[12px] font-semibold cursor-pointer flex items-center gap-1.5 bg-[#0B2A6B] text-white hover:opacity-90 transition-opacity">GCash</button>
            <button onClick={() => handlePay('PayMaya')} className="border-none rounded-[7px] px-3.5 py-2 text-[12px] font-semibold cursor-pointer flex items-center gap-1.5 bg-[#0FAE5F] text-white hover:opacity-90 transition-opacity">PayMaya</button>
            <button onClick={() => handlePay('Online bank')} className="rounded-[7px] px-3.5 py-2 text-[12px] font-semibold cursor-pointer flex items-center gap-1.5 bg-white border border-[#E6E8EE] text-[#4A5066] hover:bg-[#FAFBFF] transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V9l7-6 7 6v12"/><path d="M9 21v-6h6v6"/></svg>
              Online bank
            </button>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div id="announcements" className="w-full lg:w-[280px] flex-shrink-0">
        <div className="bg-white border border-[#E6E8EE] rounded-[10px] shadow-[0_1px_3px_rgba(20,33,61,0.06),0_1px_2px_rgba(20,33,61,0.04)] px-5 py-[18px]">
          <div className="text-[12.5px] font-bold text-[#1F2433] mb-1">URGENT ANNOUNCEMENTS</div>
          <div className="flex flex-col">
            {announcements.length > 0 ? announcements.slice(0, 5).map(a => (
              <div key={a.id} className="py-[11px] border-b border-[#EEF0F5] last:border-0">
                <div className="text-[12px] text-[#3B4256] leading-[1.45]">
                  {a.priority === 'urgent' && <span className="text-[#E4483F] font-bold">[URGENT] </span>}
                  {a.content || a.title}
                </div>
                <div className="text-[10.5px] text-[#9AA1B5] mt-[5px]">{timeAgo(a.created_at)}</div>
              </div>
            )) : (
              <div className="py-8 text-center text-[12px] text-[#9AA1B5]">No announcements right now</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Admins get a simplified dashboard without the student sidebar
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#F4F6FB]">
        <header className="sticky top-0 z-40 border-b border-[#E6E8EE] bg-white/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <h1 className="text-lg font-semibold text-[#1F2433]">Dashboard</h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#7A8299]">{displayName}</span>
                <Link to={dashboardPathFor(profile?.role || 'admin')} className="px-3 py-1.5 rounded-lg bg-[#14213D] text-white text-xs font-semibold">
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {content}
        </main>
      </div>
    )
  }

  return <StudentLayout title="Student Campus Portal">{content}</StudentLayout>
}

export default Dashboard
