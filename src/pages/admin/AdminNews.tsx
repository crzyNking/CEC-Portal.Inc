import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { logAdminActivity } from '../../lib/activityLog'
import { useNotificationStore } from '../../store/notificationStore'

interface NewsItem { id: string; title: string; slug: string; summary: string; content: string; image_url: string; category: string; is_published: boolean; is_featured: boolean; published_at: string | null; created_at: string }

const empty: Partial<NewsItem> = { title: '', slug: '', summary: '', content: '', image_url: '', category: 'general', is_published: true, is_featured: false }

export default function AdminNews() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null)
  const [saving, setSaving] = useState(false)
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false })
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
    if (!editing.title?.trim()) {
      addNotification({ type: 'warning', title: 'Title is required' })
      setSaving(false)
      return
    }
    try {
      const slug = editing.slug || editing.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
      const payload = { ...editing, slug }
      if (editing.id) {
        const { error } = await supabase.from('news').update(payload).eq('id', editing.id)
        if (error) throw error
        await logAdminActivity('updated', 'news', editing.id, { title: editing.title })
      } else {
        const { data, error } = await supabase.from('news').insert([{ ...payload, published_at: payload.is_published ? new Date().toISOString() : null }]).select().single()
        if (error) throw error
        if (data) await logAdminActivity('created', 'news', data.id, { title: data.title })
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
    if (!confirm('Delete this news article?')) return
    try {
      const item = items.find((n) => n.id === id)
      const { error } = await supabase.from('news').delete().eq('id', id)
      if (error) throw error
      await logAdminActivity('deleted', 'news', id, { title: item?.title })
      addNotification({ type: 'success', title: 'Deleted' })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to delete', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  async function togglePublish(n: NewsItem) {
    try {
      const newPublished = !n.is_published
      const { error } = await supabase.from('news').update({ is_published: newPublished, published_at: newPublished ? new Date().toISOString() : null }).eq('id', n.id)
      if (error) throw error
      await logAdminActivity(newPublished ? 'published' : 'unpublished', 'news', n.id, { title: n.title })
      load()
    } catch (err) {
      addNotification({ type: 'error', title: 'Failed to update', message: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const fileName = `news/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('cms-images').upload(fileName, file)
    if (!error) { const { data: { publicUrl } } = supabase.storage.from('cms-images').getPublicUrl(fileName); setEditing({ ...editing!, image_url: publicUrl }) }
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{editing.id ? 'Edit' : 'New'} News</h1>
          <button onClick={() => setEditing(null)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-3xl">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#13275c] focus:border-transparent" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={editing.category || 'general'} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option value="general">General</option><option value="academic">Academic</option><option value="sports">Sports</option><option value="events">Events</option><option value="announcements">Announcements</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Image</label><input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#13275c] file:text-white file:text-sm file:cursor-pointer" /></div>
            </div>
            {editing.image_url && <img src={editing.image_url} alt="" className="w-40 h-24 object-cover rounded-lg" />}
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Summary</label><textarea value={editing.summary || ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#13275c] focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><textarea value={editing.content || ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={8} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#13275c] focus:border-transparent" /></div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2"><input type="checkbox" checked={editing.is_published || false} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} className="rounded" /><span className="text-sm text-gray-700">Published</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={editing.is_featured || false} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} className="rounded" /><span className="text-sm text-gray-700">Featured</span></label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={save} disabled={saving} className="px-5 py-2.5 bg-[#13275c] text-white rounded-lg text-sm font-medium hover:bg-[#1a3570] disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setEditing(null)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">News</h1>
        <button onClick={() => setEditing({ ...empty })} className="px-4 py-2 bg-[#13275c] text-white rounded-lg text-sm font-medium hover:bg-[#1a3570]">+ New</button>
      </div>
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#13275c]/30 border-t-[#13275c] rounded-full animate-spin" /></div>
      : items.length === 0 ? <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">No news yet.</div>
      : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">Title</th><th className="text-left px-4 py-3 font-medium text-gray-600">Status</th><th className="text-left px-4 py-3 font-medium text-gray-600">Date</th><th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th></tr></thead>
            <tbody>
              {items.map((n) => (
                <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-800">{n.title}</td>
                  <td className="px-4 py-3"><button onClick={() => togglePublish(n)} className={`px-3 py-1 rounded-full text-xs font-medium ${n.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{n.is_published ? 'Published' : 'Draft'}</button></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(n.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right space-x-2"><button onClick={() => setEditing(n)} className="text-[#13275c] hover:underline text-xs font-medium">Edit</button><button onClick={() => remove(n.id)} className="text-red-500 hover:underline text-xs font-medium">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
