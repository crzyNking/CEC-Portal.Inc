import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Stats {
  users: number
  news: number
  events: number
  programs: number
  announcements: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ users: 0, news: 0, events: 0, programs: 0, announcements: 0 })
  const [recentNews, setRecentNews] = useState<any[]>([])
  const [recentEvents, setRecentEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    setLoading(true)
    const [users, news, events, programs, announcements] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('news').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('programs').select('id', { count: 'exact', head: true }),
      supabase.from('announcements').select('id', { count: 'exact', head: true }),
    ])

    setStats({
      users: users.count || 0,
      news: news.count || 0,
      events: events.count || 0,
      programs: programs.count || 0,
      announcements: announcements.count || 0,
    })

    const [recentN, recentE] = await Promise.all([
      supabase.from('news').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('events').select('*').order('event_date', { ascending: false }).limit(5),
    ])

    setRecentNews(recentN.data || [])
    setRecentEvents(recentE.data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Users', value: stats.users, color: 'bg-blue-500', link: '/admin/users' },
    { label: 'News', value: stats.news, color: 'bg-emerald-500', link: '/admin/news' },
    { label: 'Events', value: stats.events, color: 'bg-amber-500', link: '/admin/events' },
    { label: 'Programs', value: stats.programs, color: 'bg-purple-500', link: '/admin/programs' },
    { label: 'Announcements', value: stats.announcements, color: 'bg-rose-500', link: '/admin/announcements' },
  ]

  const quickActions = [
    { label: 'New Announcement', path: '/admin/announcements', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
    { label: 'Add News', path: '/admin/news', icon: 'M12 4v16m8-8H4' },
    { label: 'Add Event', path: '/admin/events', icon: 'M12 4v16m8-8H4' },
    { label: 'Update Enrollment', path: '/admin/enrollment', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Upload Gallery', path: '/admin/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0B1F3A] mb-1">Welcome, Admin</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your school website from here.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((s) => (
          <Link key={s.label} to={s.link} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white font-bold text-lg">{s.value}</span>
            </div>
            <div className="text-sm font-medium text-gray-700">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] mb-8">
        <h2 className="font-bold text-[#0B1F3A] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.path} className="flex items-center gap-2 px-4 py-2.5 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
              </svg>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#0B1F3A]">Recent News</h2>
            <Link to="/admin/news" className="text-sm text-[#1E4E8C] hover:text-[#0B1F3A] hover:underline">View all</Link>
          </div>
          {recentNews.length === 0 ? (
            <p className="text-gray-400 text-sm">No news yet.</p>
          ) : (
            <div className="space-y-3">
              {recentNews.map((n) => (
                <div key={n.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="truncate">
                    <div className="text-sm font-medium text-gray-800 truncate">{n.title}</div>
                    <div className="text-xs text-gray-400">{new Date(n.created_at).toLocaleDateString()}</div>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${n.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {n.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Events */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#0B1F3A]">Upcoming Events</h2>
            <Link to="/admin/events" className="text-sm text-[#1E4E8C] hover:text-[#0B1F3A] hover:underline">View all</Link>
          </div>
          {recentEvents.length === 0 ? (
            <p className="text-gray-400 text-sm">No events yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((e) => (
                <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="truncate">
                    <div className="text-sm font-medium text-gray-800 truncate">{e.title}</div>
                    <div className="text-xs text-gray-400">{e.event_date ? new Date(e.event_date).toLocaleDateString() : 'No date'}</div>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${e.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {e.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
