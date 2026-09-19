import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useSettings } from '../../hooks/useSettings'
import { CEC_LOGO } from '../../lib/constants'

const departmentNav = [
  { label: 'Dashboard', path: '/admin', perms: null, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Super Admin', path: '/admin/super', perms: 'super_admin', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { label: 'Registrar', path: '/admin/registrar', perms: ['manage_enrollment', 'manage_id_numbers', 'manage_academic_records', 'manage_documents'], icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { label: 'Appointments', path: '/admin/appointments', perms: ['manage_appointments'], icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Inquiries', path: '/admin/inquiries', perms: ['manage_enrollment', 'manage_users'], icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
  { label: 'EDP / IT', path: '/admin/edp', perms: ['manage_users', 'manage_system_settings', 'view_activity_logs'], icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Accounting', path: '/admin/accounting', perms: ['manage_payments', 'view_students'], icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Faculty', path: '/admin/faculty', perms: ['manage_classes', 'manage_grades', 'manage_attendance'], icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { label: 'Other Admin', path: '/admin/other', perms: ['manage_news', 'manage_events', 'manage_announcements'], icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, signOut, hasRole, hasPermission } = useAuthStore()
  const { school } = useSettings()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const canSee = (perms: string | string[] | null) => {
    if (!perms) return true
    if (perms === 'super_admin') return hasRole('super_admin')
    if (Array.isArray(perms)) return perms.some((p) => hasPermission(p))
    return hasPermission(perms)
  }

  const visibleNav = departmentNav.filter((item) => canSee(item.perms))

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[260px] bg-[#0B1F3A] backdrop-blur-xl z-50 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <img
            src={school?.website_logo || CEC_LOGO}
            alt="CEC Logo"
            onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
            className="w-9 h-9 rounded-full object-cover bg-white shrink-0"
          />
          <div>
            <div className="text-white font-bold text-sm leading-tight">{school?.school_name || 'Cebu Eastern College'}</div>
            <div className="text-white/40 text-[11px]">Admin Panel</div>
          </div>
        </div>

        <nav className="py-3 overflow-y-auto h-[calc(100%-65px)]">
          {visibleNav.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-5 py-2.5 text-[13px] transition-colors ${
                  isActive
                    ? 'bg-[#1E4E8C] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            )
          })}

          <div className="border-t border-white/10 mt-3 pt-3">
            <Link to="/" className="flex items-center gap-3 px-5 py-2.5 text-[13px] text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
              </svg>
              View Website
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-[13px] text-white/70 hover:bg-white/10 hover:text-red-400 transition-colors">
              <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:ml-[260px] min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[rgba(11,31,58,0.08)] px-5 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1E4E8C] text-white flex items-center justify-center text-sm font-bold">
              {profile?.full_name?.[0] || profile?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-800">{profile?.full_name || 'Admin'}</div>
              <div className="text-[11px] text-gray-500">{profile?.email}</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-5">
          {children}
        </main>
      </div>
    </div>
  )
}