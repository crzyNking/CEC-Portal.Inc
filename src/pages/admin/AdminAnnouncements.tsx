import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'

interface Announcement {
  id: string
  title: string
  message: string
  is_active: boolean
  button_text: string
  button_url: string
  start_date: string
  end_date: string
  bg_color: string
  text_color: string
  priority: number
  close_button: boolean
  created_at: string
}

const empty: Partial<Announcement> = {
  title: '',
  message: '',
  is_active: false,
  button_text: '',
  button_url: '',
  start_date: '',
  end_date: '',
  bg_color: '#13275c',
  text_color: '#ffffff',
  priority: 0,
  close_button: true,
}

export default function AdminAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Announcement> | null>(null)
  const [saving, setSaving] = useState(false)
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setItems(data || [])
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to load', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    if (!editing) return
    setSaving(true)
    if (!editing.message?.trim()) {
      addNotification({ type: 'warning', title: 'Message is required' })
      setSaving(false)
      return
    }
    try {
      if (editing.id) {
        const { error } = await supabase.from('announcements').update(editing).eq('id', editing.id)
        if (error) throw error
        await logAdminActivity('updated', 'announcement', editing.id, { title: editing.title })
      } else {
        const { data, error } = await supabase.from('announcements').insert([editing]).select().single()
        if (error) throw error
        if (data) await logAdminActivity('created', 'announcement', data.id, { title: data.title })
      }
      addNotification({ type: 'success', title: 'Saved successfully' })
      setEditing(null)
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this announcement?')) return
    try {
      const item = items.find((a) => a.id === id)
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error
      await logAdminActivity('deleted', 'announcement', id, { title: item?.title })
      addNotification({ type: 'success', title: 'Deleted' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to delete', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  async function toggleActive(a: Announcement) {
    try {
      const { error } = await supabase.from('announcements').update({ is_active: !a.is_active }).eq('id', a.id)
      if (error) throw error
      await logAdminActivity('toggled', 'announcement', a.id, { title: a.title, is_active: !a.is_active })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to update', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0B1F3A]">{editing.id ? 'Edit' : 'New'} Announcement</h1>
          <button onClick={() => setEditing(null)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <button onClick={() => setEditing({ ...editing, is_active: !editing.is_active })} className={`px-4 py-2 rounded-lg text-sm font-medium ${editing.is_active ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {editing.is_active ? 'ON' : 'OFF'}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea value={editing.message || ''} onChange={(e) => setEditing({ ...editing, message: e.target.value })} rows={3} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input value={editing.button_text || ''} onChange={(e) => setEditing({ ...editing, button_text: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                <input value={editing.button_url || ''} onChange={(e) => setEditing({ ...editing, button_url: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" value={editing.start_date?.slice(0, 10) || ''} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" value={editing.end_date?.slice(0, 10) || ''} onChange={(e) => setEditing({ ...editing, end_date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                <input type="color" value={editing.bg_color || '#13275c'} onChange={(e) => setEditing({ ...editing, bg_color: e.target.value })} className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                <input type="color" value={editing.text_color || '#ffffff'} onChange={(e) => setEditing({ ...editing, text_color: e.target.value })} className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <input type="number" value={editing.priority || 0} onChange={(e) => setEditing({ ...editing, priority: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4E8C]/20 focus:border-[#1E4E8C]" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={editing.close_button || false} onChange={(e) => setEditing({ ...editing, close_button: e.target.checked })} className="rounded" />
              <label className="text-sm text-gray-700">Show close button</label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={save} disabled={saving} className="px-5 py-2.5 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A] disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Announcement'}
            </button>
            <button onClick={() => setEditing(null)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#0B1F3A] rounded-lg text-sm font-medium">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Announcements</h1>
        <button onClick={() => setEditing({ ...empty })} className="px-4 py-2 bg-[#1E4E8C] text-white rounded-lg text-sm font-medium hover:bg-[#0B1F3A]">+ New</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#1E4E8C]/30 border-t-[#1E4E8C] rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-12 text-center text-gray-400 border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)]">No announcements yet.</div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[rgba(11,31,58,0.08)] shadow-[0_4px_20px_rgba(11,31,58,0.06)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[rgba(11,31,58,0.08)]">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Message</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Dates</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(a)} className={`px-3 py-1 rounded-full text-xs font-medium ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {a.is_active ? 'Active' : 'Off'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{a.message || a.title || 'No message'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {a.start_date ? new Date(a.start_date).toLocaleDateString() : '—'} to {a.end_date ? new Date(a.end_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => setEditing(a)} className="text-[#1E4E8C] hover:text-[#0B1F3A] hover:underline text-xs font-medium">Edit</button>
                    <button onClick={() => remove(a.id)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
