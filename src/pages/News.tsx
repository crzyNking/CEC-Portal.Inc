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
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error: err } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
      if (err) {
        console.error('News fetch error:', err)
        setError('Failed to load news.')
      }
      setNews(data || [])
      setLoading(false)
    }
    fetchNews()
  }, [])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] overflow-x-hidden">
      <Header />

      <div className="bg-[#0a1f44] pt-[120px] pb-20 text-center px-4">
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[2.8rem] font-bold text-white mb-4 tracking-wide">News & Events</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-[12px] sm:text-[13px] leading-relaxed">
          Stay updated with the latest news, events, and announcements from Cebu Eastern College
        </p>
      </div>

      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 -mt-8 relative z-10 pb-16 sm:pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#0b2545] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#666] text-sm">No news articles available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow">
                <div className="relative h-[200px] sm:h-[240px]">
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80'} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 bg-[#0a3182] text-white text-[10px] font-bold px-3 py-1 rounded tracking-wide uppercase">
                    {item.category || 'CEC NEWS'}
                  </span>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-[#666] text-[11px] sm:text-[12px] mb-3">{formatDate(item.published_at || item.created_at)}</p>
                  <h3 className="text-[#0b1b42] text-[1.1rem] sm:text-[1.2rem] font-bold mb-3 leading-snug">{item.title}</h3>
                  <p className="text-[#666] text-[12px] sm:text-[13px] leading-relaxed mb-5">{item.summary}</p>
                  <button className="text-[#0b1b42] text-[12px] sm:text-[13px] font-bold inline-flex items-center gap-1 hover:text-[#0a3182] transition-colors">
                    Read Article
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
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
