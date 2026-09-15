import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'

interface Report {
  id: string
  title: string
  description: string
  status: 'completed' | 'pending' | 'scheduled'
  date: string
  type: 'activity' | 'security' | 'usage'
}

const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
  activity: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-500 dark:text-purple-400',
    icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z'
  },
  security: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500 dark:text-emerald-400',
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'
  },
  usage: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-500 dark:text-cyan-400',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z'
  }
}

const statusColors: Record<string, { bg: string; text: string }> = {
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-500 dark:text-emerald-400' },
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-500 dark:text-amber-400' },
  scheduled: { bg: 'bg-sky-500/10', text: 'text-sky-500 dark:text-sky-400' }
}

export function Reports() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return

      try {
        const { data: activities } = await supabase
          .from('activity_logs')
          .select('action, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        const typeMap: Record<string, Report['type']> = {
          sign_in: 'security',
          login: 'security',
          avatar_update: 'activity',
          profile_update: 'activity',
        }

        const reports: Report[] = (activities || []).map((a, i) => ({
          id: String(i + 1),
          title: a.action.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          description: `Activity logged at ${new Date(a.created_at).toLocaleString()}`,
          status: i < 3 ? 'completed' : i < 6 ? 'pending' : 'scheduled',
          date: new Date(a.created_at).toLocaleDateString(),
          type: typeMap[a.action] || 'usage',
        }))

        setReports(reports)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [user])

  const completedCount = useMemo(() => reports.filter(r => r.status === 'completed').length, [reports])
  const pendingCount = useMemo(() => reports.filter(r => r.status === 'pending').length, [reports])
  const scheduledCount = useMemo(() => reports.filter(r => r.status === 'scheduled').length, [reports])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1F3A] flex items-center justify-center transition-colors">
        <div className="animate-spin h-8 w-8 border-2 border-[#1E4E8C] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1F3A] relative overflow-hidden transition-colors">
      <div className="pointer-events-none absolute inset-0 dark:block hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/8 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-cyan-500/6 blur-[100px]" />
      </div>

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
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Reports</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
                <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedCount}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/30">
                <svg className="h-5 w-5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] p-5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/30">
                <svg className="h-5 w-5 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{scheduledCount}</p>
                <p className="text-sm text-gray-500">Scheduled</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-[rgba(11,31,58,0.08)] dark:bg-[#102A43]/80 dark:backdrop-blur-sm dark:border-white/[0.08] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">All Reports</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
            {reports.length > 0 ? reports.map((report) => {
              const typeStyle = typeColors[report.type]
              const statusStyle = statusColors[report.status]
              return (
                <div key={report.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${typeStyle.bg} ring-1 ring-white/10`}>
                      <svg className={`h-5 w-5 ${typeStyle.text}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={typeStyle.icon} />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{report.title}</p>
                      <p className="text-xs text-gray-500 truncate">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-500 hidden sm:block">{report.date}</span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              )
            }) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <p className="text-sm">No reports available</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
