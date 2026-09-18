import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useActivityStore } from '../store/activityStore'
import { Link } from 'react-router-dom'

const colorMap: Record<string, { bg: string; text: string; glow: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500 dark:text-emerald-400', glow: 'shadow-emerald-500/20', ring: 'ring-emerald-500/30' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-500 dark:text-violet-400', glow: 'shadow-violet-500/20', ring: 'ring-violet-500/30' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-500 dark:text-sky-400', glow: 'shadow-sky-500/20', ring: 'ring-sky-500/30' },
}

function getActivityIcon(action: string) {
  if (action.includes('sign_in') || action.includes('login')) {
    return { icon: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z', color: 'emerald' }
  }
  if (action.includes('avatar')) {
    return { icon: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z', color: 'violet' }
  }
  if (action.includes('profile')) {
    return { icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z', color: 'sky' }
  }
  return { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', color: 'emerald' }
}

function formatActivityAction(action: string) {
  return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.signOut)
  const isAdmin = profile?.role === 'admin'
  const activities = useActivityStore((s) => s.activities)
  const fetchActivities = useActivityStore((s) => s.fetchActivities)
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (user) {
      fetchActivities(user.id, 5)
    }
  }, [user, fetchActivities])

  const handleSignOut = useCallback(async () => {
    await signOut()
    navigate('/', { replace: true })
  }, [signOut, navigate])

  const userMetadata = user?.user_metadata
  const displayName = profile?.full_name || userMetadata?.full_name || userMetadata?.name || user?.email?.split('@')[0] || 'User'
  const avatarUrl = profile?.avatar_url || userMetadata?.avatar_url
  const email = profile?.email || user?.email
  const initials = useMemo(() => displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2), [displayName])

  const stats = useMemo(() => [
    { label: 'Account Status', value: 'Active', color: 'emerald', iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Auth Provider', value: 'Google', color: 'violet', iconPath: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Member Since', value: new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), color: 'sky', iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ], [user?.created_at])

  const handleNavigate = useCallback((path: string) => navigate(path), [navigate])

  const quickActions = useMemo(() => [
    { label: 'Analytics', iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z', iconColor: 'text-purple-500 dark:text-purple-400', path: '/analytics' },
    { label: 'Reports', iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', iconColor: 'text-cyan-500 dark:text-cyan-400', path: '/reports' },
    { label: 'Settings', iconPath: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z', iconColor: 'text-amber-500 dark:text-amber-400', path: '/settings' },
    { label: 'Profile', iconPath: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z', iconColor: 'text-emerald-500 dark:text-emerald-400', path: '/profile' },
  ], [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1F3A] relative overflow-hidden transition-colors">
      <div className="pointer-events-none absolute inset-0 dark:block hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/8 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-cyan-500/6 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[500px] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-white/[0.06] bg-[#F8FAFC]/80 dark:bg-[#0B1F3A]/80 backdrop-blur-2xl transition-colors">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 opacity-60 blur-md" />
                <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
              </div>
              <span className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white hidden sm:block">Dashboard</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 sm:gap-2.5 rounded-full bg-white/90 dark:bg-[#102A43]/80 py-1 pr-1 pl-1 sm:pl-2.5 text-left transition-all duration-200 hover:bg-gray-200 dark:hover:bg-white/[0.08] ring-1 ring-gray-200 dark:ring-white/[0.08]"
              >
                {avatarUrl ? (
                  <img className="h-8 w-8 rounded-full object-cover ring-2 ring-purple-500/40 sm:h-9 sm:w-9" src={avatarUrl} alt={displayName} />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-xs font-bold text-white ring-2 ring-purple-500/40 sm:h-9 sm:w-9 sm:text-sm">
                    {initials}
                  </div>
                )}
                <div className="text-left hidden sm:block leading-tight">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{displayName}</p>
                  <p className="text-[11px] text-gray-500">{email}</p>
                </div>
                <svg className={`hidden sm:block h-4 w-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowDropdown(false)} />
                  <div className="absolute right-0 z-40 mt-2 w-60 sm:w-64 overflow-hidden rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white/90 backdrop-blur-sm dark:bg-[#102A43]/80 dark:backdrop-blur-sm shadow-2xl shadow-black/10 dark:shadow-black/40">
                    <div className="border-b border-gray-100 dark:border-white/[0.06] p-4">
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <img className="h-11 w-11 rounded-xl object-cover ring-2 ring-purple-500/40" src={avatarUrl} alt={displayName} />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-base font-bold text-white">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900 dark:text-white">{displayName}</p>
                          <p className="truncate text-sm text-gray-500">{email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        Profile
                      </button>
                      <button
                        onClick={() => { navigate('/settings'); setShowDropdown(false); }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </button>
                      <div className="my-1.5 border-t border-gray-100 dark:border-white/[0.06]" />
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0B1F3A] dark:text-white mb-2">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">
              {displayName.split(' ')[0]}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500">Here&apos;s what&apos;s happening with your account today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-4 sm:p-5 transition-all duration-300 hover:border-gray-300 dark:hover:border-white/[0.12] hover:bg-gray-50 dark:hover:bg-white/[0.04]">
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${colorMap[stat.color].bg} blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl ${colorMap[stat.color].bg} ring-1 ${colorMap[stat.color].ring}`}>
                  <svg className={`h-5 w-5 ${colorMap[stat.color].text}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.iconPath} />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-5 sm:p-6 lg:row-span-2">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="relative">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Profile
              </h3>

              <div className="flex flex-col items-center text-center">
                <button
                  onClick={() => navigate('/profile')}
                  className="relative mb-4 group cursor-pointer"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 opacity-40 blur-lg" />
                  {avatarUrl ? (
                    <img className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover ring-2 ring-gray-200 dark:ring-white/10" src={avatarUrl} alt={displayName} />
                  ) : (
                    <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 text-2xl sm:text-3xl font-bold text-white ring-2 ring-gray-200 dark:ring-white/10">
                      {initials}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  </div>
                </button>
                <p className="text-xs text-gray-500 mb-2 -mt-2">Click to edit</p>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{displayName}</h4>
                <p className="mt-1 text-sm text-gray-500 break-all">{email}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 ring-1 ring-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-500 dark:text-emerald-400">Active</span>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-gray-100 dark:border-white/[0.06] pt-5">
                {[
                  { label: 'Email', value: email },
                  { label: 'Provider', value: 'Google OAuth' },
                  { label: 'Joined', value: new Date(user?.created_at || Date.now()).toLocaleDateString() },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm gap-2">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="min-w-0 truncate text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-5 sm:p-6">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleNavigate(action.path)}
                    className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-4 sm:p-5 text-center transition-all duration-300 hover:border-gray-300 dark:hover:border-white/[0.12] hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                  >
                    <div className="relative mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/[0.04] ring-1 ring-gray-200 dark:ring-white/[0.08] transition-all duration-300 group-hover:scale-110 group-hover:ring-gray-300 dark:group-hover:ring-white/[0.16]">
                      <svg className={`h-5 w-5 ${action.iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={action.iconPath} />
                      </svg>
                    </div>
                    <span className="relative text-xs sm:text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-900 dark:group-hover:text-white">{action.label}</span>
                  </button>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="group relative overflow-hidden rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 p-4 sm:p-5 text-center transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500/40 hover:bg-amber-100 dark:hover:bg-amber-500/10"
                  >
                    <div className="relative mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/10 ring-1 ring-amber-200 dark:ring-amber-500/20 transition-all duration-300 group-hover:scale-110">
                      <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="relative text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300 transition-colors">Admin Panel</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-5 sm:p-6">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activity
              </h3>
              <div className="space-y-1">
                {activities.length > 0 ? (
                  activities.map((activity, i) => {
                    const activityStyle = getActivityIcon(activity.action)
                    const itemColor = colorMap[activityStyle.color]
                    return (
                      <div key={i} className="group flex items-center gap-3.5 rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]">
                        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${itemColor.bg} ring-1 ${itemColor.ring}`}>
                          <svg className={`h-4 w-4 ${itemColor.text}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d={activityStyle.icon} />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formatActivityAction(activity.action)}</p>
                          <p className="text-xs text-gray-500">{new Date(activity.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p className="text-sm">No activity yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
