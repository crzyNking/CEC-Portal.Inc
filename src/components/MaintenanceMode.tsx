import { useSettings } from '../hooks/useSettings'
import { useAuthStore } from '../store/authStore'
import { Navigate, useLocation } from 'react-router-dom'

export default function MaintenanceMode({ children }: { children: React.ReactNode }) {
  const { website, loading } = useSettings()
  const { user, profile } = useAuthStore()
  const location = useLocation()
  const isAdmin = profile?.role === 'admin'

  if (loading) return null

  // Admin can always access, including /admin routes
  if (isAdmin) return <>{children}</>

  // If maintenance mode is off, show normal site
  if (!website?.maintenance_mode) return <>{children}</>

  // If user is on /admin, redirect to login (admin can still log in)
  const isOnAdmin = location.pathname.startsWith('/admin')
  if (isOnAdmin && !user) return <Navigate to="/" replace />
  if (isOnAdmin && user) return <>{children}</>

  // Show maintenance page
  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384 3.18A1.125 1.125 0 014.5 17.29V5.71a1.125 1.125 0 011.536-1.06l5.384 3.18a1.125 1.125 0 010 1.94z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75l3.75 2.165v7.17l-3.75 2.165a1.125 1.125 0 01-1.536-1.06V8.81a1.125 1.125 0 011.536-1.06z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Website Under Maintenance</h1>
        <p className="text-white/60 text-lg leading-relaxed mb-2">
          {website?.maintenance_message || "We're currently updating our school website. Please check back soon."}
        </p>
        <p className="text-white/40 text-sm mt-6">Cebu Eastern College</p>
      </div>
    </div>
  )
}
