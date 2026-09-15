import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

interface NewsItem {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  image_url: string
  category: string
  is_published: boolean
  is_featured: boolean
  published_at: string
  created_at: string
  type: 'news'
}

interface EventItem {
  id: string
  title: string
  slug: string
  description: string
  image_url: string
  event_date: string
  event_time: string
  location: string
  organizer: string
  is_published: boolean
  is_featured: boolean
  created_at: string
  type: 'event'
}

type FeedItem = NewsItem | EventItem

export default function News() {
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      const [newsRes, eventsRes] = await Promise.all([
        supabase.from('news').select('*').eq('is_published', true).order('published_at', { ascending: false }),
        supabase.from('events').select('*').eq('is_published', true).order('event_date', { ascending: false })
      ])
      if (newsRes.error || eventsRes.error) {
        console.error('Fetch error:', newsRes.error || eventsRes.error)
        setError('Failed to load content.')
      }
      const newsItems = (newsRes.data || []).map((n: any) => ({ ...n, type: 'news' as const }))
      const eventItems = (eventsRes.data || []).map((e: any) => ({ ...e, type: 'event' as const }))
      const combined = [...newsItems, ...eventItems].sort((a, b) => {
        const dateA = a.type === 'news' ? (a.published_at || a.created_at) : (a.event_date || a.created_at)
        const dateB = b.type === 'news' ? (b.published_at || b.created_at) : (b.event_date || b.created_at)
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      })
      setItems(combined)
      setLoading(false)
    }
    fetchAll()
  }, [])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      <Header />

      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#102A43] to-[#1E4E8C] pt-[120px] pb-20 text-center px-4 backdrop-blur-xl">
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[2.8rem] font-bold text-white mb-4 tracking-wide">News & Events</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-[12px] sm:text-[13px] leading-relaxed">
          Stay updated with the latest news, events, and announcements from Cebu Eastern College
        </p>
      </div>

      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 -mt-8 relative z-10 pb-16 sm:pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#1E4E8C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#666] text-sm">No news or events available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {items.map((item) => (
              <div key={item.id} className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(11,31,58,0.06)] border border-[rgba(11,31,58,0.08)] hover:shadow-[0_8px_30px_rgba(11,31,58,0.12)] transition-shadow">
                <div className="relative h-[200px] sm:h-[240px]">
                  <img
                    src={item.image_url || (item.type === 'event'
                      ? 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'
                      : 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80'
                    )}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`text-white text-[10px] font-bold px-3 py-1 rounded tracking-wide uppercase ${
                      item.type === 'event' ? 'bg-amber-600' : 'bg-[#1E4E8C]'
                    }`}>
                      {item.type === 'event' ? 'Event' : (item as NewsItem).category || 'News'}
                    </span>
                    {item.is_featured && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded tracking-wide uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  {item.type === 'event' ? (
                    <div className="flex items-center gap-4 text-[11px] sm:text-[12px] text-[#666] mb-3">
                      {item.event_date && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                          {formatDate(item.event_date)}
                        </span>
                      )}
                      {item.event_time && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {item.event_time}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[#666] text-[11px] sm:text-[12px] mb-3">{formatDate(item.published_at || item.created_at)}</p>
                  )}
                  <h3 className="text-[#0B1F3A] text-[1.1rem] sm:text-[1.2rem] font-bold mb-3 leading-snug">{item.title}</h3>
                  <p className="text-[#666] text-[12px] sm:text-[13px] leading-relaxed mb-4">
                    {item.type === 'event' ? item.description : item.summary}
                  </p>
                  {item.type === 'event' && (
                    <div className="flex items-center gap-4 text-[11px] sm:text-[12px] text-[#888]">
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                          {item.location}
                        </span>
                      )}
                      {item.organizer && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                          {item.organizer}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
