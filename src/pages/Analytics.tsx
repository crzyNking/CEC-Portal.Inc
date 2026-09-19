import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'

interface AnalyticsData {
  totalSessions: number
  lastActive: string
  loginCount: number
  dailyCounts: Array<{ date: string; count: number }>
}

export function Analytics() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return

      try {
        const { count: activityCount } = await supabase
          .from('activity_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        const { data: lastActivity } = await supabase
          .from('activity_logs')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        // Activity per day for the last 14 days
        const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        const { data: recent } = await supabase
          .from('activity_logs')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', fourteenDaysAgo)

        const counts = new Map<string, number>()
        for (let i = 13; i >= 0; i--) {
          const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          counts.set(d, 0)
        }
        ;(recent || []).forEach(r => {
          const d = new Date(r.created_at).toISOString().split('T')[0]
          if (counts.has(d)) counts.set(d, (counts.get(d) || 0) + 1)
        })
        const dailyCounts = Array.from(counts.entries()).map(([date, count]) => ({ date, count }))

        setAnalytics({
          totalSessions: activityCount || 0,
          lastActive: lastActivity?.created_at || user.created_at,
          loginCount: activityCount || 0,
          dailyCounts,
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  const stats = [
    {
      label: 'Total Activities',
      value: analytics?.totalSessions || 0,
      icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z',
      color: 'purple'
    },
    {
      label: 'Logins',
      value: analytics?.loginCount || 0,
      icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'cyan'
    },
    {
      label: 'Last Active',
      value: analytics?.lastActive ? new Date(analytics.lastActive).toLocaleDateString() : 'N/A',
      icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
      color: 'emerald'
    },
    {
      label: 'Member For',
      value: `${Math.floor((Date.now() - new Date(user?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}d`,
      icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
      color: 'sky'
    }
  ]

  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500 dark:text-purple-400', ring: 'ring-purple-500/30' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500 dark:text-cyan-400', ring: 'ring-cyan-500/30' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500 dark:text-emerald-400', ring: 'ring-emerald-500/30' },
    sky: { bg: 'bg-sky-500/10', text: 'text-sky-500 dark:text-sky-400', ring: 'ring-sky-500/30' },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1F3A] flex items-center justify-center transition-colors">
        <div className="animate-spin h-8 w-8 border-2 border-[#1E4E8C] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1F3A] relative overflow-hidden transition-colors">
      {/* Ambient background - only visible in dark mode */}
      <div className="pointer-events-none absolute inset-0 dark:block hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/8 blur-[120px]"></div>
        <div className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-cyan-500/6 blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-white/[0.06] bg-[#F8FAFC]/80 dark:bg-[#0B1F3A]/80 backdrop-blur-2xl transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const colors = colorMap[stat.color]
            return (
              <div
                key={i}
                className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-5 hover:border-gray-300 dark:hover:border-white/[0.12] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg} ring-1 ${colors.ring}`}>
                    <svg className={`h-5 w-5 ${colors.text}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Activity Chart */}
        <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-6 mb-8 transition-colors">
          <h2 className="text-lg font-semibold text-[#0B1F3A] dark:text-white mb-4">Activity Overview (Last 14 Days)</h2>
          {(() => {
            const daily = analytics?.dailyCounts || []
            const max = Math.max(...daily.map(d => d.count), 1)
            if (daily.length === 0) {
              return (
                <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 dark:border-white/[0.1] rounded-xl">
                  <p className="text-gray-500">No activity in the last 14 days</p>
                </div>
              )
            }
            return (
              <div className="flex items-end gap-1.5 h-64">
                {daily.map(d => (
                  <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <span className="text-[10px] text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{d.count}</span>
                    <div
                      className="w-full rounded-t-md bg-[#1E4E8C]/70 hover:bg-[#1E4E8C] transition-colors min-h-[3px]"
                      style={{ height: `${(d.count / max) * 85}%` }}
                    />
                    <span className="text-[9px] text-gray-400 mt-1.5">{new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</span>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-6 transition-colors">
            <h2 className="text-lg font-semibold text-[#0B1F3A] dark:text-white mb-4">Account Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
                <span className="text-gray-500">Account Status</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
                <span className="text-gray-500">Auth Provider</span>
                <span className="text-gray-900 dark:text-white font-medium">{user?.app_metadata?.provider || 'Email'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-6 transition-colors">
            <h2 className="text-lg font-semibold text-[#0B1F3A] dark:text-white mb-4">Security</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
                <span className="text-gray-500">Two-Factor Auth</span>
                <span className="text-amber-500 dark:text-amber-400 font-medium">{user?.factors?.length ? 'Enabled' : 'Not Enabled'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
                <span className="text-gray-500">Last Active</span>
                <span className="text-gray-900 dark:text-white font-medium">{analytics?.lastActive ? new Date(analytics.lastActive).toLocaleString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
                <span className="text-gray-500">Member Since</span>
                <span className="text-gray-900 dark:text-white font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
