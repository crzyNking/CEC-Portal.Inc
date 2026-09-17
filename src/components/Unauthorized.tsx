import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Unauthorized() {
  const { profile, signOut } = useAuthStore()
  const isStaff = profile && ['super_admin', 'registrar', 'edp', 'accounting', 'faculty', 'other_admin', 'admin'].includes(profile.role)

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #102A43 50%, #1E4E8C 100%)' }}>
      <div className="bg-[rgba(13,33,84,0.92)] border border-white/20 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-[20px] max-w-md w-full p-10 text-center text-white">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/15 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-white/70 text-sm mb-8">
          You don't have permission to access this page. If you believe this is a mistake, please contact the EDP / IT department.
        </p>
        <div className="flex flex-col gap-3">
          {isStaff ? (
            <Link to="/admin" className="inline-block bg-white text-[#0f172a] font-semibold py-3 px-6 rounded-xl text-sm hover:bg-[#f1f5f9] transition-all">
              Back to Admin Panel
            </Link>
          ) : (
            <Link to="/dashboard" className="inline-block bg-white text-[#0f172a] font-semibold py-3 px-6 rounded-xl text-sm hover:bg-[#f1f5f9] transition-all">
              Back to Dashboard
            </Link>
          )}
          <button onClick={() => signOut()} className="text-white/60 hover:text-white text-sm underline bg-transparent border-none cursor-pointer">
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
