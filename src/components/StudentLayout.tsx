import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useSettings } from '../hooks/useSettings'
import { supabase } from '../lib/supabase'
import { CEC_LOGO } from '../lib/constants'

const OPTIONS = [
  { label: 'Dashboard', path: '/dashboard', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Schedule', path: '/schedule', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Grades', path: '/dashboard#schedule', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> },
  { label: 'Classes', path: '/classes', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
]

const ADMINISTRATIVE = [
  { label: 'Curriculum', path: '/programs', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  { label: 'Payments', path: '/payments', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
  { label: 'Appointments', path: '/appointments', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><polyline points="9 16 11 18 15 13"/></svg> },
  { label: 'Announcement', path: '/dashboard#announcements', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11 12v6a2 2 0 0 0 4 0v-1"/></svg> },
]

export default function StudentLayout({ children, title = 'Student Campus Portal' }: { children: React.ReactNode; title?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, signOut, user } = useAuthStore()
  const { school } = useSettings()
  const [announcementCount, setAnnouncementCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      const now = new Date().toISOString()
      const { count } = await supabase.from('announcements').select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`)
      setAnnouncementCount(count || 0)
    }
    load()
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student'
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const studentId = user?.id?.slice(0, 8) || ''
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url

  const handleNav = (path: string) => {
    setSidebarOpen(false)
    if (path.includes('#')) {
      const [base, hash] = path.split('#')
      if (location.pathname === base) {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      navigate(base, { state: { scrollTo: hash } })
    } else {
      navigate(path)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      {/* Top bar */}
      <div className="bg-[#14213D] text-white flex items-center justify-between px-4 md:px-[22px] h-[52px] flex-shrink-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white/80 hover:text-white mr-1" aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div className="w-[34px] h-[34px] rounded-full overflow-hidden border-2 border-white/35 bg-gradient-to-br from-[#4A6BD6] to-[#16234A] flex items-center justify-center text-[13px] font-bold shrink-0">
            <img src={school?.website_logo || CEC_LOGO} alt="CEC" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="text-[13px] font-semibold">{school?.school_name || 'Cebu Eastern College'}</div>
            <div className="text-[10.5px] text-[#A9B3D1] font-normal">{school?.address || 'Leon Kilat St., Cebu City'}</div>
          </div>
          <div className="text-[14.5px] font-medium text-[#F2F4FB] ml-1.5 pl-4 border-l border-white/[0.18] hidden md:block">{title}</div>
        </div>
        <div className="flex items-center gap-[18px]">
          <button className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[#DFE4F5] hover:bg-white/[0.08] transition-colors" title="Search" aria-label="Search">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <div className="relative">
            <button onClick={() => { navigate('/dashboard#announcements'); setDropdownOpen(false) }} className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[#DFE4F5] hover:bg-white/[0.08] transition-colors relative" title="Notifications">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {announcementCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#E4483F] text-white text-[9px] w-[15px] h-[15px] rounded-full flex items-center justify-center border-[1.5px] border-[#14213D]">{announcementCount > 9 ? '9+' : announcementCount}</span>
              )}
            </button>
          </div>
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="Account menu" className="flex items-center gap-1.5 cursor-pointer">
              <div className="w-[30px] h-[30px] rounded-full overflow-hidden border-2 border-white/40 bg-gradient-to-br from-[#E0C49A] to-[#A97C50] flex items-center justify-center text-xs font-bold text-white">
                {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : initials}
              </div>
              <span className="text-[#C7CEE6] text-[10px] hidden sm:block">▾</span>
            </button>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-[44px] w-[230px] bg-white rounded-xl shadow-[0_12px_30px_rgba(20,33,61,0.22)] text-[#1F2433] py-3.5 pb-2 z-50">
                  <div className="px-4 pb-3 border-b border-[#E6E8EE] mb-1.5">
                    <div className="font-bold text-[13.5px]">{displayName}</div>
                    <div className="text-[11.5px] text-[#7A8299] mt-0.5">{studentId} · Student</div>
                  </div>
                  <button onClick={() => { navigate('/profile'); setDropdownOpen(false) }} className="flex items-center justify-between w-full px-4 py-2.5 text-[13px] hover:bg-[#F5F7FC] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[26px] h-[26px] rounded-[7px] bg-[#EEF1F8] flex items-center justify-center text-[#2F5DD4]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                      <span>Student Profile</span>
                    </div>
                    <span className="text-[#C3C9D9] text-[12px]">›</span>
                  </button>
                  <button onClick={() => { navigate('/change-password'); setDropdownOpen(false) }} className="flex items-center justify-between w-full px-4 py-2.5 text-[13px] hover:bg-[#F5F7FC] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[26px] h-[26px] rounded-[7px] bg-[#EEF1F8] flex items-center justify-center text-[#2F5DD4]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                      <span>Change password</span>
                    </div>
                    <span className="text-[#C3C9D9] text-[12px]">›</span>
                  </button>
                  <button onClick={handleLogout} className="flex items-center justify-between w-full px-4 py-2.5 text-[13px] text-[#E4483F] hover:bg-[#FDECEB] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[26px] h-[26px] rounded-[7px] bg-[#FDECEB] flex items-center justify-center text-[#E4483F]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>
                      <span>Log out</span>
                    </div>
                    <span className="text-[#C3C9D9] text-[12px]">›</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-start min-h-[calc(100vh-52px)]">
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`w-[210px] flex-shrink-0 bg-white border-r border-[#E6E8EE] py-5 px-3 min-h-[calc(100vh-52px)] sticky top-0 z-30 transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 fixed top-[52px] left-0 h-[calc(100vh-52px)]' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="text-[10.5px] text-[#9AA1B5] tracking-[0.06em] px-2.5 mb-2 font-semibold">OPTIONS</div>
          {OPTIONS.map((item) => (
            <button key={item.label} onClick={() => handleNav(item.path)}
              className={`flex items-center gap-2.5 w-full px-2.5 py-[9px] rounded-lg text-[13px] font-medium transition-colors mb-0.5 text-left ${location.pathname === item.path && !item.path.includes('#') ? 'bg-[#EAF0FF] text-[#2F5DD4] font-semibold' : 'text-[#525A6E] hover:bg-[#F5F7FC]'}`}>
              {item.icon}{item.label}
            </button>
          ))}

          <div className="text-[10.5px] text-[#9AA1B5] tracking-[0.06em] px-2.5 mb-2 mt-[14px] font-semibold">ADMINISTRATIVE</div>
          {ADMINISTRATIVE.map((item) => (
            <button key={item.label} onClick={() => handleNav(item.path)}
              className={`flex items-center gap-2.5 w-full px-2.5 py-[9px] rounded-lg text-[13px] font-medium transition-colors mb-0.5 text-left ${location.pathname === item.path && !item.path.includes('#') ? 'bg-[#EAF0FF] text-[#2F5DD4] font-semibold' : 'text-[#525A6E] hover:bg-[#F5F7FC]'}`}>
              {item.icon}{item.label}
            </button>
          ))}

          <div className="mt-[14px] border-t border-[#E6E8EE] pt-[14px]">
            <Link to="/help" className="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-[13px] font-medium text-[#525A6E] hover:bg-[#F5F7FC] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Help
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-[22px]">
          {children}
        </main>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#9AA1B5] py-4 flex items-center justify-center gap-1.5">
        <span className="w-[7px] h-[7px] rounded-full bg-[#0F9D58] inline-block" />
        © 2026 {school?.school_name || 'Cebu Eastern College'}. All Systems Operational
      </div>
    </div>
  )
}
