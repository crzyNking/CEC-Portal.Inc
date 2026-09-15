import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Announcement {
  id: string
  message: string
  button_text: string
  button_url: string
  bg_color: string
  text_color: string
}

function isValidColor(color: string): boolean {
  if (!color) return false
  if (/^#[0-9a-fA-F]{3,8}$/.test(color)) return true
  if (/^rgba?\(/.test(color)) return true
  if (/^hsla?\(/.test(color)) return true
  if (/^[a-z]+$/i.test(color) && color !== 'initial' && color !== 'inherit') return true
  return false
}

function safeColor(color: string, fallback: string): string {
  return isValidColor(color) ? color : fallback
}

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)

  useEffect(() => {
    loadAnnouncement()

    const channel = supabase
      .channel('announcements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        loadAnnouncement()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function loadAnnouncement() {
    const now = new Date().toISOString()
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('priority', { ascending: false })
      .limit(1)
      .maybeSingle()

    setAnnouncement(data)
  }

  if (!announcement) return null

  return (
    <div
      className="relative px-4 py-2.5 text-center text-sm flex items-center justify-center gap-3 flex-wrap"
      style={{ background: safeColor(announcement.bg_color, '#0b1f40'), color: safeColor(announcement.text_color, '#ffffff') }}
    >
      <span>📢</span>
      <span>{announcement.message}</span>
      {announcement.button_text && announcement.button_url && (
        <Link
          to={announcement.button_url}
          className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-white/20 hover:bg-white/30 transition-colors"
          style={{ color: safeColor(announcement.text_color, '#ffffff') }}
        >
          {announcement.button_text}
        </Link>
      )}
    </div>
  )
}
