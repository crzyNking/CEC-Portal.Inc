import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
  permission?: string
  permissions?: string[]
  superOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false, permission, permissions, superOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin, hasPermission, hasRole } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1F3A]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 w-20 h-20 border-4 border-white/20 border-t-[#1E4E8C] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <p className="text-white/60">Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (superOnly && !hasRole('super_admin')) {
    return <Navigate to="/unauthorized" replace />
  }

  const requiredPerms = permissions ?? (permission ? [permission] : [])
  if (requiredPerms.length > 0 && !requiredPerms.some((p) => hasPermission(p))) {
    return <Navigate to="/unauthorized" replace />
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
